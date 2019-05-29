exports.isDark = true;
exports.cssClass = "ace-tomorrow-night-eighties";
exports.cssText = require("./tomorrow_night_eighties.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
