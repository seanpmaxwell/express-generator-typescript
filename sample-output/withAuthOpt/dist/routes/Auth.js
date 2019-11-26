"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const _daos_1 = require("@daos");
const _shared_1 = require("@shared");
const router = express_1.Router();
const userDao = new _daos_1.UserDao();
const jwtService = new _shared_1.JwtService();
router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: _shared_1.paramMissingError,
            });
        }
        const user = yield userDao.getOne(email);
        if (!user) {
            return res.status(http_status_codes_1.UNAUTHORIZED).json({
                error: _shared_1.loginFailedErr,
            });
        }
        const pwdPassed = yield bcrypt_1.default.compare(password, user.pwdHash);
        if (!pwdPassed) {
            return res.status(http_status_codes_1.UNAUTHORIZED).json({
                error: _shared_1.loginFailedErr,
            });
        }
        const jwt = yield jwtService.getJwt({
            role: user.role,
        });
        const { key, options } = _shared_1.jwtCookieProps;
        res.cookie(key, jwt, options);
        return res.status(http_status_codes_1.OK).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.get('/logout', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, options } = _shared_1.jwtCookieProps;
        res.clearCookie(key, options);
        return res.status(http_status_codes_1.OK).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
exports.default = router;
