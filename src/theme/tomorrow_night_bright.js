exports.isDark = true;
exports.cssClass = "ace-tomorrow-night-bright";
exports.cssText = require("./tomorrow_night_bright-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
