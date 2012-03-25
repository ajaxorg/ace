/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var RangeList = require("./range_list").RangeList;
var Range = require("./range").Range;
var Selection = require("./selection").Selection;
var Range = require("./range").Range;
var event = require("./lib/event");


function forEachSelection(editor, cmd, args) {
    if (editor.session.multiSelection.inVirtualMode)
        return
    var session = editor.session
    var selection = editor.selection
    var rangeList = selection.rangeList

    var reg = selection._eventRegistry;
    selection._eventRegistry = {};

    var sh = new Selection(session);
    editor.session.multiSelection.inVirtualMode = true;
    for (var i = rangeList.ranges.length; i--;) {
        sh.fromOrientedRange(rangeList.ranges[i])
        editor.selection = session.selection = sh
        cmd.exec(editor, args || {})
        sh.toOrientedRange(rangeList.ranges[i])
    }
    sh.detach();

    rangeList.merge()
    editor.selection = session.selection = selection;
    editor.session.multiSelection.inVirtualMode = false;
    selection._eventRegistry = reg;

    selection.fromOrientedRange(selection.rangeList.all[0])
    editor.renderer.updateCursor();
    editor.renderer.updateBackMarkers();

    if (selection.rangeCount == 1 && editor.inMultiSelectMode)
        exitMultiSelectMode(editor)
}

function exec(command, editor, args) {
    if (typeof command === 'string')
        command = this.commands[command];

    if (!command)
        return false;

    if (editor && editor.$readOnly && !command.readOnly)
        return false;

    if (!command.multiCursor) {
        command.exec(editor, args || {});
    } else if (command.multiCursor == "forEach") {
        forEachSelection(editor, command, args)
    } else if (command.multiCursor == "single") {
		exitMultiSelectMode(editor);
        command.exec(editor, args || {});
	} else {
        command.multiCursor(editor, args || {});
	}
    return true;
};

function enterMultiSelectMode(editor) {
    if (editor.inMultiSelectMode)
        return
    editor.inMultiSelectMode = true
    editor.setStyle("multiselect")
    editor.keyBinding.addKeyboardHandler(exports.keyboardHandler);
    editor.commands.__exec = editor.commands.exec
    editor.commands.exec = exec

    editor.session.$undoSelect = false
    editor.selection.rangeList.attach(editor.session);
}
function exitMultiSelectMode(editor) {
    if (editor.session.multiSelection.inVirtualMode)
        return
    editor.inMultiSelectMode = false;
    editor.selection.secondarySelections = [];
    editor.unsetStyle("multiselect");
    editor.selection.rangeList.removeAll();
    editor.keyBinding.removeKeyboardHandler(exports.keyboardHandler);

    editor.commands.exec = editor.commands.__exec;
    editor.renderer.updateCursor();
    editor.renderer.updateBackMarkers();

    editor.session.$undoSelect = true

    editor.selection.rangeList.detach(editor.session);
}

function initSession(session) {
    if (session.selection.rangeList)
        return
    session.multiSelection = session.selection

    var rangeList = new RangeList;

    rangeList.all = [];
    rangeList.on("add", function(e) {
        rangeList.all.unshift(e.range)
    })

    rangeList.on("remove", function(e) {
        var ranges = e.ranges
        for (var i = ranges.length; i--; ) {
            var index = rangeList.all.indexOf(ranges[i]);
            rangeList.all.splice(index, 1);
        }
    });

    session.selection.rangeList = rangeList;
    session.selection.cursor = session.selection.selectionLead;
    session.selection.secondarySelections = [];
    session.selection.getAllRanges = function() {
        return this.rangeList.ranges.concat(this.secondarySelections)
    };
    session.selection.rangeCount = 1;
}

var addSelectionRange = function(editor, orientedRange) {
    if (!editor.inMultiSelectMode)
        enterMultiSelectMode(editor)

    if (!orientedRange.cursor)
        orientedRange.cursor = orientedRange.end

    var style = editor.getSelectionStyle();
    orientedRange.marker = editor.session.addMarker(orientedRange, "ace_selection", style);

    // use this to not conflict with virtualSelections added by forEachSelection
    var selection = editor.session.multiSelection;
    selection.rangeList.add(orientedRange);
    selection.rangeCount = selection.rangeList.all.length + selection.secondarySelections.length;

    selection.fromOrientedRange(orientedRange)
    editor.renderer.updateCursor();
    editor.renderer.updateBackMarkers();
};

