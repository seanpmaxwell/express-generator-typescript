import bcrypt from 'bcrypt';
import { SuperTest, Test } from 'supertest';

import User, { UserRoles } from '@models/user-model';
import userRepo from '@repos/user-repo';


export const pwdSaltRounds = 12;

const creds = {
    email: 'jsmith@gmail.com',
    password: 'Password@1',
    name: 'john smith',
} as const;


/**
 * Login a user.
 * 
 * @param beforeAgent 
 * @param done 
 */
function login(beforeAgent: SuperTest<Test>, done: (arg: string) => void) {
    // Setup dummy data
    const role = UserRoles.Admin;
    const pwdHash = bcrypt.hashSync(creds.password, pwdSaltRounds);
    const loginUser = User.new(creds.name, creds.email, role, pwdHash);
    spyOn(userRepo, 'getOne').and.returnValue(Promise.resolve(loginUser));
    // Call Login API
    beforeAgent
        .post('/api/auth/login')
        .type('form')
        .send(creds)
        .end((err: Error, res: any) => {
            if (err) {
                throw err;
            }
            done(res.headers['set-cookie']);
        });
};


// Export default
export default {
    creds,
    login,
} as const;
