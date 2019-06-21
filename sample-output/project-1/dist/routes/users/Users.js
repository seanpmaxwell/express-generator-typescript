"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const _entities_1 = require("@entities");
const _shared_1 = require("@shared");
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
                user: new _entities_1.User(name, email),
            });
        }
    }
    catch (err) {
        _shared_1.logger.error('', err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
});
exports.default = { router, path };
