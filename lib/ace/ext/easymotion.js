/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var Range = require("ace/range").Range;

var findings = {};
var nextId = 0;

// Vimium linkHints functionality borrowed from
// https://github.com/philc/vimium/blob/0bf605a934/content_scripts/link_hints.coffee#L361-L398
function logXOfBase(x, base) {
  return Math.log(x) / Math.log(base);
}

var linkHintCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
                          "o", "u"];

function hintStrings(linkCount) {
  var digitsNeeded = Math.ceil(logXOfBase(linkCount, linkHintCharacters.length));

  var shortHintCount = Math.floor(
    (Math.pow(linkHintCharacters.length, digitsNeeded) - linkCount) /
    linkHintCharacters.length);

  var longHintCount = linkCount - shortHintCount;

  var hintStrings = [];

  if (digitsNeeded > 1) {
    var i;
    for (i = 0; i < shortHintCount; i++) {
      hintStrings.push(numberToHintString(i, linkHintCharacters, digitsNeeded - 1));
    }
  }

  var start = shortHintCount * linkHintCharacters.length;
  var i;
  for (i = 0; i < start + longHintCount; i++) {
    hintStrings.push(numberToHintString(i, linkHintCharacters, digitsNeeded))
  }

  return hintStrings;
}

function numberToHintString(number, characterSet, numHintDigits) {
  numHintDigits = numHintDigits || 0;
  var base = characterSet.length;
  var hintString = [];
  var remainder = 0;

  while (true) {
    remainder = number % base;
    hintString.unshift(characterSet[remainder]);
    number -= remainder;
    number /= Math.floor(base);
    if (number <= 0)
      break;
  }

  var hintStringLength = hintString.length;
  var i;
  for (i = 0; i < numHintDigits - hintStringLength; i++) {
    hintString.unshift(characterSet[0])
  }

  return hintString.join("");
}

function easymotionMark(editor, char) {
    var cursor = editor.getCursorPosition(),
        lastVisibleRow = editor.session.getScreenLength();

    var text = editor.session.getTextRange(new Range(cursor.row, cursor.column, lastVisibleRow, 0));

    var currentRow = cursor.row,
        currentColumn = cursor.column;

    text = text.slice(1, text.length);

    nextId = 0;
    findings = {};

    var occurrences = (text.match(new RegExp(char, "g")) || []).length;
    var hints = hintStrings(occurrences);

    while (text.length > 0) {
        currentColumn = currentColumn + 1;
        if (text[0] === "\n") {
            currentRow = currentRow + 1;
            currentColumn = 0;
            text = text.slice(1, text.length);
        }
        if (text[0] === char) {
            var key = hints.shift();
            var range = new Range(currentRow, currentColumn, currentRow, currentColumn + 1);
            var id = editor.session.addMarker(range, "ace_easymotion-char", "text", true, key);
            findings[key] = {row: currentRow, column: currentColumn, markerId: id};
        }
        text = text.slice(1, text.length);
    }
}

var accuInput = "";
function easymotionJump(editor, char) {
    accuInput = accuInput + char;
    var idx = accuInput;
    var keys = Object.keys(findings);
    var matchingKeys = [];

    var i;
    for (i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k.slice(0, accuInput.length) === accuInput) {
        matchingKeys.push(k);
      }
    }

    if (matchingKeys.length === 0)
      return true;
    if (findings[idx] && matchingKeys.length === 1) {
      editor.moveCursorTo(findings[idx].row, findings[idx].column);
      editor.selection.clearSelection();
      return true;
    }

    updateMarkers(editor);

    return false;
}

function updateMarkers(editor) {
    var keys = Object.keys(findings);
    var i;
    for (i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = findings[k];

        if (keys[i].slice(0, accuInput.length) !== accuInput) {
          editor.session.removeMarker(v.markerId);
        }
    }
}

function clearMarkers(editor) {
    var keys = Object.keys(findings);
    var i;
    for (i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = findings[k];

        editor.session.removeMarker(v.markerId);
    }
}

var easymotionPhase = 0;

function easymotionHandler(data, hashId, key, keyCode) {
    var editor = data.editor;
    if (keyCode == -1) return;
    if (key.length > 1) {
      if (key == "space") key = " ";
      if (key[0] == "n") key = key.replace("numpad", "");
    }
    if ((hashId === 0 || hashId === 4) && key.length == 1)
        return {command: "null", passEvent: true}; // wait until input event
    if (hashId == -1)  {
      // easymotion functionality in two phases
      if (easymotionPhase === 0) {
        easymotionMark(editor, key);
        easymotionPhase++;
        accuInput = "";
      } else if (easymotionPhase === 1) {
        var ret = easymotionJump(editor, key);
        if (ret) {
          easymotionHandlerCleanup({editor: editor});
          easymotionPhase = 0;
        }
      }
      return {command: "null"}
    } else {
        // some other key: exit easymotion mode
        easymotionHandlerCleanup({editor: editor});
        clearMarkers(editor);
        easymotionPhase = 0;
        return {command: "null"}
    }
};

function easymotionHandlerSetup(editor) {
    editor.keyBinding.addKeyboardHandler(easymotionHandler);
    editor.on("mousedown", easymotionHandlerCleanup);
}

function easymotionHandlerCleanup(event) {
    var editor = event.editor;
    editor.keyBinding.removeKeyboardHandler(easymotionHandler)
    editor.off("mousedown", easymotionHandlerCleanup)

    clearMarkers(editor);
}

exports.easymotionSetup = function(editor) {
    easymotionHandlerSetup(editor);
};

exports.commands = [{
    name: "easymotion-setup",
    exec: function(editor) {
        exports.easymotionSetup(editor);
    },
    bindKey: "Ctrl-Super+F"
}];
});
