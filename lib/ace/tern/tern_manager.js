/**!
 * Manages completions for all modes when tern is eanbled
 */
define(function (require, exports, module) {
    "use strict";
    
    //#region LoadCompletors_fromLangTools
    var config = require("../config");
    var snippetManager = require("../snippets").snippetManager;
    var snippetCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            var snippetMap = snippetManager.snippetMap;
            var completions = [];
            snippetManager.getActiveScopes(editor).forEach(function (scope) {
                var snippets = snippetMap[scope] || [];
                for (var i = snippets.length; i--;) {
                    var s = snippets[i];
                    var caption = s.name || s.tabTrigger;
                    if (!caption) continue;
                    completions.push({
                        caption: caption,
                        snippet: s.content,
                        meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet"
                    });
                }
            }, this);
            callback(null, completions);
        }
    };
    var textCompleter = require("../autocomplete/text_completer");
    var keyWordCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            var state = editor.session.getState(pos.row);
            var completions = session.$mode.getCompletions(state, session, pos, prefix);
            callback(null, completions);
        }
    };
    var completers = [snippetCompleter, textCompleter, keyWordCompleter];

    // Allows default completers to be removed or replaced with a explict set of completers
    // A null argument here will result in an empty completer array, not a null attribute
    exports.setCompleters = function (val) {
        completers = val || [];
    };

    exports.addCompleter = function (completer) {
        completers.push(completer);
    };

    var expandSnippet = {
        name: "expandSnippet",
        exec: function (editor) {
            var success = snippetManager.expandWithTab(editor);
            if (!success) editor.execCommand("indent");
        },
        bindKey: "tab"
    };

    var loadSnippetsForMode = function (mode) {
        var id = mode.$id;
        if (!snippetManager.files)
            snippetManager.files = {};
        loadSnippetFile(id);
        if (mode.modes)
            mode.modes.forEach(loadSnippetsForMode);
    };

    var loadSnippetFile = function (id) {
        if (!id || snippetManager.files[id])
            return;
        var snippetFilePath = id.replace("mode", "snippets");
        snippetManager.files[id] = {};
        config.loadModule(snippetFilePath, function (m) {
            if (m) {
                snippetManager.files[id] = m;
                if (!m.snippets && m.snippetText)
                    m.snippets = snippetManager.parseSnippetFile(m.snippetText);
                snippetManager.register(m.snippets || [], m.scope);
                if (m.includeScopes) {
                    snippetManager.snippetMap[m.scope].includeScopes = m.includeScopes;
                    m.includeScopes.forEach(function (x) {
                        loadSnippetFile("ace/mode/" + x);
                    });
                }
            }
        });
    };

    function getCompletionPrefix(editor) {
        var pos = editor.getCursorPosition();
        var line = editor.session.getLine(pos.row);
        var prefix;
        // Try to find custom prefixes on the completers
        editor.completers.forEach(function (completer) {
            if (completer.identifierRegexps) {
                completer.identifierRegexps.forEach(function (identifierRegex) {
                    if (!prefix && identifierRegex)
                        prefix = util.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
                });
            }
        });
        return prefix || util.retrievePrecedingIdentifier(line, pos.column);
    }

    var doLiveAutocomplete = function (e) {
        var editor = e.editor;
        var text = e.args || "";
        var hasCompleter = editor.completer && editor.completer.activated;

        // We don't want to autocomplete with no prefix
        if (e.command.name === "backspace") {
            if (hasCompleter && !getCompletionPrefix(editor))
                editor.completer.detach();
        }
        else if (e.command.name === "insertstring") {
            var prefix = getCompletionPrefix(editor);
            // Only autocomplete if there's a prefix that can be matched
            if (prefix && !hasCompleter) {
                if (!editor.completer) {
                    // Create new autocompleter
                    editor.completer = new Autocomplete();
                }
                // Disable autoInsert
                editor.completer.autoInsert = false;
                editor.completer.showPopup(editor);
            }
        }
    };
    //#endregion


    //#region AutoComplete

    /* Override the StartAutoComplete command (from ext-language_tools)   */
    var Autocomplete = require("../autocomplete").Autocomplete;
    Autocomplete.startCommand = {
        name: "startAutocomplete",
        exec: function (editor, e) {
            if (!editor.completer) {
                editor.completer = new Autocomplete();
            }
            //determine which completers should be enabled
            editor.completers = [];
            if (editor.$enableSnippets) { //snippets are allowed with or without tern
                editor.completers.push(snippetCompleter);
            }

            if (editor.ternServer && editor.$enableTern) {
                //enable tern based on mode
                if (editor.ternServer.enabledAtCurrentLocation(editor)) {
                    editor.completers.push(editor.ternServer);
                    editor.ternServer.aceTextCompletor = textCompleter; //9.30.2014- give tern the text completor
                }
                else {
                    if (editor.$enableBasicAutocompletion) {
                        editor.completers.push(textCompleter, keyWordCompleter);
                    }
                }
            }
            else { //tern not enabled
                if (editor.$enableBasicAutocompletion) {
                    editor.completers.push(textCompleter, keyWordCompleter);
                }
            }
            editor.completer.showPopup(editor);
            editor.completer.cancelContextMenu();
        },
        bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
    };
    var onChangeMode = function (e, editor) {
        loadSnippetsForMode(editor.session.$mode);
    };
    //#endregion


    //#region Tern
    var ternOptions = {};

    var TernServer = require("./tern_server").TernServer;
    var aceTs;
    /**
     * assigns local var aceTs to a new TernServer instance using local var ternOptions.
     * Automatically loads tern worker script if not loaded and not using worker (no need to load if useing worker)
     * @param {function} cb - callback which is called when server is created (because loading tern source may be required)
     */
    var createTernServer = function (cb) {
        var src = ternOptions.workerScript || config.moduleUrl('worker/tern');
        //if useWorker was set to false, then load file (because useWorker is default)
        if (ternOptions.useWorker === false) {
            var id = 'ace_tern_files';
            if (document.getElementById(id)) inner();
            else {
                var el = document.createElement('script');
                el.setAttribute('id', id);
                document.head.appendChild(el);
                el.onload = inner;
                el.setAttribute('src', src);
                console.info('el',el);
            }
        }
        else inner();

        function inner() {
            //ensure that workerScript url is passed to tern
            if (!ternOptions.workerScript) ternOptions.workerScript = src;
            aceTs = new TernServer(ternOptions);
            cb();
        }
    };

    //hack: need a better solution to get the editor variable inside of the editor.getSession().selection.onchangeCursor event as the passed variable is of the selection, not the editor. This variable is being set in the enableTern set Option
    var editor_for_OnCusorChange = null;

    //3.6.2015: debounce arg hints as it can be quite slow in very large files
    var debounceArgHints;
    //show arguments hints when cursor is moved
    var onCursorChange_Tern = function (e, editor_getSession_selection) {
        clearTimeout(debounceArgHints);
        debounceArgHints = setTimeout(function () {
            editor_for_OnCusorChange.ternServer.updateArgHints(editor_for_OnCusorChange);
        }, 10);
    };

    //automatically start auto complete when period is typed
    var onAfterExec_Tern = function (e, commandManager) {
        if (e.command.name === "insertstring" && e.args === ".") {
            if (e.editor.ternServer && e.editor.ternServer.enabledAtCurrentLocation(e.editor)) {
                var pos = e.editor.getSelectionRange().end;
                var tok = e.editor.session.getTokenAt(pos.row, pos.column);
                if (tok) {
                    if (tok.type !== 'string' && tok.type.toString().indexOf('comment') === -1) {
                        try {
                            e.editor.ternServer.lastAutoCompleteFireTime = null; //reset since this was not triggered by user firing command but triggered automatically
                        }
                        catch (ex) {}
                        e.editor.execCommand("startAutocomplete");
                    }
                }
            }
        }
    };

    completers.push(aceTs);
    exports.server = aceTs;

    var Editor = require("../editor").Editor;
    config.defineOptions(Editor.prototype, "editor", {
        enableTern: {
            /**
             * Turns tern on or off
             * @param {bool|object} val - true/false or pass an object that contains tern options to set to true and create tern server with passed options
             * @note - Use this to restart tern with new options by setting to false then true again by passing new options;
             */
            set: function (val) {
                var self = this;
                if (typeof val === 'object') {
                    ternOptions = val;
                    val = true;
                }
                if (val) {
                    editor_for_OnCusorChange = self; //hack
                    createTernServer(function () {
                        self.completers = completers;
                        self.ternServer = aceTs;
                        self.commands.addCommand(Autocomplete.startCommand);
                        self.getSession().selection.on('changeCursor', onCursorChange_Tern);
                        self.commands.on('afterExec', onAfterExec_Tern);
                        aceTs.bindAceKeys(self);
                        //becasue this may be async, we provide callback as option
                        if (ternOptions.startedCb) ternOptions.startedCb();
                    });
                }
                else {
                    delete self.ternServer;
                    self.getSession().selection.off('changeCursor', onCursorChange_Tern);
                    self.commands.off('afterExec', onAfterExec_Tern);
                    if (!self.enableBasicAutocompletion) {
                        self.commands.removeCommand(Autocomplete.startCommand);
                    }
                }
            },
            value: false
        },
        enableBasicAutocompletion: {
            set: function (val) {
                if (val) {
                    this.completers = completers;
                    this.commands.addCommand(Autocomplete.startCommand);
                }
                else {
                    if (!this.$enableTern) {
                        this.commands.removeCommand(Autocomplete.startCommand);
                    }
                }
            },
            value: false
        },
        enableSnippets: {
            set: function (val) {
                if (val) {
                    this.commands.addCommand(expandSnippet);
                    this.on("changeMode", onChangeMode);
                    onChangeMode(null, this);
                }
                else {
                    this.commands.removeCommand(expandSnippet);
                    this.off("changeMode", onChangeMode);
                }
            },
            value: false
        }
    });
    //#endregion
});