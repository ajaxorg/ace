/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2015, Robin Jarry
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

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var RSTHighlightRules = function() {

  this.$rules = {
    "start": [
      /* NB: Only the underline of the heading is highlighted.
       * ACE tokenizer does not allow backtracking, the underlined text of the
       * heading cannot be highlighted. */
      {
        token : "markup.heading",
        regex : "(^)([\\=\\-`:\\.'\"~\\^_\\*\\+#])(\\2{2,}\\s*$)"
      },
      /* Generic directive syntax (e.g. .. code-block:: c)
       * All of the directive body is highlighted as a code block. */
      {
        token : ["text", "keyword.operator", "markup.raw"],
        regex : "(^\\s*)(\\.\\. [^:]+::)(.*$)",
        next  : "codeblock"
      },
      {
        token : "keyword.operator",
        regex : "::$",
        next  : "codeblock"
      },
      /* Link/anchor definitions */
      {
        token : "markup.link",
        regex : "^\\.\\. _[^:]+:.*$"
      },
      {
        token : "markup.link",
        regex : "^__ https?://.*$"
      },
      /* Footnote definition */
      {
        token : "markup.list",
        regex : "^\\.\\. \\[[^\\]]+\\] "
      },
      /* Comment block start */
      {
        token : "comment",
        regex : "^\\.\\. .*$",
        next  : "comment"
      },
      /* List items */
      {
        token : "markup.list",
        regex : "^\\s*[\\*\\+-] "
      },
      {
        token : "markup.list",
        regex : "^\\s*\\d+\\. "
      },
      {
        token : "markup.list",
        regex : "^\\s*#\\. "
      },
      /* "Simple" tables */
      {
        token : "markup.table",
        regex : "^={2,}(?: +={2,})+$"
      },
      /* "Grid" tables */
      {
        token : "markup.table",
        regex : "^\\+-{2,}(?:\\+-{2,})+\\+$"
      },
      {
        token : "markup.table",
        regex : "^\\+={2,}(?:\\+={2,})+\\+$"
      },
      /* Inline markup */
      {
        token : "markup.raw",
        regex : "``(?:\\\\`|[^`])+?``"
      },
      {
        token : "markup.bold",
        regex : "\\*\\*(?:\\\\\\*|[^\\*])+?\\*\\*"
      },
      {
        token : "markup.italic",
        regex : "\\*(?:\\\\\\*|[^\\*])+?\\*"
      },
      /* Link/footnote references */
      {
        token : "markup.link",
        regex : ":[\\w-]+:`[^`]+?`"
      },
      {
        token : "markup.link",
        regex : "`[^`]+?`__?"
      },
      {
        token : "markup.link",
        regex : "[A-Za-z0-9\\-]+?__?"
      },
      {
        token : "markup.link",
        regex : "\\[[^\\]]+?\\]_"
      },
      {
        token : "markup.link",
        regex : "https?://\\S+"
      },
      /* "Grid" tables column separator
       * This is at the end to make it lower priority over all other rules. */
      {
        token : "markup.table",
        regex : "\\|"
      },
      {
        defaultToken : "text"
      }
    ],

    /* This state is used for all directive bodies and litteral blocks.
     * The parser returns to the "start" state when reaching the first
     * non-empty line that does not start with at least one space. */
    "codeblock": [
      {
        token : "markup.raw",
        regex : "^ +.+$",
        next : "codeblock"
      },
      {
        token : "markup.raw",
        regex : '^$',
        next: "codeblock"
      },
      {
        token : "empty",
        regex : "",
        next : "start"
      }
    ],

    /* Comment block.
     * The parser returns to the "start" state when reaching the first
     * non-empty line that does not start with at least one space. */
    "comment": [
      {
        token : "comment",
        regex : "^ +.+$",
        next : "comment"
      },
      {
        token : "comment",
        regex : '^$',
        next: "comment"
      },
      {
        token : "empty",
        regex : "",
        next : "start"
      }
    ]
  };
};
oop.inherits(RSTHighlightRules, TextHighlightRules);

exports.RSTHighlightRules = RSTHighlightRules;
});
