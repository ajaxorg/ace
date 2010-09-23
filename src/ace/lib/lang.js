/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/lib/lang", function() {

    var lang = {};

    lang.stringReverse = function(string) {
        return string.split("").reverse().join("");
    };

    if (Array.prototype.indexOf) {
        lang.arrayIndexOf = function(array, searchElement) {
            return array.indexOf(searchElement);
        };
    }
    else {
        lang.arrayIndexOf = function(array, searchElement) {
            for (var i=0; i<array.length; i++) {
                if (array[i] == searchElement) {
                    return i;
                }
            }
            return -1;
        };
    }

    lang.isArray = function(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    };

    lang.copyObject = function(obj) {
        var copy = {};
        for (var key in obj) {
            copy[key] = obj[key];
        }
        return copy;
    };

    lang.arrayToMap = function(arr) {
        var map = {};
        for (var i=0; i<arr.length; i++) {
            map[arr[i]] = 1;
        }
        return map;

    };

    lang.escapeRegExp = function(str) {
        return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    lang.bind = function(fcn, context) {
        return function() {
            return fcn.apply(context, arguments);
        };
    };

    lang.deferredCall = function(fcn) {

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

          call: function() {
              lang.cancel();
              fcn();
          },

          cancel: function() {
              clearTimeout(timer);
              timer = null;
          }
      };
    };

    return lang;
});
