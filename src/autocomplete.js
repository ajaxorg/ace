"use strict";
/**
 * @typedef {import("./editor").Editor} Editor
 * @typedef {import("../ace-internal").Ace.CompletionProviderOptions} CompletionProviderOptions
 * @typedef {import("../ace-internal").Ace.CompletionOptions} CompletionOptions
 */
var HashHandler = require("./keyboard/hash_handler").HashHandler;
var AcePopup = require("./autocomplete/popup").AcePopup;
var AceInline = require("./autocomplete/inline").AceInline;
var getAriaId = require("./autocomplete/popup").getAriaId;
var util = require("./autocomplete/util");
var lang = require("./lib/lang");
var dom = require("./lib/dom");
var snippetManager = require("./snippets").snippetManager;
var config = require("./config");
var event = require("./lib/event");
var preventParentScroll = require("./lib/scroll").preventParentScroll;

/**
 * @typedef BaseCompletion
 * @property {number} [score] - a numerical value that determines the order in which completions would be displayed.
 * A lower score means that the completion would be displayed further from the start
 * @property {string} [meta] - a short description of the completion
 * @property {string} [caption] - the text that would be displayed in the completion list. If omitted, value or snippet
 * would be shown instead.
 * @property {string} [docHTML] - an HTML string that would be displayed as an additional popup
 * @property {string} [docText] - a plain text that would be displayed as an additional popup. If `docHTML` exists,
 * it would be used instead of `docText`.
 * @property {string} [completerId] - the identifier of the completer
 * @property {import("../ace-internal").Ace.IRange} [range] - An object specifying the range of text to be replaced with the new completion value (experimental)
 * @property {string} [command] - A command to be executed after the completion is inserted (experimental)
 * @property {string} [snippet] - a text snippet that would be inserted when the completion is selected
 * @property {string} [value] - The text that would be inserted when selecting this completion.
 * @property {import("../ace-internal").Ace.Completer & {insertMatch:(editor: Editor, data: Completion) => void}} [completer]
 * @property {boolean} [hideInlinePreview]
 * @export
 */

/**
 * @typedef {BaseCompletion & {snippet: string}} SnippetCompletion
 * @property {string} snippet 
 * @property {string} [value]
 * @export
 */

/**
 * @typedef {BaseCompletion & {value: string}} ValueCompletion
 * @property {string} value 
 * @property {string} [snippet]
 * @export
 */

/**
 * Represents a suggested text snippet intended to complete a user's input
 * @typedef Completion
 * @type {SnippetCompletion|ValueCompletion}
 * @export
 */

var destroyCompleter = function(e, editor) {
    editor.completer && editor.completer.destroy();
};

/**
 * This object controls the autocompletion components and their lifecycle.
 * There is an autocompletion popup, an optional inline ghost text renderer and a docuent tooltip popup inside.
 */
class Autocomplete {
    constructor() {
        this.autoInsert = false;
        this.autoSelect = true;
        this.autoShown = false;
        this.exactMatch = false;
        this.inlineEnabled = false;
        this.keyboardHandler = new HashHandler();
        this.keyboardHandler.bindKeys(this.commands);
        this.parentNode = null;
        this.setSelectOnHover = false;
        this.hasSeen = new Set();

        /**
         *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled 
         * it shows a loading indicator on the popup while autocomplete is loading.
         * 
         * Experimental: This visualisation is not yet considered stable and might change in the future.
         */
        this.showLoadingState = false;

        /**
         *  @property {number} stickySelectionDelay - a numerical value that determines after how many ms the popup selection will become 'sticky'.
         *  Normally, when new elements are added to an open popup, the selection is reset to the first row of the popup. If sticky, the focus will remain
         *  on the currently selected item when new items are added to the popup. Set to a negative value to disable this feature and never set selection to sticky.
         */
        this.stickySelectionDelay = 500;

        this.blurListener = this.blurListener.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.mousedownListener = this.mousedownListener.bind(this);
        this.mousewheelListener = this.mousewheelListener.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);

        this.changeTimer = lang.delayedCall(function() {
            this.updateCompletions(true);
        }.bind(this));

        this.tooltipTimer = lang.delayedCall(this.updateDocTooltip.bind(this), 50);
        this.popupTimer = lang.delayedCall(this.$updatePopupPosition.bind(this), 50);

