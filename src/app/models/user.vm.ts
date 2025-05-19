export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse extends IUser {}
export interface ISignUpRequest {
  email: string ;
  password: string;
  name: string;
  role: string;
}

export interface ISignUpResponse extends IUser {}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
