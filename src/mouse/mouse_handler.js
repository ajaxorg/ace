"use strict";
/**
 * @typedef {import("../editor").Editor} Editor
 */
var event = require("../lib/event");
var useragent = require("../lib/useragent");
var DefaultHandlers = require("./default_handlers").DefaultHandlers;
var DefaultGutterHandler = require("./default_gutter_handler").GutterHandler;
var MouseEvent = require("./mouse_event").MouseEvent;
var DragdropHandler = require("./dragdrop_handler").DragdropHandler;
var addTouchListeners = require("./touch_handler").addTouchListeners;
var config = require("../config");

class MouseHandler {
    /**
     * @param {Editor} editor
     */
    constructor(editor) {
        /** @type {boolean} */this.$dragDelay;
        /** @type {boolean} */this.$dragEnabled;
        /** @type {boolean} */this.$mouseMoved;
        /** @type {MouseEvent} */this.mouseEvent;
        /** @type {number} */this.$focusTimeout;
        var _self = this;
        this.editor = editor;

        new DefaultHandlers(this);
        new DefaultGutterHandler(this);
        new DragdropHandler(this);

        var focusEditor = function(e) {
            // because we have to call event.preventDefault() any window on ie and iframes
            // on other browsers do not get focus, so we have to call window.focus() here
            var windowBlurred = !document.hasFocus || !document.hasFocus()
                || !editor.isFocused() && document.activeElement == (editor.textInput && editor.textInput.getElement());
            if (windowBlurred)
                window.focus();
            editor.focus();
            // Without this editor is blurred after double click
            setTimeout(function () {
                if (!editor.isFocused()) editor.focus();
            });
        };

        var mouseTarget = editor.renderer.getMouseEventTarget();
        event.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"), editor);
        event.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"), editor);
        event.addMultiMouseDownListener([
            mouseTarget,
            editor.renderer.scrollBarV && editor.renderer.scrollBarV.inner,
            editor.renderer.scrollBarH && editor.renderer.scrollBarH.inner,
            editor.textInput && editor.textInput.getElement()
        ].filter(Boolean), [400, 300, 250], this, "onMouseEvent", editor);
        event.addMouseWheelListener(editor.container, this.onMouseWheel.bind(this, "mousewheel"), editor);
        addTouchListeners(editor.container, editor);

        var gutterEl = editor.renderer.$gutter;
        event.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"), editor);
        event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"), editor);
        event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"), editor);
        event.addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"), editor);

        event.addListener(mouseTarget, "mousedown", focusEditor, editor);
        event.addListener(gutterEl, "mousedown", focusEditor, editor);
        if (useragent.isIE && editor.renderer.scrollBarV) {
            event.addListener(editor.renderer.scrollBarV.element, "mousedown", focusEditor, editor);
            event.addListener(editor.renderer.scrollBarH.element, "mousedown", focusEditor, editor);
        }

        editor.on("mousemove", function(e){
            if (_self.state || _self.$dragDelay || !_self.$dragEnabled)
                return;

            var character = editor.renderer.screenToTextCoordinates(e.x, e.y);
            var range = editor.session.selection.getRange();
            var renderer = editor.renderer;

            if (!range.isEmpty() && range.insideStart(character.row, character.column)) {
                renderer.setCursorStyle("default");
            } else {
                renderer.setCursorStyle("");
            }
            
        }, //@ts-expect-error TODO: seems mistyping - should be boolean
            editor);
    }

    onMouseEvent(name, e) {
        if (!this.editor.session) return;
        this.editor._emit(name, new MouseEvent(e, this.editor));
    }

    onMouseMove(name, e) {
        // optimization, because mousemove doesn't have a default handler.
        var listeners = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
        if (!listeners || !listeners.length)
            return;

        this.editor._emit(name, new MouseEvent(e, this.editor));
    }

    /**
     * @param {string} name
     * @param {{ wheelX: number; wheelY: number; }} e
     */
    onMouseWheel(name, e) {
        var mouseEvent = new MouseEvent(e, this.editor);
        //@ts-expect-error TODO: couldn't find this property init in the ace codebase
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e.wheelX;
        mouseEvent.wheelY = e.wheelY;

        this.editor._emit(name, mouseEvent);
    }
    
    setState(state) {
        this.state = state;
    }

    captureMouse(ev, mouseMoveHandler) {
        this.x = ev.x;
        this.y = ev.y;

        this.isMousePressed = true;

        // do not move textarea during selection
        var editor = this.editor;
        var renderer = this.editor.renderer;
        renderer.$isMousePressed = true;

        var self = this;
        var onMouseMove = function(e) {
            if (!e) return;
            // if editor is loaded inside iframe, and mouseup event is outside
            // we won't recieve it, so we cancel on first mousemove without button
            if (useragent.isWebKit && !e.which && self.releaseMouse)
                return self.releaseMouse();

            self.x = e.clientX;
            self.y = e.clientY;
            mouseMoveHandler && mouseMoveHandler(e);
            self.mouseEvent = new MouseEvent(e, self.editor);
            self.$mouseMoved = true;
        };

        var onCaptureEnd = function(e) {
            editor.off("beforeEndOperation", onOperationEnd);
            clearInterval(timerId);
            if (editor.session) onCaptureInterval();
            self[self.state + "End"] && self[self.state + "End"](e);
            self.state = "";
            self.isMousePressed = renderer.$isMousePressed = false;
            if (renderer.$keepTextAreaAtCursor)
                renderer.$moveTextAreaToCursor();
            self.$onCaptureMouseMove = self.releaseMouse = null;
            e && self.onMouseEvent("mouseup", e);
            editor.endOperation();
        };

        var onCaptureInterval = function() {
            self[self.state] && self[self.state]();
            self.$mouseMoved = false;
        };

        if (useragent.isOldIE && ev.domEvent.type == "dblclick") {
            return setTimeout(function() {onCaptureEnd(ev);});
        }

        var onOperationEnd = function(e) {
            if (!self.releaseMouse) return;
            // some touchpads fire mouseup event after a slight delay, 
            // which can cause problems if user presses a keyboard shortcut quickly
            if (editor.curOp.command.name && editor.curOp.selectionChanged) {
                self[self.state + "End"] && self[self.state + "End"]();
                self.state = "";
                self.releaseMouse();
            }
        };

        editor.on("beforeEndOperation", onOperationEnd);
        editor.startOperation({command: {name: "mouse"}});

        self.$onCaptureMouseMove = onMouseMove;
        self.releaseMouse = event.capture(this.editor.container, onMouseMove, onCaptureEnd);
        var timerId = setInterval(onCaptureInterval, 20);
    }
    cancelContextMenu() {
        var stop = function(e) {
            if (e && e.domEvent && e.domEvent.type != "contextmenu")
                return;
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent)
                event.stopEvent(e.domEvent);
        }.bind(this);
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    }
    destroy() {
        if (this.releaseMouse) this.releaseMouse();
    }
}

MouseHandler.prototype.releaseMouse = null;

config.defineOptions(MouseHandler.prototype, "mouseHandler", {
    scrollSpeed: {initialValue: 2},
    dragDelay: {initialValue: (useragent.isMac ? 150 : 0)},
    dragEnabled: {initialValue: true},
    focusTimeout: {initialValue: 0},
    tooltipFollowsMouse: {initialValue: true}
});


exports.MouseHandler = MouseHandler;
