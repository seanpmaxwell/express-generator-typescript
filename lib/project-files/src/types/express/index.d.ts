import * as e from 'express';
import { Query } from 'express-serve-static-core';


export interface IReq<T> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body?: U;
}
