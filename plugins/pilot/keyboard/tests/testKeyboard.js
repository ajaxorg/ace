require.def(['require', 'exports', 'module',
    'keyboard/keyboard',
    'keyboard/tests/plugindev'
], function(require, exports, module,
    keyboard,
    t
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




exports.testKeyMatching = function() {
    var km = keyboard.keyboardManager;
    var command = {};
    t.equal(km._commandMatches(command, 'meta_z', {}), false,
        'no keymapping means false');

    command = {
        key: 'meta_z'
    };
    t.equal(km._commandMatches(command, 'meta_z', {}), true,
        'matching keys, simple string');
    t.equal(km._commandMatches(command, 'meta_a', {}), false,
        'not matching key, simple string');

    command = {
        key: {key: 'meta_z', predicates: {isGreen: true}}
    };
    t.equal(km._commandMatches(command, 'meta_z', {}), false,
        'object with not matching predicate');
    t.equal(km._commandMatches(command, 'meta_z', {isGreen: true}), true,
        'object with matching key and predicate');
    t.equal(km._commandMatches(command, 'meta_a', {isGreen: true}), false,
        'object with not matching key');
    t.equal(km._commandMatches(command, 'meta_a', {isGreen: false}), false,
        'object with neither matching');
    t.equal(km._commandMatches(command, 'meta_z', {isGreen: false}), false,
        'object with matching key and but different predicate');

    command = {
        key: ['meta_b', {key: 'meta_z', predicates: {isGreen: true}},
            {key: 'meta_c'}]
    };
    t.equal(km._commandMatches(command, 'meta_z', {}), false,
        'list: object with not matching predicate');
    t.equal(km._commandMatches(command, 'meta_z', {isGreen: true}), true,
        'list: object with matching key and predicate');
    t.equal(km._commandMatches(command, 'meta_a', {isGreen: true}), false,
        'list: object with not matching key');
    t.equal(km._commandMatches(command, 'meta_a', {isGreen: false}), false,
        'list: object with neither matching');
    t.equal(km._commandMatches(command, 'meta_z', {isGreen: false}), false,
        'list: object with matching key and but different predicate');
    t.equal(km._commandMatches(command, 'meta_b'), true,
        'list: simple key match');
    t.equal(km._commandMatches(command, 'meta_c'), true,
        'list: object without predicate match');
    t.equal(km._commandMatches(command, 'meta_c', {isGreen: false}), true,
        'list: flags don\'t matter without predicates');
};

});
