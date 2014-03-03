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
if (!fs.existsSync)
    fs.existsSync = path.existsSync;
else
    path.existsSync = fs.existsSync;
var copy = require('dryice').copy;

var ACE_HOME = __dirname;
var BUILD_DIR = ACE_HOME + "/build";

function main(args) {
    if (args.indexOf("updateModes") !== -1) {
        return updateModes();
    }
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
            demo(ace());
            bookmarklet();
        } else if (type == "highlighter") {
            var project = buildAce({
                coreOnly: true,
                exportModule: "ace/ext/static_highlight",
                requires: ["ace/ext/static_highlight", "ace/theme/textmate"],
                readFilters: [copy.filter.moduleDefines, function(a) {
                    console.log(a.substring(0, 2500))
                    return a
                }]
            })
            copy({
                source: project.result,
                filter: getWriteFilters(project.options, "main"),
                dest:   BUILD_DIR + "/static_highlight.js"
            });
        }
    }

    console.log("--- Ace Dryice Build Tool ---");
    console.log("");
    console.log("Options:");
    console.log("  minimal      Places necessary Ace files out in build dir; uses configuration flags below [default]");
    console.log("  normal       Runs four Ace builds--minimal, minimal-noconflict, minimal-min, and minimal-noconflict-min");
    console.log("  demo         Runs demo build of Ace");
    console.log("  bm           Runs bookmarklet build of Ace");
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
    var project = buildAce({
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

    return project;
}

function demo(project) {
    project = project || buildAce({
        compress: false,
        noconflict: false,
        coreOnly: true
    });
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
        filter: [changeComments, fixDocPaths]
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

    project.assumeAllFilesLoaded();
    copy({
        source: [{
            project: cloneProject(project),
            require: [ "kitchen-sink/demo" ]
        }],
        filter: getWriteFilters({filters:[fixDocPaths]}, "demo"),
        dest: demo
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
        if (x.slice(-3) == ".js" && !filter.test(x) && !/\s/.test(x))
            return x.slice(0, -3);
    }).filter(function(x){ return !!x });
}

function workers(path) {
    return jsFileList(path).map(function(x) {
        if (x.slice(-7) == "_worker")
            return x.slice(0, -7);
    }).filter(function(x) { return !!x; });
}
function modeList() {
    return jsFileList("lib/ace/mode", /_highlight_rules|_test|_worker|xml_util|_outdent|behaviour|completions/)
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

function getWriteFilters(options, projectType, main) {
    var filters = [
        copy.filter.moduleDefines,
        removeUseStrict,
        removeLicenceComments,
        inlineTextModules
    ];

    if (options.filters)
        filters = filters.concat(options.filters);

    if (options.noconflict)
        filters.push(namespace(options.ns));

    if (options.compress)
        filters.push(copy.filter.uglifyjs);
    
    // copy.filter.uglifyjs.options.ascii = true; doesn't work with some uglify.js versions
    filters.push(function(text) {
         var t1 = text.replace(/[\x80-\uffff]/g, function(c) {
            c = c.charCodeAt(0).toString(16);
            if (c.length == 2)
                return "\\x" + c;
            if (c.length == 3)
                c = "0" + c;
            return "\\u" + c;
        });
        return text; 
    });
    
    if (options.exportModule && projectType == "main" || projectType == "ext") {
        filters.push(exportAce(options.ns, options.exportModule,
            options.noconflict ? options.ns : "", projectType == "ext" && main));
    }
    return filters;
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
        modes: modeList(),
        themes: jsFileList("lib/ace/theme"),
        extensions: jsFileList("lib/ace/ext"),
        workers: workers("lib/ace/mode"),
        keybindings: ["vim", "emacs"],
        readFilters: [copy.filter.moduleDefines]
    };

    for(var key in defaults)
        if (!options.hasOwnProperty(key))
            options[key] = defaults[key];

    addSuffix(options);

    if (!options.requires)
        options.requires = [options.exportModule];

    var targetDir = options.targetDir + options.suffix;
    var name = options.name;

    var project = copy.createCommonJsProject(aceProject);
    project.options = options;
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
        filter: options.readFilters,
        dest: ace
    });

    if (options.coreOnly) {
        project.result = ace;
        return project;
    }
    copy({
        source: ace,
        filter: getWriteFilters(options, "main"),
        dest:   targetDir + '/' + name + ".js"
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
            filter: getWriteFilters(options, "ext", 'ace/ext/' + ext),
            dest:   targetDir + "/ext-" + ext + ".js"
        });
    });

    console.log('# ace modes ---------');

    project.assumeAllFilesLoaded();
    options.modes.forEach(function(mode) {
        console.log("mode " + mode);
        addSnippetFile(mode, project, targetDir, options);
        copy({
            source: [{
                project: cloneProject(project),
                require: [ 'ace/mode/' + mode ]
            }],
            filter: getWriteFilters(options, "mode"),
            dest:   targetDir + "/mode-" + mode + ".js"
        });
    });

    console.log('# ace themes ---------');

    project.assumeAllFilesLoaded();
    delete project.ignoredModules["ace/theme/textmate"];
    delete project.ignoredModules["ace/requirejs/text!ace/theme/textmate.css"];
    
    options.themes.forEach(function(theme) {
        console.log("theme " + theme);
        copy({
            source: [{
                project: cloneProject(project),
                require: ["ace/theme/" + theme]
            }],
            filter: getWriteFilters(options, "theme"),
            dest:   targetDir + "/theme-" + theme.replace("_theme", "") + ".js"
        });
    });
    
    // generateThemesModule(options.themes);

    console.log('# ace key bindings ---------');

    // copy key bindings
    project.assumeAllFilesLoaded();
    options.keybindings.forEach(function(keybinding) {
        copy({
            source: [{
                project: cloneProject(project),
                require: [ 'ace/keyboard/' + keybinding ]
            }],
            filter: getWriteFilters(options, "keybinding"),
            dest: targetDir + "/keybinding-" + keybinding + ".js"
        });
    });

    console.log('# ace worker ---------');

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
                    'ace/worker/worker',
                    'ace/mode/' + mode + '_worker'
                ]
            }],
            filter: getWriteFilters(options, "worker"),
            dest: worker
        });
        copy({
            source: [
                worker
            ],
            filter: options.compress ? [copy.filter.uglifyjs] : [],
            dest: targetDir + "/worker-" + mode + ".js"
        });
    });


    if (options.shrinkwrap) {
        console.log('# combining files into one ---------');
        copy({
          source: { root:targetDir, exclude:/(^|\\|\/)worker\-[^\\\/]*\.js$/ },
          dest: BUILD_DIR + '/ace-min.js'
        });
    }

    return project;
};

