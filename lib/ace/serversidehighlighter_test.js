require("../../support/paths");

var assert = require("assert");
var ServerSideHighlighter = require("./serversidehighlighter");

// Execution ORDER: test.setUpSuite, setUp, testFn, tearDown, test.tearDownSuite
module.exports = {
    timeout: 10000,
    
    dispatcher: null,
    req: null,
    res: null,
    highlighter: null,
    
    setUpSuite: function (next) {
        this.highlighter = new ServerSideHighlighter();
        next();
    },

    setUp: function(next) {        
        next();
    },

    tearDown: function(next) {
        next();
    },
    
    "test extension js": function(next) {
        var JavascriptMode = require("ace/mode/javascript").Mode
        assert.equal(this.highlighter.getMode("jan.js") instanceof JavascriptMode, true);
        next();
    },
    
    "test extension unknown": function(next) {
        var TextMode = require("ace/mode/text").Mode
        assert.equal(this.highlighter.getMode("jan.unknown") instanceof TextMode, true);
        next();
    },
    
    "test simple snippet": function(next) {
        var theme = require("ace/theme/tomorrow");
        var snippet = "/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = this.highlighter.getMode("some.js");
        
        var isError = false, result;
        try {
            result = this.highlighter.render(snippet, mode, theme);
        }
        catch (e) {
            console.log(e);
            isError = true;
        }
        // todo: write something more meaningful
        assert.equal(isError, false);
        
        next();
    },
    
    "test css from theme is used": function(next) {
        var theme = require("ace/theme/tomorrow");
        var snippet = "/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = this.highlighter.getMode("some.js");
        
        var isError = false, result;
        result = this.highlighter.render(snippet, mode, theme);
        
        assert.equal(result.css, theme.cssText);
        
        next();
    },
    
    "test theme classname should be in output html": function (next) {
        var theme = require("ace/theme/tomorrow");
        var snippet = "/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = this.highlighter.getMode("some.js");
        
        var isError = false, result;
        result = this.highlighter.render(snippet, mode, theme);
        
        assert.equal(!!result.html.match(/<div class='ace-tomorrow'>/), true);
        
        next();
    }
};

!module.parent && require("asyncjs").test.testcase(module.exports, "ServerSideHighlighter").exec();
