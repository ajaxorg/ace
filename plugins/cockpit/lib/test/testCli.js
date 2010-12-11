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


var test = require('cockpit/test/assert').test;
var Status = require('pilot/types').Status;
var settings = require('pilot/settings').settings;
var tokenize = require('cockpit/cli')._tokenize;
var split = require('cockpit/cli')._split;
var CliRequisition = require('cockpit/cli').CliRequisition;


exports.testAll = function() {
    exports.testTokenize();
    exports.testSplit();
    exports.testCli();
    return "testAll Completed";
};

exports.testTokenize = function() {
    var args = tokenize('');
    test.verifyEqual(0, args.length);

    args = tokenize('s');
    test.verifyEqual(1, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(1, args[0].end);
    test.verifyEqual('', args[0].priorSpace);

    args = tokenize('s s');
    test.verifyEqual(2, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyEqual(0, args[0].start);
    test.verifyEqual(1, args[0].end);
    test.verifyEqual('', args[0].priorSpace);
    test.verifyEqual('s', args[1].text);
    test.verifyEqual(2, args[1].start);
    test.verifyEqual(3, args[1].end);
    test.verifyEqual(' ', args[1].priorSpace);

    args = tokenize(' 1234  \'12 34\'');
    test.verifyEqual(2, args.length);
    test.verifyEqual('1234', args[0].text);
    test.verifyEqual(1, args[0].start);
    test.verifyEqual(5, args[0].end);
    test.verifyEqual(' ', args[0].priorSpace);
    test.verifyEqual('12 34', args[1].text);
    test.verifyEqual(8, args[1].start);
    test.verifyEqual(13, args[1].end);
    test.verifyEqual('  ', args[1].priorSpace);

    args = tokenize('12\'34 "12 34" \\'); // 12'34 "12 34" \
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

    args = tokenize('a\\ b \\t\\n\\r \\\'x\\\" \'d'); // a_b \t\n\r \'x\" 'd
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

exports.testSplit = function() {
    var args = tokenize('s');
    var conversion = split(args);
    test.verifyEqual(1, args.length);
    test.verifyEqual('s', args[0].text);
    test.verifyNull(conversion.value);

    var args = tokenize('set');
    var conversion = split(args);
    test.verifyEqual([], args);
    test.verifyEqual('set', conversion.value.name);

    var args = tokenize('set a b');
    var conversion = split(args);
    test.verifyEqual('set', conversion.value.name);
    test.verifyEqual(2, args.length);
    test.verifyEqual('a', args[0].text);
    test.verifyEqual('b', args[1].text);

    // TODO: add tests for sub commands
    return "testSplit Completed";
};

exports.testCli = function() {
    var hints;
    var hint0;
    var settingAssignment;
    var valueAssignment;
    var cli = new CliRequisition();
    var debug = true;

    function update(input) {
        if (debug) {
            console.log('####### TEST: typed="' + input.typed + '" cursor:', input.cursor);
        }
        cli.update(input);
        hints = cli.getHints();
        hint0 = (hints.length !== 0) ? hints[0] : undefined;
        if (debug) {
            console.log('cli=', cli);
            console.log('hints=', hints);
        }
        if (cli.command && cli.command.name === 'set') {
            settingAssignment = cli.getAssignment('setting');
            valueAssignment = cli.getAssignment('value');
            if (debug) {
                console.log('settingAssignment=', settingAssignment);
                console.log('valueAssignment=', valueAssignment);
            }
        }
        else {
            settingAssignment = undefined;
            valueAssignment = undefined;
        }
    }

    function verifyPredictionsContains(name, predictions) {
        return predictions.every(function(prediction) {
            return name === prediction || name === prediction.name;
        }, this);
    }

    var historyLengthSetting = settings.getSetting('historyLength');

    update({ typed: '', cursor: { start: 0, end: 0 } });
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(0, hint0.end);
    test.verifyNull(cli.command);

    update({ typed: 's', cursor: { start: 1, end: 1 } });
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyNotEqual(-1, hint0.message.indexOf('possibilities'));
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(1, hint0.end);
    test.verifyTrue(hint0.predictions.length > 0);
    // This is slightly fragile because it depends on the configuration
    // TODO: Mock, but first we need a way to have a clear canon.
    test.verifyTrue(hint0.predictions.length < 20);
    verifyPredictionsContains('set', hint0.predictions);
    test.verifyNull(cli.command);

    update({ typed: 'set', cursor: { start: 3, end: 3 } });
    test.verifyEqual(1, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(3, hint0.end);
    test.verifyEqual('set', cli.command.name);

    update({ typed: 'set ', cursor: { start: 4, end: 4 } });
    test.verifyEqual(2, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(4, hint0.end);
    test.verifyEqual(Status.VALID, hints[1].status);
    test.verifyEqual(0, hints[1].start);
    test.verifyEqual(3, hints[1].end);
    test.verifyEqual('set', cli.command.name);

    update({ typed: 'set h', cursor: { start: 5, end: 5 } });
    test.verifyEqual(2, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(5, hint0.end);
    test.verifyTrue(hint0.predictions.length > 0);
    verifyPredictionsContains('historyLength', hint0.predictions);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('h', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    update({ typed: 'set historyLengt', cursor: { start: 16, end: 16 } });
    test.verifyEqual(2, hints.length);
    test.verifyEqual(Status.INCOMPLETE, hint0.status);
    test.verifyEqual(4, hint0.start);
    test.verifyEqual(16, hint0.end);
    test.verifyEqual(1, hint0.predictions.length);
    verifyPredictionsContains('historyLength', hint0.predictions);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    update({ typed: 'set historyLengt', cursor: { start: 1, end: 1 } });
    test.verifyEqual(2, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(0, hint0.start);
    test.verifyEqual(3, hint0.end);
    test.verifyEqual(Status.INVALID, hints[1].status);
    test.verifyEqual(4, hints[1].start);
    test.verifyEqual(16, hints[1].end);
    test.verifyEqual(1, hints[1].predictions.length);
    verifyPredictionsContains('historyLength', hints[1].predictions);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    update({ typed: 'set historyLengt ', cursor: { start: 17, end: 17 } });
    test.verifyEqual(3, hints.length);
    test.verifyEqual(Status.VALID, hint0.status);
    test.verifyEqual(17, hint0.start);
    test.verifyEqual(17, hint0.end);
    test.verifyEqual(Status.INVALID, hints[1].status);
    test.verifyEqual(4, hints[1].start);
    test.verifyEqual(16, hints[1].end);
    test.verifyEqual(1, hints[1].predictions.length);
    verifyPredictionsContains('historyLength', hints[1].predictions);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLengt', settingAssignment.arg.text);
    test.verifyEqual(undefined, settingAssignment.value);

    update({ typed: 'set historyLength', cursor: { start: 17, end: 17 } });
    test.verifyEqual(2, hints.length);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);

    update({ typed: 'set historyLength ', cursor: { start: 18, end: 18 } });
    test.verifyEqual(3, hints.length);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);

    update({ typed: 'set historyLength 6', cursor: { start: 19, end: 19 } });
    test.verifyEqual(3, hints.length);
    test.verifyEqual('set', cli.command.name);
    test.verifyEqual('historyLength', settingAssignment.arg.text);
    test.verifyEqual(historyLengthSetting, settingAssignment.value);
    test.verifyEqual('6', valueAssignment.arg.text);
    test.verifyEqual(6, valueAssignment.value);
    test.verifyEqual('number', typeof valueAssignment.value);

    // TODO: Add test to see that a command without mandatory param causes INVALID

    return "testCli Completed";
};


});
