exports.isDark = false;
exports.cssClass = "ace-clouds";
exports.cssText = require("./clouds-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
