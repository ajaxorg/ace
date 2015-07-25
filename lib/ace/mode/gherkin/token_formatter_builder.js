/*
The MIT License (MIT)

Copyright (c) 2014-2015 Cucumber Ltd, Gaspar Nagy, TechTalk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
define(function(require,exports,module){

module.exports = function TokenFormatterBuilder() {
  var tokensText = '';

  this.startRule = function(ruleType) {};

  this.endRule = function(ruleType) {};

  this.build = function(token) {
    tokensText += formatToken(token) + '\n';
  };

  this.getResult = function() {
    return tokensText;
  }

  function formatToken(token) {
    if(token.isEof) return 'EOF';

    return "(" +
    token.location.line +
    ":" +
    token.location.column +
    ")" +
    token.matchedType +
    ":" +
    (typeof token.matchedKeyword === 'string' ? token.matchedKeyword : '') +
    "/" +
    (typeof token.matchedText === 'string' ? token.matchedText : '') +
    "/" +
    token.matchedItems.map(function (i) { return i.column + ':' + i.text; }).join(',');
  }
};

return module.exports;

});
