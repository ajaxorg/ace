var path = require("path");
var currentModule, defaultCompile = module.constructor.prototype._compile;
//console.log(module.id);

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
    if (currentModule == null) {
      throw new Error("define() may only be called during module factory instantiation");
    }
    
    var module = currentModule;

    var req = function(relativeId) {
        if (relativeId.charAt(0) === '.') {
            var  rootPath       = path.dirname(path.dirname(requireModule.filename)) + "/",
                 absolutePath   = path.dirname(module.filename) + "/" + relativeId;
                 
            relativeId = "../" + absolutePath.match(new RegExp(rootPath + "(.*)"))[1];
        }

        return require(relativeId);
    };
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
    injects.unshift("require", "exports", "module");
    
    id = module.id;
    if (typeof factory !== "function"){
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
    if(returned){
      // since AMD encapsulates a function/callback, it can allow the factory to return the exports.
      module.exports = returned;
    }
};
