require.def("ace/theme/TextMate",
    ["ace/lib/dom", "text!ace/theme/tm.css"], function(dom, cssText) {

    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "ace-tm"
    };
})