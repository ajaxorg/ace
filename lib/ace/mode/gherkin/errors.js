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
