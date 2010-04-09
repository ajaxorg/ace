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
    var state = "start";
    if (row > 0 && this.lines[row-1]) {
      state = this.lines[row-1].state;
    }
    return getLineTokens(this.textLines[row] || "", state).tokens;
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

getLineTokens = function(line, startState)
{
  // regexp must not have capturing parentheses
  // regexps are ordered -> the first match is used
  
  var rules = {
    start :
    [
      {
        token: "comment",
        regex: "\\/\\/.*$"
      },
      {
        token: "comment", // multi line comment in one line
        regex: "\\/\\*.*?\\*\\/"
      },      
      {
        token: "comment", // multi line comment start
        regex: "\\/\\*.*$",
        next: "comment"
      },
      {
        token: "string", // single line
        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      },
      {
        token: "string", // multi line string start
        regex: '["].*\\\\$',
        next: "qqstring"
      },      
      {
        token: "string", // single line
        regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
      },
      {
        token: "string", // multi line string start
        regex: "['].*\\\\$",
        next: "qstring"
      },    
      {
        token: "number", // hex
        regex: "0[xX][0-9a-fA-F]+\\b"
      },      
      {
        token: "number", // float
        regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      },
      {
        token: function(value)
        {
          if (keywords[value]) {
            return "keyword";
          } else {
            return "identifier"
          }
        },
        regex: "[a-zA-Z_][a-zA-Z0-9_]*\\b"
      },
      {
        token: function(value) {
          //return parens[value];
          return "text";
        },
        regex: "[\\[\\]\\(\\)\\{\\}]"
      },
      {
        token: "text",
        regex: "\\s+"
      }
    ],
    "comment":
    [
      {
        token: "comment", // closing comment
        regex: ".*?\\*\\/",
        next: "start"
      },
      {
        token: "comment", // comment spanning whole line
        regex: ".+"
      }
    ],
    "qqstring":
    [
      {
        token: "string",
        regex: '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
        next: "start"
      },
      {
        token: "string",
        regex: '.+'
      }
    ],
    "qstring":
    [
      {
        token: "string",
        regex: "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
        next: "start"
      },
      {
        token: "string",
        regex: '.+'
      }
    ]    
  };
  
  var regExps = {};
  for (var key in rules)
  {
    var state = rules[key];
    var ruleRegExps = [];
    
    for (var i=0; i < state.length; i++) {
      ruleRegExps.push(state[i].regex);
    };
    
    regExps[key] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g");
  }

  
  var currentState = startState;
  var state = rules[currentState];  
  var re = regExps[currentState];
  re.lastIndex = 0;
  
  var match, tokens = [];
  
  var lastIndex = 0;
  
  while (match = re.exec(line))
  {
    var token = {
      type: "text",
      value: match[0]
    }
    
    if (re.lastIndex == lastIndex) {
      throw new Error("tokenizer error")
    }
    lastIndex = re.lastIndex;
    
    //console.log(match);
    
    for (var i=0; i < state.length; i++) 
    {
      if (match[i+1])
      {
        if (typeof state[i].token == "function") {
          token.type = state[i].token(match[0]);
        } else {
          token.type = state[i].token;
        }
        
        if (state[i].next && state[i].next !== currentState) 
        {
          currentState = state[i].next;
          var state = rules[currentState];  
          var lastIndex = re.lastIndex;
          
          var re = regExps[currentState];
          re.lastIndex = lastIndex;
        }
        break;
      }
    };
    
    tokens.push(token);
  };
  
  //console.log(tokens, currentState)
  
  return {
    tokens: tokens,
    state: currentState
  }
};