import * as e from 'express';


// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes extends e.Response {
  locals: Record<string, unknown>;
}
