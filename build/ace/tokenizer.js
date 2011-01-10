define(function(i, m) {
  i = function(f) {
    this.rules = f;
    this.regExps = {};
    for(var a in this.rules) {
      f = this.rules[a];
      for(var b = [], c = 0;c < f.length;c++) {
        b.push(f[c].regex)
      }this.regExps[a] = new RegExp("(?:(" + b.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(f, a) {
      a = a;
      var b = this.rules[a], c = this.regExps[a];
      c.lastIndex = 0;
      for(var g, j = [], h = 0, e = {type:null, value:""};g = c.exec(f);) {
        var k = "text", l = g[0];
        if(c.lastIndex == h) {
          throw new Error("tokenizer error");
        }h = c.lastIndex;
        for(var d = 0;d < b.length;d++) {
          if(g[d + 1]) {
            k = typeof b[d].token == "function" ? b[d].token(g[0]) : b[d].token;
            if(b[d].next && b[d].next !== a) {
              a = b[d].next;
              b = this.rules[a];
              h = c.lastIndex;
              c = this.regExps[a];
              c.lastIndex = h
            }break
          }
        }if(e.type !== k) {
          e.type && j.push(e);
          e = {type:k, value:l}
        }else {
          e.value += l
        }
      }e.type && j.push(e);
      return{tokens:j, state:a}
    }
  }).call(i.prototype);
  m.Tokenizer = i
});