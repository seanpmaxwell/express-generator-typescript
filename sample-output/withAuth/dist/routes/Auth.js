"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const UserDao_mock_1 = tslib_1.__importDefault(require("@daos/User/UserDao.mock"));
const JwtService_1 = require("@shared/JwtService");
const constants_1 = require("@shared/constants");
const router = express_1.Router();
const userDao = new UserDao_mock_1.default();
const jwtService = new JwtService_1.JwtService();
router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const user = yield userDao.getOne(email);
    if (!user) {
        return res.status(http_status_codes_1.UNAUTHORIZED).json({
            error: constants_1.loginFailedErr,
        });
    }
    const pwdPassed = yield bcrypt_1.default.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(http_status_codes_1.UNAUTHORIZED).json({
            error: constants_1.loginFailedErr,
        });
    }
    const jwt = yield jwtService.getJwt({
        id: user.id,
        role: user.role,
    });
    const { key, options } = constants_1.cookieProps;
    res.cookie(key, jwt, options);
    return res.status(http_status_codes_1.OK).end();
}));
router.get('/logout', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { key, options } = constants_1.cookieProps;
    res.clearCookie(key, options);
    return res.status(http_status_codes_1.OK).end();
}));
exports.default = router;
