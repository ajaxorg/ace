/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/mode/Xml",
    [
        "ace/lib/oop",
        "ace/mode/Text",
        "ace/Tokenizer",
        "ace/mode/XmlHighlightRules"
    ], function(oop, TextMode, Tokenizer, XmlHighlightRules) {

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