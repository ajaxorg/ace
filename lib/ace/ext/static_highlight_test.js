if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var assert = require("assert");
var highlighter = require("./static_highlight");
var JavaScriptMode = require("../mode/javascript").Mode;

// Execution ORDER: test.setUpSuite, setUp, testFn, tearDown, test.tearDownSuite
module.exports = {
    timeout: 10000,

    "test simple snippet": function(next) {
        var theme = require("../theme/tomorrow");
        var snippet = "\
/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = new JavaScriptMode();

        var result = highlighter.render(snippet, mode, theme);
        assert.equal(result.html, "<div class='ace-tomorrow'>        <div class='ace_editor ace_scroller ace_text-layer'>            <div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>1</span><span class='ace_comment ace_doc'>/**\xa0this\xa0is\xa0a\xa0function</span></div><div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>2</span><span class='ace_comment ace_doc'>*</span></div><div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>3</span><span class='ace_comment ace_doc'>*/</span></div><div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>4</span><span class='ace_storage ace_type'>function</span>\xa0<span class='ace_entity ace_name ace_function'>hello</span>\xa0<span class='ace_paren ace_lparen'>(</span><span class='ace_variable ace_parameter'>a</span><span class='ace_punctuation ace_operator'>,\xa0</span><span class='ace_variable ace_parameter'>b</span><span class='ace_punctuation ace_operator'>,\xa0</span><span class='ace_variable ace_parameter'>c</span><span class='ace_paren ace_rparen'>)</span>\xa0<span class='ace_paren ace_lparen'>{</span></div><div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>5</span>\xa0\xa0\xa0\xa0<span class='ace_storage ace_type'>console</span><span class='ace_punctuation ace_operator'>.</span><span class='ace_support ace_function ace_firebug'>log</span><span class='ace_paren ace_lparen'>(</span><span class='ace_identifier'>a</span>\xa0<span class='ace_keyword ace_operator'>*</span>\xa0<span class='ace_identifier'>b</span>\xa0<span class='ace_keyword ace_operator'>+</span>\xa0<span class='ace_identifier'>c</span>\xa0<span class='ace_keyword ace_operator'>+</span>\xa0<span class='ace_string'>'sup?'</span><span class='ace_paren ace_rparen'>)</span><span class='ace_punctuation ace_operator'>;</span></div><div class='ace_line'><span class='ace_gutter ace_gutter-cell' unselectable='on'>6</span><span class='ace_paren ace_rparen'>}</span></div>        </div>    </div>");
        assert.ok(!!result.css);
        next();
    },

    "test css from theme is used": function(next) {
        var theme = require("../theme/tomorrow");
        var snippet = "\
/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = new JavaScriptMode();

        var isError = false, result;
        result = highlighter.render(snippet, mode, theme);

        assert.ok(result.css.indexOf(theme.cssText) !== -1);

        next();
    },

    "test theme classname should be in output html": function(next) {
        var theme = require("../theme/tomorrow");
        var snippet = "\
/** this is a function\n\
*\n\
*/\n\
function hello (a, b, c) {\n\
    console.log(a * b + c + 'sup?');\n\
}";
        var mode = new JavaScriptMode();

        var isError = false, result;
        result = highlighter.render(snippet, mode, theme);
        assert.equal(!!result.html.match(/<div class='ace-tomorrow'>/), true);

        next();
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
