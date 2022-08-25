"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var WollokHighlightRules = require("./wollok_highlight_rules").WollokHighlightRules;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = WollokHighlightRules;
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/wollok";
    this.snippetFileId = "ace/snippets/wollok";
}).call(Mode.prototype);

exports.Mode = Mode;
