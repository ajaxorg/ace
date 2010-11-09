define(["require", "exports", "module", "text!ace/theme/tm.css", "ace/lib/dom"], 
    function(require, exports, module, cssText) {

    var dom = require("ace/lib/dom");

    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "ace-tm"
    };
})