require.def("ace/mode/Xml",
    [
        "ace/ace",
        "ace/mode/Text",
        "ace/Tokenizer",
        "ace/mode/XmlHighlightRules"
    ], function(ace, TextMode, Tokenizer, XmlHighlightRules) {

var Xml = function() {
    this.$tokenizer = new Tokenizer(new XmlHighlightRules().getRules());
};

ace.inherits(Xml, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Xml.prototype);

return Xml;
});