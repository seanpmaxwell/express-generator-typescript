import { Response } from 'supertest';
import { IUser } from '@entities/User';



export interface IResponse extends Response {
    body: {
        users: IUser[];
        error: string;
        senderName: string;
    };
}


export interface IReqBody {
    user?: IUser;
    email?: string;
    password?: string;
    socketId?: string;
    message?: string;
}
