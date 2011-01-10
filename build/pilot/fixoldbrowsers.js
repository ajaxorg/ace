define(function(require, exports) {
  if(!Array.isArray) {
    Array.isArray = function(data) {
      return data && Object.prototype.toString.call(data) === "[object Array]"
    }
  }if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t = Object(this);
      var len = t.length >>> 0;
      if(len === 0) {
        return-1
      }var n = 0;
      if(arguments.length > 0) {
        n = Number(arguments[1]);
        if(n !== n) {
          n = 0
        }else {
          if(n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n))
          }
        }
      }if(n >= len) {
        return-1
      }var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for(;k < len;k++) {
        if(k in t && t[k] === searchElement) {
          return k
        }
      }return-1
    }
  }if(!Array.prototype.map) {
    Array.prototype.map = function(fun, JSCompiler_OptimizeArgumentsArray_p0) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t$$1 = Object(this);
      var len$$1 = t$$1.length >>> 0;
      if(typeof fun !== "function") {
        throw new TypeError;
      }res = new Array(len$$1);
      var thisp = JSCompiler_OptimizeArgumentsArray_p0;
      var i = 0;
      for(;i < len$$1;i++) {
        if(i in t$$1) {
          res[i] = fun.call(thisp, t$$1[i], i, t$$1)
        }
      }return res
    }
  }if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun$$1, JSCompiler_OptimizeArgumentsArray_p1) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t$$2 = Object(this);
      var len$$2 = t$$2.length >>> 0;
      if(typeof fun$$1 !== "function") {
        throw new TypeError;
      }var thisp$$1 = JSCompiler_OptimizeArgumentsArray_p1;
      var i$$1 = 0;
      for(;i$$1 < len$$2;i$$1++) {
        i$$1 in t$$2 && fun$$1.call(thisp$$1, t$$2[i$$1], i$$1, t$$2)
      }
    }
  }if(!Object.keys) {
    Object.keys = function(obj) {
      var k$$1;
      var ret = [];
      for(k$$1 in obj) {
        obj.hasOwnProperty(k$$1) && ret.push(k$$1)
      }return ret
    }
  }if(!Function.prototype.bind) {
    Function.prototype.bind = function(obj$$1) {
      var slice = [].slice;
      var args = slice.call(arguments, 1);
      var self = this;
      var nop = function() {
      };
      var bound = arguments.length == 1 ? function() {
        return self.apply(this instanceof nop ? this : obj$$1, arguments)
      } : function() {
        return self.apply(this instanceof nop ? this : obj$$1 || {}, args.concat(slice.call(arguments)))
      };
      nop.prototype = self.prototype;
      bound.prototype = new nop;
      bound.name = this.name;
      bound.displayName = this.displayName;
      bound.length = this.length;
      bound.unbound = self;
      return bound
    }
  }if(!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
  }exports.globalsLoaded = true
});