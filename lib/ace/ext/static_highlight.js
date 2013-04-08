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
var config = require("../config");
/**
 * Transforms a given input code snippet into HTML using the given mode
 *
 * @param {string} input Code snippet
 * @param {string|mode} mode String specifying the mode to load such as 
 *  `ace/mode/javascript` or, a mode loaded from `/ace/mode` 
 *  (use 'ServerSideHiglighter.getMode').
 * @param {string|theme} theme String specifying the theme to load such as
 *  `ace/theme/twilight` or, a theme loaded from `/ace/theme`.
 * @param {number} lineStart A number indicating the first line number. Defaults
 *  to 1.
 * @param {boolean} disableGutter Specifies whether or not to disable the gutter.
 *  `true` disables the gutter, `false` enables the gutter. Defaults to `false`.
 * @param {function} callback When specifying the mode or theme as a string,
 *  this method has no return value and you must specify a callback function. The
 *  callback will receive the rendered object containing the properties `html`
 *  and `css`.
 * @returns {object} An object containing the properties `html` and `css`.
 */

exports.render = function(input, mode, theme, lineStart, disableGutter, callback) {
    lineStart = parseInt(lineStart || 1, 10);
    
    // if theme and mode are both objects return the expected object.
    // preserves current behavior of giving mode and theme objects
    if(typeof theme !== 'string' && typeof mode !== 'string') {
        return renderer(mode, theme);
    }
    
    // if either the theme or the mode were specified as objects 
    // then we need to lazily load them.
    
    // loads or passes the specified theme module then loads the mode.
    if (typeof theme == "string") {
        config.loadModule(['theme', theme], function (theme) {
            checkMode(theme);
        });
    } else {
        // if theme was given as an object pass it through.
        checkMode(theme);
    }
    
    // loads or passes the specified mode module then calls renderer
    function checkMode (theme) {
        if (typeof mode == "string") {
            config.loadModule(['mode', mode], function (mode) {
                callback(renderer(new mode.Mode(), theme));
            });
        } else {
            // if mode was given as an object pass it through.
            callback(renderer(mode, theme));
        }
    }
    
    // this was previously the body of exports.render
    // exports.render does the same thing it did before but now 
    // if you give it mode or theme as strings you must specify a callback
    // which will receive the return value of renderer.
    // specifying the mode or theme as a string did not work before.
    function renderer (mode, theme) {
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
    }
};

});
