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


var SelectionType = require('pilot/types/basic').SelectionType

function Manager(options) {
    if (!(this instanceof Manager)) return new Manager(options)
    var plugins = this.plugins = {}
    var names = this.names = []
    var name = this.name = options.name
    this.description = options.description
    this.types = options.types || {}
    // If type is not provided generating default one.
    if (!(name in this.types))
        this.types[name] = new SelectionType({ name: name, data: names })
    this.settings = options.settings || {}
    // If setting is not provided generating default one.
    if (!(name in this.settings))
        this.settings[name] = { description: this.description, type: name }

    this.onPlug = this.onPlug.bind(this)
    this.onUnplug = this.onUnplug.bind(this)
}
Manager.prototype.onPlug = function onPlug(data) {
  var plugin = data.plugin
  if (this.name == plugin.type) {
    this.plugins[plugin.name] = plugin
    this.names.push(plugin.name)
  }
}

Manager.prototype.onUnplug = function onUnplug(plugin) {
  var plugin = data.plugin
  if (this.name == plugin.type) {
    delete this.plugins[plugin.name]
    this.names.splice(this.names.indexOf(plug.name), 1)
  }
}
Manager.prototype.plug = function plug(data) {
    var env = this.env = data.env
    Object.getPrototypeOf(env)[this.name] = this
    env.plugins.on("plug", this.onPlug)
    env.plugins.on("unplug", this.onUnplug)
}
Manager.prototype.unplug = function unplug(data) {
    var env = data.env
    delete this.env
    delete Object.getPrototypeOf(env)[this.name]
    env.plugins.removeListener("plug", this.onPlug)
    env.plugins.removeListener("unplug", this.onUnplug)
}

exports.Manager = Manager

})
