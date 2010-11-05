define(["./lib/dom", "text!./theme/eclipse.css"], function(dom, cssText) {
        
    // import CSS once
    dom.importCssString(cssText);

    return {
        cssClass: "ace-eclipse"
    };
})