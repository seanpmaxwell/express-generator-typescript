"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Users_1 = tslib_1.__importDefault(require("./users/Users"));
const router = express_1.Router();
const path = '/api';
router.use(Users_1.default.path, Users_1.default.router);
exports.default = { router, path };