// silence annoying messages from dryice
var buildAce = function(fn) {
    return function() {
        var log = console.log
        console.log = function() {
            if (typeof arguments[0] == "string" && /Ignoring requirement/.test(arguments[0]))
                return;
            log.apply(console, arguments);
        }
        var ret = fn.apply(null, arguments);
        console.log = log;
        return ret;
    }
}(buildAce);

var addSnippetFile = function(modeName, project, targetDir, options) {
    var snippetFilePath = ACE_HOME + "/lib/ace/snippets/" + modeName;
    if (!fs.existsSync(snippetFilePath + ".js")) {
        copy({
            source: ACE_HOME + "/tool/snippets.tmpl.js",
            dest:   snippetFilePath + ".js",
            filter: [
                function(t) {return t.replace(/%modeName%/g, modeName);}
            ]
        });
    }
    if (!fs.existsSync(snippetFilePath + ".snippets")) {
        fs.writeFileSync(snippetFilePath + ".snippets", "")
    }
    copy({
        source: [{
            project: cloneProject(project),
            require: [ 'ace/snippets/' + modeName ]
        }],
        filter: getWriteFilters(options, "mode"),
        dest:   targetDir + "/snippets/" + modeName + ".js"
    });
}

var textModules = {}
var detectTextModules = function(input, source) {
    if (!source)
        throw new Error('Missing filename for text module');

    if (typeof input !== 'string')
        input = input.toString();

    var module = source.isLocation ? source.path : source;

    input = input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    if (/\.css$/.test(module)) {
        // remove unnecessary whitespace from css
        input = input.replace(/\n\s+/g, "\n");
        input = '"' + input.replace(/\r?\n/g, '\\\n') + '"';
    } else {
        // but don't break other files!
        input = '"' + input.replace(/\r?\n/g, '\\n\\\n') + '"';
    }
    textModules[module] = input;

    return "";
};
detectTextModules.onRead = true;
copy.filter.addDefines = detectTextModules;

function generateThemesModule(themes) {
    var themelist = [
        'define(function(require, exports, module) {',
        '\n\nmodule.exports.themes = ' + JSON.stringify(themes, null, '    '),
        ';\n\n});'
    ].join('');
    fs.writeFileSync(__dirname + '/lib/ace/ext/themelist_utils/themes.js', themelist, 'utf8');
}

function inlineTextModules(text) {
    var deps = [];
    return text.replace(/, *['"]ace\/requirejs\/text!(.*?)['"]| require\(['"](?:ace|[.\/]+)\/requirejs\/text!(.*?)['"]\)/g, function(_, dep, call) {
        if (dep) {
            deps.push(dep);
            return "";
        } else if (call) {
            deps.some(function(d) {
                if (d.split("/").pop() == call.split("/").pop()) {
                    dep = d;
                    return true;
                }
            });

            call = textModules[dep];
            // if (deps.length > 1)
            //     console.log(call.length)
            if (call)
                return " " + call;
        }
    });
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

function removeUseStrict(text) {
    return text.replace(/['"]use strict['"];/g, "");
}

function removeLicenceComments(text) {
    return text.replace(/(?:(;)|\n)\s*\/\*[\d\D]*?\*\/|\n\s*\/\/.*/g, "$1");
}

function namespace(ns) {
    return function(text) {
        text = text
            .toString()
            .replace('var ACE_NAMESPACE = "";', 'var ACE_NAMESPACE = "' + ns +'";')
            .replace(/(\.define)|\bdefine\(/g, function(_, a) {
                return a || ns + ".define("
            });

        return text;
    };
}

function exportAce(ns, module, requireBase, extModule) {
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
        
        if (extModule) {
            module = extModule;
            template = function() {
                (function() {
                    REQUIRE_NS.require(["MODULE"], function() {});
                })();
            };
        }
        
        return (text + ";" + template
            .toString()
            .replace(/MODULE/g, module)
            .replace(/REQUIRE_NS/g, requireBase)
            .replace(/NS/g, ns)
            .slice(13, -1)
        );
    };
}

function updateModes() {
    modeList().forEach(function(m) {
        var filepath = __dirname + "/lib/ace/mode/" + m + ".js"
        var source = fs.readFileSync(filepath, "utf8");
        if (!/this.\$id\s*=\s*"/.test(source))
            source = source.replace(/\n([ \t]*)(\}\).call\(\w*Mode.prototype\))/, '\n$1    this.$id = "";\n$1$2');
        
        source = source.replace(/(this.\$id\s*=\s*)"[^"]*"/,  '$1"ace/mode/' + m + '"');
        fs.writeFileSync(filepath, source, "utf8")
    })
}

if (!module.parent)
    main(process.argv);
else
    exports.buildAce = buildAce;
