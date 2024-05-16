exports.isDark = false;
exports.cssText = require("./crimson_editor-css");

exports.cssClass = "ace-crimson-editor";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