        this.stickySelectionTimer = lang.delayedCall(function() {
            this.stickySelection = true;
        }.bind(this), this.stickySelectionDelay);

        this.$firstOpenTimer = lang.delayedCall(/**@this{Autocomplete}*/function() {
            var initialPosition = this.completionProvider && this.completionProvider.initialPosition;
            if (this.autoShown || (this.popup && this.popup.isOpen) || !initialPosition || this.editor.completers.length === 0) return;

            this.completions = new FilteredList(Autocomplete.completionsForLoading);
            this.openPopup(this.editor, initialPosition.prefix, false);
            this.popup.renderer.setStyle("ace_loading", true);
        }.bind(this), this.stickySelectionDelay);
    }

    static get completionsForLoading() { return [{
            caption: config.nls("autocomplete.loading", "Loading..."),
            value: ""
        }];
    }

    $init() {
        /**@type {AcePopup}**/
        this.popup = new AcePopup(this.parentNode || document.body || document.documentElement); 
        this.popup.on("click", function(e) {
            this.insertMatch();
            e.stop();
        }.bind(this));
        this.popup.focus = this.editor.focus.bind(this.editor);
        this.popup.on("show", this.$onPopupShow.bind(this));
        this.popup.on("hide", this.$onHidePopup.bind(this));
        this.popup.on("select", this.$onPopupChange.bind(this));
        event.addListener(this.popup.container, "mouseout", this.mouseOutListener.bind(this));
        this.popup.on("changeHoverMarker", this.tooltipTimer.bind(null, null));
        this.popup.renderer.on("afterRender", this.$onPopupRender.bind(this));
        return this.popup;
    }


    $initInline() {
        if (!this.inlineEnabled || this.inlineRenderer)
            return;
        this.inlineRenderer = new AceInline();
        return this.inlineRenderer;
    }

    /**
     * @return {AcePopup}
     */
    getPopup() {
        return this.popup || this.$init();
    }

    $onHidePopup() {
        if (this.inlineRenderer) {
            this.inlineRenderer.hide();
        }
        this.hideDocTooltip();
        this.stickySelectionTimer.cancel();
        this.popupTimer.cancel();
        this.stickySelection = false;
    }
    $seen(completion) {
        if (!this.hasSeen.has(completion) && completion && completion.completer && completion.completer.onSeen && typeof completion.completer.onSeen === "function") {
            completion.completer.onSeen(this.editor, completion);
            this.hasSeen.add(completion);
        }
    }
    $onPopupChange(hide) {
        if (this.inlineRenderer && this.inlineEnabled) {
            var completion = hide ? null : this.popup.getData(this.popup.getRow());
            this.$updateGhostText(completion);
            // If the mouse is over the tooltip, and we're changing selection on hover don't
            // move the tooltip while hovering over the popup.
            if (this.popup.isMouseOver && this.setSelectOnHover) {
                // @ts-expect-error TODO: potential wrong arguments
                this.tooltipTimer.call(null, null);
                return;
            }

            // Update the popup position after a short wait to account for potential scrolling
            this.popupTimer.schedule();
            this.tooltipTimer.schedule();
        } else {
            // @ts-expect-error TODO: potential wrong arguments
            this.popupTimer.call(null, null);
            // @ts-expect-error TODO: potential wrong arguments
            this.tooltipTimer.call(null, null);
        }
    }

    $updateGhostText(completion) {
        // Ghost text can include characters normally not part of the prefix (e.g. whitespace).
        // When typing ahead with ghost text however, we want to simply prefix with respect to the
        // base of the completion.
        var row = this.base.row;
        var column = this.base.column;
        var cursorColumn = this.editor.getCursorPosition().column;
        var prefix = this.editor.session.getLine(row).slice(column, cursorColumn);

        if (!this.inlineRenderer.show(this.editor, completion, prefix)) {
            this.inlineRenderer.hide();
        } else {
            this.$seen(completion);
        }
    }

    $onPopupRender() {
        const inlineEnabled = this.inlineRenderer && this.inlineEnabled;
        if (this.completions && this.completions.filtered && this.completions.filtered.length > 0) {
            for (var i = this.popup.getFirstVisibleRow(); i <= this.popup.getLastVisibleRow(); i++) {
                var completion = this.popup.getData(i);
                if (completion && (!inlineEnabled || completion.hideInlinePreview)) {
                    this.$seen(completion);
                }
            }
        }
    }

    $onPopupShow(hide) {
        this.$onPopupChange(hide);
        this.stickySelection = false;
        if (this.stickySelectionDelay >= 0)
            this.stickySelectionTimer.schedule(this.stickySelectionDelay);
    }

    observeLayoutChanges() {
        if (this.$elements || !this.editor) return;
        window.addEventListener("resize", this.onLayoutChange, {passive: true});
        window.addEventListener("wheel", this.mousewheelListener);

        var el = this.editor.container.parentNode;
        var elements = [];
        while (el) {
            elements.push(el);
            el.addEventListener("scroll", this.onLayoutChange, {passive: true});
            el = el.parentNode;
        }
        this.$elements = elements;
    }
    unObserveLayoutChanges() {
        // @ts-expect-error This is expected for some browsers
        window.removeEventListener("resize", this.onLayoutChange, {passive: true});
        window.removeEventListener("wheel", this.mousewheelListener);
        this.$elements && this.$elements.forEach((el) => {
            // @ts-expect-error This is expected for some browsers
            el.removeEventListener("scroll", this.onLayoutChange, {passive: true});
        });
        this.$elements = null;
    }
    onLayoutChange() {
        if (!this.popup.isOpen) return this.unObserveLayoutChanges();
        this.$updatePopupPosition();
        this.updateDocTooltip();
    }

    $updatePopupPosition() {
        var editor = this.editor;
        var renderer = editor.renderer;

        var lineHeight = renderer.layerConfig.lineHeight;
        var pos = renderer.$cursorLayer.getPixelPosition(this.base, true);
        pos.left -= this.popup.getTextLeftOffset();

        var rect = editor.container.getBoundingClientRect();
        pos.top += rect.top - renderer.layerConfig.offset;
        pos.left += rect.left - editor.renderer.scrollLeft;
        pos.left += renderer.gutterWidth;

        var posGhostText = {
            top: pos.top,
            left: pos.left
        };

        if (renderer.$ghostText && renderer.$ghostTextWidget) {
            if (this.base.row === renderer.$ghostText.position.row) {
                posGhostText.top += renderer.$ghostTextWidget.el.offsetHeight;
            }
        }

        // posGhostText can be below the editor rendering the popup away from the editor.
        // In this case, we want to render the popup such that the top aligns with the bottom of the editor.
        var editorContainerBottom = editor.container.getBoundingClientRect().bottom - lineHeight;
        var lowestPosition = editorContainerBottom < posGhostText.top ?
            {top: editorContainerBottom, left: posGhostText.left} :
            posGhostText;

        // Try to render below ghost text, then above ghost text, then over ghost text
        if (this.popup.tryShow(lowestPosition, lineHeight, "bottom")) {
            return;
        }

        if (this.popup.tryShow(pos, lineHeight, "top")) {
            return;
        }
        
        this.popup.show(pos, lineHeight);
    }

    /**
     * @param {Editor} editor
     * @param {string} prefix
     * @param {boolean} [keepPopupPosition]
     */
    openPopup(editor, prefix, keepPopupPosition) {
        this.$firstOpenTimer.cancel();

        if (!this.popup)
            this.$init();

        if (this.inlineEnabled && !this.inlineRenderer)
            this.$initInline();

        this.popup.autoSelect = this.autoSelect;
        this.popup.setSelectOnHover(this.setSelectOnHover);

        var oldRow = this.popup.getRow();
        var previousSelectedItem = this.popup.data[oldRow];

        this.popup.setData(this.completions.filtered, this.completions.filterText);
        if (this.editor.textInput.setAriaOptions) {
            this.editor.textInput.setAriaOptions({
                activeDescendant: getAriaId(this.popup.getRow()),
                inline: this.inlineEnabled
            });
        }

        editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        
        var newRow;
        if (this.stickySelection)
            newRow = this.popup.data.indexOf(previousSelectedItem); 
        if (!newRow || newRow === -1) 
            newRow = 0;
        
        this.popup.setRow(this.autoSelect ? newRow : -1);
     
        // If we stay on the same row, but the content is different, we want to update the popup.
        if (newRow === oldRow && previousSelectedItem !== this.completions.filtered[newRow]) 
            this.$onPopupChange();

        // If we stay on the same line and have inlinePreview enabled, we want to make sure the
        // ghost text remains up-to-date.
        const inlineEnabled = this.inlineRenderer && this.inlineEnabled;
        if (newRow === oldRow && inlineEnabled) {
            var completion = this.popup.getData(this.popup.getRow());
            this.$updateGhostText(completion);
        }

        if (!keepPopupPosition) {
            this.popup.setTheme(editor.getTheme());
            this.popup.setFontSize(editor.getFontSize());

            this.$updatePopupPosition();
            if (this.tooltipNode) {
                this.updateDocTooltip();
            }
        }
        this.changeTimer.cancel();
        this.observeLayoutChanges();
    }

    /**
     * Detaches all elements from the editor, and cleans up the data for the session
     */
    detach() {
        if (this.editor) {
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.off("changeSelection", this.changeListener);
            this.editor.off("blur", this.blurListener);
            this.editor.off("mousedown", this.mousedownListener);
            this.editor.off("mousewheel", this.mousewheelListener);
        }
        this.$firstOpenTimer.cancel();

        this.changeTimer.cancel();
        this.hideDocTooltip();

        if (this.completionProvider) {
            this.completionProvider.detach();
        }

        if (this.popup && this.popup.isOpen)
            this.popup.hide();

        if (this.popup && this.popup.renderer) {
            this.popup.renderer.off("afterRender", this.$onPopupRender);
        }

        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completionProvider = this.completions = this.base = null;
        this.unObserveLayoutChanges();
    }

    changeListener(e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row != this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    }

    blurListener(e) {
        // we have to check if activeElement is a child of popup because
        // on IE preventDefault doesn't stop scrollbar from being focussed
        var el = document.activeElement;
        var text = this.editor.textInput.getElement();
        var fromTooltip = e.relatedTarget && this.tooltipNode && this.tooltipNode.contains(e.relatedTarget);
        var container = this.popup && this.popup.container;
        if (el != text && el.parentNode != container && !fromTooltip
            && el != this.tooltipNode && e.relatedTarget != text
        ) {
            this.detach();
        }
    }

    mousedownListener(e) {
        this.detach();
    }

    mousewheelListener(e) {
        if (this.popup && !this.popup.isMouseOver)
            this.detach();
    }

    mouseOutListener(e) {
        // Check whether the popup is still open after the mouseout event,
        // if so, attempt to move it to its desired position.
        if (this.popup.isOpen)
            this.$updatePopupPosition();
    }

   goTo(where) {
        this.popup.goTo(where);
    }

    /**
     * @param {Completion} data
     * @param {undefined} [options]
     * @return {boolean | void}
     */
    insertMatch(data, options) {
        if (!data)
            data = this.popup.getData(this.popup.getRow());
        if (!data)
            return false;
        if (data.value === "") // Explicitly given nothing to insert, e.g. "No suggestion state"
            return this.detach();
        var completions = this.completions;
        // @ts-expect-error TODO: potential wrong arguments
        var result = this.getCompletionProvider().insertMatch(this.editor, data, completions.filterText, options);
        // detach only if new popup was not opened while inserting match
        if (this.completions == completions)
            this.detach();
        return result;
    }
    
    /**
     * This is the entry point for the autocompletion class, triggers the actions which collect and display suggestions
     * @param {Editor} editor
     * @param {CompletionOptions} options
     */
    showPopup(editor, options) {
        if (this.editor)
            this.detach();

        this.activated = true;

        this.editor = editor;
        if (editor.completer != this) {
            if (editor.completer)
                editor.completer.detach();
            editor.completer = this;
        }

        editor.on("changeSelection", this.changeListener);
        editor.on("blur", this.blurListener);
        editor.on("mousedown", this.mousedownListener);
        editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions(false, options);
    }

    getCompletionProvider(initialPosition) {
        if (!this.completionProvider)
            this.completionProvider = new CompletionProvider(initialPosition);
        return this.completionProvider;
    }

    /**
     * This method is deprecated, it is only kept for backwards compatibility.
     * Use the same method include CompletionProvider instead for the same functionality.
     * @deprecated
     */
    gatherCompletions(editor, callback) {
        return this.getCompletionProvider().gatherCompletions(editor, callback);
    }

    /**
     * @param {boolean} keepPopupPosition
     * @param {CompletionOptions} options
     */
    updateCompletions(keepPopupPosition, options) {
        if (keepPopupPosition && this.base && this.completions) {
            var pos = this.editor.getCursorPosition();
            var prefix = this.editor.session.getTextRange({start: this.base, end: pos});
            if (prefix == this.completions.filterText)
                return;
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();
            if (this.completions.filtered.length == 1
            && this.completions.filtered[0].value == prefix
            && !this.completions.filtered[0].snippet)
                return this.detach();
            this.openPopup(this.editor, prefix, keepPopupPosition);
            return;
        }
        
        if (options && options.matches) {
            var pos = this.editor.getSelectionRange().start;
            this.base = this.editor.session.doc.createAnchor(pos.row, pos.column);
            this.base.$insertRight = true;
            this.completions = new FilteredList(options.matches);
            this.getCompletionProvider().completions = this.completions;
            return this.openPopup(this.editor, "", keepPopupPosition);
        }

        var session = this.editor.getSession();
        var pos = this.editor.getCursorPosition();
        var prefix = util.getCompletionPrefix(this.editor);
        this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);
        this.base.$insertRight = true;
        var completionOptions = {
            exactMatch: this.exactMatch,
            // @ts-expect-error TODO: couldn't find initializer
            ignoreCaption: this.ignoreCaption
        };
        this.getCompletionProvider({
            prefix,
            pos
        }).provideCompletions(this.editor, completionOptions,
            /**
             * @type {(err: any, completions: FilteredList, finished: boolean) => void | boolean}
             * @this {Autocomplete}
             */
            function (err, completions, finished) {
                var filtered = completions.filtered;
                var prefix = util.getCompletionPrefix(this.editor);
            this.$firstOpenTimer.cancel();

                if (finished) {
                    // No results
                    if (!filtered.length) {
                        var emptyMessage = !this.autoShown && this.emptyMessage;
                        if (typeof emptyMessage == "function") emptyMessage = this.emptyMessage(prefix);
                        if (emptyMessage) {
                        var completionsForEmpty = [{
                            caption: emptyMessage,
                                    value: ""
                                }
                            ];
                            this.completions = new FilteredList(completionsForEmpty);
                            this.openPopup(this.editor, prefix, keepPopupPosition);
                            this.popup.renderer.setStyle("ace_loading", false);
                            this.popup.renderer.setStyle("ace_empty-message", true);
                            return;
                        }
                        return this.detach();
                    }

                    // One result equals to the prefix
                    if (filtered.length == 1 && filtered[0].value == prefix
                        && !filtered[0].snippet) return this.detach();

                    // Autoinsert if one result
                    if (this.autoInsert && !this.autoShown && filtered.length == 1) return this.insertMatch(
                        filtered[0]);
                }
            // If showLoadingState is true and there is still a completer loading, show 'Loading...'
            // in the top row of the completer popup.
            this.completions = !finished && this.showLoadingState ? 
                new FilteredList(
                    Autocomplete.completionsForLoading.concat(filtered), completions.filterText
                ) :
                completions;

                this.openPopup(this.editor, prefix, keepPopupPosition);

            this.popup.renderer.setStyle("ace_empty-message", false);
            this.popup.renderer.setStyle("ace_loading", !finished);
        }.bind(this));

        if (this.showLoadingState && !this.autoShown && !(this.popup && this.popup.isOpen)) {
            this.$firstOpenTimer.delay(this.stickySelectionDelay/2);
        }
    }

    cancelContextMenu() {
        this.editor.$mouseHandler.cancelContextMenu();
    }

    updateDocTooltip() {
        var popup = this.popup;
        var all = this.completions.filtered;
        var selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
        var doc = null;
        if (!selected || !this.editor || !this.popup.isOpen)
            return this.hideDocTooltip();
        
        var completersLength = this.editor.completers.length;
        for (var i = 0; i < completersLength; i++) {
            var completer = this.editor.completers[i];
            if (completer.getDocTooltip && selected.completerId === completer.id) {
                doc = completer.getDocTooltip(selected);
                break;
            }
        }
        if (!doc && typeof selected != "string")
            doc = selected;

        if (typeof doc == "string")
            doc = {docText: doc};
        if (!doc || !(doc.docHTML || doc.docText))
            return this.hideDocTooltip();
        this.showDocTooltip(doc);
    }

    showDocTooltip(item) {
        if (!this.tooltipNode) {
            this.tooltipNode = dom.createElement("div");
            this.tooltipNode.style.margin = "0";
            this.tooltipNode.style.pointerEvents = "auto";
            this.tooltipNode.style.overscrollBehavior = "contain";
            this.tooltipNode.tabIndex = -1;
            this.tooltipNode.onblur = this.blurListener.bind(this);
            this.tooltipNode.onclick = this.onTooltipClick.bind(this);
            this.tooltipNode.id = "doc-tooltip";
            this.tooltipNode.setAttribute("role", "tooltip");
            // prevent editor scroll if tooltip is inside an editor
            this.tooltipNode.addEventListener("wheel", preventParentScroll);
        }
        var theme = this.editor.renderer.theme;
        this.tooltipNode.className = "ace_tooltip ace_doc-tooltip " +
            (theme.isDark? "ace_dark " : "") + (theme.cssClass || "");

        var tooltipNode = this.tooltipNode;
        if (item.docHTML) {
            tooltipNode.innerHTML = item.docHTML;
        } else if (item.docText) {
            tooltipNode.textContent = item.docText;
        }

        if (!tooltipNode.parentNode)
            this.popup.container.appendChild(this.tooltipNode);

        var popup = this.popup;
        var rect = popup.container.getBoundingClientRect();
        tooltipNode.style.top = popup.container.style.top;
        tooltipNode.style.bottom = popup.container.style.bottom;

        tooltipNode.style.display = "block";
        if (window.innerWidth - rect.right < 320) {
            if (rect.left < 320) {
                if(popup.isTopdown) {
                    tooltipNode.style.top = rect.bottom + "px";
                    tooltipNode.style.left = rect.left + "px";
                    tooltipNode.style.right = "";
                    tooltipNode.style.bottom = "";
                } else {
                    tooltipNode.style.top = popup.container.offsetTop - tooltipNode.offsetHeight + "px";
                    tooltipNode.style.left = rect.left + "px";
                    tooltipNode.style.right = "";
                    tooltipNode.style.bottom = "";
                }
            } else {
                tooltipNode.style.right = window.innerWidth - rect.left + "px";
                tooltipNode.style.left = "";
            }
        } else {
            tooltipNode.style.left = (rect.right + 1) + "px";
            tooltipNode.style.right = "";
        }
    }

    hideDocTooltip() {
        this.tooltipTimer.cancel();
        if (!this.tooltipNode) return;
        var el = this.tooltipNode;
        if (!this.editor.isFocused() && document.activeElement == el)
            this.editor.focus();
        this.tooltipNode = null;
        if (el.parentNode)
            el.parentNode.removeChild(el);
    }
    
    onTooltipClick(e) {
        var a = e.target;
        while (a && a != this.tooltipNode) {
            if (a.nodeName == "A" && a.href) {
                a.rel = "noreferrer";
                a.target = "_blank";
                break;
            }
            a = a.parentNode;
        }
    }

    destroy() {
        this.detach();
        if (this.popup) {
            this.popup.destroy();
            var el = this.popup.container;
            if (el && el.parentNode)
                el.parentNode.removeChild(el);
        }
        if (this.editor && this.editor.completer == this) {
            this.editor.off("destroy", destroyCompleter);
            this.editor.completer = null;
        }
        this.inlineRenderer = this.popup = this.editor = null;
    }

}

