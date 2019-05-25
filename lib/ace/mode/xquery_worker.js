"use strict";
    
var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var XQLintLib = require("./xquery/xqlint");
var XQLint =  XQLintLib.XQLint;

var getModuleResolverFromModules = function(modules){
    return function(uri){
            var index = modules;
            var mod = index[uri];
            var variables = {};
            var functions = {};
            mod.functions.forEach(function(fn){
                functions[uri + '#' + fn.name + '#' + fn.arity] = {
                    params: []
                };
                fn.parameters.forEach(function(param){
                    functions[uri + '#' + fn.name + '#' + fn.arity].params.push('$' + param.name);
                });
            });
            mod.variables.forEach(function(variable){
                var name = variable.name.substring(variable.name.indexOf(':') + 1);
                variables[uri + '#' + name] = { type: 'VarDecl', annotations: [] };
            });
            return {
                variables: variables,
                functions: functions
            };
    };
};

var XQueryWorker = exports.XQueryWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
    //this.availableModuleNamespaces = Object.keys(Modules);
    //this.moduleResolver; = getModuleResolverFromModules(Modules);
    var that = this;

    this.sender.on("complete", function(e){
        if(that.xqlint) {
            var pos = { line: e.data.pos.row, col: e.data.pos.column };
            var proposals = that.xqlint.getCompletions(pos);
            that.sender.emit("complete", proposals);
        }
    });

    this.sender.on("setAvailableModuleNamespaces", function(e){
        that.availableModuleNamespaces = e.data;
    });

    this.sender.on("setFileName", function(e){
        that.fileName = e.data;
    });

    this.sender.on("setModuleResolver", function(e){
        that.moduleResolver = getModuleResolverFromModules(e.data);
    });
};

oop.inherits(XQueryWorker, Mirror);

(function() {
    
    this.onUpdate = function() {
        this.sender.emit("start");
        var value = this.doc.getValue();
        var sctx = XQLintLib.createStaticContext();
        if(this.moduleResolver) {
            sctx.setModuleResolver(this.moduleResolver);
        }
        if(this.availableModuleNamespaces) {
            sctx.availableModuleNamespaces = this.availableModuleNamespaces;
        }
        var opts = {
            styleCheck: this.styleCheck,
            staticContext: sctx,
            fileName: this.fileName
        };
        this.xqlint = new XQLint(value, opts);
        this.sender.emit("markers", this.xqlint.getMarkers());
    };
}).call(XQueryWorker.prototype);
