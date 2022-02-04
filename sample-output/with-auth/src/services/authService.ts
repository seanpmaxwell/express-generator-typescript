import bcrypt from 'bcrypt';

import userDao from '@daos/userDao';
import jwtUtil from '@util/jwtUtil';
import { StatusCodes } from 'http-status-codes';


// Constants
const { UNAUTHORIZED } = StatusCodes;

// Errors
const errors = {
    loginFailed: 'Login failed',
}


// Types
type TLoginErr = ReturnType<typeof getUnauthErr>;


/**
 * 
 * @param email 
 * @param password 
 * @returns 
 */
async function login(email: string, password: string): Promise<string | TLoginErr> {
    // Fetch user
    const user = await userDao.getOne(email);
    if (!user) {
        return getUnauthErr();
    }
    // Check password
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return getUnauthErr();
    }
    // Setup Admin Cookie
    return jwtUtil.sign({
        id: user.id,
        role: user.role,
    });
}


/**
 * Get unauth error.
 * 
 * @returns 
 */
function getUnauthErr() {
    return {
        error: {
            status: UNAUTHORIZED,
            msg: errors.loginFailed,
        }
    }
}


// Export default
export default {
    errors,
    login,
} as const;
