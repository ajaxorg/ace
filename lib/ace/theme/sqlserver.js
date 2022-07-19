exports.isDark = false;
exports.cssClass = "ace-sqlserver";
exports.cssText = require("../requirejs/text!./sqlserver.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
