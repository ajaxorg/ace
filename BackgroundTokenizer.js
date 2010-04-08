function BackgroundTokenizer(onUpdate, onComplete)
{
  this.running = false;
  this.textLines = [];
  this.lines = [];
  this.currentLine = 0;
  
  this.onUpdate = onUpdate || function(firstLine, lastLine) {};
  this.onComplete = onComplete || function() {};
  
  var self = this;
  this._worker = function() 
  {    
    if (!self.running) {
      return;
    }

    var workerStart = new Date();
    var startLine = self.currentLine;
    var textLines = self.textLines;

    while (self.currentLine < textLines.length)
    {
      var line = textLines[self.currentLine];
      
      var state = self.currentLine == 0 ? "start" : self.lines[self.currentLine-1].state;      
      self.lines[self.currentLine] = getLineTokens(line, state);

      if ((new Date()-workerStart) > 80)
      {
        self.onUpdate(startLine, self.currentLine);
        return setTimeout(self._worker, 20);
      }
      
      self.currentLine++;      
    }

    self.running = false;
    
    self.onUpdate(startLine, textLines.length-1);
    self.onComplete();    
  }
};

BackgroundTokenizer.prototype.setLines = function(textLines)
{
  this.textLines = textLines;
  this.lines = [];
  
  this.stop();    
};

BackgroundTokenizer.prototype.start = function(startRow)
{
  this.currentLine = Math.min(startRow || 0, this.currentLine, this.textLines.length);
  this.lines.splice(startRow, this.lines.length);

  if (!this.running)
  {
    this.running = true;
    setTimeout(this._worker);
  }
};

BackgroundTokenizer.prototype.stop = function() {
  this.running = false;
};

BackgroundTokenizer.prototype.getTokens = function(row)
{
  if (this.lines[row]) {
    return this.lines[row].tokens;
  } else {
    return getLineTokens(this.textLines[row] || "", "start").tokens;
  }
};

var keywords = {
  "break" : 1,
  "case" : 1,
  "catch" : 1,
  "continue" : 1,
  "default" : 1,
  "delete" : 1,
  "do" : 1,
  "else" : 1,
  "finally" : 1,
  "for" : 1,
  "function" : 1,
  "if" : 1,
  "in" : 1,
  "instanceof" : 1,
  "new" : 1,
  "return" : 1,
  "switch" : 1,
  "throw" : 1,
  "try" : 1,
  "typeof" : 1,
  "var" : 1,
  "while" : 1,
  "with" : 1
};

getLineTokens = function(line, state)
{
  var tokens = [];
  
  var re = /(?:(\s+)|("[^"]*")|('[^']*')|([\[\]\(\)\{\}])|([a-zA-Z_][a-zA-Z0-9_]*)|(\/\/.*)|(.))/g
  re.lastIndex = 0;

  var match;
  while (match = re.exec(line))
  {
    var token = {
      type: "text",
      value: match[0]
    }
    
    if (match[2] || match[3]) {
      token.type = "string";
    } else if (match[5] && keywords[match[5]]) {
      token.type = "keyword";
    } else if (match[6]) {
      token.type = "comment";
    }
    
    tokens.push(token);
  };
  
  return {
    tokens: tokens,
    state: "start"
  }
};