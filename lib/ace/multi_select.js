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
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
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
var onMouseDown = require("./mouse/multi_select_mouse_handler").onMouseDown;
exports.commands = require("./commands/multi_select_commands");

// Todo
var Search = require("ace/search").Search
var search = new Search

function find(session, needle, dir) {
	search.$options.wrap = true;
	search.$options.needle = needle;
	search.$options.backwards = dir == -1;
	return search.find(session)
}

// extend EditSession
var EditSession = require("./edit_session").EditSession;
;(function() {
	this.getSelectionMarkers = function() {
		return this.$selectionMarkers;
	};
}).call(EditSession.prototype);

// extend Selection
;(function() {
	this.addRange = function(range) {
		if (!range.cursor)
			range.cursor = range.end;
			
		if (this.rangeCount == 0) {
			var oldRange = this.toOrientedRange();
			this.rangeList.add(oldRange);
			this._emit("addRange", {range: oldRange});
		}

		this.rangeList.add(range);
		this.rangeCount = this.rangeList.ranges.length;
		
		if (this.rangeCount > 1 && !this.inMultiSelectMode) {
			this._emit("multiSelect");
			this.inMultiSelectMode = true;
			this.$undoSelect = false;
			this.rangeList.attach(this.session);
		}

		this.fromOrientedRange(range);
		if (this.rangeCount >= 1)
			this._emit("addRange", {range: range});
	};

	this.single = function(range) {
		range = range || this.rangeList.all[0];
		this.rangeList.removeAll();
		range && this.fromOrientedRange(range);
	};

	this.$onRemoveRange = function(e) {
		this.rangeCount = this.rangeList.ranges.length;
		this._emit("removeRange", e);		

		if (this.rangeCount <= 1 && this.inMultiSelectMode) {
			this.inMultiSelectMode = false;
			this._emit("singleSelect");
			this.$undoSelect = true;
			this.rangeList.detach(this.session);

			if (this.rangeCount == 1)
				this.single();
		}
	};

	// adds multicursor support to selection
	this.$initRangeList = function() {
		if (this.rangeList)
			return;

		var rangeList = new RangeList;
		// list of ranges in reverse addition order
		// rangeList.all[0] is the same as selection.getRange
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

		this.rangeList = rangeList;
		this.cursor = this.selectionLead;

		this.rangeCount = 1;
		this.rangeList.on("remove", this.$onRemoveRange.bind(this));
	};
	this.getAllRanges = function() {
		return this.rangeList.ranges.concat()
	};

	this.splitIntoLines = function () {
		if (this.rangeCount > 1) {
			var ranges = this.rangeList.ranges;
			var lastRange = ranges[ranges.length - 1]
			var range = Range.fromPoints(ranges[0].start, lastRange.end)

			this.single()
			this.setSelectionRange(range, lastRange.cursor == lastRange.start)
		} else {
			var cursor = this.session.documentToScreenPosition(this.selectionLead);
			var anchor = this.session.documentToScreenPosition(this.selectionAnchor);
			
			var rectSel = this.rectangularRangeBlock(cursor, anchor);
			rectSel.forEach(this.addRange, this);
		}
	};
	
	this.rectangularRangeBlock = function(screenCursor, screenAnchor, includeEmptyLines) {
		var rectSel = [];

		var xBackwards = screenCursor.column < screenAnchor.column;
		if (xBackwards) {
			var startColumn = screenCursor.column;
			var endColumn = screenAnchor.column;
		} else {
			var startColumn = screenAnchor.column;
			var endColumn = screenCursor.column;
		}
		
		var yBackwards = screenCursor.row < screenAnchor.row;
		if (yBackwards) {
			var startRow = screenCursor.row;
			var endRow = screenAnchor.row;
		} else {
			var startRow = screenAnchor.row;
			var endRow = screenCursor.row;
		}
		
		if (startColumn < 0)
			startColumn = 0;
		if (startRow < 0)
			startRow = 0;

		if (startRow == endRow)
			includeEmptyLines = true;
			
		for (var row = startRow; row <= endRow; row++) {
			var range = Range.fromPoints(
				this.session.screenToDocumentPosition(row, startColumn),
				this.session.screenToDocumentPosition(row, endColumn)
			);
			if (range.isEmpty()) {
				if (docEnd && isSamePoint(range.end, docEnd))
					break;
				var docEnd = range.end;
			}
			range.cursor = xBackwards ? range.start : range.end;
			rectSel.push(range);
		}
		if (yBackwards)
			rectSel.reverse();
		
		if (!includeEmptyLines) {
			var end = rectSel.length - 1;
			while (rectSel[end].isEmpty() && end > 0)
				end--;
			if (end > 0) {
				var start = 0;
				while (rectSel[start].isEmpty())
					start++;
			}
			for (var i = end; i >= start; i--) {
				if (rectSel[i].isEmpty())
					rectSel.splice(i, 1);
			}		
		}
			
		return rectSel;
	};
}).call(Selection.prototype);

