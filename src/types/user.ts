export interface IUser {
  name: string;
  nickname: string;
  phoneNumber: string;
  loginId: string;
  password: string;
  email: string;
}

export interface ILogin {
  loginId : string;
  password : string;
}

export interface IAddCart{
  id : number;
  amount : number;
}