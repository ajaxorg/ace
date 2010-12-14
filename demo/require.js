/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//laxbreak is true to allow build pragmas to change some statements.
/*jslint plusplus: false, nomen: false, laxbreak: true, regexp: false */
/*global window: false, document: false, navigator: false,
setTimeout: false, traceDeps: true, clearInterval: false, self: false,
setInterval: false, importScripts: false, jQuery: false */


var require, define;
(function () {
    //Change this version number for each release.
    var version = "0.14.5+",
            empty = {}, s,
            i, defContextName = "_", contextLoads = [],
            scripts, script, rePkg, src, m, dataMain, cfg = {}, setReadyState,
            commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,
            cjsRequireRegExp = /require\(["']([\w\!\-_\.\/]+)["']\)/g,
            main,
            isBrowser = !!(typeof window !== "undefined" && navigator && document),
            isWebWorker = !isBrowser && typeof importScripts !== "undefined",
            //PS3 indicates loaded and complete, but need to wait for complete
            //specifically. Sequence is "loading", "loaded", execution,
            // then "complete". The UA check is unfortunate, but not sure how
            //to feature test w/o causing perf issues.
            readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/,
            ostring = Object.prototype.toString,
            ap = Array.prototype,
            aps = ap.slice, scrollIntervalId, req, baseElement,
            defQueue = [], useInteractive = false, currentlyAddingScript;

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
            req(["require/" + prefix], context.contextName);
        }
    }
    
    /**
     * Convenience method to call main for a require.def call that was put on
     * hold in the defQueue.
     */
    function callDefMain(args, context) {
        main.apply(req, args);
        //Mark the module loaded. Must do it here in addition
        //to doing it in require.def in case a script does
        //not call require.def
        context.loaded[args[0]] = true;
    }

    /**
     * Used to set up package paths from a packagePaths or packages config object.
     * @param {Object} packages the object to store the new package config
     * @param {Array} currentPackages an array of packages to configure
     * @param {String} [dir] a prefix dir to use.
     */
    function configurePackageDir(packages, currentPackages, dir) {
        var i, location, pkgObj;
        for (i = 0; (pkgObj = currentPackages[i]); i++) {
            pkgObj = typeof pkgObj === "string" ? { name: pkgObj } : pkgObj;
            location = pkgObj.location;

            //Add dir to the path, but avoid paths that start with a slash
            //or have a colon (indicates a protocol)
            if (dir && (!location || (location.indexOf("/") !== 0 && location.indexOf(":") === -1))) {
                pkgObj.location = dir + "/" + (pkgObj.location || pkgObj.name);
            }

            //Normalize package paths.
            pkgObj.location = pkgObj.location || pkgObj.name;
            pkgObj.lib = pkgObj.lib || "lib";
            pkgObj.main = pkgObj.main || "main";

            packages[pkgObj.name] = pkgObj;
        }
    }

    /**
     * Determine if priority loading is done. If so clear the priorityWait
     */
    function isPriorityDone(context) {
        var priorityDone = true,
            priorityWait = context.config.priorityWait,
            priorityName, i;
        if (priorityWait) {
            for (i = 0; (priorityName = priorityWait[i]); i++) {
                if (!context.loaded[priorityName]) {
                    priorityDone = false;
                    break;
                }
            }
            if (priorityDone) {
                delete context.config.priorityWait;
            }
        }
        return priorityDone;
    }

    /**
     * Resumes tracing of dependencies and then checks if everything is loaded.
     */
    function resume(context) {
        var args, i, paused = s.paused;
        if (context.scriptCount <= 0) {
            //Synchronous envs will push the number below zero with the
            //decrement above, be sure to set it back to zero for good measure.
            //require() calls that also do not end up loading scripts could
            //push the number negative too.
            context.scriptCount = 0;

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    req.onError(new Error('Mismatched anonymous require.def modules'));
                } else {
                    callDefMain(args, context);
                }
            }

            //Skip the resume if current context is in priority wait.
            if (context.config.priorityWait && !isPriorityDone(context)) {
                return;
            }

            if (paused.length) {
                for (i = 0; (args = paused[i]); i++) {
                    req.checkDeps.apply(req, args);
                }
            }

            req.checkLoaded(s.ctxName);
        }
    }

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
    require = function (deps, callback, contextName, relModuleName) {
        var context, config;
        if (typeof deps === "string" && !isFunction(callback)) {
            //Just return the module wanted. In this scenario, the
            //second arg (if passed) is just the contextName.
            return require.get(deps, callback, contextName, relModuleName);
        }
        // Dependencies first
        if (!require.isArray(deps)) {
            // deps is a config object
            config = deps;
            if (require.isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = contextName;
                contextName = relModuleName;
                relModuleName = arguments[4];
            } else {
                deps = [];
            }
        }

        main(null, deps, callback, config, contextName, relModuleName);

        //If the require call does not trigger anything new to load,
        //then resume the dependency processing. Context will be undefined
        //on first run of require.
        context = s.contexts[(contextName || (config && config.context) || s.ctxName)];
        if (context && context.scriptCount === 0) {
            resume(context);
        }
        //Returning undefined for Spidermonky strict checking in Komodo
        return undefined;
    };

    //Alias for caja compliance internally -
    //specifically: "Dynamically computed names should use require.async()"
    //even though this spec isn't really decided on.
    //Since it is here, use this alias to make typing shorter.
    req = require;

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * If you do override it, this method should *always* throw an error
     * to stop the execution flow correctly. Otherwise, other weird errors
     * will occur.
     * @param {Error} err the error object.
     */
    req.onError = function (err) {
        throw err;
    };

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = req.def = function (name, deps, callback, contextName) {
        var i, scripts, script, node = currentlyAddingScript;

        //Allow for anonymous functions
        if (typeof name !== 'string') {
            //Adjust args appropriately
            contextName = callback;
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!req.isArray(deps)) {
            contextName = callback;
            callback = deps;
            deps = [];
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!name && !deps.length && req.isFunction(callback)) {
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies.
            callback
                .toString()
                .replace(commentRegExp, "")
                .replace(cjsRequireRegExp, function (match, dep) {
                    deps.push(dep);
                });

            //May be a CommonJS thing even without require calls, but still
            //could use exports, and such, so always add those as dependencies.
            //This is a bit wasteful for RequireJS modules that do not need
            //an exports or module object, but erring on side of safety.
            //REQUIRES the function to expect the CommonJS variables in the
            //order listed below.
            deps = ["require", "exports", "module"].concat(deps);
        }

        //If in IE 6-8 and hit an anonymous require.def call, do the interactive/
        //currentlyAddingScript scripts stuff.
        if (!name && useInteractive) {
            scripts = document.getElementsByTagName('script');
            for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
                if (script.readyState === 'interactive') {
                    node = script;
                    break;
                }
            }
            if (!node) {
                req.onError(new Error("ERROR: No matching script interactive for " + callback));
            }

            name = node.getAttribute("data-requiremodule");
        }

        if (typeof name === 'string') {
            //Do not try to auto-register a jquery later.
            //Do this work here and in main, since for IE/useInteractive, this function
            //is the earliest touch-point.
            s.contexts[s.ctxName].jQueryDef = (name === "jquery");
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs.
        defQueue.push([name, deps, callback, null, contextName]);
    };

    main = function (name, deps, callback, config, contextName, relModuleName) {
        //Grab the context, or create a new one for the given context name.
        var context, newContext, loaded, pluginPrefix,
            canSetContext, prop, newLength, outDeps, mods, paths, index, i,
            deferMods, deferModArgs, lastModArg, waitingName, packages,
            packagePaths;

        contextName = contextName ? contextName : (config && config.context ? config.context : s.ctxName);
        context = s.contexts[contextName];

        if (name) {
                        // Pull off any plugin prefix.
            index = name.indexOf("!");
            if (index !== -1) {
                pluginPrefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            } else {
                //Could be that the plugin name should be auto-applied.
                //Used by i18n plugin to enable anonymous i18n modules, but
                //still associating the auto-generated name with the i18n plugin.
                pluginPrefix = context.defPlugin[name];
            }

            
            //If module already defined for context, or already waiting to be
            //evaluated, leave.
            waitingName = context.waiting[name];
            if (context && (context.defined[name] || (waitingName && waitingName !== ap[name]))) {
                return;
            }
        }

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

        if (!context) {
            newContext = {
                contextName: contextName,
                config: {
                    waitSeconds: 7,
                    baseUrl: s.baseUrl || "./",
                    paths: {},
                    packages: {}
                },
                waiting: [],
                specified: {
                    "require": true,
                    "exports": true,
                    "module": true
                },
                loaded: {},
                scriptCount: 0,
                urlFetched: {},
                defPlugin: {},
                defined: {},
                modifiers: {}
            };

                        if (s.plugins.newContext) {
                s.plugins.newContext(newContext);
            }
            
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

            //Save off the paths and packages since they require special processing,
            //they are additive.
            paths = context.config.paths;
            packages = context.config.packages;

            //Mix in the config values, favoring the new values over
            //existing ones in context.config.
            req.mixin(context.config, config, true);

            //Adjust paths if necessary.
            if (config.paths) {
                for (prop in config.paths) {
                    if (!(prop in empty)) {
                        paths[prop] = config.paths[prop];
                    }
                }
                context.config.paths = paths;
            }

            packagePaths = config.packagePaths;
            if (packagePaths || config.packages) {
                //Convert packagePaths into a packages config.
                if (packagePaths) {
                    for (prop in packagePaths) {
                        if (!(prop in empty)) {
                            configurePackageDir(packages, packagePaths[prop], prop);
                        }
                    }
                }

                //Adjust packages if necessary.
                if (config.packages) {
                    configurePackageDir(packages, config.packages);
                }

                //Done with modifications, assing packages back to context config
                context.config.packages = packages;
            }

            //If priority loading is in effect, trigger the loads now
            if (config.priority) {
                //Create a separate config property that can be
                //easily tested for config priority completion.
                //Do this instead of wiping out the config.priority
                //in case it needs to be inspected for debug purposes later.
                req(config.priority);
                context.config.priorityWait = config.priority;
            }

            //If a deps array or a config callback is specified, then call
            //require with those args. This is useful when require is defined as a
            //config object before require.js is loaded.
            if (config.deps || config.callback) {
                req(config.deps || [], config.callback);
            }

                        //Set up ready callback, if asked. Useful when require is defined as a
            //config object before require.js is loaded.
            if (config.ready) {
                req.ready(config.ready);
            }
            
            //If it is just a config block, nothing else,
            //then return.
            if (!deps) {
                return;
            }
        }

        //Normalize dependency strings: need to determine if they have
        //prefixes and to also normalize any relative paths. Replace the deps
        //array of strings with an array of objects.
        if (deps) {
            outDeps = deps;
            deps = [];
            for (i = 0; i < outDeps.length; i++) {
                deps[i] = req.splitPrefix(outDeps[i], (name || relModuleName), context);
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

            //Mark the module as specified so no need to fetch it again.
            //Important to set specified here for the
            //pause/resume case where there are multiple modules in a file.
            context.specified[name] = true;

                        //Load any modifiers for the module.
            mods = context.modifiers[name];
            if (mods) {
                req(mods, contextName);
                deferMods = mods.__deferMods;
                if (deferMods) {
                    for (i = 0; i < deferMods.length; i++) {
                        deferModArgs = deferMods[i];

                        //Add the context name to the def call.
                        lastModArg = deferModArgs[deferModArgs.length - 1];
                        if (lastModArg === undefined) {
                            deferModArgs[deferModArgs.length - 1] = contextName;
                        } else if (typeof lastModArg === "string") {
                            deferMods.push(contextName);
                        }

                        require.def.apply(require, deferModArgs);
                    }
                }
            }
                    }

        //If the callback is not an actual function, it means it already
        //has the definition of the module as a literal value.
        if (name && callback && !req.isFunction(callback)) {
            context.defined[name] = callback;
        }

        //If a pluginPrefix is available, call the plugin, or load it.
                if (pluginPrefix) {
            callPlugin(pluginPrefix, context, {
                name: "require",
                args: [name, deps, callback, context]
            });
        }
        
        //Hold on to the module until a script load or other adapter has finished
        //evaluating the whole file. This helps when a file has more than one
        //module in it -- dependencies are not traced and fetched until the whole
        //file is processed.
        s.paused.push([pluginPrefix, name, deps, context]);

        //Set loaded here for modules that are also loaded
        //as part of a layer, where onScriptLoad is not fired
        //for those cases. Do this after the inline define and
        //dependency tracing is done.
        //Also check if auto-registry of jQuery needs to be skipped.
        if (name) {
            context.loaded[name] = true;
            context.jQueryDef = (name === "jquery");
        }
    };

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    req.mixin = function (target, source, force) {
        for (var prop in source) {
            if (!(prop in empty) && (!(prop in target) || force)) {
                target[prop] = source[prop];
            }
        }
        return req;
    };

    req.version = version;

    //Set up page state.
    s = req.s = {
        ctxName: defContextName,
        contexts: {},
        paused: [],
                plugins: {
            defined: {},
            callbacks: {},
            waiting: {}
        },
                //Stores a list of URLs that should not get async script tag treatment.
        skipAsync: {},
        isBrowser: isBrowser,
        isPageLoaded: !isBrowser,
        readyCalls: [],
        doc: isBrowser ? document : null
    };

    req.isBrowser = s.isBrowser;
    if (isBrowser) {
        s.head = document.getElementsByTagName("head")[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            s.head = baseElement.parentNode;
        }
    }

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
    req.plugin = function (obj) {
        var i, prop, call, prefix = obj.prefix, cbs = s.plugins.callbacks,
            waiting = s.plugins.waiting[prefix], generics,
            defined = s.plugins.defined, contexts = s.contexts, context;

        //Do not allow redefinition of a plugin, there may be internal
        //state in the plugin that could be lost.
        if (defined[prefix]) {
            return req;
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

        return req;
    };
    
    /**
     * As of jQuery 1.4.3, it supports a readyWait property that will hold off
     * calling jQuery ready callbacks until all scripts are loaded. Be sure
     * to track it if readyWait is available. Also, since jQuery 1.4.3 does
     * not register as a module, need to do some global inference checking.
     * Even if it does register as a module, not guaranteed to be the precise
     * name of the global. If a jQuery is tracked for this context, then go
     * ahead and register it as a module too, if not already in process.
     */
    function jQueryCheck(context, jqCandidate) {
        if (!context.jQuery) {
            var $ = jqCandidate || (typeof jQuery !== "undefined" ? jQuery : null);
            if ($ && "readyWait" in $) {
                context.jQuery = $;

                //Manually create a "jquery" module entry if not one already
                //or in process.
                if (!context.defined.jquery && !context.jQueryDef) {
                    context.defined.jquery = $;
                }

                //Make sure 
                if (context.scriptCount) {
                    $.readyWait += 1;
                    context.jQueryIncremented = true;
                }
            }
        }
    }

    /**
     * Internal method used by environment adapters to complete a load event.
     * A load event could be a script load or just a load pass from a synchronous
     * load call.
     * @param {String} moduleName the name of the module to potentially complete.
     * @param {Object} context the context object
     */
    req.completeLoad = function (moduleName, context) {
        //If there is a waiting require.def call
        var args;
        while (defQueue.length) {
            args = defQueue.shift();
            if (args[0] === null) {
                args[0] = moduleName;
                break;
            } else if (args[0] === moduleName) {
                //Found matching require.def call for this script!
                break;
            } else {
                //Some other named require.def call, most likely the result
                //of a build layer that included many require.def calls.
                callDefMain(args, context);
            }
        }
        if (args) {
            callDefMain(args, context);
        }

        //Mark the script as loaded. Note that this can be different from a
        //moduleName that maps to a require.def call. This line is important
        //for traditional browser scripts.
        context.loaded[moduleName] = true;

        //If a global jQuery is defined, check for it. Need to do it here
        //instead of main() since stock jQuery does not register as
        //a module via define.
        jQueryCheck(context);

        context.scriptCount -= 1;
        resume(context);
    };

    /**
     * Legacy function, remove at some point
     */
    req.pause = req.resume = function () {};

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
    req.checkDeps = function (pluginPrefix, name, deps, context) {
        //Figure out if all the modules are loaded. If the module is not
        //being loaded or already loaded, add it to the "to load" list,
        //and request it to be loaded.
        var i, dep;

        if (pluginPrefix) {
                        callPlugin(pluginPrefix, context, {
                name: "checkDeps",
                args: [name, deps, context]
            });
                    } else {
            for (i = 0; (dep = deps[i]); i++) {
                if (!context.specified[dep.fullName]) {
                    context.specified[dep.fullName] = true;

                    //Reset the start time to use for timeouts
                    context.startTime = (new Date()).getTime();

                    //If a plugin, call its load method.
                    if (dep.prefix) {
                                                callPlugin(dep.prefix, context, {
                            name: "load",
                            args: [dep.name, context.contextName]
                        });
                                            } else {
                        req.load(dep.name, context.contextName);
                    }
                }
            }
        }
    };

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
    req.modify = function (target, name, deps, callback, contextName) {
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

            //Trigger the normal module definition logic if the target
            //is already in the system.
            if (context.specified[target]) {
                req.def(name, deps, callback, contextName);
            } else {
                //Hold on to the execution/dependency checks for the modifier
                //until the target is fetched.
                (list.__deferMods || (list.__deferMods = [])).push([name, deps, callback, contextName]);
            }
        } else {
            //A list of modifiers. Save them for future reference.
            for (prop in target) {
                if (!(prop in empty)) {
                    //Store the modifier for future use.
                    modifier = target[prop];
                    list = mods[prop] || (context.modifiers[prop] = []);
                    if (!list[modifier]) {
                        list.push(modifier);
                        list[modifier] = true;

                        if (context.specified[prop]) {
                            //Load the modifier right away.
                            req([modifier], cName);
                        }
                    }
                }
            }
        }
    };
    
    req.isArray = function (it) {
        return ostring.call(it) === "[object Array]";
    };

    req.isFunction = isFunction;

    /**
     * Gets one module's exported value. This method is used by require().
     * It is broken out as a separate function to allow a host environment
     * shim to overwrite this function with something appropriate for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} [contextName] the name of the context to use. Uses
     * default context if no contextName is provided. You should never
     * pass the contextName explicitly -- it is handled by the require() code.
     * @param {String} [relModuleName] a module name to use for relative
     * module name lookups. You should never pass this argument explicitly --
     * it is handled by the require() code.
     *
     * @returns {Object} the exported module value.
     */
    req.get = function (moduleName, contextName, relModuleName) {
        if (moduleName === "require" || moduleName === "exports" || moduleName === "module") {
            req.onError(new Error("Explicit require of " + moduleName + " is not allowed."));
        }
        contextName = contextName || s.ctxName;

        var ret, context = s.contexts[contextName], nameProps;

        //Normalize module name, if it contains . or ..
        nameProps = req.splitPrefix(moduleName, relModuleName, context);

        ret = context.defined[nameProps.name];
        if (ret === undefined) {
            req.onError(new Error("require: module name '" +
                        moduleName +
                        "' has not been loaded yet for context: " +
                        contextName));
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
    req.load = function (moduleName, contextName) {
        var context = s.contexts[contextName],
            urlFetched = context.urlFetched,
            loaded = context.loaded, url;
        s.isDone = false;

        //Only set loaded to false for tracking if it has not already been set.
        if (!loaded[moduleName]) {
            loaded[moduleName] = false;
        }

        if (contextName !== s.ctxName) {
            //Not in the right context now, hold on to it until
            //the current context finishes all its loading.
            contextLoads.push(arguments);
        } else {
            //First derive the path name for the module.
            url = req.nameToUrl(moduleName, null, contextName);
            if (!urlFetched[url]) {
                context.scriptCount += 1;
                req.attach(url, contextName, moduleName);
                urlFetched[url] = true;

                //If tracking a jQuery, then make sure its readyWait
                //is incremented to prevent its ready callbacks from
                //triggering too soon.
                if (context.jQuery && !context.jQueryIncremented) {
                    context.jQuery.readyWait += 1;
                    context.jQueryIncremented = true;
                }
            }
        }
    };

    req.jsExtRegExp = /^\/|:|\?|\.js$/;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @param {Object} context
     * @returns {String} normalized name
     */
    req.normalizeName = function (name, baseName, context) {
        //Adjust any relative paths.
        var part;
        if (name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                if (context.config.packages[baseName]) {
                    //If the baseName is a package name, then just treat it as one
                    //name to concat the name with.
                    baseName = [baseName];
                } else {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that "directory" and not name of the baseName's
                    //module. For instance, baseName of "one/two/three", maps to
                    //"one/two/three.js", but we want the directory, "one/two" for
                    //this normalization.
                    baseName = baseName.split("/");
                    baseName = baseName.slice(0, baseName.length - 1);
                }

                name = baseName.concat(name.split("/"));
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for '..'.
                            break;
                        } else if (i > 1) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                name = name.join("/");
            }
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
     * @param {Object} context
     *
     * @returns {Object} with properties, 'prefix' (which
     * may be null), 'name' and 'fullName', which is a combination
     * of the prefix (if it exists) and the name.
     */
    req.splitPrefix = function (name, baseName, context) {
        var index = name.indexOf("!"), prefix = null;
        if (index !== -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }

        //Account for relative paths if there is a base name.
        name = req.normalizeName(name, baseName, context);

        return {
            prefix: prefix,
            name: name,
            fullName: prefix ? prefix + "!" + name : name
        };
    };

    /**
     * Converts a module name to a file path.
     */
    req.nameToUrl = function (moduleName, ext, contextName, relModuleName) {
        var paths, packages, pkg, pkgPath, syms, i, parentModule, url,
            context = s.contexts[contextName],
            config = context.config;

        //Normalize module name if have a base relative module name to work from.
        moduleName = req.normalizeName(moduleName, relModuleName, context);

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash or ends with .js, it is just a plain file.
        //The slash is important for protocol-less URLs as well as full paths.
        if (req.jsExtRegExp.test(moduleName)) {
            //Just a plain path, not module name lookup, so just return it.
            //Add extension if it is included. This is a bit wonky, only non-.js things pass
            //an extension, this method probably needs to be reworked.
            url = moduleName + (ext ? ext : "");
        } else {
            //A module that needs to be converted to a path.
            paths = config.paths;
            packages = config.packages;

            syms = moduleName.split("/");
            //For each module name segment, see if there is a path
            //registered for it. Start with most specific name
            //and work up from it.
            for (i = syms.length; i > 0; i--) {
                parentModule = syms.slice(0, i).join("/");
                if (paths[parentModule]) {
                    syms.splice(0, i, paths[parentModule]);
                    break;
                } else if ((pkg = packages[parentModule])) {
                    //pkg can have just a string value to the path
                    //or can be an object with props:
                    //main, lib, name, location.
                    pkgPath = pkg.location + '/' + pkg.lib;
                    //If module name is just the package name, then looking
                    //for the main module.
                    if (moduleName === pkg.name) {
                        pkgPath += '/' + pkg.main;
                    }
                    syms.splice(0, i, pkgPath);
                    break;
                }
            }

            //Join the path parts together, then figure out if baseUrl is needed.
            url = syms.join("/") + (ext || ".js");
            url = (url.charAt(0) === '/' || url.match(/^\w+:/) ? "" : config.baseUrl) + url;
        }
        return config.urlArgs ? url +
                                ((url.indexOf('?') === -1 ? '?' : '&') +
                                 config.urlArgs) : url;
    };

    //In async environments, checkLoaded can get called a few times in the same
    //call stack. Allow only one to do the finishing work. Set to false
    //for sync environments.
    req.blockCheckLoaded = true;

    /**
     * Checks if all modules for a context are loaded, and if so, evaluates the
     * new ones in right dependency order.
     *
     * @private
     */
    req.checkLoaded = function (contextName) {
        var context = s.contexts[contextName || s.ctxName],
                waitInterval = context.config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                loaded, defined = context.defined,
                modifiers = context.modifiers, waiting, noLoads = "",
                hasLoadedProp = false, stillLoading = false, prop,

                                pIsWaiting = s.plugins.isWaiting, pOrderDeps = s.plugins.orderDeps,
                
                i, module, allDone, loads, loadArgs, err;

        //If already doing a checkLoaded call,
        //then do not bother checking loaded state.
        if (context.isCheckLoaded) {
            return;
        }

        //Determine if priority loading is done. If so clear the priority. If
        //not, then do not check
        if (context.config.priorityWait) {
            if (isPriorityDone(context)) {
                //Call resume, since it could have
                //some waiting dependencies to trace.
                resume(context);
            } else {
                return;
            }
        }

        //Signal that checkLoaded is being require, so other calls that could be triggered
        //by calling a waiting callback that then calls require and then this function
        //should not proceed. At the end of this function, if there are still things
        //waiting, then checkLoaded will be called again.
        context.isCheckLoaded = req.blockCheckLoaded;

        //Grab waiting and loaded lists here, since it could have changed since
        //this function was first called.
        waiting = context.waiting;
        loaded = context.loaded;

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
                        && (!pIsWaiting || !pIsWaiting(context))
                       ) {
            //If the loaded object had no items, then the rest of
            //the work below does not need to be done.
            context.isCheckLoaded = false;
            return;
        }
        if (expired && noLoads) {
            //If wait time expired, throw error of unloaded modules.
            err = new Error("require.js load timeout for modules: " + noLoads);
            err.requireType = "timeout";
            err.requireModules = noLoads;
            req.onError(err);
        }
        if (stillLoading) {
            //Something is still waiting to load. Wait for it.
            context.isCheckLoaded = false;
            if (isBrowser || isWebWorker) {
                setTimeout(function () {
                    req.checkLoaded(contextName);
                }, 50);
            }
            return;
        }

        //Order the dependencies. Also clean up state because the evaluation
        //of modules might create new loading tasks, so need to reset.
        //Be sure to call plugins too.
        context.waiting = [];
        context.loaded = {};

                //Call plugins to order their dependencies, do their
        //module definitions.
        if (pOrderDeps) {
            pOrderDeps(context);
        }
        
                //Before defining the modules, give priority treatment to any modifiers
        //for modules that are already defined.
        for (prop in modifiers) {
            if (!(prop in empty)) {
                if (defined[prop]) {
                    req.execModifiers(prop, {}, waiting, context);
                }
            }
        }
        
        //Define the modules, doing a depth first search.
        for (i = 0; (module = waiting[i]); i++) {
            req.exec(module, {}, waiting, context);
        }

        //Indicate checkLoaded is now done.
        context.isCheckLoaded = false;

        if (context.waiting.length
                        || (pIsWaiting && pIsWaiting(context))
                       ) {
            //More things in this context are waiting to load. They were probably
            //added while doing the work above in checkLoaded, calling module
            //callbacks that triggered other require calls.
            req.checkLoaded(contextName);
        } else if (contextLoads.length) {
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
                    req.load.apply(req, loadArgs);
                }
            }
        } else {
            //Make sure we reset to default context.
            s.ctxName = defContextName;
            s.isDone = true;
            if (req.callReady) {
                req.callReady();
            }
        }
    };

    /**
     * Helper function that creates a setExports function for a "module"
     * CommonJS dependency. Do this here to avoid creating a closure that
     * is part of a loop in require.exec.
     */
    function makeSetExports(moduleObj) {
        return function (exports) {
            moduleObj.exports = exports;
        };
    }

    function makeContextModuleFunc(name, contextName, moduleName) {
        return function () {
            //A version of a require function that forces a contextName value
            //and also passes a moduleName value for items that may need to
            //look up paths relative to the moduleName
            var args = [].concat(aps.call(arguments, 0));
            args.push(contextName, moduleName);
            return (name ? require[name] : require).apply(null, args);
        };
    }

    /**
     * Helper function that creates a require function object to give to
     * modules that ask for it as a dependency. It needs to be specific
     * per module because of the implication of path mappings that may
     * need to be relative to the module name.
     */
    function makeRequire(context, moduleName) {
        var contextName = context.contextName,
            modRequire = makeContextModuleFunc(null, contextName, moduleName);

        req.mixin(modRequire, {
                        modify: makeContextModuleFunc("modify", contextName, moduleName),
                        def: makeContextModuleFunc("def", contextName, moduleName),
            get: makeContextModuleFunc("get", contextName, moduleName),
            nameToUrl: makeContextModuleFunc("nameToUrl", contextName, moduleName),
            ready: req.ready,
            context: context,
            config: context.config,
            isBrowser: s.isBrowser
        });
        return modRequire;
    }

    /**
     * Executes the modules in the correct order.
     * 
     * @private
     */
    req.exec = function (module, traced, waiting, context) {
        //Some modules are just plain script files, abddo not have a formal
        //module definition, 
        if (!module) {
            //Returning undefined for Spidermonky strict checking in Komodo
            return undefined;
        }

        var name = module.name, cb = module.callback, deps = module.deps, j, dep,
            defined = context.defined, ret, args = [], depModule, cjsModule,
            usingExports = false, depName;

        //If already traced or defined, do not bother a second time.
        if (name) {
            if (traced[name] || name in defined) {
                return defined[name];
            }

            //Mark this module as being traced, so that it is not retraced (as in a circular
            //dependency)
            traced[name] = true;
        }

        if (deps) {
            for (j = 0; (dep = deps[j]); j++) {
                depName = dep.name;
                if (depName === "require") {
                    depModule = makeRequire(context, name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    depModule = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = depModule = {
                        id: name,
                        uri: name ? req.nameToUrl(name, null, context.contextName) : undefined
                    };
                    cjsModule.setExports = makeSetExports(cjsModule);
                } else {
                    //Get dependent module. It could not exist, for a circular
                    //dependency or if the loaded dependency does not actually call
                    //require. Favor not throwing an error here if undefined because
                    //we want to allow code that does not use require as a module
                    //definition framework to still work -- allow a web site to
                    //gradually update to contained modules. That is more
                    //important than forcing a throw for the circular dependency case.
                    depModule = depName in defined ? defined[depName] : (traced[depName] ? undefined : req.exec(waiting[waiting[depName]], traced, waiting, context));
                }

                args.push(depModule);
            }
        }

        //Call the callback to define the module, if necessary.
        cb = module.callback;
        if (cb && req.isFunction(cb)) {
            ret = req.execCb(name, cb, args);
            if (name) {
                //If using exports and the function did not return a value,
                //and the "module" object for this definition function did not
                //define an exported value, then use the exports object.
                if (usingExports && ret === undefined && (!cjsModule || !("exports" in cjsModule))) {
                    ret = defined[name];
                } else {
                    if (cjsModule && "exports" in cjsModule) {
                        ret = defined[name] = cjsModule.exports;
                    } else {
                        if (name in defined && !usingExports) {
                            req.onError(new Error(name + " has already been defined"));
                        }
                        defined[name] = ret;
                    }
                }
            }
        }

                //Execute modifiers, if they exist.
        req.execModifiers(name, traced, waiting, context);
        
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
    req.execCb = function (name, cb, args) {
        return cb.apply(null, args);
    };

        /**
     * Executes modifiers for the given module name.
     * @param {String} target
     * @param {Object} traced
     * @param {Object} context
     *
     * @private
     */
    req.execModifiers = function (target, traced, waiting, context) {
        var modifiers = context.modifiers, mods = modifiers[target], mod, i;
        if (mods) {
            for (i = 0; i < mods.length; i++) {
                mod = mods[i];
                //Not all modifiers define a module, they might collect other modules.
                //If it is just a collection it will not be in waiting.
                if (mod in waiting) {
                    req.exec(waiting[waiting[mod]], traced, waiting, context);
                }
            }
            delete modifiers[target];
        }
    };
    
    /**
     * callback for script loads, used to check status of loading.
     *
     * @param {Event} evt the event from the browser for the script
     * that was loaded.
     *
     * @private
     */
    req.onScriptLoad = function (evt) {
        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        var node = evt.currentTarget || evt.srcElement, contextName, moduleName,
            context;
        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");
            context = s.contexts[contextName];

            req.completeLoad(moduleName, context);

            //Clean up script binding.
            if (node.removeEventListener) {
                node.removeEventListener("load", req.onScriptLoad, false);
            } else {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                node.detachEvent("onreadystatechange", req.onScriptLoad);
            }
        }
    };

    /**
     * Attaches the script represented by the URL to the current
     * environment. Right now only supports browser loading,
     * but can be redefined in other environments to do the right thing.
     * @param {String} url the url of the script to attach.
     * @param {String} contextName the name of the context that wants the script.
     * @param {moduleName} the name of the module that is associated with the script.
     * @param {Function} [callback] optional callback, defaults to require.onScriptLoad
     * @param {String} [type] optional type, defaults to text/javascript
     */
    req.attach = function (url, contextName, moduleName, callback, type) {
        var node, loaded, context;
        if (isBrowser) {
            //In the browser so use a script tag
            callback = callback || req.onScriptLoad;
            node = document.createElement("script");
            node.type = type || "text/javascript";
            node.charset = "utf-8";
            //Use async so Gecko does not block on executing the script if something
            //like a long-polling comet tag is being run first. Gecko likes
            //to evaluate scripts in DOM order, even for dynamic scripts.
            //It will fetch them async, but only evaluate the contents in DOM
            //order, so a long-polling script tag can delay execution of scripts
            //after it. But telling Gecko we expect async gets us the behavior
            //we want -- execute it whenever it is finished downloading. Only
            //Helps Firefox 3.6+
            //Allow some URLs to not be fetched async. Mostly helps the order!
            //plugin
            if (!s.skipAsync[url]) {
                node.async = true;
            }
            node.setAttribute("data-requirecontext", contextName);
            node.setAttribute("data-requiremodule", moduleName);

            //Set up load listener.
            if (node.addEventListener) {
                node.addEventListener("load", callback, false);
            } else {
                //Probably IE. If not it will throw an error, which will be
                //useful to know. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous require.def call to a name.
                //However, IE reports the script as being in "interactive"
                //readyState at the time of the require.def call.
                useInteractive = true;
                node.attachEvent("onreadystatechange", callback);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous require.def
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                s.head.insertBefore(node, baseElement);
            } else {
                s.head.appendChild(node);
            }
            currentlyAddingScript = null;
            return node;
        } else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            context = s.contexts[contextName];
            loaded = context.loaded;
            loaded[moduleName] = false;
            importScripts(url);

            //Account for anonymous modules
            req.completeLoad(moduleName, context);
        }
        return null;
    };

    //Determine what baseUrl should be if not already defined via a require config object
    s.baseUrl = cfg.baseUrl;
    if (isBrowser && (!s.baseUrl || !s.head)) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        scripts = document.getElementsByTagName("script");
        if (cfg.baseUrlMatch) {
            rePkg = cfg.baseUrlMatch;
        } else {
            
            
            
                        rePkg = /(allplugins-)?require\.js(\W|$)/i;
            
                    }

        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            //Set the "head" where we can append children by
            //using the script's parent.
            if (!s.head) {
                s.head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load.
            if (!cfg.deps) {
                dataMain = script.getAttribute('data-main');
                if (dataMain) {
                    cfg.deps = [dataMain];
                }
            }

            //Using .src instead of getAttribute to get an absolute URL.
            //While using a relative URL will be fine for script tags, other
            //URLs used for text! resources that use XHR calls might benefit
            //from an absolute URL.
            src = script.src;
            if (src && !s.baseUrl) {
                m = src.match(rePkg);
                if (m) {
                    s.baseUrl = src.substring(0, m.index);
                    break;
                }
            }
        }
    }

        //****** START page load functionality ****************
    /**
     * Sets the page as loaded and triggers check for all modules loaded.
     */
    req.pageLoaded = function () {
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

            req.callReady();
        }
    };

    /**
     * Internal function that calls back any ready functions. If you are
     * integrating RequireJS with another library without require.ready support,
     * you can define this method to call your page ready code instead.
     */
    req.callReady = function () {
        var callbacks = s.readyCalls, i, callback, contexts, context, prop;

        if (s.isPageLoaded && s.isDone) {
            if (callbacks.length) {
                s.readyCalls = [];
                for (i = 0; (callback = callbacks[i]); i++) {
                    callback();
                }
            }

            //If jQuery with readyWait is being tracked, updated its
            //readyWait count.
            contexts = s.contexts;
            for (prop in contexts) {
                if (!(prop in empty)) {
                    context = contexts[prop];
                    if (context.jQueryIncremented) {
                        context.jQuery.readyWait -= 1;
                        context.jQueryIncremented = false;
                    }
                }
            }
        }
    };

    /**
     * Registers functions to call when the page is loaded
     */
    req.ready = function (callback) {
        if (s.isPageLoaded && s.isDone) {
            callback();
        } else {
            s.readyCalls.push(callback);
        }
        return req;
    };

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", req.pageLoaded, false);
            window.addEventListener("load", req.pageLoaded, false);
            //Part of FF < 3.6 readystate fix (see setReadyState refs for more info)
            if (!document.readyState) {
                setReadyState = true;
                document.readyState = "loading";
            }
        } else if (window.attachEvent) {
            window.attachEvent("onload", req.pageLoaded);

            //DOMContentLoaded approximation, as found by Diego Perini:
            //http://javascript.nwbox.com/IEContentLoaded/
            if (self === self.top) {
                scrollIntervalId = setInterval(function () {
                    try {
                        //From this ticket:
                        //http://bugs.dojotoolkit.org/ticket/11106,
                        //In IE HTML Application (HTA), such as in a selenium test,
                        //javascript in the iframe can't see anything outside
                        //of it, so self===self.top is true, but the iframe is
                        //not the top window and doScroll will be available
                        //before document.body is set. Test document.body
                        //before trying the doScroll trick.
                        if (document.body) {
                            document.documentElement.doScroll("left");
                            req.pageLoaded();
                        }
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. NOTE: does not work with Firefox before 3.6. To support
        //those browsers, manually call require.pageLoaded().
        if (document.readyState === "complete") {
            req.pageLoaded();
        }
    }
    //****** END page load functionality ****************
    
    //Set up default context. If require was a configuration object, use that as base config.
    req(cfg);

    //If modules are built into require.js, then need to make sure dependencies are
    //traced. Use a setTimeout in the browser world, to allow all the modules to register
    //themselves. In a non-browser env, assume that modules are not built into require.js,
    //which seems odd to do on the server.
    if (typeof setTimeout !== "undefined") {
        setTimeout(function () {
            var ctx = s.contexts[(cfg.context || defContextName)];
            //Allow for jQuery to be loaded/already in the page, and if jQuery 1.4.3,
            //make sure to hold onto it for readyWait triggering.
            jQueryCheck(ctx);
            resume(ctx);
        }, 0);
    }
}());

/**
 * @license RequireJS i18n Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false */
/*global require: false, navigator: false */


/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i18n!nls/colors".
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function () {
    //regexp for reconstructing the master bundle name from parts of the regexp match
    //nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
    //["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
    //nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
    //["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
    //so, if match[5] is blank, it means this is the top bundle definition.
    var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/,
        empty = {};

    function getWaiting(name, context) {
        var nlswAry = context.nlsWaiting;
        return nlswAry[name] ||
               //Push a new waiting object on the nlsWaiting array, but also put
               //a shortcut lookup by name to the object on the array.
               (nlswAry[name] = nlswAry[(nlswAry.push({ _name: name}) - 1)]);
    }

    /**
     * Makes sure all the locale pieces are loaded, and finds the best match
     * for the requested locale.
     */
    function resolveLocale(masterName, bundle, locale, context) {
        //Break apart the locale to get the parts.
        var i, parts, toLoad, nlsw, loc, val, bestLoc = "root";

        parts = locale.split("-");

        //Now see what bundles exist for each country/locale.
        //Want to walk up the chain, so if locale is en-us-foo,
        //look for en-us-foo, en-us, en, then root.
        toLoad = [];

        nlsw = getWaiting(masterName, context);

        for (i = parts.length; i > -1; i--) {
            loc = i ? parts.slice(0, i).join("-") : "root";
            val = bundle[loc];
            if (val) {
                //Store which bundle to use for the default bundle definition.
                if (locale === context.config.locale && !nlsw._match) {
                    nlsw._match = loc;
                }

                //Store the best match for the target locale
                if (bestLoc === "root") {
                    bestLoc = loc;
                }

                //Track that the locale needs to be resolved with its parts.
                //Mark what locale should be used when resolving.
                nlsw[loc] = loc;

                //If locale value is true, it means it is a resource that
                //needs to be loaded. Track it to load if it has not already
                //been asked for.
                if (val === true) {
                    //split off the bundl name from master name and insert the
                    //locale before the bundle name. So, if masterName is
                    //some/path/nls/colors, then the locale fr-fr's bundle name should
                    //be some/path/nls/fr-fr/colors
                    val = masterName.split("/");
                    val.splice(-1, 0, loc);
                    val = val.join("/");

                    if (!context.specified[val] && !(val in context.loaded) && !context.defined[val]) {
                        context.defPlugin[val] = 'i18n';
                        toLoad.push(val);
                    }
                }
            }
        }

        //If locale was not an exact match, store the closest match for it.
        if (bestLoc !== locale) {
            if (context.defined[bestLoc]) {
                //Already got it. Easy peasy lemon squeezy.
                context.defined[locale] = context.defined[bestLoc];
            } else {
                //Need to wait for things to load then define it.
                nlsw[locale] = bestLoc;
            }
        }

        //Load any bundles that are still needed.
        if (toLoad.length) {
            require(toLoad, context.contextName);
        }
    }

    require.plugin({
        prefix: "i18n",

        /**
         * This callback is prefix-specific, only gets called for this prefix
         */
        require: function (name, deps, callback, context) {
            var i, match, nlsw, bundle, master, toLoad, obj = context.defined[name];

            //All i18n modules must match the nls module name structure.
            match = nlsRegExp.exec(name);
            //If match[5] is blank, it means this is the top bundle definition,
            //so it does not have to be handled. Only deal with ones that have a locale
            //(a match[4] value but no match[5])
            if (match[5]) {
                master = match[1] + match[5];

                //Track what locale bundle need to be generated once all the modules load.
                nlsw = getWaiting(master, context);
                nlsw[match[4]] = match[4];

                bundle = context.nls[master];
                if (!bundle) {
                    //No master bundle yet, ask for it.
                    context.defPlugin[master] = 'i18n';
                    require([master], context.contextName);
                    bundle = context.nls[master] = {};
                }
                //For nls modules, the callback is just a regular object,
                //so save it off in the bundle now.
                bundle[match[4]] = callback;
            } else {
                //Integrate bundle into the nls area.
                bundle = context.nls[name];
                if (bundle) {
                    //A specific locale already started the bundle object.
                    //Do a mixin (which will not overwrite the locale property
                    //on the bundle that has the previously loaded locale's info)
                    require.mixin(bundle, obj);
                } else {
                    bundle = context.nls[name] = obj;
                }
                context.nlsRootLoaded[name] = true;

                //Make sure there are no locales waiting to be resolved.
                toLoad = context.nlsToLoad[name];
                if (toLoad) {
                    delete context.nlsToLoad[name];
                    for (i = 0; i < toLoad.length; i++) {
                        resolveLocale(name, bundle, toLoad[i], context);
                    }
                }

                resolveLocale(name, bundle, context.config.locale, context);
            }
        },

        /**
         * Called when a new context is defined. Use this to store
         * context-specific info on it.
         */
        newContext: function (context) {
            require.mixin(context, {
                nlsWaiting: [],
                nls: {},
                nlsRootLoaded: {},
                nlsToLoad: {}
            });
            if (!context.config.locale) {
                context.config.locale = typeof navigator === "undefined" ? "root" :
                        (navigator.language || navigator.userLanguage || "root").toLowerCase();
            }
        },

        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, contextName) {
            //Make sure the root bundle is loaded, to check if we can support
            //loading the requested locale, or if a different one needs
            //to be chosen.
            var masterName, context = require.s.contexts[contextName], bundle,
                match = nlsRegExp.exec(name), locale = match[4];

            //If match[5] is blank, it means this is the top bundle definition,
            //so it does not have to be handled. Only deal with ones that have a locale
            //(a match[4] value but no match[5])
            if (match[5]) {
                //locale-specific bundle
                masterName = match[1] + match[5];
                bundle = context.nls[masterName];
                if (context.nlsRootLoaded[masterName] && bundle) {
                    resolveLocale(masterName, bundle, locale, context);
                } else {
                    //Store this locale to figure out after masterName is loaded and load masterName.
                    (context.nlsToLoad[masterName] || (context.nlsToLoad[masterName] = [])).push(locale);
                    context.defPlugin[masterName] = 'i18n';
                    require([masterName], contextName);
                }
            } else {
                //Top-level bundle. Just call regular load, if not already loaded
                if (!context.nlsRootLoaded[name]) {
                    context.defPlugin[name] = 'i18n';
                    require.load(name, contextName);
                }
            }
        },

        /**
         * Called when the dependencies of a module are checked.
         */
        checkDeps: function (name, deps, context) {
            //i18n bundles are always defined as objects for their "dependencies",
            //and that object is already processed in the require method, no need to
            //do work in here.
        },

        /**
         * Called to determine if a module is waiting to load.
         */
        isWaiting: function (context) {
            return !!context.nlsWaiting.length;
        },

        /**
         * Called when all modules have been loaded.
         */
        orderDeps: function (context) {
            //Clear up state since further processing could
            //add more things to fetch.
            var i, j, master, msWaiting, bundle, parts, moduleSuffix, mixed,
                modulePrefix, loc, defLoc, locPart, nlsWaiting = context.nlsWaiting,
                bestFit;
            context.nlsWaiting = [];
            context.nlsToLoad = {};

            //First, properly mix in any nls bundles waiting to happen.
            for (i = 0; (msWaiting = nlsWaiting[i]); i++) {
                //Each property is a master bundle name.
                master = msWaiting._name;
                bundle = context.nls[master];
                defLoc = null;

                //Create the module name parts from the master name. So, if master
                //is foo/nls/bar, then the parts should be prefix: "foo/nls",
                // suffix: "bar", and the final locale's module name will be foo/nls/locale/bar
                parts = master.split("/");
                modulePrefix = parts.slice(0, parts.length - 1).join("/");
                moduleSuffix = parts[parts.length - 1];
                //Cycle through the locale props on the waiting object and combine
                //the locales together.
                for (loc in msWaiting) {
                    if (loc !== "_name" && !(loc in empty)) {
                        if (loc === "_match") {
                            //Found default locale to use for the top-level bundle name.
                            defLoc = msWaiting[loc];
                        
                        } else if (msWaiting[loc] !== loc) {
                            //A "best fit" locale, store it off to the end and handle
                            //it at the end by just assigning the best fit value, since
                            //after this for loop, the best fit locale will be defined.
                            (bestFit || (bestFit = {}))[loc] = msWaiting[loc];
                        } else {
                            //Mix in the properties of this locale together.
                            //Split the locale into pieces.
                            mixed = {};
                            parts = loc.split("-");
                            for (j = parts.length; j > 0; j--) {
                                locPart = parts.slice(0, j).join("-");
                                if (locPart !== "root" && bundle[locPart]) {
                                    require.mixin(mixed, bundle[locPart]);
                                }
                            }
                            if (bundle.root) {
                                require.mixin(mixed, bundle.root);
                            }

                            context.defined[modulePrefix + "/" + loc + "/" + moduleSuffix] = mixed;
                        }
                    }
                }

                //Finally define the default locale. Wait to the end of the property
                //loop above so that the default locale bundle has been properly mixed
                //together.
                context.defined[master] = context.defined[modulePrefix + "/" + defLoc + "/" + moduleSuffix];
                
                //Handle any best fit locale definitions.
                if (bestFit) {
                    for (loc in bestFit) {
                        if (!(loc in empty)) {
                            context.defined[modulePrefix + "/" + loc + "/" + moduleSuffix] = context.defined[modulePrefix + "/" + bestFit[loc] + "/" + moduleSuffix];
                        }
                    }
                }
            }
        }
    });
}());
/**
 * @license RequireJS text Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false */


