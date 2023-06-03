exports.isDark = true;
  exports.cssClass = "ace-cloud9-night-low-color";
  exports.cssText = require("./cloud9_night_low_color-css");

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
