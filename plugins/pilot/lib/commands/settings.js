/* ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Skywriter Team (skywriter@mozilla.com)
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

define(function(require, exports, module) {

/**
 * Something of a hack to allow the set command to give a clearer definition
 * of the type to the command line.
 */
var valueDeferredType = {
    name: "deferred",
    undeferType: function(typeSpec, env) {
        var assignments = typeSpec.assignments;
        var replacement = 'text';

        if (assignments) {
            // Find the assignment for 'setting' so we can get it's value
            var settingAssignment = null;
            assignments.forEach(function(assignment) {
                if (assignment.param.name === 'setting') {
                    settingAssignment = assignment;
                }
            });

            if (settingAssignment) {
                var settingName = settingAssignment.value;
                if (settingName && settingName !== '') {
                    var settingExt = settings[settingName];
                    if (settingExt) {
                        replacement = settingExt.type;
                    }
                }
            }
        }

        return replacement;
    }
};

var setCommandSpec = {
    name: "set",
    params: [
        {
            name: "setting",
            type: {
                name: "selection",
                getOptions: function(env) {
                    return env.settings.getSettingNames();
                }
            },
            description: "The name of the setting to display or alter",
            defaultValue: null
        },
        {
            name: "value",
            type: valueDeferredType,
            description: "The new value for the chosen setting",
            defaultValue: null
        }
    ],
    description: "define and show settings",
    exec: function(env, args, request) {
        var html;
        if (!args.setting) {
            var settingsList = env.settings._list();
            html = '';
            // first sort the settingsList based on the key
            settingsList.sort(function(a, b) {
                if (a.key < b.key) {
                    return -1;
                } else if (a.key == b.key) {
                    return 0;
                } else {
                    return 1;
                }
            });
            var url = "https://wiki.mozilla.org/Labs/Skywriter/Settings#" +
                    setting.key;
            settingsList.forEach(function(setting) {
                html += '<a class="setting" href="' + url +
                        '" title="View external documentation on setting: ' +
                        setting.key +
                        '" target="_blank">' +
                        setting.key +
                        '</a> = ' +
                        setting.value +
                        '<br/>';
            });
        } else {
            if (args.value === undefined) {
                html = '<strong>' + args.setting + '</strong> = ' +
                        env.settings.get(args.setting);
            } else {
                html = 'Setting: <strong>' + args.setting + '</strong> = ' +
                        args.value;
                env.settings.set(args.setting, args.value);
            }
        }
        request.done(html);
    }
};

var unsetCommandSpec = {
    name: "unset",
    params: [
        {
            name: "setting",
            type: {
                name: "selection",
                pointer: "settings:index#getSettings"
            },
            description: "The name of the setting to return to defaults"
        }
    ],
    description: "unset a setting entirely",
    exec: function(env, args, request) {
        env.settings.resetValue(args.setting);
        request.done('Reset ' + args.setting + ' to default: ' +
                env.settings.get(args.setting));
    }
};

var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(setCommandSpec);
    canon.addCommand(unsetCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(setCommandSpec);
    canon.removeCommand(unsetCommandSpec);
};


});
