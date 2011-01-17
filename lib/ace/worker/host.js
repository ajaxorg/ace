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

    require.id = name;
    
    var chunks = name.split("/");
    chunks[0] = require.tlns[chunks[0]] || chunks[0];
    name = chunks.join("/")
    
    console.log(name)
    console.log(require.baseUrl)
    
    console.log(require.baseUrl + "/" + name + ".js");
    importScripts(require.baseUrl + "/" + name + ".js");
    return require.modules[name].exports;
};
require.modules = {};
require.tlns = {};
require.baseUrl;

var define = function(factory) {
    var module = {
        exports: {}
    };    
    var returnExports = factory(require, module.exports, module);
    if (returnExports) {
        module.exports = exports;
    }
    
    require.modules[require.id] = module;
};

function initBaseUrls(baseUrl, topLevelNamespaces) {
    require.baseUrl = baseUrl;
    require.tlns = topLevelNamespaces;
}

function initSender() {

    var EventEmitter = require("pilot/event_emitter").EventEmitter;
    var oop = require("pilot/oop");
    
    console.log("init sender")
    
    var Sender = function() {}
    
    (function() {
        
        oop.implement(this, EventEmitter);
                
        this.callback = function(data, callbackId) {
            postMessage({
                type: "call",
                id: callbackId,
                data: data
            });
        },
    
        this.event = function(name, data) {
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
    console.log(e.data)
    var msg = e.data;
    if (msg.command)
        bgtokenizer[msg.command].apply(bgtokenizer, msg.args);
    else if (msg.init) {
        initBaseUrls(msg.base, msg.tlns);
        sender = initSender();
        var clazz = require(msg.module)[msg.classname];
        main = new clazz(sender);
    } else if (msg.event) {
    
    }
};