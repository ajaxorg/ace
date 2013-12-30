/**
 * Cloud9 Language Foundation
 *
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
define(function(require, exports, module) {

var completeUtil = require("./complete_util");
var Utils = require('./utils').Utils;

var uriRegex = /[a-zA-Z_0-9\/\.:\-#]/;

var char = "-._A-Za-z0-9:\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02ff\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203f\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
var nameChar = "[" + char + "]";
var varChar = "[" + char + "\\$]";
var nameCharRegExp = new RegExp(nameChar);
var varCharRegExp = new RegExp(varChar);

var varDeclLabels = {
  "LetBinding": "Let binding",
  "Param": "Function parameter",
  "QuantifiedExpr": "Quantified expression binding",
  "VarDeclStatement": "Local variable",
  "ForBinding": "For binding",
  "TumblingWindowClause": "Tumbling window binding",
  "WindowVars": "Window variable",
  "SlidingWindowClause": "Sliding window binding",
  "PositionalVar": "Positional variable",
  "CurrentItem": "Current item",
  "PreviousItem": "Previous item",
  "NextItem": "Next item",
  "CountClause": "Count binding",
  "GroupingVariable": "Grouping variable",
  "VarDecl": "Module variable"
};

function completeURI(line, pos, builtin) {
    var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column, uriRegex);
    var matches = completeUtil.findCompletions(identifier, Object.keys(builtin));
    return matches.map(function(uri) {
      var module = builtin[uri];
      return {
          doc: module.doc,
          docUrl: "http://www.zorba-xquery.com/html/xqdoc/" + uri.substring(7).replace(/\//g, "_") + ".html",
          icon: "package",
          isFunction: false,
          name: uri,
          priority: 4,
          replaceText: uri,
          identifierRegex: uriRegex,
          
          score: 4,
          value: uri,
          meta: "package"
      };
    });
};


function completeSchemaURI(line, pos, builtin) {
    var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column, uriRegex);
    var matches = completeUtil.findCompletions(identifier, Object.keys(builtin));
    return matches.map(function(uri) {
      var module = builtin[uri];
      return {
          doc: module.doc,
//          docUrl: module.docUrl,
          icon: "package",
          isFunction: false,
          name: uri,
          priority: 4,
          replaceText: uri,
          identifierRegex: uriRegex
      };
    });
};

function completePath(line, pos, paths) {
    var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column, uriRegex);
    var matches = completeUtil.findCompletions(identifier, paths);
    return matches.map(function(uri) {
      return {
          icon: "package",
          isFunction: false,
          name: uri,
          priority: 4,
          replaceText: uri,
          identifierRegex: uriRegex
      };
    });
};

function completeVariable(identifier, pos, builtin, ast) {
  var sctx = Utils.findNode(ast.sctx, { line: pos.row, col: pos.column - 2 });
  if(sctx !== null) {
    var decls = sctx.getVarDecls();
    //console.log(decls);
    var names = Object.keys(decls);
    var matches = completeUtil.findCompletions(identifier, names);
    var match = function(name) {
        return {
            doc: "<p>" +  varDeclLabels[decls[name].kind] + ".</p>",
            icon: "property",
            isFunction: false,
            name: "$" + name,
            priority: 4,
            replaceText: "$" + name,
            identifierRegex: varCharRegExp
        };
    };
    //if(matches.length === 0) {
    //    return names.map(match);
    //} else {
      return matches.map(match);
    //}
  }
};

function completeNSFunctions(pfx, local, pos, builtin, ast) {
    var sctx = ast.sctx;
    var ns = sctx.namespaces[pfx];
    //console.log(ns);
    var names = Object.keys(builtin[ns].functions);
    for(var i in names) {
        names[i] = pfx + ":" + names[i].substring(names[i].indexOf(":")+1);
    }
    var matches = completeUtil.findCompletions(pfx+":"+local, names);
    return matches.map(function(name) {
      //console.log("Name:" + name);
      //TODO support multiple arities
      //var lpfx = name.substring(0, name.indexOf(":"));
      var flocal = name.substring(name.indexOf(":") + 1);
      //console.log(local);
      var fn = builtin[ns].functions[flocal][0];
      var args = "(" +  fn.params.join(", ") + ")";
      return {
          doc: fn.doc,
          docUrl: fn.docUrl,
          icon: "method",
          isFunction: true,
          name: name + args,
          priority: 4,
          replaceText: name.substring((pfx + ":" + local).length) + args,
          identifierRegex: nameCharRegExp
      };
    });
}

function completeDefaultFunctions(identifier, pos, builtin, ast) {
    var namespaces = Object.keys(ast.sctx.declaredNS);
    var matches = completeUtil.findCompletions(identifier, namespaces);
    var results = matches.map(function(name) {
    var ns = ast.sctx.declaredNS[name].ns;
      return {
          doc: builtin[ns] ? builtin[ns].doc : undefined,
          docUrl: "http://www.zorba-xquery.com/html/view-module?ns=" + encodeURIComponent(ns),
          icon: "property",
          isFunction: false,
          name: name + ":" + " (" + ns + ")",
          priority: 5,
          replaceText:  name + ":",
          identifierRegex: nameCharRegExp
      };
    });
    
    var sctx = ast.sctx;
    var ns = sctx.defaultFnNs;
    var matches = completeUtil.findCompletions(identifier, Object.keys(builtin[ns].functions));
    results = results.concat(matches.map(function(name) {
      //TODO: support multiple arities
      var fn = builtin[ns].functions[name][0];
      var args = "(" +  fn.params.join(", ") + ")";
      return {
          doc: fn.doc,
          docUrl: fn.docUrl,
          icon: "method",
          isFunction: true,
          name: name + args,
          priority: 4,
          replaceText:  name + args,
          identifierRegex: nameCharRegExp
      };
    }));
    
    return results;
}

function completeFunction(identifier, pos, builtin, sctx) {
  var markers = [];
  var pfx = identifier.substring(0, identifier.indexOf(":"));
  var local = identifier.substring(identifier.indexOf(":") + 1);
  
  //console.log("Prefix" + pfx);
  //console.log("Local: " + local);
  if(pfx === "") {
    return completeDefaultFunctions(identifier, pos, builtin, sctx);
  } else {
    return completeNSFunctions(pfx, local, pos, builtin, sctx);
  }
  return markers;
};

function completeExpr(line, pos, builtin, sctx) {
  var markers = [];
  var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column, nameCharRegExp);
  var before = line.substring(0, pos.column - (identifier.length === 0 ? 0 : identifier.length));
  var isVar = before[before.length - 1] === "$";
  console.log(before);
  console.log("ID " + identifier);
  console.log(isVar);
  if(isVar) {
    markers = completeVariable(identifier, pos, builtin, sctx);
  } else {
    markers = completeFunction(identifier, pos, builtin, sctx);
  }
  return markers;
};

module.exports.completeURI = completeURI;
module.exports.completeSchemaURI = completeSchemaURI;
module.exports.completePath = completePath;
module.exports.completeExpr = completeExpr;
module.exports.completeVariable = completeVariable;
module.exports.completeFunction = completeFunction;

});

