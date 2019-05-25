"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var Mirror = require("../worker/mirror").Mirror;
var CSSLint = require("./css/csslint").CSSLint;

var Worker = exports.Worker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(400);
    this.ruleset = null;
    this.setDisabledRules("ids|order-alphabetical");
    this.setInfoRules(
      "adjoining-classes|qualified-headings|zero-units|gradients|" +
      "import|outline-none|vendor-prefix"
    );
};

oop.inherits(Worker, Mirror);

(function() {
    this.setInfoRules = function(ruleNames) {
        if (typeof ruleNames == "string")
            ruleNames = ruleNames.split("|");
        this.infoRules = lang.arrayToMap(ruleNames);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.setDisabledRules = function(ruleNames) {
        if (!ruleNames) {
            this.ruleset = null;
        } else {
            if (typeof ruleNames == "string")
                ruleNames = ruleNames.split("|");
            var all = {};

            CSSLint.getRules().forEach(function(x){
                all[x.id] = true;
            });
            ruleNames.forEach(function(x) {
                delete all[x];
            });
            
            this.ruleset = all;
        }
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        var value = this.doc.getValue();
        if (!value)
            return this.sender.emit("annotate", []);
        var infoRules = this.infoRules;

        var result = CSSLint.verify(value, this.ruleset);
        this.sender.emit("annotate", result.messages.map(function(msg) {
            return {
                row: msg.line - 1,
                column: msg.col - 1,
                text: msg.message,
                type: infoRules[msg.rule.id] ? "info" : msg.type,
                rule: msg.rule.name
            };
        }));
    };

}).call(Worker.prototype);
