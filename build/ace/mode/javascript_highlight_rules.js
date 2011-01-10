define(function(a, e) {
  var f = a("pilot/oop"), c = a("pilot/lang"), g = a("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  a = a("ace/mode/text_highlight_rules").TextHighlightRules;
  JavaScriptHighlightRules = function() {
    var d = new g, h = c.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), i = c.arrayToMap("null|Infinity|NaN|undefined".split("|")), j = c.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, d.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language.boolean", regex:"(?:true|false)\\b"}, {token:function(b) {
      return b == "this" ? "variable.language" : h[b] ? "keyword" : i[b] ? "constant.language" : j[b] ? "invalid.illegal" : b == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[[({]"}, {token:"rparen", regex:"[\\])}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(d.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  f.inherits(JavaScriptHighlightRules, a);
  e.JavaScriptHighlightRules = JavaScriptHighlightRules
});