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
 *   Joe Walker (jwalker@mozilla.com)
 *   Julian Viereck (jviereck@mozilla.com)
 *   Kevin Dangoor (kdangoor@mozilla.com)
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

/**
 * This plug-in manages settings.
 */

var console = require("pilot/console");
var oop = require("pilot/oop").oop;
var types = require("pilot/types");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var catalog = require("pilot/catalog");

var settingExtensionSpec = {
    name: "setting",
    description: "A setting is something that the application offers as a " +
            "way to customize how it works",
    register: "env.settings.addSetting",
    indexOn: "name"
};

exports.startup = function(data, reason) {
    catalog.addExtensionSpec(settingExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(settingExtensionSpec);
};

/**
 * A base class for all the various methods of storing settings.
 * <p>Usage:
 * <pre>
 * // Create manually, or require 'settings' from the container.
 * // This is the manual version:
 * var settings = plugins.catalog.getObject('settings');
 * // Add a new setting
 * settings.addSetting({ name:'foo', ... });
 * // Display the default value
 * alert(settings.get('foo'));
 * // Alter the value, which also publishes the change etc.
 * settings.set('foo', 'bar');
 * // Reset the value to the default
 * settings.resetValue('foo');
 * </pre>
 * @constructor
 */
function Settings(persister) {
    /**
     * Storage for deactivated values
     */
    this._deactivated = {};

    /**
     * Storage for the setting values
     */
    this._values = {};

    this._settings = {};

    if (persister) {
        this.setPersister(persister);
    }
};

Settings.prototype = {
    /**
     * Function to add to the list of available settings.
     * <p>Example usage:
     * <pre>
     * var settings = plugins.catalog.getObject('settings');
     * settings.addSetting({
     *     name: 'tabsize', // For use in settings.get('X')
     *     type: 'number',  // To allow value checking.
     *     defaultValue: 4  // Default value for use when none is directly set
     * });
     * </pre>
     * @param {object} settingSpec Object containing name/type/defaultValue members.
     */
    addSetting: function(settingSpec) {
        if (!settingSpec.name) {
            console.error('Setting.name == undefined. Ignoring.', settingSpec);
            return;
        }

        if (!settingSpec.defaultValue === undefined) {
            console.error('Setting.defaultValue == undefined', settingSpec);
            return;
        }

        var type = types.getType(settingSpec.type);
        if (!type) {
            console.error('Missing type', settingSpec);
            return;
        }

        /*
        // The value can be
        // 1) the value of a setting that is not activated at the moment
        //       OR
        // 2) the defaultValue of the setting.
        var value = this._deactivated[settingSpec.name] ||
                settingSpec.defaultValue;
        */

        var setting = { type: type, spec: settingSpec };
        this._settings[settingSpec.name] = setting;
    },

    removeSetting: function(name) {
        delete this._settings[name];
    },

    getSettingNames: function() {
        return Object.keys(this._settings);
    },

    /**
     * A Persister is able to store settings. It is an object that defines
     * two functions:
     * loadInitialValues(settings) and persistValue(settings, key, value).
     */
    setPersister: function(persister) {
        this._persister = persister;
        if (persister) {
            persister.loadInitialValues(this);
        }
    },

    /**
     * Read accessor
     */
    get: function(key) {
        return this._values[key];
    },

    /**
     * Override observable.set(key, value) to provide type conversion and
     * validation.
     */
    set: function(key, value) {
        var setting = this._settings[key];
        if (!setting) {
            console.warn('Setting not defined: ', key, value);
        }

        this._values[key] = value;
        if (persister) {
            persister.persistValue(this, key, value);
        }

        this._dispatchEvent('settingChange', { key: key, value: value });
        return this;
    },

    /**
     * Reset the value of the <code>key</code> setting to it's default
     */
    resetValue: function(key) {
        var setting = this._settings[key];
        if (setting) {
            this.set(key, setting.spec.defaultValue);
        } else {
            console.log('ignore resetValue on ', key);
        }
    },

    resetAll: function() {
        this.getSettingNames().forEach(function(key) {
            this.resetValue(key);
        }.bind(this));
    },

    /**
     * Retrieve a list of the known settings and their values
     */
    _list: function() {
        var reply = [];
        this.getSettingNames().forEach(function(setting) {
            reply.push({
                'key': setting,
                'value': this.get(setting)
            });
        }.bind(this));
        return reply;
    },

    /**
     * Prime the local cache with the defaults.
     */
    _loadDefaultValues: function() {
        this._loadFromObject(this._getDefaultValues());
    },

    /**
     * Utility to load settings from an object
     */
    _loadFromObject: function(data) {
        // We iterate over data rather than keys so we don't forget values
        // which don't have a setting yet.
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var setting = this._settings[key];
                if (setting) {
                    var value = setting.type.parse(data[key]);
                    this.set(key, value);
                } else {
                    this.set(key, data[key]);
                }
            }
        }
    },

    /**
     * Utility to grab all the settings and export them into an object
     */
    _saveToObject: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].type.stringify(this.get(key));
        }.bind(this));
    },

    /**
     * The default initial settings
     */
    _getDefaultValues: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].spec.defaultValue;
        }.bind(this));
    }
};

oop.implement(Settings.prototype, EventEmitter);

exports.settings = new Settings();

/**
 * Save the settings in a cookie
 * This code has not been tested since reboot
 * @constructor
 */
function CookiePersister() {
};

CookiePersister.prototype = {
    loadInitialValues: function(settings) {
        settings._loadDefaultValues();
        var data = cookie.get('settings');
        settings._loadFromObject(JSON.parse(data));
    },

    persistValue: function(settings, key, value) {
        try {
            var stringData = JSON.stringify(settings._saveToObject());
            cookie.set('settings', stringData);
        } catch (ex) {
            console.error('Unable to JSONify the settings! ' + ex);
            return;
        }
    }
};

exports.CookiePersister = CookiePersister;

});
