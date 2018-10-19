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


import lang = require("./lib/lang");
import net = require("./lib/net");
import { AppConfig } from "./lib/app_config";

var global = (function(this:any) {
    return this || typeof window != "undefined" && window;
})();

interface Options {
    packaged: boolean,
    workerPath: string,
    modePath: string,
    themePath: string,
    basePath: string,
    suffix: string,
    $moduleUrls: {
        [key: string]: string
    }
    [key: string]: any
};

var options: Options = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {}
};

class Config extends AppConfig {
    private $loading: {
        [key: string]: ((module:any) => void)[]
    } = {};

    get(key: keyof Options) {
        if (!options.hasOwnProperty(key))
            throw new Error("Unknown config key: " + key);
    
        return options[key];
    };
    
    set(key: keyof Options, value: any) {
        if (!options.hasOwnProperty(key))
            throw new Error("Unknown config key: " + key);
    
        options[key] = value;
    };
    
    all() {
        return lang.copyObject(options);
    };
    
    // module loading
    moduleUrl(name: string, component: string) {
        if (options.$moduleUrls[name])
            return options.$moduleUrls[name];
    
        var parts = name.split("/");
        component = component || parts[parts.length - 2] || "";
        
        // todo make this configurable or get rid of '-'
        var sep = component == "snippets" ? "/" : "-";
        var base = parts[parts.length - 1];
        if (component == "worker" && sep == "-") {
            var re = new RegExp("^" + component + "[\\-_]|[\\-_]" + component + "$", "g");
            base = base.replace(re, "");
        }
    
        if ((!base || base == component) && parts.length > 1)
            base = parts[parts.length - 2];
        var path = options[component + "Path"];
        if (path == null) {
            path = options.basePath;
        } else if (sep == "/") {
            component = sep = "";
        }
        if (path && path.slice(-1) != "/")
            path += "/";
        return path + component + sep + base + this.get("suffix");
    };
    
    setModuleUrl(name: string, subst: string) {
        return options.$moduleUrls[name] = subst;
    };
    
    loadModule(moduleSpec: string|string[], onLoad: (module: any) => void) {
        var module, moduleType
        var moduleName: string;
        if (Array.isArray(moduleSpec)) {
            moduleType = moduleSpec[0];
            moduleName = moduleSpec[1];
        } else {
            moduleName = <string>moduleSpec;
        }
    
        try {
            module = require(moduleName);
        } catch (e) {}
        // require(moduleName) can return empty object if called after require([moduleName], callback)
        if (module && !this.$loading[moduleName])
            return onLoad && onLoad(module);
    
        if (!this.$loading[moduleName])
            this.$loading[moduleName] = [];
    
        this.$loading[moduleName].push(onLoad);
    
        if (this.$loading[moduleName].length > 1)
            return;
    
        var that = this;
        var afterLoad = function() {
            require([moduleName], (module: any) => {
                that._emit("load.module", {name: moduleName, module: module});
                var listeners = that.$loading[moduleName];
                that.$loading[moduleName] = null;
                listeners.forEach(function(onLoad) {
                    onLoad && onLoad(module);
                });
            });
        }
    
        if (!this.get("packaged"))
            return afterLoad();
        net.loadScript(this.moduleUrl(moduleName, moduleType), afterLoad);
    };
        
    init(packaged: boolean) {
        if (!global || !global.document)
            return;
        
        options.packaged = packaged || (<any>require).packaged || (global.define && (<any>global.define).packaged);
    
        var scriptOptions: {
            packaged?: boolean,
            [key: string]: string|boolean
        } = {};
        var scriptUrl = "";
    
        // Use currentScript.ownerDocument in case this file was loaded from imported document. (HTML Imports)
        var currentScript = (document.currentScript || (<any>document)._currentScript ); // native or polyfill
        var currentDocument = currentScript && currentScript.ownerDocument || document;
        
        var scripts = currentDocument.getElementsByTagName("script");
        for (var i=0; i<scripts.length; i++) {
            var script = scripts[i];
    
            var src = script.src || script.getAttribute("src");
            if (!src)
                continue;
    
            var attributes = script.attributes;
            for (var j=0, l=attributes.length; j < l; j++) {
                var attr = attributes[j];
                if (attr.name.indexOf("data-ace-") === 0) {
                    scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
                }
            }
    
            var m = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
            if (m)
                scriptUrl = m[1];
        }
    
        if (scriptUrl) {
            scriptOptions.base = scriptOptions.base || scriptUrl;
            scriptOptions.packaged = true;
        }
    
        scriptOptions.basePath = scriptOptions.base;
        scriptOptions.workerPath = scriptOptions.workerPath || scriptOptions.base;
        scriptOptions.modePath = scriptOptions.modePath || scriptOptions.base;
        scriptOptions.themePath = scriptOptions.themePath || scriptOptions.base;
        delete scriptOptions.base;
    
        for (var key in scriptOptions)
            if (typeof scriptOptions[key] !== "undefined")
                this.set(key, scriptOptions[key]);
    }
}

export = new Config();

function deHyphenate(str: string) {
    return str.replace(/-(.)/g, function(m, m1) { return m1.toUpperCase(); });
}