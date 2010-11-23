require.def(['require', 'exports', 'module',
    'skywriter/plugins',
    'settings/environment',
    'settings/settings'
], function(require, exports, module,
    plugins,
    environment,
    settingsMod
) {

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

var catalog = plugins.catalog;
var env = environment.env;

var settings = settingsMod.settings;

/**
 * 'set' command
 */
exports.setCommand = function(args, request) {
    var html;

    if (!args.setting) {
        var settingsList = settings._list();
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

        settingsList.forEach(function(setting) {
            html += '<a class="setting" href="https://wiki.mozilla.org/Labs/Skywriter/Settings#' +
                    setting.key +
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
            html = '<strong>' + args.setting + '</strong> = ' + settings.get(args.setting);
        } else {
            html = 'Setting: <strong>' + args.setting + '</strong> = ' + args.value;
            settings.set(args.setting, args.value);
        }
    }

    request.done(html);
};

/**
 * 'unset' command
 */
exports.unsetCommand = function(args, request) {
    settings.resetValue(args.setting);
    request.done('Reset ' + args.setting + ' to default: ' + settings.get(args.setting));
};

});
