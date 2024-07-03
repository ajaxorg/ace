"no use strict";
var oop = require("./oop");
var EventEmitter = require("./event_emitter").EventEmitter;
const reportError = require("./report_error").reportError;
const defaultEnglishMessages = require("./default_english_messages").defaultEnglishMessages;

var optionsProvider = {
    setOptions: function(optList) {
        Object.keys(optList).forEach(function(key) {
            this.setOption(key, optList[key]);
        }, this);
    },
    getOptions: function(optionNames) {
        var result = {};
        if (!optionNames) {
            var options = this.$options;
            optionNames = Object.keys(options).filter(function(key) {
                return !options[key].hidden;
            });
        } else if (!Array.isArray(optionNames)) {
            result = optionNames;
            optionNames = Object.keys(result);
        }
        optionNames.forEach(function(key) {
            result[key] = this.getOption(key);
        }, this);
        return result;
    },
    setOption: function(name, value) {
        if (this["$" + name] === value)
            return;
        //@ts-ignore
        var opt = this.$options[name];
        if (!opt) {
            return warn('misspelled option "' + name + '"');
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].setOption(name, value);

        if (!opt.handlesSet)
            this["$" + name] = value;
        if (opt && opt.set)
            opt.set.call(this, value);
    },
    getOption: function(name) {
        var opt = this.$options[name];
        if (!opt) {
            return warn('misspelled option "' + name + '"');
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].getOption(name);
        return opt && opt.get ? opt.get.call(this) : this["$" + name];
    }
};

function warn(message) {
    if (typeof console != "undefined" && console.warn)
        console.warn.apply(console, arguments);
}

var messages;
var nlsPlaceholders;

class AppConfig {
    constructor() {
            this.$defaultOptions = {};
            messages = defaultEnglishMessages;
            nlsPlaceholders = "dollarSigns";
        }
    
    /**
     * @param {Object} obj
     * @param {string} path
     * @param {{ [key: string]: any }} options
     * @returns {AppConfig}
     */
    defineOptions(obj, path, options) {
        if (!obj.$options)
            this.$defaultOptions[path] = obj.$options = {};

        Object.keys(options).forEach(function(key) {
            var opt = options[key];
            if (typeof opt == "string")
                opt = {forwardTo: opt};

            opt.name || (opt.name = key);
            obj.$options[opt.name] = opt;
            if ("initialValue" in opt)
                obj["$" + opt.name] = opt.initialValue;
        });

        // implement option provider interface
        oop.implement(obj, optionsProvider);

        return this;
    }

    /**
     * @param {Object} obj
     */
    resetOptions(obj) {
        Object.keys(obj.$options).forEach(function(key) {
            var opt = obj.$options[key];
            if ("value" in opt)
                obj.setOption(key, opt.value);
        });
    }

    /**
     * @param {string} path
     * @param {string} name
     * @param {any} value
     */
    setDefaultValue(path, name, value) {
        if (!path) {
            for (path in this.$defaultOptions)
                if (this.$defaultOptions[path][name])
                    break;
            if (!this.$defaultOptions[path][name])
                return false;
        }
        var opts = this.$defaultOptions[path] || (this.$defaultOptions[path] = {});
        if (opts[name]) {
            if (opts.forwardTo)
                this.setDefaultValue(opts.forwardTo, name, value);
            else
                opts[name].value = value;
        }
    }

    /**
     * @param {string} path
     * @param {{ [key: string]: any; }} optionHash
     */
    setDefaultValues(path, optionHash) {
        Object.keys(optionHash).forEach(function(key) {
            this.setDefaultValue(path, key, optionHash[key]);
        }, this);
    }

    /**
     * @param {any} value
     * @param {{placeholders?: "dollarSigns" | "curlyBrackets"}} [options]
     */
    setMessages(value, options) {
        messages = value;
        if (options && options.placeholders) {
            nlsPlaceholders = options.placeholders;
        }
    }

    /**
     * @param {string} key
     * @param {string} defaultString
     * @param {{ [x: string]: any; }} [params]
     */
    nls(key, defaultString, params) {
        if (!messages[key])  {
            warn("No message found for the key '" + key + "' in the provided messages, trying to find a translation for the default string '" + defaultString + "'.");
            if (!messages[defaultString]) {
                warn("No message found for the default string '" + defaultString + "' in the provided messages. Falling back to the default English message.");
            }
        } 

        var translated = messages[key] || messages[defaultString] || defaultString;
        if (params) {
            // We support both $n or {n} as placeholder indicators in the provided translated strings
            if (nlsPlaceholders === "dollarSigns") {
                // Replace $n with the nth element in params
                translated = translated.replace(/\$(\$|[\d]+)/g, function(_, dollarMatch) {
                    if (dollarMatch == "$") return "$";
                    return params[dollarMatch];
                });
            }
            if (nlsPlaceholders === "curlyBrackets") {
                // Replace {n} with the nth element in params
                translated = translated.replace(/\{([^\}]+)\}/g, function(_, curlyBracketMatch) {
                    return params[curlyBracketMatch];
                });
            }
        }
        return translated;
    }
}
AppConfig.prototype.warn = warn;
AppConfig.prototype.reportError = reportError;

// module loading
oop.implement(AppConfig.prototype, EventEmitter);

exports.AppConfig = AppConfig;
