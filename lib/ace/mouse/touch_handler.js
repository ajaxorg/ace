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
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
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

var event = require("../lib/event");

var TouchHandler = function(editor) {
    this.editor = editor;
    event.addListener(editor.container, "click", function(e) {
        // does this only work on click?
        editor.focus();
    });
    var mouseTarget = editor.renderer.getMouseEventTarget();
    mouseTarget.ontouchstart = this.onTouchStart.bind(this);
    mouseTarget.ontouchmove = this.onTouchMove.bind(this);
    mouseTarget.ontouchend = this.onTouchEnd.bind(this);
};

(function() {

    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    };
    
    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    };
    
    this.onTouchMove = function(e) {
        e.preventDefault();
        if (e.touches.length == 1) {
            this.$moveCursor(e.touches[0]);
        }
        else if (e.touches.length == 2) {
            if (!this.$scroll)
                return;
            
            var touch = e.touches[0];
            var diffX = this.$scroll.pageX - touch.pageX;
            var diffY = this.$scroll.pageY - touch.pageY;
            this.editor.renderer.scrollBy(diffX, diffY);

            this.$scroll = {
                pageX: touch.pageX,
                pageY: touch.pageY,
                ts: new Date().getTime() 
            }
        }
    };
    
    this.$moveCursor = function(touch) {
        var pageX = touch.pageX;
        var pageY = touch.pageY;
        
        var editor = this.editor;
        var pos = editor.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, editor.session.getLength()-1));
        
        editor.moveCursorToPosition(pos);
        editor.renderer.scrollCursorIntoView();
    };
    
    this.onTouchEnd = function(e) {        
        //if (e.touches.length == 1) {
            console.log("focus")
          //  editor.focus();
            //e.preventDefault();
        //}
		

    };
    
    this.onTouchStart = function(e) {
        if (e.touches.length == 1) {
            this.$moveCursor(e.touches[0]);
        }
        else if (e.touches.length == 2) {
            e.preventDefault();
            var touch = e.touches[0];
            this.$scroll = {
                pageX: touch.pageX,
                pageY: touch.pageY
            }
        }
    };

}).call(TouchHandler.prototype);

exports.TouchHandler = TouchHandler;
});