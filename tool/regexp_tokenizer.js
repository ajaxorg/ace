/***** regexp tokenizer */
require("amd-loader");
var lib = require("./lib");

var Tokenizer = require(lib.AceLib+ "ace/tokenizer").Tokenizer;
var Tokenizer = require(lib.AceLib + "ace/tokenizer_dev").Tokenizer; // todo can't use tokenizer because of max token count
var TextHighlightRules = require(lib.AceLib + "ace/mode/text_highlight_rules").TextHighlightRules;

var r = new TextHighlightRules()
r.$rules = {
    start: [
        {token: "anchor", regex: /[\^\$]|\\[bBAZzG]/, merge:false},
        {token: "backRef", regex: /\\([1-9]|k(<\w+\b[+-]?\d>|'\w+\b[+-]?\d'))/, merge:false},
        {include: "charTypes", merge:false},
        {token: "charclass", regex: /\[\^?/, push: "charclass", merge:false},
        {token: "alternation", regex: /\|/, merge:false},
        {include: "quantifiers", merge:false},
        {include: "groups", merge:false},
        {include: "xGroup", merge:true}
    ],
    charTypes: [
        {token: "char", regex: /\\([tvnrbfae]|[0-8]{1,3}|x[\dA-Fa-f]{2}|x7[\dA-Fa-f]{7})/, merge:false}, // todo \cx
        {token: "charType", regex: /\.|\\[wWsSdDhH]/, merge:false},
        {token: "charProperty", regex: /\\p{\w+}/, merge:false},
        {token: "char", regex: /\\./, merge:false},
    ],
    quantifiers: [
        {token: "quantifier", regex: /([?*+]|{\d+\b,?\d*}|{,\d+})[?+]?/, merge:false}
    ],
    charclass: [
        {include: "charTypes", merge:false},
        {token: "charclass.start", regex: /\[\^?/, push: "charclass", merge:false},
        {token: "charclass.end", regex: /\]/, next: "pop", merge:false}
    ],
    groups: [
        {token: "group", regex: /[(]([?](#|[imx\-]+:?|:|=|!|<=|<!|>|<\w+>|'\w+'|))?|[)]/,
            onMatch: function(val, state, stack) {
                if (!stack.groupNumber)
                    stack.groupNumber = 1;

                var isStart = val !== ")";
                var t = {depth:0,type: isStart ? "group.start" : "group.end", value: val};
                t.groupType = val[2];

                if (val == "(") {
                    t.number = stack.groupNumber++;
                    t.isGroup = true
                } else if (t.groupType == "'" || (t.groupType == "<" && val.slice(-1) == ">")) {
                    t.name = val.slice(2, -1)
                    t.isGroup = true
                } else if (t.groupType == ":") {
                    t.isGroup = true
                }

                if (t.groupType && val.indexOf("x") != -1) {
                    var minus = val.indexOf("-");
                    if (minus == -1 || minus > val.indexOf("x"))
                        stack.xGroup = t;
                    else
                        stack.xGroup = null;
                } else if (!isStart && stack.xGroup && stack.xGroup == stack[0]) {
                    if (stack.xGroup.value.slice(-1) == ":")
                        stack.xGroup = null;
                }

                if (isStart) {
                    if (stack.groupDepth) {
                        stack[0].hasChildren = true
                    }
                    stack.groupDepth = (stack.groupDepth||0)+1;
                    stack.unshift(t)
                } else {
                    stack.groupDepth --;
                    t.start = stack.shift(t)
                    t.start.end = t
                }
                return [t]
            }, merge:false
        }
    ],
    xGroup: [
        {token: "text", regex:/\s+/, onMatch: function(val, state, stack) {
            return stack.xGroup ? [] : "text"
        }, merge: true},
        {token: "text", regex: /#/, onMatch: function(val, state, stack) {
            if (stack.xGroup) {
                this.next = "comment";
                stack.unshift(state);
                return  [];
            }
            this.next = "";
            return "text";
        }, merge: true}
    ],
    comment: [{
        regex: "[^\n\r]*|^", token: "",  onMatch: function(val, state, stack) {
            this.next = stack.shift();
            return [];
        }
    }]
}
r.normalizeRules()
var tmReTokenizer = new Tokenizer(r.getRules());

function tokenize(str) {
    return tmReTokenizer.getLineTokens(str).tokens;
}

function toStr(tokens) { return tokens.map(function(x){return x.value}).join("")}


exports.tokenize = tokenize;
exports.toStr = toStr;
exports.tmReTokenizer = tmReTokenizer;