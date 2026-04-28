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
        token : "support.function",
        regex : /^\s*(```+[^`]*|~~~+[^~]*)$/,
        onMatch: function(value, state, stack) {
            var m = value.match(/^(\s*)([`~]+)(.*)/);
            var language = /[\w-]+|$/.exec(m[3])[0];
            // TODO lazy-load modes
            if (!modes[language])
                language = "";
            stack.unshift("githubblock", [], [m[1], m[2], language], state);
            return this.token;
        },
        next  : "githubblock"
    };
    var codeBlockRules = [{
        token : "support.function",
        regex : ".*",
        onMatch: function(value, state, stack) {
            var embedState = stack[1];
            var indent = stack[2][0];
            var endMarker = stack[2][1];
            var language = stack[2][2];

            var m = /^(\s*)(`+|~+)\s*$/.exec(value);
            if (
                m && m[1].length < indent.length + 3
                && m[2].length >= endMarker.length && m[2][0] == endMarker[0]
            ) {
                stack.splice(0, 3);
                this.next = stack.shift();
                return this.token;
            }
            this.next = "";
            if (language && modes[language]) {
                var data = modes[language].getTokenizer().getLineTokens(value, embedState.slice(0));
                stack[1] = data.state;
                return data.tokens;
            }
            return this.token;
        }
    }];

    var listBlockStartRule = { // list
        token: "markup.list",
        regex: /(^)([ ]{0,3})((?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$))/,
        ruleScope: "start listBlock",
        onMatch: function(value, state, stack, line) {
            var indent = value.length;
            if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
                indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
            }
            return this.token + "." + indent;
        },
        scope: {
            type: "while",
            state: "listBlock",
            name: "start listBlock",
            contentName: "start listBlock lineStart",
            token: "indent",
            regex: /(^[ \t]*$)|(^(?=[ ]*[*+-](?:[ \t]+|$)|[ ]*\d+[.)](?:[ \t]+|$)))|(^(?=[ ]{4,}|\t))|(^(?= {1,3}\S))/,
            ruleScope: "start listBlock lineStart"
        }
    };
    var nestedListBlockStartRule = { // nested list
        token: "markup.list",
        regex: /(^)([ ]{4,})(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$)/,
        ruleScope: "start listBlock",
        onMatch: listBlockStartRule.onMatch,
        scope: listBlockStartRule.scope
    };

    var blockquoteStartRule = { // block quote
        token: "string.blockquote",
        regex: /^\s{0,3}>/,
        next: "blockquote"
    };

    function pushTagContext(stack, returnState, tagName, isRaw) {
        stack.unshift({
            $markdownTagContext: true,
            returnState: returnState,
            tagName: tagName && tagName.toLowerCase(),
            isRaw: isRaw,
            htmlBlock: returnState === "html"
        });
    }
    function takeTagContext(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownTagContext)
                return stack.splice(i, 1)[0];
        }
    }
    function getRawTag(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownRawTag)
                return stack[i];
        }
    }
    function takeRawTag(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownRawTag)
                return stack.splice(i, 1)[0];
        }
    }
    function hasHtmlBlock(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownHtmlBlock)
                return true;
        }
        return false;
    }
    function pushHtmlBlock(stack) {
        if (!hasHtmlBlock(stack))
            stack.unshift({$markdownHtmlBlock: true});
    }
    function takeHtmlBlock(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownHtmlBlock)
                return stack.splice(i, 1)[0];
        }
    }
    function tagTokens(start, tagName) {
        var group = tagMap[tagName.toLowerCase()];
        return [
            {
                type: "meta.tag.punctuation." + (start == "<" ? "" : "end-") + "tag-open.xml",
                value: start
            },
            {
                type: "meta.tag" + (group ? "." + group : "") + ".tag-name.xml",
                value: tagName
            }
        ];
    }
    //TODO: this should be probably generic
    function getActiveScopedFrame(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].kind === "scope")
                return stack[i];
        }
    }

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
            }, {   // code block
                token: "support.function",
                regex: /\s*(```[^`]*```)/
            }, { // autolink
                token: ["text", "url", "text"],
                regex: /(<)((?:[-.\w+]+@[-a-z0-9]+(?:\.[-a-z0-9]+)*\.[a-z]+)|(?:[a-zA-Z][a-zA-Z0-9+.-]+:[^\s><]*))(>)/
            }, {
                token: "indent",
                regex: /^\s{0,3}(?=<\/?[a-zA-Z])/,
                onMatch: function(value, state, stack) {
                    pushHtmlBlock(stack);
                    return this.token;
                },
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
                include: "lists"
            }, codeBlockStartRule, {
                token: "support.function",
                regex: /\s*(```[^`]*```)/
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
                token : "support.function",
                regex : /``/,
                push: "codeSpan2"
            }, { // code span `
                token : "support.function",
                regex : /`/,
                push: "codeSpan1"
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
                regex: /(?:(?:https?:\/\/(www\.)?)|(?:www\.))[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*\.[a-zA-Z0-9-\/\?\=()&+]+/
            }, { // autolink
                token: ["text", "url.underline", "text"],
                regex: /(<)?((?:[-.\w+]+@[-a-z0-9]+(?:\.[-a-z0-9]+)*\.[a-z]+)|(?:[a-zA-Z][a-zA-Z0-9+.-]+:[\w\/]+))(>)?/
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
                next: "pop"
            }, {
                defaultToken: "support.function"
            }
        ],
        "codeSpan1": [
            {
                token: "support.function",
                regex: /`/,
                next: "pop"
            }, {
                defaultToken: "support.function"
            }
        ],
        "codeSpan2": [
            {
                token: "support.function",
                regex: /``/,
                next: "pop"
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
                next: "start"
            }, {
                token: "empty",
                regex: /^\s*$/,
                next: "start"
            }, {
                include: "basic"
            }, {
                defaultToken: "heading"
            }
        ],
        "lists": [
            listBlockStartRule
        ],
        "listBlock": [
            { // HR
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            },
            listBlockStartRule,
            nestedListBlockStartRule,
            {
                token : "support.variable",
                regex : /\[[ x]\]/,
                onMatch: function (value, state, stack, line) {
                    if (/[*+-]\s(\[[ x]\]\s)/.test(line)) {
                        return this.token;
                    }
                    return "list";
                }
            },
            { // block quote
                token: "string.blockquote",
                regex: /\s*>\s?/,
                next: "blockquote"
            }, { // sublist
                token: function (value) {
                    return "markup.list";
                },
                regex: /(?<=^\s*)(?:[*+-]|\d+[.)])(?:\s{1,4}|$)/
            }, {
                regex: /^([ ]{4,}|\t)(.+$)/,
                onMatch: function(value, state, stack, line) {
                    var match = line.match(/^([ ]{4,}|\t)(.+$)/);
                    var indentPart = match[1];
                    var rest = match[2];
                    var activeFrame = getActiveScopedFrame(stack);
                    var captures = activeFrame && activeFrame.captures || [];
                    var markerIndent = (captures[1] || "").length;
                    var contentIndent = markerIndent + (captures[2] || "").length;
                    var lineIndent = indentPart.length;
                    var type = (lineIndent >= markerIndent + 4 && lineIndent < contentIndent)
                        || /^ {8,}\S/.test(line)
                        ? "support.function"
                        : "list";
                    return [
                        {type: "indent", value: indentPart},
                        {type: type, value: rest}
                    ];
                }
            }, {include: "containerBlockInlinesList"}, codeBlockStartRule, {include: "basic"}, {
                token: function(value, state, stack, line) {
                    var activeFrame = getActiveScopedFrame(stack);
                    var captures = activeFrame && activeFrame.captures || [];
                    var markerIndent = (captures[1] || "").length;
                    var contentIndent = markerIndent + (captures[2] || "").length;
                    var lineIndent = /^ */.exec(line)[0].length;
                    if (lineIndent >= markerIndent + 4 && lineIndent < contentIndent)
                        return "support.function";
                    return /^ {8,}\S/.test(line) ? "support.function" : "list";
                },
                regex: /.+$/
            }, {defaultToken: "list"}
        ],
        "blockquote": [
            listBlockStartRule, codeBlockStartRule, { // Blockquotes only escape on blank lines.
                token: "string.blockquote",
                regex: /^[\s>]*$/,
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
                regex: /\](?=$)/,
                next: "start"
            }, {
                token: "text",
                regex: /\]/,
                next: "pop",
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
            nestedListBlockStartRule,
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
                onMatch: function (value, state, stack, line) {
                    var indent = value.length;
                    if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
                        indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
                    }
                    if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s*$/.test(line)) {
                        indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])/)[0].length + 1;
                    }
                    return this.token + "." + indent;
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
                token: "empty",
                regex: /^(?! {4,}|\t)/,
                next: "start"
            },
            {defaultToken: "support.function"}
        ],
        "html": [
            {
                regex: /(<)(script|style|pre)/,
                onMatch: function (value, state, stack) {
                    var tagName = value.substr(1);
                    pushTagContext(stack, state, tagName, true);
                    return tagTokens("<", tagName);
                },
                next: "tag_stuff"
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
                onMatch: function(value, state, stack) {
                    var rawTag = getRawTag(stack);
                    if (state === "innerTagSpace" && rawTag && rawTag.htmlBlock) {
                        takeRawTag(stack);
                        takeHtmlBlock(stack);
                        this.next = "start";
                    } else if (hasHtmlBlock(stack)) {
                        takeHtmlBlock(stack);
                        this.next = "start";
                    } else if (state === "innerTagSpace") {
                        this.next = "innerTagSpace";
                    } else {
                        this.next = "start";
                    }
                    return this.token;
                },
                next: "start"
            }, {
                token: "empty",
                regex: /$/,
                onMatch: function(value, state, stack) {
                    if (state === "innerTagSpace")
                        this.next = "innerTagSpace";
                    else
                        this.next = hasHtmlBlock(stack) ? "html" : "start";
                    return this.token;
                },
                next: "html"
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
                regex: /(<\/?)([a-zA-Z][-_a-zA-Z0-9:.]*)/,
                onMatch: function (value, state, stack) {
                    var match = value.match(this.regex);
                    pushTagContext(stack, state, match[2], false);
                    return tagTokens(match[1], match[2]);
                }
                ,
                next: "tag_stuff"
            }
        ],
        tag_stuff: [
            {include: "attributes"}, {
                token: "meta.tag.punctuation.tag-close.xml",
                regex: /\/?>/,
                onMatch: function (value, state, stack) {
                    var context = takeTagContext(stack);
                    if (context && context.isRaw && value != "/>") {
                        stack.unshift({
                            $markdownRawTag: true,
                            tagName: context.tagName,
                            returnState: context.returnState,
                            htmlBlock: hasHtmlBlock(stack) || context.htmlBlock
                        });
                        this.next = "innerTagSpace";
                    } else if (context && context.returnState === "innerTagSpace") {
                        this.next = "innerTagSpace";
                    } else {
                        this.next = "html";
                    }
                    return this.token;
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
                onMatch: function (value, state, stack, line) {
                    var tokens = value.split(this.splitRegex);
                    var rawTag = getRawTag(stack);
                    if (rawTag && tokens[2].toLowerCase() === rawTag.tagName) {
                        takeRawTag(stack);
                        if (/(<\/)(script|style|pre)(>)(.+)/.test(line))
                            this.next = "html";
                        else if (rawTag.htmlBlock)
                            this.next = "start";
                        else
                            this.next = rawTag.returnState || "start";
                        return [
                            {
                                type: "meta.tag.punctuation.end-tag-open.xml",
                                value: tokens[1]
                            }, {
                                type: "meta.tag.tag-name.xml",
                                value: tokens[2]
                            }, {
                                type: "meta.tag.punctuation.tag-close.xml",
                                value: tokens[3]
                            }
                        ];
                    }
                    this.next = "innerTagSpace";
                    return "text";
                }
            }, {
                token: "empty",
                regex: /^\s*$/,
                onMatch: function (value, state, stack) {
                    var rawTag = getRawTag(stack);
                    if (rawTag && rawTag.htmlBlock) {
                        takeRawTag(stack);
                        takeHtmlBlock(stack);
                        this.next = "start";
                    } else {
                        this.next = "innerTagSpace";
                    }
                    return this.token;
                },
                next: "innerTagSpace"
            }, {
                include: "html"
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
