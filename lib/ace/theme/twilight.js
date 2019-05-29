exports.isDark = true;
exports.cssClass = "ace-twilight";
exports.cssText = require("./twilight.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
