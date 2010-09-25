/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/mode/DocCommentHighlightRules",
    [
        "ace/lib/oop",
        "ace/mode/TextHighlightRules"
    ], function(oop, TextHighlightRules) {

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

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

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