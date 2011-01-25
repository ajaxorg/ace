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
        return require.modules[name].exports;
    
    var chunks = name.split("/");
    chunks[0] = require.tlns[chunks[0]] || chunks[0];
    path = require.baseUrl + "/" + chunks.join("/") + ".js"
    
    require.id = name;
    importScripts(path);    
    return require.modules[name].exports;
};
require.modules = {};
require.tlns = {};
require.baseUrl;

var define = function(factory) {
    var module = {
        exports: {}
    };
    
    var name = require.id;
    var returnExports = factory(require, module.exports, module);
    if (returnExports)
        module.exports = exports;
    
    require.modules[name] = module;
};

function initBaseUrls(baseUrl, topLevelNamespaces) {
    require.baseUrl = baseUrl;
    require.tlns = topLevelNamespaces;
}

function initSender() {

    var EventEmitter = require("pilot/event_emitter").EventEmitter;
    var oop = require("pilot/oop");
    
    var Sender = function() {};
    
    (function() {
        
        oop.implement(this, EventEmitter);
                
        this.callback = function(data, callbackId) {
            postMessage({
                type: "call",
                id: callbackId,
                data: data
            });
        },
    
        this.emit = function(name, data) {
            postMessage({
                type: "event",
                name: name,
                data: data
            });
        }
    }).call(Sender.prototype);
    
    return new Sender();
}

var main;
var sender;

onmessage = function(e) {
    var msg = e.data;
    if (msg.command)
        main[msg.command].apply(main, msg.args);
    else if (msg.init) {        
        initBaseUrls(msg.base, msg.tlns);
        sender = initSender();
        var clazz = require(msg.module)[msg.classname];
        main = new clazz(sender);
    } else if (msg.event) {
        sender._dispatchEvent(msg.event, msg.data);
    }
};