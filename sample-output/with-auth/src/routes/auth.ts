
import authService from '@services/authService';
import { errors } from '@shared/constants';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';


// Constants
const router = Router();
const { BAD_REQUEST, OK } = StatusCodes;

// Paths
const p = {
    login: '/login',
    logout: '/logout',
};

// Cookie Properties
export const cookieProps = Object.freeze({
    key: 'ExpressGeneratorTs',
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: true,
        path: (process.env.COOKIE_PATH),
        maxAge: Number(process.env.COOKIE_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});


/**
 * Login a user.
 */
router.post(p.login, async (req: Request, res: Response) => {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: errors.paramMissing,
        });
    }
    // Get jwt
    const resp = await authService.login(email, password);
    if (typeof resp === 'object' && resp.error) {
        return res.status(resp.error.status).json({
            error: resp.error.msg,
        });
    }
    // Add jwt to cookie
    const { key, options } = cookieProps;
    res.cookie(key, resp, options);
    // Return
    return res.status(OK).end();
});


/**
 * Logout the user.
 */
router.get(p.logout, (_: Request, res: Response) => {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
});


// Export router
export default router;
