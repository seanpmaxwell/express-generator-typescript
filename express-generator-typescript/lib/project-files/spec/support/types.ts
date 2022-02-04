import { Response } from 'supertest';
import { IUser } from 'src/models/User';


export interface IResponse extends Response {
    body: {
        users: IUser[];
        error: string;
    };
}

export interface IReqBody {
    user?: IUser;
}
