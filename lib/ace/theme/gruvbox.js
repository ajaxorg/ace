exports.isDark = true;
exports.cssClass = "ace-gruvbox";
exports.cssText = require("./gruvbox.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
