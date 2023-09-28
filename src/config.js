"no use strict";
/**
 * @typedef {import("./lib/app_config").AppConfig} AppConfig
 */
/**
 * @typedef {AppConfig & Config} IConfig
 * @export
 */

/**
 * @typedef Config
 * @property {(key: string) => any} get
 * @property {(key: string, value: any) => void} set
 * @property {() => {[key: string]: any}} all
 * @property {(name: string, component?: string) => string} moduleUrl
 * @property {(name: string, subst: string) => string} setModuleUrl
 * @property {(moduleName: string | [string, string], cb: (module: any) => void) => void} loadModule
 * @property {(cb: (moduleName: string, afterLoad: (err: Error | null, module: unknown) => void) => void) => void} setLoader
 * @property {(moduleName: string, onLoad: (module: any) => void) => void} setModuleLoader
 * @property {string} version
 * @property {any} $modes
 * @property {any} $loading
 * @property {any} $loaded
 * @property {any} dynamicModules
 * @property {any} $require
 */

var lang = require("./lib/lang");
var net = require("./lib/net");
var dom = require("./lib/dom");
/**@type{any}*/var AppConfig = require("./lib/app_config").AppConfig;

/**
 * 
 * @type {IConfig}
 */
module.exports = exports = new AppConfig();

var options = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {},
    loadWorkerFromBlob: true,
    sharedPopups: false,
    useStrictCSP: null
};

/**
 * @param {string} key
 * @return {*}
 */
exports.get = function(key) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);
    return options[key];
};

/**
 * @param {string} key
 * @param value
 */
exports.set = function(key, value) {
    if (options.hasOwnProperty(key))
        options[key] = value;
    else if (this.setDefaultValue("", key, value) == false)
        throw new Error("Unknown config key: " + key);
    if (key == "useStrictCSP")
        dom.useStrictCSP(value);
};
/**
 * @return {{[key: string]: any}}
 */
exports.all = function() {
    return lang.copyObject(options);
};

exports.$modes = {};

/**
 * module loading
 * @param {string} name
 * @param {string} [component]
 * @returns {string}
 */
exports.moduleUrl = function(name, component) {
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
/**
 * @param {string} name
 * @param {string} subst
 * @returns {string}
 */
exports.setModuleUrl = function(name, subst) {
    return options.$moduleUrls[name] = subst;
};

var loader = function(moduleName, cb) {
    if (moduleName === "ace/theme/textmate" || moduleName === "./theme/textmate")
        return cb(null, require("./theme/textmate"));
    if (customLoader)
        return customLoader(moduleName, cb);
    console.error("loader is not configured");
};
var customLoader;
/**
 * @param {(moduleName: string, afterLoad: (err: Error | null, module: unknown) => void) => void}cb
 */
exports.setLoader = function(cb) {
    customLoader = cb;
};

exports.dynamicModules = Object.create(null);
exports.$loading = {};
exports.$loaded = {};
/**
 * @param {string | [string, string]} moduleName
 * @param {(module: any) => void} onLoad
 */
exports.loadModule = function(moduleName, onLoad) {
    var loadedModule, moduleType;
    if (Array.isArray(moduleName)) {
        moduleType = moduleName[0];
        moduleName = moduleName[1];
    }
    
    var load = function (module) {
        // require(moduleName) can return empty object if called after require([moduleName], callback)
        if (module && !exports.$loading[/**@type {string}*/(moduleName)]) return onLoad && onLoad(module);

        if (!exports.$loading[/**@type {string}*/(moduleName)]) exports.$loading[/**@type {string}*/(moduleName)] = [];

        exports.$loading[/**@type {string}*/(moduleName)].push(onLoad);

        if (exports.$loading[/**@type {string}*/(moduleName)].length > 1) return;

        var afterLoad = function() {
            loader(moduleName, function(err, module) {
                if (module) exports.$loaded[/**@type {string}*/(moduleName)] = module;
                exports._emit("load.module", {name: moduleName, module: module});
                var listeners = exports.$loading[/**@type {string}*/(moduleName)];
                exports.$loading[/**@type {string}*/(moduleName)] = null;
                listeners.forEach(function(onLoad) {
                    onLoad && onLoad(module);
                });
            });
        };

        if (!exports.get("packaged")) return afterLoad();

        net.loadScript(exports.moduleUrl(/**@type {string}*/(moduleName), moduleType), afterLoad);
        reportErrorIfPathIsNotConfigured();
    };

    if (exports.dynamicModules[moduleName]) {
        exports.dynamicModules[moduleName]().then(function (module) {
            if (module.default) {
                load(module.default);
            }
            else {
                load(module);
            }
        });
    } else {
        // backwards compatibility for node and packaged version
        try {
            loadedModule = this.$require(moduleName);
        } catch (e) {}
        load(loadedModule || exports.$loaded[moduleName]);
    }
};

exports.$require = function(moduleName) {
    if (typeof module["require"] == "function") {
        var req = "require";
        return module[req](moduleName);
    }
};

exports.setModuleLoader = function (moduleName, onLoad) {
    exports.dynamicModules[moduleName] = onLoad;
};

var reportErrorIfPathIsNotConfigured = function() {
    if (
        !options.basePath && !options.workerPath
        && !options.modePath && !options.themePath
        && !Object.keys(options.$moduleUrls).length
    ) {
        console.error(
            "Unable to infer path to ace from script src,",
            "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes",
            "or with webpack use ace/webpack-resolver"
        );
        reportErrorIfPathIsNotConfigured = function() {};
    }
};

exports.version = "1.28.0";


