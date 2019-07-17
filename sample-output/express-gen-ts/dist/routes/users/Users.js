"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _daos_1 = require("@daos");
const _shared_1 = require("@shared");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.Router();
const userDao = new _daos_1.UserDao();
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.getUsersPath = '/all';
exports.addUserPath = '/add';
exports.updateUserPath = '/update';
exports.deleteUserPath = '/delete/:id';
router.get(exports.getUsersPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const users = yield userDao.getAll();
        return res.status(http_status_codes_1.OK).json({ users });
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.post(exports.addUserPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: exports.paramMissingError,
            });
        }
        yield userDao.add(user);
        return res.status(http_status_codes_1.CREATED).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.put(exports.updateUserPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: exports.paramMissingError,
            });
        }
        user.id = Number(user.id);
        yield userDao.update(user);
        return res.status(http_status_codes_1.OK).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.delete(exports.deleteUserPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        yield userDao.delete(Number(req.params.id));
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
