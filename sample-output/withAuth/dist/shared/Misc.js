"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const _entities_1 = require("@entities");
const Logger_1 = require("./Logger");
const cookies_1 = require("./cookies");
const JwtService_1 = require("./JwtService");
const jwtService = new JwtService_1.JwtService();
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.loginFailedErr = 'Login failed';
exports.pwdSaltRounds = 12;
exports.pErr = (err) => {
    if (err) {
        Logger_1.logger.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.adminMW = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const jwt = req.signedCookies[cookies_1.jwtCookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        const clientData = yield jwtService.decodeJwt(jwt);
        if (clientData.role === _entities_1.UserRoles.Admin) {
            next();
        }
        else {
            throw Error('JWT not present in signed cookie.');
        }
    }
    catch (err) {
        return res.status(http_status_codes_1.UNAUTHORIZED).json({
            error: err.message,
        });
    }
});
