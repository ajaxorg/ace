define(function(require, exports, module) {
"use strict";

var HashHandler = require("../keyboard/hash_handler").HashHandler;
var config = require("../config");

exports.handler = new HashHandler();
exports.handler.$id = "ace/keyboard/vscode";

exports.handler.addCommands([{
    name: "toggleWordWrap",
    exec: function(editor) {
        var wrapUsed = editor.session.getUseWrapMode();
        editor.session.setUseWrapMode(!wrapUsed);
    },
    readOnly: true
}, {
    name: "navigateToLastEditLocation",
    exec: function(editor) {
        var lastDelta = editor.session.getUndoManager().$lastDelta;
        var range = (lastDelta.action  == "remove")? lastDelta.start: lastDelta.end;
        editor.moveCursorTo(range.row, range.column);
        editor.clearSelection();
    }
}, {
    name: "replaceAll",
    exec: function (editor) {
        if (!editor.searchBox) {
            config.loadModule("ace/ext/searchbox", function(e) {
                e.Search(editor, true);
            });
        } else {
            if (editor.searchBox.active === true && editor.searchBox.replaceOption.checked === true) {
                editor.searchBox.replaceAll();
            }
        }
    }
}, {
    name: "replaceOne",
    exec: function (editor) {
        if (!editor.searchBox) {
            config.loadModule("ace/ext/searchbox", function(e) {
                e.Search(editor, true);
            });
        } else {
            if (editor.searchBox.active === true && editor.searchBox.replaceOption.checked === true) {
                editor.searchBox.replace();
            }
        }
    }
}, {
    name: "selectAllMatches",
    exec: function (editor) {
        if (!editor.searchBox) {
            config.loadModule("ace/ext/searchbox", function(e) {
                e.Search(editor, false);
            });
        } else {
            if (editor.searchBox.active === true) {
                editor.searchBox.findAll();
            }
        }
    }
}, {
    name: "toggleFindCaseSensitive",
    exec: function (editor) {
        config.loadModule("ace/ext/searchbox", function(e) {
            e.Search(editor, false);
            var sb = editor.searchBox;
            sb.caseSensitiveOption.checked = !sb.caseSensitiveOption.checked;
            sb.$syncOptions();
        });

    }
}, {
    name: "toggleFindInSelection",
    exec: function (editor) {
        config.loadModule("ace/ext/searchbox", function(e) {
            e.Search(editor, false);
            var sb = editor.searchBox;
            sb.searchOption.checked = !sb.searchRange;
            sb.setSearchRange(sb.searchOption.checked && sb.editor.getSelectionRange());
            sb.$syncOptions();
        });
    }
}, {
    name: "toggleFindRegex",
    exec: function (editor) {
        config.loadModule("ace/ext/searchbox", function(e) {
            e.Search(editor, false);
            var sb = editor.searchBox;
            sb.regExpOption.checked = !sb.regExpOption.checked;
            sb.$syncOptions();
        });
    }
}, {
    name: "toggleFindWholeWord",
    exec: function (editor) {
        config.loadModule("ace/ext/searchbox", function(e) {
            e.Search(editor, false);
            var sb = editor.searchBox;
            sb.wholeWordOption.checked = !sb.wholeWordOption.checked;
            sb.$syncOptions();
        });
    }
}, {
    name: "removeSecondaryCursors",
    exec: function (editor) {
        var ranges = editor.selection.ranges;
        if (ranges && ranges.length > 1)
            editor.selection.toSingleRange(ranges[ranges.length - 1]);
        else
            editor.selection.clearSelection();
    }
}]);


[{
    bindKey: {mac: "Ctrl-G", win: "Ctrl-G"},
    name: "gotoline"
}, {
    bindKey: {mac: "Command-Shift-L|Command-F2", win: "Ctrl-Shift-L|Ctrl-F2"},
    name: "findAll"
}, {
    bindKey: {mac: "Shift-F8|Shift-Option-F8", win: "Shift-F8|Shift-Alt-F8"},
    name: "goToPreviousError"
}, {
    bindKey: {mac: "F8|Option-F8", win: "F8|Alt-F8"},
    name: "goToNextError"
}, {
    bindKey: {mac: "Command-Shift-P|F1", win: "Ctrl-Shift-P|F1"},
    name: "openCommandPallete"
}, {
    bindKey: {mac: "Command-K|Command-S", win: "Ctrl-K|Ctrl-S"},
    name: "showKeyboardShortcuts"
}, {
    bindKey: {mac: "Shift-Option-Up", win: "Alt-Shift-Up"},
    name: "copylinesup"
}, {
    bindKey: {mac: "Shift-Option-Down", win: "Alt-Shift-Down"},
    name: "copylinesdown"
}, {
    bindKey: {mac: "Command-Shift-K", win: "Ctrl-Shift-K"},
    name: "removeline"
}, {
    bindKey: {mac: "Command-Enter", win: "Ctrl-Enter"},
    name: "addLineAfter"
}, {
    bindKey: {mac: "Command-Shift-Enter", win: "Ctrl-Shift-Enter"},
    name: "addLineBefore"
}, {
    bindKey: {mac: "Command-Shift-\\", win: "Ctrl-Shift-\\"},
    name: "jumptomatching"
}, {
    bindKey: {mac: "Command-]", win: "Ctrl-]"},
    name: "blockindent"
}, {
    bindKey: {mac: "Command-[", win: "Ctrl-["},
    name: "blockoutdent"
}, {
    bindKey: {mac: "Ctrl-PageDown", win: "Alt-PageDown"},
    name: "pagedown"
}, {
    bindKey: {mac: "Ctrl-PageUp", win: "Alt-PageUp"},
    name: "pageup"
}, {
    bindKey: {mac: "Shift-Option-A", win: "Shift-Alt-A"},
    name: "toggleBlockComment"
}, {
    bindKey: {mac: "Option-Z", win: "Alt-Z"},
    name: "toggleWordWrap"
}, {
    bindKey: {mac: "Command-G", win: "F3|Ctrl-K Ctrl-D"},
    name: "findnext"
}, {
    bindKey: {mac: "Command-Shift-G", win: "Shift-F3"},
    name: "findprevious"
}, {
    bindKey: {mac: "Option-Enter", win: "Alt-Enter"},
    name: "selectAllMatches"
}, {
    bindKey: {mac: "Command-D", win: "Ctrl-D"},
    name: "selectMoreAfter"
}, {
    bindKey: {mac: "Command-K Command-D", win: "Ctrl-K Ctrl-D"},
    name: "selectOrFindNext"
}, {
    bindKey: {mac: "Shift-Option-I", win: "Shift-Alt-I"},
    name: "splitSelectionIntoLines"
}, {
    bindKey: {mac: "Command-K M", win: "Ctrl-K M"},
    name: "modeSelect"
}, {
    // In VsCode this command is used only for folding instead of toggling fold
    bindKey: {mac: "Command-Option-[", win: "Ctrl-Shift-["},
    name: "toggleFoldWidget"
}, {
    bindKey: {mac: "Command-Option-]", win: "Ctrl-Shift-]"},
    name: "toggleFoldWidget"
}, {
    bindKey: {mac: "Command-K Command-0", win: "Ctrl-K Ctrl-0"},
    name: "foldall"
}, {
    bindKey: {mac: "Command-K Command-J", win: "Ctrl-K Ctrl-J"},
    name: "unfoldall"
}, {
    bindKey: { mac: "Command-K Command-1", win: "Ctrl-K Ctrl-1" },
    name: "foldOther"
}, {
    bindKey: { mac: "Command-K Command-Q", win: "Ctrl-K Ctrl-Q" },
    name: "navigateToLastEditLocation"
}, {
    bindKey: { mac: "Command-K Command-R|Command-K Command-S", win: "Ctrl-K Ctrl-R|Ctrl-K Ctrl-S" },
    name: "showKeyboardShortcuts"
}, {
    bindKey: { mac: "Command-K Command-X", win: "Ctrl-K Ctrl-X" },
    name: "trimTrailingSpace"
}, {
    bindKey: {mac: "Shift-Down|Command-Shift-Down", win: "Shift-Down|Ctrl-Shift-Down"},
    name: "selectdown"
}, {
    bindKey: {mac: "Shift-Up|Command-Shift-Up", win: "Shift-Up|Ctrl-Shift-Up"},
    name: "selectup"
}, {
    // TODO: add similar command to work inside SearchBox
    bindKey: {mac: "Command-Alt-Enter", win: "Ctrl-Alt-Enter"},
    name: "replaceAll"
}, {
    // TODO: add similar command to work inside SearchBox
    bindKey: {mac: "Command-Shift-1", win: "Ctrl-Shift-1"},
    name: "replaceOne"
}, {
    bindKey: {mac: "Option-C", win: "Alt-C"},
    name: "toggleFindCaseSensitive"
}, {
    bindKey: {mac: "Option-L", win: "Alt-L"},
    name: "toggleFindInSelection"
}, {
    bindKey: {mac: "Option-R", win: "Alt-R"},
    name: "toggleFindRegex"
}, {
    bindKey: {mac: "Option-W", win: "Alt-W"},
    name: "toggleFindWholeWord"
}, {
    bindKey: {mac: "Command-L", win: "Ctrl-L"},
    name: "expandtoline"
}, {
    bindKey: {mac: "Shift-Esc", win: "Shift-Esc"},
    name: "removeSecondaryCursors"
} 
// not implemented
/*{
    bindKey: {mac: "Option-Shift-Command-Right", win: "Shift-Alt-Right"},
    name: "smartSelect.expand"
}, {
    bindKey: {mac: "Ctrl-Shift-Command-Left", win: "Shift-Alt-Left"},
    name: "smartSelect.shrink"
}, {
    bindKey: {mac: "Shift-Option-F", win: "Shift-Alt-F"},
    name: "beautify"
}, {
    bindKey: {mac: "Command-K Command-F", win: "Ctrl-K Ctrl-F"},
    name: "formatSelection"
}, {
    bindKey: {mac: "Command-K Command-C", win: "Ctrl-K Ctrl-C"},
    name: "addCommentLine"
}, {
    bindKey: {mac: "Command-K Command-U", win: "Ctrl-K Ctrl-U"},
    name: "removeCommentLine"
}, {
    bindKey: {mac: "Command-K Command-/", win: "Ctrl-K Ctrl-/"},
    name: "foldAllBlockComments"
}, {
    bindKey: {mac: "Command-K Command-2", win: "Ctrl-K Ctrl-2"},
    name: "foldLevel2"
}, {
    bindKey: {mac: "Command-K Command-3", win: "Ctrl-K Ctrl-3"},
    name: "foldLevel3"
}, {
    bindKey: {mac: "Command-K Command-4", win: "Ctrl-K Ctrl-4"},
    name: "foldLevel4"
}, {
    bindKey: {mac: "Command-K Command-5", win: "Ctrl-K Ctrl-5"},
    name: "foldLevel5"
}, {
    bindKey: {mac: "Command-K Command-6", win: "Ctrl-K Ctrl-6"},
    name: "foldLevel6"
}, {
    bindKey: {mac: "Command-K Command-7", win: "Ctrl-K Ctrl-7"},
    name: "foldLevel7"
}, {
    bindKey: {mac: "Command-K Command-[", win: "Ctrl-K Ctrl-["},
    name: "foldRecursively"
}, {
    bindKey: {mac: "Command-K Command-8", win: "Ctrl-K Ctrl-8"},
    name: "foldAllMarkerRegions"
}, {
    bindKey: {mac: "Command-K Command-9", win: "Ctrl-K Ctrl-9"},
    name: "unfoldAllMarkerRegions"
}, {
    bindKey: {mac: "Command-K Command-]", win: "Ctrl-K Ctrl-]"},
    name: "unfoldRecursively"
}, {
    bindKey: {mac: "Command-K Command-T", win: "Ctrl-K Ctrl-T"},
    name: "selectTheme"
}, {
    bindKey: {mac: "Command-K Command-M", win: "Ctrl-K Ctrl-M"},
    name: "selectKeymap"
}, {
    bindKey: {mac: "Command-U", win: "Ctrl-U"},
    name: "cursorUndo"
}*/
].forEach(function(binding) {
    var command = exports.handler.commands[binding.name];
    if (command)
        command.bindKey = binding.bindKey;
    exports.handler.bindKey(binding.bindKey, command || binding.name);
});

});
