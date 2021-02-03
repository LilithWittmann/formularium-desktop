import OauthClient from "./oauthClient";

const keytar = require("keytar");

class AuthHandler {
  constructor() {
    this.oautclient = new OauthClient();
  }

  async setup(clientURI, apiURI, clientID) {
    // initial setup as an oauth client
    keytar.setPassword("formularium", "clientURI", clientURI);
    keytar.setPassword("formularium", "apiURL", apiURI);
    keytar.setPassword("formularium", "clientID", clientID);
    var that = this;
    return this.oautclient.setupBackend(clientURI, clientID).then(() => {
      return that.oautclient.requestToken().then(response => {
        keytar.setPassword(
          "formularium",
          "configuration",
          JSON.stringify(that.oautclient.configuration)
        );
        return response;
      });
    });
  }

  async refreshToken() {
    // fetch a new refreshToken
    var that = this;
    return Promise.all([
      keytar.getPassword("formularium", "clientURI"),
      keytar.getPassword("formularium", "clientID"),
      keytar.getPassword("formularium", "refreshToken"),
      keytar.getPassword("formularium", "configuration")
    ]).then(values => {
      that.oautclient.refreshToken = values[2];
      that.oautclient.clientID = values[1];
      that.oautclient.configuration = JSON.parse(values[3]);

      return that.oautclient.performWithFreshTokens().then(result => {
        return result;
      });
    });
  }

  async APIUrl() {
    return keytar.getPassword("formularium", "apiURL");
  }

  preloadBindings() {
    var that = this;
    return {
      async setupOauth(authURL, apiURL, clientID) {
        return that.setup(authURL, apiURL, clientID);
      },
      async getToken() {
        return that.refreshToken();
      },
      async getAPIURL() {
        return that.APIUrl();
      },
      async setupDone() {
        return that.APIUrl().then(values => {
          return values !== null;
        });
      }
    };
  }
}

export default AuthHandler;
