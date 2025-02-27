export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  id: string;
  name: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IUser {
  id: string;
  name: string;
}
