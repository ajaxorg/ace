ace.define("ace/mode/lucene_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LuceneHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : "constant.character.negation",
                regex : "[\\-]"
            }, {
                token : "constant.character.interro",
                regex : "[\\?]"
            }, {
                token : "constant.character.asterisk",
                regex : "[\\*]"
            }, {
                token: 'constant.character.proximity',
                regex: '~[0-9]+\\b'
            }, {
                token : 'keyword.operator',
                regex: '(?:AND|OR|NOT)\\b'
            }, {
                token : "paren.lparen",
                regex : "[\\(]"
            }, {
                token : "paren.rparen",
                regex : "[\\)]"
            }, {
                token : "keyword",
                regex : "[\\S]+:"
            }, {
                token : "string",           // " string
                regex : '".*?"'
            }, {
                token : "text",
                regex : "\\s+"
            }
        ]
    };
};

oop.inherits(LuceneHighlightRules, TextHighlightRules);

exports.LuceneHighlightRules = LuceneHighlightRules;
});

ace.define("ace/mode/lucene",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/lucene_highlight_rules"], function(require, exports, module) {
'use strict';

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LuceneHighlightRules = require("./lucene_highlight_rules").LuceneHighlightRules;

var Mode = function() {
    this.HighlightRules = LuceneHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};

oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/lucene";
}).call(Mode.prototype);

exports.Mode = Mode;
});
