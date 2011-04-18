var path = require("path");
var fs = require("fs");
var currentModule
var defaultCompile = module.constructor.prototype._compile;

module.constructor.prototype._compile = function(content, filename){  
  currentModule = this;
  try{
    return defaultCompile.call(this, content, filename);
  }
  finally {
    currentModule = null;
  }
};

var requireModule = module;

global.define = function (id, injects, factory) {

    // infere the module
    var module = currentModule;
    if (!module) {
        module = requireModule;
        while (module.parent)
            module = module.parent;
    }

    // parse arguments
    if (!factory) {
        // two or less arguments
        factory = injects;
        if (factory) {
            // two args
            if (typeof id === "string") {
                if (id !== module.id) {
                    throw new Error("Can not assign module to a different id than the current file");
                }
                // default injects
                injects = [];
            }
            else{
                // anonymous, deps included
                injects = id;          
            }
        }
        else {
            // only one arg, just the factory
            factory = id;
            injects = [];
        }
    }

    var req = function(relativeId, callback) {
        if (Array.isArray(relativeId)) {
            // async require
            return callback.apply(this, relativeId.map(req))
        }
        
        var chunks = relativeId.split("!");
        if (chunks.length >= 2) {
            var prefix = chunks[0];
            relativeId = chunks.slice(1).join("!")
        }
            
        if (relativeId.charAt(0) === '.') {
            var  rootPath       = path.dirname(path.dirname(requireModule.filename)) + "/",
                 absolutePath   = path.dirname(module.filename) + "/" + relativeId;
                 
            relativeId = "../" + absolutePath.match(new RegExp(rootPath + "(.*)"))[1];
        }
        
        if (prefix == "text") {
            return fs.readFileSync(findModulePath(relativeId))
        } else
            return require(relativeId);
    };

    injects.unshift("require", "exports", "module");
    
    id = module.id;
    if (typeof factory !== "function") {
        // we can just provide a plain object
        return module.exports = factory;
    }
    var returned = factory.apply(module.exports, injects.map(function (injection) {
        switch (injection) {
            // check for CommonJS injection variables
            case "require": return req;
            case "exports": return module.exports;
            case "module": return module;
            default:
              // a module dependency
              return req(injection);
        }
    }));
    
    if(returned) {
          // since AMD encapsulates a function/callback, it can allow the factory to return the exports.
          module.exports = returned;
    }
};

// slighly modified version of
// https://github.com/ry/node/blob/1dad95a3a960c645ffec28f9ec023dad6a17c0d4/src/node.js#L159
//
// given a module name, and a list of paths to test, returns the first
// matching file in the following precedence.
//
// require("a.<ext>")
//   -> a.<ext>
//
// require("a")
//   -> a
//   -> a.<ext>
//   -> a/index.<ext>
function findModulePath(request) {
  var fs = require('fs'),
      exts = ["js"],
      paths = ['.'].concat(require.paths)

  paths = request.charAt(0) === '/' ? [''] : paths;

  // check if the file exists and is not a directory
  var tryFile = function(requestPath) {
     try {
        var stats = fs.statSync(requestPath);
      if (stats && !stats.isDirectory()) {
        return requestPath;
      }
    } catch (e) {}
    return false;
  };

  // given a path check a the file exists with any of the set extensions
  var tryExtensions = function(p, extension) {
    for (var i = 0, EL = exts.length; i < EL; i++) {
      f = tryFile(p + exts[i]);
      if (f) { return f; }
    }
    return false;
  };

  // For each path
  for (var i = 0, PL = paths.length; i < PL; i++) {
    var p = paths[i],
        // try to join the request to the path
        f = tryFile(path.join(p, request)) ||
        // try it with each of the extensions
        tryExtensions(path.join(p, request)) ||
        // try it with each of the extensions at "index"
        tryExtensions(path.join(p, request, 'index'));
    if (f) { return f; }
  }
  return false;
}