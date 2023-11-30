exports.isDark = false;
exports.cssClass = "ace-cloud_editor";
exports.cssText = require("./cloud_editor-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
