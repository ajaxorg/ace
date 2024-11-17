"use strict";
/** @typedef {import("../editor").Editor} Editor
 @typedef {import("../../ace-internal").Ace.InputEditor} InputEditor
 @typedef {import("../../ace-internal").Ace.ExtendedSearchOptions} ExtendedSearchOptions */

var dom = require("../lib/dom");
var lang = require("../lib/lang");
var event = require("../lib/event");
var searchboxCss = require("./searchbox-css");
var HashHandler = require("../keyboard/hash_handler").HashHandler;
var keyUtil = require("../lib/keys");
var nls = require("../config").nls;
var {Range} = require("../range");
var asyncSearch = require("./search/async_search");
var {$singleLineEditor} = require("../autocomplete/popup");
var {UndoManager} = require("../undomanager");
var {LibSearch} = require("./search/libsearch");

var MAX_COUNT = 999;

dom.importCssString(searchboxCss, "ace_searchbox", false);

class SearchBox {
    /**
     * @param {Editor} editor
     * @param {undefined} [range]
     * @param {undefined} [showReplaceForm]
     */
    constructor(editor, range, showReplaceForm) {
        /**@type {any}*/
        this.activeInput;
        var div = dom.createElement("div");
        dom.buildDom(["div", {class:"ace_search right"},
            ["span", {action: "hide", class: "ace_searchbtn_close"}],
            ["div", {class: "ace_search_form"}, ["div", {class: "ace_search_input_wrapper"}],
                ["span", {action: "findPrev", class: "ace_searchbtn prev"}, "\u200b"],
                ["span", {action: "findNext", class: "ace_searchbtn next"}, "\u200b"],
                ["span", {action: "findAll", class: "ace_searchbtn", title: "Alt-Enter"}, nls("All")]
            ],
            ["div", {class: "ace_replace_form"}, ["div", {class: "ace_search_input_wrapper"}],
                ["span", {action: "replaceAndFindNext", class: "ace_searchbtn"}, nls("Replace")],
                ["span", {action: "replaceAll", class: "ace_searchbtn"}, nls("All")]
            ],
            ["div", {class: "ace_search_options"},
                ["span", {action: "toggleReplace", class: "ace_button", title: nls("Toggle Replace mode"),
                    style: "float:left;margin-top:-2px;padding:0 5px;"}, "+"],
                ["span", {class: "ace_search_counter"}],
                ["span", {action: "toggleRegexpMode", class: "ace_button", title: nls("RegExp Search")}, ".*"],
                ["span", {action: "toggleCaseSensitive", class: "ace_button", title: nls("CaseSensitive Search")}, "Aa"],
                ["span", {action: "toggleWholeWords", class: "ace_button", title: nls("Whole Word Search")}, "\\b"],
                ["span", {action: "searchInSelection", class: "ace_button", title: nls("Search In Selection")}, "S"]
            ]
        ], div);
        /**@type {any}*/
        this.element = div.firstChild;

        this.setSession = this.setSession.bind(this);

        this.$init();
        this.setEditor(editor);
        dom.importCssString(searchboxCss, "ace_searchbox", editor.container);
    }

    /**
     * @param {Editor} editor
     */
    setEditor(editor) {
        editor.searchBox = this;
        editor.renderer.scroller.appendChild(this.element);
        /**@type {Editor}*/
        this.editor = editor;
    }
    
    setSession(e) {
        this.searchRange = null;
        this.$syncOptions(true);
    }

    /**
     * @param {InputEditor} inputEditor
     * @param {"search"|"replace"} type
     */
    setupInput(inputEditor, type) {
        this.libSearch.addSearchKeyboardHandler(inputEditor, type);
        if (type === "search") {
            this.libSearch.setRegexpMode(inputEditor, this.regExpOption.checked);
        }
        else {
            this.libSearch.setReplaceFieldMode(inputEditor, "extended");
        }
        inputEditor.setOption("customScrollbar", true);
        inputEditor.session.setUndoManager(new UndoManager());
        inputEditor.commands.removeCommands([
            "find", "replace", "replaceall", "gotoline", "findnext", "findprevious", "expandtoline", "indent", "outdent"
        ]);
        inputEditor.renderer.setScrollMargin(5,4,0,0);
    }

