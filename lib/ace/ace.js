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

    require("pilot/index");
    require("pilot/fixoldbrowsers");
    var catalog = require("pilot/plugin_manager").catalog;
    catalog.registerPlugins([ "pilot/index" ]);

    var Dom = require("pilot/dom");
    var Event = require("pilot/event");

    var Editor = require("ace/editor").Editor;
    var EditSession = require("ace/edit_session").EditSession;
    var UndoManager = require("ace/undomanager").UndoManager;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;

    exports.edit = function(el) {
        if (typeof(el) == "string") {
            el = document.getElementById(el);
        }

        var doc = new EditSession(Dom.getInnerText(el));
        doc.setUndoManager(new UndoManager());
        el.innerHTML = '';

        var editor = new Editor(new Renderer(el, require("ace/theme/textmate")));
        editor.setSession(doc);

        var env = require("pilot/environment").create();
        catalog.startupPlugins({ env: env }).then(function() {
            env.document = doc;
            env.editor = editor;
            editor.resize();
            Event.addListener(window, "resize", function() {
                editor.resize();
            });
            el.env = env;
        });
        // Store env on editor such that it can be accessed later on from
        // the returned object.
        editor.env = env;
        return editor;
    };
});