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

import { EventEmitter } from "./event_emitter";
import oop = require("./oop");

var optionsProvider = {
    setOptions: function(optList: any) {
        Object.keys(optList).forEach((key) => {
            this.setOption(key, optList[key]);
        });
    },
    getOptions: function(this: any, optionNames: string[]) {
        var result: any = {};
        if (!optionNames) {
            var options = this.$options;
            optionNames = Object.keys(options).filter(function(key) {
                return !options[key].hidden;
            });
        } else if (!Array.isArray(optionNames)) {
            result = optionNames;
            optionNames = Object.keys(result);
        }
        optionNames.forEach((key) => {
            result[key] = this.getOption(key);
        });
        return result;
    },
    setOption: function(this: any, name: string, value: any) {
        if (this["$" + name] === value)
            return;
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
    getOption: function(this: any, name: string) {
        var opt = this.$options[name];
        if (!opt) {
            return warn('misspelled option "' + name + '"');
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].getOption(name);
        return opt && opt.get ? opt.get.call(this) : this["$" + name];
    }
};

function warn(message: string) {
    if (typeof console != "undefined" && console.warn)
        console.warn.apply(console, arguments);
}

function reportError(msg: string, data: any) {
    var e = new Error(msg);
    (<any>e).data = data;
    if (typeof console == "object" && console.error)
        console.error(e);
    setTimeout(function() { throw e; });
}

export class AppConfig extends EventEmitter {
    
    $defaultOptions: any;

    constructor() {
        super();
        this.$defaultOptions = {};
    };

    /*
     * option {name, value, initialValue, setterName, set, get }
     */
    defineOptions(obj: any, path: string, options: any) {
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
    };

    resetOptions(obj: any) {
        Object.keys(obj.$options).forEach(function(key) {
            var opt = obj.$options[key];
            if ("value" in opt)
                obj.setOption(key, opt.value);
        });
    };

    setDefaultValue(path: string, name: string, value: any) {
        var opts = this.$defaultOptions[path] || (this.$defaultOptions[path] = {});
        if (opts[name]) {
            if (opts.forwardTo)
                this.setDefaultValue(opts.forwardTo, name, value);
            else
                opts[name].value = value;
        }
    };

    setDefaultValues(path: string, optionHash: any) {
        Object.keys(optionHash).forEach((key) => {
            this.setDefaultValue(path, key, optionHash[key]);
        });
    };

    warn: (message: string) => void;
    reportError: (msg: string, data: any) => void;
};

AppConfig.prototype.warn = warn;
AppConfig.prototype.reportError = reportError;