    /**
     * @param {HTMLElement} sb
     */
    $initElements(sb) {
        /**@type {HTMLElement}*/
        this.searchBox = sb.querySelector(".ace_search_form");
        /**@type {InputEditor}*/
        this.searchInput = $singleLineEditor();
        this.searchInput.setOption("placeholder", nls("Search for"));
        this.searchBox.querySelector(".ace_search_input_wrapper").appendChild(this.searchInput.container);
        /**@type {HTMLElement}*/
        this.replaceBox = sb.querySelector(".ace_replace_form");
        /**@type {InputEditor}*/
        this.replaceInput = $singleLineEditor();
        this.replaceInput.setOption("placeholder", nls("Replace with"));
        this.replaceBox.querySelector(".ace_search_input_wrapper").appendChild(this.replaceInput.container);
        /**@type {HTMLInputElement}*/
        this.searchOption = sb.querySelector("[action=searchInSelection]");
        /**@type {HTMLInputElement}*/
        this.replaceOption = sb.querySelector("[action=toggleReplace]");
        /**@type {HTMLInputElement}*/
        this.regExpOption = sb.querySelector("[action=toggleRegexpMode]");
        /**@type {HTMLInputElement}*/
        this.caseSensitiveOption = sb.querySelector("[action=toggleCaseSensitive]");
        /**@type {HTMLInputElement}*/
        this.wholeWordOption = sb.querySelector("[action=toggleWholeWords]");
        /**@type {HTMLElement}*/
        this.searchCounter = sb.querySelector(".ace_search_counter");
        this.setupInput(this.searchInput, "search");
        this.setupInput(this.replaceInput, "replace");
    }
    
    $init() {
        this.libSearch = new LibSearch();
        
        var sb = this.element;
        
        this.$initElements(sb);
        
        var _this = this;
        event.addListener(sb, "mousedown", function(e) {
            setTimeout(function(){
                _this.activeInput.focus();
            }, 0);
            event.stopPropagation(e);
        });
        event.addListener(sb, "click", function(e) {
            var t = e.target || e.srcElement;
            var action = t.getAttribute("action");
            if (action && _this[action])
                _this[action]();
            else if (_this.$searchBarKb.commands[action])
                _this.$searchBarKb.commands[action].exec(_this);
            event.stopPropagation(e);
        });

        event.addCommandKeyListener(sb, function(e, hashId, keyCode) {
            var keyString = keyUtil.keyCodeToString(keyCode);
            var command = _this.$searchBarKb.findKeyCommand(hashId, keyString);
            if (command && command.exec) {
                command.exec(_this);
                event.stopEvent(e);
            }
        });

        this.$onChange = lang.delayedCall(function() {
            _this.find(false, false);
        });

        event.addListener(this.searchInput, "input", function() {
            _this.$onChange.schedule(20);
        });
        event.addListener(this.searchInput, "focus", function() {
            _this.activeInput = _this.searchInput;
            _this.searchInput.getValue() && _this.highlight();
        });
        event.addListener(this.replaceInput, "focus", function() {
            _this.activeInput = _this.replaceInput;
            _this.searchInput.getValue() && _this.highlight();
        });
    }

    /**
     * @param {Range} range
     */
    setSearchRange(range) {
        this.searchRange = range;
        if (range) {
            this.searchRangeMarker = this.editor.session.addMarker(range, "ace_active-line");
        } else if (this.searchRangeMarker) {
            this.editor.session.removeMarker(this.searchRangeMarker);
            this.searchRangeMarker = null;
        }
    }

    /**
     * @param {boolean} [preventScroll]
     */
    $syncOptions(preventScroll) {
        dom.setCssClass(this.replaceOption, "checked", this.searchRange != null);
        dom.setCssClass(this.searchOption, "checked", this.searchOption.checked);
        this.replaceOption.textContent = this.replaceOption.checked ? "-" : "+";
        dom.setCssClass(this.regExpOption, "checked", this.regExpOption.checked);
        dom.setCssClass(this.wholeWordOption, "checked", this.wholeWordOption.checked);
        dom.setCssClass(this.caseSensitiveOption, "checked", this.caseSensitiveOption.checked);
        var readOnly = this.editor.getReadOnly();
        this.replaceOption.style.display = readOnly ? "none" : "";
        this.replaceBox.style.display = this.replaceOption.checked && !readOnly ? "" : "none";
        this.find(false, false, preventScroll);
    }

