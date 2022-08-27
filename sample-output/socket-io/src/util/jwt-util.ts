import randomString from 'randomstring';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';


// **** Variables **** //

// Errors
const errors = {
    validation: 'JSON-web-token validation failed.',
} as const;

// Misc
const secret = (process.env.JWT_SECRET || randomString.generate(100));
const options = {expiresIn: process.env.COOKIE_EXP};


// **** Types ****  //

type TDecoded = string | JwtPayload | undefined;


// **** Functions **** //

/**
 * Encrypt data and return jwt.
 */
function sign(data: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(data, secret, options, (err, token) => {
      err ? reject(err) : resolve(token || '');
    });
  });
}

/**
 * Decrypt JWT and extract client data.
 */
function decode(jwt: string): Promise<TDecoded> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, secret, (err, decoded) => {
      return err ? rej(errors.validation) : res(decoded);
    });
  });
}


// **** Export default **** //

export default {
  sign,
  decode,
};
