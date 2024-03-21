/** @typedef {import("../../../ace-internal").Ace.InputEditor} InputEditor */

var TextMode = require("../../mode/text").Mode;
var HashHandler = require("../../keyboard/hash_handler").HashHandler;

class LibSearch {
    constructor() {
        this.keyStroke = "";
    }

    /**
     * @param {InputEditor} inputEditor
     * @param {"replace"|"search"} type
     * @return {HashHandler}
     */
    addSearchKeyboardHandler(inputEditor, type) {
        var _self = this;
        inputEditor.saveHistory = function () {
            _self.saveHistory(this.getValue(), this.session);
        };

        inputEditor.session.searchHistory = [];
        var iSearchHandler = new HashHandler();
        iSearchHandler.bindKeys({
            "Up": function (/**@type {InputEditor}*/editor) {
                if (editor.getCursorPosition().row > 0) return false;

                _self.navigateList("next", editor);
                editor.selection.moveCursorFileStart();
                editor.selection.clearSelection();
            },
            "Down": function (/**@type {InputEditor}*/editor) {
                if (editor.getCursorPosition().row < editor.session.getLength() - 1) return false;

                _self.navigateList("prev", editor);
                editor.selection.lead.row = editor.session.getLength() - 1;
            },
            "Ctrl-Home": function (/**@type {InputEditor}*/editor) {
                _self.navigateList("first", editor);
            },
            "Ctrl-End": function (/**@type {InputEditor}*/editor) {
                _self.navigateList("last", editor);
            },
            "Ctrl-Return": function (/**@type {InputEditor}*/editor) {
                editor.insert(editor.session.doc.getNewLineCharacter());
            }
        });

        iSearchHandler.handleKeyboard = function (data, hashId, keyString, keyCode) {
            if (keyString == "\x00") return;
            var command = this.findKeyCommand(hashId, keyString);
            var editor = data.editor;
            if (!command) return;

            var success = editor.execCommand(command);
            if (success !== false) return {command: "null"};
        };
        inputEditor.setKeyboardHandler(iSearchHandler);
        return iSearchHandler;
    }

    /**
     * @param {"prev"|"next"|"first"|"last"} type
     * @param {InputEditor} inputEditor
     */
    navigateList(type, inputEditor) {
        var lines = inputEditor.session.searchHistory || [];

        var value = inputEditor.getValue();
        if (value && (this.position == -1 || lines[this.position] != value)) {
            lines = this.saveHistory(value, inputEditor.session);
            this.position = 0;
        }

        if (this.position === undefined) this.position = -1;

        var next;
        if (type == "prev") {
            next = Math.max(0, this.position - 1);
            if (this.position <= 0) next = -1;

        }
        else if (type == "next") next = Math.min(lines.length - 1, this.position + 1); else if (type
            == "last") next = Math.max(lines.length - 1, 0); else if (type == "first") next = 0;

        if (next in lines && next != this.position || next == -1) {
            this.keyStroke = type;
            inputEditor.setValue(lines[next] || "", 1);
            this.keyStroke = "";
            this.position = next;
        }
    }

    /**
     *
     * @param {string} searchTxt
     * @param {import("../../../ace-internal").Ace.InputEditorEditSession} session
     * @return {string[]}
     */
    saveHistory(searchTxt, session) {
        var history = session.searchHistory || [];

        if (searchTxt && history[0] != searchTxt) {
            history.unshift(searchTxt);
            if (history.length > 200) history.splice(200, history.length);
            session.searchHistory = history;
        }

        return history;
    }

    /**
     * @param {InputEditor} inputEditor
     * @param {string} mode
     */
    setReplaceFieldMode(inputEditor, mode) {
        var session = inputEditor.session;
        if (session.$modeId == mode) return;
        var textMode = new TextMode();
        textMode.$highlightRules = new textMode.HighlightRules();
        var rules = {
            "literal": [
                {defaultToken: "text"}
            ],
            "jsOnly": [
                {
                    token: "constant.language.escape",
                    regex: /\$[\d&\$]|\\[\\nrt]/
                }
            ],
            "extended": [
                {
                    token: "constant.language.escape",
                    regex: /\$\$|\\[\\nrt]/
                }, {
                    token: "string",
                    regex: /\\\d|\$[\d&]/
                }, {
                    token: "keyword",
                    regex: /\\U/,
                    next: "uppercase"
                }, {
                    token: "keyword",
                    regex: /\\L/,
                    next: "lowercase"
                }, {
                    token: "keyword",
                    regex: /\\E/,
                    next: "start"
                }, {
                    token: "keyword",
                    regex: /\\[ul]/,
                    next: "uppercase"
                }
            ],
            "uppercase": [
                {include: "extended"}, {defaultToken: "uppercase"}
            ],
            "lowercase": [
                {include: "extended"}, {defaultToken: "lowercase"}
            ]
        };

        rules.start = rules[mode] || rules.literal;
        textMode.$highlightRules.$rules = rules;
        textMode.$highlightRules.normalizeRules();

        session.setMode(textMode);
        session.$modeId = mode;
    }

