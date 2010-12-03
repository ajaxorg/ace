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
 *   Joe Walker (jwalker@mozilla.com)
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


var test = require('pilot/test/assert').test;
var cli = require('pilot/cli');
var Status = require('pilot/types').Status;
var settings = require('pilot/settings').settings;

exports.testAll = function() {
    exports.testTokenize();
    exports.testSplit();
    exports.testCli();
    return "testAll Completed";
};

exports.testSplit = function() {
    var args = cli._tokenize('s');
    var command = cli._split(args);
    test.verifyEqual(1, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyUndefined(command);

    var args = cli._tokenize('set');
    var command = cli._split(args);
    test.verifyEqual([], args);
    test.verifyEqual('set', command.name);

    var args = cli._tokenize('set a b');
    var command = cli._split(args);
    test.verifyEqual('set', command.name);
    test.verifyEqual(2, args.length);
    test.verifyEqual('a', args[0].text);
    test.verifyEqual('b', args[1].text);

    // TODO: add tests for sub commands
    return "testSplit Completed";
};

exports.testTokenize = function() {
    var args = cli._tokenize('');
    test.verifyEqual(0, args.length);

    args = cli._tokenize('s');
    test.verifyEqual(1, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(1, args[0].end);
    test.verifyEqual('', args[0].priorSpace);

    args = cli._tokenize('s s');
    test.verifyEqual(2, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(1, args[0].end);
    test.verifyEqual('', args[0].priorSpace);
    test.verifyEqual('s', args[1].text);
    test.verifyEqual(2, args[1].start);
    test.verifyEqual(3, args[1].end);
    test.verifyEqual(' ', args[1].priorSpace);

    args = cli._tokenize(' 1234  \'12 34\'');
    test.verifyEqual(2, args.length);
    test.verifyEqual('1234', args[0].text);
    test.verifyEqual(1, args[0].start);
    test.verifyEqual(5, args[0].end);
    test.verifyEqual(' ', args[0].priorSpace);
    test.verifyEqual('12 34', args[1].text);
    test.verifyEqual(8, args[1].start);
    test.verifyEqual(13, args[1].end);
    test.verifyEqual('  ', args[1].priorSpace);

    args = cli._tokenize('12\'34 "12 34" \\'); // 12'34 "12 34" \
    test.verifyEqual(3, args.length);
    test.verifyEqual('12\'34', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(5, args[0].end);
    test.verifyEqual('', args[0].priorSpace);
    test.verifyEqual('12 34', args[1].text);
    test.verifyEqual(7, args[1].start);
    test.verifyEqual(12, args[1].end);
    test.verifyEqual(' ', args[1].priorSpace);
    test.verifyEqual('\\', args[2].text);
    test.verifyEqual(14, args[2].start);
    test.verifyEqual(15, args[2].end);
    test.verifyEqual(' ', args[2].priorSpace);

    args = cli._tokenize('a\\ b \\t\\n\\r \\\'x\\\" \'d'); // a_b \t\n\r \'x\" 'd
    test.verifyEqual(4, args.length);
    test.verifyEqual('a b', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(3, args[0].end);
    test.verifyEqual('', args[0].priorSpace);
    test.verifyEqual('\t\n\r', args[1].text);
    test.verifyEqual(4, args[1].start);
    test.verifyEqual(7, args[1].end);
    test.verifyEqual(' ', args[1].priorSpace);
    test.verifyEqual('\'x"', args[2].text);
    test.verifyEqual(8, args[2].start);
    test.verifyEqual(11, args[2].end);
    test.verifyEqual(' ', args[2].priorSpace);
    test.verifyEqual('d', args[3].text);
    test.verifyEqual(13, args[3].start);
    test.verifyEqual(14, args[3].end);
    test.verifyEqual(' ', args[3].priorSpace);

    return "testTokenize Completed";
};

var hints;
var hint0;
var requisition;
var sel = { start: -1, end: -1 };
var settingAssignment;
var valueAssignment;
mockCliUi = {
    getSelection: function() {
        return sel;
    },

    setHints: function(h) {
        hints = h;
        hint0 = (h.length !== 0) ? h[0] : undefined;

        if (requisition && requisition.command && requisition.command.name === 'set') {
            settingAssignment = requisition.getAssignment('setting');
            valueAssignment = requisition.getAssignment('value');
        }
        else {
            settingAssignment = undefined;
            valueAssignment = undefined;
        }
    },

    setRequisition: function(r) {
        requisition = r;
    }
};

exports.testCli = function() {
    var historyLengthSetting = settings.getSetting('historyLength');

    var input = new cli.Cli(mockCliUi);

    input.parse('');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(0, hint0.end);
    test.verifyNull(requisition.command);

    sel.start = sel.end = 1;
    input.parse('s');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyNotEqual(-1, hint0.message.indexOf('possibilities'));
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(1, hint0.end);
    test.verifyTrue(hint0.predictions.length > 0);
    // This is slightly fragile because it depends on the configuration
    test.verifyTrue(hint0.predictions.length < 20);
    test.verifyNotEqual(-1, hint0.predictions.indexOf('set'));
    test.verifyNull(requisition.command);

    input.parse('set');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(3, hint0.end);
    test.verifyEqual('set', requisition.command.name);

    input.parse('set ');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(0, hint0.start);
    // Technically the command ends at 3, but we're returning 4 currently.
    // This is caused by us using the whole input to determine the length.
    // Maybe one day we should fix this?
    //test.verifyEqual(3, hint0.end);
    test.verifyEqual('set', requisition.command.name);

    sel.start = sel.end = 5;
    input.parse('set h');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyTrue(hint0.predictions.length > 0);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(5, hint0.end);
    test.verifyNotEqual(-1, hint0.predictions.indexOf('historyLength'));
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('h', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    sel.start = sel.end = 16;
    input.parse('set historyLengt');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyEqual(1, hint0.predictions.length);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(16, hint0.end);
    test.verifyEqual('historyLength', hint0.predictions[0]);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    sel.start = sel.end = 1;
    input.parse('set historyLengt');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INVALID, hint0.status);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(16, hint0.end);
    test.verifyEqual(1, hint0.predictions.length);
    test.verifyEqual('historyLength', hint0.predictions[0]);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    sel.start = sel.end = 17;
    input.parse('set historyLengt ');
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INVALID, hint0.status);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(16, hint0.end);
    test.verifyEqual(1, hint0.predictions.length);
    test.verifyEqual('historyLength', hint0.predictions[0]);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    input.parse('set historyLength');
    test.verifyEqual(0, hints.length);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);

    input.parse('set historyLength ');
    test.verifyEqual(0, hints.length);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);

    input.parse('set historyLength 6');
    test.verifyEqual(0, hints.length);
    test.verifyEqual('set', requisition.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);
    test.verifyEqual('6', valueAssignment.arg.text);
    test.verifyEqual(6, valueAssignment.value);
    test.verifyEqual('number', typeof valueAssignment.value);

    // TODO: Add test to see that a command without mandatory param causes INVALID

    console.log(input);

    return "testCli Completed";
};

window.testCli = exports;


});
