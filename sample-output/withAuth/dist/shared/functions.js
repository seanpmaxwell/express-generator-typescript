"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = exports.pErr = void 0;
const tslib_1 = require("tslib");
const Logger_1 = tslib_1.__importDefault(require("./Logger"));
exports.pErr = (err) => {
    if (err) {
        Logger_1.default.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
