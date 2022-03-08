import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import envVars from '../shared/env-vars';


// **** Constants **** //

// Errors
const errors = {
    validation: 'JSON-web-token validation failed.',
} as const;

// Options
const options = {
    expiresIn: envVars.jwt.exp,
};


// **** Types **** //

type TDecoded = string | JwtPayload | undefined;


// **** Functions **** //

/**
 * Encrypt data and return jwt.
 */
function sign(data: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(data, envVars.jwt.secret, options, (err, token) => {
            err ? reject(err) : resolve(token || '');
        });
    });
}

/**
 * Decrypt JWT and extract client data.
 */
function decode(jwt: string): Promise<TDecoded> {
    return new Promise((res, rej) => {
        jsonwebtoken.verify(jwt, envVars.jwt.secret, (err, decoded) => {
            return err ? rej(errors.validation) : res(decoded);
        });
    });
}


// Export default
export default {
    sign,
    decode,
};
