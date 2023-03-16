"use strict";

var HashHandler = require("../keyboard/hash_handler").HashHandler;
var AceInline = require("../autocomplete/inline").AceInline;
var FilteredList = require("../autocomplete").FilteredList;
var CompletionProvider = require("../autocomplete").CompletionProvider;
var Editor = require("../editor").Editor;
var util = require("../autocomplete/util");
var lang = require("../lib/lang");
var dom = require("../lib/dom");
var useragent = require("../lib/useragent");
var snippetCompleter = require("./language_tools").snippetCompleter;
var textCompleter = require("./language_tools").textCompleter;
var keyWordCompleter = require("./language_tools").keyWordCompleter;

var destroyCompleter = function(e, editor) {
    editor.completer && editor.completer.destroy();
};

var minPosition = function (posA, posB) {
    if (posB.row > posA.row) {
        return posA;
    } else if (posB.row === posA.row && posB.column > posA.column) {
        return posA;
    }
    return posB;
};


/**
 * This class controls the inline-only autocompletion components and their lifecycle.
 * This is more lightweight than the popup-based autocompletion, as it can only work with exact prefix matches.
 * There is an inline ghost text renderer and an optional command bar tooltip inside.
 * @class
 */

var InlineAutocomplete = function(editor) {
    this.editor = editor;
    this.tooltipEnabled = true;
    this.keyboardHandler = new HashHandler(this.commands);
    this.$index = -1;

    this.blurListener = this.blurListener.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);

    this.changeTimer = lang.delayedCall(function() {
        this.updateCompletions();
    }.bind(this));
};

