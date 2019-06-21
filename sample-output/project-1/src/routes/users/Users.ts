import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { User } from '@entities';
import { logger } from '@shared';

// Init router and path
const router = Router();
const path = '/users';

/******************************************************************************
 *                                     Get User
 ******************************************************************************/

// Constants
const getUserPath = '/:name/:email';
export const getUserParamMissing = 'One of the required params is missing';

/**
 * Return user using name and email.
 * Full Path: "GET /api/users/:name/:email"
 */
router.get(getUserPath, (req: Request, res: Response) => {
    try {
        const { name, email } = req.params;
        if (name && email && email === 'undefined') {
            return res.status(BAD_REQUEST).json({
                error: getUserParamMissing,
            });
        } else if (name && email && email === 'throw-error') {
            throw Error('Error triggered manually');
        } else {
            return res.status(OK).json({
                user: new User(name, email),
            });
        }
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default { router, path };
