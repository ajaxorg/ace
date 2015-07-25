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

function GherkinLine(lineText, lineNumber) {
  this.lineText = lineText;
  this.lineNumber = lineNumber;
  this.trimmedLineText = lineText.replace(/^\s+/g, ''); // ltrim
  this.isEmpty = this.trimmedLineText.length == 0;
  this.indent = lineText.length - this.trimmedLineText.length;
};

GherkinLine.prototype.startsWith = function startsWith(prefix) {
  return this.trimmedLineText.indexOf(prefix) == 0;
};

GherkinLine.prototype.startsWithTitleKeyword = function startsWithTitleKeyword(keyword) {
  return this.startsWith(keyword+':'); // The C# impl is more complicated. Find out why.
};

GherkinLine.prototype.getLineText = function getLineText(indentToRemove) {
  if (indentToRemove < 0 || indentToRemove > this.indent) {
    return this.trimmedLineText;
  } else {
    return this.lineText.substring(indentToRemove);
  }
};

GherkinLine.prototype.getRestTrimmed = function getRestTrimmed(length) {
  return this.trimmedLineText.substring(length).trim();
};

GherkinLine.prototype.getTableCells = function getTableCells() {
  var column = this.indent + 1;
  var items = this.trimmedLineText.split('|');
  items.shift(); // Skip the beginning of the line
  items.pop(); // Skip the one after the last pipe
  return items.map(function (item) {
    var cellIndent = item.length - item.replace(/^\s+/g, '').length + 1;
    var span = {column: column + cellIndent, text: item.trim()};
    column += item.length + 1;
    return span;
  });
};

GherkinLine.prototype.getTags = function getTags() {
  var column = this.indent + 1;
  var items = this.trimmedLineText.trim().split('@');
  items.shift();
  return items.map(function (item) {
    var length = item.length;
    var span = {column: column, text: '@' + item.trim()};
    column += length + 1;
    return span;
  });
};

module.exports = GherkinLine;

return module.exports;

});
