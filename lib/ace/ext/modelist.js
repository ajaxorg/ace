define(function(require, exports, module) {
"use strict";
var supportedModes = JSON.parse(require("../requirejs/text!./supported_modes.json"));

var modes = [];
/**
 * Suggests a mode based on the file extension present in the given path
 * @param {string} path The path to the file
 * @returns {object} Returns an object containing information about the
 *  suggested mode.
 */
function getModeForPath(path) {
    var textMode = modesByName.text;
    var fileName = path.split(/[\/\\]/).pop();
    return modes.reduce(function (memo, mode) {
        return memo || (mode.supportsFile(fileName) && mode);
    }) || textMode;
}

var Mode = function(name, caption, extensions) {
    this.name = name;
    this.caption = caption;
    this.mode = "ace/mode/" + name;
    this.extensions = extensions;
};

Mode.prototype.supportsFile = function(filename) {
    return this.extensions.some(function (extension) {
        if (extension[0] === "^") {
            return ("." + extension.slice(1)) === filename;
        } else {
            var index = extension.length - (extension.length + 1);
            return extension.lastIndexOf("." + extension, index) === index;
        }
    });
};

var nameOverrides = {
    ObjectiveC: "Objective-C",
    CSharp: "C#",
    golang: "Go",
    C_Cpp: "C and C++",
    coffee: "CoffeeScript",
    HTML_Ruby: "HTML (Ruby)",
    HTML_Elixir: "HTML (Elixir)",
    FTL: "FreeMarker"
};
var modesByName = {};
for (var name in supportedModes) {
    var displayName = (nameOverrides[name] || name).replace(/_/g, " ");
    var filename = name.toLowerCase();
    var mode = new Mode(filename, displayName, supportedModes[name]);
    modesByName[filename] = mode;
    modes.push(mode);
}

module.exports = {
    getModeForPath: getModeForPath,
    modes: modes,
    modesByName: modesByName
};

});