(function() {
    this.getInlineRenderer = function() {
        if (!this.inlineRenderer)
            this.inlineRenderer = new AceInline();
        return this.inlineRenderer;
    };

    this.getInlineTooltip = function() {
        if (!this.inlineTooltip) {
            this.inlineTooltip = new InlineTooltip(this.editor, document.body || document.documentElement);
            this.inlineTooltip.setCommands(this.commands);
        }
        return this.inlineTooltip;
    };


    /**
     * This function is the entry point to the class. This triggers the gathering of the autocompletion and displaying the results;
     * @param {Editor} editor
     * @param {CompletionOptions} options
     */
    this.show = function(options) {
        this.activated = true;

        if (this.editor.completer !== this) {
            if (this.editor.completer)
                this.editor.completer.detach();
            this.editor.completer = this;
        }

        this.editor.on("changeSelection", this.changeListener);
        this.editor.on("blur", this.blurListener);
        this.editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions(options);
    };

    this.$open = function() {
        if (this.editor.textInput.setAriaOptions) {
            this.editor.textInput.setAriaOptions({});
        }

        if (this.tooltipEnabled) {
            this.getInlineTooltip().show(this.editor);
        } else if (this.tooltipEnabled === "hover") {
        }

        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);

        if (this.$index === -1) {
            this.setIndex(0);
        } else {
            this.$showCompletion();
        }
        
        this.changeTimer.cancel();
    };
    
    this.insertMatch = function() {
        var result = this.getCompletionProvider().insertByIndex(this.editor, this.$index);
        this.detach();
        return result;
    };

    this.commands = {
        "Previous": {
            bindKey: "Alt-[",
            name: "Previous",
            exec: function(editor) {
                editor.completer.goTo("prev");
            },
            enabled: function(editor) {
                return editor.completer.getIndex() > 0;
            },
            position: 10
        },
        "Next": {
            bindKey: "Alt-]",
            name: "Next",
            exec: function(editor) {
                editor.completer.goTo("next");
            },
            enabled: function(editor) {
                return editor.completer.getIndex() < editor.completer.getLength() - 1;
            },
            position: 20
        },
        "Accept": {
            bindKey: { win: "Tab|Ctrl-Right", mac: "Tab|Cmd-Right" },
            name: "Accept",
            exec: function(editor) {
                return editor.completer.insertMatch();
            },
            enabled: function(editor) {
                return editor.completer.getIndex() >= 0;
            },
            position: 30
        },
        "Close": {
            bindKey: "Esc",
            name: "Close",
            exec: function(editor) {
                editor.completer.detach();
            },
            enabled: true,
            position: 40
        }
    };

    this.changeListener = function(e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row != this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    };

    this.blurListener = function(e) {
        this.detach();
    };

    this.mousewheelListener = function(e) {
        if (this.inlineTooltip && this.inlineTooltip.isShown()) {
            this.inlineTooltip.updatePosition();
        }
    };

    this.goTo = function(where) {
        if (!this.completions || !this.completions.filtered) {
            return;
        }
        switch(where.toLowerCase()) {
            case "prev":
                this.setIndex(Math.max(0, this.$index - 1));
                break;
            case "next":
                this.setIndex(this.$index + 1);
                break;
            case "first":
                this.setIndex(0);
                break;
            case "last":
                this.setIndex(this.completions.filtered.length - 1);
                break;
        }
    };

    this.getLength = function() {
        if (!this.completions || !this.completions.filtered) {
            return 0;
        }
        return this.completions.filtered.length;
    };

    this.getData = function(index) {
        if (index == undefined || index === null) {
            return this.completions.filtered[this.$index];
        } else {
            return this.completions.filtered[index];
        }
    };

    this.getIndex = function() {
        return this.$index;
    };

    this.isOpen = function() {
        return this.$index >= 0;
    };

    this.setIndex = function(value) {
        if (!this.completions || !this.completions.filtered) {
            return;
        }
        var newIndex = Math.max(-1, Math.min(this.completions.filtered.length - 1, value));
        if (newIndex !== this.$index) {
            this.$index = newIndex;
            this.$showCompletion();
        }
    };

    this.getCompletionProvider = function() {
        if (!this.completionProvider)
            this.completionProvider = new CompletionProvider();
        return this.completionProvider;
    };

    this.$showCompletion = function() {
        if (!this.getInlineRenderer().show(this.editor, this.completions.filtered[this.$index], this.completions.filterText)) {
            // Not able to show the completion, hide the previous one
            this.getInlineRenderer().hide();
        }
        if (this.inlineTooltip && this.inlineTooltip.isShown()) {
            this.inlineTooltip.updateButtons();
        }
    };

    this.$updatePrefix = function() {
        var pos = this.editor.getCursorPosition();
        var prefix = this.editor.session.getTextRange({start: this.base, end: pos});
        this.completions.setFilter(prefix);
        if (!this.completions.filtered.length)
            return this.detach();
        if (this.completions.filtered.length == 1
        && this.completions.filtered[0].value == prefix
        && !this.completions.filtered[0].snippet)
            return this.detach();
        this.$open(this.editor, prefix);
        return prefix;
    };

    this.updateCompletions = function(options) {
        var prefix = "";
        
        if (options && options.matches) {
            var pos = this.editor.getSelectionRange().start;
            this.base = this.editor.session.doc.createAnchor(pos.row, pos.column);
            this.base.$insertRight = true;
            this.completions = new FilteredList(options.matches);
            return this.$open(this.editor, "");
        }

        if (this.base && this.completions) {
            prefix = this.$updatePrefix();
        }

        var session = this.editor.getSession();
        var pos = this.editor.getCursorPosition();
        var prefix = util.getCompletionPrefix(this.editor);
        this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);
        this.base.$insertRight = true;
        var options = {
            exactMatch: true,
            ignoreCaption: true
        };
        this.getCompletionProvider().provideCompletions(this.editor, options, function(err, completions, finished) {
            var filtered = completions.filtered;
            var prefix = util.getCompletionPrefix(this.editor);

            if (finished) {
                // No results
                if (!filtered.length)
                    return this.detach();

                // One result equals to the prefix
                if (filtered.length == 1 && filtered[0].value == prefix && !filtered[0].snippet)
                    return this.detach();
            }
            this.completions = completions;
            this.$open(this.editor, prefix);
        }.bind(this));
    };

    this.detach = function() {
        if (this.editor) {
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.off("changeSelection", this.changeListener);
            this.editor.off("blur", this.blurListener);
            this.editor.off("mousewheel", this.mousewheelListener);
        }
        this.changeTimer.cancel();
        if (this.inlineTooltip) {
            this.inlineTooltip.detach();
        }
        
        this.setIndex(-1);

        if (this.completionProvider) {
            this.completionProvider.detach();
        }

        if (this.inlineRenderer && this.inlineRenderer.isOpen()) {
            this.inlineRenderer.hide();
        }

        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completionProvider = this.completions = this.base = null;
    };

    this.destroy = function() {
        this.detach();
        if (this.inlineRenderer)
            this.inlineRenderer.destroy();
        if (this.inlineTooltip)
            this.inlineTooltip.destroy();
        if (this.editor && this.editor.completer == this) {
            this.editor.off("destroy", destroyCompleter);
            this.editor.completer = null;
        }
        this.inlineTooltip = this.editor = this.inlineRenderer = null;
    };

}).call(InlineAutocomplete.prototype);

