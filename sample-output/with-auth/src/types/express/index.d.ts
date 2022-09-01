import { IUser } from "@models/user-model";


declare module 'express' {
  export interface Request  {
    signedCookies: Record<string, string>,
    body: {
      user?: IUser
      email?: string;
      password?: string;
    };
  }
}

// Put this back in the future for middleware stuff
// declare global {
//   namespace Express {
//     export interface Response {
//         sessionUser: IClientData;
//     }
//   }
// }
