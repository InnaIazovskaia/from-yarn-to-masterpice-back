export interface UserCredentials {
  username: string;
  password: string;
}

export interface TokenPayload {
  username: string;
  id: string;
}

export interface UserRegisterCredentials extends UserCredentials {
  email: string;
}
