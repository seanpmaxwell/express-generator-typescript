"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _daos_1 = require("@daos");
const _shared_1 = require("@shared");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const _shared_2 = require("@shared");
const router = express_1.Router();
const userDao = new _daos_1.UserDao();
router.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
router.post('/add', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: _shared_2.paramMissingError,
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
router.put('/update', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: _shared_2.paramMissingError,
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
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield userDao.delete(Number(id));
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