// extend Editor
var Editor = require("./editor").Editor;
;(function() {
	this.addSelectionMarker = function(orientedRange) {
		if (!orientedRange.cursor)
			orientedRange.cursor = orientedRange.end;

		var style = this.getSelectionStyle();
		orientedRange.marker = this.session.addMarker(orientedRange, "ace_selection", style);

		this.session.$selectionMarkers.push(orientedRange);
		this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
		return orientedRange
	};

	this.removeSelectionMarkers = function(ranges) {
		for (var i = ranges.length; i--; ) {
			var range = ranges[i];
			if (!range.marker)
				continue;
			this.session.removeMarker(range.marker);
			var index = this.session.$selectionMarkers.indexOf(range);
			if (index != -1)
				this.session.$selectionMarkers.splice(index, 1)
		}
		this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
	};

	this.$onAddRange = function(e) {
		this.addSelectionMarker(e.range);
		this.renderer.updateCursor();
		this.renderer.updateBackMarkers();
	};
	this.$onRemoveRange = function(e) {
		this.removeSelectionMarkers(e.ranges);
		this.renderer.updateCursor();
		this.renderer.updateBackMarkers();
	};
	this.$onMultiSelect = function(e) {
		if (this.inMultiSelectMode)
			return;
		this.inMultiSelectMode = true;

		this.setStyle("multiselect");
		this.keyBinding.addKeyboardHandler(exports.commands.keyboardHandler);
		// FixMe
		this.commands.__SingleSelectionExec = this.commands.exec;
		this.commands.exec = exports.exec;
		this.renderer.updateCursor();
		this.renderer.updateBackMarkers();
	};

	this.$onSingleSelect = function(e) {
		if (this.session.multiSelect.inVirtualMode)
			return;
		this.inMultiSelectMode = false;

		this.unsetStyle("multiselect");
		this.keyBinding.removeKeyboardHandler(exports.commands.keyboardHandler);

		this.commands.exec = this.commands.__SingleSelectionExec;
		this.renderer.updateCursor();
		this.renderer.updateBackMarkers();
	};

	this.forEachSelection = function(cmd, args) {
		if (this.inVirtualSelectionMode)
			return;
		var session = this.session
		var selection = this.selection
		var rangeList = selection.rangeList

		var reg = selection._eventRegistry;
		selection._eventRegistry = {};

		var tmpSel = new Selection(session);
		this.inVirtualSelectionMode = true;
		for (var i = rangeList.ranges.length; i--;) {
			tmpSel.fromOrientedRange(rangeList.ranges[i]);
			this.selection = session.selection = tmpSel;
			cmd.exec(this, args || {});
			tmpSel.toOrientedRange(rangeList.ranges[i]);
		}
		tmpSel.detach();

		this.selection = session.selection = selection;
		this.inVirtualSelectionMode = false;
		selection._eventRegistry = reg;
		rangeList.merge();

		var lastRange = selection.rangeList.all[0]
		lastRange && selection.fromOrientedRange(lastRange);

		selection._emit("changeSelection")
		selection._emit("changeCursor")
		this.renderer.updateCursor();
		this.renderer.updateBackMarkers();
	};

	this.exitMultiSelectMode = function() {
		if (this.inVirtualSelectionMode)
			return;
		this.multiSelect.single();
	};

	// todo route copy/cut/paste through commandmanager
	this.getCopyText = function() {
        var text = "";
		if (this.inMultiSelectMode) {
			var ranges = this.multiSelect.rangeList.ranges;
			for (var i = 0; i < ranges.length; i++) {
				text += this.session.getTextRange(ranges[i]);
			}
        } else if (!this.selection.isEmpty())
            text = this.session.getTextRange(this.getSelectionRange());


        return text;
    };

	this.onCut = function() {
        var cmd = {
			name: "cut",
			exec: function(editor) {
				var range = editor.getSelectionRange();
				editor._emit("cut", range);

				if (!editor.selection.isEmpty()) {
					editor.session.remove(range);
					editor.clearSelection();
				}
			},
			readonly: true,
			multiSelectAction: "forEach"
		}
		this.commands.exec(cmd, this)
    };

	// commands

	this.selectMoreLines = function(dir, skip) {
		var range = this.selection.toOrientedRange();
		var isBackwards = range.cursor == range.end;

		var screenLead = this.session.documentToScreenPosition(range.cursor);
		if (this.selection.$desiredColumn)
			screenLead.column = this.selection.$desiredColumn;

		var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

		if (!range.isEmpty()) {
			var screenAnchor = this.session.documentToScreenPosition(isBackwards ? range.end : range.start);
			var anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
		} else {
			var anchor = lead;
		}

		if (isBackwards) {
			var newRange = Range.fromPoints(lead, anchor);
			newRange.cursor = newRange.start;
		} else {
			var newRange = Range.fromPoints(anchor, lead);
			newRange.cursor = newRange.end;
		}

		newRange.desiredColumn = screenLead.column;
		if (!this.selection.inMultiSelectMode) {
			this.selection.addRange(range);
		} else {
			var allRanges = this.selection.rangeList.ranges;
			// remove range if at end
			if (skip || range.isEequal(allRanges[dir == 1 ? 0 : allRanges.length - 1]))
				var toRemove = range.cursor;
		}

		this.selection.addRange(newRange);
		if (toRemove)
			this.selection.rangeList.substractPoint(toRemove);
	}

	this.transposeSelections = function(dir) {
		var session = this.session;
		var sel = session.multiSelect;
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

			words.unshift(this.session.getTextRange(range));
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

	this.selectMore = function (dir, skip) {
		var session = this.session;
		var sel = session.multiSelect;
		var all = sel.rangeList.all;

		var range = sel.toOrientedRange();
		if (range.isEmpty()) {
			var range = session.getWordRange(range.start.row, range.start.column)
			range.cursor = range.end;
			this.multiSelect.addRange(range);
		}
		var needle = session.getTextRange(range);


		var newRange = find(session, needle, dir);
		if (newRange) {
			newRange.cursor = dir == -1 ? newRange.start : newRange.end;
			this.multiSelect.addRange(newRange);
		}
		if (skip)
			this.multiSelect.rangeList.substractPoint(range.cursor);
	}


}).call(Editor.prototype);

// Todo emit event before exec?
exports.exec = function(command, editor, args) {
    if (typeof command === 'string')
        command = this.commands[command];

    if (!command)
        return false;

    if (editor && editor.$readOnly && !command.readOnly)
        return false;

    if (!command.multiSelectAction) {
        command.exec(editor, args || {});
    } else if (command.multiSelectAction == "forEach") {
        editor.forEachSelection(command, args);
    } else if (command.multiSelectAction == "single") {
		editor.exitMultiSelectMode();
        command.exec(editor, args || {});
	} else {
        command.multiSelectAction(editor, args || {});
	}
    return true;
};



// mouse
function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column
}

