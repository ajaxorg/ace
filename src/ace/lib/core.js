/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/lib/core", function() {

    var core = {};
    var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();

    core.isWin = (os == "win");
    core.isMac = (os == "mac");
    core.isLinux = (os == "linux");
    core.isIE = ! + "\v1";
    core.isGecko = window.controllers && window.navigator.product === "Gecko";

    core.provide = function(namespace) {
        var parts = namespace.split(".");
        var obj = window;
        for (var i=0; i<parts.length; i++) {
            var part = parts[i];
            if (!obj[part]) {
                obj[part] = {};
            }
            obj = obj[part];
        }
    };

    return core;

});