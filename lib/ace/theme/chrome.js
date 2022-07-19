exports.isDark = false;
exports.cssClass = "ace-chrome";
exports.cssText = require("../requirejs/text!./chrome.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
