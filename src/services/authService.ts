import type { AuthTokens } from "../types/auth";
const AUTH_CONFIG = {
    clientId: 'wallet-app',
    authorizationEndpoint: 'http://localhost:8080/oauth2/authorize',
    tokenEndpoint: 'http://localhost:8080/oauth2/token',
    redirectUri: 'http://localhost:5173/callback',
    scope: 'openid profile read write',
};

// Gera string aleatória segura
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
        .map(v => charset[v % charset.length])
        .join('');
}

// Gera SHA256 hash e converte para base64url
async function sha256(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    
    // Converte para base64url
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export const authService = {
    async login() {
        // 1. Gerar code_verifier
        const codeVerifier = generateRandomString(128);
        sessionStorage.setItem('code_verifier', codeVerifier);
        
        // 2. Gerar code_challenge
        const codeChallenge = await sha256(codeVerifier);
        
        // 3. Construir URL com PKCE
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: AUTH_CONFIG.clientId,
            redirect_uri: AUTH_CONFIG.redirectUri,
            scope: AUTH_CONFIG.scope,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        });

        const fullUrl = `${AUTH_CONFIG.authorizationEndpoint}?${params}`;
        
        window.location.href = fullUrl;
    },

    async exchangeCodeForToken(code: string): Promise<AuthTokens> {
        const codeVerifier = sessionStorage.getItem('code_verifier');
        if (!codeVerifier) {
            throw new Error('Code verifier not found');
        }

        const response = await fetch(AUTH_CONFIG.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // SEM Authorization header - não precisa mais
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: AUTH_CONFIG.redirectUri,
                client_id: AUTH_CONFIG.clientId,
                code_verifier: codeVerifier, // ← Envia o verifier
            }),
        });

        // Limpar code_verifier usado
        sessionStorage.removeItem('code_verifier');

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to exchange code: ${error}`);
        }
        
        return response.json();
    },

    saveTokens(tokens: AuthTokens) {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('expires_in', String(Date.now() + tokens.expires_in * 1000));
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
        sessionStorage.removeItem('code_verifier');
    },
};