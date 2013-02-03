/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";
var Range = require("./range").Range
var lang = require("./lib/lang")
var HashHandler = require("./keyboard/hash_handler").HashHandler;

var SnippetManager = function() {
    this.snippets = [];
};

(function() {
    this.tokenizeTmSnippet = function(str) {
        var stringBuilder = [];
        var addText = function(str) {
            str && stringBuilder.push(str);
        };
        var addVar = function(text, placeholder) {
            if (/^\d+$/.test(text))
                placeholder.tabstopId = parseInt(text, 10);
            else
                placeholder.text = text;
            addText(placeholder);
            return placeholder;
        };
        str = str.replace(/\r/g, "");
        var stack = [], index = 0, m;
        // m[1] = \\([\$}`\\]) escapes
        // m[2] = }
        // m[3] = \$(\w+)  variables or tabstops
        // m[4] = \$\{([\dA-Z_]+)
        // m[5] = format string
        var re = /\\([\$}`\\])|(})|\n|\$(\d+|\w+)|\$\{([\dA-Z_]+)([\/|`])?(\:?)/g;
        var formatters = {
            "/": /((\/(?:\\.|[^\/])+){1,20})\/\w*/g, // replace or guard
            "|": /|[^|}]+|/g, // choice list
            "`": /`(?:\\`|[^`])+?`/g // interpolation
        };
        var readFormatString = function(quote, placeholder) {
            var pos = re.lastIndex;
            var formatRe = formatters[quote];
            formatRe.lastIndex = pos - 1;
            var m = formatRe.exec(str);
            if (!m)
                return;
            if (quote == "`") {
                placeholder.interpolation = m[0].replace(/\\`/g, "")
            } else if (quote == "|") {
                placeholder.choices = m[0].split(/,/);
            } else if (quote == "/") {
                placeholder[m[1] == m[2] ? "fmt" : "guard"] = m[0];
            }
            re.lastIndex = formatRe.lastIndex;
        };
        while (m = re.exec(str)) {
            addText(str.substring(index, m.index)); // skipped text
            index = m.index + m[0].length;
            if (m[1]) { // escape
                addText(m[1] == "}" && !stack.length ? m[0] : m[1]);
            } else if (m[3]) { // variable
                addVar(m[3], {});
            } else if (m[4]) { // variable
                var placeholder = addVar(m[4], {});
                if (m[5])
                    readFormatString(m[5], placeholder);
                if (stack[0])
                    stack[0].child = placeholder;
                stack.unshift(placeholder);
            } else if (m[2] && stack.length) {
                addText(stack.shift());
            } else {
                addText(m[0]);
            }
        }
        addText(str.substring(index));
        return stringBuilder;
    };

    this.$getDefaultValue = function(editor, name) {
        name = name.replace(/^TM_/, "");

        var s = editor.session;
        switch(name) {
            case "CURRENT_WORD":
                var r = s.getWordRange();
            case "SELECTION":
            case "SELECTED_TEXT":
                return s.getTextRange(r);
            case "CURRENT_LINE":
                return s.getLine(e.getCursorPosition().row);
            case "LINE_INDEX":
                return e.getCursorPosition().column;
            case "LINE_NUMBER":
                return e.getCursorPosition().row + 1;
            case "SOFT_TABS":
                return s.getUseSoftTabs() ? "YES" : "NO";
            case "TAB_SIZE":
                return s.getTabSize();
            // defult but can't fill :(
            case "FILENAME":
            case "FILEPATH":
                return "ace.ajax.org";
            case "FULLNAME":
                return "Ace";
        }
    };
    this.variables = {};
    this.getVariableValue = function(editor, varName) {
        if (this.variables.hasOwnProperty(varName))
            return this.variables[varName](editor, varName);
        return this.$getDefaultValue(editor, varName);
    };

    // returns string formatted according to http://manual.macromates.com/en/regular_expressions#replacement_string_syntax_format_strings
    this.tmStrFormat = function(str, fmt) {
        fmt = fmt.split("/");
        fmt.shift();
        if (fmt.length < 3)
            return str;
        var flags = fmt.pop().replace(/[^gmi]/g, "");
        var search = fmt.shift();
        while (search[search.length - 1] == "\\")
            search += "/" + fmt.shift();
        fmt = fmt.join("/");
        var re = new RegExp(search, flags);

        var parseRe = /\\.|\\([ulULE])|\$(\d+)|\${(\d+)}|\(?(\d+):|\)/
        var fmtParts = [];
        while (m = parseRe.exec(fmt)) {
            if (m[1]) {

            } else if (m[2] || m[3]) {

            } else if (m[4]) {

            }
        }

        return str.replace(re, function() {
            var matches = arguments;
            for (var i  = 0; i < fmtParts; i++) {

            }
            return result;
        });
    };

    this.resolveVariables = function(snippet, editor) {
        var result = [];
        for (var i = 0; i < snippet.length; i++) {
            var ch = snippet[i]
            if (typeof ch == "string") {
                result.push(ch);
            } else if (typeof ch == "object" && !ch.processed) {
                if (ch.text) {
                    var value = this.getVariableValue(editor, ch.text);
                    if (value) {
                        var i1 = snippet.indexOf(ch, i + 1);
                        if (i1 != -1)
                            i = i1;
                        if (ch.fmt)
                            value = this.tmStrFormat(value, ch.fmt);
                        result.push(value);
                    } else {
                        ch.processed = true;
                    }
                } else if (ch.tabstopId != null) {
                    result.push(ch);
                }
            }
        }
        return result;
    };

    this.insertSnippet = function(editor, snippetText) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var indentString = line.match(/^\s*/)[0];
        var tabString = editor.session.getTabString();

        var tokens = this.tokenizeTmSnippet(snippetText);
        tokens = this.resolveVariables(tokens, editor);
        // indent
        tokens = tokens.map(function(x) {
            if (x == "\n")
                return x + indentString;
            if (typeof x == "string")
                return x.replace(/\t/g, tabString);
            return x;
        });
        // tabstop values
        var tabstops = [];
        tokens.forEach(function(p, i) {
            if (typeof p != "object")
                return;
            var id = p.tabstopId;
            if (!tabstops[id]) {
                tabstops[id] = [];
                tabstops[id].index = id;
                tabstops[id].value = "";
            }
            if (tabstops[id].indexOf(p) != -1)
                return;
            tabstops[id].push(p);
            var i1 = tokens.indexOf(p, i + 1);
            if (i1 == -1)
                return;
            var value = tokens.slice(i + 1, i1).join("");
            if (value)
                tabstops[id].value = value;
        });

        tabstops.forEach(function(ts) {
            ts.value && ts.forEach(function(p) {
                var i = tokens.indexOf(p);
                var i1 = tokens.indexOf(p, i + 1);
                if (i1 == -1)
                    tokens.splice(i + 1, 0, ts.value, p);
                else if (i1 == i + 1)
                    tokens.splice(i + 1, 0, ts.value);
            });
        });
        // convert to plain text
        var row = 0, column = 0;
        var text = "";
        tokens.forEach(function(t) {
            if (typeof t == "string") {
                if (t[0] == "\n"){
                    column = t.length - 1;
                    row ++;
                } else
                    column += t.length;
                text += t;
            } else {
                if (!t.start)
                    t.start = {row: row, column: column};
                else
                    t.end = {row: row, column: column};
            }
        });
        var range = editor.getSelectionRange();
        var end = editor.session.replace(range, text);

        var tabstopManager = new TabstopManager(editor);
        tabstopManager.addTabstops(tabstops, range.start, end);
        tabstopManager.tabNext();
    };

    this.$getScope = function(editor) {
        var scope = editor.session.$mode.$id || "";
        scope = scope.split("/").pop();
        if (editor.session.$mode.$modes) {
            var c = editor.getCursorPosition()
            var state = editor.session.getState(c.row);
            if (state.substring) {
                if (state.substring(0, 3) == "js-")
                    scope = "javascript";
                else if (state.substring(0, 4) == "css-")
                    scope = "css";
                else if (state.substring(0, 4) == "php-")
                    scope = "php";
            }
        }
        return scope;
    };

    this.expandWithTab = function(editor) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var before = line.substring(0, cursor.column);
        var after = line.substr(cursor.column);
        
        var scope = this.$getScope(editor);
        var snippetMap = this.snippetMap;
        var snippet;
        [scope, "_"].some(function(scope) {
            var snippets = snippetMap[scope];
            if (snippets)
                snippet = this.findMatchingSnippet(snippets, before, after);
            return !!snippet;
        }, this);
        if (!snippet)
            return false;

        editor.session.doc.removeInLine(
            cursor.row, 
            cursor.column - snippet.matchBefore[0].length,
            cursor.column - snippet.matchAfter[0].length
        );
        this.insertSnippet(editor, snippet.content, snippet.matchBefore, snippet.matchAfter);
        return true;
    };
    
    this.findMatchingSnippet = function(snippetList, before, after) {
        for (var i = snippetList.length; i--;) {
            var s = snippetList[i];
            if (s.startRe && !s.startRe.test(before))
                continue;
            if (s.endRe && !s.endRe.test(after))
                continue;
            if (!s.startRe && !s.endRe)
                continue;

            s.matchBefore = s.startRe ? s.startRe.exec(before) : [""]; 
            s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];            
            return s;
        }
    };
    
    this.snippetMap = {};
    this.register = function(snippets, scope) {
        var snippetMap = this.snippetMap;
        function addSnippet(s) {
            if (!s.scope)
                s.scope = scope || "_";
            if (!snippetMap[s.scope])
                snippetMap[s.scope] = [];
            snippetMap[s.scope].push(s);
            
            if (s.tabTrigger) {
                if (/^\w/.test(s.tabTrigger))
                    s.guard = "\\b";
                s.trigger = lang.escapeRegExp(s.tabTrigger);
            }

            s.startRe = (s.guard || "") + (s.trigger || "");
            if (s.startRe && s.startRe[s.startRe - 1] != "$")
                s.startRe += "$";
            if (s.startRe)
                s.startRe = new RegExp(s.startRe);
            s.endRe = (s.endGuard || "") + (s.endTrigger || "");
            if (s.endRe && s.endRe[0] != "^")
                s.endRe = "^" + s.endRe;
            if (s.endRe)
                s.endRe = new RegExp(s.endRe);
        };

        if (snippets.content)
            addSnippet(snippets);
        else if (Array.isArray(snippets))
            snippets.forEach(addSnippet);
    };
    this.parseSnippetFile = function(str) {
        var list = [], snippet = {};
        var re = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
        var m;
        while (m = re.exec(str)) {
            if (m[1]) {
                try {
                    snippet = JSON.parse(m[1])
                    list.push(snippet);
                } catch (e) {}
            } if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
            } else {
                var key = m[2], val = m[3];
                if (key == "regex") {
                    val = val.split(/\/((?:[^\/\\]|\\.)*)\/?/);
                    snippet.guard = val[1];
                    snippet.trigger = val[2];
                    snippet.endTrigger = val[3];
                    snippet.endGuard = val[3];
                } else if (key == "snippet") {
                    val = val.split(/^(\S*)(?:\s(.*))?$/);
                    snippet.tabTrigger = val[1];                   
                    if (!snippet.name)
                        snippet.name = val[2];
                } else {
                    snippet[key] = val;
                }
            }
        }
        return list;
    };

}).call(SnippetManager.prototype);



var TabstopManager = function(editor) {
    if (editor.tabstopManager)
        return editor.tabstopManager;
    editor.tabstopManager = this;
    this.$onChange = this.onChange.bind(this);
    this.$onChangeSelection = this.onChangeSelection.bind(this);
    this.$onChangeSession = this.onChangeSession.bind(this);
    this.attach(editor);
};
(function() {
    this.attach = function(editor) {
        this.index = -1;
        this.ranges = [];
        this.tabstops = [];
        this.selectedTabstop = null;

        this.editor = editor;
        this.editor.on("change", this.$onChange);
        this.editor.on("changeSelection", this.$onChangeSelection);
        this.editor.on("changeSession", this.$onChangeSession);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };
    this.detach = function() {
        this.tabstops.forEach(this.removeTabstopMarkers, this);
        this.ranges = null;
        this.tabstops = null;
        this.selectedTabstop = null;
        this.editor.removeListener("change", this.$onChange);
        this.editor.removeListener("changeSelection", this.$onChangeSelection);
        this.editor.removeListener("changeSession", this.$onChangeSession);
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.tabstopManager = null;
        this.editor = null;
    };

    this.onChange = function(e) {
        var changeRange = e.data.range;
        if (e.data.action[0] == "i"){
            var start = changeRange.start;
            var end = changeRange.end;
        } else {
            var end = changeRange.start;
            var start = changeRange.end;
        }
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;

        var colDiff = end.column - start.column;
        var ranges = this.ranges;

        for (var i = 0; i < ranges.length; i++) {
            var r = ranges[i];
            if (r.end.row < startRow)
                continue;

            if (Range.comparePoints(changeRange.start, r.start) < 0
                && Range.comparePoints(changeRange.end, r.end) > 0) {
                this.removeRange(r);
                i--;
                continue;
            }

            if (r.start.row == startRow && r.start.column > start.column) {
                r.start.column += colDiff;
            }
            if (r.end.row == startRow && r.end.column >= start.column) {
                r.end.column += colDiff;
            }
            if (r.start.row >= startRow) {
                r.start.row += lineDif;
            }
            if (r.end.row >= startRow) {
                r.end.row += lineDif;
            }
        }
    };
    this.onChangeSelection = function() {
        setTimeout(function() {
            if (!this.editor)
                return
            var lead = this.editor.selection.lead;
            var anchor = this.editor.selection.anchor;
            var isEmpty = this.editor.selection.isEmpty();
            for (var i = this.ranges.length; i--;) {
                var containsLead = this.ranges[i].contains(lead.row, lead.column);
                var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
                if (containsLead && containsAnchor)
                    return;
            }
            this.detach();
        }.bind(this));
    };
    this.onChangeSession = function() {
        this.detach();
    };

    this.tabNext = function(dir) {
        var max = this.tabstops.length - 1;
        var index = this.index + (dir || 1);
        index = Math.min(Math.max(index, 0), max);
        this.selectTabstop(index);
        if (index == max)
            this.detach();
    };
    this.selectTabstop = function(index) {
        var ts = this.tabstops[this.index];
        if (ts)
            this.addTabstopMarkers(ts);
        this.index = index;
        ts = this.tabstops[this.index];
        if (!ts)
            return;

        this.selectedTabstop = ts;
        var sel = this.editor.multiSelect;
        sel.toSingleRange(ts[0].clone());
        for (var i = ts.length; i--;)
            sel.addRange(ts[i].clone(), true);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };
    this.addTabstops = function(tabstops, start, end) {
        // add final tabstop if missing
        if (!tabstops[0]) {
            var p = Range.fromPoints(end, end);
            moveRelative(p.start, start);
            moveRelative(p.end, start);
            tabstops[0] = [p];
            tabstops[0].index = 0;
        }

        var i = this.index;
        var arg = [i, 0];
        var ranges = this.ranges;
        var editor = this.editor;
        tabstops.forEach(function(ts) {
            for (var i = ts.length; i--;) {
                var p = ts[i];
                var range = Range.fromPoints(p.start, p.end || p.start);
                movePoint(range.start, start);
                movePoint(range.end, start);
                range.original = p;
                range.tabstop = ts;
                ranges.push(range);
                ts[i] = range;
            }
            arg.push(ts);
            this.addTabstopMarkers(ts);
        }, this);
        // tabstop 0 is the last one
        arg.push(arg.splice(2, 1)[0]);
        this.tabstops.splice.apply(this.tabstops, arg);
    };

    this.addTabstopMarkers = function(ts) {
        var session = this.editor.session;
        ts.forEach(function(range) {
            if  (!range.markerId)
                range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
        });
    };
    this.removeTabstopMarkers = function(ts) {
        var session = this.editor.session;
        ts.forEach(function(range) {
            session.removeMarker(range.markerId);
            range.markerId = null;
        });
    };
    this.removeRange = function(range) {
        var i = range.tabstop.indexOf(range);
        range.tabstop.splice(i, 1);
        i = this.ranges.indexOf(range);
        this.ranges.splice(i, 1);
        this.editor.session.removeMarker(range.markerId);
    };

    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys({
        "Tab": function(ed) {
            ed.tabstopManager.tabNext(1);
        },
        "Shift-Tab": function(ed) {
            ed.tabstopManager.tabNext(-1);
        },
        "Esc": function(ed) {
            ed.tabstopManager.detach();
        }
    });
}).call(TabstopManager.prototype);


var movePoint = function(point, diff) {
    if (point.row == 0)
        point.column += diff.column;
    point.row += diff.row;
};

var moveRelative = function(point, start) {
    if (point.row == start.row)
        point.column -= start.column;
    point.row -= start.row;
};


require("ace/lib/dom").importCssString("\
.ace_snippet-marker {\
    -moz-box-sizing: border-box;\
    box-sizing: border-box;\
    background: rgba(194, 193, 208, 0.09);\
    border: 1px dotted rgba(119, 116, 139, 0.5);\
    position: absolute;\
}");

exports.SnippetManager = new SnippetManager();


});
