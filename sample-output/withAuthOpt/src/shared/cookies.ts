export const jwtCookieProps = Object.freeze({
    key: 'JwtCookieKey',
    options: {
        path: (process.env.JWT_COOKIE_PATH),
        httpOnly: (process.env.HTTP_ONLY_COOKIE === 'true'),
        signed: (process.env.SIGNED_COOKIE === 'true'),
        maxAge: Number(process.env.COOKIE_JWT_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});
