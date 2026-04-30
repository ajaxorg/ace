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
                m && m[1].length <= indent.length + 3
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

    var listBlockScope = {
        type: "while",
        state: "listBlock",
        name: "start listBlock",
        contentName: "start listBlock lineStart",
        token: "indent",
        regex: /(^[ \t]*$)|(^(?=[ ]*[*+-](?:[ \t]+|$)|[ ]*\d+[.)](?:[ \t]+|$)))|(^(?=[ ]{4,}|\t))|(^(?= {1,3}\S))|(^(?=[^\s>]))/,
        ruleScope: "start listBlock lineStart"
    };
    function getListMarkerToken(value, line) {
        var indent = value.length;
        if (/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s{5,}\S/.test(line)) {
            indent = value.match(/^\s{0,3}(?:[*+-]|\d{1,9}[.)])\s/)[0].length;
        }
        return "markup.list." + indent;
    }
    var codeFirstListBlockStartRule = {
        token: "markup.list",
        regex: /(^)([ ]{0,3})((?:[*+-]|\d{1,9}[.)])\s)(?=(\s{4,}\S))/,
        ruleScope: "start listBlock",
        onMatch: function(value, state, stack, line) {
            normalizeListStackForMarker(stack, (/^([ ]{0,3})/.exec(value) || ["", ""])[1].length);
            return getListMarkerToken(value, line);
        },
        scope: listBlockScope
    };
    var listBlockStartRule = { // list
        token: "markup.list",
        regex: /(^)([ ]{0,3})((?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$))/,
        ruleScope: "start listBlock",
        onMatch: function(value, state, stack, line) {
            normalizeListStackForMarker(stack, (/^([ ]{0,3})/.exec(value) || ["", ""])[1].length);
            return getListMarkerToken(value, line);
        },
        scope: listBlockScope
    };
    var paragraphListBlockStartRule = {
        token: "markup.list",
        regex: /(^)([ ]{0,3})((?:[*+-]|1[.)])\s{1,4})/,
        ruleScope: "start listBlock",
        onMatch: listBlockStartRule.onMatch,
        scope: listBlockScope
    };
    var paragraphCodeFirstListBlockStartRule = {
        token: "markup.list",
        regex: /(^)([ ]{0,3})((?:[*+-]|1[.)])\s)(?=(\s{4,}\S))/,
        ruleScope: "start listBlock",
        onMatch: codeFirstListBlockStartRule.onMatch,
        scope: listBlockScope
    };
    var nestedListBlockStartRule = { // nested list
        token: "markup.list",
        regex: /(^)([ ]{4,})((?:[*+-]|\d{1,9}[.)])(?:\s{1,4}|$))/,
        ruleScope: "start listBlock",
        onMatch: listBlockStartRule.onMatch,
        scope: listBlockStartRule.scope
    };

    var blockquoteStartRule = { // block quote
        token: "string.blockquote",
        regex: /^\s{0,3}>/,
        next: "blockquote"
    };
    var listCodeBlockStartRule = {
        token: "support.function",
        regex: /(?<=^[ ]*(?:[*+-]|\d{1,9}[.)])(?:\s{1,4}))(```+[^`]*|~~~+[^~]*)$/,
        onMatch: codeBlockStartRule.onMatch,
        next: codeBlockStartRule.next
    };
    function createInlineScopeRule(token, regex, state, endRegex) {
        return {
            token: token,
            regex: regex,
            ruleScope: token,
            scope: {
                type: "begin",
                state: state,
                name: token,
                contentName: token,
                regex: endRegex,
                ruleScope: token
            }
        };
    }
    function createCodeSpanRule() {
        return {
            token: "support.function",
            regex: /(?<!`)(`+)(?!`)/,
            ruleScope: "support.function",
            scope: {
                type: "begin",
                state: "codeSpan",
                name: "support.function",
                contentName: "support.function",
                regex: "(?<!`)\\1(?!`)",
                ruleScope: "support.function"
            }
        };
    }
    function createHtmlCommentRule() {
        return createScopedRegionRule("comment", /<!--/, "htmlComment", /-->/, "comment");
    }
    function createScopedRegionRule(token, regex, state, endRegex, contentToken) {
        return {
            token: token,
            regex: regex,
            scope: {
                type: "begin",
                state: state,
                name: token,
                contentName: contentToken || token,
                regex: endRegex,
                ruleScope: token
            }
        };
    }
    function createLinkTitleOpener(regex, stateName) {
        return createScopedRegionRule("string", regex, stateName, regex.source || regex, "string");
    }
    function createLinkLabelState(defaultToken, closeToken) {
        return [
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
                token: closeToken || "text",
                regex: /\](?=$)/,
                next: "start"
            }, {
                token: closeToken || "text",
                regex: /\]/,
                next: "pop"
            }, {defaultToken: defaultToken}
        ];
    }

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
    function pushListBlankMarker(stack) {
        takeListBlankMarker(stack);
        stack.unshift({$markdownListBlank: true});
    }
    function hasListBlankMarker(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownListBlank)
                return true;
        }
        return false;
    }
    function takeListBlankMarker(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].$markdownListBlank)
                return stack.splice(i, 1)[0];
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
    function getActiveScopedFrameIndex(stack) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] && stack[i].kind === "scope")
                return i;
        }
        return -1;
    }
    function popActiveScopedFrame(stack) {
        var index = getActiveScopedFrameIndex(stack);
        if (index < 0)
            return;
        if (index > 0 && typeof stack[index - 1] == "string")
            stack.splice(index - 1, 2);
        else
            stack.splice(index, 1);
    }
    function normalizeListStackForMarker(stack, markerIndent) {
        while (true) {
            var activeFrame = getActiveScopedFrame(stack);
            if (!activeFrame || activeFrame.state != "listBlock")
                return;
            var activeIndent = ((activeFrame.captures || [])[1] || "").length;
            if (markerIndent > activeIndent)
                return;
            popActiveScopedFrame(stack);
        }
    }
    function getListCaptures(stack) {
        for (var i = 0; i < stack.length; i++) {
            var frame = stack[i];
            if (!frame || frame.kind !== "scope" || frame.state != "listBlock")
                continue;
            var captures = frame.captures || [];
            if (captures[2])
                return captures;
        }
        return [];
    }
    function isIndentedListCode(lineIndent, captures, line) {
        if (/^\s*(?:[*+-]|\d+[.)])(?:\s{1,4}|$)/.test(line))
            return false;
        var markerIndent = (captures[1] || "").length;
        var markerText = captures[2] || "";
        var markerWidth = (captures[2] || "").length;
        var contentIndent = markerIndent + markerWidth;
        if (!/\s$/.test(markerText))
            return lineIndent >= markerIndent + 4;
        if (captures[3] != null)
            return lineIndent >= contentIndent + 4;
        if (markerWidth <= 4)
            return lineIndent >= contentIndent + 4;
        if (lineIndent >= markerIndent + 4 && lineIndent < contentIndent)
            return true;
        return /^ {8,}\S/.test(line);
    }

    var escapeSymbols = /\\[\\!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/;
    //TODO: * _ exclude?????
    var punctuation = "*_!\"#$%&'()+,\\-./:;<=>?@\\[\\]^`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B";
    var punctuationAndSpaces = "\\s" + punctuation;
    var punctuationNoDelims = punctuation.replace("*_", "");

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
            }, codeFirstListBlockStartRule, listBlockStartRule, codeBlockStartRule, blockquoteStartRule, {
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
            }, {
                token: "markup.list",
                regex: paragraphListBlockStartRule.regex,
                ruleScope: paragraphListBlockStartRule.ruleScope,
                onMatch: paragraphListBlockStartRule.onMatch,
                scope: paragraphListBlockStartRule.scope
            }, {
                token: "markup.list",
                regex: paragraphCodeFirstListBlockStartRule.regex,
                ruleScope: paragraphCodeFirstListBlockStartRule.ruleScope,
                onMatch: paragraphCodeFirstListBlockStartRule.onMatch,
                scope: paragraphCodeFirstListBlockStartRule.scope
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
            }, createCodeSpanRule(), { // images
                token: "text",
                regex: /!\[(?=[^\]])/,
                push: "imageLabel"
            }, { // reference
                token: "text",
                regex: /\[(?=[^\]])/,
                push: "linkLabel"
            }, createInlineScopeRule(
                "string.strong",
                "(?<=[\\s]|^)[*]{2}(?=[^\\s])|[*]{2}(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation + "])[*]{2}(?=[^\\s])",
                "strongAsterisk",
                "(?<=[^\\s])[*]{2}(?=[\\s]|$)|(?<=[^" + punctuationAndSpaces + "])[*]{2}|(?<=[^\\s])[*]{2}(?=[" + punctuation + "])"
            ), createInlineScopeRule(
                "string.strong",
                "(?<=[" + punctuation + "])[_]{2}(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation + "])[_]{2}(?=[^\\s]|^)|(?<=[\\s])[_]{2}(?=[^" + punctuationAndSpaces + "])|(?<=[\\s]|^)[_]{2}(?=[^\\s])",
                "strongUnderscore",
                "(?<=[^" + punctuationAndSpaces + "])[_]{2}(?=[" + punctuationAndSpaces + "]|$)|(?<=[^\\s])[_]{2}(?=[" + punctuationAndSpaces + "]|$)"
            ), createInlineScopeRule(
                "string.emphasis",
                "(?<=[\\s]|^)[*](?![*])(?=[^\\s])|[*](?![*])(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation + "])[*](?![*])(?=[^\\s])",
                "emphasisAsterisk",
                "(?<=[^\\s])[*](?=[\\s]|$)|(?<=[^" + punctuationAndSpaces + "])[*](?![*](?=[^" + punctuationAndSpaces + "]))|(?<=[^\\s])[*](?=[" + punctuationNoDelims + "])(?![*](?=[^" + punctuationAndSpaces + "]))"
            ), createInlineScopeRule(
                "string.emphasis",
                "(?<=[" + punctuation + "])[_](?![_])(?=[^" + punctuationAndSpaces + "])|(?<=[" + punctuation + "])[_](?![_])(?=[^\\s]|^)|(?<=[\\s])[_](?![_])(?=[^" + punctuationAndSpaces + "])|(?<=[\\s]|^)[_](?![_])(?=[^\\s])",
                "emphasisUnderscore",
                "(?<=[^" + punctuationAndSpaces + "])[_](?![_](?=[^" + punctuationAndSpaces + "]))(?=[" + punctuationAndSpaces + "]|$)|(?<=[^\\s])[_](?=[" + punctuationNoDelims + "\\s]|$)(?![_](?=[^" + punctuationAndSpaces + "]))"
            ), { // extended autolink
                token: "url.underline",
                regex: /(?:(?:https?:\/\/(www\.)?)|(?:www\.))[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*\.[a-zA-Z0-9-\/\?\=()&+]+/
            }, { // autolink
                token: ["text", "url.underline", "text"],
                regex: /(<)?((?:[-.\w+]+@[-a-z0-9]+(?:\.[-a-z0-9]+)*\.[a-z]+)|(?:[a-zA-Z][a-zA-Z0-9+.-]+:[\w\/]+))(>)?/
            }, {include: "tag"}, createHtmlCommentRule()
        ],
        "codeSpan": [
            {
                token: "support.function",
                regex: /(?=$)/
            }, {
                defaultToken: "support.function"
            }
        ],
        "htmlComment": [
            {defaultToken: "comment"}
        ],
        "emphasisAsterisk": [
            {include: "basic"}, {
                defaultToken: "string.emphasis"
            }
        ],
        "emphasisUnderscore": [
            {include: "basic"}, {
                defaultToken: "string.emphasis"
            }
        ],
        "strongAsterisk": [
            {include: "basic"}, {
                defaultToken: "string.strong"
            }
        ],
        "strongUnderscore": [
            {include: "basic"}, {
                defaultToken: "string.strong"
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
            codeFirstListBlockStartRule,
            listBlockStartRule
        ],
        "listBlock": [
            { // HR
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            },
            {
                token: "text",
                regex: /^ {1,3}(?=\S)(?![*+-](?:\s{1,4}|$)|\d+[.)](?:\s{1,4}|$)|>|\s*`{3,}|\s*~{3,}).+$/,
                onMatch: function(value, state, stack, line) {
                    var captures = getListCaptures(stack);
                    var markerText = captures[2] || "";
                    var markerWidth = (captures[2] || "").length;
                    this.nextState = state;
                    if (!/\s$/.test(markerText) && hasListBlankMarker(stack)) {
                        takeListBlankMarker(stack);
                        this.nextState = "start";
                        return this.token;
                    }
                    if (captures[3] == null && markerWidth > 4) {
                        takeListBlankMarker(stack);
                        this.nextState = "start";
                        return this.token;
                    }
                    takeListBlankMarker(stack);
                    return "list";
                },
                next: function(currentState) {
                    var nextState = this.nextState || currentState;
                    this.nextState = null;
                    return nextState;
                }
            },
            codeFirstListBlockStartRule,
            listBlockStartRule,
            nestedListBlockStartRule,
            {
                token: "empty_line",
                regex: /^[ \t]*$/,
                onMatch: function(value, state, stack) {
                    pushListBlankMarker(stack);
                    return this.token;
                }
            },
            {
                token : "support.variable",
                regex : /\[[ x]\]/,
                onMatch: function (value, state, stack, line) {
                    takeListBlankMarker(stack);
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
                    takeListBlankMarker(arguments[2]);
                    return "markup.list";
                },
                regex: /(?<=^\s*)(?:[*+-]|\d+[.)])(?:\s{1,4}|$)/
            }, listCodeBlockStartRule, codeBlockStartRule, {
                token: "support.function",
                regex: /\s*(```[^`]*```)/,
                onMatch: function(value, state, stack) {
                    takeListBlankMarker(stack);
                    return this.token;
                }
            }, {
                token: "list",
                regex: /^([ ]{4,}|\t)(.+$)/,
                onMatch: function(value, state, stack, line) {
                    takeListBlankMarker(stack);
                    var match = line.match(/^([ ]{4,}|\t)(.+$)/);
                    var indentPart = match[1];
                    var rest = match[2];
                    var captures = getListCaptures(stack);
                    var lineIndent = indentPart.length;
                    var type = isIndentedListCode(lineIndent, captures, line, stack)
                        ? "support.function" : "list";
                    return [
                        {type: "indent", value: indentPart},
                        {type: type, value: rest}
                    ];
                }
            }, {
                token: "text",
                regex: /^\S.*$/,
                onMatch: function(value, state, stack) {
                    this.nextState = state;
                    if (hasListBlankMarker(stack)) {
                        takeListBlankMarker(stack);
                        this.nextState = "start";
                        return this.token;
                    }
                    return "list";
                },
                next: function(currentState) {
                    var nextState = this.nextState || currentState;
                    this.nextState = null;
                    return nextState;
                }
            }, {include: "containerBlockInlinesList"}, {include: "basic"}, {
                token: function(value, state, stack, line) {
                    takeListBlankMarker(stack);
                    var captures = getListCaptures(stack);
                    var lineIndent = /^ */.exec(line)[0].length;
                    return isIndentedListCode(lineIndent, captures, line, stack)
                        ? "support.function" : "list";
                },
                regex: /.+$/
            }, {defaultToken: "list"}
        ],
        "blockquote": [
            codeFirstListBlockStartRule, listBlockStartRule, codeBlockStartRule, { // Blockquotes only escape on blank lines.
                token: "string.blockquote",
                regex: /^[\s>]*$/,
                next: "start"
            }, { // HR
                token: "constant.thematic_break",
                regex: /^\s{0,2}(?:(?:\s?\*\s*){3,}|(?:\s?-\s*){3,}|(?:\s?_\s*){3,})\s*$/,
                next: "start"
            }, {include: "containerBlockInlinesBlockquote"}, {include: "basic"}, {defaultToken: "string.blockquote"}
        ],

        "linkLabel": createLinkLabelState("constant", "text"),
        "imageLabel": createLinkLabelState("constant", "text"),
        "linkDestination": [
            {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                token: "text",
                regex: /(\s+)/,
                next: "linkTitle"
            }, createScopedRegionRule("punctuation", /</, "linkDestinationAngle", />/, "markup.underline"), {
                token: "markup.underline",
                regex: /(\S+)/,
                onMatch: function(value) {
                    return this.token;
                }
            }, {
                token: "text",
                regex: /(?=[^<\s])/,
                next: "pop"
            }, {
                token: "empty",
                regex: /$/,
                next: "pop"
            },
            //TODO: and includes parentheses only if (a) they are backslash-escaped or (b) they are part of a balanced pair of unescaped parentheses. (Implementations may impose limits on parentheses nesting to avoid performance issues, but at least three levels of nesting should be supported.)
            {defaultToken: "markup.underline"}
        ],
        "linkDestinationAngle": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                defaultToken: "markup.underline"
            }
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
                token: "text",
                regex: /(\s+)/,
                next: "linkTitleInner"
            }, createScopedRegionRule("punctuation", /</, "linkDestinationInnerAngle", />/, "markup.underline"), {
                token: "markup.underline",
                regex: /([^\s\)]+)/,
                onMatch: function(value) {
                    return this.token;
                }
            }, {
                token: "text",
                regex: /(?=[^<\s\)])/,
                next: "pop"
            },
            //TODO: and includes parentheses only if (a) they are backslash-escaped or (b) they are part of a balanced pair of unescaped parentheses. (Implementations may impose limits on parentheses nesting to avoid performance issues, but at least three levels of nesting should be supported.)
            {defaultToken: "markup.underline"}
        ],
        "linkDestinationInnerAngle": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                defaultToken: "markup.underline"
            }
        ],
        "linkTitle": [
            {
                token: "empty_line",
                regex: /^\s*$/,
                next: "pop"
            }, createScopedRegionRule("string", /'/, "linkTitleSingle", /'/, "string"), createScopedRegionRule("string", /"/, "linkTitleDouble", /"/, "string"), createScopedRegionRule("string", /\(/, "linkTitleParen", /\)/, "string"), {
                token: "text",
                regex: /(?=[^"'(\s])/,
                next: "pop"
            }, {
                token: "empty",
                regex: /$/,
                next: "pop"
            }
        ],
        "linkTitleSingle": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                defaultToken: "string"
            }
        ],
        "linkTitleDouble": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                defaultToken: "string"
            }
        ],
        "linkTitleParen": [
            {
                token: "constant.language.escape",
                regex: escapeSymbols
            }, {
                defaultToken: "string"
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
            }, createScopedRegionRule("string", /'/, "linkTitleSingle", /'/, "string"), createScopedRegionRule("string", /"/, "linkTitleDouble", /"/, "string"), createScopedRegionRule("string", /\(/, "linkTitleParen", /\)/, "string"), {
                token: ["text", "paren.rpar"],
                regex: /(\s*)(\))/,
                next: "pop"
            }, {
                token: "text",
                regex: /(?=[^"'(\s])/,
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
            }, codeFirstListBlockStartRule, listBlockStartRule, { // list
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
            createHtmlCommentRule(), {include: "tag"}, {
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
                    pushTagContext(
                        stack,
                        state,
                        match[2],
                        state === "html" && /^(script|style|pre)$/i.test(match[2])
                    );
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
            createScopedRegionRule(
                "string.attribute-value.xml",
                /'/,
                "attribute_value_single",
                /'/,
                "string.attribute-value.xml"
            ),
            createScopedRegionRule(
                "string.attribute-value.xml",
                /"/,
                "attribute_value_double",
                /"/,
                "string.attribute-value.xml"
            )
        ],
        "attribute_value_single": [
            {include: "attr_reference"},
            {defaultToken: "string.attribute-value.xml"}
        ],
        "attribute_value_double": [
            {include: "attr_reference"},
            {defaultToken: "string.attribute-value.xml"}
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
