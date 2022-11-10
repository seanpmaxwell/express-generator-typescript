import jsonwebtoken from 'jsonwebtoken';
import EnvVars from '../declarations/major/EnvVars';


// **** Variables **** //

// Errors
const errors = {
  validation: 'JSON-web-token validation failed.',
} as const;

// Options
const options = {
  expiresIn: EnvVars.jwt.exp,
};


// **** Functions **** //

/**
 * Encrypt data and return jwt.
 */
function sign(data: string | object | Buffer): Promise<string> {
  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, EnvVars.jwt.secret, options, (err, token) => {
      return err ? rej(err) : res(token || '');
    });
  });
}

/**
 * Decrypt JWT and extract client data.
 */
function decode<T>(jwt: string): Promise<string | undefined | T> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, EnvVars.jwt.secret, (err, decoded) => {
      return err ? rej(errors.validation) : res(decoded as T);
    });
  });
}


// **** Export default **** //

export default {
  sign,
  decode,
} as const;
