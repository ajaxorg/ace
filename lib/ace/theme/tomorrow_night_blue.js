exports.isDark = true;
exports.cssClass = "ace-tomorrow-night-blue";
exports.cssText = require("../requirejs/text!./tomorrow_night_blue.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
