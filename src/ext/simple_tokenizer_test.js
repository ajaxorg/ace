"use strict";

const isNodeEnvironment = require("../test/util").isNodeEnvironment;
if (!isNodeEnvironment()) {
    require("amd-loader");
}

const assert = require("../test/assertions");
const tokenize = require("./simple_tokenizer").tokenize;

const JsonHighlightRules = require("../mode/json_highlight_rules").JsonHighlightRules;
const JavaScriptHighlightRules = require("../mode/javascript_highlight_rules").JavaScriptHighlightRules;

module.exports = {
    "test: can tokenize JSON": function() {
        const content = `{
            "name": "John",
            "age": 30,
            "car": null
        }`;
        const result = tokenize(content, new JsonHighlightRules());

        const expectedResult = [
            [{ className: "ace_paren ace_lparen", value: "{" }],
            [
                {className: undefined, value: '            '},
                { className: "ace_variable", value: '"name"' }, 
                { className: undefined, value: ": " }, 
                { className: "ace_string", value: '"John"' }, 
                { className: "ace_punctuation ace_operator", value: "," } 
            ],
            [
                {className: undefined, value: '            '},
                { className: "ace_variable", value: '"age"' }, 
                { className: undefined, value: ": " }, 
                { className: "ace_constant ace_numeric", value: "30" }, 
                { className: "ace_punctuation ace_operator", value: "," } 
            ],
            [
                {className: undefined, value: '            '},
                { className: "ace_variable", value: '"car"' }, 
                { className: undefined, value: ": null" }
            ],
            [
                {className: undefined, value: '        '},
                { className: "ace_paren ace_rparen", value: "}" }
            ]
        ];

        assert.deepEqual(result, expectedResult);
    },

    "test: can tokenize Javascript": function() {
        const content = `console.log("content")`;
        const result = tokenize(content, new JavaScriptHighlightRules());

        const expectedResult = [
            [
                {className: 'ace_storage ace_type', value: 'console'},
                {className: 'ace_punctuation ace_operator', value: '.'},
                {className: 'ace_support ace_function ace_firebug', value: 'log'},
                {className: 'ace_paren ace_lparen', value: '('},
                {className: 'ace_string', value: '"content"'},
                {className: 'ace_paren ace_rparen', value: ')'}
            ]
        ];

        assert.deepEqual(result, expectedResult);
    }

};
