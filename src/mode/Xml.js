ace.provide("ace.mode.Xml");

ace.mode.Xml = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.XmlHighlightRules().getRules());
};
ace.inherits(ace.mode.Xml, ace.mode.Text);
