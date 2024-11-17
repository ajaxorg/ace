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
        var mode = isRegexp ? "regex" : "literal"
        var session = inputEditor.session;
        if (session.$modeId == mode) return;
        var textMode = new TextMode();
        textMode.$highlightRules = new textMode.HighlightRules();
        var rules = {
            "literal": [
                {defaultToken: "text"}
            ],
            "regex": [
                {
                    // escapes
                    token: "regexp.keyword.operator",
                    regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                }, {
                    // invalid operators
                    token : "invalid",
                    regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
                }, {
                    // operators
                    token : "constant.language.escape",
                    regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
                }, {
                    token : "constant.language.delimiter",
                    regex: /\|/
                }, {
                    token: "constant.language.escape",
                    regex: /\[\^?/,
                    next: "regex_character_class"
                }
            ],
            "regex_character_class": [
                {
                    token: "regexp.charclass.keyword.operator",
                    regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                }, {
                    token: "constant.language.escape",
                    regex: "]",
                    next: "regex"
                }, {
                    token: "constant.language.escape",
                    regex: "-"
                }, {
                    defaultToken: "string.regexp.charachterclass"
                }
            ],
        };

        rules.start = rules[mode] || rules.literal;
        textMode.$highlightRules.$rules = rules;
        textMode.$highlightRules.normalizeRules();

        session.setMode(textMode);
        session.$modeId = mode;
    }
}

exports.LibSearch = LibSearch;
