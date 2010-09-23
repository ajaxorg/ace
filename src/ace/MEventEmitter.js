/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/MEventEmitter", ["ace/lib/lang"], function(lang) {

    var MEventEmitter = {}

    MEventEmitter.$dispatchEvent = function(eventName, e) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners || !listeners.length) return;

        var e = e || {};
        e.type = eventName;

        for (var i=0; i<listeners.length; i++) {
            listeners[i](e);
        }
    };

    MEventEmitter.addEventListener = function(eventName, callback) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners) {
          var listeners = this.$eventRegistry[eventName] = [];
        }
        if (lang.arrayIndexOf(listeners, callback) == -1) {
            listeners.push(callback);
        }
    };

    MEventEmitter.removeEventListener = function(eventName, callback) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners) {
          return;
        }
        var index = lang.arrayIndexOf(listeners, callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };

    return MEventEmitter;
});