    /**
     * @param {RegExp} [re]
     */
    highlight(re) {
        this.editor.session.highlight(re || this.editor.$search.$options.re);
        this.editor.renderer.updateBackMarkers();
    }

    /**
     *
     * @return {Partial<ExtendedSearchOptions>}
     */
    getOptions() {
        var options = {
            wrap: true,
            caseSensitive: this.caseSensitiveOption.checked,
            wholeWord: this.wholeWordOption.checked,
            regExp: this.regExpOption.checked,
            range: this.searchRange,
            needle: this.searchInput.getValue()
        };
        return options;
    }

    /**
     * @param {boolean} skipCurrent
     * @param {boolean} backwards
     * @param {boolean} [preventScroll]
     * @param {(arg0: import("../../ace-internal").Ace.SearchResultCallbackArgs) => void} [callback]
     */
    find(skipCurrent, backwards, preventScroll, callback) {
        var options = this.getOptions();
        options.skipCurrent = skipCurrent;
        options.backwards = backwards;
        options.preventScroll = preventScroll;
        //TODO: type highlight is onfocus from editor to searchbox?
        
        this.execFind(options, callback);
    }

    /**
     * @param {Partial<ExtendedSearchOptions>} options
     * @param {(results?: import("../../ace-internal").Ace.SearchResultCallbackArgs) => void} [callback]
     */
    execFind(options, callback) {
        var isHighlight = false; //TODO: change it somewhere 

        var selectAll = (result) => {
            var indexArray = result.matches;
            var value = result.value;
            var startIndex = result.offset;
            var re = options.re;
            if (!indexArray.length) return;

            var doc = this.editor.session.doc;
            var ranges = [];
            var startPos = {
                row: 0,
                column: 0
            };
            var endPos = {
                row: 0,
                column: 0
            };
            var start = 0, end = 0, offset = 0;
            for (var i = 0; i < indexArray.length; i++) {
                var index = indexArray[i] + startIndex;
                re.lastIndex = index;
                var match = re.exec(value);
                var txt = match[0];
                var len = txt.length;
                startPos = doc.indexToPosition(index + offset - start + startPos.column, startPos.row);
                start = index + offset;
                end = index + len + offset;
                endPos = doc.indexToPosition(end - start + startPos.column, startPos.row);
                ranges.push(Range.fromPoints(startPos, endPos));
            }
            this.editor.selection.fromJSON(ranges);
        };

        var range = this.editor.selection.getRange();

        if (options.skipCurrent) this.searchInput.saveHistory();

        if (options.skipCurrent || !this.currentRange) this.currentRange = range;

        options.start = this.currentRange;

        /*TODO: if (options.range && !isHighlight)
            addFindInRangeMarker(options.range, ace.session);
        else if (!options.range)
            removeFindInRangeMarker();*/

        var re = this.editor.$search.$assembleRegExp(options, true);
        if (!re) {
            this.counterResults = null;
            this.updateCounter();
            if (!isHighlight) {
                var pos = options.start[options.backwards ? "end" : "start"];
                var newRange = options.range || Range.fromPoints(pos, pos);
                this.editor.revealRange(newRange);
            }
            return callback && callback();
        }

        if (!isHighlight) {
            this.lastSearchOptions = options;
        }

        options.re = re;
        options.source = re.source;
        options.flags = re.ignoreCase ? "igm" : "gm";

        this.editor.$search.set(options);
        this.editor.$search.set({start: range});

        asyncSearch.execFind(this.editor.session, options, (result) => {
            if (result == "waiting") {
                this.counterResults = null;
                return this.updateCounter();
            }

            result = result || {
                total: 0,
                current: 0
            };
            if ("total" in result) {
                this.counterResults = {
                    total: result.total,
                    current: result.current,
                    wrapped: result.wrapped
                };
                this.updateCounter();
            }
            if (!result.start || !result.end) {
                result.start = result.end = range[!options.backwards ? "start" : "end"];
            }
            var newRange = Range.fromPoints(result.start, result.end);

            if (options.range && newRange.isEmpty()) newRange = options.range;
            if (options.skipCurrent) this.currentRange = newRange;

            if (!isHighlight) {
                this.editor.revealRange(newRange);
            }

            if (options.preventScroll) return;
            if (newRange) {
                this.editor.revealRange(newRange);
            }
            if (options.findAll) {
                selectAll(result);
            }
            else {
                this.highlight(re);
            }

            callback && callback(result);
        });
    }