Autocomplete.prototype.commands = {
    "Up": function(editor) { editor.completer.goTo("up"); },
    "Down": function(editor) { editor.completer.goTo("down"); },
    "Ctrl-Up|Ctrl-Home": function(editor) { editor.completer.goTo("start"); },
    "Ctrl-Down|Ctrl-End": function(editor) { editor.completer.goTo("end"); },

    "Esc": function(editor) { editor.completer.detach(); },
    "Return": function(editor) { return editor.completer.insertMatch(); },
    "Shift-Return": function(editor) { editor.completer.insertMatch(null, {deleteSuffix: true}); },
    "Tab": function(editor) {
        var result = editor.completer.insertMatch();
        if (!result && !editor.tabstopManager)
            editor.completer.goTo("down");
        else
            return result;
    },
    "Backspace": function(editor) {
        editor.execCommand("backspace");
        var prefix = util.getCompletionPrefix(editor);
        if (!prefix && editor.completer)
            editor.completer.detach();
    },

    "PageUp": function(editor) { editor.completer.popup.gotoPageUp(); },
    "PageDown": function(editor) { editor.completer.popup.gotoPageDown(); }
};


Autocomplete.for = function(editor) {
    if (editor.completer instanceof Autocomplete) {
        return editor.completer;
    }
    if (editor.completer) {
        editor.completer.destroy();
        editor.completer = null;
    }
    if (config.get("sharedPopups")) {
        if (!Autocomplete["$sharedInstance"])
            Autocomplete["$sharedInstance"] = new Autocomplete();
        editor.completer = Autocomplete["$sharedInstance"];
    } else {
        editor.completer = new Autocomplete();
        editor.once("destroy", destroyCompleter);
    }
    return editor.completer;
};

