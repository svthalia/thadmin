import { OAuthCredentials } from "@/common/token.service.ts";
import axios from "axios";
import * as qs from "qs";

const ACCESS_TOKEN_URI = "http://localhost:8000/user/oauth/token/";
const CLIENT_ID = "0L5puPQdSfLS2X7tb1zglMVDjYUWKJJB9shTqCtQ";
const CLIENT_SECRET =
  "UOd71y6ncUdpKyPXFnr4DT6HDodXiWVI3QbvmLdQKuPol0hFPKHR7BEVLqI3oFhBg0PuYU7YPHFt08CFqlfxLxtehdNqsTs2Fn52nofus8aw4d1Y3FVc841PwWewSbnt";
const AUTHORIZATION_URI = "http://localhost:8000/user/oauth/authorize/";
const REDIRECT_URI = "https://localhost:8080/auth/callback/";

interface OAuthAuthorizeData {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _AuthService {
  authorizationUri: string;
  clientId: string;
  clientSecret: string;
  accessTokenUri: string;
  redirectUri: string;

  constructor(
    clientId: string,
    clientSecret: string,
    accessTokenUri: string,
    authorizationUri: string,
    redirectUri: string
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessTokenUri = accessTokenUri;
    this.authorizationUri = authorizationUri;
    this.redirectUri = redirectUri;
  }

  loggedIn() {
    return OAuthCredentials.getAccessToken() !== null;
  }

  logOut() {
    OAuthCredentials.removeToken();
    OAuthCredentials.store();
  }

  authorize() {
    const redirectURL = new URL(this.authorizationUri);
    redirectURL.searchParams.append("client_id", this.clientId);
    redirectURL.searchParams.append("response_type", "code");
    window.location.href = redirectURL.href;
  }

  async requestAuthorizationToken(code: string): Promise<void> {
    const response = await axios.request<OAuthAuthorizeData>({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: this.accessTokenUri,
      data: qs.stringify({
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: "authorization_code",
        code: code,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: this.clientId
      })
    });
    OAuthCredentials.set(
      response.data.access_token,
      Date.now() + response.data.expires_in,
      response.data.token_type,
      response.data.scope.split(" "),
      response.data.refresh_token
    );
    OAuthCredentials.store();
  }
  /*
  async refreshTokens() {
    const refreshToken = TokenService.getRefreshToken();

    const requestData = {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      url: this.accessTokenUri,
      data: JSON.stringify({
        grant_type: "refresh_token",
        refreshToken: refreshToken
      })
    };

    try {
      const response = await ApiService.customRequest(requestData);

      TokenService.setToken(response.data.access_token);
      TokenService.setRefreshToken(response.data.refresh_token);

      return response.data.access_token;
    } catch (error) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.error_description
      );
    }
  }*/

  signOut() {
    OAuthCredentials.removeToken();
    OAuthCredentials.store();
  }
}

const AuthService = new _AuthService(
  CLIENT_ID,
  CLIENT_SECRET,
  ACCESS_TOKEN_URI,
  AUTHORIZATION_URI,
  REDIRECT_URI
);

export { AuthService };
