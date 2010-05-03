(function() {

    this.stringReverse = function(string) {
        return string.split("").reverse().join("");
    };

    if (Array.prototype.indexOf) {
        this.arrayIndexOf = function(array, searchElement) {
            return array.indexOf(searchElement);
        };
    }
    else {
        this.arrayIndexOf = function(array, searchElement) {
            for (var i=0; i<array.length; i++) {
                if (array[i] == searchElement) {
                    return i;
                }
            }
            return -1;
        };
    }

    this.isArray = function(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    };

    this.copyObject = function(obj) {
        var copy = {};
        for (var key in obj) {
            copy[key] = obj[key];
        }
        return copy;
    };

    this.escapeRegExp = function(str) {
        return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    this.bind = function(fcn, context) {
        return function() {
            return fcn.apply(context, arguments);
        };
    };

    this.deferredCall = function(fcn) {

        var timer = null;
        var callback = function() {
            timer = null;
            fcn();
        };

        return {
          schedule: function() {
            if (!timer) {
                timer = setTimeout(callback, 0);
            }
          },

          cancel: function() {
              clearTimeout(timer);
              timer = null;
          }
      };
    };

}).call(ace);