/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

define(function(require, exports, module) {

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var WorkerClient = function(baseUrl, topLevelNamespaces, module, clazz) {
    
    var workerUrl = require.nameToUrl("ace/worker/host", null, "_");
    var worker = this.$worker = new Worker(workerUrl);
    
    //context = s.contexts[contextName],
    //config = context.config;
    //debugger;

    console.log(require.nameToUrl("ace", null, "_"))
    console.log(require.nameToUrl("pilot", null, "_"))
    
    var tlns = {};
    for (var i=0; i<topLevelNamespaces.length; i++) {
        var ns = topLevelNamespaces[i];
        tlns[ns] = require.nameToUrl(ns, null, "_").replace(/.js$/, "").replace(require.config.baseUrl, "");
    }
    console.log(tlns)
    
    this.$worker.postMessage({
        init : true,
        tlns: tlns,
        base: baseUrl,
        module: module,
        clazz: clazz
    });

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

    oop.implement(this, EventEmitter);

    this.send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.call = function(cmd, args, callback) {
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        args.push(id);
        this.$send(cmd, args);
    };

}).call(WorkerClient.prototype);

exports.WorkerClient = WorkerClient;

});
