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
if (!fs.existsSync)
    fs.existsSync = require("path").existsSync;
var copy = require('dryice').copy;

var ACE_HOME = __dirname;
var BUILD_DIR = ACE_HOME + "/build";

function main(args) {
    var type = "minimal";
    args = args.map(function(x) {
        if (x[0] == "-" && x[1] != "-")
            return "-" + x;
        return x;
    });

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
        } else if (type == "bm") {
            bookmarklet();
        } else if (type == "full") {
            ace();
            demo();
            bookmarklet();
        }
    }

    console.log("--- Ace Dryice Build Tool ---");
    console.log("");
    console.log("Options:");
    console.log("  minimal     Places necessary Ace files out in build dir; uses configuration flags below [default]");
    console.log("  normal      Runs four Ace builds--minimal, minimal-noconflict, minimal-min, and minimal-noconflict-min");
    console.log("  demo        Runs demo build of Ace");
    console.log("  bm          Runs bookmarklet build of Ace");
    console.log("  full        all of above");
    console.log("args:");
    console.log("  --target ./path   path to build folder");
    console.log("flags:");
    console.log("  --h                print this help");
    console.log("  --m                minify");
    console.log("  --nc               namespace require");
    console.log("  --s                shrinkwrap (combines all output files into one)");
    console.log("");
    if (BUILD_DIR)
        console.log(" output generated in " + type + __dirname + "/" + BUILD_DIR)
}

function bookmarklet() {
    var targetDir = BUILD_DIR + "/textarea";
    copy({
        source: "build_support/editor_textarea.html",
        dest:   targetDir + '/editor.html'
    });
    copy({
        source: "build_support/style.css",
        dest:   targetDir + '/style.css'
    });

    buildAce({
        targetDir: targetDir + "/src",
        ns: "__ace_shadowed__",
        exportModule: "ace/ext/textarea",
        compress: false,
        noconflict: true,
        suffix: "",
        name: "ace-bookmarklet",
        workers: [],
        keybindings: []
    });
}

function ace() {
    console.log('# ace ---------');

    // uncompressed
    buildAce({
        compress: false,
        noconflict: false
    });
    buildAce({
        compress: false,
        noconflict: true
    });

    // compressed
    buildAce({
        compress: true,
        noconflict: false
    });
    buildAce({
        compress: true,
        noconflict: true
    });

    console.log('# ace License | Readme | Changelog ---------');

    copy({
        source: ACE_HOME + "/build_support/editor.html",
        dest:   BUILD_DIR + "/editor.html"
    });
    copy({
        source: ACE_HOME + "/LICENSE",
        dest:   BUILD_DIR + "/LICENSE"
    });
    copy({
        source: ACE_HOME + "/ChangeLog.txt",
        dest:   BUILD_DIR + "/ChangeLog.txt"
    });
}

