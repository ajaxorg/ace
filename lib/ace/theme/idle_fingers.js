exports.isDark = true;
exports.cssClass = "ace-idle-fingers";
exports.cssText = require("./idle_fingers.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
