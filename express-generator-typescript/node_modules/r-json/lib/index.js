"use strict";

// Dependencies
var Fs = require("fs");

/**
 * rJson
 *
 * @name rJson
 * @function
 * @param {String} path The JSON file path.
 * @param {Function} callback An optional callback. If not passed, the function will run in sync mode.
 */
function rJson(path, callback) {

    if (typeof callback === "function") {
        Fs.readFile(path, "utf-8", function (err, data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                err = err || e;
            }
            callback(err, data);
        });
        return;
    }

    return JSON.parse(Fs.readFileSync(path));
}

module.exports = rJson;