    updateCounter() {
        var msg = "";

        var color = this.counterResults && this.counterResults.wrapped ? "blue" : "";

        if (this.counterResults && typeof this.counterResults.total == "number" && typeof this.counterResults.current
            == "number") {
            if (!this.counterResults.total) {
                this.counterResults.current = 0;
                color = "red";
            }
            else {
                this.counterResults.current = this.counterResults.current + 1;
            }
            msg = this.counterResults.current + "/" + this.counterResults.total + msg;
        }
        this.searchCounter.style.color = color;
        this.searchCounter.textContent = msg;
    }
    findNext() {
        this.find(true, false);
    }
    findPrev() {
        this.find(true, true);
    }
    findAll(){
        var options = this.getOptions();
        options.findAll = true;
        this.execFind(options);
        this.hide();
    }

    replace() {
        if (this.editor.getReadOnly()) {
            return;
        }

        var options = this.getOptions();
        var re = this.editor.$search.$assembleRegExp(options, true);
        var replaceFn = this.$getReplaceFunction(options);
        var range = this.editor.selection.getRange();
        this.find(false, false, false, (result) => {
            if (!this.editor.selection.getRange().isEqual(range)) return; // found new one
            if (result && typeof result !== "string" && "total" in result) {
                re.lastIndex = result.startIndex;
                var match = re.exec(result.value);
                var replacement = match && replaceFn(match);
                if (match[0] != replacement) {
                    range.end = this.editor.session.replace(range, replacement);
                }
                if (options.backwards) {
                    range.end = range.start;
                }
                else {
                    range.start = range.end;
                }
                this.editor.selection.setRange(range);
            }
        });

        this.replaceInput.saveHistory();
    }

    replaceAndFindNext() {
        if (!this.editor.getReadOnly()) {
            this.replace();
            this.findNext();
        }
    }

    /**
     * @param {() => any} [callback]
     */
    replaceAll(callback) {
        if (this.editor.getReadOnly()) return;
        var options = this.getOptions();
        var re = this.editor.$search.$assembleRegExp(options, true);
        if (!re) {
            this.counterResults = null;
            return this.updateCounter();
        }
        options.re = re;
        options.source = re.source;
        options.flags = re.ignoreCase ? "igm" : "gm";
        options.findAll = true;

        var replaceFn = this.$getReplaceFunction(options);
        //TODO: this.editor.$search.set({ preserveCase: chk.preserveCase.checked });

        asyncSearch.execFind(this.editor.session, options, (result) => {
            if (typeof result !== "string" && "matches" in result) {
                var replaced = 0;
                var indexArray = result.matches;
                var value = result.value;
                var startIndex = result.offset;
                var re = options.re;
                if (!indexArray.length) return replaced;

                var doc = this.editor.session.doc;

                var startPos = {
                    row: 0,
                    column: 0
                };
                var endPos = {
                    row: 0,
                    column: 0
                };
                var start = 0, end = 0, offset = 0;
                var range = new Range();
                for (var i = 0; i < indexArray.length; i++) {
                    var index = indexArray[i] + startIndex;
                    re.lastIndex = index;
                    var match = re.exec(value);
                    var txt = match[0];
                    var len = txt.length;
                    startPos = doc.indexToPosition(index + offset - start + startPos.column, startPos.row);
                    start = index + offset;
                    end = index + len + offset;
                    endPos = doc.indexToPosition(end - start + startPos.column, startPos.row);
                    range.start = startPos;
                    range.end = endPos;
                    var replacement = replaceFn(match);
                    if (txt != replacement) {
                        doc.replace(range, replacement);
                        offset += replacement.length - txt.length;
                    }
                }
                this.counterResults = null;
                this.updateCounter();
                callback && callback();
            }
        });

        this.replaceInput.saveHistory();
    }