(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;

    if (!require.textStrip) {
        require.textStrip = function (text) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (text) {
                text = text.replace(xmlRegExp, "");
                var matches = text.match(bodyRegExp);
                if (matches) {
                    text = matches[1];
                }
            } else {
                text = "";
            }
            return text;
        };
    }

    //Upgrade require to add some methods for XHR handling. But it could be that
    //this require is used in a non-browser env, so detect for existing method
    //before attaching one.
    if (!require.getXhr) {
        require.getXhr = function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else {
                for (i = 0; i < 3; i++) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }   
            }

            if (!xhr) {
                throw new Error("require.getXhr(): XMLHttpRequest not available");
            }

            return xhr;
        };
    }
    
    if (!require.fetchText) {
        require.fetchText = function (url, callback) {
            var xhr = require.getXhr();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (evt) {
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(null);
        };
    }

    require.plugin({
        prefix: "text",

        /**
         * This callback is prefix-specific, only gets called for this prefix
         */
        require: function (name, deps, callback, context) {
            //No-op, require never gets these text items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called when a new context is defined. Use this to store
         * context-specific info on it.
         */
        newContext: function (context) {
            require.mixin(context, {
                text: {},
                textWaiting: []
            });
        },

        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, contextName) {
            //Name has format: some.module!filext!strip!text
            //The strip and text parts are optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.
            //If text is present, it is the actual text of the file.
            var strip = false, text = null, key, url, index = name.indexOf("."),
                modName = name.substring(0, index), fullKey,
                ext = name.substring(index + 1, name.length),
                context = require.s.contexts[contextName],
                tWaitAry = context.textWaiting;

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                ext = ext.substring(0, index);
                index = strip.indexOf("!");
                if (index !== -1 && strip.substring(0, index) === "strip") {
                    //Pull off the text.
                    text = strip.substring(index + 1, strip.length);
                    strip = "strip";
                } else if (strip !== "strip") {
                    //strip is actually the inlined text.
                    text = strip;
                    strip = null;
                }
            }
            key = modName + "!" + ext;
            fullKey = strip ? key + "!" + strip : key;

            //Store off text if it is available for the given key and be done.
            if (text !== null && !context.text[key]) {
                context.defined[name] = context.text[key] = text;
                return;
            }

            //If text is not available, load it.
            if (!context.text[key] && !context.textWaiting[key] && !context.textWaiting[fullKey]) {
                //Keep track that the fullKey needs to be resolved, during the
                //orderDeps stage.
                if (!tWaitAry[fullKey]) {
                    tWaitAry[fullKey] = tWaitAry[(tWaitAry.push({
                        name: name,
                        key: key,
                        fullKey: fullKey,
                        strip: !!strip
                    }) - 1)];
                }

                //Load the text.
                url = require.nameToUrl(modName, "." + ext, contextName);
                context.loaded[name] = false;
                require.fetchText(url, function (text) {
                    context.text[key] = text;
                    context.loaded[name] = true;
                });
            }
        },

        /**
         * Called when the dependencies of a module are checked.
         */
        checkDeps: function (name, deps, context) {
            //No-op, checkDeps never gets these text items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called to determine if a module is waiting to load.
         */
        isWaiting: function (context) {
            return !!context.textWaiting.length;
        },

        /**
         * Called when all modules have been loaded.
         */
        orderDeps: function (context) {
            //Clear up state since further processing could
            //add more things to fetch.
            var i, dep, text, tWaitAry = context.textWaiting;
            context.textWaiting = [];
            for (i = 0; (dep = tWaitAry[i]); i++) {
                text = context.text[dep.key];
                context.defined[dep.name] = dep.strip ? require.textStrip(text) : text;
            }
        }
    });
}());
/**
 * @license RequireJS jsonp Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint nomen: false, plusplus: false */
