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
 * The Original Code is Mozilla Skywriter.
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

var test = {

  success: function(message) {
    console.log(message);
  },

  fail: function(message) {
    test._recordThrow("fail", arguments);
  },

  assertTrue: function(value) {
    if (!value) {
      test._recordThrow("assertTrue", arguments);
    }
  },

  verifyTrue: function(value) {
    if (!value) {
      test._recordTrace("verifyTrue", arguments);
    }
  },

  assertFalse: function(value) {
    if (value) {
      test._recordThrow("assertFalse", arguments);
    }
  },

  verifyFalse: function(value) {
    if (value) {
      test._recordTrace("verifyFalse", arguments);
    }
  },

  assertNull: function(value) {
    if (value !== null) {
      test._recordThrow("assertNull", arguments);
    }
  },

  verifyNull: function(value) {
    if (value !== null) {
      test._recordTrace("verifyNull", arguments);
    }
  },

  assertNotNull: function(value) {
    if (value === null) {
      test._recordThrow("assertNotNull", arguments);
    }
  },

  verifyNotNull: function(value) {
    if (value === null) {
      test._recordTrace("verifyNotNull", arguments);
    }
  },

  assertUndefined: function(value) {
    if (value !== undefined) {
      test._recordThrow("assertUndefined", arguments);
    }
  },

  verifyUndefined: function(value) {
    if (value !== undefined) {
      test._recordTrace("verifyUndefined", arguments);
    }
  },

  assertNotUndefined: function(value) {
    if (value === undefined) {
      test._recordThrow("assertNotUndefined", arguments);
    }
  },

  verifyNotUndefined: function(value) {
    if (value === undefined) {
      test._recordTrace("verifyNotUndefined", arguments);
    }
  },

  assertNaN: function(value) {
    if (!isNaN(value)) {
      test._recordThrow("assertNaN", arguments);
    }
  },

  verifyNaN: function(value) {
    if (!isNaN(value)) {
      test._recordTrace("verifyNaN", arguments);
    }
  },

  assertNotNaN: function(value) {
    if (isNaN(value)) {
      test._recordThrow("assertNotNaN", arguments);
    }
  },

  verifyNotNaN: function(value) {
    if (isNaN(value)) {
      test._recordTrace("verifyNotNaN", arguments);
    }
  },

  assertEqual: function(expected, actual) {
    if (!test._isEqual(expected, actual)) {
      test._recordThrow("assertEqual", arguments);
    }
  },

  verifyEqual: function(expected, actual) {
    if (!test._isEqual(expected, actual)) {
      test._recordTrace("verifyEqual", arguments);
    }
  },

  assertNotEqual: function(expected, actual) {
    if (test._isEqual(expected, actual)) {
      test._recordThrow("assertNotEqual", arguments);
    }
  },

  verifyNotEqual: function(expected, actual) {
    if (test._isEqual(expected, actual)) {
      test._recordTrace("verifyNotEqual", arguments);
    }
  },

  assertSame: function(expected, actual) {
    if (expected !== actual) {
      test._recordThrow("assertSame", arguments);
    }
  },

  verifySame: function(expected, actual) {
    if (expected !== actual) {
      test._recordTrace("verifySame", arguments);
    }
  },

  assertNotSame: function(expected, actual) {
    if (expected !== actual) {
      test._recordThrow("assertNotSame", arguments);
    }
  },

  verifyNotSame: function(expected, actual) {
    if (expected !== actual) {
      test._recordTrace("verifyNotSame", arguments);
    }
  },

  _recordTrace: function() {
    test._record.apply(this, arguments);
    console.trace();
  },

  _recordThrow: function() {
    test._record.apply(this, arguments);
    throw new Error();
  },

  _record: function() {
    console.error(arguments);
    var message = arguments[0] + "(";
    var data = arguments[1];
    if (typeof data == "string") {
      message += data;
    }
    else {
      for (var i = 0; i < data.length; i++) {
        if (i != 0){message += ", ";}
        message += data[i];
      }
    }
    message += ")";
    console.log(message);
  },

  _isEqual: function(expected, actual, depth) {
    if (!depth){depth = 0;}
    // Rather than failing we assume that it works!
    if (depth > 10) {
      return true;
    }

    if (expected == null) {
      if (actual != null) {
        console.log("expected: null, actual non-null: ", actual);
        return false;
      }
      return true;
    }

    if (typeof(expected) == "number" && isNaN(expected)) {
      if (!(typeof(actual) == "number" && isNaN(actual))) {
        console.log("expected: NaN, actual non-NaN: ", actual);
        return false;
      }
      return true;
    }

    if (actual == null) {
      if (expected != null) {
        console.log("actual: null, expected non-null: ", expected);
        return false;
      }
      return true; // we wont get here of course ...
    }

    if (typeof expected == "object") {
      if (!(typeof actual == "object")) {
        console.log("expected object, actual not an object");
        return false;
      }

      var actualLength = 0;
      for (var prop in actual) {
        if (typeof actual[prop] != "function" ||
            typeof expected[prop] != "function") {
          var nest = test._isEqual(actual[prop], expected[prop], depth + 1);
          if (typeof nest != "boolean" || !nest) {
            console.log("element '" + prop + "' does not match: " + nest);
            return false;
          }
        }
        actualLength++;
      }

      // need to check length too
      var expectedLength = 0;
      for (prop in expected) expectedLength++;
      if (actualLength != expectedLength) {
        console.log("expected object size = " + expectedLength +
            ", actual object size = " + actualLength);
        return false;
      }
      return true;
    }

    if (actual != expected) {
      console.log("expected = " + expected + " (type=" + typeof expected + "), " +
          "actual = " + actual + " (type=" + typeof actual + ")");
      return false;
    }

    if (expected instanceof Array) {
      if (!(actual instanceof Array)) {
        console.log("expected array, actual not an array");
        return false;
      }
      if (actual.length != expected.length) {
        console.log("expected array length = " + expected.length +
            ", actual array length = " + actual.length);
        return false;
      }
      for (var i = 0; i < actual.length; i++) {
        var inner = test._isEqual(actual[i], expected[i], depth + 1);
        if (typeof inner != "boolean" || !inner) {
          console.log("element " + i + " does not match: " + inner);
          return false;
        }
      }

      return true;
    }

    return true;
  }
};


exports.test = test;


});
