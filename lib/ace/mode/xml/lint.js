define(function(require, exports, module){"use strict";
var DOMParser = require("./dom-parser").DOMParser;
function pushAnnotation(errors, errorMsg, locator, type) {
    errors.push({
        row: Math.max(0, locator.lineNumber - 1),
        column: locator.columnNumber,
        text: errorMsg,
        type: type
    });
}
exports.lintXml = function (value) {
    var errors = [];
    if (!value)
        return errors;
    var parser = new DOMParser();
    parser.options.errorHandler = {
        fatalError: function (fullMsg, errorMsg, locator) {
            pushAnnotation(errors, errorMsg, locator, "error");
        },
        error: function (fullMsg, errorMsg, locator) {
            pushAnnotation(errors, errorMsg, locator, "error");
        },
        warning: function (fullMsg, errorMsg, locator) {
            pushAnnotation(errors, errorMsg, locator, "warning");
        }
    };
    parser.parseFromString(value);
    return errors;
};

});