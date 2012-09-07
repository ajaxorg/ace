var fs = require("fs"); 
var util = require("util");

// for tracking token states
var startState = { start: [] }, statesObj = { };

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
  return objStr.replace(/"\s+(\/\/.+)",/g, "\$1")
}

function assembleStateObjs(strState, pattern) {
  var patterns = pattern.patterns;
  var stateObj = {};

  if (patterns) {
    for (var p in patterns) {
      stateObj = {}; // this is apparently necessary


      if (patterns[p].include) {
        stateObj.include = patterns[p].include;
      }
      else {
        stateObj.token = patterns[p].name;
        stateObj.regex = patterns[p].match;
      }
      statesObj[strState].push(stateObj);
    }

    stateObj = {};
    stateObj.token = "TODO";
    stateObj.regex = pattern.end;
    stateObj.next = "start";
  }
  else {
    stateObj.token = "TODO";
    stateObj.regex = pattern.end;
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
    var tokenObj = {};
    var stateObj = {};

    if (pattern.comment) {
      startState.start.push("          // " + pattern.comment);
    }

    // it needs a state transition
    if (pattern.begin && pattern.end) {
      var strState = "state_" + state;
      if ( pattern.beginCaptures === undefined && pattern.endCaptures === undefined) {
        tokenObj.token = pattern.captures;
      }
      else if (pattern.beginCaptures) {
        tokenObj.token = pattern.beginCaptures;
      }
      else if (pattern.endCaptures) {
        tokenObj.token = pattern.endCaptures;
      }

      statesObj[strState] = [ ];
      statesObj[strState].push(assembleStateObjs(strState, pattern));
      
      tokenObj.regex = pattern.begin;
      tokenObj.next = strState;
      startState.start.push(tokenObj);
    }
    else if( ( pattern.begin || pattern.end ) && !( pattern.begin && pattern.end ) ) {
      logDebug("Somehow, there's pattern.begin or pattern.end--but not both?", pattern);
    }

    else if (pattern.captures) {
      tokenObj.token = pattern.captures;
      tokenObj.regex = pattern.match;

      startState.start.push(tokenObj);
    }

    else if (pattern.match) {
      tokenObj.token = pattern.name;
      tokenObj.regex = pattern.match;

      startState.start.push(tokenObj);
    }
    else {
      logDebug("I've gone through every choice, and have no clue what this is:", pattern);
    }
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

var modeTemplate = fs.readFileSync(__dirname + "/theme_mode.tmpl.js", "utf8");

function convertLanguage(name) {
    var tmLanguage = fs.readFileSync(__dirname + "/" + name, "utf8");
    parseLanguage(tmLanguage, function(language) {
    var outFile = __dirname + "/../lib/ace/mode/" + language.name.replace(/-/g, "_").toLowerCase() + "_highlight_rules.js";
    console.log("Converting " + name + " to " + outFile);
    
      //console.log(util.inspect(language.patterns, false, 4));

      var patterns = extractPatterns(language.patterns);
      var lang = fillTemplate(modeTemplate, {
            language: language.name.replace(/-/g, ""),
            languageTokens: patterns
      });

      fs.writeFileSync(outFile, lang);
    });
}

var tmLanguageFile  = process.argv.splice(2)[0];
convertLanguage(tmLanguageFile);