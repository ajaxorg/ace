"use strict";

var oop = require("../lib/oop");
var XmlMode = require("./xml").Mode;
var JavaScriptMode = require("./javascript").Mode;
var SvgHighlightRules = require("./svg_highlight_rules").SvgHighlightRules;
var MixedFoldMode = require("./folding/mixed").FoldMode;
var XmlFoldMode = require("./folding/xml").FoldMode;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    XmlMode.call(this);
    
    this.HighlightRules = SvgHighlightRules;
    
    this.createModeDelegates({
        "js-": JavaScriptMode
    });
    
    this.foldingRules = new MixedFoldMode(new XmlFoldMode(), {
        "js-": new CStyleFoldMode()
    });
};

oop.inherits(Mode, XmlMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };
    

    this.$id = "ace/mode/svg";
}).call(Mode.prototype);

exports.Mode = Mode;
