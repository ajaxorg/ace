"use strict";

var CSVMode = require("./csv").Mode;
var TsvHighlightRules = require("./tsv_highlight_rules").TsvHighlightRules;

var Mode = function(options) {
    var mode = new CSVMode({
        splitter: "\t",
        quote: '"'
    });
    mode.HighlightRules = TsvHighlightRules;
    mode.$id = "ace/mode/tsv";
    return mode;
};

exports.Mode = Mode;
