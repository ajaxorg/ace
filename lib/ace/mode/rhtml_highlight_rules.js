/*
 * rhtml_highlight_rules.js
 *
 * Copyright (C) 2009-11 by RStudio, Inc.
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * This program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var RHighlightRules = require("./r_highlight_rules").RHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var RHtmlHighlightRules = function() {
    HtmlHighlightRules.call(this);

    this.$rules["start"].unshift({
        token: "support.function.codebegin",
        regex: "^<" + "!--\\s*begin.rcode\\s*(?:.*)",
        next: "r-start"
    });

    this.embedRules(RHighlightRules, "r-", [{
        token: "support.function.codeend",
        regex: "^\\s*end.rcode\\s*-->",
        next: "start"
    }], ["start"]);

    this.normalizeRules();
};
oop.inherits(RHtmlHighlightRules, TextHighlightRules);

exports.RHtmlHighlightRules = RHtmlHighlightRules;
});
