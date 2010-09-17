/**
 * @license RequireJS Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT, GPL or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//laxbreak is true to allow build pragmas to change some statements.
/*jslint plusplus: false, laxbreak: true */
/*global window: false, document: false, navigator: false,
setTimeout: false, traceDeps: true, clearInterval: false, self: false,
setInterval: false */

//>>includeStart("useStrict", pragmas.useStrict);
"use strict";
//>>includeEnd("useStrict");

var require;
(function () {
    //Change this version number for each release.
    var version = "0.10.0",
            empty = {}, s,
            i, defContextName = "_", contextLoads = [],
            scripts, script, rePkg, src, m, cfg, setReadyState,
            readyRegExp = /^(complete|loaded)$/,
            isBrowser = !!(typeof window !== "undefined" && navigator && document),
            ostring = Object.prototype.toString, scrollIntervalId;

    function isFunction(it) {
        return ostring.call(it) === "[object Function]";
    }

    //Check for an existing version of require. If so, then exit out. Only allow
    //one version of require to be active in a page. However, allow for a require
    //config object, just exit quickly if require is an actual function.
    if (typeof require !== "undefined") {
        if (isFunction(require)) {
            return;
        } else {
            //assume it is a config object.
            cfg = require;
        }
    }

    //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
    function makeContextFunc(name, contextName, force) {
        return function () {
            //A version of a require function that uses the current context.
            //If last arg is a string, then it is a context.
            //If last arg is not a string, then add context to it.
            var args = [].concat(Array.prototype.slice.call(arguments, 0));
            if (force || typeof arguments[arguments.length - 1] !== "string") {
                args.push(contextName);
            }
            return (name ? require[name] : require).apply(null, args);
        };
    }
    //>>excludeEnd("requireExcludeContext");
    
    //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
    /**
     * Calls a method on a plugin. The obj object should have two property,
     * name: the name of the method to call on the plugin
     * args: the arguments to pass to the plugin method.
     */
    function callPlugin(prefix, context, obj) {
        //Call the plugin, or load it.
        var plugin = s.plugins.defined[prefix], waiting;
        if (plugin) {
            plugin[obj.name].apply(null, obj.args);
        } else {
            //Put the call in the waiting call BEFORE requiring the module,
            //since the require could be synchronous in some environments,
            //like builds
            waiting = s.plugins.waiting[prefix] || (s.plugins.waiting[prefix] = []);
            waiting.push(obj);

            //Load the module
            context.defined.require(["require/" + prefix]);
        }
    }
    //>>excludeEnd("requireExcludePlugin");

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     */
    require = function (deps, callback, contextName) {
        if (typeof deps === "string" && !isFunction(callback)) {
            //Just return the module wanted. In this scenario, the
            //second arg (if passed) is just the contextName.
            return require.get(deps, callback);
        }

        //Do more work, either 
        return require.def.apply(require, arguments);
    };

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    require.def = function (name, deps, callback, contextName) {
        var config = null, context, newContext, contextRequire, loaded,
            canSetContext, prop, newLength, outDeps,
            mods, pluginPrefix, paths, index, i;

        //Normalize the arguments.
        if (typeof name === "string") {
            //Defining a module. First, pull off any plugin prefix.
            index = name.indexOf("!");
            if (index !== -1) {
                pluginPrefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }

            //Check if there are no dependencies, and adjust args.
            if (!require.isArray(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || s.ctxName;

            //If module already defined for context, or already waiting to be
            //evaluated, leave.
            context = s.contexts[contextName];
            if (context && (context.defined[name] || context.waiting[name])) {
                return require;
            }
        } else if (require.isArray(name)) {
            //Just some code that has dependencies. Adjust args accordingly.
            contextName = callback;
            callback = deps;
            deps = name;
            name = null;
        } else if (require.isFunction(name)) {
            //Just a function that does not define a module and
            //does not have dependencies. Useful if just want to wait
            //for whatever modules are in flight and execute some code after
            //those modules load.
            callback = name;
            contextName = deps;
            name = null;
            deps = [];
        } else {
            //name is a config object.
            config = name;
            name = null;
            //Adjust args if no dependencies.
            if (require.isFunction(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || config.context;
        }

        contextName = contextName || s.ctxName;

        //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
        if (contextName !== s.ctxName) {
            //If nothing is waiting on being loaded in the current context,
            //then switch s.ctxName to current contextName.
            loaded = (s.contexts[s.ctxName] && s.contexts[s.ctxName].loaded);
            canSetContext = true;
            if (loaded) {
                for (prop in loaded) {
                    if (!(prop in empty)) {
                        if (!loaded[prop]) {
                            canSetContext = false;
                            break;
                        }
                    }
                }
            }
            if (canSetContext) {
                s.ctxName = contextName;
            }
        }
        //>>excludeEnd("requireExcludeContext");

        //Grab the context, or create a new one for the given context name.
        context = s.contexts[contextName];
        if (!context) {
            newContext = {
                contextName: contextName,
                config: {
                    waitSeconds: 7,
                    baseUrl: s.baseUrl || "./",
                    paths: {}
                },
                waiting: [],
                specified: {
                    "require": true,
                    "exports": true,
                    "module": true
                },
                loaded: {
                    "require": true
                },
                defined: {},
                modifiers: {}
            };

            //Define require for this context.
            //>>includeStart("requireExcludeContext", pragmas.requireExcludeContext);
            //A placeholder for build pragmas.
            newContext.defined.require = require;
            //>>includeEnd("requireExcludeContext");
            //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
            newContext.defined.require = contextRequire = makeContextFunc(null, contextName);
            require.mixin(contextRequire, {
                //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
                modify: makeContextFunc("modify", contextName),
                def: makeContextFunc("def", contextName),
                //>>excludeEnd("requireExcludeModify");
                get: makeContextFunc("get", contextName, true),
                nameToUrl: makeContextFunc("nameToUrl", contextName, true),
                ready: require.ready,
                context: newContext,
                config: newContext.config,
                isBrowser: s.isBrowser
            });
            //>>excludeEnd("requireExcludeContext");

            //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
            if (s.plugins.newContext) {
                s.plugins.newContext(newContext);
            }
            //>>excludeEnd("requireExcludePlugin");

            context = s.contexts[contextName] = newContext;
        }

        //If have a config object, update the context's config object with
        //the config values.
        if (config) {
            //Make sure the baseUrl ends in a slash.
            if (config.baseUrl) {
                if (config.baseUrl.charAt(config.baseUrl.length - 1) !== "/") {
                    config.baseUrl += "/";
                }
            }

            //Save off the paths since they require special processing,
            //they are additive.
            paths = context.config.paths;

            //Mix in the config values, favoring the new values over
            //existing ones in context.config.
            require.mixin(context.config, config, true);

            //Adjust paths if necessary.
            if (config.paths) {
                for (prop in config.paths) {
                    if (!(prop in empty)) {
                        paths[prop] = config.paths[prop];
                    }
                }
                context.config.paths = paths;
            }

            //If a deps array or a config callback is specified, then call
            //require with those args. This is useful when require is defined as a
            //config object before require.js is loaded.
            if (config.deps || config.callback) {
                require(config.deps || [], config.callback);
            }

            //>>excludeStart("requireExcludePageLoad", pragmas.requireExcludePageLoad);
            //Set up ready callback, if asked. Useful when require is defined as a
            //config object before require.js is loaded.
            if (config.ready) {
                require.ready(config.ready);
            }
            //>>excludeEnd("requireExcludePageLoad");

            //If it is just a config block, nothing else,
            //then return.
            if (!deps) {
                return require;
            }
        }

        //Normalize dependency strings: need to determine if they have
        //prefixes and to also normalize any relative paths. Replace the deps
        //array of strings with an array of objects.
        if (deps) {
            outDeps = deps;
            deps = [];
            for (i = 0; i < outDeps.length; i++) {
                deps[i] = require.splitPrefix(outDeps[i], name);
            }
        }

        //Store the module for later evaluation
        newLength = context.waiting.push({
            name: name,
            deps: deps,
            callback: callback
        });

        if (name) {
            //Store index of insertion for quick lookup
            context.waiting[name] = newLength - 1;

            //Mark the module as specified: not loaded yet, but in the process,
            //so no need to fetch it again. Important to do it here for the
            //pause/resume case where there are multiple modules in a file.
            context.specified[name] = true;

            //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
            //Load any modifiers for the module.
            mods = context.modifiers[name];
            if (mods) {
                require(mods, contextName);
            }
            //>>excludeEnd("requireExcludeModify");
        }

        //If the callback is not an actual function, it means it already
        //has the definition of the module as a literal value.
        if (name && callback && !require.isFunction(callback)) {
            context.defined[name] = callback;
        }

        //If a pluginPrefix is available, call the plugin, or load it.
        //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
        if (pluginPrefix) {
            callPlugin(pluginPrefix, context, {
                name: "require",
                args: [name, deps, callback, context]
            });
        }
        //>>excludeEnd("requireExcludePlugin");

        //See if all is loaded. If paused, then do not check the dependencies
        //of the module yet.
        if (s.paused) {
            s.paused.push([pluginPrefix, name, deps, context]);
        } else {
            require.checkDeps(pluginPrefix, name, deps, context);
            require.checkLoaded(contextName);
        }

        return require;
    };

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    require.mixin = function (target, source, override) {
        for (var prop in source) {
            if (!(prop in empty) && (!(prop in target) || override)) {
                target[prop] = source[prop];
            }
        }
        return require;
    };

    require.version = version;

    //Set up page state.
    s = require.s = {
        ctxName: defContextName,
        contexts: {},
        //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
        plugins: {
            defined: {},
            callbacks: {},
            waiting: {}
        },
        //>>excludeEnd("requireExcludePlugin");
        isBrowser: isBrowser,
        isPageLoaded: !isBrowser,
        readyCalls: [],
        doc: isBrowser ? document : null
    };

    require.isBrowser = s.isBrowser;
    s.head = isBrowser ? document.getElementsByTagName("head")[0] : null;

    //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
    /**
     * Sets up a plugin callback name. Want to make it easy to test if a plugin
     * needs to be called for a certain lifecycle event by testing for
     * if (s.plugins.onLifeCyleEvent) so only define the lifecycle event
     * if there is a real plugin that registers for it.
     */
    function makePluginCallback(name, returnOnTrue) {
        var cbs = s.plugins.callbacks[name] = [];
        s.plugins[name] = function () {
            for (var i = 0, cb; (cb = cbs[i]); i++) {
                if (cb.apply(null, arguments) === true && returnOnTrue) {
                    return true;
                }
            }
            return false;
        };
    }

    /**
     * Registers a new plugin for require.
     */
    require.plugin = function (obj) {
        var i, prop, call, prefix = obj.prefix, cbs = s.plugins.callbacks,
            waiting = s.plugins.waiting[prefix], generics,
            defined = s.plugins.defined, contexts = s.contexts, context;

        //Do not allow redefinition of a plugin, there may be internal
        //state in the plugin that could be lost.
        if (defined[prefix]) {
            return require;
        }

        //Save the plugin.
        defined[prefix] = obj;

        //Set up plugin callbacks for methods that need to be generic to
        //require, for lifecycle cases where it does not care about a particular
        //plugin, but just that some plugin work needs to be done.
        generics = ["newContext", "isWaiting", "orderDeps"];
        for (i = 0; (prop = generics[i]); i++) {
            if (!s.plugins[prop]) {
                makePluginCallback(prop, prop === "isWaiting");
            }
            cbs[prop].push(obj[prop]);
        }

        //Call newContext for any contexts that were already created.
        if (obj.newContext) {
            for (prop in contexts) {
                if (!(prop in empty)) {
                    context = contexts[prop];
                    obj.newContext(context);
                }
            }
        }

        //If there are waiting requests for a plugin, execute them now.
        if (waiting) {
            for (i = 0; (call = waiting[i]); i++) {
                if (obj[call.name]) {
                    obj[call.name].apply(null, call.args);
                }
            }
            delete s.plugins.waiting[prefix];
        }

        return require;
    };
    //>>excludeEnd("requireExcludePlugin");

    /**
     * Pauses the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file, and they all need to be
     * require before figuring out what is left still to load.
     */
    require.pause = function () {
        if (!s.paused) {
            s.paused = [];
        }
    };

    /**
     * Resumes the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file. This method is related
     * to require.pause() and should only be called if require.pause() was called first.
     */
    require.resume = function () {
        var i, args, paused;
        if (s.paused) {
            paused = s.paused;
            delete s.paused;
            for (i = 0; (args = paused[i]); i++) {
                require.checkDeps.apply(require, args);
            }
        }
        require.checkLoaded(s.ctxName);
    };

    /**
     * Trace down the dependencies to see if they are loaded. If not, trigger
     * the load.
     * @param {String} pluginPrefix the plugin prefix, if any associated with the name.
     *
     * @param {String} name: the name of the module that has the dependencies.
     *
     * @param {Array} deps array of dependencies.
     *
     * @param {Object} context: the loading context.
     *
     * @private
     */
    require.checkDeps = function (pluginPrefix, name, deps, context) {
        //Figure out if all the modules are loaded. If the module is not
        //being loaded or already loaded, add it to the "to load" list,
        //and request it to be loaded.
        var i, dep, index, depPrefix, split;

        if (pluginPrefix) {
            //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
            callPlugin(pluginPrefix, context, {
                name: "checkDeps",
                args: [name, deps, context]
            });
            //>>excludeEnd("requireExcludePlugin");
        } else {
            for (i = 0; (dep = deps[i]); i++) {
                if (!context.specified[dep.fullName]) {
                    context.specified[dep.fullName] = true;

                    //If a plugin, call its load method.
                    if (dep.prefix) {
                        //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
                        callPlugin(dep.prefix, context, {
                            name: "load",
                            args: [dep.name, context.contextName]
                        });
                        //>>excludeEnd("requireExcludePlugin");
                    } else {
                        require.load(dep.name, context.contextName);
                    }
                }
            }
        }
    };

    //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
    /**
     * Register a module that modifies another module. The modifier will
     * only be called once the target module has been loaded.
     *
     * First syntax:
     *
     * require.modify({
     *     "some/target1": "my/modifier1",
     *     "some/target2": "my/modifier2",
     * });
     *
     * With this syntax, the my/modifier1 will only be loaded when
     * "some/target1" is loaded.
     *
     * Second syntax, defining a modifier.
     *
     * require.modify("some/target1", "my/modifier",
     *                        ["some/target1", "some/other"],
     *                        function (target, other) {
     *                            //Modify properties of target here.
     *                            Only properties of target can be modified, but
     *                            target cannot be replaced.
     *                        }
     * );
     */
    require.modify = function (target, name, deps, callback, contextName) {
        var prop, modifier, list,
                cName = (typeof target === "string" ? contextName : name) || s.ctxName,
                context = s.contexts[cName],
                mods = context.modifiers;

        if (typeof target === "string") {
            //A modifier module.
            //First store that it is a modifier.
            list = mods[target] || (mods[target] = []);
            if (!list[name]) {
                list.push(name);
                list[name] = true;
            }

            //Trigger the normal module definition logic.
            require.def(name, deps, callback, contextName);
        } else {
            //A list of modifiers. Save them for future reference.
            for (prop in target) {
                if (!(prop in empty)) {
                    //Store the modifier for future use.
                    modifier = target[prop];
                    list = context.modifiers[prop] || (context.modifiers[prop] = []);
                    if (!list[modifier]) {
                        list.push(modifier);
                        list[modifier] = true;

                        if (context.specified[prop]) {
                            //Load the modifier right away.
                            require([modifier], cName);
                        }
                    }
                }
            }
        }
    };
    //>>excludeEnd("requireExcludeModify");

    require.isArray = function (it) {
        return ostring.call(it) === "[object Array]";
    };

    require.isFunction = isFunction;

    /**
     * Gets one module's exported value. This method is used by require().
     * It is broken out as a separate function to allow a host environment
     * shim to overwrite this function with something appropriate for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} [contextName] the name of the context to use. Uses
     * default context if no contextName is provided.
     *
     * @returns {Object} the exported module value.
     */
    require.get = function (moduleName, contextName) {
        if (moduleName === "exports" || moduleName === "module") {
            throw new Error("require of " + moduleName + " is not allowed.");
        }
        contextName = contextName || s.ctxName;
        var ret = s.contexts[contextName].defined[moduleName];
        if (ret === undefined) {
            throw new Error("require: module name '" +
                            moduleName +
                            "' has not been loaded yet for context: " +
                            contextName);
        }
        return ret;
    };

    /**
     * Makes the request to load a module. May be an async load depending on
     * the environment and the circumstance of the load call. Override this
     * method in a host environment shim to do something specific for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} contextName the name of the context to use.
     */
    require.load = function (moduleName, contextName) {
        var context = s.contexts[contextName], url;
        s.isDone = false;
        context.loaded[moduleName] = false;
        //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
        if (contextName !== s.ctxName) {
            //Not in the right context now, hold on to it until
            //the current context finishes all its loading.
            contextLoads.push(arguments);
        } else {
        //>>excludeEnd("requireExcludeContext");
            //First derive the path name for the module.
            url = require.nameToUrl(moduleName, null, contextName);
            require.attach(url, contextName, moduleName);
            context.startTime = (new Date()).getTime();
        //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
        }
        //>>excludeEnd("requireExcludeContext");
    };

    require.jsExtRegExp = /\.js$/;

    
    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    require.normalizeName = function (name, baseName) {
        //Adjust any relative paths.
        var part;
        if (name.charAt(0) === ".") {
            //Convert baseName to array, and lop off the last part,
            //so that . matches that "directory" and not name of the baseName's
            //module. For instance, baseName of "one/two/three", maps to
            //"one/two/three.js", but we want the directory, "one/two" for
            //this normalization.
            baseName = baseName.split("/");
            baseName = baseName.slice(0, baseName.length - 1);

            name = baseName.concat(name.split("/"));
            for (i = 0; (part = name[i]); i++) {
                if (part === ".") {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === "..") {
                    name.splice(i - 1, 2);
                    i -= 2;
                }
            }
            name = name.join("/");
        }
        return name;
    };

    /**
     * Splits a name into a possible plugin prefix and
     * the module name. If baseName is provided it will
     * also normalize the name via require.normalizeName()
     * 
     * @param {String} name the module name
     * @param {String} [baseName] base name that name is
     * relative to.
     *
     * @returns {Object} with properties, 'prefix' (which
     * may be null), 'name' and 'fullName', which is a combination
     * of the prefix (if it exists) and the name.
     */
    require.splitPrefix = function (name, baseName) {
        var index = name.indexOf("!"), prefix = null;
        if (index !== -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }

        //Account for relative paths if there is a base name.
        if (baseName) {
            name = require.normalizeName(name, baseName);
        }

        return {
            prefix: prefix,
            name: name,
            fullName: prefix ? prefix + "!" + name : name
        };
    };

    /**
     * Converts a module name to a file path.
     */
    require.nameToUrl = function (moduleName, ext, contextName) {
        var paths, syms, i, parentModule, url,
            config = s.contexts[contextName].config;

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash or ends with .js, it is just a plain file.
        //The slash is important for protocol-less URLs as well as full paths.
        if (moduleName.indexOf(":") !== -1 || moduleName.charAt(0) === '/' || require.jsExtRegExp.test(moduleName)) {
            //Just a plain path, not module name lookup, so just return it.
            return moduleName;
        } else if (moduleName.charAt(0) === ".") {
            throw new Error("require.nameToUrl does not handle relative module names (ones that start with '.' or '..')");
        } else {
            //A module that needs to be converted to a path.
            paths = config.paths;

            syms = moduleName.split("/");
            //For each module name segment, see if there is a path
            //registered for it. Start with most specific name
            //and work up from it.
            for (i = syms.length; i > 0; i--) {
                parentModule = syms.slice(0, i).join("/");
                if (paths[parentModule]) {
                    syms.splice(0, i, paths[parentModule]);
                    break;
                }
            }

            //Join the path parts together, then figure out if baseUrl is needed.
            url = syms.join("/") + (ext || ".js");
            return ((url.charAt(0) === '/' || url.match(/^\w+:/)) ? "" : config.baseUrl) + url;
        }
    };

    /**
     * Checks if all modules for a context are loaded, and if so, evaluates the
     * new ones in right dependency order.
     *
     * @private
     */
    require.checkLoaded = function (contextName) {
        var context = s.contexts[contextName || s.ctxName],
                waitInterval = context.config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                loaded = context.loaded, defined = context.defined,
                modifiers = context.modifiers, waiting = context.waiting, noLoads = "",
                hasLoadedProp = false, stillLoading = false, prop,

                //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
                pIsWaiting = s.plugins.isWaiting, pOrderDeps = s.plugins.orderDeps,
                //>>excludeEnd("requireExcludePlugin");

                i, module, allDone, loads, loadArgs,
                traced = {};

        //If already doing a checkLoaded call,
        //then do not bother checking loaded state.
        if (context.isCheckLoaded) {
            return;
        }

        //Signal that checkLoaded is being require, so other calls that could be triggered
        //by calling a waiting callback that then calls require and then this function
        //should not proceed. At the end of this function, if there are still things
        //waiting, then checkLoaded will be called again.
        context.isCheckLoaded = true;

        //See if anything is still in flight.
        for (prop in loaded) {
            if (!(prop in empty)) {
                hasLoadedProp = true;
                if (!loaded[prop]) {
                    if (expired) {
                        noLoads += prop + " ";
                    } else {
                        stillLoading = true;
                        break;
                    }
                }
            }
        }

        //Check for exit conditions.
        if (!hasLoadedProp && !waiting.length
            //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
            && (!pIsWaiting || !pIsWaiting(context))
            //>>excludeEnd("requireExcludePlugin");
           ) {
            //If the loaded object had no items, then the rest of
            //the work below does not need to be done.
            context.isCheckLoaded = false;
            return;
        }
        if (expired && noLoads) {
            //If wait time expired, throw error of unloaded modules.
            throw new Error("require.js load timeout for modules: " + noLoads);
        }
        if (stillLoading) {
            //Something is still waiting to load. Wait for it.
            context.isCheckLoaded = false;
            if (require.isBrowser) {
                setTimeout(function () {
                    require.checkLoaded(contextName);
                }, 50);
            }
            return;
        }

        //Order the dependencies. Also clean up state because the evaluation
        //of modules might create new loading tasks, so need to reset.
        //Be sure to call plugins too.
        context.waiting = [];
        context.loaded = {};

        //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
        //Call plugins to order their dependencies, do their
        //module definitions.
        if (pOrderDeps) {
            pOrderDeps(context);
        }
        //>>excludeEnd("requireExcludePlugin");

        //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
        //Before defining the modules, give priority treatment to any modifiers
        //for modules that are already defined.
        for (prop in modifiers) {
            if (!(prop in empty)) {
                if (defined[prop]) {
                    require.execModifiers(prop, traced, waiting, context);
                }
            }
        }
        //>>excludeEnd("requireExcludeModify");

        //Define the modules, doing a depth first search.
        for (i = 0; (module = waiting[i]); i++) {
            require.exec(module, traced, waiting, context);
        }

        //Indicate checkLoaded is now done.
        context.isCheckLoaded = false;

        if (context.waiting.length
            //>>excludeStart("requireExcludePlugin", pragmas.requireExcludePlugin);
            || (pIsWaiting && pIsWaiting(context))
            //>>excludeEnd("requireExcludePlugin");
           ) {
            //More things in this context are waiting to load. They were probably
            //added while doing the work above in checkLoaded, calling module
            //callbacks that triggered other require calls.
            require.checkLoaded(contextName);
        } else if (contextLoads.length) {
            //>>excludeStart("requireExcludeContext", pragmas.requireExcludeContext);
            //Check for other contexts that need to load things.
            //First, make sure current context has no more things to
            //load. After defining the modules above, new require calls
            //could have been made.
            loaded = context.loaded;
            allDone = true;
            for (prop in loaded) {
                if (!(prop in empty)) {
                    if (!loaded[prop]) {
                        allDone = false;
                        break;
                    }
                }
            }

            if (allDone) {
                s.ctxName = contextLoads[0][1];
                loads = contextLoads;
                //Reset contextLoads in case some of the waiting loads
                //are for yet another context.
                contextLoads = [];
                for (i = 0; (loadArgs = loads[i]); i++) {
                    require.load.apply(require, loadArgs);
                }
            }
            //>>excludeEnd("requireExcludeContext");
        } else {
            //Make sure we reset to default context.
            s.ctxName = defContextName;
            s.isDone = true;
            if (require.callReady) {
                require.callReady();
            }
        }
    };

    /**
     * Executes the modules in the correct order.
     * 
     * @private
     */
    require.exec = function (module, traced, waiting, context) {
        //Some modules are just plain script files, abddo not have a formal
        //module definition, 
        if (!module) {
            return undefined;
        }

        var name = module.name, cb = module.callback, deps = module.deps, j, dep,
            defined = context.defined, ret, args = [], prefix, depModule,
            usingExports = false, depName;

        //If already traced or defined, do not bother a second time.
        if (name) {
            if (traced[name] || defined[name]) {
                return defined[name];
            }
    
            //Mark this module as being traced, so that it is not retraced (as in a circular
            //dependency)
            traced[name] = true;
        }

        if (deps) {
            for (j = 0; (dep = deps[j]); j++) {
                depName = dep.name;
                if (depName === "exports") {
                    //CommonJS module spec 1.1
                    depModule = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    depModule = {
                        id: name,
                        uri: name ? require.nameToUrl(name, null, context.contextName) : undefined
                    };
                } else {
                    //Get dependent module. It could not exist, for a circular
                    //dependency or if the loaded dependency does not actually call
                    //require. Favor not throwing an error here if undefined because
                    //we want to allow code that does not use require as a module
                    //definition framework to still work -- allow a web site to
                    //gradually update to contained modules. That is more
                    //important than forcing a throw for the circular dependency case.
                    depModule = depName in defined ? defined[depName] : (traced[depName] ? undefined : require.exec(waiting[waiting[depName]], traced, waiting, context));
                }

                args.push(depModule);
            }
        }

        //Call the callback to define the module, if necessary.
        cb = module.callback;
        if (cb && require.isFunction(cb)) {
            ret = require.execCb(name, cb, args);
            if (name) {
                if (usingExports) {
                    ret = defined[name];
                } else {
                    if (name in defined) {
                        throw new Error(name + " has already been defined");
                    } else {
                        defined[name] = ret;
                    }
                }
            }
        }

        //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
        //Execute modifiers, if they exist.
        require.execModifiers(name, traced, waiting, context);
        //>>excludeEnd("requireExcludeModify");

        return ret;
    };

    /**
     * Executes a module callack function. Broken out as a separate function
     * solely to allow the build system to sequence the files in the built
     * layer in the right sequence.
     * @param {String} name the module name.
     * @param {Function} cb the module callback/definition function.
     * @param {Array} args The arguments (dependent modules) to pass to callback.
     *
     * @private
     */
    require.execCb = function (name, cb, args) {
        return cb.apply(null, args);
    };

    //>>excludeStart("requireExcludeModify", pragmas.requireExcludeModify);
    /**
     * Executes modifiers for the given module name.
     * @param {String} target
     * @param {Object} traced
     * @param {Object} context
     *
     * @private
     */
    require.execModifiers = function (target, traced, waiting, context) {
        var modifiers = context.modifiers, mods = modifiers[target], mod, i;
        if (mods) {
            for (i = 0; i < mods.length; i++) {
                mod = mods[i];
                //Not all modifiers define a module, they might collect other modules.
                //If it is just a collection it will not be in waiting.
                if (mod in waiting) {
                    require.exec(waiting[waiting[mod]], traced, waiting, context);
                }
            }
            delete modifiers[target];
        }
    };
    //>>excludeEnd("requireExcludeModify");

    /**
     * callback for script loads, used to check status of loading.
     *
     * @param {Event} evt the event from the browser for the script
     * that was loaded.
     *
     * @private
     */
    require.onScriptLoad = function (evt) {
        var node = evt.target || evt.srcElement, contextName, moduleName;
        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");

            //Mark the module loaded.
            s.contexts[contextName].loaded[moduleName] = true;

            require.checkLoaded(contextName);

            //Clean up script binding.
            if (node.removeEventListener) {
                node.removeEventListener("load", require.onScriptLoad, false);
            } else {
                //Probably IE.
                node.detachEvent("onreadystatechange", require.onScriptLoad);
            }
        }
    };

    /**
     * Attaches the script represented by the URL to the current
     * environment. Right now only supports browser loading,
     * but can be redefined in other environments to do the right thing.
     */
    require.attach = function (url, contextName, moduleName) {
        if (require.isBrowser) {
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.setAttribute("data-requirecontext", contextName);
            node.setAttribute("data-requiremodule", moduleName);
    
            //Set up load listener.
            if (node.addEventListener) {
                node.addEventListener("load", require.onScriptLoad, false);
            } else {
                //Probably IE.
                node.attachEvent("onreadystatechange", require.onScriptLoad);
            }
            node.src = url;

            return s.head.appendChild(node);
        }
        return null;
    };

    //Determine what baseUrl should be if not already defined via a require config object
    s.baseUrl = cfg && cfg.baseUrl;
    if (require.isBrowser && (!s.baseUrl || !s.head)) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        scripts = document.getElementsByTagName("script");
        if (cfg && cfg.baseUrlMatch) {
            rePkg = cfg.baseUrlMatch;
        } else {
            //>>includeStart("jquery", pragmas.jquery);
            rePkg = /(requireplugins-|require-)?jquery[\-\d\.]*(min)?\.js(\W|$)/i;
            //>>includeEnd("jquery");

            //>>includeStart("dojoConvert", pragmas.dojoConvert);
            rePkg = /dojo\.js(\W|$)/i;
            //>>includeEnd("dojoConvert");

            //>>excludeStart("dojoConvert", pragmas.dojoConvert);

            //>>excludeStart("jquery", pragmas.jquery);
            rePkg = /(allplugins-)?require\.js(\W|$)/i;
            //>>excludeEnd("jquery");

            //>>excludeEnd("dojoConvert");
        }

        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            //Set the "head" where we can append children by
            //using the script's parent.
            if (!s.head) {
                s.head = script.parentNode;
            }
            //Using .src instead of getAttribute to get an absolute URL.
            //While using a relative URL will be fine for script tags, other
            //URLs used for text! resources that use XHR calls might benefit
            //from an absolute URL.
            src = script.src;
            if (src) {
                m = src.match(rePkg);
                if (m) {
                    s.baseUrl = src.substring(0, m.index);
                    break;
                }
            }
        }
    }

    //>>excludeStart("requireExcludePageLoad", pragmas.requireExcludePageLoad);
    //****** START page load functionality ****************
    /**
     * Sets the page as loaded and triggers check for all modules loaded.
     */
    require.pageLoaded = function () {
        if (!s.isPageLoaded) {
            s.isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            //Part of a fix for FF < 3.6 where readyState was not set to
            //complete so libraries like jQuery that check for readyState
            //after page load where not getting initialized correctly.
            //Original approach suggested by Andrea Giammarchi:
            //http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
            //see other setReadyState reference for the rest of the fix.
            if (setReadyState) {
                document.readyState = "complete";
            }

            require.callReady();
        }
    };

    /**
     * Internal function that calls back any ready functions. If you are
     * integrating RequireJS with another library without require.ready support,
     * you can define this method to call your page ready code instead.
     */
    require.callReady = function () {
        var callbacks = s.readyCalls, i, callback;

        if (s.isPageLoaded && s.isDone && callbacks.length) {
            s.readyCalls = [];
            for (i = 0; (callback = callbacks[i]); i++) {
                callback();
            }
        }
    };

    /**
     * Registers functions to call when the page is loaded
     */
    require.ready = function (callback) {
        if (s.isPageLoaded && s.isDone) {
            callback();
        } else {
            s.readyCalls.push(callback);
        }
        return require;
    };

    if (require.isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", require.pageLoaded, false);
            window.addEventListener("load", require.pageLoaded, false);
            //Part of FF < 3.6 readystate fix (see setReadyState refs for more info)
            if (!document.readyState) {
                setReadyState = true;
                document.readyState = "loading";
            }
        } else if (window.attachEvent) {
            window.attachEvent("onload", require.pageLoaded);

            //DOMContentLoaded approximation, as found by Diego Perini:
            //http://javascript.nwbox.com/IEContentLoaded/
            if (self === self.top) {
                scrollIntervalId = setInterval(function () {
                    try {
                        document.documentElement.doScroll("left");
                        require.pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. NOTE: does not work with Firefox before 3.6. To support
        //those browsers, manually call require.pageLoaded().
        if (document.readyState === "complete") {
            require.pageLoaded();
        }
    }
    //****** END page load functionality ****************
    //>>excludeEnd("requireExcludePageLoad");

    //Set up default context. If require was a configuration object, use that as base config.
    if (cfg) {
        require(cfg);
    }
}());
