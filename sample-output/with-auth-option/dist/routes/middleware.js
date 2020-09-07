"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMW = void 0;
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("@entities/User");
const constants_1 = require("@shared/constants");
const JwtService_1 = require("@shared/JwtService");
const jwtService = new JwtService_1.JwtService();
exports.adminMW = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwt = req.signedCookies[constants_1.cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        const clientData = yield jwtService.decodeJwt(jwt);
        if (clientData.role === User_1.UserRoles.Admin) {
            res.locals.userId = clientData.id;
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
