var config = require("../config");
var oop = require("../lib/oop");
var HashHandler = require("../keyboard/hash_handler").HashHandler;
var occurStartCommand = require("./occur_commands").occurStartCommand;

// These commands can be installed in a normal key handler to start iSearch:
exports.iSearchStartCommands = [{
    name: "iSearch",
    bindKey: {win: "Ctrl-F", mac: "Command-F"},
    exec: function(editor, options) {
        config.loadModule(["core", "ace/incremental_search"], function(e) {
            var iSearch = e.iSearch = e.iSearch || new e.IncrementalSearch();
            iSearch.activate(editor, options.backwards);
            if (options.jumpToFirstMatch) iSearch.next(options);
        });
    },
    readOnly: true
}, {
    name: "iSearchBackwards",
    exec: function(editor, jumpToNext) { editor.execCommand('iSearch', {backwards: true}); },
    readOnly: true
}, {
    name: "iSearchAndGo",
    bindKey: {win: "Ctrl-K", mac: "Command-G"},
    exec: function(editor, jumpToNext) { editor.execCommand('iSearch', {jumpToFirstMatch: true, useCurrentOrPrevSearch: true}); },
    readOnly: true
}, {
    name: "iSearchBackwardsAndGo",
    bindKey: {win: "Ctrl-Shift-K", mac: "Command-Shift-G"},
    exec: function(editor) { editor.execCommand('iSearch', {jumpToFirstMatch: true, backwards: true, useCurrentOrPrevSearch: true}); },
    readOnly: true
}];

// These commands are only available when incremental search mode is active:
exports.iSearchCommands = [{
    name: "restartSearch",
    bindKey: {win: "Ctrl-F", mac: "Command-F"},
    exec: function(iSearch) {
        iSearch.cancelSearch(true);
    }
}, {
    name: "searchForward",
    bindKey: {win: "Ctrl-S|Ctrl-K", mac: "Ctrl-S|Command-G"},
    exec: function(iSearch, options) {
        options.useCurrentOrPrevSearch = true;
        iSearch.next(options);
    }
}, {
    name: "searchBackward",
    bindKey: {win: "Ctrl-R|Ctrl-Shift-K", mac: "Ctrl-R|Command-Shift-G"},
    exec: function(iSearch, options) {
        options.useCurrentOrPrevSearch = true;
        options.backwards = true;
        iSearch.next(options);
    }
}, {
    name: "extendSearchTerm",
    exec: function(iSearch, string) {
        iSearch.addString(string);
    }
}, {
    name: "extendSearchTermSpace",
    bindKey: "space",
    exec: function(iSearch) { iSearch.addString(' '); }
}, {
    name: "shrinkSearchTerm",
    bindKey: "backspace",
    exec: function(iSearch) {
        iSearch.removeChar();
    }
}, {
    name: 'confirmSearch',
    bindKey: 'return',
    exec: function(iSearch) { iSearch.deactivate(); }
}, {
    name: 'cancelSearch',
    bindKey: 'esc|Ctrl-G',
    exec: function(iSearch) { iSearch.deactivate(true); }
}, {
    name: 'occurisearch',
    bindKey: 'Ctrl-O',
    exec: function(iSearch) {
        var options = oop.mixin({}, iSearch.$options);
        iSearch.deactivate();
        occurStartCommand.exec(iSearch.$editor, options);
    }
}, {
    name: "yankNextWord",
    bindKey: "Ctrl-w",
    exec: function(iSearch) {
        var ed = iSearch.$editor,
            range = ed.selection.getRangeOfMovements(function(sel) { sel.moveCursorWordRight(); }),
            string = ed.session.getTextRange(range);
        iSearch.addString(string);
    }
}, {
    name: "yankNextChar",
    bindKey: "Ctrl-Alt-y",
    exec: function(iSearch) {
        var ed = iSearch.$editor,
            range = ed.selection.getRangeOfMovements(function(sel) { sel.moveCursorRight(); }),
            string = ed.session.getTextRange(range);
        iSearch.addString(string);
    }
}, {
    name: 'recenterTopBottom',
    bindKey: 'Ctrl-l',
    exec: function(iSearch) { iSearch.$editor.execCommand('recenterTopBottom'); }
}, {
    name: 'selectAllMatches',
    bindKey: 'Ctrl-space',
    exec: function(iSearch) {
        var ed = iSearch.$editor,
            hl = ed.session.$isearchHighlight,
            ranges = hl && hl.cache ? hl.cache
                .reduce(function(ranges, ea) {
                    return ranges.concat(ea ? ea : []); }, []) : [];
        iSearch.deactivate(false);
        ranges.forEach(ed.selection.addRange.bind(ed.selection));
    }
}, {
    name: 'searchAsRegExp',
    bindKey: 'Alt-r',
    exec: function(iSearch) {
        iSearch.convertNeedleToRegExp();
    }
}].map(function(cmd) {
    cmd.readOnly = true;
    cmd.isIncrementalSearchCommand = true;
    cmd.scrollIntoView = "animate-cursor";
    return cmd;
});

function IncrementalSearchKeyboardHandler(iSearch) {
    this.$iSearch = iSearch;
}

oop.inherits(IncrementalSearchKeyboardHandler, HashHandler);

(function() {
    /**
     * @param editor
     * @this {IncrementalSearchKeyboardHandler & this & {$commandExecHandler}}
     */
    this.attach = function(editor) {
        var iSearch = this.$iSearch;
        HashHandler.call(this, exports.iSearchCommands, editor.commands.platform);
        this.$commandExecHandler = editor.commands.on('exec', function(e) {
            if (!e.command.isIncrementalSearchCommand)
                return iSearch.deactivate();
            e.stopPropagation();
            e.preventDefault();
            var scrollTop = editor.session.getScrollTop();
            var result = e.command.exec(iSearch, e.args || {});
            editor.renderer.scrollCursorIntoView(null, 0.5);
            editor.renderer.animateScrolling(scrollTop);
            return result;
        });
    };

    /**
     * @this {IncrementalSearchKeyboardHandler & this & {$commandExecHandler}}
     * @param editor
     */
    this.detach = function(editor) {
        if (!this.$commandExecHandler) return;
        editor.commands.off('exec', this.$commandExecHandler);
        delete this.$commandExecHandler;
    };

    var handleKeyboard$super = this.handleKeyboard;
    /**
     * @param data
     * @param hashId
     * @param key
     * @param keyCode
     * @this {IncrementalSearchKeyboardHandler & import("../keyboard/hash_handler").HashHandler}
     */
    this.handleKeyboard = function(data, hashId, key, keyCode) {
        if (((hashId === 1/*ctrl*/ || hashId === 8/*command*/) && key === 'v')
         || (hashId === 1/*ctrl*/ && key === 'y')) return null;
        // @ts-ignore
        var cmd = handleKeyboard$super.call(this, data, hashId, key, keyCode);
        if (cmd && cmd.command) { return cmd; }
        if (hashId == -1) {
            var extendCmd = this.commands.extendSearchTerm;
            if (extendCmd) { return {command: extendCmd, args: key}; }
        }
        return false;
    };

}).call(IncrementalSearchKeyboardHandler.prototype);


exports.IncrementalSearchKeyboardHandler = IncrementalSearchKeyboardHandler;
