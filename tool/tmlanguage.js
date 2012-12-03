var fs = require("fs"); 
var util = require("util");

// for tracking token states
var startState = { start: [] }, statesObj = { };


var args = process.argv.splice(2);
var tmLanguageFile  = args[0];
var devMode         = args[1];

var parseString = require("plist").parseString;
function parseLanguage(languageXml, callback) {
  parseString(languageXml, function(_, language) {
    callback(language[0])
  });
}

function logDebug(string, obj) {
  console.log(string, obj);
}

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

String.prototype.replaceAt = function (index, char) {
  return this.substr(0, index) + char + this.substr(index + 1);
}

function keyCount(obj) {
  return Object.keys(obj).length;
}

/**

Scrubbing is sometimes necessary, but there appears to be no
automated way to do it...


function cleanSingleCapture(match) {
  // if there's a single "( )", screw that and make it "(?: )"
  return match.replace("(", "(?:");
}

function cleanMultiCapture(match) {
  // regexp will be a quoted string, so turn "\" into "\\"
  var spaceFinderRegExp = new RegExp("\\\\s.| .", "g");
  var m;
  /* 
   essentially turns things like
   
    \\s*(mixin) ([\\w\\-]+)\\s*(\\()
   
   into
   
   (\\s*mixin)( [\\w\\-]+)(\\s*\\()
   
   so that mode parser stops complaining
  
  while ((m = spaceFinderRegExp.exec(match)) != null) {
    var idx = m.index;
    var nextParenIdx = match.indexOf("(", idx);

    if (nextParenIdx > idx) {
      match = match.splice(idx, 0, "(").replaceAt(nextParenIdx + 1, '');
    }
  }

  //console.log("match", match);
  return match;
}
*/

// stupid yet necessary function, to transform JSON id comments into real comments
function restoreComments(objStr) {
  return objStr.replace(/"\s+(\/\/.+)",/g, "\$1").replace(/ \/\/ ERROR/g, '", // ERROR');
}

function checkForLookBehind(str) {
  var lookbehindRegExp = new RegExp("\\?<[=|!]", "g");
  return lookbehindRegExp.test(str) ? str + " // ERROR: This contains a lookbehind, which JS does not support :(" : str;
}

function removeXFlag(str) {
  if (str.slice(0,4) == "(?x)") {
    str = str.replace(/\\.|\[([^\]\\]|\\.)*?\]|\s+|(?:#[^\n]*)/g, function(s) {
      if (s[0] == "[")
        return s;
      if (s[0] == "\\")
        return /[#\s]/.test(s[1]) ? s[1] : s;
      return "";
    });
  }
  return str;
}

function transformRegExp(str) {
  str = removeXFlag(str);
  str = checkForLookBehind(str);
  return str;
}

function assembleStateObjs(strState, pattern) {
  var patterns = pattern.patterns;
  var stateObj = {};
  var tokenElem = [];
  
  if (patterns) {
    for (var p in patterns) {
      stateObj = {}; // this is apparently necessary

      if (patterns[p].include) {
        stateObj.include = patterns[p].include;
      }
      else {
        stateObj.token = patterns[p].name;
        stateObj.regex = transformRegExp(patterns[p].match);
      }
      statesObj[strState].push(stateObj);
    }

    stateObj = {};
    stateObj.token = "TODO";
    stateObj.regex = transformRegExp(pattern.end);
    stateObj.next = "start";
  }
  else {
    stateObj.token = "TODO";
    stateObj.regex = transformRegExp(pattern.end);
    stateObj.next = "start";

    statesObj[strState].push(stateObj);

    stateObj = {};
    stateObj.token = "TODO";
    stateObj.regex = ".+";
    stateObj.next = strState;
  }

  return stateObj;
}

