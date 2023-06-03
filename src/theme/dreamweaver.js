exports.isDark = false;
exports.cssClass = "ace-dreamweaver";
exports.cssText = require("./dreamweaver-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
