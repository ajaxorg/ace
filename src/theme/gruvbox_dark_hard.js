exports.isDark = true;
exports.cssClass = "ace-gruvbox-dark-hard";
exports.cssText = require("./gruvbox_dark_hard-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