    /**
     * @param {Partial<ExtendedSearchOptions>} options
     */
    $getReplaceFunction(options) {
        var val = this.replaceInput.getValue();
        //options.preserveCase = chk.preserveCase.checked; TODO:

        var fmtParts = [];

        function add(p) {
            var last = fmtParts.length - 1;
            if (p && typeof p == "string" && typeof fmtParts[last] == "string") fmtParts[last] += p; else if (typeof p
                == "number" || p) fmtParts.push(p);
        }

        var lut = {
            n: "\n",
            t: "\t",
            r: "\r",
            "&": 0,
            U: -1,
            L: -2,
            E: -3,
            u: -4,
            l: -5
        };
        var re = /\$([\$&\d])|\\([\\ULulEntr\d])/g;
        var index = 0, m;
        while ((m = re.exec(val))) {
            add(val.substring(index, m.index));
            index = re.lastIndex;
            var part = m[1] || m[2];
            // @ts-ignore
            if (/\d/.test(part)) part = options.regExp ? parseInt(part, 10) : part; else if (part
                in lut) part = lut[part];
            add(part);
        }
        add(val.substr(index));

        if (fmtParts.length == 1 && typeof fmtParts[0] == "string" && !options.preserveCase) return function () {
            return fmtParts[0];
        };

        return function (match) {
            var gChangeCase = 0;
            var changeCase = 0;
            var result = "";
            for (var i = 0; i < fmtParts.length; i++) {
                var ch = fmtParts[i];
                if (typeof ch === "number") {
                    if (ch < 0) {
                        switch (ch) {
                            case -1:
                                gChangeCase = 1;
                                break;
                            case -2:
                                gChangeCase = 2;
                                break;
                            case -3:
                                gChangeCase = 0;
                                break;
                            case -4:
                                changeCase = 1;
                                break;
                            case -5:
                                changeCase = 2;
                                break;
                        }
                        continue;
                    }
                    ch = match[ch] || "";
                }
                if (gChangeCase) ch = gChangeCase === 1 ? ch.toUpperCase() : ch.toLowerCase();
                if (changeCase && ch) {
                    result += changeCase === 1 ? ch[0].toUpperCase() : ch[0].toLowerCase();
                    ch = ch.substr(1);
                    changeCase = 0;
                }

                result += ch;
            }

            if (options.preserveCase) {
                var input = match[0];
                var replacement = result.split("");
                for (var i = Math.min(input.length, replacement.length); i--;) {
                    var ch = input[i];
                    if (ch && ch.toLowerCase()
                        != ch) replacement[i] = replacement[i].toUpperCase(); else replacement[i] = replacement[i].toLowerCase();
                }
                result = replacement.join("");
            }

            return result;
        };
    }

    hide() {
        this.active = false;
        this.setSearchRange(null);
        this.editor.off("changeSession", this.setSession);
        
        this.element.style.display = "none";
        this.editor.keyBinding.removeKeyboardHandler(this.$closeSearchBarKb);
        this.editor.focus();
    }

    /**
     * @param {string} value
     * @param {boolean} [isReplace]
     */
    show(value, isReplace) {
        this.active = true;
        this.editor.on("changeSession", this.setSession);
        this.element.style.display = "";
        this.replaceOption.checked = isReplace;

        if (value) this.searchInput.setValue(value);

        this.searchInput.focus();
        //TODO: this.searchInput.select();

        this.editor.keyBinding.addKeyboardHandler(this.$closeSearchBarKb);
        
        this.$syncOptions(true);
    }

    isFocused() {
        var el = document.activeElement;
        return el == this.searchInput.container || el == this.replaceInput.container;
    }
}

