import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import { UserDao } from '@daos';

import {
    paramMissingError,
    loginFailedErr,
    logger,
    jwtCookieProps,
    JwtService,
} from '@shared';


const router = Router();
const userDao = new UserDao();
const jwtService = new JwtService();


/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
    try {
        // Check email and password present
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        // Fetch user
        const user = await userDao.getOne(email);
        if (!user) {
            return res.status(UNAUTHORIZED).json({
                error: loginFailedErr,
            });
        }
        // Check password
        const pwdPassed = await bcrypt.compare(password, user.pwdHash);
        if (!pwdPassed) {
            return res.status(UNAUTHORIZED).json({
                error: loginFailedErr,
            });
        }
        // Setup Admin Cookie
        const jwt = await jwtService.getJwt({
            role: user.role,
        });
        const { key, options } = jwtCookieProps;
        res.cookie(key, jwt, options);
        // Return
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
    try {
        const { key, options } = jwtCookieProps;
        res.clearCookie(key, options);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