InlineAutocomplete.for = function(editor) {
    if (editor.completer instanceof InlineAutocomplete) {
        return editor.completer;
    }
    if (editor.completer) {
        editor.completer.destroy();
        editor.completer = null;
    }

    editor.completer = new InlineAutocomplete(editor);
    editor.once("destroy", destroyCompleter);
    return editor.completer;
};

InlineAutocomplete.startCommand = {
    name: "startInlineAutocomplete",
    exec: function(editor, options) {
        var completer = InlineAutocomplete.for(editor);
        completer.show(options);
    },
    bindKey: { win: "Alt-C", mac: "Option-C" }
};


var completers = [snippetCompleter, textCompleter, keyWordCompleter];

require("../config").defineOptions(Editor.prototype, "editor", {
    enableInlineAutocompletion: {
        set: function(val) {
            if (val) {
                if (!this.completers)
                    this.completers = Array.isArray(val)? val : completers;
                this.commands.addCommand(InlineAutocomplete.startCommand);
            } else {
                this.commands.removeCommand(InlineAutocomplete.startCommand);
            }
        },
        value: false
    }
});

/**
 * Displays a command tooltip above the selection, with clickable elements.
 * @class
 */

/**
 * Creates the inline command tooltip helper which displays the available keyboard commands for the user.
 * @param {HTMLElement} parentElement
 * @constructor
 */

var ENTRY_CLASS_NAME = 'inline_autocomplete_tooltip_entry';
var BUTTON_CLASS_NAME = 'inline_autocomplete_tooltip_button';
var TOOLTIP_CLASS_NAME = 'ace_tooltip ace_inline_autocomplete_tooltip';
var TOOLTIP_ID = 'inline_autocomplete_tooltip';

function InlineTooltip(editor, parentElement) {
    this.editor = editor;
    this.htmlElement = document.createElement('div');
    var el = this.htmlElement;
    el.style.display = 'none';
    if (parentElement) {
        parentElement.appendChild(el);
    }
    el.id = TOOLTIP_ID;
    el.style['pointer-events'] = 'auto';
    el.className = TOOLTIP_CLASS_NAME;
    this.commands = {};
    this.buttons = {};
    this.eventListeners = {};
}

