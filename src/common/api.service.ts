import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";

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

  getAuthorizeRedirectURL(): string {
    const authURL = new URL(this.getAuthorizationUri());
    authURL.searchParams.append(
      "scope",
      "profile:read sales:admin payments:admin"
    );
    authURL.searchParams.append("client_id", this.clientId);
    authURL.searchParams.append("redirect_uri", this.redirectUri);
    authURL.searchParams.append("response_type", "token");
    if (store.state.User.stateKey !== null) {
      authURL.searchParams.append("state", store.state.User.stateKey);
    }
    return authURL.href;
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
  process.env.VUE_APP_API_OAUTH_REDIRECT_URI
);

export default ApiService;
