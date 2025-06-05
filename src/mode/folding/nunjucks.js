"use strict";

var oop = require("../../lib/oop");
const {FoldMode: MixedFoldMode} = require("./mixed");
var HtmlFoldMode = require("./html").FoldMode;
var Range = require("../../range").Range;
var TokenIterator = require("../../token_iterator").TokenIterator;


var FoldMode = exports.FoldMode = function (voidElements, optionalTags) {
    HtmlFoldMode.call(this, voidElements, optionalTags);
};

oop.inherits(FoldMode, HtmlFoldMode);

(function () {//TODO: set|endset
    this.getFoldWidgetRangeBase = this.getFoldWidgetRange;
    this.getFoldWidgetBase = this.getFoldWidget;

    this.indentKeywords = {
        "block": 1,
        "if": 1,
        "for": 1,
        "asyncEach": 1,
        "asyncAll": 1,
        "macro": 1,
        "filter": 1,
        "call": 1,
        "else": 0,
        "elif": 0,
        "set": 1,
        "endblock": -1,
        "endif": -1,
        "endfor": -1,
        "endeach": -1,
        "endall": -1,
        "endmacro": -1,
        "endfilter": -1,
        "endcall": -1,
        "endset": -1
    };

    this.foldingStartMarkerNunjucks = /(?:\{%-?\s*)(?:(block|if|else|elif|for|asyncEach|asyncAll|macro|filter|call)\b.*)|(?:\bset(?:[^=]*))(?=%})/i;
    this.foldingStopMarkerNunjucks = /(?:\{%-?\s*)(endblock|endif|endfor|endeach|endall|endmacro|endfilter|endcall|endset)\b.*(?=%})/i;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.doc.getLine(row);
        let offset = calculateOffset(this.foldingStartMarkerNunjucks, line);
        if (offset) {
            return this.nunjucksBlock(session, row, offset);
        }

        offset = calculateOffset(this.foldingStopMarkerNunjucks, line);
        if (offset) {
            return this.nunjucksBlock(session, row, offset);
        }
        return this.getFoldWidgetRangeBase(session, foldStyle, row);
    };

    /**
     *
     * @param {RegExp} regExp
     * @param line
     * @return {*}
     */
    function calculateOffset(regExp, line) {
        var match = regExp.exec(line);
        if (match) {
            var keyword = match[0].includes("set") ? "set" : match[1].toLowerCase();
            if (keyword) {
                var offsetInMatch = match[0].toLowerCase().indexOf(keyword);
                return match.index + offsetInMatch + 1;
            }
        }
    }

    // must return "" if there's no fold, to enable caching
    this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarkerNunjucks.test(line);
        var isEnd = this.foldingStopMarkerNunjucks.test(line);
        if (isStart && !isEnd) {
            var offset = calculateOffset(this.foldingStartMarkerNunjucks, line);
            if (offset) {
                var type = session.getTokenAt(row, offset).type;
                if (type === "keyword.control") {
                    return "start";
                }
            }
        }
        if (isEnd && !isStart && foldStyle === "markbeginend") {
            var offset = calculateOffset(this.foldingStopMarkerNunjucks, line);
            if (offset) {
                var type = session.getTokenAt(row, offset).type;
                if (type === "keyword.control") {
                    return "end";
                }
            }
        }
        return this.getFoldWidgetBase(session, foldStyle, row);
    };

    /**
     *
     * @param {TokenIterator} stream
     */
    function getTokenPosition(stream, findStart) {
        let token;
        const currentIndex = stream.$tokenIndex;
        const type = findStart ? "punctuation.begin" : "punctuation.end";
        stream.step = findStart ? stream.stepBackward : stream.stepForward;
        while (token = stream.step()) {
            if (token.type !== type) continue;
            break;
        }
        if (!token) return;
        let pos = stream.getCurrentTokenPosition();
        if (!findStart) {
            pos.column = pos.column + token.value.length;
        }
        stream.$tokenIndex = currentIndex;
        return pos;
    }

    this.nunjucksBlock = function (session, row, column) {
        var stream = new TokenIterator(session, row, column);

        var token = stream.getCurrentToken();
        if (!token || token.type != "keyword.control") return;

        var val = token.value;
        var stack = [val];
        var dir = this.indentKeywords[val];

        if (val === "else" || val === "elif") {
            dir = 1;
        }

        if (!dir) return;

        var start = getTokenPosition(stream, dir === -1);

        if (!token) return;

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        while (token = stream.step()) {
            if (token.type !== "keyword.control") continue;
            var level = dir * this.indentKeywords[token.value];

            if (token.value === "set") {
                var tokenPos = stream.getCurrentTokenPosition();
                var line = session.getLine(tokenPos.row).substring(tokenPos.column);
                if (!/^[^=]*%}/.test(line)) {
                    continue;
                }
            }
            if (level > 0) {
                stack.unshift(token.value);
            }
            else if (level <= 0) {
                stack.shift();
                if (!stack.length) break;
                if (level === 0) stack.unshift(token.value);
            }
        }

        if (!token) return null;

        var end = getTokenPosition(stream, dir === 1);
        return dir === 1 ? Range.fromPoints(start, end) : Range.fromPoints(end, start);
    };

}).call(FoldMode.prototype);
