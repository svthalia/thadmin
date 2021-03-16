const OAUTH_TOKEN_KEY = "oauth_token";

interface Credentials {
  accessToken: string;
  expires: number;
  tokenType: string;
  scope: string[];
  refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _OAuthCredentials {
  private credentials: Credentials | null;

  constructor(credentials: Credentials | null) {
    this.credentials = credentials;
  }

  getAccessToken(): string | null {
    if (this.credentials === null || Date.now() >= this.credentials.expires) {
      return null;
    } else {
      return this.credentials.accessToken;
    }
  }

  getRefreshToken(): string | null {
    if (this.credentials === null) {
      return null;
    } else {
      return this.credentials.refreshToken;
    }
  }

  expired(): boolean {
    if (this.credentials === null) {
      return true;
    } else {
      return Date.now() >= this.credentials.expires;
    }
  }

  removeToken(): void {
    this.credentials = null;
  }

  store(): void {
    localStorage.setItem(OAUTH_TOKEN_KEY, JSON.stringify(this.credentials));
  }

  set(
    accessToken: string,
    expires: number,
    tokenType: string,
    scope: string[],
    refreshToken: string
  ) {
    this.credentials = {
      accessToken: accessToken,
      expires: expires,
      tokenType: tokenType,
      scope: scope,
      refreshToken: refreshToken
    };
  }

  static retrieve(): _OAuthCredentials {
    const jsonRetrieved: string | null = localStorage.getItem(OAUTH_TOKEN_KEY);
    if (jsonRetrieved === null) {
      return new _OAuthCredentials(null);
    }
    try {
      const oauthCredentials: Credentials = JSON.parse(jsonRetrieved);
      return new _OAuthCredentials(oauthCredentials);
    } catch (error) {
      return new _OAuthCredentials(null);
    }
  }
}

const OAuthCredentials: _OAuthCredentials = _OAuthCredentials.retrieve();

export { OAuthCredentials };
