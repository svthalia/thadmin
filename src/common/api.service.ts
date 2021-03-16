import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { OAuthCredentials } from "@/common/token.service";
import * as qs from "qs";

interface OAuthAuthorizeData {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

class AuthorizationError extends Error {}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _ApiService {
  authorizationEndpoint: string;
  baseUri: string;
  clientId: string;
  accessTokenEndpoint: string;
  redirectUri: string;

  constructor(
    clientId: string,
    baseUri: string,
    accessTokenEndpoint: string,
    authorizationEndpoint: string,
    redirectUri: string
  ) {
    this.clientId = clientId;
    this.baseUri = baseUri;
    this.accessTokenEndpoint = accessTokenEndpoint;
    this.authorizationEndpoint = authorizationEndpoint;
    this.redirectUri = redirectUri;
  }

  getAccessTokenUri(): string {
    return `${this.baseUri}${this.accessTokenEndpoint}`;
  }

  getAuthorizationUri(): string {
    return `${this.baseUri}${this.authorizationEndpoint}`;
  }

  async getToken(): Promise<string> {
    try {
      return this._getToken();
    } catch (e) {
      if (e instanceof AuthorizationError) {
        return await this.refreshTokens().then(() => {
          try {
            return this._getToken();
          } catch (e) {
            if (e instanceof AuthorizationError) {
              this.signOut();
              throw new AuthorizationError();
            } else {
              throw e;
            }
          }
        });
      } else {
        throw e;
      }
    }
  }

  _getToken(): string {
    const accessToken: string | null = OAuthCredentials.getAccessToken();
    if (accessToken !== null) {
      return accessToken;
    } else {
      throw new AuthorizationError();
    }
  }

  loggedIn() {
    return OAuthCredentials.getAccessToken() !== null;
  }

  logOut() {
    OAuthCredentials.removeToken();
    OAuthCredentials.store();
  }

  getAuthorizeRedirectURL(): string {
    const redirectURL = new URL(this.getAuthorizationUri());
    redirectURL.searchParams.append("client_id", this.clientId);
    redirectURL.searchParams.append("response_type", "code");
    return redirectURL.href;
  }

  async requestAuthorizationToken(code: string): Promise<void> {
    const response: AxiosResponse<OAuthAuthorizeData> = await axios.request({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: this.getAccessTokenUri(),
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

  async refreshTokens() {
    const refreshToken: string | null = OAuthCredentials.getRefreshToken();
    if (refreshToken === null) {
      throw new AuthorizationError();
    }
    const response: AxiosResponse<OAuthAuthorizeData> = await axios.request({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: this.getAccessTokenUri(),
      data: qs.stringify({
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: "refresh_token",
        // eslint-disable-next-line @typescript-eslint/camelcase
        refresh_token: refreshToken,
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

  signOut() {
    OAuthCredentials.removeToken();
    OAuthCredentials.store();
  }

  async get(resource: string) {
    return axios.get(resource, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async post(resource: string, data: object) {
    return axios.post(resource, data, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async put(resource: string, data: object) {
    return axios.put(resource, data, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async delete(resource: string) {
    return axios.delete(resource, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  customRequest(data: AxiosRequestConfig) {
    return axios(data);
  }
}

const ApiService = new _ApiService(
  process.env.VUE_APP_API_OAUTH_CLIENT_ID,
  process.env.VUE_APP_API_BASE_URI,
  process.env.VUE_APP_API_ACCESS_TOKEN_ENDPOINT,
  process.env.VUE_APP_API_AUTHORIZATION_ENDPOINT,
  process.env.VUE_APP_API_OAUTH_REDIRECT_URI
);

export default ApiService;
