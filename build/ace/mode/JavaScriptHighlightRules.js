/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/mode/JavaScriptHighlightRules", ["ace/lib/oop", "ace/lib/lang", "ace/mode/DocCommentHighlightRules", "ace/mode/TextHighlightRules"], function(d, b, e, f) {
  JavaScriptHighlightRules = function() {
    var c = new e, g = b.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), h = b.arrayToMap("true|false|null|undefined|Infinity|NaN|undefined".split("|")), i = b.arrayToMap("abstract|boolean|byte|char|class|const|enum|export|extends|final|float|goto|implements|int|interface|long|native|package|private|protected|short|static|super|synchronized|throws|transient|volatiledouble|import|public".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, c.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:function(a) {
      return a == "this" ? "variable.language" : g[a] ? "keyword" : h[a] ? "constant.language" : i[a] ? "invalid.illegal" : a == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(c.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  d.inherits(JavaScriptHighlightRules, f);
  return JavaScriptHighlightRules
});