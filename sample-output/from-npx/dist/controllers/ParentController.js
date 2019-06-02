"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@overnightjs/core");
const UserController_1 = require("./user/UserController");
let ParentController = class ParentController {
};
ParentController = tslib_1.__decorate([
    core_1.Controller('api'),
    core_1.Children([
        new UserController_1.UserController(),
    ])
], ParentController);
exports.ParentController = ParentController;
