"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../entities/User");
const Logger_1 = require("../../Logger");
const router = express_1.Router();
const path = '/users';
const getUserPath = '/:name/:email';
exports.getUserParamMissing = 'One of the required params is missing';
router.get(getUserPath, (req, res) => {
    try {
        const { name, email } = req.params;
        if (name && email && email === 'undefined') {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: exports.getUserParamMissing,
            });
        }
        else if (name && email && email === 'throw-error') {
            throw Error('Error triggered manually');
        }
        else {
            return res.status(http_status_codes_1.OK).json({
                user: new User_1.default(name, email),
            });
        }
    }
    catch (err) {
        Logger_1.default.error('', err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
});
exports.default = { router, path };
