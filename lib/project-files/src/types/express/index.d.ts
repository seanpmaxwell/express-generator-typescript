import { IUser } from "@models/user-model";


declare module 'express' {
  export interface Request  {
    body: {
      user?: IUser
      email?: string;
    };
  }
}

