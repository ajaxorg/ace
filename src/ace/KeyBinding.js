/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/KeyBinding",
    ["ace/ace",
     "ace/conf/keybindings/default_mac",
     "ace/conf/keybindings/default_win",
     "ace/PluginManager",
     "ace/commands/DefaultCommands"],
    function(ace, default_mac, default_win, PluginManager) {

var KeyBinding = function(element, editor, config) {
    this.setConfig(config);

    var _self = this;
    ace.addKeyListener(element, function(e) {
        var hashId = 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0)
            | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
        var key = _self.keyNames[e.keyCode];

        var commandName = (_self.config.reverse[hashId] || {})[(key
            || String.fromCharCode(e.keyCode)).toLowerCase()];
        var command = PluginManager.commands[commandName];

        if (command) {
            command(editor, editor.getSelection());
            return ace.stopEvent(e);
        }
    });
};

(function() {
    this.keyMods = {"ctrl": 1, "alt": 2, "option" : 2, "shift": 4, "meta": 8, "command": 8};

    this.keyNames = {
        "8"  : "Backspace",
        "9"  : "Tab",
        "13" : "Enter",
        "27" : "Esc",
        "32" : "Space",
        "33" : "PageUp",
        "34" : "PageDown",
        "35" : "End",
        "36" : "Home",
        "37" : "Left",
        "38" : "Up",
        "39" : "Right",
        "40" : "Down",
        "45" : "Insert",
        "46" : "Delete",
        "107": "+",
        "112": "F1",
        "113": "F2",
        "114": "F3",
        "115": "F4",
        "116": "F5",
        "117": "F6",
        "118": "F7",
        "119": "F8",
        "120": "F9",
        "121": "F10",
        "122": "F11",
        "123": "F12"
    };

    function splitSafe(s, separator, limit, bLowerCase) {
        return (bLowerCase && s.toLowerCase() || s)
            .replace(/(?:^\s+|\n|\s+$)/g, "")
            .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
    }

    function parseKeys(keys, val, ret) {
        var key,
            hashId = 0,
            parts  = splitSafe(keys, "\\-", null, true),
            i      = 0,
            l      = parts.length;

        for (; i < l; ++i) {
            if (this.keyMods[parts[i]])
                hashId = hashId | this.keyMods[parts[i]];
            else
                key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
        }

        (ret[hashId] || (ret[hashId] = {}))[key] = val;
        return ret;
    }

    function objectReverse(obj, keySplit) {
        var i, j, l, key,
            ret = {};
        for (i in obj) {
            key = obj[i];
            if (keySplit && typeof key == "string") {
                key = key.split(keySplit);
                for (j = 0, l = key.length; j < l; ++j)
                    parseKeys.call(this, key[j], i, ret);
            }
            else {
                parseKeys.call(this, key, i, ret);
            }
        }
        return ret;
    }

    this.setConfig = function(config) {
        this.config = config || (ace.isMac
            ? default_mac
            : default_win);
        if (typeof this.config.reverse == "undefined")
            this.config.reverse = objectReverse.call(this, this.config, "|");
    };

}).call(KeyBinding.prototype);

return KeyBinding;
});