function demo() {
    console.log('# kitchen sink ---------');

    var version, ref;
    try {
        version = JSON.parse(fs.readFileSync(ACE_HOME + "/package.json")).version;
        ref = fs.readFileSync(ACE_HOME + "/.git-ref").toString();
    } catch(e) {
        ref = "";
        version = "";
    }

    function changeComments(data) {
        return (data
            .replace(/<!\-\-DEVEL[\d\D]*?DEVEL\-\->/g, "")
            .replace(/PACKAGE\-\->|<!\-\-PACKAGE/g, "")
            .replace(/\/\*DEVEL[\d\D]*?DEVEL\*\//g, "")
            .replace(/PACKAGE\*\/|\/\*PACKAGE/g, "")
            .replace("%version%", version)
            .replace("%commit%", ref)
        );
    };

    function fixDocPaths(data) {
        return data.replace(/"(demo|build)\//g, "\"");
    }

    copy({
        source: ACE_HOME + "/kitchen-sink.html",
        dest:   BUILD_DIR + "/kitchen-sink.html",
        filter: [changeComments,  fixDocPaths]
    });

    copy({
        source: ACE_HOME + "/demo/kitchen-sink/styles.css",
        dest:   BUILD_DIR + "/kitchen-sink/styles.css",
        filter: [ changeComments ]
    });

    fs.readdirSync(ACE_HOME +"/demo/kitchen-sink/docs/").forEach(function(x) {
        copy({
            source: ACE_HOME +"/demo/kitchen-sink/docs/" + x,
            dest:   BUILD_DIR + "/kitchen-sink/docs/" + x
        });
    });

    var demo = copy.createDataObject();
    copy({
        source: ACE_HOME + "/demo/kitchen-sink/demo.js",
        dest: demo,
        filter: [changeComments, fixDocPaths, function(data) {
            return data.replace("define(", "define('kitchen-sink/demo',");
        }]
    });
    copy({
        source: ACE_HOME + "/lib/ace/split.js",
        dest: demo,
        filter: [changeComments, function(data) {
            return data.replace("define(", "define('ace/split',");
        }]
    });
    copy({
        source: demo,
        dest:   BUILD_DIR + "/kitchen-sink/demo.js",
    });

    copyFileSync(ACE_HOME + "/demo/kitchen-sink/logo.png", BUILD_DIR + "/kitchen-sink/logo.png");
}

function jsFileList(path, filter) {
    path = ACE_HOME + "/" + path;
    if (!filter)
        filter = /_test/;

    return fs.readdirSync(path).map(function(x) {
        if (x.slice(-3) == ".js" && !filter.test(x))
            return x.slice(0, -3);
    }).filter(function(x){ return !!x });
}

function addSuffix(options) {
    if (options.suffix == null) {
        options.suffix = "";
        if (options.compress)
            options.suffix += "-min";
        if (options.noconflict)
            options.suffix += "-noconflict";
    }
}
var buildAce = function(options) {
    var aceProject = {
        roots: [ACE_HOME + '/lib', ACE_HOME + '/demo'],
        textPluginPattern: /^ace\/requirejs\/text!/
    };

    var defaults = {
        targetDir: BUILD_DIR + "/src",
        ns: "ace",
        exportModule: "ace/ace",
        requires: null,
        compress: false,
        noconflict: false,
        suffix: null,
        name: "ace",
        modes: jsFileList("lib/ace/mode", /_highlight_rules|_test|_worker|xml_util|_outdent|behaviour/),
        themes: jsFileList("lib/ace/theme"),
        extensions: jsFileList("lib/ace/ext"),
        workers: ["javascript", "coffee", "css", "json", "xquery"],
        keybindings: ["vim", "emacs"]
    };

    for(var key in defaults)
        if (!options.hasOwnProperty(key))
            options[key] = defaults[key];

    addSuffix(options);

    if (!options.requires)
        options.requires = [options.exportModule];

    var filters = [
        copy.filter.moduleDefines,
        filterTextPlugin,
        removeUseStrict,
        removeLicenceComments
    ];

    if (options.noconflict) {
        filters.push(namespace(options.ns));
        if (options.exportModule)
            var exportFilter = exportAce(options.ns, options.exportModule, options.ns);
    } else if (options.exportModule) {
        var exportFilter = exportAce(options.ns, options.exportModule);
    }

    if (options.compress)
        filters.push(copy.filter.uglifyjs);

    var targetDir = options.targetDir + options.suffix;
    var name = options.name;

    var project = copy.createCommonJsProject(aceProject);
    var ace = copy.createDataObject();
    copy({
        source: [ACE_HOME + "/build_support/mini_require.js"],
        dest: ace
    });
    copy({
        source: [{
            project: project,
            require: options.requires
        }],
        filter: [ copy.filter.moduleDefines ],
        dest: ace
    });

    copy({
        source: ace,
        filter: exportFilter ? filters.concat(exportFilter) : filters,
        dest:   targetDir + '/' + name + ".js"
    });

    console.log('# ace modes ---------');

    project.assumeAllFilesLoaded();
    options.modes.forEach(function(mode) {
        console.log("mode " + mode);
        copy({
            source: [{
                project: cloneProject(project),
                require: [ 'ace/mode/' + mode ]
            }],
            filter: filters,
            dest:   targetDir + "/mode-" + mode + ".js"
        });
    });

    console.log('# ace themes ---------');

    project.assumeAllFilesLoaded();
    options.themes.forEach(function(theme) {
        console.log("theme " + theme);
        /*copy({
            source: [{
                project: cloneProject(project),
                require: ["ace/theme/" + theme]
            }],
            filter: filters,
            dest:   targetDir + "/theme-" + theme + ".js"
        });*/
        // use this instead, to not create separate modules for js and css
        var themePath = ACE_HOME + "/lib/ace/theme/" + theme;
        var js = fs.readFileSync(themePath + ".js", "utf8");
        js = js.replace("define(", "define('ace/theme/" + theme + "', ['require', 'exports', 'module', 'ace/lib/dom'], ");
        
        if (fs.existsSync(themePath + ".css", "utf8")) {
            var css = fs.readFileSync(themePath + ".css", "utf8")
            js = js.replace(/require\(.ace\/requirejs\/text!.*?\)/, quoteString(css))
        }
        filters.forEach(function(f) {js = f(js); });
        
        fs.writeFileSync(targetDir + "/theme-" + theme + ".js", js); 
    });

    console.log('# ace extensions ---------');

    project.assumeAllFilesLoaded();
    options.extensions.forEach(function(ext) {
        console.log("extensions " + ext);
        copy({
            source: [{
                project: cloneProject(project),
                require: [ 'ace/ext/' + ext ]
            }],
            filter: filters,
            dest:   targetDir + "/ext-" + ext + ".js"
        });
    });

    console.log('# ace key bindings ---------');

    // copy key bindings
    project.assumeAllFilesLoaded();
    options.keybindings.forEach(function(keybinding) {
        copy({
            source: [{
                project: cloneProject(project),
                require: [ 'ace/keyboard/' + keybinding ]
            }],
            filter: filters,
            dest: targetDir + "/keybinding-" + keybinding + ".js"
        });
    });

    console.log('# ace worker ---------');
    
    filters = [
        copy.filter.moduleDefines,
        filterTextPlugin,
        removeUseStrict,
        removeLicenceComments
    ];

    options.workers.forEach(function(mode) {
        console.log("worker for " + mode + " mode");
        var worker = copy.createDataObject();
        var workerProject = copy.createCommonJsProject({
            roots: [ ACE_HOME + '/lib' ],
            textPluginPattern: /^ace\/requirejs\/text!/
        });
        copy({
            source: [{
                project: workerProject,
                require: [
                    'ace/lib/fixoldbrowsers',
                    'ace/lib/event_emitter',
                    'ace/lib/oop',
                    'ace/mode/' + mode + '_worker'
                ]
            }],
            filter: filters,
            dest: worker
        });
        copy({
            source: [
                ACE_HOME + "/lib/ace/worker/worker.js",
                worker
            ],
            filter: options.compress ? [copy.filter.uglifyjs] : [],
            dest: targetDir + "/worker-" + mode + ".js"
        });
    });


    console.log('# combining files into one ---------');

    if (options.shrinkwrap) {
        copy({
          source: { root:targetDir, exclude:/^worker\-/ },
          dest: BUILD_DIR + '/ace-min.js'
        });
    }
}

// TODO: replace with project.clone once it is fixed in dryice
function cloneProject(project) {
    var clone = copy.createCommonJsProject({
        roots: project.roots,
        ignores: project.ignoreRequires,
        textPluginPattern: project.textPluginPattern
    });

    Object.keys(project.currentModules).forEach(function(module) {
        clone.currentModules[module] = project.currentModules[module];
    });

    Object.keys(project.ignoredModules).forEach(function(module) {
        clone.ignoredModules[module] = project.ignoredModules[module];
    });

    return clone;
}
function copyFileSync(srcFile, destFile) {
    var BUF_LENGTH = 64*1024,
        buf = new Buffer(BUF_LENGTH),
        bytesRead = BUF_LENGTH,
        pos = 0,
        fdr = null,
        fdw = null;


    fdr = fs.openSync(srcFile, 'r');
    fdw = fs.openSync(destFile, 'w');

    while (bytesRead === BUF_LENGTH) {
        bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
        fs.writeSync(fdw, buf, 0, bytesRead);
        pos += bytesRead;
    }

    fs.closeSync(fdr);
    fs.closeSync(fdw);
}

function quoteString(str) {
    return '"' + str.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"';
}

function filterTextPlugin(text) {
    return text.replace(/(['"])(ace|[.\/]+?)\/requirejs\/text\!/g, "$1");
}

function removeUseStrict(text) {
    return text.replace(/['"]use strict['"];/g, "");
}

function removeLicenceComments(text) {
    return text.replace(/(;)\s*\/\*[\d\D]*?\*\//g, "$1");
}

function namespace(ns) {
    return function(text) {
        text = text
            .toString()
            .replace('var ACE_NAMESPACE = "";', 'var ACE_NAMESPACE = "' + ns +'";')
            .replace(/\bdefine\(/g, ns + ".define(");

        return text;
    };
}

function exportAce(ns, module, requireBase) {
    requireBase = requireBase || "window";
    module = module || "ace/ace";
    return function(text) {

        var template = function() {
            (function() {
                REQUIRE_NS.require(["MODULE"], function(a) {
                    a && a.config.init();
                    if (!window.NS)
                        window.NS = {};
                    for (var key in a) if (a.hasOwnProperty(key))
                        NS[key] = a[key];
                });
            })();
        };

        return (text + ";" + template
            .toString()
            .replace(/MODULE/g, module)
            .replace(/REQUIRE_NS/g, requireBase)
            .replace(/NS/g, ns)
            .slice(13, -1)
        );
    };
}

if (!module.parent)
    main(process.argv);
else
    exports.buildAce = buildAce;
