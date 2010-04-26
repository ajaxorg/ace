ace.provide("ace.mode.DocCommentHighlightRules");

ace.mode.DocCommentHighlightRules = function() {

    this.$rules = {
        "start" : [ {
            token : "doc-comment", // closing comment
            regex : "\\*\\/",
            next : "start"
        }, {
            token : "doc-comment-tag",
            regex : "@[\\w\\d_]+"
        }, {
            token : "doc-comment",
            regex : "\s+"
        }, {
            token : "doc-comment",
            regex : "[^@\\*]+"
        }, {
            token : "doc-comment",
            regex : "."
        }]
    };
};

ace.inherits(ace.mode.DocCommentHighlightRules, ace.mode.TextHighlightRules);

(function() {

    this.getStartRule = function(start) {
        return {
            token : "doc-comment", // doc comment
            regex : "\\/\\*\\*",
            next: start
        };
    };

}).call(ace.mode.DocCommentHighlightRules.prototype);