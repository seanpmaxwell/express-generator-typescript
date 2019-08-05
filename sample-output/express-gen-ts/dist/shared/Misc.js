"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.pErr = (err) => {
    if (err) {
        Logger_1.logger.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
