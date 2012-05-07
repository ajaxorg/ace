
define(function(require, exports, module) {

    "no use strict";

    exports.main = function()
    {
        var console = {
            log: function(msg) {
                postMessage({type: "log", data: msg});
            }
        };

        // NOTE: This sets the global `window` object used by workers.
        // TODO: Pass into worker what it needs and don't set global here.
        window = {
            console: console
        };

        function initSender() {

            var EventEmitter = require("ace/lib/event_emitter").EventEmitter;
            var oop = require("ace/lib/oop");
            
            var Sender = function() {};
            
            (function() {
                
                oop.implement(this, EventEmitter);
                        
                this.callback = function(data, callbackId) {
                    postMessage({
                        type: "call",
                        id: callbackId,
                        data: data
                    });
                };
            
                this.emit = function(name, data) {
                    postMessage({
                        type: "event",
                        name: name,
                        data: data
                    });
                };
                
            }).call(Sender.prototype);
            
            return new Sender();
        }

        var main;
        var sender;

        onmessage = function(e) {
            var msg = e.data;
            if (msg.command) {
                main[msg.command].apply(main, msg.args);
            }
            else if (msg.init) {        
                require("ace/lib/fixoldbrowsers");
                sender = initSender();
                require.async(msg.module, function(WORKER) {
                    var clazz = WORKER[msg.classname];
                    main = new clazz(sender);
                });
            } 
            else if (msg.event && sender) {
                sender._emit(msg.event, msg.data);
            }
        };
    }
});
