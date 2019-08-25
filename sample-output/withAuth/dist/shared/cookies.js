"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCookieExp = (process.env.COOKIE_JWT_EXP_DAYS || 3);
exports.jwtCookieProps = Object.freeze({
    key: 'JwtCookieKey',
    options: {
        path: (process.env.JWT_COOKIE_PATH),
        httpOnly: (process.env.HTTP_ONLY_COOKIE === 'true'),
        signed: (process.env.SIGNED_COOKIE === 'true'),
        maxAge: ((1000 * 60 * 60 * 24) * Number(exports.jwtCookieExp)),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});
