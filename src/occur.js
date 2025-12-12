"use strict";
/**
 * @typedef {import("./editor").Editor} Editor
 * @typedef {import("../ace-internal").Ace.Point} Point
 * @typedef {import("../ace-internal").Ace.SearchOptions} SearchOptions
 */

var oop = require("./lib/oop");
var Search = require("./search").Search;
var EditSession = require("./edit_session").EditSession;
var SearchHighlight = require("./search_highlight").SearchHighlight;

/**
 * Finds all lines matching a search term in the current [[Document
 * `Document`]] and displays them instead of the original `Document`. Keeps
 * track of the mapping between the occur doc and the original doc.
 **/
class Occur extends Search {

    /**
     * Enables occur mode. expects that `options.needle` is a search term.
     * This search term is used to filter out all the lines that include it
     * and these are then used as the content of a new [[Document
     * `Document`]]. The current cursor position of editor will be translated
     * so that the cursor is on the matching row/column as it was before.
     * @param {Editor} editor
     * @param {Object} options options.needle should be a String
     * @return {Boolean} Whether occur activation was successful
     *
     **/
    enter(editor, options) {
        if (!options.needle) return false;
        var pos = editor.getCursorPosition();
        this.displayOccurContent(editor, options);
        var translatedPos = this.originalToOccurPosition(editor.session, pos);
        editor.moveCursorToPosition(translatedPos);
        return true;
    }

    /**
     * Disables occur mode. Resets the [[Sessions `EditSession`]] [[Document
     * `Document`]] back to the original doc. If options.translatePosition is
     * truthy also maps the [[Editors `Editor`]] cursor position accordingly.
     * @param {Editor} editor
     * @param {Object} options options.translatePosition
     * @return {Boolean} Whether occur deactivation was successful
     *
     **/
    exit(editor, options) {
        var pos = options.translatePosition && editor.getCursorPosition();
        var translatedPos = pos && this.occurToOriginalPosition(editor.session, pos);
        this.displayOriginalContent(editor);
        if (translatedPos)
            editor.moveCursorToPosition(translatedPos);
        return true;
    }

    /**
     * @param {EditSession} sess
     * @param {RegExp} regexp
     */
    highlight(sess, regexp) {
        var hl = sess.$occurHighlight = sess.$occurHighlight || sess.addDynamicMarker(
                new SearchHighlight(null, "ace_occur-highlight", "text"));
        hl.setRegexp(regexp);
        sess._emit("changeBackMarker"); // force highlight layer redraw
    }

    /**
     * @param {Editor} editor
     * @param {Partial<SearchOptions>} options
     */
    displayOccurContent(editor, options) {
        // this.setSession(session || new EditSession(""))
        this.$originalSession = editor.session;
        var found = this.matchingLines(editor.session, options);
        var lines = found.map(function(foundLine) { return foundLine.content; });
        /**@type {EditSession}*/
        var occurSession = new EditSession(lines.join('\n'));
        occurSession.$occur = this;
        occurSession.$occurMatchingLines = found;
        editor.setSession(occurSession);
        this.$useEmacsStyleLineStart = this.$originalSession.$useEmacsStyleLineStart;
        occurSession.$useEmacsStyleLineStart = this.$useEmacsStyleLineStart;
        this.highlight(occurSession, options.re);
        occurSession._emit('changeBackMarker');
    }

    /**
     * @param {Editor} editor
     */
    displayOriginalContent(editor) {
        editor.setSession(this.$originalSession);
        this.$originalSession.$useEmacsStyleLineStart = this.$useEmacsStyleLineStart;
    }

    /**
    * Translates the position from the original document to the occur lines in
    * the document or the beginning if the doc {row: 0, column: 0} if not
    * found.
    * @param {EditSession} session The occur session
    * @param {Point} pos The position in the original document
    * @return {Point} position in occur doc
    **/
    originalToOccurPosition(session, pos) {
        var lines = session.$occurMatchingLines;
        var nullPos = {row: 0, column: 0};
        if (!lines) return nullPos;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].row === pos.row)
                return {row: i, column: pos.column};
        }
        return nullPos;
    }

    /**
    * Translates the position from the occur document to the original document
    * or `pos` if not found.
    * @param {EditSession} session The occur session
    * @param {Point} pos The position in the occur session document
    * @return {Point} position
    **/
    occurToOriginalPosition(session, pos) {
        var lines = session.$occurMatchingLines;
        if (!lines || !lines[pos.row])
            return pos;
        return {row: lines[pos.row].row, column: pos.column};
    }

    /**
     * @param {EditSession} session
     * @param {Partial<SearchOptions>} options
     */
    matchingLines(session, options) {
        options = oop.mixin({}, options);
        if (!session || !options.needle) return [];
        var search = new Search();
        search.set(options);
        return search.findAll(session).reduce(function(lines, range) {
            var row = range.start.row;
            var last = lines[lines.length-1];
            return last && last.row === row ?
                lines :
                lines.concat({row: row, content: session.getLine(row)});
        }, []);
    }

}

var dom = require('./lib/dom');
dom.importCssString(".ace_occur-highlight {\n\
    border-radius: 4px;\n\
    background-color: rgba(87, 255, 8, 0.25);\n\
    position: absolute;\n\
    z-index: 4;\n\
    box-sizing: border-box;\n\
    box-shadow: 0 0 4px rgb(91, 255, 50);\n\
}\n\
.ace_dark .ace_occur-highlight {\n\
    background-color: rgb(80, 140, 85);\n\
    box-shadow: 0 0 4px rgb(60, 120, 70);\n\
}\n", "incremental-occur-highlighting", false);

exports.Occur = Occur;
