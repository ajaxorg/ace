#!/usr/bin/env node
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

var fs = require("fs");
var path = require("path");
var copy = require('architect-build/copy');
var build = require('architect-build/build');

var ACE_HOME = __dirname;
var BUILD_DIR = ACE_HOME + "/build";
var CACHE = {};

function main(args) {
    if (args.indexOf("updateModes") !== -1) {
        return updateModes();
    }
    var type = "minimal";
    args = args.map(function(x) {
        if (x[0] == "-" && x[1] != "-")
            return "-" + x;
        return x;
    }).filter(Boolean);

    if (args[2] && (args[2][0] != "-" || args[2].indexOf("h") != -1))
        type = args[2];

    var i = args.indexOf("--target");
    if (i != -1 && args[i+1])
        BUILD_DIR = args[i+1];

    if (args.indexOf("--h") == -1) {
        if (type == "minimal") {
            buildAce({
                compress: args.indexOf("--m") != -1,
                noconflict: args.indexOf("--nc") != -1,
                shrinkwrap: args.indexOf("--s") != -1
            });
        } else if (type == "normal") {
            ace();
        } else if (type == "demo") {
            demo();
        } else if (type == "full") {
            ace();
            demo();
        } else if (type == "highlighter") {
            // TODO
        }
    }
}

function showHelp(type) {
    console.log("--- Ace Dryice Build Tool ---");
    console.log("");
    console.log("Options:");
    console.log("  minimal      Places necessary Ace files out in build dir; uses configuration flags below [default]");
    console.log("  normal       Runs four Ace builds--minimal, minimal-noconflict, minimal-min, and minimal-noconflict-min");
    console.log("  demo         Runs demo build of Ace");
    console.log("  full         all of above");
    console.log("  highlighter  ");
    console.log("args:");
    console.log("  --target ./path   path to build folder");
    console.log("flags:");
    console.log("  --h                print this help");
    console.log("  --m                minify");
    console.log("  --nc               namespace require");
    console.log("  --s                shrinkwrap (combines all output files into one)");
    console.log("");
    if (type)
        console.log("  output for " + type + " generated in " + BUILD_DIR);
}

function ace() {
    console.log('# ace License | Readme | Changelog ---------');

    copy.file(ACE_HOME + "/build_support/editor.html",  BUILD_DIR + "/editor.html");
    copy.file(ACE_HOME + "/LICENSE", BUILD_DIR + "/LICENSE");
    copy.file(ACE_HOME + "/ChangeLog.txt", BUILD_DIR + "/ChangeLog.txt");
    
    console.log('# ace ---------');
    for (var i = 0; i < 4; i++)
        buildAce({compress: i & 2, noconflict: i & 1, check: true});
}

function demo() {
    console.log('# kitchen sink ---------');

    var version = "", ref = "";
    try {
        version = JSON.parse(fs.readFileSync(ACE_HOME + "/package.json")).version;
        ref = fs.readFileSync(ACE_HOME + "/.git-ref").toString();
    } catch(e) {}

    function changeComments(data) {
        return (data
            .replace("doc/site/images/ace-logo.png", "demo/kitchen-sink/ace-logo.png")
            .replace(/<!\-\-DEVEL[\d\D]*?DEVEL\-\->/g, "")
            .replace(/PACKAGE\-\->|<!\-\-PACKAGE/g, "")
            .replace(/\/\*DEVEL[\d\D]*?DEVEL\*\//g, "")
            .replace(/PACKAGE\*\/|\/\*PACKAGE/g, "")
            .replace("%version%", version)
            .replace("%commit%", ref)
        );
    }
    
    copy(ACE_HOME +"/demo/kitchen-sink/docs/", BUILD_DIR + "/demo/kitchen-sink/docs/");
    
    copy.file(ACE_HOME + "/demo/kitchen-sink/logo.png", BUILD_DIR + "/demo/kitchen-sink/logo.png");
    copy.file(ACE_HOME + "/demo/kitchen-sink/styles.css", BUILD_DIR + "/demo/kitchen-sink/styles.css");
    copy.file(ACE_HOME + "/kitchen-sink.html", BUILD_DIR + "/kitchen-sink.html", changeComments);

    buildSubmodule({}, {
        require: ["kitchen-sink/demo"],
        projectType: "demo"
    }, BUILD_DIR + "/demo/kitchen-sink/demo");

    copy(ACE_HOME + "/demo/", BUILD_DIR + "/demo/", {
        shallow: true,
        exclude: /\s|requirejs/,
        include: /\.(js|html)$/,
        replace: function(source) {
            if (!/^\s*</.test(source))
                return source;
            var removeRequireJS;
            source = source.replace(/<script src="kitchen-sink\/require.js"[\s\S]+?require\(\[([^\]]+).*/, function(e, m) {
                removeRequireJS = true;
                var scripts = m.split(/,\s*/);
                var result = [];
                function comment(str) {result.push("<!-- " + str + " -->")}
                function script(str) {result.push('<script src="../src/' + str + '.js"></script>')}
                scripts.forEach(function(s) {
                    s = s.replace(/"/g, "");
                    if (s == "ace/ace") {
                        comment("load ace");
                        script("ace");
                    } else {
                        var extName = s.match(/[^/]*$/)[0];
                        comment("load ace " + extName + " extension");
                        script("ext-" + extName);
                    }
                });
                result.push("<script>");
                return result.join("\n");
            });
            if (removeRequireJS)
                source = source.replace(/\s*\}\);?\s*(<\/script>)/, "\n$1");
            source = source.replace(/"\.\.\/build\//g, function(e) {
                console.log(e); return '"../';
            });
            return source;
        }
    });
}

