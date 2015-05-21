require("amd-loader");
var assert = require("assert");

var tk = require("./regexp_tokenizer");
var tokenize = tk.tokenize;
var toStr = tk.toStr;

var logTokens = function(tokens) {
    tokens.forEach(function(x) {
        delete x.end
        delete x.start
    })
    console.log(tokens)
}

assert.equal(toStr(
    tokenize("(?x)c + +\n\
    # comment\n\
    (?-x)  #  (?x:  1 \n\
        (2) [ ]   # a    \n\
        3  4)  c#"
    )),    
    "(?x)c++(?-x)  #  (?x:1(2)[ ]34)  c#"
 )
assert.equal(toStr(
    tokenize("(?x)\n\
        u  # comment\n\
    ")),
    "(?x)u"
 )
