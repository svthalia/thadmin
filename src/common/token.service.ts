const OAUTH_TOKEN_KEY = "oauth_token";
const STATE_KEY = "state";

interface Credentials {
  accessToken: string;
  expires: number;
  tokenType: string;
  scope: string[];
}

class TokenExpiredError extends Error {}
class NoCredentialsError extends Error {}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _OAuthCredentials {
  private credentials: Credentials | null;

  constructor(credentials: Credentials | null) {
    this.credentials = credentials;
  }

  _getAccessToken(): string | null {
    if (this.credentials === null) {
      return null;
    } else {
      return this.credentials.accessToken;
    }
  }

  hasValidAccessToken(): boolean {
    try {
      this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }

  getAccessToken(): string {
    if (this.credentials === null) {
      throw new NoCredentialsError();
    } else if (this.credentials.expires < Date.now()) {
      throw new TokenExpiredError();
    } else {
      return this.credentials.accessToken;
    }
  }

  newRandomState(): string {
    const rand = Math.random()
      .toString()
      .substr(2, 8);
    window.localStorage.setItem(STATE_KEY, rand);
    return rand;
  }

  getState(): string | null {
    return window.localStorage.getItem(STATE_KEY);
  }

  removeState(): void {
    window.localStorage.removeItem(STATE_KEY);
  }

  expired(): boolean {
    if (this.credentials === null) {
      throw new NoCredentialsError();
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
    scope: string[]
  ) {
    this.credentials = {
      accessToken: accessToken,
      expires: expires,
      tokenType: tokenType,
      scope: scope
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

export { OAuthCredentials, TokenExpiredError, NoCredentialsError, Credentials };