function jsFileList(path, filter) {
    path = ACE_HOME + "/" + path;
    if (!filter)
        filter = /_test/;

    return fs.readdirSync(path).map(function(x) {
        if (x.slice(-3) == ".js" && !filter.test(x) && !/\s|BASE|(\b|_)dummy(\b|_)/.test(x))
            return x.slice(0, -3);
    }).filter(Boolean);
}

function workers(path) {
    return jsFileList(path).map(function(x) {
        if (x.slice(-7) == "_worker")
            return x.slice(0, -7);
    }).filter(function(x) { return !!x; });
}

function modeList() {
    return jsFileList("lib/ace/mode", /_highlight_rules|_test|_worker|xml_util|_outdent|behaviour|completions/);
}

function buildAceModule(opts, callback) {
    // calling buildAceModuleInternal many times in parallel is slow, so we use queue
    if (!buildAceModule.queue) {
        buildAceModule.queue = [];
        buildAceModule.dequeue = function() {
            if (buildAceModule.running) return;
            var call = buildAceModule.queue.shift();
            buildAceModule.running = call;
            if (call)
                buildAceModuleInternal.apply(null, call);
        };
    }
    
    buildAceModule.queue.push([opts, function(err, result) {
        callback && callback(err, result);
        buildAceModule.running = null;
        buildAceModule.dequeue();
    }]);

    if (!buildAceModule.running) {
        buildAceModule.dequeue();
    } else {
        process.nextTick(buildAceModule.dequeue);
    }
}

function buildAceModuleInternal(opts, callback) {
    var cache = opts.cache == undefined ? CACHE : opts.cache;
    var key = opts.require + "|" + opts.projectType;
    if (cache && cache.configs && cache.configs[key])
        return write(null, cache.configs[key]);
        
    var pathConfig = {
        paths: {
            ace: ACE_HOME + "/lib/ace",
            "kitchen-sink": ACE_HOME + "/demo/kitchen-sink",
            build_support:  ACE_HOME + "/build_support"
        },
        root: ACE_HOME
    };
        
    function write(err, result) {
        if (cache && key && !(cache.configs && cache.configs[key])) {
            cache.configs = cache.configs || Object.create(null);
            cache.configs[key] = result;
            result.sources = result.sources.map(function(pkg) {
                return {deps: pkg.deps};
            });
        } 
        
        if (!opts.outputFile)
            return callback(err, result);
        
        var code = result.code;
        if (opts.compress) {
            if (!result.codeMin)
                result.codeMin = compress(result.code);
            code = result.codeMin;
        }
            
        var targetDir = getTargetDir(opts);
        
        var to = /^([\\/]|\w:)/.test(opts.outputFile)
            ? opts.outputFile
            : path.join(opts.outputFolder || targetDir, opts.outputFile);
    
        var filters = [];

        var ns = opts.ns || "ace";
        if (opts.filters)
            filters = filters.concat(opts.filters);
    
        if (opts.noconflict)
            filters.push(namespace(ns));
        var projectType = opts.projectType;
        if (projectType == "main" || projectType == "ext") {
            filters.push(exportAce(ns, opts.require[0],
                opts.noconflict ? ns : "", projectType == "ext"));
        }
        
        filters.push(normalizeLineEndings);
        
        filters.forEach(function(f) { code = f(code); });
        
        build.writeToFile({code: code}, {
            outputFolder: path.dirname(to),
            outputFile: path.basename(to)
        }, function() {});
        
        callback && callback(err, result);
    }
    
    build(opts.require, {
        cache: cache,
        quiet: opts.quiet,
        pathConfig: pathConfig,
        additional: opts.additional,
        enableBrowser: true,
        keepDepArrays: "all",
        noArchitect: true,
        compress: false,
        ignore: opts.ignore || [],
        withRequire: false,
        basepath: ACE_HOME,
        transforms: [normalizeLineEndings],
        afterRead: [optimizeTextModules]
    }, write);
}

