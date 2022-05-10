import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";
import Credentials from "@/models/credentials.model";
class _ApiService {
  authorizationEndpoint: string;
  accessTokenEndpoint: string;
  baseUri: string;
  clientId: string;
  redirectUri: string;

  constructor(
    clientId: string,
    baseUri: string,
    authorizationEndpoint: string,
    accessTokenEndpoint: string,
    redirectUri: string
  ) {
    this.clientId = clientId;
    this.baseUri = baseUri;
    this.authorizationEndpoint = authorizationEndpoint;
    this.accessTokenEndpoint = accessTokenEndpoint;
    this.redirectUri = redirectUri;
  }

  getAuthorizationUri(): string {
    return `${this.baseUri}${this.authorizationEndpoint}`;
  }

  getAccesstokenUri(): string {
    return `${this.baseUri}${this.accessTokenEndpoint}`;
  }

  getAuthorizeRedirectURL(
    state: null | string,
    codeChallenge: null | string,
    isSHA256Challenge = false
  ): string {
    const authURL = new URL(this.getAuthorizationUri());
    authURL.searchParams.append(
      "scope",
      "profile:read sales:admin payments:admin"
    );
    authURL.searchParams.append("client_id", this.clientId);
    authURL.searchParams.append("redirect_uri", this.redirectUri);
    authURL.searchParams.append("response_type", "code");
    if (state !== null) {
      authURL.searchParams.append("state", store.state.User.stateKey);
    }
    if (codeChallenge !== null) {
      authURL.searchParams.append("code_challenge", codeChallenge);
      if (isSHA256Challenge) {
        authURL.searchParams.append("code_challenge_method", "S256");
      } else {
        authURL.searchParams.append("code_challenge_method", "plain");
      }
    }
    return authURL.href;
  }

  async getAccessTokenFromAuthorizationCode(
    code: string
  ): Promise<AxiosResponse<Credentials>> {
    const data: FormData = new FormData();
    data.append("grant_type", "authorization_code");
    data.append("client_id", this.clientId);
    data.append("code", code);
    data.append("redirect_uri", this.redirectUri);
    if (store.state.User.challenge !== null) {
      data.append("code_verifier", store.state.User.challenge);
    }
    return axios.postForm<Credentials>(this.getAccesstokenUri(), data);
  }

  async getAccessTokenFromRefreshToken(
    refreshToken: string
  ): Promise<AxiosResponse<Credentials>> {
    const data: FormData = new FormData();
    data.append("grant_type", "refresh_token");
    data.append("client_id", this.clientId);
    data.append("refresh_token", refreshToken);
    return axios.postForm<Credentials>(this.getAccesstokenUri(), data);
  }

  async get<T>(resource: string): Promise<AxiosResponse<T>> {
    return axios.get(`${this.baseUri}/api/v2${resource}`, {
      headers: {
        Authorization: `Bearer ${store.getters["User/accessToken"]}`,
      },
    });
  }

  async post<T>(resource: string, data: object): Promise<AxiosResponse<T>> {
    return axios.post(`${this.baseUri}/api/v2${resource}`, data, {
      headers: {
        Authorization: `Bearer ${store.getters["User/accessToken"]}`,
      },
    });
  }

  async put<T>(resource: string, data: object): Promise<AxiosResponse<T>> {
    return axios.put(`${this.baseUri}/api/v2${resource}`, data, {
      headers: {
        Authorization: `Bearer ${store.getters["User/accessToken"]}`,
      },
    });
  }

  async patch<T>(resource: string, data: object): Promise<AxiosResponse<T>> {
    return axios.patch(`${this.baseUri}/api/v2${resource}`, data, {
      headers: {
        Authorization: `Bearer ${store.getters["User/accessToken"]}`,
      },
    });
  }

  async delete<T>(resource: string): Promise<AxiosResponse<T>> {
    return axios.delete(`${this.baseUri}/api/v2${resource}`, {
      headers: {
        Authorization: `Bearer ${store.getters["User/accessToken"]}`,
      },
    });
  }

  customRequest<T>(data: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.request(data);
  }
}

const ApiService = new _ApiService(
  process.env.VUE_APP_API_OAUTH_CLIENT_ID,
  process.env.VUE_APP_API_BASE_URI,
  process.env.VUE_APP_API_AUTHORIZATION_ENDPOINT,
  process.env.VUE_APP_API_ACCESS_TOKEN_ENDPOINT,
  process.env.VUE_APP_API_OAUTH_REDIRECT_URI
);

export default ApiService;
