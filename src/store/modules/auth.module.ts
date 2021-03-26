import { Credentials, NoCredentialsError } from "@/common/token.service";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

const TOKEN_KEY = "credentials";
const OAUTH_STATE_KEY = "oauth_state";

const savedCredentials = localStorage.getItem(TOKEN_KEY);
const savedStateKey = localStorage.getItem(OAUTH_STATE_KEY);

@Module({ namespaced: true })
class AuthModule extends VuexModule {
  private credentials: Credentials | null = savedCredentials
    ? JSON.parse(savedCredentials)
    : null;
  public stateKey: string | null = savedStateKey
    ? JSON.parse(savedStateKey)
    : null;

  get accessToken(): string | null {
    if (this.credentials === null || this.credentials.expires < Date.now()) {
      return null;
    } else {
      return this.credentials.accessToken;
    }
  }

  get isLoggedIn(): boolean {
    return this.accessToken !== null;
  }

  get expired(): boolean {
    if (this.credentials === null) {
      throw new NoCredentialsError();
    } else {
      return Date.now() >= this.credentials.expires;
    }
  }

  get authorizeRedirectURL(): string {
    const redirectURL = new URL("http://localhost:8000/user/oauth/authorize/");
    redirectURL.searchParams.append(
      "client_id",
      "0L5puPQdSfLS2X7tb1zglMVDjYUWKJJB9shTqCtQ"
    );
    redirectURL.searchParams.append("response_type", "token");
    if (this.stateKey !== null) {
      redirectURL.searchParams.append("state", this.stateKey);
    }
    return redirectURL.href;
  }

  @Action
  newRandomState() {
    this.context.commit(
      "setState",
      Math.random()
        .toString()
        .substr(2, 8)
    );
  }

  @Mutation
  setState(state: string) {
    this.stateKey = state;
  }

  @Mutation
  removeState() {
    this.stateKey = null;
  }

  @Mutation
  removeCredentials() {
    this.credentials = null;
  }

  @Action
  store(): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(this.credentials));
    localStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(this.stateKey));
  }

  @Action
  logout() {
    this.context.commit("removeCredentials");
    return this.context.dispatch("store");
  }

  @Action
  login(
    stateKey: string,
    accessToken: string,
    expires: number,
    tokenType: string,
    scope: string[]
  ): boolean {
    console.log(this.stateKey);
    console.log(stateKey);
    if (this.stateKey === stateKey) {
      this.context.commit("setCredentials", {
        accessToken,
        expires,
        tokenType,
        scope
      });
      return true;
    } else {
      return false;
    }
  }

  @Mutation
  public setCredentials(
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
}

export default AuthModule;
