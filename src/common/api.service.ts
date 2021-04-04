import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { OAuthCredentials } from "@/common/token.service";
import getEnvVar from "@/util/env";

interface OAuthAuthorizeData {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _ApiService {
  authorizationEndpoint: string;
  baseUri: string;
  clientId: string;
  redirectUri: string;

  constructor(
    clientId: string,
    baseUri: string,
    authorizationEndpoint: string,
    redirectUri: string
  ) {
    this.clientId = clientId;
    this.baseUri = baseUri;
    this.authorizationEndpoint = authorizationEndpoint;
    this.redirectUri = redirectUri;
  }

  getAuthorizationUri(): string {
    return `${this.baseUri}${this.authorizationEndpoint}`;
  }

  getToken(): string {
    return OAuthCredentials.getAccessToken();
  }

  loggedIn() {
    try {
      return this.getToken() !== null;
    } catch {
      return false;
    }
  }

  logOut() {
    OAuthCredentials.removeToken();
    OAuthCredentials.store();
  }

  getAuthorizeRedirectURL(): string {
    const redirectURL = new URL(this.getAuthorizationUri());
    redirectURL.searchParams.append("client_id", this.clientId);
    redirectURL.searchParams.append("response_type", "token");
    redirectURL.searchParams.append("state", OAuthCredentials.newRandomState());
    return redirectURL.href;
  }

  setAccessToken(
    state: string,
    accessToken: string,
    expires: number,
    tokenType: string,
    scope: string[]
  ): boolean {
    if (state === OAuthCredentials.getState()) {
      OAuthCredentials.set(accessToken, Date.now() + expires, tokenType, scope);
      OAuthCredentials.store();
      return true;
    } else {
      return false;
    }
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
  getEnvVar("VUE_APP_API_OAUTH_CLIENT_ID"),
  getEnvVar("VUE_APP_API_BASE_URI"),
  getEnvVar("VUE_APP_API_AUTHORIZATION_ENDPOINT"),
  getEnvVar("VUE_APP_API_OAUTH_REDIRECT_URI")
);

export default ApiService;
