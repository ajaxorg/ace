/**
 * The main class required to set up an Ace instance in the browser.
 *
 * @namespace Ace
 **/
"use strict";
"include loader_build";

var dom = require("./lib/dom");

var Range = require("./range").Range;
var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var UndoManager = require("./undomanager").UndoManager;
var Renderer = require("./virtual_renderer").VirtualRenderer;

// The following require()s are for inclusion in the built ace file
require("./worker/worker_client");
require("./keyboard/hash_handler");
require("./placeholder");
require("./multi_select");
require("./mode/folding/fold_mode");
require("./theme/textmate");
require("./ext/error_marker");

exports.config = require("./config");


/**
 * Embeds the Ace editor into the DOM, at the element provided by `el`.
 * @param {String | HTMLElement & {env?, value?}} el Either the id of an element, or the element itself
 * @param {Object } [options] Options for the editor
 * @returns {Editor}
 **/
exports.edit = function(el, options) {
    if (typeof el == "string") {
        var _id = el;
        el = document.getElementById(_id);
        if (!el)
            throw new Error("ace.edit can't find div #" + _id);
    }

    if (el && el.env && el.env.editor instanceof Editor)
        return el.env.editor;

    var value = "";
    if (el && /input|textarea/i.test(el.tagName)) {
        var oldNode = el;
        value = oldNode.value;
        el = dom.createElement("pre");
        oldNode.parentNode.replaceChild(el, oldNode);
    } else if (el) {
        value = el.textContent;
        el.innerHTML = "";
    }

    var doc = exports.createEditSession(value);
    var editor = new Editor(new Renderer(el), doc, options);

    var env = {
        document: doc,
        editor: editor,
        onResize: editor.resize.bind(editor, null)
    };
    if (oldNode) env.textarea = oldNode;
    editor.on("destroy", function() {
        env.editor.container.env = null; // prevent memory leak on old ie
    });
    editor.container.env = editor.env = env;
    return editor;
};

/**
 * Creates a new [[EditSession]], and returns the associated [[Document]].
 * @param {import('./document').Document | String} text {:textParam}
 * @param {import("../ace-internal").Ace.SyntaxMode} [mode] {:modeParam}
 * @returns {EditSession}
 **/
exports.createEditSession = function(text, mode) {
    var doc = new EditSession(text, mode);
    doc.setUndoManager(new UndoManager());
    return doc;
};
exports.Range = Range;
exports.Editor = Editor;
exports.EditSession = EditSession;
exports.UndoManager = UndoManager;
exports.VirtualRenderer = Renderer;
exports.version = exports.config.version;
