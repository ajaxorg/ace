exports.isDark = true;
exports.cssClass = "ace-terminal-theme";
exports.cssText = require("./terminal-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
