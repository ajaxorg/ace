define(function(require, exports, module) {
"use strict";
var modes = JSON.parse(require("../requirejs/text!./supported_modes.json"));

var modesByName = modes.reduce(function(memo, mode) {
    memo[mode.name] = mode;
    return memo;
}, {});

function supportsFile(mode, fileName) {
    return mode.extensions.some(function(extension) {
        if (extension[0] === "^") {
            return ("." + extension.slice(1)) === fileName;
        } else {
            var index = fileName.length - (extension.length + 1);
            return fileName.lastIndexOf("." + extension, index) === index;
        }
    });
}

/**
 * Suggests a mode based on the file extension present in the given path
 * @param {string} path The path to the file
 * @returns {object} Returns an object containing information about the
 *  suggested mode.
 */
function getModeForPath(path) {
    var fileName = path.split(/[\/\\]/).pop();
    return modes.reduce(function (memo, mode) {
        return memo || (supportsFile(mode, fileName) && mode);
    }, undefined) || modesByName.text;
}


/**
 * Adds a mode to the list of supported modes
 * @param {string} name Name of the mode
 * @param {string} caption Display name of the mode
 * @param {string} mode Path to the mode
 * @param {string[]} extensions List of extensions
 */
function addMode(name, caption, mode, extensions) {
    if (!modesByName[name]) {
        var mode = {
            name: name,
            caption: caption,
            mode: mode,
            extensions: extensions
        };

        modes = modes.concat(mode);
        modesByName[name] = mode;
    }
}

module.exports = {
    getModeForPath: getModeForPath,
    modes: modes,
    modesByName: modesByName,
    addMode: addMode
};

});
