exports.isDark = true;
exports.cssClass = "ace-tomorrow-night";
exports.cssText = require("../requirejs/text!./tomorrow_night.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
