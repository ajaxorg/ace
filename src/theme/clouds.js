exports.isDark = false;
exports.cssClass = "ace-clouds";
exports.cssText = require("./clouds.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
