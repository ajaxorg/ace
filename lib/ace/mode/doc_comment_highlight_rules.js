/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
define(function(require, exports, module) {

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules");

var DocCommentHighlightRules = function() {

    this.$rules = {
        "start" : [ {
            token : "comment.doc", // closing comment
            regex : "\\*\\/",
            next : "start"
        }, {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+"
        }, {
            token : "comment.doc",
            regex : "\s+"
        }, {
            token : "comment.doc",
            regex : "[^@\\*]+"
        }, {
            token : "comment.doc",
            regex : "."
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

(function() {

    this.getStartRule = function(start) {
        return {
            token : "comment.doc", // doc comment
            regex : "\\/\\*(?=\\*)",
            next: start
        };
    };

}).call(DocCommentHighlightRules.prototype);

return DocCommentHighlightRules;
});