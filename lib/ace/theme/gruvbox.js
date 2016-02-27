define(function(require, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-gruvbox";
    exports.cssText = require("../requirejs/text!./gruvbox.css");

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
