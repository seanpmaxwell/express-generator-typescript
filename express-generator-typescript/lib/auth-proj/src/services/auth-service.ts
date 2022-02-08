import bcrypt from 'bcrypt';

import userDao from '@daos/user-dao';
import jwtUtil from '@util/jwt-util';
import { UnauthorizedError } from '@shared/errors';



/**
 * Login()
 * 
 * @param email 
 * @param password 
 * @returns 
 */
async function login(email: string, password: string): Promise<string> {
    // Fetch user
    const user = await userDao.getOne(email);
    if (!user) {
        throw new UnauthorizedError();
    }
    // Check password
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        throw new UnauthorizedError();
    }
    // Setup Admin Cookie
    return jwtUtil.sign({
        id: user.id,
        role: user.role,
    });
}


// Export default
export default {
    login,
} as const;
