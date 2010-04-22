ace.provide("ace.BackgroundTokenizer");

ace.BackgroundTokenizer = function(tokenizer) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;
    this._worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var startLine = self.currentLine;
        var textLines = self.textLines;

        var processedLines = 0;

        while (self.currentLine < textLines.length) {
            var line = textLines[self.currentLine];

            var state = self.currentLine == 0 ? "start"
                    : self.lines[self.currentLine - 1].state;
            self.lines[self.currentLine] = self.tokenizer.getLineTokens(line, state);

            // only check every 30 lines
            processedLines += 1;
            if ((processedLines % 30 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine);
                return setTimeout(self._worker, 10);
            }

            self.currentLine++;
        }

        self.running = false;

        self.fireUpdateEvent(startLine, textLines.length - 1);
    };

    this.$initEvents();
};

(function(){

    ace.mixin(this, ace.MEventEmitter);

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

        if (!this.running) {
            clearTimeout(this.running);
            // pretty long delay to prevent the tokenizer from interfering with the user
            this.running = setTimeout(this._worker, 200);
        }
    };

    this.stop = function() {
        this.running = false;
    };

    this.getTokens = function(row) {
        return this._tokenizeRow(row).tokens;
    };

    this.getState = function(row) {
        return this._tokenizeRow(row).state;
    };

    this._tokenizeRow = function(row) {
        if (!this.lines[row]) {
            var state = "start";
            if (row > 0 && this.lines[row - 1]) {
                state = this.lines[row - 1].state;
            }
            this.lines[row] = this.tokenizer.getLineTokens(this.textLines[row] || "", state);
        }
        return this.lines[row];
    };

}).call(ace.BackgroundTokenizer.prototype);