import type { AuthTokens } from "../types/auth";

const AUTH_CONFIG = {
    clientId: 'wallet-app',
    clientSecret: 'secret',
    authorizationEndpoint: 'http://localhost:8080/oauth2/authorize',
    tokenEnpoint: 'http://localhost:8080/oauth2/token',
    redirectUri: 'http://localhost:5173/callback',
    scope: 'openid profile read write',
};

export const authService = {
    //
    login() {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: AUTH_CONFIG.clientId,
            redirect_uri: AUTH_CONFIG.redirectUri,
            scope: AUTH_CONFIG.scope,
        });

        window.location.href = `${AUTH_CONFIG.authorizationEndpoint}?${params}`;

    },

    //

    async exchangeCodeForToken(code: string): Promise<AuthTokens> {
        const credentials = btoa(`${AUTH_CONFIG.clientId}:${AUTH_CONFIG.clientSecret}`);

        const response = await fetch(AUTH_CONFIG.tokenEnpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: AUTH_CONFIG.redirectUri,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }
        return response.json();
    },

    saveTokens(tokens: AuthTokens) {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('expires_in', String(Date.now() + tokens.expires_in * 1000))
    },

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    },

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const expiresAt = localStorage.getItem('expires_in');

        if (!token || !expiresAt) return false;

        return Date.now() < parseInt(expiresAt);
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
    },


}