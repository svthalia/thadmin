import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

const TOKEN_KEY = "credentials";
const OAUTH_STATE_KEY = "oauth_state";

const savedCredentials = localStorage.getItem(TOKEN_KEY);
const savedStateKey = localStorage.getItem(OAUTH_STATE_KEY);

interface Credentials {
  accessToken: string;
  expires: number;
  tokenType: string;
  scope: string[];
}

@Module({ namespaced: true })
class UserModule extends VuexModule {
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
      return true;
    } else {
      return Date.now() >= this.credentials.expires;
    }
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
    stateKey: string | null,
    accessToken: string,
    expires: number,
    tokenType: string,
    scope: string[]
  ): boolean {
    if (stateKey === null || this.stateKey === stateKey) {
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

export default UserModule;
