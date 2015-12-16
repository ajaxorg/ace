
define(function(require, exports, module) {
"use strict";

var dom = require("ace/lib/dom");
var event = require("ace/lib/event");

var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var Editor = require("ace/editor").Editor;
var MultiSelect = require("ace/multi_select").MultiSelect;

dom.importCssString("\
splitter {\
    border: 1px solid #C6C6D2;\
    width: 0px;\
    cursor: ew-resize;\
    z-index:10}\
splitter:hover {\
    margin-left: -2px;\
    width:3px;\
    border-color: #B5B4E0;\
}\
", "splitEditor");

exports.edit = function(el) {
    if (typeof(el) == "string")
        el = document.getElementById(el);

    var editor = new Editor(new Renderer(el, require("ace/theme/textmate")));

    editor.resize();
    event.addListener(window, "resize", function() {
        editor.resize();
    });
    return editor;
};


var SplitRoot = function(el, theme, position, getSize) {
    el.style.position = position || "relative";
    this.container = el;
    this.getSize = getSize || this.getSize;
    this.resize = this.$resize.bind(this);

    event.addListener(el.ownerDocument.defaultView, "resize", this.resize);
    this.editor = this.createEditor();
};

(function(){
    this.createEditor = function() {
        var el = document.createElement("div");
        el.className = this.$editorCSS;
        el.style.cssText = "position: absolute; top:0px; bottom:0px";
        this.$container.appendChild(el);
        var session = new EditSession("");
        var editor = new Editor(new Renderer(el, this.$theme));

        /*editor.on("focus", function() {
            this._emit("focus", editor);
        }.bind(this));*/

        this.$editors.push(editor);
        editor.setFontSize(this.$fontSize);
        return editor;
    };
    this.$resize = function() {
        var size = this.getSize(this.container);
        this.rect = {
            x: size.left,
            y: size.top,
            w: size.width,
            h: size.height
        };
        this.item.resize(this.rect);
    };
    this.getSize = function(el) {
        return el.getBoundingClientRect();
    };
    this.destroy = function() {
        var win = this.container.ownerDocument.defaultView;
        event.removeListener(win, "resize", this.resize);
    };


}).call(SplitRoot.prototype);



var Split = function(){

};
(function(){
    this.execute = function(options) {
        this.$u.execute(options);
    };

}).call(Split.prototype);



exports.singleLineEditor = function(el) {
    var renderer = new Renderer(el);
    el.style.overflow = "hidden";

    renderer.screenToTextCoordinates = function(x, y) {
        var pos = this.pixelToScreenCoordinates(x, y);
        return this.session.screenToDocumentPosition(
            Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
            Math.max(pos.column, 0)
        );
    };

    renderer.$maxLines = 4;

    renderer.setStyle("ace_one-line");
    var editor = new Editor(renderer);
    editor.session.setUndoManager(new UndoManager());

    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setHighlightGutterLine(false);
    editor.$mouseHandler.$focusWaitTimout = 0;

    return editor;
};



});

