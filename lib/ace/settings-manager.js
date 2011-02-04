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
var env

function onPlug(event) {
    var plugin = event.plugin
    // Register types if provided. Important to register them first, since
    // settings may relay on them.
    if (plugin.types)
        types.registerTypes(plugin.types)
    // Registering settings if provided.
    if (plugin.settings)
        env.settings.addSettings(plugin.settings)
}
function onUnplug(event) {
    var plugin = event.plugin
    if (plugin.types)
        types.unregisterTypes(plugin.types)
    if (plugin.settings)
        env.settings.removeSettings(plugin.settings)
}

exports.name = "settings manager"
exports.plug = function plug(data) {
    env = data.env
    // Register listener to register all the plug-ins that will be plugged.
    env.plugins.on("plug", onPlug)
    // Register listener to unregister all the plug-ins that will be unplugged.
    env.plugins.on("unplug", onUnplug)
    // Go through all plugged plug-ins and register them.
    // env.plugins.registry.forEach(onPlug)
}

exports.unplug = function unplug(data) {
    env.removeListener("plug", onPlug)
    env.removeListener("unplug", onUnplug)
}

})
