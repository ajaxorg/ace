/**
 * ## Language Tools extension for Ace Editor
 *
 * Provides autocompletion, snippets, and language intelligence features for the Ace code editor.
 * This extension integrates multiple completion providers including keyword completion, snippet expansion,
 * and text-based completion to enhance the coding experience with contextual suggestions and automated code generation.
 *
 * **Configuration Options:**
 * - `enableBasicAutocompletion`: Enable/disable basic completion functionality
 * - `enableLiveAutocompletion`: Enable/disable real-time completion suggestions
 * - `enableSnippets`: Enable/disable snippet expansion with Tab key
 * - `liveAutocompletionDelay`: Delay before showing live completion popup
 * - `liveAutocompletionThreshold`: Minimum prefix length to trigger completion
 *
 * **Usage:**
 * ```javascript
 * editor.setOptions({
 *   enableBasicAutocompletion: true,
 *   enableLiveAutocompletion: true,
 *   enableSnippets: true
 * });
 * ```
 *
 * @module
 */

"use strict";
/**@type{import("../snippets").snippetManager & {files?: {[key: string]: any}}}*/
var snippetManager = require("../snippets").snippetManager;
var Autocomplete = require("../autocomplete").Autocomplete;
var config = require("../config");
var lang = require("../lib/lang");
var util = require("../autocomplete/util");

var MarkerGroup = require("../marker_group").MarkerGroup;

var textCompleter = require("../autocomplete/text_completer");
/**@type {import("../../ace-internal").Ace.Completer}*/
var keyWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if (session.$mode.completer) {
            return session.$mode.completer.getCompletions(editor, session, pos, prefix, callback);
        }
        var state = editor.session.getState(pos.row);
        var completions = session.$mode.getCompletions(state, session, pos, prefix);
        completions = completions.map((el) => {
            el.completerId = keyWordCompleter.id;
            return el;
        });
        callback(null, completions);
    },
    id: "keywordCompleter"
};

var transformSnippetTooltip = function(str) {
    var record = {};
    return str.replace(/\${(\d+)(:(.*?))?}/g, function(_, p1, p2, p3) {
        return (record[p1] = p3 || '');
    }).replace(/\$(\d+?)/g, function (_, p1) {
        return record[p1];
    });
};
/**@type {import("../../ace-internal").Ace.Completer} */
var snippetCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var scopes = [];

        // set scope to html-tag if we're inside an html tag
        var token = session.getTokenAt(pos.row, pos.column);
        if (token && token.type.match(/(tag-name|tag-open|tag-whitespace|attribute-name|attribute-value)\.xml$/))
            scopes.push('html-tag');
        else
            scopes = snippetManager.getActiveScopes(editor);

        var snippetMap = snippetManager.snippetMap;
        var completions = [];
        scopes.forEach(function(scope) {
            var snippets = snippetMap[scope] || [];
            for (var i = snippets.length; i--;) {
                var s = snippets[i];
                var caption = s.name || s.tabTrigger;
                if (!caption)
                    continue;
                completions.push({
                    caption: caption,
                    snippet: s.content,
                    meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet",
                    completerId: snippetCompleter.id
                });
            }
        }, this);
        callback(null, completions);
    },
    getDocTooltip: function(item) {
        if (item.snippet && !item.docHTML) {
            item.docHTML = [
                "<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>",
                lang.escapeHTML(transformSnippetTooltip(item.snippet))
            ].join("");
        }
    },
    id: "snippetCompleter"
};

var completers = [snippetCompleter, textCompleter, keyWordCompleter];
/**
 * Replaces the default list of completers with a new set of completers.
 *
 * @param {import("../../ace-internal").Ace.Completer[]} [val]
 *
 */
exports.setCompleters = function(val) {
    completers.length = 0;
    if (val) completers.push.apply(completers, val);
};
/**
 * Adds a new completer to the list of available completers.
 *
 * @param {import("../../ace-internal").Ace.Completer} completer - The completer object to be added to the completers array.
 */
exports.addCompleter = function(completer) {
    completers.push(completer);
};

// Exports existing completer so that user can construct his own set of completers.
exports.textCompleter = textCompleter;
exports.keyWordCompleter = keyWordCompleter;
exports.snippetCompleter = snippetCompleter;

