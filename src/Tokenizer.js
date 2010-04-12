
function Tokenizer(rules)
{
  this.rules = rules;
  
  this.regExps = {};
  for (var key in this.rules)
  {
    var state = this.rules[key];
    var ruleRegExps = [];
    
    for (var i=0; i < state.length; i++) {
      ruleRegExps.push(state[i].regex);
    };
    
    this.regExps[key] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g");
  }
};

Tokenizer.prototype.getLineTokens = function(line, startState)
{
  var currentState = startState;
  var state = this.rules[currentState];  
  var re = this.regExps[currentState];
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
          var state = this.rules[currentState];  
          var lastIndex = re.lastIndex;
          
          var re = this.regExps[currentState];
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