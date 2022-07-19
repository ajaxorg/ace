exports.isDark = false;
exports.cssClass = "ace-gruvbox-light-hard";
exports.cssText = require("../requirejs/text!./gruvbox_light_hard.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
