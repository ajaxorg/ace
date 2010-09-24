/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/ace", [
        "ace/lib/core",
        "ace/lib/dom",
        "ace/lib/event",
        "ace/lib/lang",
        "ace/lib/oop"
    ], function(core, dom, evt, lang, oop) {

    var ace = {};

    oop.mixin(ace, core);
    oop.mixin(ace, dom);
    oop.mixin(ace, evt);
    oop.mixin(ace, lang);
    oop.mixin(ace, oop);

    return ace;
});