define(function(require,exports,module){

var Token = require('./token');
var GherkinLine = require('./gherkin_line');

module.exports = function TokenScanner(source) {
  var lines = source.split(/\r?\n/);
  if(lines.length > 0 && lines[lines.length-1].trim() == '') {
    lines.pop();
  }
  var lineNumber = 0;

  this.read = function () {
    var line = lines[lineNumber++];
    var location = {line: lineNumber, column: 0};
    return line == null ? new Token(null, location) : new Token(new GherkinLine(line, lineNumber), location);
  }
};

return module.exports;

});
