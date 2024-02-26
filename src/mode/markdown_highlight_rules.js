"use strict";

var modes = require("../config").$modes;

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var lang = require("../lib/lang");

var tagMap = lang.createMap({
    a: 'anchor',
    button: 'form',
    form: 'form',
    img: 'image',
    input: 'form',
    label: 'form',
    option: 'form',
    script: 'script',
    select: 'form',
    textarea: 'form',
    style: 'style',
    table: 'table',
    tbody: 'table',
    td: 'table',
    tfoot: 'table',
    th: 'table',
    tr: 'table'
});
var MarkdownHighlightRules = function () {
    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used
    var codeBlockStartRule = {
        token: "support.function",
        regex: /\s*(```+[^`]*|~~~+[^~]*)/,
        onMatch: function (value, scope, stack, line) {
            var m = line.match(/^(\s*)([`~]+)(.*)/);
            var language = /[\w-]+|$/.exec(m[3])[0];
            // TODO lazy-load modes
            if (!modes[language]) language = "";
            if (scope.name == "blockquote") {
                return scope.parent.get("start").get(this.token);
            }
            
            var parent = scope.get("codeBlock" + language);
            parent.language = language;
            parent.indent = m[1].length;
            parent.endMarker = m[2];
            return parent.get(this.next).get(this.token);
        },
        next: "githubblock"
    };
    var codeBlockRules = [
        {
            token: "support.function",
            regex: /.*/,
            onMatch: function (value, scope, stack, line) {
                if (scope.parent) {
                    var indent = scope.parent.indent;
                    var endMarker = scope.parent.endMarker;
                    var language = scope.parent.language;
                    var m = /^(\s*)(`+|~+)\s*$/.exec(value);
                    if (m && m[1].length < indent + 3 && m[2].length >= endMarker.length && m[2][0] === endMarker[0]) {
                        if (scope.parent.parent.name === 'listBlock') {
                            return scope.parent.parent.get("lineStart").get(this.token);
                        }
                        return scope.parent.parent.get(this.token);
                    }
                    if (language && modes[language]) {
                        var data = modes[language].getTokenizer().getLineTokens(value, scope);
                        return data.tokens;
                    }
                }

                return scope.get(this.token);
            }
        }
    ];

    var listBlockStartRule = { // list
        token: "markup.list",
        regex: /^\s{0,3}(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/,
        onMatch: function (value, scope, stack, line) {
            var indent = value.length;
            var emptyList = false;
            var minIndent = value.match(/^(\s{0,3})(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/)[1].length;
            if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
                indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
            }
            if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s*$/.test(line)) {
                indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])/)[0].length + 1;
                emptyList = true;
            }
            var parent = scope.get("listBlock", minIndent + ":" + indent);
            parent.indent = indent;
            parent.minIndent = indent;
            if (emptyList) {
                parent = parent.get("listBlockEmpty").get("lineStart");
            }
            return parent.get(this.token + '.' + indent);
        },
        next: "listBlock"
    };

    var blockquoteStartRule = { // block quote
        token: "string.blockquote",
        regex: /^\s{0,3}>/,
        next: "blockquote"
    };

    var escapeSymbols = /\\[\\!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/;
    //TODO: * _ exclude?????
    var punctuation = "*_!\"#$%&'()+,\\-./:;<=>?@\\[\\]^`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B";
    var punctuationAndSpaces = "\\s" + punctuation;

    this.$rules = {
        "start": [
            { // HR * - _
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            }, {   // code block
                token: "support.function",
                regex: /^ {4,}/,
                next: "codeBlockInline"
            }, {
                token: "support.function",
                regex: /\s*(```[^`]*```)/
            }, { // autolink
                token: ["text", "url", "text"],
                regex: /(<)((?:[-.\w+]+@[-a-z0-9]+(?:\.[-a-z0-9]+)*\.[a-z]+)|(?:[a-zA-Z][a-zA-Z0-9+.-]+:[^\s><]*))(>)/
            }, {
                token: "indent",
                regex: /^\s{0,3}(?=<\/?[a-zA-Z])/,
                next: "html"
            }, listBlockStartRule, codeBlockStartRule, blockquoteStartRule, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }, {
                token: "empty",
                regex: "",
                onMatch: function (value, scope, stack, line) {
                  if (/^ {4,}/.test(line)) {
                      this.next = "codeBlockInline";
                      return "support.function";
                  }
                  this.next = "paragraph";
                  return "empty";
                },
                next: "paragraph"
            }
        ]
    };

    this.addRules({
        "paragraph": [
            {
                token: function (value) {
                    return "markup.heading." + value.match(/#/g).length;
                },
                regex: /^\s{0,3}#{1,6}$/
            }, {
                token: function (value) {
                    return "markup.heading." + value.match(/#/g).length;
                },
                regex: /^\s{0,3}#{1,6}(?=\s|$)/,
                push: "header"
            },
            blockquoteStartRule, { // h1
                token: "markup.heading.1",
                regex: /^\s{0,3}=+(?=\s*$)/,
                next: "start"
            }, { // h2
                token: "markup.heading.2",
                regex: /^\s{0,3}\-+(?=\s*$)/,
                next: "start"
            }, { // HR * - _
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            }, { // list start with 1. or * or -
                token: "markup.list",
                regex: /^\s{0,3}(?:[*+-]|1[.)])(?:\s{1,4})/,
                onMatch: function (value, scope, stack, line) {
                    var indent = value.length;
                    var minIndent = value.match(/^(\s{0,3})(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/)[1].length;
                    if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
                        indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
                    }
                    var parent = scope.parent.get("start").get("listBlock", minIndent + ":" + indent);
                    parent.indent = indent;
                    parent.minIndent = indent;
                    return parent.get(this.token + '.' + indent);
                },
                next: "listBlock"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }, {include: "basic"}
        ],
        "basic": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, { // code span `
                token: "support.function",
                regex: /(`{1,2})/,
                onMatch: function (value, scope, stack, line) {
                    if (scope.name === "paragraph") {
                        scope = scope.parent.get("start");
                    }
                    var parent = scope.get("codeSpan", value.length);
                    parent.codeNum = value.length;
                    return parent.get(this.token);
                },
                next: "codeSpan"
            }, { // images
                token: "text",
                regex: /!\[(?=[^\]])/,
                push: "imageLabel"
            }, { // reference
                token: "text",
                regex: /\[(?=[^\]])/,
                push: "linkLabel"
            }, {include: "strongStates"}, {
                token: "string.emphasis",
                regex: "(?<=[\\s]|^)[*](?=[^\\s])|[*](?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation
                    + "])[*](?=[^\\s])",
                push: "emphasisState"
            }, {
                token: "string.emphasis",
                regex: "(?<=[" + punctuation + "])[_](?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation
                    + "])[_](?=[^\\s]|^)|(?<=[\\s])[_](?=[^" + punctuationAndSpaces + "])|(?<=[\\s]|^)[_](?=[^\\s])",
                push: "barEmphasisState"
            }, { // extended autolink
                token: "url.underline",
                regex: /www\.[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*\.[a-zA-Z0-9-]+/
            }, { // autolink
                token: ["text", "url.underline", "text"],
                regex: /(<)?((?:[-.\w+]+@[-a-z0-9]+(?:\.[-a-z0-9]+)*\.[a-z]+)|(?:[a-zA-Z][a-zA-Z0-9+.-]+:[^\s><]*))(>)?/
            }, {include: "tag"}, {
                token: "comment",
                regex: /<!--/,
                next: [
                    {
                        token: "comment",
                        regex: /-->/,
                        next: "start"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            }
        ],
        "codeSpan": [
            {
                token: "support.function",
                regex: /(`{1,2})/,
                onMatch: function (value, scope, stack, line) {
                    if (scope.codeNum === value.length) {
                        return scope.parent.get(this.token);
                    }
                    return scope.get(this.token);
                }
            }, {
                defaultToken: "support.function"
            }
        ],
        "emphasisState": [
            {include: "strongStates"}, {
                token: "string.emphasis",
                regex: "(?<=[^\\s])[*](?=[\\s]|$)|(?<=[^" + punctuationAndSpaces + "])[*]|(?<=[^\\s])[*](?=["
                    + punctuation + "])",
                next: "pop"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "pop"
            }, {include: "basic"}, {
                defaultToken: "string.emphasis"
            }
        ],
        "barEmphasisState": [
            {include: "strongStates"}, {
                token: "string.emphasis",
                regex: "(?<=[^" + punctuationAndSpaces + "])[_](?=[" + punctuationAndSpaces + "]|$)|(?<=[^\\s])[_](?=["
                    + punctuationAndSpaces + "]|$)",
                next: "pop"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "pop"
            }, {include: "basic"},
            {
                defaultToken: "string.emphasis"
            }
        ],
        "strongState": [
            {
                token: "string.strong",
                regex: "(?<=[^\\s])[*]{2}(?=[\\s]|$)|(?<=[^" + punctuationAndSpaces + "])[*]{2}|(?<=[^\\s])[*]{2}(?=["
                    + punctuation + "])",
                next: "pop"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "pop"
            }, {include: "basic"},
            {
                defaultToken: "string.strong"
            }
        ],
        "barStrongState": [
            {
                token: "string.strong",
                regex: "(?<=[^" + punctuationAndSpaces + "])[_]{2}(?=[" + punctuationAndSpaces
                    + "]|$)|(?<=[^\\s])[_]{2}(?=[" + punctuationAndSpaces + "]|$)",
                next: "pop"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "pop"
            }, {include: "basic"},
            {
                defaultToken: "string.strong"
            }
        ],
        "strongStates": [
            {
                token: "string.strong",
                regex: "(?<=[\\s]|^)[*]{2}(?=[^\\s])|[*]{2}(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation
                    + "])[*]{2}(?=[^\\s])",
                push: "strongState"
            },  {
                token: "string.strong",
                regex: "(?<=[" + punctuation + "])[_]{2}(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation
                    + "])[_]{2}(?=[^\\s]|^)|(?<=[\\s])[_]{2}(?=[^" + punctuationAndSpaces
                    + "])|(?<=[\\s]|^)[_]{2}(?=[^\\s])",
                push: "barStrongState"
            }
        ],
        "header": [
            {
                token: "heading",
                regex: /(?=$)/,
                onMatch: function (value, scope, stack, line) {
                    return scope.parent.parent.get("start").get(this.token);
                }
            }, {
                token: "empty",
                regex: /^\s*$/,
                onMatch: function (value, scope, stack, line) {
                    return scope.parent.parent.get("start").get(this.token);
                }
            }, {
                include: "basic"
            }, {
                defaultToken: "heading"
            }
        ],
        "listBlock": [
            {
                token : "support.variable",
                regex : /\[[ x]\]/,
                onMatch: function (value, scope, stack, line) {
                    if (/[*+-]\s(\[[ x]\]\s)/.test(line)) {
                        return this.token;
                    }
                    return "list";
                }
            },
            { // block quote
                token: "string.blockquote",
                regex: /\s*>\s?/,
                onMatch: function (value, scope, stack, line) {
                    var currentIndent;
                    this.next = '';
                    if (/(?<=^\s*[*+-]\s|\d{1,9}[.)]\s)([\s]*)>/.test(line)) {
                        currentIndent = line.match(/(?<=^\s*[*+-]\s|\d{1,9}[.)]\s)([\s]*)>/)[0].length;
                    }
                    else {
                        if (/^([\s]*)>/.test(line)) {
                            currentIndent = line.match(/^([\s]*)>/)[0].length;
                        }
                        else {
                            return "list";
                        }
                    }

                    var checker = false;
                    var currentScope = scope;

                    if (scope.parent.name === "listBlockEmpty") {
                        if (/(?:[*+-]|\d+[.)])\s+/.test(line)) {
                            if (currentIndent >= 4) {
                                return scope.get("codeBlockInline").get("support.function");
                            }
                        }
                        else if (currentIndent >= scope.parent.parent.indent + 4) {
                            return scope.get("codeBlockInline").get("support.function");
                        }
                    }

                    while (checker === false) {
                        if (currentScope.parent.name === "start") checker = true;
                        if (currentScope.indent <= currentIndent) {
                            checker = true;
                        }
                        if (checker === false) {
                            currentScope = currentScope.parent;
                        }
                    }
                    if (currentIndent > currentScope.indent + 4) {
                        return scope.get("list." + currentScope.parent.indent);
                    }
                    return currentScope.get("blockquote").get(this.token + '.' + currentScope.indent);
                },
                next: "blockquote"
            }, { // HR
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                onMatch: function (value, scope, stack, line) {
                    var currentScope = scope.parent;
                    while (currentScope.name !== "start") {
                        currentScope = currentScope.parent;
                    }
                    return currentScope.get(this.token);
                }
            }, { // sublist
                token: function (value, scope) {
                    return "markup.list." + scope.indent;
                },
                regex: /(?<=^\s*)(?:[*+-]|\d+[.)])(?:\s{1,4}|$)/
            }, {include: "containerBlockInlinesList"}, codeBlockStartRule, {include: "basic"}, {
                token: "empty",
                regex: /(?=$)/,
                push: "lineStart"
            }, {defaultToken: "list"}
        ],
        "lineStart": [
            {
                token: "indent",
                regex: /^\s*/,
                onMatch: function (value, scope, stack, line) {
                    var currentScope = scope.parent;
                    if (/^\s*$/.test(line)) {
                        if (currentScope.name !== "listBlockEmpty") {
                            currentScope = currentScope.get("listBlockEmpty");
                        }
                        return currentScope.get("lineStart").get("empty");
                    }
                    else {
                        var currentIndent = value.length;
                        var checker = false;

                        while (checker === false) {
                            if (currentScope.parent.name === "start") {
                                checker = true;
                            }

                            if (currentScope.indent <= currentIndent) {
                                checker = true;
                            }
                            if (checker === false) {
                                currentScope = currentScope.parent;
                            }
                        }
                        if (/^[\s]*(?:[*+-]|\d+[.)])\s{1,4}/.test(line)) {
                            var sublistIndent = line.match(/^[\s]*(?:[*+-]|\d{1,9}[.)])\s{1,4}/)[0].length;
                            if ((scope.parent.name === "listBlockEmpty" && currentIndent
                                >= currentScope.parent.parent.indent && currentIndent
                                <= currentScope.parent.parent.indent + 3) || (currentIndent >= currentScope.indent
                                && currentIndent <= currentScope.indent + 3)) {
                                currentScope = scope.get("listBlock", currentIndent + ":" + sublistIndent);
                                currentScope.indent = sublistIndent;
                                currentScope.minIndent = currentIndent;
                                return currentScope.get(this.token);
                            }
                            currentScope = currentScope.parent.get("listBlock", currentIndent + ":" + sublistIndent);
                            currentScope.indent = sublistIndent;
                            currentScope.minIndent = currentIndent;
                        }
                        if (scope.parent.name === "listBlockEmpty") {
                            if (currentIndent >= scope.parent.parent.indent + 4) {
                                return scope.get("codeBlockInline").get("support.function");
                            }
                        }
                        if (scope.parent.name === "listBlockEmpty" && (currentScope.parent.parent.indent
                            && currentScope.parent.parent.indent > currentIndent || !currentScope.parent.parent.indent
                            && currentScope.indent > currentIndent) && !/^[\s>]*(?:[*+-]|\d+[.)])\s+/.test(line)) {
                            var parentState = (currentScope.parent.parent.indent) ? currentScope.parent.parent.parent
                                : currentScope.parent;
                            return parentState.parent.get("start").get(this.token);
                        }
                        return currentScope.get(this.token);
                    }
                }
            }
        ],

        "blockquote": [
            listBlockStartRule, codeBlockStartRule, { // Blockquotes only escape on blank lines.
                token: "string.blockquote",
                regex: /^[\s>]*$/,
                onMatch: function (value, scope, stack, line) {
                    this.next = "start";
                    var parent = scope;
                    if (scope.parent.name === "listBlock") {
                        parent = scope.get("listBlockEmpty");
                        parent = parent.get("lineStart");
                        return parent.get(this.token);
                    }
                    return this.token;
                },
                next: "start"
            }, { // HR
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            }, {include: "containerBlockInlinesBlockquote"}, {include: "basic"}, {defaultToken: "string.blockquote"}
        ],

        "linkLabel": [
            {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {include: "basic"}, {
                token: "text",
                regex: /\[/,
                next: "pop"
            }, {
                token: ["text", "paren.lpar", "text"],
                regex: /(\])(\()(\s*)/,
                next: "linkDestinationInner"
            }, {
                token: "text",
                regex: /\]:\s*/,
                next: "linkDestination"
            }, {
                token: "text",
                regex: /\]/,
                next: "start",
                onMatch: function (value, scope, stack, line) {
                    var parent = scope;
                    while (parent.name != "markdown") {
                        parent = parent.parent;
                    }
                    return parent.get("start").get(this.token);
                }
            }, {defaultToken: "constant"}
        ],
        "imageLabel": [
            {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {
                token: "string",
                regex: /\[/,
                next: "pop"
            }, {
                token: ["text", "paren.lpar", "text"],
                regex: /(\])(\()(\s*)/,
                next: "linkDestinationInner"
            }, {
                token: "text",
                regex: /\]:\s*/,
                next: "linkDestination"
            }, {
                token: "text",
                regex: /\]\s*/,
                next: "pop"
            }, {defaultToken: "constant"}
        ],
        "linkDestination": [
            {
                token: "empty_line",
                regex: /^\\s*$/,
                next: "pop"
            }, {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                token: "punctuation",
                regex: /</,
                next: [
                    {
                        token: "empty",
                        regex: /$/,
                        next: "pop"
                    }, {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: ["punctuation", "text"],
                        regex: /(>)(\s+)/,
                        next: "linkTitle"
                    }, {
                        token: "punctuation",
                        regex: /(>)/,
                        next: "pop"
                    }, {defaultToken: "markup.underline"}
                ]
            }, {
                token: "markup.underline",
                regex: /(\S+)/,
                next: [
                    {
                        token: "text",
                        regex: /(\s+)|^(\s*)/,
                        next: "linkTitle"
                    }
                ]
            }, {
                token: "text",
                regex: /(\s+)/
            },//TODO: and includes parentheses only if (a) they are backslash-escaped or (b) they are part of a balanced pair of unescaped parentheses. (Implementations may impose limits on parentheses nesting to avoid performance issues, but at least three levels of nesting should be supported.)
            {defaultToken: "markup.underline"}
        ],
        "linkDestinationInner": [
            {
                token: "paren.rpar",
                regex: /(?<!\\)\)/,
                next: "pop"
            }, {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {
                token: "punctuation",
                regex: /</,
                next: [
                    {
                        token: "empty",
                        regex: /$/,
                        next: "pop"
                    }, {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: ["punctuation", "text"],
                        regex: /(>)(\s*)/,
                        next: "linkTitleInner"
                    }, {
                        defaultToken: "markup.underline"
                    }
                ]
            }, {
                token: "markup.underline",
                regex: /([^\s\)]+)/,
                next: [
                    {
                        token: "text",
                        regex: /(\s+)|^(\s*)/,
                        next: "linkTitleInner"
                    }, {
                        token: "paren.rpar",
                        regex: /(?<!\\)\)/,
                        next: "pop"
                    }, {defaultToken: "markup.underline"}
                ]
            }, {
                token: "text",
                regex: /(\s+)/
            },//TODO: and includes parentheses only if (a) they are backslash-escaped or (b) they are part of a balanced pair of unescaped parentheses. (Implementations may impose limits on parentheses nesting to avoid performance issues, but at least three levels of nesting should be supported.)
            {defaultToken: "markup.underline"}
        ],
        "linkTitle": [
            {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {
                token: "string",
                regex: /(')/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: "string",
                        regex: /'|^'/,
                        next: "pop"
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "string",
                regex: /(")/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: "string",
                        regex: /"|^"/,
                        next: "pop"
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "string",
                regex: /(\()/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: "string",
                        regex: /\)|^\)/,
                        next: "pop"
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "text",
                regex: /(?=[^"'(\s]+)/,
                next: "pop"
            }
        ],
        "linkTitleInner": [
            {
                token: "paren.rpar",
                regex: /\)/,
                next: "pop"
            }, {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {
                token: "string",
                regex: /(')/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: ["string", "text"],
                        regex: /(')(\s*)/,
                        next: [
                            {
                                token: ["text", "paren.rpar"],
                                regex: /(\s*)(\))/,
                                next: "pop"
                            }, {
                                token: "empty_line",
                                regex: /^\s*$/,
                                next: "pop"
                            }
                        ]
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "string",
                regex: /(")/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: ["string", "text"],
                        regex: /(")(\s*)/,
                        next: [
                            {
                                token: ["text", "paren.rpar"],
                                regex: /(\s*)(\))/,
                                next: "pop"
                            }, {
                                token: "empty_line",
                                regex: /^\s*$/,
                                next: "pop"
                            }
                        ]
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "string",
                regex: /(\()/,
                next: [
                    {
                        token: "constant.language.escape",
                        regex: escapeSymbols
                    }, {
                        token: "empty_line",
                        regex: /^\s*$/,
                        next: "pop"
                    }, {
                        token: ["string", "text"],
                        regex: /(\))(\s*)/,
                        next: [
                            {
                                token: ["text", "paren.rpar"],
                                regex: /(\s*)(\))/,
                                next: "pop"
                            }, {
                                token: "empty_line",
                                regex: /^\s*$/,
                                next: "pop"
                            }
                        ]
                    }, {defaultToken: "string"}
                ]
            }, {
                token: "text",
                regex: /(?=[^"'(\s]+)/,
                next: "pop"
            }, {defaultToken: "text"}
        ],

        "githubblock": codeBlockRules,
        "containerBlockInlinesBlockquote": [
            {//atx heading for block construction
                token: function (value) {
                    return "markup.heading." + value.match(/#/g).length;
                },
                regex: /(?<=[>])\s{0,3}#{1,6}(?=\s|$)/,
                push: "header"
            }, {   // code block
                token: "support.function",
                regex: /(?<=[>] {5})./,
                push: "codeBlockInline"
            }, { // list
                token: "markup.list",
                regex: /(?<=[>]\s{0,4})(?:[*+-]|\d{1,9}[.)])\s{1,4}/,
                next: "listBlockInline"
            }, { // HR
                token: "constant.thematic_break",
                regex: /(?<=[>])\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
            }, {defaultToken: "string.blockquote"}
        ],
        "containerBlockInlinesList": [
            {   // code block
                token: "support.function",
                regex: /(?<=[*+-]\s{1,4}|\d{1,9}[.)]\s{1,4}) .*$/
            }, {//atx heading for block construction
                token: function (value) {
                    return "markup.heading." + value.match(/#/g).length;
                },//TODO: heading for indented lists
                regex: /(?<=[*+-]\s{1,4}|\d{1,9}[.)]\s{1,4})#{1,6}(?=\s|$)/,
                push: "header"
            }, { // HR
                token: "constant.thematic_break",
                regex: /(?<=[*+-]\s{1,4}|\d{1,9}[.)]\s{1,4})(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            }
        ],
        "listBlockInline": [
            {   // code block
                token: "support.function",
                regex: / {5}./,
                next: "codeBlockInline"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }, { // list
                token: "markup.list",
                regex: /^\s{0,3}(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/,
                onMatch: function (value, scope, stack, line) {
                    var indent = value.length;
                    var emptyList = false;
                    var minIndent = value.match(/^(\s{0,3})(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/)[1].length;
                    if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
                        indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
                    }
                    if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s*$/.test(line)) {
                        indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])/)[0].length + 1;
                        emptyList = true;
                    }
                    var currentScope = scope.parent;
                    while (currentScope.name !== "markdown") {
                        currentScope = currentScope.parent;
                    }
                    var parent = currentScope.get("start").get("listBlock", minIndent + ":" + indent);
                    parent.indent = indent;
                    parent.minIndent = indent;
                    if (emptyList) {
                        parent = parent.get("listBlockEmpty").get("lineStart");
                    }
                    return parent.get(this.token + '.' + indent);
                },
                next: "listBlock"
            }, blockquoteStartRule, { // block quote
                token: "string.blockquote",
                regex: /(?<=[*+-]\s{1,4}|\d{1,9}[.)]\s{1,4})\s{0,3}>/,
                next: "blockquoteInline"
            }, {include: "basic"}, {defaultToken: "list"}
        ],
        "blockquoteInline": [
            {   // code block
                token: "support.function",
                regex: / {5}./,
                next: "codeBlockInline"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }, listBlockStartRule, { // list
                token: "markup.list",
                regex: /(?<=[>])\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{1,4}/,
                next: "listBlockInline"
            }, {include: "basic"}, {defaultToken: "string.blockquote"}
        ],
        "codeBlockInline": [
            {
                token: "support.function",
                regex: /(?=$)/,
                onMatch: function (value, scope, stack, line) {
                    if (scope.parent.name === "markdown") {
                        return scope.parent.get("start").get(this.token);
                    }
                    else if (scope.parent.name === "blockquote") {
                        return scope.parent.parent.get("start").get(this.token);
                    }
                    return scope.parent.get(this.token);
                }
            }, {defaultToken: "support.function"}
        ],
        "html": [
            {
                regex: /(<)(script|style|pre)/,
                onMatch: function (value, scope, stack, line) {
                    var tagName = value.substr(1);
                    stack.unshift(tagName);
                    return [
                        {
                            type: scope.get("meta.tag.punctuation.tag-open.xml"),
                            value: "<"
                        }, {
                            type: scope.get("meta.tag.tag-name.xml"),
                            value: tagName
                        }
                    ];
                },
                next: function (scope, stack) {
                    var tagName = stack[0];
                    stack = [];
                    var parent = scope.get("innerTagSpace", tagName);
                    parent.tagName = tagName;
                    return parent.get("tag_stuff");
                }
            }, {
                token: "comment",
                regex: /<!--/,
                next: [
                    {
                        token: "comment",
                        regex: /-->/,
                        next: "start"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            }, {include: "tag"}, {
                token: "empty",
                regex: /^\s*$/,
                onMatch: function (value, scope) {
                    var currentScope = scope;
                    while (currentScope.name !== "markdown") {
                        currentScope = currentScope.parent;
                    }
                    return currentScope.get("start").get(this.token);
                }
            }, {
                token: "empty",
                regex: /$/,
                onMatch: function (value, scope) {
                    if (scope.parent.name === "html") {
                        return scope.parent.parent.get("start").get(this.token);
                    }
                    return scope.get(this.token);
                }
            }
        ],
        attributes: [
            {
                token: "text.tag-whitespace.xml",
                regex: /\s+/
            }, {
                token: "entity.other.attribute-name.xml",
                regex: /[-_a-zA-Z0-9:.]+/
            }, {
                token: "keyword.operator.attribute-equals.xml",
                regex: /=/,
                push: [
                    {
                        token: "text.tag-whitespace.xml",
                        regex: /\s+/
                    }, {
                        token: "string.unquoted.attribute-value.html",
                        regex: /[^<>='"`\s]+/,
                        next: "pop"
                    }, {
                        token: "empty",
                        regex: "",
                        next: "pop"
                    }
                ]
            }, {
                include: "attribute_value"
            }
        ],
        tag: [
            {
                token: function (start, tag) {
                    var group = tagMap[tag];
                    return [
                        "meta.tag.punctuation." + (start == "<" ? "" : "end-") + "tag-open.xml",
                        "meta.tag" + (group ? "." + group : "") + ".tag-name.xml"
                    ];
                },
                regex: /(<\/?)([a-zA-Z][-_a-zA-Z0-9:.]*)/,
                next: function (scope, stack) {
                    if (scope.name === "html") {
                        return scope.parent.get("tag_stuff");
                    }
                    return scope.get("tag_stuff");
                }
            }
        ],
        tag_stuff: [
            {include: "attributes"}, {
                token: "meta.tag.punctuation.tag-close.xml",
                regex: /\/?>/,
                onMatch: function (value, scope, stack, line) {
                    if (scope.parent.name === "innerTagSpace") {
                        if (scope.parent.parent.htmlBlock) {
                            var parent = scope.parent.parent.get("innerTagSpace", scope.parent.tagname + "inHtmlBlock");
                            parent.htmlBlock = true;
                            parent.tagName = scope.parent.tagname;
                            return parent.get(this.token);
                        }
                        return scope.parent.get(this.token);
                    }
                    if (scope.parent.name !== "markdown") {
                        return scope.parent.get(this.token);
                    }
                    var parent = scope.parent.get(this.next, "htmlBlock");
                    parent.htmlBlock = true;
                    return parent.get(this.token);
                },
                next: "html"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }
        ],
        "innerTagSpace": [
            {
                regex: /(<\/)(script|style|pre)(>)/,
                onMatch: function (value, scope, stack, line) {
                    var tokens = value.split(this.splitRegex);
                    if (tokens[2] === scope.tagName) {
                        if (/(<\/)(script|style|pre)(>)(.+)/.test(line)) {
                            stack[0] = "html";
                        }
                        else {
                            stack[0] = "start";
                        }
                        return [
                            {
                                type: scope.get("meta.tag.punctuation.end-tag-open.xml"),
                                value: tokens[1]
                            }, {
                                type: scope.get("meta.tag.tag-name.xml"),
                                value: tokens[2]
                            }, {
                                type: scope.get("meta.tag.punctuation.tag-close.xml"),
                                value: tokens[3]
                            }
                        ];
                    }
                    return scope.get("text");
                },
                next: function (scope, stack) {
                    if (stack.length > 0) {
                        if (stack[0] === "start") {
                            stack = [];
                            return scope.parent.parent.get("start");
                        }
                        else {
                            stack = [];
                            return scope.parent.get("html");
                        }
                    }
                }
            }, {
                token: "empty",
                regex: /^\s*$/,
                onMatch: function (value, scope, stack, line) {
                    if (scope.htmlBlock) {
                        var currentScope = scope;
                        while (currentScope.name !== "markdown") {
                            currentScope = currentScope.parent;
                        }
                        return currentScope.get("start").get(this.token);
                    }
                    return scope.get(this.token);
                }
            }
        ],
        "attribute_value": [
            {
                token: "string.attribute-value.xml",
                regex: "'",
                push: [
                    {
                        token: "string.attribute-value.xml",
                        regex: "'",
                        next: "pop"
                    }, {include: "attr_reference"}, {defaultToken: "string.attribute-value.xml"}
                ]
            }, {
                token: "string.attribute-value.xml",
                regex: '"',
                push: [
                    {
                        token: "string.attribute-value.xml",
                        regex: '"',
                        next: "pop"
                    }, {include: "attr_reference"}, {defaultToken: "string.attribute-value.xml"}
                ]
            }
        ],
        attr_reference: [
            {
                token: "constant.language.escape.reference.attribute-value.xml",
                regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
            }
        ]
    });

    this.normalizeRules();
};
oop.inherits(MarkdownHighlightRules, TextHighlightRules);

exports.MarkdownHighlightRules = MarkdownHighlightRules;
