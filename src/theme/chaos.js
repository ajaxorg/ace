exports.isDark = true;
exports.cssClass = "ace-chaos";
exports.cssText = require("./chaos.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
