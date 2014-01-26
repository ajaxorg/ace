define(function(require, exports, module) {

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var GherkinHighlightRules = require("./gherkin_highlight_rules").GherkinHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new GherkinHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.$id = "ace/mode/gherkin";

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        
        console.log(state)
        
		if(line.match("[ ]*\\|")) {
			console.log(line.match("\|"));	
            indent += "| ";
        }

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }
        

        if (state == "start") {
            if (line.match("Scenario:|Feature:")) {
                indent = tab;
            } else if(line.match("Given.+(:)$|Examples:")) {
            	indent += tab;
            } else if(line.match("\\*.+")) {
            	indent += "* ";
            } 
        }
        

        return indent;
    };
    
    this.checkOutdent = function(state, line, input) {
    	if(line.match("Feature:")) {
    		
    	}
    }
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});