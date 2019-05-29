exports.isDark = false;
exports.cssClass = "ace-iplastic";
exports.cssText = require("./iplastic.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