Autocomplete.startCommand = {
    name: "startAutocomplete",
    exec: function(editor, options) {
        var completer = Autocomplete.for(editor);
        completer.autoInsert = false;
        completer.autoSelect = true;
        completer.autoShown = false;
        completer.showPopup(editor, options);
        // prevent ctrl-space opening context menu on firefox on mac
        completer.cancelContextMenu();
    },
    bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
};

/**
 * This class is responsible for providing completions and inserting them to the editor
 */
class CompletionProvider {
    

    /**
     * @param {{pos: import("../ace-internal").Ace.Position, prefix: string}} initialPosition
     */
    constructor(initialPosition) {
        this.initialPosition = initialPosition;
        this.active = true;
    }

    /**
     * @param {Editor} editor
     * @param {number} index
     * @param {CompletionProviderOptions} [options]
     * @returns {boolean}
     */
    insertByIndex(editor, index, options) {
        if (!this.completions || !this.completions.filtered) {
            return false;
        }
        return this.insertMatch(editor, this.completions.filtered[index], options);
    }

    /**
     * @param {Editor} editor
     * @param {Completion} data
     * @param {CompletionProviderOptions} [options]
     * @returns {boolean}
     */
    insertMatch(editor, data, options) {
        if (!data)
            return false;

        editor.startOperation({command: {name: "insertMatch"}});
        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(editor, data);
        } else {
            // TODO add support for options.deleteSuffix
            if (!this.completions)
                return false;
            
            var replaceBefore = this.completions.filterText.length;
            var replaceAfter = 0;
            if (data.range && data.range.start.row === data.range.end.row) {
                replaceBefore -= this.initialPosition.prefix.length;
                replaceBefore += this.initialPosition.pos.column - data.range.start.column;
                replaceAfter += data.range.end.column - this.initialPosition.pos.column;
            }

            if (replaceBefore || replaceAfter) {
                var ranges;
                if (editor.selection.getAllRanges) {
                    ranges = editor.selection.getAllRanges();
                }
                else {
                    ranges = [editor.getSelectionRange()];
                }
                for (var i = 0, range; range = ranges[i]; i++) {
                    range.start.column -= replaceBefore;
                    range.end.column += replaceAfter;
                    editor.session.remove(range);
                }
            }
          
            if (data.snippet) {
                snippetManager.insertSnippet(editor, data.snippet);
            }
            else {
                this.$insertString(editor, data);
            }
            if (data.completer && data.completer.onInsert && typeof data.completer.onInsert == "function") {
                data.completer.onInsert(editor, data);
            }
            
            if (data.command && data.command === "startAutocomplete") {
                editor.execCommand(data.command);
            }
        }
        editor.endOperation();
        return true;
    }

    /**
     * @param {Editor} editor
     * @param {Completion} data
     */
    $insertString(editor, data) {
        var text = data.value || data;
        editor.execCommand("insertstring", text);
    }

    /**
     * @param {Editor} editor
     * @param {import("../ace-internal").Ace.CompletionCallbackFunction} callback
     */
    gatherCompletions(editor, callback) {
        var session = editor.getSession();
        var pos = editor.getCursorPosition();
    
        var prefix = util.getCompletionPrefix(editor);
    
        var matches = [];
        this.completers = editor.completers;
        var total = editor.completers.length;
        editor.completers.forEach(function(completer, i) {
            completer.getCompletions(editor, session, pos, prefix, function(err, results) {
                if (completer.hideInlinePreview)
                    results = results.map((result) =>  {
                        return Object.assign(result, {hideInlinePreview: completer.hideInlinePreview});
                    });

                if (!err && results)
                    matches = matches.concat(results);
                // Fetch prefix again, because they may have changed by now
                callback(null, {
                    prefix: util.getCompletionPrefix(editor),
                    matches: matches,
                    finished: (--total === 0)
                });
            });
        });
        return true;
    }

    /**
     * This is the entry point to the class, it gathers, then provides the completions asynchronously via callback.
     * The callback function may be called multiple times, the last invokation is marked with a `finished` flag
     * @param {Editor} editor
     * @param {CompletionProviderOptions} options
     * @param {(err: Error | undefined, completions: FilteredList | [], finished: boolean) => void} callback
     */
    provideCompletions(editor, options, callback) {
        var processResults = function(results) {
            var prefix = results.prefix;
            var matches = results.matches;

            this.completions = new FilteredList(matches);

            if (options.exactMatch)
                this.completions.exactMatch = true;

            if (options.ignoreCaption)
                this.completions.ignoreCaption = true;

            this.completions.setFilter(prefix);

            if (results.finished || this.completions.filtered.length)
                callback(null, this.completions, results.finished);
        }.bind(this);

        var isImmediate = true;
        var immediateResults = null;
        this.gatherCompletions(editor, function(err, results) {
            if (!this.active) {
                return;
            }
            if (err) {
                callback(err, [], true);
                this.detach();
            }
            var prefix = results.prefix;

            // Wrong prefix or wrong session -> ignore
            if (prefix.indexOf(results.prefix) !== 0)
                return;

            // If multiple completers return their results immediately, we want to process them together
            if (isImmediate) {
                immediateResults = results;
                return;
            }

            processResults(results);
        }.bind(this));
        
        isImmediate = false;
        if (immediateResults) {
            var results = immediateResults;
            immediateResults = null;
            processResults(results);
        }
    }

    detach() {
        this.active = false;
        this.completers && this.completers.forEach(function(completer) {
            if (typeof completer.cancel === "function") {
                completer.cancel();
            }
        });
    }
}

