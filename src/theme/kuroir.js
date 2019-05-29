exports.isDark = false;
exports.cssClass = "ace-kuroir";
exports.cssText = require("./kuroir.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
