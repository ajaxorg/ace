define(function(require, exports, module) {

var dom = require("ace/lib/dom");
var cssText = require("text!ace/theme/eclipse.css");
        
    // import CSS once
    dom.importCssString(cssText);

    return {
        cssClass: "ace-eclipse"
    };
})