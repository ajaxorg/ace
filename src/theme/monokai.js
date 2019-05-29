exports.isDark = true;
exports.cssClass = "ace-monokai";
exports.cssText = require("./monokai.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