//keybinding outside of the searchbox
var $searchBarKb = new HashHandler();
$searchBarKb.bindKeys({
    "Ctrl-f|Command-f": function (/**@type{SearchBox}*/sb) {
        var isReplace = sb["isReplace"] = !sb["isReplace"];
        sb.replaceBox.style.display = isReplace ? "" : "none";
        sb.replaceOption.checked = false;
        sb.$syncOptions();
        sb.searchInput.focus();
    },
    "Ctrl-H|Command-Option-F": function (/**@type{SearchBox}*/sb) {
        if (sb.editor.getReadOnly())
            return;
        sb.replaceOption.checked = true;
        sb.$syncOptions();
        sb.replaceInput.focus();
    },
    "Ctrl-G|Command-G": function (/**@type{SearchBox}*/sb) {
        sb.findNext();
    },
    "Ctrl-Shift-G|Command-Shift-G": function (/**@type{SearchBox}*/sb) {
        sb.findPrev();
    },
    "esc": function (/**@type{SearchBox}*/sb) {
        setTimeout(function() { sb.hide();});
    },
    "Return": function (/**@type{SearchBox}*/sb) {
        if (sb.activeInput == sb.replaceInput)
            sb.replace();
        sb.findNext();
    },
    "Shift-Return": function (/**@type{SearchBox}*/sb) {
        if (sb.activeInput == sb.replaceInput)
            sb.replace();
        sb.findPrev();
    },
    "Alt-Return": function (/**@type{SearchBox}*/sb) {
        if (sb.activeInput == sb.replaceInput)
            sb.replaceAll();
        sb.findAll();
    },
    "Tab": function (/**@type{SearchBox}*/sb) {
        (sb.activeInput == sb.replaceInput ? sb.searchInput : sb.replaceInput).focus();
    }
});

$searchBarKb.addCommands([{
    name: "toggleRegexpMode",
    bindKey: {win: "Alt-R|Alt-/", mac: "Ctrl-Alt-R|Ctrl-Alt-/"},
    exec: function (/**@type{SearchBox}*/sb) {
        sb.regExpOption.checked = !sb.regExpOption.checked;
        sb.libSearch.setRegexpMode(sb.searchInput, sb.regExpOption.checked);
        sb.$syncOptions();
    }
}, {
    name: "toggleCaseSensitive",
    bindKey: {win: "Alt-C|Alt-I", mac: "Ctrl-Alt-R|Ctrl-Alt-I"},
    exec: function (/**@type{SearchBox}*/sb) {
        sb.caseSensitiveOption.checked = !sb.caseSensitiveOption.checked;
        sb.$syncOptions();
    }
}, {
    name: "toggleWholeWords",
    bindKey: {win: "Alt-B|Alt-W", mac: "Ctrl-Alt-B|Ctrl-Alt-W"},
    exec: function (/**@type{SearchBox}*/sb) {
        sb.wholeWordOption.checked = !sb.wholeWordOption.checked;
        sb.$syncOptions();
    }
}, {
    name: "toggleReplace",
    exec: function (/**@type{SearchBox}*/sb) {
        sb.replaceOption.checked = !sb.replaceOption.checked;
        sb.$syncOptions();
    }
}, {
    name: "searchInSelection",
    exec: function (/**@type{SearchBox}*/sb) {
        sb.searchOption.checked = !sb.searchRange;
        sb.setSearchRange(sb.searchOption.checked && sb.editor.getSelectionRange());
        sb.$syncOptions();
    }
}]);

//keybinding outside of the searchbox
var $closeSearchBarKb = new HashHandler([{
    bindKey: "Esc",
    name: "closeSearchBar",
    exec: function(editor) {
        editor.searchBox.hide();
    }
}]);

SearchBox.prototype.$searchBarKb = $searchBarKb;
SearchBox.prototype.$closeSearchBarKb = $closeSearchBarKb;

exports.SearchBox = SearchBox;

/**
 * 
 * @param {Editor} editor
 * @param {boolean} [isReplace]
 */
exports.Search = function(editor, isReplace) {
    var sb = editor.searchBox || new SearchBox(editor);
    sb.show(editor.session.getTextRange(), isReplace);
};


/* ------------------------------------------------------------------------------------------
 * TODO
 * --------------------------------------------------------------------------------------- */
/*
- move search form to the left if it masks current word
- include all options that search has. ex: regex
- searchbox.searchbox is not that pretty. We should have just searchbox
- disable prev button if it makes sense
*/
