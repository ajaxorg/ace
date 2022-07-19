exports.isDark = true;
exports.cssClass = "ace-dracula";
exports.cssText = require("../requirejs/text!./dracula.css");
exports.$selectionColorConflict = true;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
