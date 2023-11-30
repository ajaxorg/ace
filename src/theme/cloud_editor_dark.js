exports.isDark = true;
exports.cssClass = "ace-cloud_editor_dark";
exports.cssText = require("./cloud_editor_dark-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