function buildCore(options, extra, callback) {
    options = extend(extra, options);
    options.additional = [{
        id: "build_support/mini_require", 
        order: -1000,
        literal: true
    }];
    options.require =["ace/ace"];
    options.projectType = "main";
    options.ns = "ace";
    buildAceModule(options, callback);
}

function buildSubmodule(options, extra, file, callback) {
    options = extend(extra, options);
    getLoadedFileList(options, function(coreFiles) {
        options.outputFile = file + ".js";
        options.ignore = options.ignore || coreFiles;
        options.quiet = true;
        buildAceModule(options, callback);
    });
}

function buildAce(options, callback) {
    var snippetFiles = jsFileList("lib/ace/snippets");
    var modeNames = modeList();

    buildCore(options, {outputFile: "ace.js"}, addCb());
    // modes
    modeNames.forEach(function(name) {
        buildSubmodule(options, {
            projectType: "mode",
            require: ["ace/mode/" + name]
        }, "mode-" + name, addCb());
    });
    // snippets
    modeNames.forEach(function(name) {
        if (snippetFiles.indexOf(name + ".js") == -1)
            addSnippetFile(name);
        
        buildSubmodule(options, {
            require: ["ace/snippets/" + name]
        }, "snippets/" + name, addCb());
    });
    // themes
    jsFileList("lib/ace/theme").forEach(function(name) {
        buildSubmodule(options, {
            projectType: "theme",
            require: ["ace/theme/" + name]
        }, "theme-" +  name, addCb());
    });
    // keybindings
    ["vim", "emacs"].forEach(function(name) {
        buildSubmodule(options, {
            projectType: "keybinding",
            require: ["ace/keyboard/" + name ]
        }, "keybinding-" + name, addCb());
    });
    // extensions
    jsFileList("lib/ace/ext").forEach(function(name) {
        buildSubmodule(options, {
            projectType: "ext",
            require: ["ace/ext/" + name]
        }, "ext-" + name, addCb());
    });
    // workers
    workers("lib/ace/mode").forEach(function(name) {
        buildSubmodule(options, {
            projectType: "worker",
            require: ["ace/mode/" + name + "_worker"],
            ignore: [],
            additional: [{
                id: "ace/worker/worker",
                transforms: [],
                order: -1000
            }]
        }, "worker-" + name, addCb());
    });
    // 
    function addCb() {
        addCb.count = (addCb.count || 0) + 1; 
        return done
    }
    function done() {
        if (--addCb.count > 0)
            return;
        if (options.check)
            sanityCheck(options, callback);
        if (callback) 
            return callback();
        console.log("Finished building " + getTargetDir(options))
    }
}

function getLoadedFileList(options, callback, result) {
    if (!result) {
        return buildCore({}, {}, function(e, result) {
            getLoadedFileList(options, callback, result);
        });
    }
    var deps = Object.create(null);
    result.sources.forEach(function(pkg) {
        pkg.deps && pkg.deps.forEach(function(p) {
            if (!deps[p]) deps[p] = 1;
        });
    });
    delete deps["ace/theme/textmate"];
    deps["ace/ace"] = 1;
    callback(Object.keys(deps));
}

function normalizeLineEndings(module) {
    if (typeof module == "string") 
        module = {source: module};
    return module.source = module.source.replace(/\r\n/g, "\n");
}

function optimizeTextModules(sources) {
    var textModules = {};
    return sources.filter(function(pkg) {
        if (!pkg.id) {
            return true;
        }
        else if (pkg.id.indexOf("text!") > -1) {
            detectTextModules(pkg);
            return false;
        }
        else {
            pkg.source = rewriteTextImports(pkg.source, pkg.deps);
            return true;
        }
    }).map(function(pkg) {
        if (pkg && pkg.deps) {
            pkg.deps = pkg.deps && pkg.deps.filter(function(p) {
                return p.indexOf("text!") == -1;
            });
        }
        return pkg;
    });
    
    function rewriteTextImports(text, deps) {
        return text.replace(/ require\(['"](?:ace|[.\/]+)\/requirejs\/text!(.*?)['"]\)/g, function(_, call) {
            if (call) {
                var dep;
                deps.some(function(d) {
                    if (d.split("/").pop() == call.split("/").pop()) {
                        dep = d;
                        return true;
                    }
                });
    
                call = textModules[dep];
                if (call)
                    return " " + call;
            }
        });
    }
    function detectTextModules(pkg) {
        var input = pkg.source.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        if (/\.css$/.test(pkg.id)) {
            // remove unnecessary whitespace from css
            input = input.replace(/\n\s+/g, "\n");
            input = '"' + input.replace(/\n/g, '\\\n') + '"';
        } else {
            // but don't break other files!
            input = '"' + input.replace(/\n/g, '\\n\\\n') + '"';
        }
        textModules[pkg.id] = input;
    }
}

function namespace(ns) {
    return function(text) {
        text = text
            .toString()
            .replace(/ACE_NAMESPACE\s*=\s*""/, 'ACE_NAMESPACE = "' + ns +'"')
            .replace(/\bdefine\(/g, function(def, index, source) {
                if (/(^|[;}),])\s*$/.test(source.slice(0, index)))
                    return ns + "." + def;
                return def;
            });

        return text;
    };
}

