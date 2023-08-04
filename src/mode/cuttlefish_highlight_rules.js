"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var CuttlefishHighlightRules = function () {
    this.$rules = {
        start: [{
            token: ['text', 'comment'],
            regex: /^([ \t]*)(#.*)$/
        }, {
            token: ['text', 'keyword', 'text', 'string', 'text', 'comment'],
            regex: /^([ \t]*)(include)([ \t]*)([A-Za-z0-9-\_\.\*\/]+)([ \t]*)(#.*)?$/
        }, {
            token: ['text', 'keyword', 'text', 'operator', 'text', 'string', 'text', 'comment'],
            regex: /^([ \t]*)([A-Za-z0-9-_]+(?:\.[A-Za-z0-9-_]+)*)([ \t]*)(=)([ \t]*)([^ \t#][^#]*?)([ \t]*)(#.*)?$/
        }, {
            defaultToken: 'invalid'
        }]
    };

    this.normalizeRules();
};

CuttlefishHighlightRules.metaData = {
    fileTypes: ['conf'],
    keyEquivalent: '^~C',
    name: 'Cuttlefish',
    scopeName: 'source.conf'
};


oop.inherits(CuttlefishHighlightRules, TextHighlightRules);

exports.CuttlefishHighlightRules = CuttlefishHighlightRules;
