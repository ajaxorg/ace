exports.isDark = true;
exports.cssClass = "ace-cloud_editor_dark";
exports.cssText = require("./cloud_editor_dark-css");
/**@internal */
exports.$showGutterCursorMarker = true;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
