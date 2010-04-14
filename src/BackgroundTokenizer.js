ace.provide("ace.BackgroundTokenizer");

ace.BackgroundTokenizer = function(tokenizer, onUpdate, onComplete) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    this.onUpdate = onUpdate || function(firstLine, lastLine) {
    };
    this.onComplete = onComplete || function() {
    };

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
            self.lines[self.currentLine] = self.tokenizer.getLineTokens(line,
                                                                        state);

            // only check every 30 lines
            processedLines += 1;
            if ((processedLines % 30 == 0) && (new Date() - workerStart) > 20) {
                self.onUpdate(startLine, self.currentLine);
                return setTimeout(self._worker, 10);
            }

            self.currentLine++;
        }

        self.running = false;

        self.onUpdate(startLine, textLines.length - 1);
        self.onComplete();
    };
};

ace.BackgroundTokenizer.prototype.setLines = function(textLines) {
    this.textLines = textLines;
    this.lines = [];

    this.stop();
};

ace.BackgroundTokenizer.prototype.start = function(startRow) {
    this.currentLine = Math.min(startRow || 0, this.currentLine,
                                this.textLines.length);
    this.lines.splice(startRow, this.lines.length);

    if (!this.running) {
        this.running = true;
        setTimeout(this._worker, 50);
    }
};

ace.BackgroundTokenizer.prototype.stop = function() {
    this.running = false;
};

ace.BackgroundTokenizer.prototype.getTokens = function(row) {
    if (this.lines[row]) {
        return this.lines[row].tokens;
    }
    else {
        var state = "start";
        if (row > 0 && this.lines[row - 1]) {
            state = this.lines[row - 1].state;
        }
        return this.tokenizer.getLineTokens(this.textLines[row] || "", state).tokens;
    }
};