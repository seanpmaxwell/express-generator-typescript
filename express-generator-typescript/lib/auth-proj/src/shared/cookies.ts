// Set default cookie exp
export const jwtCookieExp = (process.env.COOKIE_JWT_EXP_DAYS || 3);


// Admin Cookie Properties
export const jwtCookieProps = Object.freeze({
    key: 'JwtCookieKey',
    options: {
        path: (process.env.JWT_COOKIE_PATH),
        httpOnly: (process.env.HTTP_ONLY_COOKIE === 'true'),
        signed: (process.env.SIGNED_COOKIE === 'true'),
        maxAge: ((1000 * 60 * 60 * 24) * Number(jwtCookieExp)),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});
