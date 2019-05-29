exports.isDark = false;
exports.cssClass = "ace-sqlserver";
exports.cssText = require("./sqlserver.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
