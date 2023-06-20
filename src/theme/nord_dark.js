exports.isDark = true;
exports.cssClass = "ace-nord-dark";
exports.cssText = require("./nord_dark-css");
exports.$selectionColorConflict = true;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
