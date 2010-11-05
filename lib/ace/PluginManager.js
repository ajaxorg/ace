/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
define(function(require, exports, module) {

var PluginManager = {
    commands : {},

    registerCommand : function(name, command) {
        this.commands[name] = command;
    }
};

return PluginManager;
});