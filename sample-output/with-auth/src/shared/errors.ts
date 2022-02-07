import { errors } from './constants';
import HttpStatusCodes from 'http-status-codes';


export class CustomError extends Error {

    public readonly HttpStatus;

    constructor(msg: string, httpStatus?: number) {
        super(msg);
        this.HttpStatus = httpStatus ?? HttpStatusCodes.BAD_REQUEST;
    }
}


export class ParamMissingError extends CustomError {

    public static readonly Err = 'One or more of the required parameters was missing.';

    constructor() {
        super(ParamMissingError.Err);
    }
}
