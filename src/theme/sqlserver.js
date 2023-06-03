exports.isDark = false;
exports.cssClass = "ace-sqlserver";
exports.cssText = require("./sqlserver-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
