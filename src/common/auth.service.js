import ApiService from "@/common/api.service";
import { TokenService } from "@/common/token.service.ts";
import axios from "axios";
import * as qs from "qs";

class AuthenticationError extends Error {
    errorCode;
    constructor(errorCode, message) {
        super(message);
        this.name = this.constructor.name;
        if (message != null) {
            this.message = message;
        }
        this.errorCode = errorCode;
    }
}

const AuthStatus = {
    SIGNED_IN: "signed_in", SIGNED_OUT: "signed_out"
}

class _AuthService {

    constructor() {
        this.code = "EKveChUBUhNlKqIvnR8zeKAgOhCdGD";
        this.status = AuthStatus.SIGNED_OUT;
        if (TokenService.getToken() !== null) {
            this.status = AuthStatus.SIGNED_IN;
        }
        this.clientId = '0L5puPQdSfLS2X7tb1zglMVDjYUWKJJB9shTqCtQ';
        this.clientSecret = 'UOd71y6ncUdpKyPXFnr4DT6HDodXiWVI3QbvmLdQKuPol0hFPKHR7BEVLqI3oFhBg0PuYU7YPHFt08CFqlfxLxtehdNqsTs2Fn52nofus8aw4d1Y3FVc841PwWewSbnt';
        this.accessTokenUri = 'http://localhost:8000/user/oauth/token/';
        this.authorizationUri = 'http://localhost:8000/user/oauth/authorize/';
        this.redirectUri = 'https://localhost:8000/auth/callback/';
        this.scopes = ['read', 'write', 'members:read', 'activemembers:read'];
    }

    authorize() {
        const redirect_url = new URL(this.authorizationUri);
        redirect_url.searchParams.append("client_id", this.clientId);
        redirect_url.searchParams.append("response_type", "code");
        window.location.href = redirect_url.href;
    }

    callback() {

    }

    async signIn(username, password) {
        const requestData = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
            },
            url: "http://localhost:8000/api/v1/token-auth/",
            data: JSON.stringify({"username": username, "password": password}),
        };

        try {
            const response = await axios(requestData);
            console.log(response.data);
            TokenService.setToken(response.data.access_token);
            //TokenService.setRefreshToken(response.data.refresh_token);

            //return response.data.access_token;
        } catch (error) {
            this.catchError(error);
        }
    }

    requestAuthorizationToken() {
        const requestData = {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            url: this.accessTokenUri,
            data: qs.stringify({
                "grant_type": "authorization_code",
                "code": this.code,
                "client_id": this.clientId,
            }),
        }

        try {
            const response = axios(requestData);

            console.log(response.data);

            return response.data.access_token;
        } catch (error) {
            throw new AuthenticationError(
                error.response.status,
                error.response.data.error_description
            );
        }
    }

    async refreshTokens() {
        const refreshToken = TokenService.getRefreshToken();

        const requestData = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            url: this.accessTokenUri,
            data: JSON.stringify({
                "grant_type": "refresh_token",
                refreshToken: refreshToken
            })
        };

        try {
            const response = await ApiService.customRequest(requestData);

            TokenService.setToken(response.data.access_token);
            TokenService.setRefreshToken(response.data.refresh_token);

            return response.data.access_token;
        } catch (error) {
            throw new AuthenticationError(
                error.response.status,
                error.response.data.error_description
            );
        }
    }

    signOut() {
        TokenService.removeToken();
        TokenService.removeRefreshToken();
    }

    catchError(error) {
        let status;
        let description;

        if (error.response === undefined) {
            status = error.message;
            description = error.message;
        } else {
            status = error.response.status;
            description = error.response.data.error_description;
        }

        throw new AuthenticationError(status, description);
    }
}

const AuthService = new _AuthService();

export { AuthService, AuthenticationError, AuthStatus };