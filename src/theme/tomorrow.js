exports.isDark = false;
exports.cssClass = "ace-tomorrow";
exports.cssText = require("./tomorrow.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