function exportAce(ns, modules, requireBase, extModules) {
    requireBase = requireBase || "window";
    return function(text) {
        /*globals REQUIRE_NS, MODULES, NS*/
        var template = function() {
            (function() {
                REQUIRE_NS.require(MODULES, function(a) {
                    if (a) {
                        a.config.init(true);
                        a.define = REQUIRE_NS.define;
                    }
                    if (!window.NS)
                        window.NS = a;
                    for (var key in a) if (a.hasOwnProperty(key))
                        window.NS[key] = a[key];
                });
            })();
        };
        
        if (extModules) {
            template = function() {
                (function() {
                    REQUIRE_NS.require(MODULES, function() {});
                })();
            };
        }
        
        text = text.replace(/function init\(packaged\) {/, "init(true);$&\n");
        
        if (typeof modules == "string")
            modules = [modules];
            
        return (text.replace(/;\s*$/, "") + ";" + template
            .toString()
            .replace(/MODULES/g, JSON.stringify(modules))
            .replace(/REQUIRE_NS/g, requireBase)
            .replace(/NS/g, ns)
            .slice(13, -1)
        );
    };
}

function updateModes() {
    modeList().forEach(function(m) {
        var filepath = __dirname + "/lib/ace/mode/" + m + ".js";
        var source = fs.readFileSync(filepath, "utf8");
        if (!/this.\$id\s*=\s*"/.test(source))
            source = source.replace(/\n([ \t]*)(\}\).call\(\w*Mode.prototype\))/, '\n$1    this.$id = "";\n$1$2');
        
        source = source.replace(/(this.\$id\s*=\s*)"[^"]*"/,  '$1"ace/mode/' + m + '"');
        fs.writeFileSync(filepath, source, "utf8");
    });
}

function generateThemesModule(themes) {
    var themelist = [
        'define(function(require, exports, module) {',
        '\n\nmodule.exports.themes = ' + JSON.stringify(themes, null, '    '),
        ';\n\n});'
    ].join('');
    fs.writeFileSync(__dirname + '/lib/ace/ext/themelist_utils/themes.js', themelist, 'utf8');
}

function addSnippetFile(modeName) {
    var snippetFilePath = ACE_HOME + "/lib/ace/snippets/" + modeName;
    if (!fs.existsSync(snippetFilePath + ".js")) {
        copy.file(ACE_HOME + "/tool/templates/snippets.js", snippetFilePath + ".js", function(t) {
            return t.replace(/%modeName%/g, modeName);
        });
    }
    if (!fs.existsSync(snippetFilePath + ".snippets")) {
        fs.writeFileSync(snippetFilePath + ".snippets", "");
    }
}

function compress(text) {
    var ujs = require("dryice").copy.filter.uglifyjs;
    ujs.options.mangle_toplevel = {except: ["ACE_NAMESPACE", "requirejs"]};
    ujs.options.beautify = {ascii_only: true, inline_script: true}
    return ujs(text);
}

function extend(base, extra) {
    Object.keys(extra).forEach(function(k) {
        base[k] = extra[k];
    });
    return base;
}

function getTargetDir(opts) {
    var targetDir = BUILD_DIR + "/src";
    if (opts.compress)
        targetDir += "-min";
    if (opts.noconflict)
        targetDir += "-noconflict";
    return targetDir;
}

function sanityCheck(opts, callback) {
    var targetDir = getTargetDir(opts);
    require("child_process").execFile(process.execPath, ["-e", "(" + function() {
        window = global;
        require("./ace");
        if (typeof ace.edit != "function")
            process.exit(1);
        require("fs").readdirSync(".").forEach(function(p) {
            if (!/ace\.js$/.test(p) && /\.js$/.test(p))
                require("./" + p);
        });
        process.exit(0);
    } + ")()"], {
        cwd: targetDir
    }, function(err, stdout) {
        if (callback) return callback(err, stdout);
        if (err)
            throw err;
    });
}

if (!module.parent)
    main(process.argv);
else
    exports.buildAce = buildAce;
