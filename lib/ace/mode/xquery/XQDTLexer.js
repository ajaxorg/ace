define(function(require, exports, module){

var org =  require("./antlr3-all").org;

var XQDTLexer = exports.XQDTLexer = function(input, state)
{
  XQDTLexer.superclass.constructor.call(this, input, state);
};

org.antlr.lang.extend(XQDTLexer, org.antlr.runtime.Lexer, {

  isWsExplicit: false,

  setIsWsExplicit: function (wsExplicit) {
    //console.log("A WS: " + wsExplicit);
    this.isWsExplicit = wsExplicit;
    //console.log("B WS: " + wsExplicit);
  },

  addToStack: function (stack) {
    stack.push(this);
  },

  rewindToIndex: function(index) {
    var stream = this.input;
    stream.seek(index);
  }
});

});
