import type { Request, Response } from 'express';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

// Body is `unknown` until it has been validated with `parseReq`.
export type Req = Request<Record<string, string>, unknown, unknown>;
export type Res = Response;
