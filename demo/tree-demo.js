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
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

exports.launch = function(env) {
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var Document = require("ace/document").Document;
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var UndoManager = require("ace/undomanager").UndoManager;

    var doc = new Document(document.getElementById("jstext").innerHTML);
    doc.setMode(new JavaScriptMode());
    doc.setUndoManager(new UndoManager());

    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container));
    
    tree = new Tree(doc.toString());
    
    doc.addEventListener("changeDelta", function(e) {
        var change = e.data;
        
        if (change.action == "insertText") {
            var start = change.range.start;
            var offset = doc.getLines(0, start.row-1).join("\n").length + start.column;
            var path = tree.pathOf(offset);
            tree.insertAfter(path, change.text);
        }
        
        if (change.action == "removeText") {
            var start = change.range.start;
            var end = change.range.end;
            var pathStart = tree.pathOf(doc.getLines(0, start.row-1).join("\n").length + start.column);
            var pathEnd = tree.pathOf(doc.getLines(0, end.row-1).join("\n").length + end.column);
            tree.removeRange(pathStart, pathEnd);
        }

        console.log(tree + "")
    })
    
    env.editor.setDocument(doc);
    
    
    function onResize() {
        container.style.width = (document.documentElement.clientWidth - 4) + "px";
        container.style.height = (document.documentElement.clientHeight - 55 - 4 - 23) + "px";
        env.editor.resize();
    };

    window.onresize = onResize;
    onResize();
};

});
