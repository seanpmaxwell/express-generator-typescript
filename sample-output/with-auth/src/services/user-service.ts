import userDao from '@daos/user-dao';
import { IUser } from '@models/user-model';
import { UserNotFoundError } from '@shared/errors';



/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<IUser[]> {
    return userDao.getAll();
}


/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
function addOne(user: IUser): Promise<void> {
    return userDao.add(user);
}


/**
 * Update one user.
 * 
 * @param user 
 * @returns 
 */
async function updateOne(user: IUser): Promise<void> {
    const persists = await userDao.persists(user.id);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return userDao.update(user);
}


/**
 * Delete a user by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<void> {
    const persists = await userDao.persists(id);
    if (!persists) {
        throw new UserNotFoundError();
    }
    return userDao.delete(id);
}


// Export default
export default {
    getAll,
    addOne,
    updateOne,
    delete: deleteOne,
} as const;