(function() {

    var captureMousedown = function(e) {
        e.preventDefault();
    };

    /**
     * This function sets the commands. Note that it is advised to call this before calling show, otherwise there are no buttons to render
     * @param {Record<string, TooltipCommand>} commands
     */
    this.setCommands = function(commands) {
        if (!commands || !this.htmlElement) {
            return;
        }
        this.detach();
        var el = this.htmlElement;
        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }

        this.commands = commands;
        this.buttons = {};
        this.eventListeners = {};
    
        Object.keys(commands)
            .map(function(key) { return [key, commands[key]]; })
            .filter(function (entry) { return entry[1].position > 0; })
            .sort(function (a, b) { return a[1].position - b[1].position; })
            .forEach(function (entry) {
                var key = entry[0];
                var command = entry[1];
                dom.buildDom(["div", { class: ENTRY_CLASS_NAME }, [['div', { class: BUTTON_CLASS_NAME, ref: key }, this.buttons]]], el, this.buttons);
                var bindKey = command.bindKey;
                if (typeof bindKey === 'object') {
                    bindKey = useragent.isMac ? bindKey.mac : bindKey.win;
                }
                bindKey = bindKey.replace("|", " / ");
                var buttonText = dom.createTextNode([command.name, "(", bindKey, ")"].join(" "));
                this.buttons[key].appendChild(buttonText);
            }.bind(this));
    };

    /**
     * Displays the clickable command bar tooltip
     * @param {Editor} editor
     */
    this.show = function() {
        this.detach();

        this.htmlElement.style.display = '';
        this.htmlElement.addEventListener('mousedown', captureMousedown.bind(this));

        this.updatePosition();
        this.updateButtons(true);
    };

    this.isShown = function() {
        return !!this.htmlElement && window.getComputedStyle(this.htmlElement).display !== "none";
    };

    /**
     * Updates the position of the command bar tooltip. It aligns itself above the topmost selection in the editor.
     */
    this.updatePosition = function() {
        if (!this.editor) {
            return;
        }
        var renderer = this.editor.renderer;

        var ranges;
        if (this.editor.selection.getAllRanges) {
            ranges = this.editor.selection.getAllRanges();
        } else {
            ranges = [this.editor.getSelection()];
        }
        if (!ranges.length) {
            return;
        }
        var minPos = minPosition(ranges[0].start, ranges[0].end);
        for (var i = 0, range; range = ranges[i]; i++) {
            minPos = minPosition(minPos, minPosition(range.start, range.end));
        }

        var pos = renderer.$cursorLayer.getPixelPosition(minPos, true);

        var el = this.htmlElement;
        var screenWidth = window.innerWidth;
        var rect = this.editor.container.getBoundingClientRect();

        pos.top += rect.top - renderer.layerConfig.offset;
        pos.left += rect.left - this.editor.renderer.scrollLeft;
        pos.left += renderer.gutterWidth;

        var top = pos.top - el.offsetHeight;

        el.style.top = top + "px";
        el.style.bottom = "";
        el.style.left = Math.min(screenWidth - el.offsetWidth, pos.left) + "px";
    };

    /**
     * Updates the buttons in the command bar tooltip. Should be called every time when any of the buttons can become disabled or enabled.
     */
    this.updateButtons = function(force) {
        Object.keys(this.buttons).forEach(function(key) {
            var commandEnabled = this.commands[key].enabled;
            if (typeof commandEnabled === 'function') {
                commandEnabled = commandEnabled(this.editor);
            }

            if (commandEnabled && (force || !this.eventListeners[key])) {
                this.buttons[key].className = BUTTON_CLASS_NAME;
                this.buttons[key].ariaDisabled = this.buttons[key].disabled = false;
                this.buttons[key].removeAttribute("disabled");
                var eventListener = function(e) {
                    this.commands[key].exec(this.editor);
                    e.preventDefault();
                }.bind(this);
                this.eventListeners[key] = eventListener;
                this.buttons[key].addEventListener('mousedown', eventListener);
            }
            if (!commandEnabled && (force || this.eventListeners[key])) {
                this.buttons[key].className = BUTTON_CLASS_NAME + "_disabled";
                this.buttons[key].ariaDisabled = this.buttons[key].disabled = true;
                this.buttons[key].setAttribute("disabled", "");
                this.buttons[key].removeEventListener('mousedown', this.eventListeners[key]);
                delete this.eventListeners[key];
            }
        }.bind(this));
    };
    
    this.detach = function() {
        var listenerKeys = Object.keys(this.eventListeners);
        if (this.eventListeners && listenerKeys.length) {
            listenerKeys.forEach(function(key) {
                this.buttons[key].removeEventListener('mousedown', this.eventListeners[key]);
                delete this.eventListeners[key];
            }.bind(this));
        }
        if (this.htmlElement) {
            this.htmlElement.removeEventListener('mousedown', captureMousedown.bind(this));
            this.htmlElement.style.display = 'none';
        }
    };

    this.destroy = function() {
        this.detach();
        if (this.htmlElement) {
            this.htmlElement.parentNode.removeChild(this.htmlElement);
        }
        this.editor = null;
        this.buttons = null;
        this.htmlElement = null;
        this.controls = null;
    };
}).call(InlineTooltip.prototype);

dom.importCssString(`
.ace_inline_autocomplete_tooltip {
    display: inline-block;
}
.${ENTRY_CLASS_NAME} {
    display: inline-block;
    padding: 0 5px;
}

.${BUTTON_CLASS_NAME} {
    display: inline-block;
    cursor: pointer;
    padding: 5px;
}

.${BUTTON_CLASS_NAME}:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

div.${BUTTON_CLASS_NAME}_disabled {
    display: inline-block;
    padding: 5px;
    cursor: default;
    color: #777;
}`, "inlinetooltip.css", false);

exports.InlineAutocomplete = InlineAutocomplete;
exports.InlineTooltip = InlineTooltip;
exports.TOOLTIP_ID = TOOLTIP_ID;
exports.BUTTON_CLASS_NAME = BUTTON_CLASS_NAME;
