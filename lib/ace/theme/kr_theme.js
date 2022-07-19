exports.isDark = true;
exports.cssClass = "ace-kr-theme";
exports.cssText = require("../requirejs/text!./kr_theme.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
