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

"use strict"

var types = require("pilot/types")
var SelectionType = require('pilot/types/basic').SelectionType
var env

// All the plugged themes.
var themes = {}
var themeNames = []
var type = new SelectionType({
  name: 'theme',
  data: themeNames
})
var setting = {
  name: 'theme',
  description: 'Active theme.',
  type: 'theme',
  onChange: function onChange(event) {
    env.editor.setTheme(themes[event.value])
  }
}

function onPlug(data) {
  var plugin = data.plugin
  if ('theme' == plugin.type) {
    themes[plugin.name] = plugin
    themeNames.push(plugin.name)
  }
}
function onUnplug(plugin) {
  var plugin = data.plugin
  if ('theme' == plugin.type) {
    delete themes[plugin.name]
    themeNames.splice(themeNames.indexOf(plug.name), 1)
  }
}

exports.name = "theme manager"
exports.plug = function plug(data) {
  Object.getPrototypeOf(data.env).themes = themes
  data.env.plugins.on("plug", onPlug)
  data.env.plugins.on("unplug", onUnplug)
  types.registerType(type)
  data.env.settings.addSetting(setting)
  env = data.env
}

exports.unplug = function unplug(data) {
  delete Object.getPrototypeOf(data.env).themes
  data.env.plugins.removeListener("plug", onPlug)
  data.env.plugins.removeListener("unplug", onUnplug)
  types.unregisterType(type)
  ata.env.settings.removeSetting(setting)
}

})
