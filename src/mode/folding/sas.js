"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./cstyle").FoldMode;
var Range = require("../../range").Range;
var TokenIterator = require("../../token_iterator").TokenIterator;


var FoldMode = exports.FoldMode = function () { };

oop.inherits(FoldMode, BaseFoldMode);

(function () {
    this.getFoldWidgetRangeBase = this.getFoldWidgetRange;
    this.getFoldWidgetBase = this.getFoldWidget;

    this.indentKeywordsSAS = {
        "proc": 1,
        "data": 1,
        "run": -1,
        "quit": -1,
        "do": 1,
        "select": 1,
        "end": -1,
        // macro blocks
        "%macro": 1,
        "%mend": -1,
        "%do": 1,
        "%end": -1,
    };
    this.tokenTypeSAS = [
        "storage.type.class.sas",
        "keyword.control.conditional.sas",
        "keyword.control.general.sas",
        "support.class.character-class.sas",
    ];

    this.foldingStartMarkerSAS = /(?:\s|^)(proc|data|do|select|%macro|%do)\b/i;
    this.foldingStopMarkerSAS = /(?:\b)(run|quit|end|%mend|%end)\b/i;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarkerSAS.test(line);
        var isEnd = this.foldingStopMarkerSAS.test(line);
        if (isStart || isEnd) {
            var match = (isEnd) ? this.foldingStopMarkerSAS.exec(line) : this.foldingStartMarkerSAS.exec(line);
            var keyword = match && match[1].toLowerCase();
            if (keyword) {
                var type = session.getTokenAt(row, match.index + 2).type;
                if (this.tokenTypeSAS.includes(type))
                    return this.sasBlock(session, row, match.index + 2);
            }
        }
        return this.getFoldWidgetRangeBase(session, foldStyle, row);
    };


    this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarkerSAS.test(line);
        var isEnd = this.foldingStopMarkerSAS.test(line);
        if (isStart && !isEnd) {
            var match = this.foldingStartMarkerSAS.exec(line);
            var keyword = match && match[1].toLowerCase();
            if (keyword) {
                var type = session.getTokenAt(row, match.index + 2).type;
                if (this.tokenTypeSAS.includes(type))
                    return "start";
            }
        }
        if (foldStyle != "markbeginend" || !isEnd || isStart && isEnd)
            return this.getFoldWidgetBase(session, foldStyle, row);

        var match = line.match(this.foldingStopMarkerSAS);
        var keyword = match && match[1].toLowerCase();
        if (this.indentKeywordsSAS[keyword]) {
            if (this.tokenTypeSAS.includes(session.getTokenAt(row, match.index + 2).type))
                return "end";
        }

        return this.getFoldWidgetBase(session, foldStyle, row);
    };

    this.sasBlock = function (session, row, column, tokenRange) {
        var stream = new TokenIterator(session, row, column);

        var token = stream.getCurrentToken();
        if (!token || !this.tokenTypeSAS.includes(token.type))
            return;

        var val = token.value.toLowerCase();
        var stack = [val];
        var dir = this.indentKeywordsSAS[val];

        if (!dir)
            return;

        var startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
        var startRow = row;

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        while (token = stream.step()) {
            val = token.value.toLowerCase();
            if (!this.tokenTypeSAS.includes(token.type) || !this.indentKeywordsSAS[val])
                continue;
            var level = dir * this.indentKeywordsSAS[val];

            if (level > 0) {
                stack.unshift(val);
            } else if (level <= 0) {
                stack.shift();
            }
            if (stack.length === 0) {
                break;
            }
        }

        if (!token)
            return null;

        if (tokenRange)
            return stream.getCurrentTokenRange();

        var row = stream.getCurrentTokenRow();
        if (dir === -1)
            return new Range(row, session.getLine(row).length, startRow, startColumn);
        else
            return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
    };

}).call(FoldMode.prototype);
