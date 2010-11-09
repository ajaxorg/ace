define(function() {
  var k = function(f) {
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
      for(var g, h = [], i = 0, e = {type:null, value:""};g = c.exec(f);) {
        var j = "text", l = g[0];
        if(c.lastIndex == i) {
          throw new Error("tokenizer error");
        }i = c.lastIndex;
        window.LOG && console.log(a, g);
        for(var d = 0;d < b.length;d++) {
          if(g[d + 1]) {
            j = typeof b[d].token == "function" ? b[d].token(g[0]) : b[d].token;
            if(b[d].next && b[d].next !== a) {
              a = b[d].next;
              b = this.rules[a];
              i = c.lastIndex;
              c = this.regExps[a];
              c.lastIndex = i
            }break
          }
        }if(e.type !== j) {
          e.type && h.push(e);
          e = {type:j, value:l}
        }else {
          e.value += l
        }
      }e.type && h.push(e);
      window.LOG && console.log(h, a);
      return{tokens:h, state:a}
    }
  }).call(k.prototype);
  return k
});