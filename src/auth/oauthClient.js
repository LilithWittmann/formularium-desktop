import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  GRANT_TYPE_AUTHORIZATION_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  TokenRequest
} from "@openid/appauth";
import {
  NodeBasedHandler,
  NodeCrypto,
  NodeRequestor
} from "@openid/appauth/built/node_support";
const keytar = require("keytar");

class OauthClient {
  async setupBackend(url, clientID) {
    this.clientID = clientID;
    var that = this;
    return AuthorizationServiceConfiguration.fetchFromIssuer(
      url,
      this.requestor
    )
      .then(response => {
        console.log("Fetched service configuration", response);
        that.configuration = response;
      })
      .catch(error => {
        console.log("Something bad happened", error);
      });
  }

  async requestToken() {
    // set notifier to deliver responses
    this.authorizationHandler.setAuthorizationNotifier(this.notifier);
    // set a listener to listen for authorization responses
    // make refresh and access token requests.
    this.notifier.setAuthorizationListener((request, response, error) => {
      console.log("Authorization request complete ", request, response, error);
      if (response) {
        let codeVerifier = undefined;
        if (request.internal && request.internal.code_verifier) {
          codeVerifier = request.internal.code_verifier;
        }

        this.makeRefreshTokenRequest(response.code, codeVerifier).then(() => {
          console.log("All Done.");
        });
      }
    });

    // create a request
    let request = new AuthorizationRequest(
      {
        client_id: this.clientID,
        redirect_uri: this.redirectUri,
        scope: "administrative-staff",
        response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
        state: Math.random().toString(36),
        extras: { prompt: "consent", access_type: "offline" }
      },
      new NodeCrypto()
    );

    // make the authorization request
    return this.authorizationHandler.performAuthorizationRequest(
      this.configuration,
      request
    );
  }

  constructor() {
    this.notifier = new AuthorizationNotifier();
    this.requestor = new NodeRequestor();
    this.tokenHandler = new BaseTokenRequestHandler(this.requestor);
    this.authorizationHandler = new NodeBasedHandler();
    this.redirectUri = "http://127.0.0.1:8000";
  }

  makeRefreshTokenRequest(code, codeVerifier) {
    console.log("refresh token");
    if (!this.configuration) {
      console.log("Unknown service configuration");
      return Promise.resolve();
    }

    let extras = {};
    if (codeVerifier) {
      extras.code_verifier = codeVerifier;
    }

    // use the code to make the token request.
    let request = new TokenRequest({
      client_id: this.clientID,
      redirect_uri: this.redirectUri,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code: code,
      refresh_token: undefined,
      extras: extras
    });

    return this.tokenHandler
      .performTokenRequest(this.configuration, request)
      .then(response => {
        console.log(`Refresh Token is ${response.refreshToken}`);
        this.refreshToken = response.refreshToken;
        keytar.setPassword(
          "formularium",
          "refreshToken",
          response.refreshToken
        );
        this.accessTokenResponse = response;
        return response;
      })
      .catch(error => {
        console.log("Something bad happened", error);
        console.log(error);
      });
  }

  preloadBindings() {
    var that = this;
    return {
      requestAuthToken(redirectURI) {
        return that.requestToken(redirectURI);
      },
      setupAuthBackend(url, clientID) {
        that.setupBackend(url, clientID);
      }
    };
  }

  async performWithFreshTokens() {
    if (!this.configuration) {
      console.log("Unknown service configuration");
      return Promise.reject("Unknown service configuration");
    }
    if (!this.refreshToken) {
      console.log("Missing refreshToken.");
      return Promise.resolve("Missing refreshToken.");
    }

    let request = new TokenRequest({
      client_id: this.clientID,
      redirect_uri: this.redirectUri,
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      code: undefined,
      refresh_token: this.refreshToken,
      extras: undefined
    });

    return this.tokenHandler
      .performTokenRequest(this.configuration, request)
      .then(response => {
        keytar.setPassword(
          "formularium",
          "refreshToken",
          response.refreshToken
        );
        this.accessTokenResponse = response;
        return response;
      });
  }
}

export default OauthClient;
