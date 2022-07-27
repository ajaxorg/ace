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

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ChrdHighlightRules = function() {
    var keywordControl = "#version|#comment_delim|#draw_barlines|" +
		"#barline_padding|#barline_spacing|#barline_width|" +
		"#final_barline_width|#margin_top|#margin_right|#margin_bottom|" +
		"#margin_left|#text_font|#chord_font|#chord_size|#label_size|" +
		"#title_size|#subtitle_size|#author_size|#copyright_size|" +
		"#first_offset|#system_offset|#label_offset|#break_size|" +
		"#lock_copyright|#use_final_barline|#stroke_width|#push_offset|" +
		"#push_width|#push_height|#ring_x_offset|#ring_y_offset|" +
		"#ring_x_margin|#ring_y_margin|#choke_offset|#choke_width|" +
		"#choke_height|#pause_y_offset|#pause_line_radius|#pause_dot_radius|" +
		"#push|#pop|#background|#color|#key|#key_size|#key_offset|" +
		"#key_padding|#key_box|#key_box_width|#tempo|#tempo_size|" +
		"#tempo_break|#push|#pop";

    var keywordLayout = "#title|#subtitle|#author|#copyright|#label|" +
		"#label_at|#start|#break|#include";

    var keywordMapper = this.createKeywordMapper({
        "keyword.control": keywordControl,
        "keyword.layout": keywordLayout
    }, "identifier", true);

    this.$rules =
        {
    "start": [
        {
            "token" : "comment",
            "regex" : "!.*$"
        },
        {
            "token": "constant.language.escape",
            "regex": "[\\|\\|\\|\\|\\|:\\|:\\\\\\|\\\\:\\|:\\|\\|:\\|\\\\]"
        },
        {
            "token" : "constant.numeric",
            "regex" : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?"
        },
        {
			"token" : keywordMapper,
			"regex" : "[a-zA-Z_#][a-zA-Z0-9_\\-\\?\\!\\*]*"
        }
    ]
};

};

oop.inherits(ChrdHighlightRules, TextHighlightRules);

exports.ChrdHighlightRules = ChrdHighlightRules;
});
