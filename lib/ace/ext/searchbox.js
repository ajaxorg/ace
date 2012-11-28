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

var dom = require("ace/lib/dom");
var event = require("ace/lib/event");
var Range = require("ace/range").Range;
 
exports.SearchBox = function (editor, range, showReplaceForm) {
    var _self = this;
    var sb = null;//search box
    var n = null;//needle
    var r = null;//replace
    var p = null;//parent DOM node

    var needle = editor.session.getTextRange(range);

    this.$init = function() {

        p = editor.container.parentNode;
        sb = p.querySelector(".ace_search"); //the complete form

        if(!sb) {
            
            //Create the elements
            sb = document.createElement("div");
            sb.setAttribute("class", "ace_search right");
            p.appendChild( sb );

            var c = document.createElement("button"); //cancel btn
                c.setAttribute("type","button");
                c.setAttribute("class","ace_searchbtn_close");
                sb.appendChild( c );
                c.onclick = _self.hide;

            var sf = document.createElement("div"); //search form
                sf.setAttribute("id", "ace_search_form");
                sf.setAttribute("class", "ace_search_form");
                sb.appendChild( sf );

                n = document.createElement("input"); //needle
                    n.setAttribute("class", "ace_search_field");
                    n.setAttribute("id", "ace_search_field");
                    n.setAttribute("placeholder", "Search for");
                    n.setAttribute("type", "text");
                    sf.appendChild( n );

                var sp = document.createElement("button");
                    sp.setAttribute("type","button");
                    sp.setAttribute("class","ace_searchbtn prev");
                    sf.appendChild( sp );
                    sp.onclick = _self.findPrev;

                var sn = document.createElement("button");
                    sn.setAttribute("type","button");
                    sn.setAttribute("class","ace_searchbtn next");
                    sf.appendChild( sn );
                    sn.onclick = _self.findNext;

            var rf = document.createElement("div"); //replace form
                rf.setAttribute("id", "ace_replace_form");
                rf.setAttribute("class", "ace_search_form");
                rf.setAttribute("style", "display: none");
                sb.appendChild( rf);

                r = document.createElement("input"); //needle
                    r.setAttribute("class", "ace_search_field");
                    r.setAttribute("id", "ace_replace_field");
                    r.setAttribute("placeholder", "Replace with");
                    r.setAttribute("type", "text");
                    rf.appendChild( r );

                var rr = document.createElement("button");
                    rr.setAttribute("type","button");
                    rr.setAttribute("class","ace_replacebtn prev");
                    rr.innerHTML = "Replace";
                    rf.appendChild( rr );
                    rr.onclick = _self.replace;

                var ra = document.createElement("button");
                    ra.setAttribute("type","button");
                    ra.setAttribute("class","ace_replacebtn next");
                    ra.innerHTML = "All";
                    rf.appendChild( ra );
                    ra.onclick = _self.replaceAll;


        } else {
            sb.removeAttribute("style");
            n = sb.querySelector("#ace_search_field");
            r = sb.querySelector("#ace_replace_field");
        }

        console.log( "showReplaceForm", showReplaceForm );
        if( showReplaceForm ) {
            p.querySelector("#ace_replace_form").removeAttribute("style");
        }

        
        if( needle )
            n.value = needle;
        
        //set initial focus and select text in input
        n.focus();
        n.select();

        //keybinging outsite of the searchbox
        _self.$searchKeybingin = {
            handleKeyboard: function(data, hashId, keyString, keyCode) {
                console.log("MERGE");
                if (keyString == "esc")
                    return {command: this.command};
            },
            command: {
                exec: function(editor) {
                    _self.hide();
                }
            }
        };
        editor.keyBinding.addKeyboardHandler(this.$searchKeybingin);

        n.onkeydown = searchonkeydown;
        r.onkeydown = searchonkeydown;
        function searchonkeydown(e) {

            var cmdKey = e.metaKey || e.ctrlKey;

            console.log(cmdKey);

            if( cmdKey ) {
                if( e.which == 70 ) { //f key
                    var rf = p.querySelector("#ace_replace_form");
                    if( e.altKey && rf.hasAttribute("style") ) {
                        p.querySelector("#ace_replace_form").removeAttribute("style");
                    } else {
                        _self.hide();
                    }
                    return false;
                }
            }

            if( e.which === 9 )  { //tab
                if( e.target == n ) {
                    r.focus();
                    r.select();
                } else {
                    n.focus();
                    n.select();
                }
                return false;
            }
        }
        
        n.onpaste = function(e) {
            //I do this because the onpaste event is fired before the value of the input actually changes
            setTimeout(function() {
                e.target.onkeyup();
            }, 100);
        }
        n.onkeyup = function(e){
            console.log("KEYUP", e);
            if(!e) {
                e = {};
                e.which = 0;
            }

            if( e.which === 27 ) { //esc key
                _self.hide();
            } else if( e.which === 13 ) { //enter key
                _self.findNext( );
            } else {
                editor.moveCursorTo( range.start.row, range.start.column );
                _self.findNext();
            }
        };
        r.onkeyup = function(e){
            if( e.which === 27 ) { //esc key
                _self.hide();
            } else if( e.which === 13 ) { //enter key
                editor.moveCursorTo( range.start.row, range.start.column );
                _self.replace();
            } 
        };
    };

    this.findPrev = function() {
        editor.find(n.value, {
            backwards: true,
            wrap: true
        });
    };
    this.findNext = function() {
        editor.find(n.value, {
            backwards: false,
            wrap: true
        });
    };
    this.replace = function() {
        editor.replace( r.value );
        _self.findNext();
    };
    this.replaceAll = function() {
        editor.replaceAll( r.value );
    };

    this.hide = function () {
        n.value = "";
        r.value = "";
        sb.setAttribute("style", "display: none");
        sb.querySelector("#ace_replace_form").setAttribute("style", "display: none");
        editor.keyBinding.removeKeyboardHandler(this.$searchKeybingin);
        editor.focus();
    };

    _self.$init();
};

});


/* ------------------------------------------------------------------------------------------
 * TODO
 * --------------------------------------------------------------------------------------- */
/*
- move search form to the left if it masks current word 
- includ all options that search has. ex: regex
- searchbox.searchbox is not that pretty. we should have just searchbox
- disable prev button if it makes sence
*/