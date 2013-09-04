/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

var snippetManager = require("../snippets").snippetManager;
var Autocomplete = require("../autocomplete").Autocomplete;
var config = require("../config");

var textCompleter = require("../autocomplete/text_completer");
var keyWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var keywords = session.$mode.$keywordList || [];
        keywords = keywords.filter(function(w) {
            return w.lastIndexOf(prefix, 0) == 0;
        });
        callback(null, keywords.map(function(word) {
            return {
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        }));
    }
};

/* Forward complete manager for live auto complete starts here */
var forwardCompleterManager = {};
forwardCompleterManager.changeEvent = function(evt, editor){
	/* we use try because the change event might fire
	 * before all the editor utilities and methods
	 * are loaded */
	try {
		// counting the prefix length
		var session = editor.getSession();
		var pos = editor.getCursorPosition();
		
		// checking it the user typing an actual character
		var Range = require("ace/range").Range;
		var textBefore = session.getTextRange(Range.fromPoints({row: pos.row, column:pos.column-1}, {row: pos.row, column:pos.column+1}));
		
		if (/[^A-Za-z0-9]$/.test(textBefore)){
			return;	
		}
		
		// checking if the last word is longer than 2 characters
		textBefore = session.getTextRange(Range.fromPoints({row: pos.row, column:0}, pos));
		textBefore = textBefore.split(" ");
		textBefore = textBefore[textBefore.length - 1];

		// if the prefix is less than 2 characters stop
		if (textBefore.length < 2) {
			return;	
		}
		
		// as the user type, we need to show block
		// the snippets from showing
		forwardCompleterManager.onlyForward = true;
		
		// initiating the completer
		if (!this.completer) {
			this.completer = new Autocomplete();
		}
		// showing the popup
		this.completer.showPopup(editor);
		this.completer.cancelContextMenu();
	}
	catch(e){}
};

// are we showing the snippets or the forward complete
forwardCompleterManager.onlyForward = false;

// adding code descriptions and keywords to the completer
forwardCompleterManager.addMode = function(mode, arr){
	forwardCompleterManager.modes[mode] = arr;
};

// object to hold the forward completer data
forwardCompleterManager.modes = {};

// when the user change the state of their code (e.g. jump from
// php to html sections), load the new code descriptions and keywords.
forwardCompleterManager.modeChange = function(id) {
    if (!forwardCompleterManager.files) forwardCompleterManager.files = {};
    if (id && !forwardCompleterManager.files[id]) {
        var modeFilePath = 'ace/code/'+id;

        config.loadModule(modeFilePath, function(m) {
            if (m) {
                forwardCompleterManager.files[id] = m;
                forwardCompleterManager.addMode(m.scope, m.description);
            }
        });
    }
};

// the forward completer object
var forwardCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
		// if we are showing snippets, return empty array
		if (!forwardCompleterManager.onlyForward){
			callback(true, null);
			return;	
		}		
		// array for the keywords
        var keywords = [];
		
		// getting the current scope of code
		var scope = snippetManager.$getScope(editor);
		
		// loading the code description and keywords
		forwardCompleterManager.modeChange(scope);
		var obj = forwardCompleterManager.modes[scope];
		
		// creating the keyword list
		// we need to catch if the user is continues to type
		// (not selection an option)
		// and hit the enter key for a new line
		// if the results total length is the same
		// as the complete total, do not return anything
		var ttl = 0;
		var results_ttl = 0;
		for (p in obj){
			if (obj.hasOwnProperty(p)){
				for (var i=0; i<obj[p].length; i++){
					if (obj[p][i].lastIndexOf(prefix, 0) === 0){
						keywords.push({
							name: obj[p][i],
							value: obj[p][i],
							score: 0,
							meta: p
						});
						
						results_ttl++;
					}
					
					ttl++;
				}
			}
		}
		
		if (ttl == results_ttl) {
			callback(true, null);
			return;		
		}
		
        callback(null, keywords);
    }
};

var snippetCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
		// if the user is typing (forward complete), return empty results
		if (forwardCompleterManager.onlyForward){
			callback(true, null);
			return;	
		}
		// getting the current code scope
		// and loading the snippets
        var scope = snippetManager.$getScope(editor);
        var snippetMap = snippetManager.snippetMap;
		
        var completions = [];
        [scope, "_"].forEach(function(scope) {
            var snippets = snippetMap[scope] || [];
            for (var i = snippets.length; i--;) {
                var s = snippets[i];
                if (s.tabTrigger && s.tabTrigger.indexOf(prefix) === 0)
                    completions.push({
                        caption: s.tabTrigger,
                        snippet: s.content,
                        meta: "snippet"
                    });
            }
        }, this);
        callback(null, completions);
    }
};
// removed the textCompleter because it shows random value
// after the forward completer word is inserted
var completers = [forwardCompleter, snippetCompleter, /*textCompleter,*/ keyWordCompleter];
exports.addCompleter = function(completer) {
    completers.push(completer);
};

var expandSnippet = {
    name: "expandSnippet",
    exec: function(editor) {
        var success = snippetManager.expandWithTab(editor);
        if (!success)
            editor.execCommand("indent");
    },
    bindKey: "tab"
}

// change this method to load the snippets based on the
// code scope not the editor mode
// the id will be the scope mode returned by snippetManager.$getScope
var onChangeMode = function(id) {
    if (!snippetManager.files) snippetManager.files = {};
    if (id && !snippetManager.files[id]) {
        var snippetFilePath = 'ace/snippets/'+id;
        config.loadModule(snippetFilePath, function(m) {
            if (m) {
                snippetManager.files[id] = m;
                m.snippets = snippetManager.parseSnippetFile(m.snippetText);
                snippetManager.register(m.snippets, m.scope);
            }
        });
    }
};

var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableBasicAutocompletion: {
        set: function(val) {
            if (val) {
                this.completers = completers
                this.commands.addCommand(Autocomplete.startCommand);
            } else {
                this.commands.removeCommand(Autocomplete.startCommand);
            }
        },
        value: false
    },
    enableSnippets: {
        set: function(val) {
			// adding the snipped onChangeMode to the
			// editor so we can access it later on
			this.snippetOnChangeMode = onChangeMode;
            if (val) {
                this.commands.addCommand(expandSnippet);
				// since the mode is changed based on the user
				// actions, this event is not required
                //this.on("changeMode", onChangeMode);
                //onChangeMode(null, this)
            } else {
                this.commands.removeCommand(expandSnippet);
				// since the mode is changed based on the user
				// actions, this event is not required
                //this.off("changeMode", onChangeMode);
            }
        },
        value: false
    },
	// forward complete option
    enableForward: {
        set: function(val) {
			// attaching the forward complete manager to the editor
			// so we can access it in other methods
			// e.g. Autocomplete.startCommand
			this.forwardCompleterManager = forwardCompleterManager;
			// if there is a better event than change
			// probably we should use it (e.g. keyup)
			if (val){
				this.on("change", forwardCompleterManager.changeEvent);
			}
			else {
				this.off("change", forwardCompleterManager.changeEvent);
			}
        },
        value: false
    }
});

});
