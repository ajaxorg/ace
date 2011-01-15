/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/WorkerTokenizer", ["ace/lib/oop", "ace/MEventEmitter"], function(oop, MEventEmitter) {

var WorkerTokenizer = function(tokenizer) {
    var workerUrl = require.nameToUrl("ace/worker", null, "_");
    this.$worker = new Worker(workerUrl);

    this.callbackId = 1;
    this.callbacks = {};

    var _self = this;
    this.$worker.onerror = function(e) {
        throw e;
    };
    this.$worker.onmessage = function(e) {
        var msg = e.data;
        //console.log("rec", msg)
        switch(msg.type) {
            case "log":
                console.log(msg.data);
                break;

            case "event":
                _self.$dispatchEvent(msg.name, {data: msg.data});
                break;

            case "call":
                var callback = _self.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete _self.callbacks[msg.id];
                }
                break;
        }
    };
};

(function(){

    oop.implement(this, MEventEmitter);

    this.$send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.$call = function(cmd, args, callback) {
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        args.push(id);
        this.$send(cmd, args);
    };

    this.setTokenizer = function(tokenizer) {
        this.$send("setRules", ["ace/mode/JavaScriptHighlightRules"]);
    };

    this.setLines = function(textLines) {
        this.lines = textLines;
        this.$send("setLines", [textLines]);
    };

    this.start = function(startRow) {
        // TODO don't send all lines on each update!!
        this.$send("setLines", [this.lines]);
        this.$send("start", [startRow])
    };

    this.stop = function() {
        this.$send("stop", [])
    };

    this.getTokens = function(firstRow, lastRow, callback) {
        this.$call("getTokens", [firstRow, lastRow], function(tokens) {
            callback(tokens)
        });
    };

    this.getState = function(row, callback) {
        this.$call("getState", [row], callback);
    };

}).call(WorkerTokenizer.prototype);

return WorkerTokenizer;
});
