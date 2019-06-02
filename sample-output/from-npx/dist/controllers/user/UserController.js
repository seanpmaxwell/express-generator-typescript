"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@overnightjs/core");
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../../entities/User");
let UserController = class UserController {
    constructor() {
        this.CURRENT_ROUTE = '/users';
        this.REQ_PARAM_MISSING = 'One of the required params is missing';
    }
    get(req, res) {
        try {
            const { name, email } = req.params;
            if (name && email && email !== 'undefined') {
                return res.status(http_status_codes_1.OK).json({
                    user: new User_1.User(name, email),
                });
            }
            else {
                return res.status(http_status_codes_1.BAD_REQUEST).json({
                    error: this.REQ_PARAM_MISSING,
                });
            }
        }
        catch (err) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: err.message,
            });
        }
    }
};
tslib_1.__decorate([
    core_1.Get(':name/:email'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "get", null);
UserController = tslib_1.__decorate([
    core_1.Controller('users')
], UserController);
exports.UserController = UserController;
