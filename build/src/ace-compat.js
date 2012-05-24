/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('pilot/index', ['require', 'exports', 'module' , 'pilot/browser_focus', 'pilot/dom', 'pilot/event', 'pilot/event_emitter', 'pilot/fixoldbrowsers', 'pilot/keys', 'pilot/lang', 'pilot/oop', 'pilot/useragent', 'pilot/canon'], function(require, exports, module) {
    require("pilot/browser_focus");
    require("pilot/dom");
    require("pilot/event");
    require("pilot/event_emitter");
    require("pilot/fixoldbrowsers");
    require("pilot/keys");
    require("pilot/lang");
    require("pilot/oop");
    require("pilot/useragent");
    require("pilot/canon");
});

define('pilot/browser_focus', ['require', 'exports', 'module' , 'ace/lib/browser_focus'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/browser_focus' is deprecated. Use 'ace/lib/browser_focus' instead");
    module.exports = require("ace/lib/browser_focus");
});

define('pilot/dom', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/dom' is deprecated. Use 'ace/lib/dom' instead");
    module.exports = require("ace/lib/dom");
});

define('pilot/event', ['require', 'exports', 'module' , 'ace/lib/event'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/event' is deprecated. Use 'ace/lib/event' instead");
    module.exports = require("ace/lib/event");
});

define('pilot/event_emitter', ['require', 'exports', 'module' , 'ace/lib/event_emitter'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/event_emitter' is deprecated. Use 'ace/lib/event_emitter' instead");
    module.exports = require("ace/lib/event_emitter");
});

define('pilot/fixoldbrowsers', ['require', 'exports', 'module' , 'ace/lib/fixoldbrowsers'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/fixoldbrowsers' is deprecated. Use 'ace/lib/fixoldbrowsers' instead");
    module.exports = require("ace/lib/fixoldbrowsers");
});

define('pilot/keys', ['require', 'exports', 'module' , 'ace/lib/keys'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/keys' is deprecated. Use 'ace/lib/keys' instead");
    module.exports = require("ace/lib/keys");
});

define('pilot/lang', ['require', 'exports', 'module' , 'ace/lib/lang'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/lang' is deprecated. Use 'ace/lib/lang' instead");
    module.exports = require("ace/lib/lang");
});

define('pilot/oop', ['require', 'exports', 'module' , 'ace/lib/oop'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/oop' is deprecated. Use 'ace/lib/oop' instead");
    module.exports = require("ace/lib/oop");
});

define('pilot/useragent', ['require', 'exports', 'module' , 'ace/lib/useragent'], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/useragent' is deprecated. Use 'ace/lib/useragent' instead");
    module.exports = require("ace/lib/useragent");
});

define('pilot/canon', ['require', 'exports', 'module' ], function(require, exports, module) {
    console.warn("DEPRECATED: 'pilot/canon' is deprecated.");
    //return require("ace/lib/dom");
    
    exports.addCommand = function() {
        console.warn("DEPRECATED: 'canon.addCommand()' is deprecated. Use 'editor.commands.addCommand(command)' instead.");
        console.trace();
    }
    
    exports.removeCommand = function() {
        console.warn("DEPRECATED: 'canon.removeCommand()' is deprecated. Use 'editor.commands.removeCommand(command)' instead.");
        console.trace();
    }
});
