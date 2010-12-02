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

exports.testAll = function() {
    exports.testTokenize();
    exports.testSplit();
    exports.testInput();
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

exports.testInput = function() {
    var input = new cli.Input();
    input.parse('');

    test.verifyEqual(1, input.hints.length);
    test.verifyEqual(Status.INCOMPLETE, input.hints[0].status);
    test.verifyNull(input.requisition.command);

    input.parse('s');
    test.verifyEqual(1, input.hints.length);
    test.verifyEqual(Status.INCOMPLETE, input.hints[0].status);
    test.verifyNotEqual(-1, input.hints[0].message.indexOf('possibilities'));
    test.verifyTrue(input.hints[0].predictions.length > 0);
    // This is slightly fragile because it depends on the configuration
    test.verifyTrue(input.hints[0].predictions.length < 20);
    test.verifyNotEqual(-1, input.hints[0].predictions.indexOf('set'));
    test.verifyNull(input.requisition.command);

    input.parse('set');
    test.verifyEqual(1, input.hints.length);
    test.verifyEqual('set', input.requisition.command.name);

    input.parse('set ');
    test.verifyEqual(1, input.hints.length);
    test.verifyEqual('set', input.requisition.command.name);

    input.parse('set h');
console.log(input);
    test.verifyEqual(1, input.hints.length);
    test.verifyEqual(Status.INCOMPLETE, input.hints[0].status);
    test.verifyEqual('set', input.requisition.command.name);
    test.verifyEqual('h', input.requisition.getAssignment('setting').text);
    test.verifyEqual(undefined, input.requisition.getAssignment('setting').value);

    return "testInput Completed";
};

window.testCli = exports;


});