// patch
// adds multicursor support to a session
exports.onSessionChange = function(e) {
	var session = e.session;
	if (!session.multiSelect) {
		session.$selectionMarkers = [];
		session.selection.$initRangeList();
		session.multiSelect = session.selection;
	}
    this.multiSelect = session.multiSelect;

	var oldSession = e.oldSession;
	if (oldSession) {
		// todo use events
		if (oldSession.multiSelect && oldSession.multiSelect.editor == this)
			oldSession.multiSelect.editor = null;

		session.multiSelect.removeEventListener("addRange", this.$onAddRange);
		session.multiSelect.removeEventListener("removeRange", this.$onRemoveRange);
		session.multiSelect.removeEventListener("multiSelect", this.$onMultiSelect);
		session.multiSelect.removeEventListener("singleSelect", this.$onSingleSelect);
	}

	session.multiSelect.on("addRange", this.$onAddRange);
	session.multiSelect.on("removeRange", this.$onRemoveRange);
	session.multiSelect.on("multiSelect", this.$onMultiSelect);
	session.multiSelect.on("singleSelect", this.$onSingleSelect);
	
	if (this.inMultiSelectMode != session.selection.inMultiSelectMode) {
		if (session.selection.inMultiSelectMode)
			this.$onMultiSelect();
		else
			this.$onSingleSelect();
	}
}

// adds multicursor support to editor instance
function MultiSelect(editor) {
	editor.$onAddRange = editor.$onAddRange.bind(editor);
	editor.$onRemoveRange = editor.$onRemoveRange.bind(editor);
	editor.$onMultiSelect = editor.$onMultiSelect.bind(editor);
	editor.$onSingleSelect = editor.$onSingleSelect.bind(editor);

    exports.onSessionChange.call(editor, editor);
    editor.on("changeSession", exports.onSessionChange.bind(editor));

    editor.on("mousedown", onMouseDown);
    editor.commands.addCommands(exports.commands.defaultCommands);
}



exports.MultiSelect = MultiSelect;

});