function addCursorV(editor, dir){
    var range = editor.selection.getRange()
    var isBackwards = editor.selection.isBackwards()
    range.cursor = isBackwards ? range.start : range.end;

    var screenLead = editor.session.documentToScreenPosition(range.cursor);
    if (editor.selection.$desiredColumn)
        screenLead.column = editor.selection.$desiredColumn;

    var lead = editor.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

    if (!range.isEmpty()) {
        var screenAnchor = editor.session.documentToScreenPosition(isBackwards ? range.end : range.start);
        var anchor = editor.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
    } else {
        var anchor = lead
    }

    if (isBackwards) {
        var newRange = Range.fromPoints(lead, anchor)
        newRange.cursor = newRange.start
    } else {
        var newRange = Range.fromPoints(anchor, lead)
        newRange.cursor = newRange.end
    }
    newRange.desiredColumn = screenLead.column;
    if (!editor.inMultiSelectMode) {
        addSelectionRange(editor, range)
    } else {
        var allRanges = editor.selection.rangeList.ranges
        // remove range if at end
        if (range.isEequal(allRanges[dir == 1 ? 0 : allRanges.length - 1]))
            var toRemove = range.cursor
    }
    addSelectionRange(editor, newRange)
    if (toRemove)
        editor.selection.rangeList.substractPoint(toRemove)
}

function transposeSelections(editor, dir) {
	var session = editor.session;
	var sel = session.multiSelection;
	var all = sel.rangeList.all;
	
	var words = [];
	for (var i = all.length; i--; ) {
		var range = all[i]
		if (range.isEmpty()) {
			var tmp = session.getWordRange(range.start.row, range.start.column)
			range.start.row = tmp.start.row;
			range.start.column = tmp.start.column;
			range.end.row = tmp.end.row;
			range.end.column = tmp.end.column;
		}
		
		words.unshift(editor.session.getTextRange(range));
	}
	if (dir < 0)
		words.unshift(words.pop());
	else
		words.push(words.shift());

	for (var i = all.length; i--; ) {
		var range = all[i];
		var tmp = range.clone();
		session.replace(range, words[i]);
		range.start.row = tmp.start.row;
		range.start.column = tmp.start.column;
	}
}

function splitIntoLines(editor) {
	var sel = editor.session.multiSelection
	if (sel.rangeCount > 1) {
		var ranges = sel.rangeList.ranges;
		var lastRange = ranges[ranges.length - 1]
		var range = Range.fromPoints(ranges[0].start, lastRange.end)
		
		exitMultiSelectMode(editor)
		sel.setSelectionRange(range, lastRange.cursor == lastRange.start)
	} else {
		
	}
}

var Search = require("ace/search").Search
var search = new Search

function find(session, needle, dir) {
	search.$options.wrap = false;
	search.$options.needle = needle;
	search.$options.backwards = dir == -1;
	return search.find(session)
}
function addRange(editor, dir, skip) {
	var session = editor.session;
	var sel = session.multiSelection;
	var all = sel.rangeList.all;
	
	var range = sel.getRange();
	if (range.isEmpty()) {
		var tmp = session.getWordRange(range.start.row, range.start.column)
		var offset = tmp.start.column - range.start.column
		range = tmp;
	}
	var needle = session.getTextRange(range);
	
	if (skip) {
		
	}
	
	var newRange = find(session, needle, dir);
	
	newRange.cursor = dir == -1 ? newRange.start : newRange.end;
	addSelectionRange(editor, newRange)	
}
// commands
// add multicursor annotations to default commands
var defaultCommands = require("./commands/default_commands").commands;

