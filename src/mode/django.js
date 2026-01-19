var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DjangoHighlightRules = function(){
    this.$rules = {
        'start': [{
            token: "string",
            regex: '".*?"'
        }, {
            token: "string",
            regex: "'.*?'"
        }, {
            token: "constant",
            regex: '[0-9]+'
        }, {
            token: "variable",
            regex: "[-_a-zA-Z0-9:]+"
        }],
        'tag': [{
            token: "entity.name.function",
            regex: "[a-zA-Z][_a-zA-Z0-9]*",
            next: "start"
        }]
    };
};

oop.inherits(DjangoHighlightRules, TextHighlightRules);

var DjangoHtmlHighlightRules = function() {
    HtmlHighlightRules.call(this);
    var startRules = [
        {
            token: "comment.line",
            regex: "\\{#.*?#\\}"
        }, {
            token: "comment.block",
            regex: "\\{\\%\\s*comment\\s*\\%\\}",
            push: [{
                token: "comment.block",
                regex: "\\{\\%\\s*endcomment\\s*\\%\\}",
                next: "pop"
            }, {
                defaultToken: "comment.block"
            }]
        }, {
            token: "constant.language",
            regex: "\\{\\{",
            push: "django-start"
        }, {
            token: "constant.language",
            regex: "\\{\\%",
            push: "django-tag"
        }
    ];
    var endRules = [
        {
            token: "constant.language",
            regex: "\\%\\}",
            next: "pop"
        }, {
            token: "constant.language",
            regex: "\\}\\}",
            next: "pop"
        }
    ];
    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);
    this.embedRules(DjangoHighlightRules, "django-", endRules, ["start"]);
    this.normalizeRules();
};

oop.inherits(DjangoHtmlHighlightRules, HtmlHighlightRules);

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = DjangoHtmlHighlightRules;
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.$id = "ace/mode/django";
    this.snippetFileId = "ace/snippets/django";
}).call(Mode.prototype);

exports.Mode = Mode;
