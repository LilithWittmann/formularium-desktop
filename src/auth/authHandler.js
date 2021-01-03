import OauthClient from "./oauthClient";

const keytar = require("keytar");

class AuthHandler {
  constructor() {
    this.oautclient = new OauthClient();
  }

  async setup(clientURI, clientID) {
    // initial setup as an oauth client
    keytar.setPassword("formularium", "clientURI", clientURI);
    keytar.setPassword("formularium", "clientID", clientID);
    var that = this;
    return this.oautclient.setupBackend(clientURI, clientID).then(() => {
      console.log("allla");
      return that.oautclient.requestToken().then(response => {
        keytar.setPassword(
          "formularium",
          "configuration",
          JSON.stringify(that.oautclient.configuration)
        );
        console.log("all all");
        return response;
      });
    });
  }

  async refreshToken() {
    // fetch a new refreshToken
    var that = this;
    Promise.all([
      keytar.getPassword("formularium", "clientURI"),
      keytar.getPassword("formularium", "clientID"),
      keytar.getPassword("formularium", "refreshToken"),
      keytar.getPassword("formularium", "configuration")
    ]).then(values => {
      console.log(values);
      that.oautclient.refreshToken = values[2];
      that.oautclient.clientID = values[1];
      that.oautclient.configuration = JSON.parse(values[3]);

      return that.oautclient.performWithFreshTokens().then(result => {
        console.log(that.oautclient.accessTokenResponse);
        return result;
      });
    });
  }

  preloadBindings(ipcRenderer) {
    console.log(ipcRenderer);
    var that = this;
    return {
      setupOauth(clientURI, clientID) {
        return that.setup(clientURI, clientID);
      },
      getToken() {
        return that.refreshToken();
      }
    };
  }
}

export default AuthHandler;