defaultCommands.forEach(function(command) {
	var single = RegExp(["selectall"].join("|"), "");
	var mapOverCommands = RegExp(["backspace", "del",
		"golinedown", "golineup", "gotoend", "gotoleft", "gotolineend", "gotolinestart",
		"gotoright", "gotostart", "gotowordleft", "gotowordright", 
		"indent", "insertstring", "inserttext", "jumptomatching", "outdent",
		"removetolineend", "removetolinestart", "removewordleft", "removewordright",
		"selectdown", "selectleft", "selectlineend", "selectlinestart", "selectright",
		"selecttoend", "selecttolineend", "selecttolinestart", "selecttostart",
		"selectup", "selectwordleft", "selectwordright",
		"splitline", "tolowercase", "touppercase"].join("|"), "");
		
	if (single.test(command.name))
		command.multiCursor = "single";
	else if (mapOverCommands.test(command.name))
		command.multiCursor = "forEach";
	else if (command.name == "transposeletters")
		command.multiCursor = transposeSelections
});

// commands to to enter multicursor mode
exports.defaultCommands = [{
    name: "addCursorAbove",
    exec: function(editor) {addCursorV(editor, -1); },
    bindKey: {win: "Alt-Shift-Up", mac: "Alt-Shift-Up"}
}, {
    name: "addCursorBelow",
    exec: function(editor) {addCursorV(editor, 1); },
    bindKey: {win: "Alt-Shift-Down", mac: "Alt-Shift-Down"}
}, {
    name: "selectMoreBefore",
    exec: function(editor) {addRange(editor, -1); },
    bindKey: {win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up"}
}, {
    name: "selectMoreAfter",
    exec: function(editor) {addRange(editor, 1); },
    bindKey: {win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down"}
}, {
    name: "selectNextBefore",
    exec: function(editor) {addCursorV(editor, -1, true); },
    bindKey: {win: "Ctrl-Shift-PageUp", mac: "Ctrl-Shift-PageUp"}
}, {
    name: "selectNextAfter",
    exec: function(editor) {addCursorV(editor, 1, true); },
    bindKey: {win: "Ctrl-Shift-PageDown", mac: "Ctrl-Shift-PageDown"}
},  {
    name: "splitIntoLines",
    exec: function(editor) {splitIntoLines(editor); },
    bindKey: {win: "Ctrl-Shift-L", mac: "Ctrl-Shift-L"}
}, ];

// commands active when multiple cursors are present
exports.multiEditCommands = [{
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) {
        console.log(editor)
        exitMultiSelectMode(editor)
    },
}];

var HashHandler = require("ace/keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiEditCommands);

// mouse
function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column
}
function onMouseDown(e) {
    var ev = e.domEvent;
    var alt = ev.altKey;
    var shift = ev.shiftKey;
    var ctrl = ev.ctrlKey;
    var button = e.getButton();

    if (!ctrl && !alt) {
        if (e.editor.selection.rangeCount > 1) {
            if (button == 0) {
                exitMultiSelectMode(e.editor)
            } else if (button == 2) {
                var editor = e.editor;
                var selectionEmpty = editor.selection.isEmpty()
                editor.textInput.onContextMenu({x: e.clientX, y: e.clientY}, selectionEmpty);
                event.capture(editor.container, function(){}, editor.textInput.onContextMenuClose);
                e.stop();
            }
        }
        return;
    }

    var editor = e.editor;
    var selection = editor.selection;
    var isMultiSelect = selection.rangeCount > 1
    var pos = e.getDocumentPosition();
    var rangeList = selection.rangeList;
    var cursor = selection.getCursor()
    var inSelection = e.inSelection() || (selection.isEmpty() && isSamePoint(pos, cursor));

    if (ctrl && !shift && !alt && button == 0) {
        if (!isMultiSelect && inSelection)
            return // dragging

        if (!isMultiSelect) {
            addSelectionRange(editor, selection.toOrientedRange())
        }
        if (inSelection)
            selection.clearSelection();

        selection.secondarySelections.push(selection)
        selection.rangeCount++
        var oldRange = rangeList.substractPoint(pos)

        event.capture(editor.container, function(){}, function() {
            var i = selection.secondarySelections.indexOf(selection);
            if (i != -1) {
                selection.rangeCount--
                selection.secondarySelections.splice(i, 1);
            }

            var tmpSel = selection.toOrientedRange();

            if (oldRange && oldRange.isEmpty() && tmpSel.isEequal(oldRange)) {
                var range = selection.rangeList.all[0]
                editor.selection.rangeList._emit("remove", {ranges: []})
                selection.setSelectionRange(range, range.cursor == range.start)
                selection._emit("changeSelection");
                selection._emit("changeCursor");
                return;
            }

            addSelectionRange(editor, tmpSel)
        });

        //e.stop()
    } else if (!shift && alt && button == 0) {
        e.stop()
        var mouseX = e.pageX, mouseY = e.pageY;
        var onMouseSelection = function(e) {
            mouseX = event.getDocumentX(e);
            mouseY = event.getDocumentY(e);
        };

        selection.moveCursorToPosition(pos);
        selection.clearSelection();
        if (!isMultiSelect) {
            enterMultiSelectMode(editor)
            selection.rangeCount = Infinity
        }


        var rectSel = []
        selection.secondarySelections = rectSel

        var session = editor.session
        var style = editor.getSelectionStyle();
        function addMarker(range) {
            range.marker = session.addMarker(range, "ace_selection", style);
        }
        function removeMarker(range) {
             session.removeMarker(range.marker);
        }



        var onMouseSelectionEnd = function(e) {
            clearInterval(timerId);
            rectSel.forEach(removeMarker)
            selection.secondarySelections = [];
            for (var i = rectSel.length; i--; )
                addSelectionRange(editor, rectSel[i])

            if (selection.rangeCount == Infinity) {
                selection.rangeCount = selection.rangeList.all.length + selection.secondarySelections.length;

                if (selection.rangeCount <= 1)
                    exitMultiSelectMode(editor)
            }
        };

        var anchor = selection.getCursor();
        var screenAnchor = session.documentToScreenPosition(anchor);
        var screenCursor = screenAnchor
        var screenLength = session.getScreenLength() - 1

        var onSelectionInterval = function() {
            var newCursor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
            if (isSamePoint(screenCursor, newCursor))
                return
            rectSel.forEach(removeMarker)
            rectSel.splice(0, rectSel.length)
            screenCursor = newCursor
            var xBackwards = screenCursor.column < screenAnchor.column
            if (xBackwards) {
                var startColumn = screenCursor.column
                var endColumn = screenAnchor.column
            } else {
                var startColumn = screenAnchor.column
                var endColumn = screenCursor.column
            }
            var yBackwards = screenCursor.row < screenAnchor.row
            if (yBackwards) {
                var startRow = screenCursor.row
                var endRow = screenAnchor.row
            } else {
                var startRow = screenAnchor.row
                var endRow = screenCursor.row
            }
            if (startColumn < 0)
                startColumn = 0
            if (startRow < 0)
                startRow = 0
            if (endRow > screenLength)
                endRow = screenLength

            for (var row = startRow; row <= endRow; row++) {
                var r = Range.fromPoints(
                    session.screenToDocumentPosition(row, startColumn),
                    session.screenToDocumentPosition(row, endColumn)
                )
                r.cursor = xBackwards ? r.start : r.end
                rectSel.push(r)
            }

            rectSel.forEach(addMarker)
            var lastIndex = yBackwards ? 0 : rectSel.length - 1
            selection.moveCursorToPosition(rectSel[lastIndex].cursor);
            selection.clearSelection()
            editor.renderer.scrollCursorIntoView();

            editor.renderer.updateCursor();
            editor.renderer.updateBackMarkers();
        };

        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);

        return e.preventDefault();
    }
}

// MultiCursor
function MultiCursor(editor) {
    initSession(editor.session);
    editor.on("changeSession", function(e) {
        initSession(e.session)
    }.bind(editor));

    editor.selection.rangeList.on("remove", function(e) {
        var ranges = e.ranges;
        for (var i = ranges.length; i--; ) {
            var range = ranges[i];
            if (range.marker != null)
                this.session.removeMarker(range.marker);

            this.rangeCount --;
        }

        if (this.rangeCount == 1 && editor.inMultiSelectMode)
            exitMultiSelectMode(editor)
    }.bind(editor.selection));

    editor.on("mousedown", onMouseDown);
    editor.commands.addCommands(exports.defaultCommands);
}



exports.MultiCursor = MultiCursor;

});