class FilteredList {
    constructor(array, filterText) {
        this.all = array;
        this.filtered = array;
        this.filterText = filterText || "";
        this.exactMatch = false;
        this.ignoreCaption = false;
    }
    
    setFilter(str) {
        if (str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0)
            var matches = this.filtered;
        else
            var matches = this.all;

        this.filterText = str;
        matches = this.filterCompletions(matches, this.filterText);
        matches = matches.sort(function(a, b) {
            return b.exactMatch - a.exactMatch || b.$score - a.$score 
                || (a.caption || a.value).localeCompare(b.caption || b.value);
        });

        // make unique
        var prev = null;
        matches = matches.filter(function(item){
            var caption = item.snippet || item.caption || item.value;
            if (caption === prev) return false;
            prev = caption;
            return true;
        });

        this.filtered = matches;
    }
    
    filterCompletions(items, needle) {
        var results = [];
        var upper = needle.toUpperCase();
        var lower = needle.toLowerCase();
        loop: for (var i = 0, item; item = items[i]; i++) {
            var caption = (!this.ignoreCaption && item.caption) || item.value || item.snippet;
            if (!caption) continue;
            var lastIndex = -1;
            var matchMask = 0;
            var penalty = 0;
            var index, distance;

            if (this.exactMatch) {
                if (needle !== caption.substr(0, needle.length))
                    continue loop;
            } else {
                /**
                 * It is for situation then, for example, we find some like 'tab' in item.value="Check the table"
                 * and want to see "Check the TABle" but see "Check The tABle".
                 */
                var fullMatchIndex = caption.toLowerCase().indexOf(lower);
                if (fullMatchIndex > -1) {
                    penalty = fullMatchIndex;
                } else {
                    // caption char iteration is faster in Chrome but slower in Firefox, so lets use indexOf
                    for (var j = 0; j < needle.length; j++) {
                        // TODO add penalty on case mismatch
                        var i1 = caption.indexOf(lower[j], lastIndex + 1);
                        var i2 = caption.indexOf(upper[j], lastIndex + 1);
                        index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                        if (index < 0)
                            continue loop;
                        distance = index - lastIndex - 1;
                        if (distance > 0) {
                            // first char mismatch should be more sensitive
                            if (lastIndex === -1)
                                penalty += 10;
                            penalty += distance;
                            matchMask = matchMask | (1 << j);
                        }
                        lastIndex = index;
                    }
                }
            }
            item.matchMask = matchMask;
            item.exactMatch = penalty ? 0 : 1;
            item.$score = (item.score || 0) - penalty;
            results.push(item);
        }
        return results;
    }
}

exports.Autocomplete = Autocomplete;
exports.CompletionProvider = CompletionProvider;
exports.FilteredList = FilteredList;
