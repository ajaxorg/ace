/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/BackgroundTokenizer", ["ace/lib/oop", "ace/MEventEmitter"], function(oop, MEventEmitter) {

var BackgroundTokenizer = function(tokenizer) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;
    this.$worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var startLine = self.currentLine;
        var textLines = self.textLines;

        var processedLines = 0;

        while (self.currentLine < textLines.length) {
            self.lines[self.currentLine] = self.$tokenizeRow(self.currentLine);
            self.currentLine++;

            // only check every 5 lines
            processedLines += 1;
            if ((processedLines % 5 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine-1);
                return setTimeout(self.$worker, 10);
            }
        }

        self.running = false;

        self.fireUpdateEvent(startLine, textLines.length - 1);
    };
};

(function(){

    oop.implement(this, MEventEmitter);

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];

        this.start(0);
    };

    this.setLines = function(textLines) {
        this.textLines = textLines;
        this.lines = [];

        this.stop();
    };

    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this.$dispatchEvent("update", {data: data});
    };

    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                                    this.textLines.length);

        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 500);
    };

    this.stop = function() {
        this.running = false;
    };

    this.getTokens = function(row) {
        return this.$tokenizeRow(row).tokens;
    };

    this.getState = function(row) {
        return this.$tokenizeRow(row).state;
    };

    this.$tokenizeRow = function(row) {
        if (!this.lines[row]) {
            var state = null;
            if (row > 0 && this.lines[row - 1]) {
                state = this.lines[row - 1].state;
            }

            // TODO find a proper way to cache every line
            var tokens = this.tokenizer.getLineTokens(this.textLines[row] || "", state || "start");
            if (state) {
                this.lines[row] = tokens;
            } else {
                return tokens;
            }
        }
        return this.lines[row];
    };

}).call(BackgroundTokenizer.prototype);

return BackgroundTokenizer;
});
