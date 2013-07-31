ace.require("ace/lib/net").get(document.baseURI, function(t){
    editor.setValue(t, 1);
})