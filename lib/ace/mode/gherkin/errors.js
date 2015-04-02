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

var error = require('./tea/error');

var Errors = {
  ParserException: error('ParserException'),
  CompositeParserException: error('CompositeParserException'),
  UnexpectedTokenException: error('UnexpectedTokenException'),
  UnexpectedEOFException: error('UnexpectedEOFException'),
  AstBuilderException: error('AstBuilderException'),
  NoSuchLanguageException: error('NoSuchLanguageException')
};

Errors.CompositeParserException.create = function(errors) {
  var message = "Parser errors:\n" + errors.map(function (e) { return e.message; }).join("\n");
  var err = new Errors.CompositeParserException(message);
  err.errors = errors;
  return err;
};

Errors.UnexpectedTokenException.create = function(token, expectedTokenTypes, stateComment) {
  var message = "expected: " + expectedTokenTypes.join(', ') + ", got '" + token.getTokenValue().trim() + "'";
  return createError(Errors.UnexpectedEOFException, message, token.location);
};

Errors.UnexpectedEOFException.create = function(token, expectedTokenTypes, stateComment) {
  var message = "unexpected end of file, expected: " + expectedTokenTypes.join(', ');
  return createError(Errors.UnexpectedTokenException, message, token.location);
};

Errors.AstBuilderException.create = function(message, location) {
  return createError(Errors.AstBuilderException, message, location);
};

Errors.NoSuchLanguageException.create = function(language, location) {
  var message = "Language not supported: " + language;
  return createError(Errors.NoSuchLanguageException, message, location);
};

function createError(Ctor, message, location) {
  var fullMessage = "(" + location.line + ":" + location.column + "): " + message;
  var error = new Ctor(fullMessage);
  error.location = location;
  return error;
}

module.exports = Errors;

return module.exports;

});