    /**
     * @param {InputEditor} inputEditor
     * @param {boolean} isRegexp
     */
    setRegexpMode(inputEditor, isRegexp) {
        var tokenizer = {}, _self = this;
        tokenizer.getLineTokens = isRegexp ? function (val) {
            return {
                tokens: _self.parseRegExp(val),
                state: ""
            };
        } : function (val) {
            return {
                tokens: [
                    {
                        value: val,
                        type: "text"
                    }
                ],
                state: ""
            };
        };
        //@ts-ignore
        inputEditor.session.bgTokenizer.tokenizer = tokenizer;
        inputEditor.session.bgTokenizer.lines = [];
        inputEditor.renderer.updateFull();

        if (this.colorsAdded) return;
        this.colorsAdded = true;
        require("../../lib/dom").importCssString("\
                .ace_r_collection {background:#ffc0808f;color:black}\
                .ace_r_escaped{color:#cb78248f}\
                .ace_r_subescaped{background:#dbef5c8f;color:orange}\
                .ace_r_sub{background:#dbef5c8f;color:black;}\
                .ace_r_replace{background:#80c0ff8f;color:black}\
                .ace_r_range{background:#80c0ff8f;color:black}\
                .ace_r_modifier{background:#80c0ff8f;color:black}\
                .ace_r_error{background:red;color:white;", "ace_regexps");
    }

    // Calculate RegExp Colors
    /**
     * @param {string} value
     */
    parseRegExp(value) {
        var re = {
            alone: {
                "^": 1,
                "$": 1,
                ".": 1
            },
            rangeStart: {
                "+": 1,
                "*": 1,
                "?": 1,
                "{": 1
            },
            replace: /^\\[sSwWbBnrd]/,
            searches: /^\((?:\?\:|\?\!|\?|\?\=|\?\<\=)/,
            range: /^([+*?]|\{(\d+,\d+|\d+,?|,?\d+)\})\??|^[$\^]/
        };
        var /**@type{number}*/l, t, c, sub = 0, collection = 0;
        var out = [];
        var push = function (text, type) {
            if (typeof text == "number") text = value.substr(0, text);
            out.push(text, type);
            value = value.substr(text.length);
        };

        // This could be optimized if needed
        while (value.length) {
            if ((c = value.charAt(0)) == "\\") {
                // \\ detection
                if (t = value.match(/^\\\\+/g)) {
                    var odd = ((l = t[0].length) % 2);
                    push(l - odd, sub > 0 ? "subescaped" : "escaped");
                    continue;
                }

                // Replacement symbols
                if (t = value.match(re.replace)) {
                    push(t[0], "replace");
                    continue;
                }

                // \uXXXX
                if (t = value.match(/^\\(?:(u)\d{0,4}|(x)\d{0,2})/)) {
                    var isError = (t[1] == "u" && t[0].length != 6) || (t[1] == "x" && t[0].length != 4);
                    push(t[0], isError ? "error" : "escaped");
                    continue;
                }

                // Escaped symbols
                push(2, "escaped");
                continue;
            }

            if (c == "|") {
                push(c, "collection");
                continue;
            }

            // Start Sub Matches
            if (c == "(") {
                sub++;
                t = value.match(re.searches);
                if (t) {
                    push(t[0], "sub");
                    continue;
                }

                push("(", "sub");
                continue;
            }

            // End Sub Matches
            if (c == ")") {
                if (sub === 0) {
                    push(")", "error");
                }
                else {
                    sub--;
                    push(")", "sub");
                }
                continue;
            }

            // Collections
            if (c == "[") {
                collection = 1;

                var ct, temp = ["["];
                for (var i = 1, l = value.length; i < l; i++) {
                    ct = value.charAt(i);
                    temp.push(ct);
                    if (ct == "[") collection++; else if (ct == "]") collection--;

                    if (!collection) break;
                }

                push(temp.join(""), "collection");
                continue;
            }

            if (c == "]" || c == "}") {
                push(c, sub > 0 ? "sub" : "text");
                continue;
            }

            // Ranges
            if (re.rangeStart[c]) {
                var m = value.match(re.range);
                if (!m) {
                    push(c, "text");
                    continue;
                }
                push(m[0], "range");
                // double quantifier is an error
                m = value.match(re.range);
                if (m) {
                    push(m[0], "error");
                    continue;
                }
                continue;
            }

            if (re.alone[c]) {
                push(c, "replace");
                if (c == ".") continue;
                var m = value.match(re.range);
                if (m) push(m[0], "error");
                continue;
            }

            // Just Text
            push(c, sub > 0 ? "sub" : "text");
        }

        // Process out ace token list
        var last = "text", res = [], token = {
            type: last,
            value: ""
        };
        for (var i = 0; i < out.length; i += 2) {
            if (out[i + 1] != last) {
                token.value && res.push(token);
                last = out[i + 1];
                token = {
                    type: "r_" + last,
                    value: ""
                };
            }
            token.value += out[i];
        }
        token.value && res.push(token);
        return res;
    }
}

exports.LibSearch = LibSearch;
