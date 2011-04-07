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


var gcli = require('gcli/index');

var pref = {
    metadata: {
        description: 'Commands for managing preferences'
    },

    showMetadata: {
        description: 'Show preferences',
        params: [
            {
                name: 'filter',
                type: 'string',
                description: 'Regex filter to show only some settings',
                defaultValue: null
            }
        ]
    },
    show: function(filter) {
        var names = gcli.getEnvironment().settings.getSettingNames();
        // first sort the settingsList based on the name
        names.sort(function(name1, name2) {
            return name1.localeCompare(name2);
        });

        if (filter) {
            filter = new RegExp(filter);
        }

        var html = '';
        names.forEach(function(name) {
            if (filter && !filter.test(name)) {
                return;
            }

            var setting = gcli.getEnvironment().settings.getSetting(name);
            var url = 'https://wiki.mozilla.org/Labs/Skywriter/Settings#' +
                    setting.name;
            html += '<a class="setting" href="' + url +
                    '" title="View external documentation on setting: ' +
                    setting.name +
                    '" target="_blank">' +
                    setting.name +
                    '</a> = ' +
                    setting.value +
                    '<br/>';
        });

        gcli.getRequest().done(html);
    },

    setMetadata: {
        description: 'Alter current settings',
        params: [
            {
                name: 'setting',
                type: 'setting',
                description: 'The name of the setting to display or alter'
            },
            {
                name: 'value',
                type: 'settingValue',
                description: 'The new value for the chosen setting'
            }
        ]
    },
    set: function(setting, value) {
        setting.set(value);
        gcli.getRequest().done('Setting: <strong>' + setting.name +
            '</strong> = ' + setting.get());
    },

    resetMetadata: {
        description: 'Reset a preference to it\'s default values',
        params: [
            {
                name: 'setting',
                type: 'setting',
                description: 'The name of the setting to return to defaults'
            }
        ]
    },
    reset: function(setting) {
        setting.reset();
        request.done('Reset ' + setting.name + ' to default: ' + setting.value);
    }
};


exports.startup = function() {
    gcli.addCommands(pref, 'pref');
};

exports.shutdown = function() {
    gcli.removeCommands(pref, 'pref');
};


});
