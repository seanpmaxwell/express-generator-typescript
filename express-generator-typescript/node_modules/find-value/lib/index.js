"use strict";

/**
 * findValue
 * Finds the value at given path in the specified object.
 *
 * @name findValue
 * @function
 * @param {Object} obj The input object.
 * @param {String} path The path to the value you want to find.
 * @return {Anything} The path value.
 */
module.exports = function findValue(obj, path) {
    var dotIndex = path.indexOf(".");

    if (!~dotIndex) {
        if (obj === undefined || obj === null) {
            return undefined;
        }
        return obj[path];
    }

    var field = path.substring(0, dotIndex),
        rest = path.substring(dotIndex + 1);

    if (obj === undefined || obj === null) {
        return undefined;
    }

    obj = obj[field];
    if (!rest) {
        return obj;
    }
    return findValue(obj, rest);
};