var expandSnippet = {
    name: "expandSnippet",
    exec: function(editor) {
        return snippetManager.expandWithTab(editor);
    },
    bindKey: "Tab"
};

var onChangeMode = function(e, editor) {
    loadSnippetsForMode(editor.session.$mode);
};

var loadSnippetsForMode = function(mode) {
    if (typeof mode == "string")
        mode = config.$modes[mode];
    if (!mode)
        return;
    if (!snippetManager.files)
        snippetManager.files = {};
    
    loadSnippetFile(mode.$id, mode.snippetFileId);
    if (mode.modes)
        mode.modes.forEach(loadSnippetsForMode);
};

var loadSnippetFile = function(id, snippetFilePath) {
    if (!snippetFilePath || !id || snippetManager.files[id])
        return;
    snippetManager.files[id] = {};
    config.loadModule(snippetFilePath, function(m) {
        if (!m) return;
        snippetManager.files[id] = m;
        if (!m.snippets && m.snippetText)
            m.snippets = snippetManager.parseSnippetFile(m.snippetText);
        snippetManager.register(m.snippets || [], m.scope);
        if (m.includeScopes) {
            snippetManager.snippetMap[m.scope].includeScopes = m.includeScopes;
            m.includeScopes.forEach(function(x) {
                loadSnippetsForMode("ace/mode/" + x);
            });
        }
    });
};

var doLiveAutocomplete = function(e) {
    var editor = e.editor;
    var hasCompleter = editor.completer && editor.completer.activated;

    // We don't want to autocomplete with no prefix
    if (e.command.name === "backspace") {
        if (hasCompleter && !util.getCompletionPrefix(editor))
            editor.completer.detach();
    }
    else if (e.command.name === "insertstring" && !hasCompleter) {
        lastExecEvent = e;
        var delay = e.editor.$liveAutocompletionDelay;
        if (delay) {
            liveAutocompleteTimer.delay(delay);
        } else {
            showLiveAutocomplete(e);
        }
    }
};

var lastExecEvent;
var liveAutocompleteTimer = lang.delayedCall(function () {
    showLiveAutocomplete(lastExecEvent);
}, 0);

var showLiveAutocomplete = function(e) {
    var editor = e.editor;
    var prefix = util.getCompletionPrefix(editor);
    // Only autocomplete if there's a prefix that can be matched or previous char is trigger character 
    var previousChar = e.args;
    var triggerAutocomplete = util.triggerAutocomplete(editor, previousChar);
    if (prefix && prefix.length >= editor.$liveAutocompletionThreshold || triggerAutocomplete) {
        var completer = Autocomplete.for(editor);
        // Set a flag for auto shown
        completer.autoShown = true;
        completer.showPopup(editor);
    }
};

var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableBasicAutocompletion: {
        /**
         * @param val
         * @this{Editor}
         */
        set: function(val) {
            if (val) {
                Autocomplete.for(this);

                if (!this.completers)
                    this.completers = Array.isArray(val)? val: completers;
                this.commands.addCommand(Autocomplete.startCommand);
            } else {
                this.commands.removeCommand(Autocomplete.startCommand);
            }
        },
        value: false
    },
    /**
     * Enable live autocompletion
     */
    enableLiveAutocompletion: {
        /**
         * @param {boolean} val
         * @this {Editor}
         */
        set: function(val) {
            if (val) {
                if (!this.completers)
                    this.completers = Array.isArray(val)? val: completers;
                // On each change automatically trigger the autocomplete
                this.commands.on('afterExec', doLiveAutocomplete);
            } else {
                this.commands.off('afterExec', doLiveAutocomplete);
            }
        },
        value: false
    },
    liveAutocompletionDelay: {
        initialValue: 0
    },
    liveAutocompletionThreshold: {
        initialValue: 0
    },
    enableSnippets: {
        set: function(val) {
            if (val) {
                this.commands.addCommand(expandSnippet);
                this.on("changeMode", onChangeMode);
                onChangeMode(null, this);
            } else {
                this.commands.removeCommand(expandSnippet);
                this.off("changeMode", onChangeMode);
            }
        },
        value: false
    }
});

exports.MarkerGroup = MarkerGroup;