"use strict";
/**
 * @typedef {import("../editor").Editor} Editor
 */

require("./menu_tools/overlay_page");

var dom = require("../lib/dom");
var oop = require("../lib/oop");
var config = require("../config");
var nls = config.nls;
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var buildDom = dom.buildDom;

var modelist = require("./modelist");
var themelist = require("./themelist");

var themes = { bright: [], dark: [] };
themelist.themes.forEach(function(x) {
    themes[x.isDark ? "dark" : "bright"].push({ caption: x.caption, value: x.theme });
});

var modes = modelist.modes.map(function(x){ 
    return { caption: x.caption, value: x.mode }; 
});


var optionGroups = {
    main: [
        {
            path: "mode",
            label: nls("options.mode", "Mode"),
            type: "select",
            items: modes
        },
        {
            path: "theme",
            label: nls("options.theme", "Theme"),
            type: "select",
            items: [
                {
                    label: nls("options.theme.bright", "Bright"),
                    items: themes.bright
                },
                {
                    label: nls("options.theme.dark", "Dark"),
                    items: themes.dark
                }
            ]
        },
        {
            path: "keyboardHandler",
            label: nls("options.keyboard-handler", "Keybinding"),
            type: "buttonBar",
            items: [
                {
                    caption: "Ace",
                    value: null
                },
                {
                    caption: "Vim",
                    value: "ace/keyboard/vim"
                },
                {
                    caption: "Emacs",
                    value: "ace/keyboard/emacs"
                },
                {
                    caption: "Sublime",
                    value: "ace/keyboard/sublime"
                },
                {
                    caption: "VSCode",
                    value: "ace/keyboard/vscode"
                }
            ]
        },
        {
            path: "fontSize",
            label: nls("options.font-size", "Font Size"),
            type: "number",
            defaultValue: 12,
            defaults: [
                {
                    caption: nls("options.font-size.px", "$0px", ["12"]),
                    value: 12
                },
                {
                    caption: nls("options.font-size.px", "$0px", ["24"]),
                    value: 24
                }
            ]
        },
        {
            path: "wrap",
            label: nls("options.wrap", "Soft Wrap"),
            type: "buttonBar",
            items: [
                {
                    caption: nls("options.wrap.off", "Off"),
                    value: "off"
                },
                {
                    caption: nls("options.wrap.view", "View"),
                    value: "free"
                },
                {
                    caption: nls("options.wrap.margin", "margin"),
                    value: "printMargin" },
                {
                    caption: "40",
                    value: "40"
                }
            ]
        },
        {
            path: "cursorStyle",
            label: nls("options.cursor-style", "Cursor Style"),
            items: [
                {
                    caption: "Ace",
                    value: "ace"
                },
                {
                    caption: nls("options.cursor-style.slim", "Slim"),
                    value: "slim"
                },
                {
                    caption: nls("options.cursor-style.smooth", "Smooth"),
                    value: "smooth"
                },
                {
                    caption: nls("options.cursor-style.smooth-slim", "Smooth And Slim"),
                    value: "smooth slim"
                },
                {
                    caption: nls("options.cursor-style.wide", "Wide"),
                    value: "wide"
                }
            ]
        },
        {
            path: "foldStyle",
            label: nls("options.fold-style", "Folding"),
            items: [
                {
                    caption: nls("options.fold-style.manual", "Manual"),
                    value: "manual"
                },
                {
                    caption: nls("options.fold-style.mark-begin", "Mark begin"),
                    value: "markbegin"
                },
                {
                    caption: nls("options.fold-style.mark-begin-end", "Mark begin and end"),
                    value: "markbeginend"
                }
            ]
        },
        [
            {
                path: "useSoftTabs",
                label: nls("options.use-soft-tabs", "Soft Tabs")
            },
            {
                ariaLabel: nls("options.tab-size", "Tab Size"),
                path: "tabSize",
                type: "number",
                values: [2, 3, 4, 8, 16]
            }
        ],
        {
            path: "scrollPastEnd",
            label: nls("options.scroll-past-end", "Overscroll"),
            type: "buttonBar",
            items: [
                {
                    caption: nls("options.fold-style.scroll-past-end.none", "None"),
                    value: 0
                },
                {
                    caption: nls("options.fold-style.scroll-past-end.half", "Half"),
                    value: 0.5
                },
                {
                    caption: nls("options.fold-style.scroll-past-end.full", "Full"),
                    value: 1
                }
            ]
        }
    ],
    more: [
        {
            path: "navigateWithinSoftTabs",
            label: nls("options.navigate-within-soft-tabs", "Atomic soft tabs")
        },
        {
            path: "behavioursEnabled",
            label: nls("options.behaviours-enabled", "Enable Behaviours")
        },
        {
            path: "wrapBehavioursEnabled",
            label: nls("options.wrap-behaviours-enabled", "Wrap with quotes")
        },
        {
            path: "enableAutoIndent",
            label: nls("options.enable-auto-indent", "Enable Auto Indent")
        },
        {
            path: "selectionStyle",
            label: nls("options.selection-style", "Full Line Selection"),
            type: "checkbox",
            values: "text|line"
        },
        {
            path: "highlightActiveLine",
            label: nls("options.highlight-active-line", "Highlight Active Line")
        },
        {
            path: "showInvisibles",
            label: nls("options.show-invisibles", "Show Invisibles")
        },
        {
            path: "displayIndentGuides",
            label: nls("options.display-indent-guides", "Show Indent Guides")
        },
        {
            path: "highlightIndentGuides",
            label: nls("options.highlight-indent-guides", "Highlight Indent Guides")
        },
        {
            path: "hScrollBarAlwaysVisible",
            label: nls("options.h-scroll-bar-always-visible", "Persistent HScrollbar")
        },
        {
            path: "vScrollBarAlwaysVisible",
            label: nls("options.v-scroll-bar-always-visible", "Persistent VScrollbar")
        },
        {
            path: "animatedScroll",
            label: nls("options.animated-scroll", "Animate scrolling")
        },
        {
            path: "showGutter",
            label: nls("options.show-gutter", "Show Gutter")
        },
        {
            path: "showLineNumbers",
            label: nls("options.show-line-numbers", "Show Line Numbers")
        },
        {
            path: "relativeLineNumbers",
            label: nls("options.relative-line-numbers", "Relative Line Numbers")
        },
        {
            path: "fixedWidthGutter",
            label: nls("options.fixed-width-gutter", "Fixed Gutter Width")
        },
        [
            {
                path: "showPrintMargin",
                label: nls("options.show-print-margin", "Show Print Margin")
            },
            {
                ariaLabel: nls("options.show-print-margin.print-margin-column", "Print Margin"),
                type: "number",
                path: "printMarginColumn"
            }
        ],
        {
            path: "indentedSoftWrap",
            label: nls("options.indented-soft-wrap", "Indented Soft Wrap")
        },
        {
            path: "highlightSelectedWord",
            label: nls("options.highlight-selected-word", "Highlight selected word")
        },
        {
            path: "fadeFoldWidgets",
            label: nls("options.fade-fold-widgets", "Fade Fold Widgets")
        },
        {
            path: "useTextareaForIME",
            label: nls("options.use-textarea-for-ime", "Use textarea for IME")
        },
        {
            path: "mergeUndoDeltas",
            label: nls("options.merge-undo-deltas", "Merge Undo Deltas"),
            items: [
                {
                    caption: nls("options.fold-style.merge-undo-deltas.always", "Always"),
                    value: "always"
                },
                {
                    caption: nls("options.fold-style.merge-undo-deltas.never", "Never"),
                    value: "false"
                },
                {
                    caption: nls("options.fold-style.merge-undo-deltas.timed", "Timed"),
                    value: "true"
                }
            ]
        },
        {
            path: "useElasticTabstops",
            label: nls("options.use-elastic-tabstops", "Elastic Tabstops")
        },
        {
            path: "useIncrementalSearch",
            label: nls("options.use-incremental-search", "Incremental Search")
        },
        {
            path: "readOnly",
            label: nls("options.read-only", "Read-only")
        },
        {
            path: "copyWithEmptySelection",
            label: nls("options.copy-with-empty-selection", "Copy without selection")
        },
        {
            path: "enableLiveAutocompletion",
            label: nls("options.enable-live-autocompletion", "Live Autocompletion")
        },
        {
            path: "customScrollbar",
            label: nls("options.custom-scrollbar", "Custom scrollbar")
        },
        {
            path: "useSvgGutterIcons",
            label: nls("options.use-svg-gutter-icons", "Use SVG gutter icons")
        },
        {
            path: "showFoldedAnnotations",
            label: nls("options.show-folded-annotations", "Annotations for folded lines")
        },
        {
            path: "enableKeyboardAccessibility",
            label: nls("options.enable-keyboard-accessibility", "Keyboard Accessibility Mode")
        },
        {
            path: "tooltipFollowsMouse",
            label: nls("options.tooltip-follows-mouse", "Gutter tooltip follows mouse"),
            defaultValue: true
        }
    ]
};

