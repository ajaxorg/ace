define(function(require, exports, module) {

    var dom = require("ace/lib/dom").dom;
    var cssText = require("text!ace/theme/tm.css");

    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "ace-tm"
    };
})