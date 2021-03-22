import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  NoCredentialsError,
  OAuthCredentials,
  TokenExpiredError
} from "@/common/token.service";
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

  async getToken(): Promise<string | null> {
    try {
      return OAuthCredentials.getAccessToken();
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return await this.refreshTokens().then(() => {
          return OAuthCredentials._getAccessToken();
        });
      } else if (e instanceof NoCredentialsError) {
        throw e;
      } else {
        throw e;
      }
    }
  }

  async loggedIn(): Promise<boolean> {
    return (await this.getToken()) !== null;
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

  async get<T>(resource: string): Promise<AxiosResponse<T>> {
    return axios.get(`${this.baseUri}/api/v2${resource}`, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async post<T>(resource: string, data: object): Promise<AxiosResponse<T>> {
    return axios.post(`${this.baseUri}/api/v2${resource}`, data, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async put<T>(resource: string, data: object): Promise<AxiosResponse<T>> {
    return axios.put(`${this.baseUri}/api/v2${resource}`, data, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  async delete<T>(resource: string): Promise<AxiosResponse<T>> {
    return axios.delete(`${this.baseUri}/api/v2${resource}`, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
  }

  customRequest<T>(data: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.request(data);
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
