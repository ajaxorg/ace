function TextDocument(text) {
  this.lines = this._split(text);
}

TextDocument.prototype = 
{
  _split : function(text) {
    return text.split(/[\n\r]/)
  },
  
  getLine : function(row) {
    return this.lines[row] || "";
  },
  
  keywords : {
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
  },
  
  getLineTokens : function(row)
  {
    var tokens = [];
    
    var re = /(?:(\s+)|("[^"]*")|('[^']*')|([\[\]\(\)\{\}])|([a-zA-Z_][a-zA-Z0-9_]*)|(\/\/.*)|(.))/g
    re.lastIndex = 0;

    var match;
    var line = this.getLine(row);
    while (match = re.exec(line))
    {
      var token = {
        type: "text",
        value: match[0]
      }
      
      if (match[2] || match[3]) {
        token.type = "string";
      } else if (match[5] && this.keywords[match[5]]) {
        token.type = "keyword";
      } else if (match[6]) {
        token.type = "comment";
      }
      
      tokens.push(token);
    };
    
    return tokens;
  },
  
  getLength : function() {
    return this.lines.length;
  },
  
  insert : function(position, text) 
  {
    var newLines = this._split(text);
    
    if (text == "\n") 
    {
      var line = this.lines[position.row] || "";
      this.lines[position.row] = line.substring(0, position.column);
      this.lines.splice(position.row+1, 0, line.substring(position.column));
      
      return {
        row: position.row + 1,
        column: 0
      };
    }
    else if (newLines.length == 1) 
    {
      var line = this.lines[position.row] || "";
      this.lines[position.row] = line.substring(0, position.column) + text + line.substring(position.column);
      
      return {
        row: position.row,
        column: position.column+text.length
      }
    }
    else
    {
      var line = this.lines[position.row] || "";
      
      this.lines[position.row] = line.substring(0, position.column) + newLines[0];
      this.lines[position.row+1] = newLines[newLines.length-1] + line.substring(position.column);
      
      if (newLines.length > 2) 
      {
        var args = [position.row + 1, 0]
        args.push.apply(args, newLines.slice(1, -1));
        this.lines.splice.apply(this.lines, args);
      }
      
      return {
        row: position.row + newLines.length - 1,
        column: newLines[newLines.length-1].length
      };
    }
  },
  
  getTextRange : function(range)
  {
    if (range.start.row == range.end.row) {
      return this.lines[range.start.row].substring(range.start.column, range.end.column);
    } else {
      return (
        this.lines[range.start.row].substring(range.start.column) +
        this.lines.slice(range.start.row+1, range.end.row+1) + 
        this.lines[range.end.row].substring(0, range.end.column)
      );
    }
  },
   
  remove : function(range)
  {
    var firstRow = range.start.row;
    var lastRow = range.end.row;
    
    var row = 
      this.lines[firstRow].substring(0, range.start.column) +
      this.lines[lastRow].substring(range.end.column);
    
    this.lines.splice(firstRow, lastRow-firstRow+1, row);
    
    return range.start;
  },
  
  replace : function(range, text)
  {
    this.remove(range);
    if (text) {
      return this.insert(range.start, text);
    } else {
      return range.start;
    }
  }
}