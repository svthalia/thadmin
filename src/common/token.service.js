const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

class _TokenService {

    constructor() {
        this.token = localStorage.getItem(TOKEN_KEY);
        this.refresh_token = TokenService.getItem(REFRESH_TOKEN_KEY);
    }

    getToken() {
        return this.token;
    }

    setToken(accessToken) {
        this.token = accessToken;
        localStorage.setItem(TOKEN_KEY, accessToken);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem(TOKEN_KEY);
    }

    getRefreshToken() {
        return this.refresh_token;
    }

    setRefreshToken(refreshToken) {
        this.refresh_token = refreshToken;
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    removeRefreshToken() {
        this.refresh_token = null;
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}

let TokenService = _TokenService();

export { TokenService };