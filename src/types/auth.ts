export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface User{
    username: string;
    name: string;
    lastname: string;
    authorities: string[];
}

export interface CreateUser{
    username: string;
    password: string;
    name: string;
    lastname: string;
}

export interface Transaction{
    senderUsername: string;
    senderName: string;
    receiverUsername: string;
    receiverName: string;
    value: number;
    createdAt: string;
}