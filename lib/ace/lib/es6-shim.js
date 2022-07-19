function defineProp(obj, name, val) {
    Object.defineProperty(obj, name, {
      value: val,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  if (!String.prototype.startsWith) {
    defineProp(
      String.prototype,
      "startsWith",
      function (searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
      }
    );
  }
  if (!String.prototype.endsWith) {
    // Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    defineProp(String.prototype, "endsWith", function (searchString, position) {
      var subjectString = this;
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    });
  }
  if (!String.prototype.repeat) {
    defineProp(String.prototype, "repeat", function (count) {
      var result = "";
      var string = this;
      while (count > 0) {
        if (count & 1) result += string;

        if ((count >>= 1)) string += string;
      }
      return result;
    });
  }
  if (!String.prototype.includes) {
    defineProp(String.prototype, "includes", function (str, position) {
      return this.indexOf(str, position) != -1;
    });
  }
  if (!Object.assign) {
    Object.assign = function (target) {
      if (target === undefined || target === null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          Object.keys(source).forEach(function (key) {
            output[key] = source[key];
          });
        }
      }
      return output;
    };
  }
  if (!Object.values) {
    Object.values = function (o) {
      return Object.keys(o).map(function (k) {
        return o[k];
      });
    };
  }
  if (!Array.prototype.find) {
    defineProp(Array.prototype, "find", function (predicate) {
      var len = this.length;
      var thisArg = arguments[1];
      for (var k = 0; k < len; k++) {
        var kValue = this[k];
        if (predicate.call(thisArg, kValue, k, this)) {
          return kValue;
        }
      }
    });
  }
  if (!Array.prototype.findIndex) {
    defineProp(Array.prototype, "findIndex", function (predicate) {
      var len = this.length;
      var thisArg = arguments[1];
      for (var k = 0; k < len; k++) {
        var kValue = this[k];
        if (predicate.call(thisArg, kValue, k, this)) {
          return k;
        }
      }
    });
  }
  if (!Array.prototype.includes) {
    defineProp(Array.prototype, "includes", function (item, position) {
      return this.indexOf(item, position) != -1;
    });
  }
  if (!Array.prototype.fill) {
    defineProp(Array.prototype, "fill", function (value) {
      var O = this;
      var len = O.length >>> 0;
      var start = arguments[1];
      var relativeStart = start >> 0;
      var k =
        relativeStart < 0
          ? Math.max(len + relativeStart, 0)
          : Math.min(relativeStart, len);
      var end = arguments[2];
      var relativeEnd = end === undefined ? len : end >> 0;
      var final =
        relativeEnd < 0
          ? Math.max(len + relativeEnd, 0)
          : Math.min(relativeEnd, len);
      while (k < final) {
        O[k] = value;
        k++;
      }
      return O;
    });
  }
  if (!Array.of) {
    defineProp(Array, "of", function () {
      return Array.prototype.slice.call(arguments);
    });
  }