/*global require: false, setTimeout: false */


(function () {
    var countId = 0;

    //A place to hold callback functions
    require._jsonp = {};

    require.plugin({
        prefix: "jsonp",

        /**
         * This callback is prefix-specific, only gets called for this prefix
         */
        require: function (name, deps, callback, context) {
            //No-op, require never gets these jsonp items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called when a new context is defined. Use this to store
         * context-specific info on it.
         */
        newContext: function (context) {
            require.mixin(context, {
                jsonpWaiting: []
            });
        },

        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, contextName) {
            //Name has format: some/url?param1=value1&callback=?
            //where the last question mark indicates where the jsonp callback
            //function name needs to go.
            var index = name.indexOf("?"),
                url = name.substring(0, index),
                params = name.substring(index + 1, name.length),
                context = require.s.contexts[contextName],
                data = {
                    name: name
                },
                funcName = "f" + (countId++),
                head = require.s.head,
                node = head.ownerDocument.createElement("script");

            //Create JSONP callback function
            require._jsonp[funcName] = function (value) {
                data.value = value;
                context.loaded[name] = true;
                //Use a setTimeout for cleanup because some older IE versions vomit
                //if removing a script node while it is being evaluated.
                setTimeout(function () {
                    head.removeChild(node);
                    delete require._jsonp[funcName];
                }, 15);
            };

            //Hold on to the data for later dependency resolution in orderDeps.
            context.jsonpWaiting.push(data);

            //Build up the full JSONP URL
            url = require.nameToUrl(url, "?", contextName);
            //nameToUrl call may or may not have placed an ending ? on the URL,
            //be sure there is one and add the rest of the params.
            url += (url.indexOf("?") === -1 ? "?" : "") + params.replace("?", "require._jsonp." + funcName);

            context.loaded[name] = false;
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.src = url;

            //Use async so Gecko does not block on executing the script if something
            //like a long-polling comet tag is being run first. Gecko likes
            //to evaluate scripts in DOM order, even for dynamic scripts.
            //It will fetch them async, but only evaluate the contents in DOM
            //order, so a long-polling script tag can delay execution of scripts
            //after it. But telling Gecko we expect async gets us the behavior
            //we want -- execute it whenever it is finished downloading. Only
            //Helps Firefox 3.6+
            node.async = true;

            head.appendChild(node);
        },

        /**
         * Called when the dependencies of a module are checked.
         */
        checkDeps: function (name, deps, context) {
            //No-op, checkDeps never gets these jsonp items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called to determine if a module is waiting to load.
         */
        isWaiting: function (context) {
            return !!context.jsonpWaiting.length;
        },

        /**
         * Called when all modules have been loaded.
         */
        orderDeps: function (context) {
            //Clear up state since further processing could
            //add more things to fetch.
            var i, dep, waitAry = context.jsonpWaiting;
            context.jsonpWaiting = [];
            for (i = 0; (dep = waitAry[i]); i++) {
                context.defined[dep.name] = dep.value;
            }
        }
    });
}());
/**
 * @license RequireJS order Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint nomen: false, plusplus: false */
/*global require: false, window: false, document: false, setTimeout: false */


(function () {
    //Sadly necessary browser inference due to differences in the way
    //that browsers load and execute dynamically inserted javascript
    //and whether the script/cache method works.
    //Currently, Gecko and Opera do not load/fire onload for scripts with
    //type="script/cache" but they execute injected scripts in order
    //unless the 'async' flag is present.
    var supportsInOrderExecution = ((window.opera && Object.prototype.toString.call(window.opera) === "[object Opera]") ||
                               //If Firefox 2 does not have to be supported, then
                               //a better check may be:
                               //('mozIsLocallyAvailable' in window.navigator)
                               ("MozAppearance" in document.documentElement.style)),
        readyRegExp = /^(complete|loaded)$/;

    //Callback used by the type="script/cache" callback that indicates a script
    //has finished downloading.
    function scriptCacheCallback(evt) {
        var node = evt.currentTarget || evt.srcElement, i,
            context, contextName, moduleName, waiting, cached;

        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");
            context = require.s.contexts[contextName];
            waiting = context.orderWaiting;
            cached = context.orderCached;

            //Mark this cache request as loaded
            cached[moduleName] = true;

            //Find out how many ordered modules have loaded
            for (i = 0; cached[waiting[i]]; i++) {}
            if (i > 0) {
                require(waiting.splice(0, i), contextName);
            }

            //If no other order cache items are in the queue, do some cleanup.
            if (!waiting.length) {
                context.orderCached = {};
            }

            //Remove this script tag from the DOM
            //Use a setTimeout for cleanup because some older IE versions vomit
            //if removing a script node while it is being evaluated.
            setTimeout(function () {
                node.parentNode.removeChild(node);
            }, 15);
        }
    }

    require.plugin({
        prefix: "order",

        /**
         * This callback is prefix-specific, only gets called for this prefix
         */
        require: function (name, deps, callback, context) {
            //No-op, require never gets these order items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called when a new context is defined. Use this to store
         * context-specific info on it.
         */
        newContext: function (context) {
            require.mixin(context, {
                orderWaiting: [],
                orderCached: {}
            });
        },

        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, contextName) {
            var context = require.s.contexts[contextName],
                url = require.nameToUrl(name, null, contextName);

            //Make sure the async attribute is not set for any pathway involving
            //this script.
            require.s.skipAsync[url] = true;
            if (supportsInOrderExecution) {
                //Just a normal script tag append, but without async attribute
                //on the script.
                require([name], contextName);
            } else {
                //Credit to LABjs author Kyle Simpson for finding that scripts
                //with type="script/cache" allow scripts to be downloaded into
                //browser cache but not executed. Use that
                //so that subsequent addition of a real type="text/javascript"
                //tag will cause the scripts to be executed immediately in the
                //correct order.
                context.orderWaiting.push(name);
                context.loaded[name] = false;
                require.attach(url, contextName, name, scriptCacheCallback, "script/cache");
            }
        },

        /**
         * Called when the dependencies of a module are checked.
         */
        checkDeps: function (name, deps, context) {
            //No-op, checkDeps never gets these order items, they are always
            //a dependency, see load for the action.
        },

        /**
         * Called to determine if a module is waiting to load.
         */
        isWaiting: function (context) {
            return !!context.orderWaiting.length;
        },

        /**
         * Called when all modules have been loaded. Not needed for this plugin.
         * State is reset as part of scriptCacheCallback. 
         */
        orderDeps: function (context) {
        }
    });
}());

//Target build file for a require.js that has all of require's functionality,
//and includes specific plugins: i18n and text.
