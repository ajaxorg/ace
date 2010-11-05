define(["./lib/dom", "text!./theme/tm.css"], function(dom, cssText) {

    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "ace-tm"
    };
})