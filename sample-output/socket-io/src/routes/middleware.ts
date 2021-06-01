import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { cookieProps } from '@shared/constants';
import { JwtService } from '@shared/JwtService';

const jwtService = new JwtService();
const { UNAUTHORIZED } = StatusCodes;



// Middleware to verify if user is logged in
export const authMw = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user is logged in
        const clientData = await jwtService.decodeJwt(jwt);
        if (!!clientData) {
            res.sessionUser = clientData;
            next();
        } else {
            throw Error('JWT not present in signed cookie.');
        }
    } catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
};
