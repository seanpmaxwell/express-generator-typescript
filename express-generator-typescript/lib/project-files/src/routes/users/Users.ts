import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { logger } from '@shared';
import { IUserDao, UserDao, UserDaoMock } from '@daos';


// Init router and path
const router = Router();
const path = '/users';


let userDao: IUserDao;
if (process.env.NODE_ENV === 'development') {
    userDao = new UserDaoMock();
} else {
    userDao = new UserDao();
}


/******************************************************************************
 *                                Get All Users
 ******************************************************************************/

// Constants
const getUserPath = '/all';

/**
 * Return user using name and email.
 * Full Path: "GET /api/users/all"
 */
router.get(getUserPath, async (req: Request, res: Response) => {
    try {
        const users = await userDao.getAll();
        return res.status(OK).json({users});
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                Add One
 ******************************************************************************/

// Constants
const addUserPath = '/add';
const userMissingErr = 'User property was not present for adding user route.';

/**
 * Add one user.
 * Full Path: "POST /api/users/add"
 */
router.post(addUserPath, async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: userMissingErr,
            });
        }
        await userDao.add(user);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                      Update
 ******************************************************************************/

// Constants
const updateUserPath = '/update';
const userUpdateMissingErr = 'User property was not present for updating user route.';

/**
 * Add one user.
 * Full Path: "PUT /api/users/update"
 */
router.put(updateUserPath, async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: userUpdateMissingErr,
            });
        }
        await userDao.update(user);
        return res.status(OK).end();
    } catch (err) {
        logger.error('', err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});


/******************************************************************************
 *                                      Delete
 ******************************************************************************/

// Constants
const deleteUserPath = '/delete/:id';
const userDeleteMissingErr = 'Id property was not present for delete user route.';

/**
 * Add one user.
 * Full Path: "DELETE /api/users/update"
 */
router.delete(deleteUserPath, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(BAD_REQUEST).json({
                error: userDeleteMissingErr,
            });
        }
        await userDao.delete(id);
        return res.status(OK).end();
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
