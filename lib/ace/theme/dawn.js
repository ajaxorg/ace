exports.isDark = false;
exports.cssClass = "ace-dawn";
exports.cssText = require("../requirejs/text!./dawn.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
