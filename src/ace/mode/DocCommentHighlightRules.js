require.def("ace/mode/DocCommentHighlightRules",
    [
        "ace/ace",
        "ace/mode/TextHighlightRules"
    ], function(ace, TextHighlightRules) {

var DocCommentHighlightRules = function() {

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

ace.inherits(DocCommentHighlightRules, TextHighlightRules);

(function() {

    this.getStartRule = function(start) {
        return {
            token : "doc-comment", // doc comment
            regex : "\\/\\*\\*",
            next: start
        };
    };

}).call(DocCommentHighlightRules.prototype);

return DocCommentHighlightRules;
});