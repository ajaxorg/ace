exports.isDark = false;
exports.cssClass = "ace-dreamweaver";
exports.cssText = require("./dreamweaver.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
