/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2015, Ajax.org B.V.
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

define(function (require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var Mirror = require("../worker/mirror").Mirror;
  var Parser = require("./gherkin/parser");
  var TokenScanner = require("./gherkin/token_scanner");
  var ASTBuilder = require("./gherkin/ast_builder");
  var TokenMatcher = require("./gherkin/token_matcher");

  var GherkinWorker = exports.GherkinWorker = function (sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
  };

  oop.inherits(GherkinWorker, Mirror);

  (function () {

    this.onUpdate = function () {
      var value = this.doc.getValue();
      var errors = [];
      var gherkinParser = new Parser();

      try {
        gherkinParser.parse(new TokenScanner(value), new ASTBuilder(), new TokenMatcher());
        return this.sender.emit("annotate", []);
      } catch (e) {
        if (e.name !== 'CompositeParserException') {
          throw e; // something unexpected happened other than a parse error
        }

        for (var i = 0; i < e.errors.length; i++) {
          var error = e.errors[i];
          // convert to ace gutter annotation
          errors.push({
            row: error.location.line - 1, // must be 0 based
            column: error.location.column,  // must be 0 based
            text: error.message,  // text to show in tooltip
            type: "error" //"error"|"warning"|"info"
          });
        }
        this.sender.emit("annotate", errors);
      }
    };

  }).call(GherkinWorker.prototype);

});