class OptionPanel {
    /**
     * 
     * @param {Editor} editor
     * @param {HTMLElement} [element]
     */
    constructor(editor, element) {
        this.editor = editor;
        this.container = element || document.createElement("div");
        this.groups = [];
        this.options = {};
    }
    
    add(config) {
        if (config.main)
            oop.mixin(optionGroups.main, config.main);
        if (config.more)
            oop.mixin(optionGroups.more, config.more);
    }

  
    render() {
        this.container.innerHTML = "";
        buildDom(["table", {role: "presentation", id: "controls"}, 
            this.renderOptionGroup(optionGroups.main),
            ["tr", null, ["td", {colspan: 2},
                ["table", {role: "presentation", id: "more-controls"}, 
                    this.renderOptionGroup(optionGroups.more)
                ]
            ]],
            ["tr", null, ["td", {colspan: 2}, "version " + config.version]]
        ], this.container);
    }
    
    renderOptionGroup(group) {
        return group.map(function(item) {
            return this.renderOption(item);
        }, this);
    }

    /**
     * @param {string} key
     * @param {Object} option
     */
    renderOptionControl(key, option) {
        var self = this;
        if (Array.isArray(option)) {
            return option.map(function(x) {
                return self.renderOptionControl(key, x);
            });
        }
        /**@type {any}*/
        var control;
        
        var value = self.getOption(option);
        
        if (option.values && option.type != "checkbox") {
            if (typeof option.values == "string")
                option.values = option.values.split("|");
            option.items = option.values.map(function(v) {
                return { value: v, name: v };
            });
        }
        
        if (option.type == "buttonBar") {
            control = ["div", {role: "group", "aria-labelledby": option.path + "-label"}, option.items.map(function(item) {
                return ["button", { 
                    value: item.value, 
                    ace_selected_button: value == item.value, 
                    'aria-pressed': value == item.value, 
                    onclick: function() {
                        self.setOption(option, item.value);
                        var nodes = this.parentNode.querySelectorAll("[ace_selected_button]");
                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].removeAttribute("ace_selected_button");
                            nodes[i].setAttribute("aria-pressed", false);
                        }
                        this.setAttribute("ace_selected_button", true);
                        this.setAttribute("aria-pressed", true);
                    } 
                }, item.desc || item.caption || item.name];
            })];
        } else if (option.type == "number") {
            control = ["input", {type: "number", value: value || option.defaultValue, style:"width:3em", oninput: function() {
                self.setOption(option, parseInt(this.value));
            }}];
            if (option.ariaLabel) {
                control[1]["aria-label"] = option.ariaLabel;
            } else {
                control[1].id = key;
            }
            if (option.defaults) {
                control = [control, option.defaults.map(function(item) {
                    return ["button", {onclick: function() {
                        var input = this.parentNode.firstChild;
                        input.value = item.value;
                        input.oninput();
                    }}, item.caption];
                })];
            }
        } else if (option.items) {
            var buildItems = function(items) {
                return items.map(function(item) {
                    return ["option", { value: item.value || item.name }, item.desc || item.caption || item.name];
                });
            };
            
            var items = option.items[0].label
                ? option.items.map(function(group) {
                    return ["optgroup", {label: group.label}, buildItems(group.items)];
                })
                : buildItems(option.items);
            control = ["select", { id: key, value: value, onchange: function() {
                self.setOption(option, this.value);
            } }, items];
        } else {
            if (typeof option.values == "string")
                option.values = option.values.split("|");
            if (option.values) value = value == option.values[1];
            control = ["input", { type: "checkbox", id: key, checked: value || null, onchange: function() {
                var value = this.checked;
                if (option.values) value = option.values[value ? 1 : 0];
                self.setOption(option, value);
            }}];
            if (option.type == "checkedNumber") {
                control = [control, []];
            }
        }
        return control;
    }

    /**
     * 
     * @param key
     * @param option
     */
    renderOption(option) {
        if (option.path && !option.onchange && !this.editor.$options[option.path])
            return;
        var path = Array.isArray(option) ? option[0].path : option.path;
        var label = Array.isArray(option) ? option[0].label : option.label;
        this.options[path] = option;
        var safeKey = "-" + path;
        var safeId = path + "-label";
        var control = this.renderOptionControl(safeKey, option);
        return ["tr", {class: "ace_optionsMenuEntry"}, ["td",
            ["label", {for: safeKey, id: safeId}, label]
        ], ["td", control]];
    }

    /**
     * @param {string | number | Object} option
     * @param {string | number | boolean} value
     */
    setOption(option, value) {
        if (typeof option == "string")
            option = this.options[option];
        if (value == "false") value = false;
        if (value == "true") value = true;
        if (value == "null") value = null;
        if (value == "undefined") value = undefined;
        if (typeof value == "string" && parseFloat(value).toString() == value)
            value = parseFloat(value);
        if (option.onchange)
            option.onchange(value);
        else if (option.path)
            this.editor.setOption(option.path, value);
        this._signal("setOption", {name: option.path, value: value});
    }
    
    getOption(option) {
        if (option.getValue)
            return option.getValue();
        return this.editor.getOption(option.path);
    }
}
oop.implement(OptionPanel.prototype, EventEmitter);

exports.OptionPanel = OptionPanel;
