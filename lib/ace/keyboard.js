/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
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

"use strict";

// Probably it would make a better sense to merge 'ace/keyboard/keybinding'
// module with this one, but so far deferring it for a future iteration.
var KeyBinding = require("ace/keyboard/keybinding").KeyBinding;
var keyBinding = new KeyBinding();

exports.name = "keyboard manager";
exports.version = "0.0.1";
exports.description = "Plugin handeling keyboard input.";

// Hook that is triggered when this plugin gets started up.
exports.startup = function startup(event) {
  var env = event.env;
  // Here we start listening to an events that we are interesting in, in
  // a future probably will can create a plugin that will automatically set
  // listeners to a same named events.

  // Listening to the text input events emitted by an editor.
  env.on("editor:text:input", exports["editor:text:input"]);
  // Listening to the command key event emitted by an editor.
  env.on("editor:command:input", exports["editor:command:input"]);
};

exports["editor:text:input"] = function onEditorTextInput(event) {
  keyBinding.onTextInput(event.env, event.text);
};

exports["editor:command:input"] = function onEditorCommandKey(event) {
  keyBinding.onCommandKey(event.env, event.event, event.hashId,
                                           event.keyCode);
};

});
