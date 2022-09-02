"use strict";

// Dependencies
var Fs = require("fs");

/**
 * wJson
 * Writes a JSON file.
 *
 * @name wJson
 * @function
 * @param {String} path The JSON file path.
 * @param {Object} data The JSON data to write in the provided file.
 * @param {Object|Number|Boolean} options An object containing the fields below.
 * If boolean, it will be handled as `new_line`, if number it will be handled as `space`.
 *
 *  - `space` (Number): An optional space value for beautifying the json output (default: `2`).
 *  - `new_line` (Boolean): If `true`, a new line character will be added at the end of the stringified content.
 *
 * @param {Function} callback An optional callback. If not passed, the function will run in sync mode.
 */
function wJson(path, data, options, callback) {

    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (typeof options === "number") {
        options = {
            space: options
        };
    } else if (typeof options === "boolean") {
        options = {
            new_line: options
        };
    }

    options = options || {};

    options.space = typeof options.space === "number" ? options.space : 2;
    options.new_line = !!options.new_line;

    Fs["writeFile" + (typeof callback === "function" ? "" : "Sync")](path, JSON.stringify(data, null, options.space) + (options.new_line ? "\n" : ""), callback);
}

module.exports = wJson;