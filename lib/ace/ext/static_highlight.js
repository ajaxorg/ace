/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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

var EditSession = require("../edit_session").EditSession;
var TextLayer = require("../layer/text").Text;
var baseStyles = require("../requirejs/text!./static.css");

/* Transforms a given input code snippet into HTML using the given mode
*
* @param {string} input Code snippet
* @param {mode} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
* @param {string} r Code snippet
* @returns {object} An object containing: html, css
*/

exports.render = function(input, mode, theme, lineStart, disableGutter) {
    lineStart = parseInt(lineStart || 1, 10);
    
    var session = new EditSession("");
    session.setMode(mode);
    session.setUseWorker(false);
    
    var textLayer = new TextLayer(document.createElement("div"));
    textLayer.setSession(session);
    textLayer.config = {
        characterWidth: 10,
        lineHeight: 20
    };
    
    session.setValue(input);
            
    var stringBuilder = [];
    var length =  session.getLength();

    for(var ix = 0; ix < length; ix++) {
        stringBuilder.push("<div class='ace_line'>");
        if (!disableGutter)
            stringBuilder.push("<span class='ace_gutter ace_gutter-cell' unselectable='on'>" + (ix + lineStart) + "</span>");
        textLayer.$renderLine(stringBuilder, ix, true, false);
        stringBuilder.push("</div>");
    }
    
    // let's prepare the whole html
    var html = "<div class=':cssClass'>\
        <div class='ace_editor ace_scroller ace_text-layer'>\
            :code\
        </div>\
    </div>".replace(/:cssClass/, theme.cssClass).replace(/:code/, stringBuilder.join(""));
        
    textLayer.destroy();
            
    return {
        css: baseStyles + theme.cssText,
        html: html
    };
};

});
