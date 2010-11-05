/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
define(function(require, exports, module) {

var oop = require("../lib/oop");
var Text = require("./text");
var Tokenizer = require("../tokenizer");
var XmlHighlightRules = require("./xml_highlight_rules");

var Xml = function() {
    this.$tokenizer = new Tokenizer(new XmlHighlightRules().getRules());
};

oop.inherits(Xml, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Xml.prototype);

return Xml;
});