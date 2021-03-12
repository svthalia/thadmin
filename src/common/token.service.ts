const OAUTH_TOKEN_KEY = "oauth_token";
const ACCESS_TOKEN_NAME = "access_token";
const EXPIRES_NAME = "expires";
const TOKEN_TYPE_NAME = "token_type";
const SCOPE_NAME = "scope";
const REFRESH_TOKEN_NAME = "refresh_token";

class CredentialsExpiredError extends Error {}

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _OAuthCredentials {
  private accessToken: string;
  private expires: bigint;
  private tokenType: string;
  private scope: string[];
  private refreshToken: string;

  constructor(
    accessToken: string,
    expires: bigint,
    tokenType: string,
    scope: string[],
    refreshToken: string
  ) {
    this.accessToken = accessToken;
    this.expires = expires;
    this.tokenType = tokenType;
    this.scope = scope;
    this.refreshToken = refreshToken;
  }

  getToken(): string | undefined {
    if (this.accessToken !== null && this.expires != null) {
      if (Date.now() < this.expires) {
        return this.accessToken;
      } else {
        throw new CredentialsExpiredError("Credentials expired");
      }
    }
  }

  store() {
    localStorage.setItem(OAUTH_TOKEN_KEY, JSON.stringify(this.serialize()));
  }

  serialize(): object {
    return {
      ACCESS_TOKEN_NAME: this.accessToken,
      EXPIRES_NAME: this.expires,
      TOKEN_TYPE_NAME: this.tokenType,
      SCOPE_NAME: this.scope,
      REFRESH_TOKEN_NAME: this.refreshToken
    };
  }

  static fromDict(dict: object) {
    return new _OAuthCredentials(
      dict[ACCESS_TOKEN_NAME],
      dict[EXPIRES_NAME],
      dict[TOKEN_TYPE_NAME],
      dict[SCOPE_NAME],
      dict[REFRESH_TOKEN_NAME]
    );
  }

  static retrieve() {
    try {
      const oauthCredentials = JSON.parse(
        localStorage.getItem(OAUTH_TOKEN_KEY)
      );
      return OAuthCredentials.from_dict(oauthCredentials);
    } catch (error) {
      return new OAuthCredentials(null, null, null, null, null);
    }
  }
}

const OAuthCredentials = _OAuthCredentials.retrieve();

export { OAuthCredentials };
