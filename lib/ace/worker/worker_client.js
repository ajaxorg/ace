"use strict";

var oop = require("../lib/oop");
var net = require("../lib/net");
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var config = require("../config");

function $workerBlob(workerUrl) {
    // workerUrl can be protocol relative
    // importScripts only takes fully qualified urls
    var script = "importScripts('" + net.qualifyURL(workerUrl) + "');";
    try {
        return new Blob([script], {"type": "application/javascript"});
    } catch (e) { // Backwards-compatibility
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        var blobBuilder = new BlobBuilder();
        blobBuilder.append(script);
        return blobBuilder.getBlob("application/javascript");
    }
}

function createWorker(workerUrl) {
    if (typeof Worker == "undefined")
        return { postMessage: function() {}, terminate: function() {} };
    if (config.get("loadWorkerFromBlob")) {
        var blob = $workerBlob(workerUrl);
        var URL = window.URL || window.webkitURL;
        var blobURL = URL.createObjectURL(blob);
        // calling URL.revokeObjectURL before worker is terminated breaks it on IE Edge
        return new Worker(blobURL);
    }
    return new Worker(workerUrl);
}

var WorkerClient = function(worker) {
    if (!worker.postMessage)
        worker = this.$createWorkerFromOldConfig.apply(this, arguments);

    this.$worker = worker;
    this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.callbackId = 1;
    this.callbacks = {};

    this.$worker.onmessage = this.onMessage;
};

(function(){

    oop.implement(this, EventEmitter);

    this.$createWorkerFromOldConfig = function(topLevelNamespaces, mod, classname, workerUrl, importScripts) {
        // nameToUrl is renamed to toUrl in requirejs 2
        if (require.nameToUrl && !require.toUrl)
            require.toUrl = require.nameToUrl;

        if (config.get("packaged") || !require.toUrl) {
            workerUrl = workerUrl || config.moduleUrl(mod, "worker");
        } else {
            var normalizePath = this.$normalizePath;
            workerUrl = workerUrl || normalizePath(require.toUrl("ace/worker/worker.js", null, "_"));

            var tlns = {};
            topLevelNamespaces.forEach(function(ns) {
                tlns[ns] = normalizePath(require.toUrl(ns, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
            });
        }

        this.$worker = createWorker(workerUrl);
        if (importScripts) {
            this.send("importScripts", importScripts);
        }
        this.$worker.postMessage({
            init : true,
            tlns : tlns,
            module : mod,
            classname : classname
        });
        return this.$worker;
    };

    this.onMessage = function(e) {
        var msg = e.data;
        switch (msg.type) {
            case "event":
                this._signal(msg.name, {data: msg.data});
                break;
            case "call":
                var callback = this.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete this.callbacks[msg.id];
                }
                break;
            case "error":
                this.reportError(msg.data);
                break;
            case "log":
                window.console && console.log && console.log.apply(console, msg.data);
                break;
        }
    };
    
    this.reportError = function(err) {
        window.console && console.error && console.error(err);
    };

    this.$normalizePath = function(path) {
        return net.qualifyURL(path);
    };

    this.terminate = function() {
        this._signal("terminate", {});
        this.deltaQueue = null;
        this.$worker.terminate();
        this.$worker = null;
        if (this.$doc)
            this.$doc.off("change", this.changeListener);
        this.$doc = null;
    };

    this.send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.call = function(cmd, args, callback) {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    };

    this.emit = function(event, data) {
        try {
            // firefox refuses to clone objects which have function properties
            // TODO: cleanup event
            if (data.data && data.data.err)
                data.data.err = {message: data.data.err.message, stack: data.data.err.stack, code: data.data.err.code};
            this.$worker.postMessage({event: event, data: {data: data.data}});
        }
        catch(ex) {
            console.error(ex.stack);
        }
    };

    this.attachToDocument = function(doc) {
        if (this.$doc)
            this.terminate();

        this.$doc = doc;
        this.call("setValue", [doc.getValue()]);
        doc.on("change", this.changeListener);
    };

    this.changeListener = function(delta) {
        if (!this.deltaQueue) {
            this.deltaQueue = [];
            setTimeout(this.$sendDeltaQueue, 0);
        }
        if (delta.action == "insert")
            this.deltaQueue.push(delta.start, delta.lines);
        else
            this.deltaQueue.push(delta.start, delta.end);
    };

    this.$sendDeltaQueue = function() {
        var q = this.deltaQueue;
        if (!q) return;
        this.deltaQueue = null;
        if (q.length > 50 && q.length > this.$doc.getLength() >> 1) {
            this.call("setValue", [this.$doc.getValue()]);
        } else
            this.emit("change", {data: q});
    };

}).call(WorkerClient.prototype);


var UIWorkerClient = function(topLevelNamespaces, mod, classname) {
    var main = null;
    var emitSync = false;
    var sender = Object.create(EventEmitter);

    var messageBuffer = [];
    var workerClient = new WorkerClient({
        messageBuffer: messageBuffer,
        terminate: function() {},
        postMessage: function(e) {
            messageBuffer.push(e);
            if (!main) return;
            if (emitSync)
                setTimeout(processNext);
            else
                processNext();
        }
    });

    workerClient.setEmitSync = function(val) { emitSync = val; };

    var processNext = function() {
        var msg = messageBuffer.shift();
        if (msg.command)
            main[msg.command].apply(main, msg.args);
        else if (msg.event)
            sender._signal(msg.event, msg.data);
    };

    sender.postMessage = function(msg) {
        workerClient.onMessage({data: msg});
    };
    sender.callback = function(data, callbackId) {
        this.postMessage({type: "call", id: callbackId, data: data});
    };
    sender.emit = function(name, data) {
        this.postMessage({type: "event", name: name, data: data});
    };

    config.loadModule(["worker", mod], function(Main) {
        main = new Main[classname](sender);
        while (messageBuffer.length)
            processNext();
    });

    return workerClient;
};

exports.UIWorkerClient = UIWorkerClient;
exports.WorkerClient = WorkerClient;
exports.createWorker = createWorker;