function extractPatterns(patterns) {
  var state = 0;
  patterns.forEach(function(pattern) {
    state++;
    var i = 1;
    var tokenArray = [];
    var tokenObj = { token: [] };
    var stateObj = {};

    if (pattern.comment) {
      startState.start.push("          // " + pattern.comment.trim());
    }

    // it needs a state transition
    if (pattern.begin && pattern.end) {
      var strState = "state_" + state;
      if ( pattern.beginCaptures === undefined && pattern.endCaptures === undefined) {
        tokenObj.token.push(pattern.captures);
      }
      else if (pattern.beginCaptures) {
        tokenObj.token.push(pattern.beginCaptures);
      }
      else if (pattern.endCaptures) {
        tokenObj.token.push(pattern.endCaptures);
      }

      if (tokenObj.token === undefined) {
        if (pattern.name)
          tokenObj.token.push(pattern.name);
        else 
          logDebug("There's no token name for this state transition", pattern)
      }

      if (tokenObj.token === undefined) {
        tokenObj.token.push(pattern.name);
      }

      statesObj[strState] = [ ];
      statesObj[strState].push(assembleStateObjs(strState, pattern));
      
      tokenObj.regex = transformRegExp(pattern.begin);
      tokenObj.next = strState;
    }
    else if( ( pattern.begin || pattern.end ) && !( pattern.begin && pattern.end ) ) {
      logDebug("Somehow, there's pattern.begin or pattern.end--but not both?", pattern);
    }

    else if (pattern.captures) {
      tokenObj.token.push([]);
      tokenObj.token.push(pattern.captures);
      tokenObj.regex = transformRegExp(pattern.match);
    }

    else if (pattern.match) {
      tokenObj.token.push(pattern.name);
      tokenObj.regex = transformRegExp(pattern.match);
    }

    else if (pattern.include) {
      tokenObj.token.push(pattern.include);
      tokenObj.regex = "";
    }

    else {
      tokenObj.token.push("");
      tokenObj.regex = "";
      logDebug("I've gone through every choice, and have no clue what this is:", pattern);
    }

    // sometimes captures have names--not sure when or why
    if (pattern.name) {
      tokenObj.token.push(pattern.name);
    }

    startState.start.push(tokenObj);
  });

  var resultingObj = startState;

  for (var state in statesObj) { 
    resultingObj[state] = statesObj[state]; 
  }

  return restoreComments(JSON.stringify(resultingObj, null, "    "));
}

function fillTemplate(template, replacements) {
    return template.replace(/%(.+?)%/g, function(str, m) {
        return replacements[m] || "";
    });
}

var modeTemplate = fs.readFileSync(__dirname + "/mode.tmpl.js", "utf8");
var modeHighlightTemplate = fs.readFileSync(__dirname + "/mode_highlight_rules.tmpl.js", "utf8");

function convertLanguage(name) {
    var tmLanguage = fs.readFileSync(__dirname + "/" + name, "utf8");
    parseLanguage(tmLanguage, function(language) {
      var languageHighlightFilename = language.name.replace(/[-_]/g, "").toLowerCase();
      var languageNameSanitized = language.name.replace(/-/g, "");
      
      var languageHighlightFile = __dirname + "/../lib/ace/mode/" + languageHighlightFilename + "_highlight_rules.js";
      var languageModeFile = __dirname + "/../lib/ace/mode/" + languageHighlightFilename + ".js";
      
      console.log("Converting " + name + " to " + languageHighlightFile);
      
        if (devMode) {
          console.log(util.inspect(language.patterns, false, 4));
          console.log(util.inspect(language.repository, false, 4));
        }
        
        var languageMode = fillTemplate(modeTemplate, {
              language: languageNameSanitized,
              languageHighlightFilename: languageHighlightFilename
        });

        var patterns = extractPatterns(language.patterns);
        var repository = {};

        if (language.repository) {
          for (var r in language.repository) {
            repository[r] = language.repository[r];
          }
          repository = restoreComments(JSON.stringify(repository, null, "    "));
        }

        var languageHighlightRules = fillTemplate(modeHighlightTemplate, {
              language: languageNameSanitized,
              languageTokens: patterns,
              respositoryRules: "/*** START REPOSITORY RULES\n" + repository + "\nEND REPOSITORY RULES ***/",
              uuid: language.uuid,
              name: name
        });

        if (devMode) {
          console.log(languageMode)
          console.log(languageHighlightRules)
          console.log("Not writing, 'cause we're in dev mode, baby.");
        }
        else {
          fs.writeFileSync(languageHighlightFile, languageHighlightRules);
          fs.writeFileSync(languageModeFile, languageMode);
        }
    });
}

if (tmLanguageFile === undefined) {
  console.error("Please pass in a language file via the command line.");
  process.exit(1);
}
convertLanguage(tmLanguageFile);