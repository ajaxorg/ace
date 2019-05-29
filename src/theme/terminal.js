exports.isDark = true;
exports.cssClass = "ace-terminal-theme";
exports.cssText = require("./terminal.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
