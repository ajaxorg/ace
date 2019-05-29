exports.isDark = false;
exports.cssClass = "ace-chrome";
exports.cssText = require("./chrome.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
