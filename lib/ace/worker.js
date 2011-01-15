postMessage("Juhu Kinners");

var console = {
    log: function(msg) {
        postMessage({type: "log", data: msg});
    }
};
var window = {
    console: console
};

var require = function(name) {
    if (require.modules[name])
        return require.modules[name];

    importScripts(require.baseUrl + "/" + name + ".js");
    return require.modules[name];
};

require.def = function(name, deps, callback) {
    if (!callback) {
        callback = deps;
        deps = [];
    }
    var modules = deps.map(function(dep) {
        return require(dep);
    });
    require.modules[name] = callback.apply(this, modules);
};

require.baseUrl = "..";
require.modules = {};

var Tokenizer = require("ace/Tokenizer");

var bgtokenizer = {
    running: false,
    textLines: [],
    lines: [],
    currentLine: 0,
    tokenizer: null,

    init: function() {
        var self = this;

        this.$worker = function() {
            if (!self.running) { return; }

            var workerStart = new Date();
            var startLine = self.currentLine;
            var textLines = self.textLines;

            var processedLines = 0;

            while (self.currentLine < textLines.length) {
                self.lines[self.currentLine] = self.$tokenizeRows(self.currentLine, self.currentLine)[0];
                self.currentLine++;

                // only check every 5 lines
                processedLines += 1;
                if ((processedLines % 5 == 0) && (new Date() - workerStart) > 40) {
                    self.$event("update", {first: startLine, last: self.currentLine-1});
                    self.running = setTimeout(self.$worker, 0);
                    return;
                }
            }

            self.running = false;
            self.$event("update", {first: startLine, last: textLines.length - 1});
        };
    },

    setRules: function(rules) {
        var Rules = require(rules);
        this.tokenizer = new Tokenizer(new Rules().getRules());
        this.lines = [];

        this.start(0);
    },

    setLines: function(textLines) {
        this.textLines = textLines;
        this.lines = [];

        this.stop();
    },

    start: function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                this.textLines.length);

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        this.running = setTimeout(this.$worker, 0);
    },

    stop: function() {
        if (this.running)
            clearTimeout(this.running);

        this.running = false;
    },

    getTokens: function(firstRow, lastRow, callbackId) {
        this.$callback(this.$tokenizeRows(firstRow, lastRow), callbackId);
    },

    getState: function(row, callbackId) {
        this.$callback(this.$tokenizeRows(row, row)[0].state, callbackId);
    },

    $tokenizeRows: function(firstRow, lastRow) {
        var rows = [];

        // determin start state
        var state = "start";
        var doCache = false;
        if (firstRow > 0 && this.lines[firstRow - 1]) {
            state = this.lines[firstRow - 1].state;
            doCache = true;
        }

        for (var row=firstRow; row<=lastRow; row++) {
            if (!this.lines[row]) {
                var tokens = this.tokenizer.getLineTokens(this.textLines[row] || "", state);
                var state = tokens.state;
                rows.push(tokens);

                if (doCache) {
                    this.lines[row] = tokens;
                }
            }
            else
                rows.push(this.lines[row]);
        }
        return rows;
    },

    $callback: function(data, callbackId) {
        postMessage({
            type: "call",
            id: callbackId,
            data: data
        });
    },

    $event: function(name, data) {
        postMessage({
            type: "event",
            name: name,
            data: data
        });
    }
};

bgtokenizer.init();

var onmessage = function(e) {
    var msg = e.data;
    bgtokenizer[msg.command].apply(bgtokenizer, msg.args);
};