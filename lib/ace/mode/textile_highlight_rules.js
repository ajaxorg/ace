
/*
    TODO license etc
*/

define(function(require, exports, module) {

var oop = require("pilot/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var TextileHighlightRules = function()
{
/*
    var phraseModifiers = lang.arrayToMap(
        ("_|*|__|**|??|-|+|^|%|@").split("|")
    );
    
    var blockModifiers = lang.arrayToMap(
        ("h1|h2|h3|h4|h5|h6|bq|p|bc|pre").split("|")
    );
    */
    /*
    var punctuation = lang.arrayToMap(
        ("-|--|(tm)|(r)|(c)").split("|")
    );
    */
    
    this.$rules = {
        "start" : [
            {
                token : "keyword", // start of block
                regex : "h1|h2|h3|h4|h5|h6|bq|p|bc|pre",
                next  : "blocktag"
            },
            {
                token : "keyword",
                regex : "[\\*]+|[#]+"
            },
            {
                token : "text",
                regex : ".+"
            }
        ],
        "blocktag" : [
            {
                token : "keyword",
                regex : "\\. ",
                next  : "start",
            },
            {
                token : "keyword",
                regex : "\\(",
                next  : "blocktagproperties"
            },
        ],
        "blocktagproperties" : [
            {
                token : "keyword",
                regex : "\\)",
                next  : "blocktag"
            },
            {
                token : "string",
                regex : "[a-zA-Z0-9\\-_]+"
            },
            {
                token : "keyword",
                regex : "#"
            },
        ]
    };
};

oop.inherits(TextileHighlightRules, TextHighlightRules);

exports.TextileHighlightRules = TextileHighlightRules;

});
