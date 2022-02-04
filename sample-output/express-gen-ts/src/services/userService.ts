import userDao from '@daos/userDao';
import { IUser } from '@models/user';


// Constants
const errors = {
    userNotFound: 'A user with the given id does not exists in the database.',
} as const;



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
async function updateOne(user: IUser): Promise<{error?: string}> {
    const persists = await userDao.persists(user.id);
    if (!persists) {
        return {error: errors.userNotFound};
    }
    await userDao.update(user);
    return {};
}


/**
 * Delete a user by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<{error?: string}> {
    const persists = await userDao.persists(id);
    if (!persists) {
        return {error: errors.userNotFound};
    }
    await userDao.delete(id);
    return {};
}


// Export default
export default {
    errors,
    getAll,
    addOne,
    updateOne,
    delete: deleteOne,
} as const;
