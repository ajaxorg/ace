/* eslint-env browser */
/* global importScripts Response Request */

/**
 * requirejs compatible loader for cloud9
 *
 * supports the following loaders
 *     require("text!./path.md")  - load a file as text
 *     require("json!./file.json")  - load a file as json
 *     require("asset-url!./directory-or-a-file")  - get a url for a image, html or audio file or
 *          a whole directory, files required this way are copied to the cdn without modifications
 *     require("webworker!./modulname")  - get a url that can be used to start a webworker
 *     require("webworker!<tagname>!./modulname")  - get a url for webworker, and include all the
 *          instances of require("<tagname>!./modulname") in a bundle for that worker
 *     require("language!./modulname")  - the commonly used tagname for language worker
 *     require("vfs!./module") - bundles js file with it's dependencies in a way that can be used
 *          on vfs worker, either as a vfs extension or a standalone executable
 *     require("architect!./modulname") - wraps module in a function allowing
 *          delayed initialization of architect plugins
 *     TODO:
 *     require("glob!./ace/mode/*(:-_test|_highlight_rules).js").load("css", function() {}) -
 *     require("lazy!./module").load(function() {}) -
 */
(function() {
    var global = (function() {
        return this;
    })();
    if (!global && typeof window != "undefined") global = window; // can happen in strict mode
    if (!global && typeof self != "undefined") global = self; // can happen in webworker

    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$|`([^`\\]|\\.)*`)/gm;
    var cjsRequireRegExp = /require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;

    function getInlineDeps(fn) {
        var deps = [];
        if (fn.length) {
            fn
                .toString()
                .replace(commentRegExp, "")
                .replace(cjsRequireRegExp, function(match, dep, index, str) {
                    var i = index;
                    while (str.charCodeAt((i -= 1)) <= 32) {}
                    if (str.charAt(i) !== ".") deps.push(dep);
                });
            deps = ["require", "exports", "module"].concat(deps);
        }
        return deps;
    }

    var define = function(name, deps, callback) {
        // Allow for anonymous modules
        if (typeof name !== "string") {
            callback = deps;
            deps = name;
            name = null;
        }
        // This module may not have dependencies
        if (deps && !Array.isArray(deps)) {
            callback = deps;
            deps = null;
        }

        if (nextModule) {
            if (!name || name == nextModule.name) {
                name = nextModule.name;
                deps = deps || nextModule.deps;
                nextModule = null;
            }
        }

        if (!name) return defQueue.push([deps, callback]);

        if (define.loaded[name]) return;

        if (!deps && typeof callback == "function") deps = getInlineDeps(callback);

        define.loaded[name] = {
            id: name,
            deps: normalizeNames(name, deps || []),
            factory: callback,
            exports: {},
            packaged: true,
        };
        if (define.loading[name]) delete define.loading[name];
        if (define.lastModule) define.pending.push(name);
        else define.lastModule = name;
    };
    var defQueue = [];
    var nextModule;
    var addToLoadQueue = function(missing, deps, callback, errback) {
        var toLoad = missing.length;
        var map = {};
        define.queue.push({
            deps: deps,
            map: map,
            toLoad: toLoad,
            callback: callback,
            errback: errback,
        });

        for (var i = 0; i < missing.length; ++i) {
            var p = missing[i];
            map[p] = 1;
            if (!define.loading[p]) {
                define.loading[p] = 1;
                require.load(p);
            }
        }
    };

    var processLoadQueue = function(err, id) {
        var changed = false;
        if (err) {
            if (!id) id = err.id;
            define.errors[id] = err;
            define.queue.forEach(function(r) {
                if (r.map[id]) {
                    r.toLoad = -1;
                    if (r.errback) r.errback(err);
                }
            });
            if (define.lastModule == id) define.lastModule = null;
            define.pending = define.pending.filter(function(p) {
                return p != id;
            });
            changed = true;
            err.from = [];
            for (var i in define.loaded) {
                var index = define.loaded[i].deps.indexOf(id);
                if (index != -1) {
                    err.from.push(define.loaded[i].id);
                }
            }
            console.error("Error loading " + id + " required from " + err.from.slice(0, 2));
        } else if (id && !defQueue.length && !define.loaded[id]) {
            // the script didn't call define
            defQueue = [(config.shim && config.shim[id]) || [[], null]];
        }

        if (defQueue.length) {
            if (defQueue.length > 1) throw new Error("more than one module in defqueue");
            define(id, defQueue[0][0], defQueue[0][1]);
            defQueue.length = 0;
        }

        var pending = define.pending;
        define.queue.forEach(function(r) {
            pending.forEach(function(id) {
                if (r.map[id]) r.toLoad--;
            });
            if (r.map[define.lastModule]) r.toLoad--;
            if (!r.toLoad) {
                changed = true;
                _require("", r.deps, r.callback, r.errback);
            }
        });

        define.lastModule = null;
        if (pending.length) define.pending = [];

        if (changed) {
            define.queue = define.queue.filter(function(r) {
                return r.toLoad > 0;
            });
        }
    };

    define.amd = {};
    define.queue = [];
    define.loaded = {};
    define.errors = {};
    define.loading = {};
    define.pending = [];
    define.modules = {require: 1, exports: 1, module: 1};
    define.fetchedUrls = {};

    var activateModule = function(name) {
        var module = define.loaded[name];
        var exports = module.exports;
        if (typeof module.factory !== "function") {
            exports = module.factory;
        } else {
            var req = function(path, callback) {
                return _require(name, path, callback);
            };
            req.config = config;
            req.toUrl = function(id) {
                return require.toUrl(id);
            };

            var missing = checkMissing(module.deps);
            if (missing.length) return missing;

            module.define = define;
            var specialModules = {
                require: req,
                exports: exports,
                module: module,
            };

            if (name.lastIndexOf("architect!", 0) == 0 && !module.pluginFactory) {
                module.pluginFactory = module.factory;
                module.factory = activateArchitectModule;
            }

            define.modules[name] = exports;
            var args = module.deps.slice(0, module.factory.length);
            var returnValue = args.length
                ? module.factory.apply(
                      module,
                      args.map(function(name) {
                          return specialModules[name] || lookup(name);
                      })
                  )
                : module.factory(req, exports, module);

            exports = returnValue == undefined ? module.exports : returnValue;
        }
        if (!config.$keepLoaders) delete define.loaded[name];
        define.modules[name] = exports;
    };

    var checkMissing = function(deps, seen, missing) {
        missing = missing || {};
        seen = seen || {};
        for (var i = 0; i < deps.length; ++i) {
            var depName = deps[i];
            if (!define.modules[depName]) {
                var dep = define.loaded[depName];
                if (!dep) missing[depName] = 1;
                else if (!missing[depName] && !seen[depName]) {
                    seen[depName] = 1;
                    checkMissing(dep.deps, seen, missing);
                }
            }
        }
        return Object.keys(missing);
    };

    var lookup = function(moduleName) {
        var mod = define.modules[moduleName];
        if (mod === undefined && define.loaded[moduleName]) {
            activateModule(moduleName);
            mod = define.modules[moduleName];
        }
        return mod;
    };

    var _require = function(parentId, moduleName, callback, errback) {
        if (typeof moduleName === "string") {
            var depName = normalizeName(parentId, moduleName);
            var module = lookup(depName);
            if (module !== undefined) {
                if (typeof callback == "function") callback(module);
                return module;
            } else if (typeof importScripts != "undefined" || syncLoaders.test(moduleName)) {
                addToLoadQueue([depName], [depName]);
                return lookup(depName);
            }
        } else if (Array.isArray(moduleName)) {
            var deps = normalizeNames(parentId, moduleName);
            var missing = checkMissing(deps);
            if (!missing.length) {
                var args = deps.map(lookup);
                return callback && callback.apply(null, args);
            } else {
                return addToLoadQueue(missing, deps, callback, errback);
            }
        }
    };

    var normalizeName = function(parentId, moduleName) {
        if (/!/.test(parentId)) parentId = parentId.split("!").pop();
        // normalize plugin requires
        var i = moduleName.indexOf("!");
        if (i !== -1) {
            return (
                normalizeName(parentId, moduleName.slice(0, i)) +
                "!" +
                normalizeName(parentId, moduleName.slice(i + 1))
            );
        }
        // normalize relative requires
        if (moduleName.charAt(0) == ".") {
            var parentChunks = parentId.split("/");
            var parentModule = parentChunks.shift();
            if (parentModule.charAt(0) == "@") {
                parentModule = parentModule + "/" + parentChunks.shift();
            }

            var path = parentChunks.slice(0, -1).join("/");
            moduleName = parentModule + (path ? "/" + path : "") + "/" + moduleName;

            while (moduleName.indexOf(".") !== -1 && previous != moduleName) {
                var previous = moduleName;
                moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
            }
        }

        return moduleName;
    };

    var normalizeNames = function(parentId, moduleNames) {
        return moduleNames.map(function(name) {
            return normalizeName(parentId, name);
        });
    };

    var require = function(module, callback, errback) {
        return _require("", module, callback, errback);
    };

    var config = (require.config = function(cfg) {
        if (cfg.baseUrl) config.baseUrl = cfg.baseUrl.replace(/\/*$/, "/");

        if (cfg.host) host = cfg.host;

        if (Array.isArray(cfg.packages)) {
            cfg.packages.forEach(function(pkg) {
                if (typeof pkg === "string") pkg = {name: pkg};
                config.packages[pkg.name] = {
                    name: pkg.name,
                    location: (pkg.location || pkg.name).replace(/\/*$/, "/"),
                    main: (pkg.main || "main").replace(/\.js$/, "").replace(/^\.\//, ""),
                };
            });
        } else if (cfg.packages) {
            config.packages = cfg.packages;
        }

        cfg.paths &&
            Object.keys(cfg.paths).forEach(function(p) {
                config.paths[p] = cfg.paths[p];
            });

        if (
            cfg.useCache &&
            global.caches &&
            (location.protocol === "https:" || location.hostname == "localhost")
        ) {
            config.useCache = true;
            checkCache();
        }

        if (cfg.transform) config.transform = cfg.transform;
        if (/\bes5\b/.test(cfg.transform) && !global.shimIncluded) {
            if (!console.assert) {
                console.assert = function assert() {}; // This method is used by the following es6 shim.
            }
            var oldFlags = RegExp.prototype.flags;
            RegExp.prototype.flags = true;
            require(["js-polyfills/es6"]);
            RegExp.prototype.flags = oldFlags;
            global.shimIncluded = true;
        }

        if (cfg.assetUrl) config.assetUrl = cfg.assetUrl;

        if (cfg.$keepLoaders != undefined) config.$keepLoaders = cfg.$keepLoaders;
    });

    require.resetConfig = function(cfg) {
        var location = global.location;
        var baseUrl = location ? location.protocol + "//" + location.host 
            + location.pathname.split("/").slice(0, -1).join("/") : "";
        config.packages = Object.create(null);
        config.paths = Object.create(null);
        config.baseUrl = baseUrl;
        config.useCache = false;
        config.transform = "";
        if (cfg) require.config(cfg);
    };

    require.getConfig = function() {
        var script = document.querySelector("script[src*=require]");
        return {
            packages: config.packages,
            paths: config.paths,
            baseUrl: config.baseUrl,
            useCache: config.useCache,
            transform: config.transform,
            host: host,
            requireSourceUrl: !config.packed && script && script.src,
            assetUrl: config.assetUrl,
        };
    };

    require.resetConfig();

    define.undef = require.undef = function(module, recursive) {
        module = normalizeName("", module);
        if (recursive) {
            var root = (module + "/").replace(/\/+$/, "/");
            undefAll(root, define.errors);
            undefAll(root, define.loaded);
            undefAll(root, define.modules);
            undefAll(root, define.loading);
        } else {
            undefOne(module, require.toUrl(module, ".js"));
        }
    };

    function undefOne(module, path) {
        delete define.errors[module];
        delete define.loaded[module];
        delete define.modules[module];
        delete define.loading[module];
        delete define.fetchedUrls[path];
    }

    function undefAll(module, hash) {
        Object.keys(hash).forEach(function(key) {
            var i = key.indexOf("!") + 1;
            if (key.lastIndexOf(module, 0) == 0) undefOne(key, require.toUrl(key, ".js"));
            if (i) {
                var plugin = key.slice(0, i - 1);
                var resource = key.slice(i);
                if (resource.lastIndexOf(module, 0) == 0 || plugin.lastIndexOf(module, 0) == 0) {
                    undefOne(key, require.toUrl(key, ""));
                    undefOne(resource, require.toUrl(resource, ""));
                }
            }
        });
    }

    require.toUrl = function(moduleName, ext, skipExt, isStatic) {
        var absRe = /^([\w\+\.\-]+:|\/)/;
        var index = moduleName.indexOf("!");
        if (index !== -1 || !ext || /^\//.test(moduleName)) ext = "";

        var paths = config.paths;
        var pkgs = config.packages;

        var testPath = moduleName;
        var tail = "";
        while (testPath) {
            if (paths[testPath]) {
                moduleName = paths[testPath] + tail;
                break;
            }
            if (pkgs[testPath]) {
                moduleName = pkgs[testPath].location + (tail || pkgs[testPath].main);
                break;
            }
            var i = testPath.lastIndexOf("/");
            if (i === -1) break;
            tail = testPath.substr(i) + tail;
            testPath = testPath.slice(0, i);
        }

        if (skipExt) return testPath;

        var url = ext == ".js" && moduleName.slice(-3) == ext ? moduleName : moduleName + ext;
        if (moduleName.slice(-3) == ".ts") {
            url = moduleName.slice(0, -3) + ext;
        }
        if (!absRe.test(url)) {
            if (ext == ".js" && require.config.transform) url = addTransform(url, moduleName);
            var baseUrl = config.baseUrl;
            if (baseUrl.slice(-1) != "/") baseUrl += "/";
            url = baseUrl + url;
        }
        if (url[0] == "/") url = host + url;
        return url;
    };

    function addTransform(url, moduleName) {
        var transform = require.config.transform;
        if (!Array.isArray(transform)) transform = [transform];
        return (
            "~/" +
            transform
                .map(function(part) {
                    if (typeof part == "string") return part;
                    if (moduleName.lastIndexOf(part[0], 0) != -1) return part[1];
                })
                .filter(Boolean)
                .join(",") +
            "/" +
            url
        ).replace("//", "/");
    }

    function loadText(path, callback) {
        var xhr = new global.XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.onload = function(e) {
            if (xhr.status > 399 && xhr.status < 600) return callback(xhr);
            callback(null, xhr.responseText, xhr);
        };
        xhr.onabort = xhr.onerror = function(e) {
            callback(e);
        };
        xhr.send("");
    }

    /*** cache ***/
    var host =
        location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    var loadScript = function(path, id, callback) {
        if (!/^\w+:/.test(path)) path = host + path;
        var onLoad = function(e, val) {
            if (e) return processLoadQueue({id: id, path: path});
            if (!/^(\s|\/\*([^*]|[*](?!\/))*\*\/|\/\/.*[\r]?\n)*define\s*\(\s*function\s*\(\s*require\b/.test(val) && !/define\(\[\],/.test(val))
                val = "define(function(require, exports, module){" + val + "\n});"
            nextModule = {name: id};
            /* eslint no-eval:0 */
            global.eval(val + "\n//# sourceURL=" + path);
            callback(null, id);
            return define.loaded[id];
        };
        loadCached(path, onLoad);
    };

    var loadCached = function(path, callback) {
        return loadText(path, callback);
    };

    require.load = function(module) {
        var i = module.indexOf("!") + 1;
        if (i) {
            var plugin = module.substring(0, i);
            module = module.substr(i);
            if (typeof require[plugin] == "function") {
                require[plugin](module, processLoadQueue);
            } else if (config.baseUrl) {
                if (require[plugin]) return (require[plugin][plugin + module] = 1);
                require[plugin] = Object.create(null);
                require[plugin][plugin + module] = 1;
                require([plugin.slice(0, -1)], function(p) {
                    var pending = require[plugin];
                    definePlugin(plugin, p);
                    Object.keys(pending).forEach(function(p) {
                        delete define.loading[p];
                    });
                    require(Object.keys(pending));
                });
            } else {
                console.error("require plugin " + plugin + "missing");
            }
        } else {
            var url = require.toUrl(module, ".js");
            if (define.fetchedUrls[url] & 1) return false;
            define.fetchedUrls[url] |= 1;
            loadScript(url, module, processLoadQueue);
        }
    };

    function definePlugin(plugin, p) {
        require[plugin] = function(moduleName, processLoadQueue) {
            p.load(moduleName, require, function(value) {
                define(plugin + moduleName, [], function() {
                    return value;
                });
                processLoadQueue();
            });
        };
    }

    /*** plugins ***/
    var syncLoaders = /^(language!|webworker!|vfs!|asset-url!)/;
    require["language!"] = function(module, callback) {
        define("language!" + module, [], module);
        callback();
    };
    require["webworker!"] = function(module, callback) {
        var url = require.toUrl(module.split("!").pop(), ".js");
        define("webworker!" + module, [], url);
        callback();
    };
    require["asset-url!"] = function(module, callback) {
        var url = require.toUrl(module.split("!").pop(), "", "", true);
        define("asset-url!" + module, [], url);
        callback();
    };
    require["vfs!"] = function(module, callback) {
        var url = require.MODULE_LOAD_URL + "/~node/" + module;
        if (define.fetchedUrls[url] & 4) return false;
        define.fetchedUrls[url] |= 4;
        define("vfs!" + module, [], {
            srcUrl: url,
            path: module,
        });
        callback();
    };
    require["text!"] = function(module, callback) {
        var url = require.toUrl(module);
        if (define.fetchedUrls[url] & 2) return false;
        define.fetchedUrls[url] |= 2;
        var onLoad = function(e, val) {
            if (e) console.error("Couldn't load module " + module, e);
            define("text!" + module, [], val);
            callback();
        };
        loadCached(url, onLoad);
    };
    require["json!"] = function(module, callback) {
        require["text!"](module, function() {
            var val = JSON.parse(require("text!" + module));
            define("json!" + module, [], val);
            callback();
        });
    };
    require["ace/requirejs/text!"] = function(module, callback) {
        var url = require.toUrl(module);
        if (define.fetchedUrls[url] & 2) return false;
        define.fetchedUrls[url] |= 2;
        var onLoad = function(e, val) {
            if (e) console.error("Couldn't load module " + module, e);
            define("ace/requirejs/text!" + module, [], val);
            callback();
        };
        loadCached(url, onLoad);
    };
    require["architect!"] = function(module, callback) {
        var url = require.toUrl(module, ".js");
        if (define.fetchedUrls[url] & 1) return false;
        define.fetchedUrls[url] |= 1;
        loadScript(url, "architect!" + module, processLoadQueue);
    };
    function activateArchitectModule(_1, _2, _3) {
        var module = this;
        return function() {
            module.pluginFactory(_1, _2, _3);
            if (typeof module.exports == "function" && module.exports.consumes) {
                return module.exports.apply(this, arguments);
            }
            return module.exports;
        };
    }

    /*** add global define ***/
    if (!global.define || !global.define.packaged) {
        define.original = global.define;
        global.define = define;
        global.define.packaged = true;
    }

    if (!global.require || !global.require.packaged) {
        global.require = require;
        global.require.packaged = true;
    }

    if (!global.requirejs) global.requirejs = require;

    global.miniRequire = require;
})();
