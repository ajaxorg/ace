#!/usr/bin/env node
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Julian Viereck <julian.viereck@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var fs = require("fs");
var copy = require('dryice').copy;

var ACE_HOME = __dirname;

function main(args) {
    var target;
    if (args.length == 3) {
        target = args[2];
        // Check if 'target' contains some allowed value.
        if (target != "normal" && target != "bm" && target != "demo") {
            target = null;
        }
    }
    
    if (!target) {
        console.log("--- Ace Dryice Build Tool ---");
        console.log("");
        console.log("Options:");
        console.log("  normal      Runs embedded build of Ace");
        console.log("  demo      Runs demo build of Ace");
        console.log("  bm          Runs bookmarklet build of Ace");
        process.exit(0);
    }
    
    var aceProject = {
        roots: [
            ACE_HOME + '/lib',
            ACE_HOME + '/demo'
        ],
        textPluginPattern: /^ace\/requirejs\/text!/
    };
    
    if (target == "normal") {
        ace(aceProject);
    }
    else if (target == "demo") {
        demo(aceProject);
    }
    else if (target == "bm") {
        bookmarklet(aceProject);
    }
}

function bookmarklet(aceProject) {
    var targetDir = "build/textarea";
    copy({
        source: "build_support/editor_textarea.html",
        dest:   targetDir + '/editor.html'
    });
    copy({
        source: "build_support/style.css",
        dest:   targetDir + '/style.css'
    });
    
    buildAce(aceProject, {
        targetDir: targetDir + "/src",
        ns: "__ace_shadowed__",
        exportModule: "ace/ext/textarea",
        compress: false,
        noconflict: true,
        suffix: ".js",
        compat: false,
        name: "ace-bookmarklet",
        workers: [],
        keybindings: []
    });
}

function ace(aceProject) {
    console.log('# ace ---------');

    // uncompressed
    buildAce(aceProject, {
        compress: false,
        noconflict: false,
        suffix: "-uncompressed.js",
        compat: true,
        name: "ace"
    });
    buildAce(aceProject, {
        compress: false,
        noconflict: true,
        suffix: "-uncompressed-noconflict.js",
        compat: true,
        name: "ace",
        workers: []
    });
    
    // compressed
    buildAce(aceProject, {
        compress: true,
        noconflict: false,
        suffix: ".js",
        compat: true,
        name: "ace",
        workers: []
    });
    buildAce(aceProject, {
        compress: true,
        noconflict: true,
        suffix: "-noconflict.js",
        compat: true,
        name: "ace",
        workers: []
    });

    console.log('# ace License | Readme | Changelog ---------');
    
    copy({
        source: "build_support/editor.html",
        dest:   "build/editor.html"
    });
    copy({
        source: ACE_HOME + "/LICENSE",
        dest:   "build/LICENSE"
    });
    copy({
        source: ACE_HOME + "/Readme.md",
        dest:   "build/Readme.md"
    });
    copy({
        source: ACE_HOME + "/ChangeLog.txt",
        dest:   "build/ChangeLog.txt"
    });
}

function demo(aceProject) {
    console.log('# kitchen sink ---------');

    var version, ref;
    try {
        version = JSON.parse(fs.readFileSync(__dirname + "/package.json")).version;
        ref = fs.readFileSync(__dirname + "/.git-ref").toString();
    } catch(e) {
        ref = "";
        version = "";
    }
    
    copy({
        source: "kitchen-sink.html",
        dest:   "build/kitchen-sink.html",
        filter: [ function(data) {
            return (data
                .replace("DEVEL-->", "")
                .replace("<!--DEVEL", "")
                .replace("PACKAGE-->", "")
                .replace("<!--PACKAGE", "")
                .replace("%version%", version)
                .replace("%commit%", ref)
            );
        }]
    });
    
    buildAce(aceProject, {
        targetDir: "build/demo/kitchen-sink",
        ns: "ace",
        requires: "kitchen-sink/demo",
        compress: false,
        noconflict: false,
        compat: false,
        name: "kitchen-sink",
        suffix: "-uncompressed.js",
        modes: [],
        keybindings: []
    });
}

function buildAce(aceProject, options) {
    
    var defaults = {
        targetDir: __dirname + "/build/src",
        ns: "ace",
        exportModule: "ace/ace",
        requires: null,
        compress: false,
        noconflict: false,
        suffix: ".js",
        name: "ace",
        compat: true,
        modes: [
            "css", "html", "javascript", "php", "coldfusion", "python", "lua", "xml", "ruby", "java", "c_cpp",
            "coffee", "perl", "csharp", "haxe", "svg", "clojure", "scss", "json", "groovy",
            "ocaml", "scala", "textile", "scad", "markdown", "latex", "powershell", "sql", "pgsql"
        ],
        themes: [
            "chrome", "clouds", "clouds_midnight", "cobalt", "crimson_editor", "dawn", 
            "dreamweaver", "eclipse",
            "idle_fingers", "kr_theme", "merbivore", "merbivore_soft",
            "mono_industrial", "monokai", "pastel_on_dark", "solarized_dark",
            "solarized_light", "textmate", "tomorrow", "tomorrow_night",
            "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties",
            "twilight", "vibrant_ink"
        ],
        workers: ["javascript", "coffee", "css"],
        keybindings: ["vim", "emacs"]
    };
    
    for(var key in defaults)
        if (!options.hasOwnProperty(key))
            options[key] = defaults[key];
    
    if (!options.requires)
        options.requires = [options.exportModule];

    var filters = [copy.filter.moduleDefines, filterTextPlugin];

    if (options.noconflict) {
        filters.push(namespace(options.ns));
        if (options.exportModule)
            filters.push(exportAce(options.ns, options.exportModule, options.ns));
    } else if (options.exportModule) {
        filters.push(exportAce(options.ns, options.exportModule));
    }
    
    if (options.compress)
        filters.push(copy.filter.uglifyjs);
        
    var suffix = options.suffix;
    var targetDir = options.targetDir;
    var name = options.name;
    
    var project = copy.createCommonJsProject(aceProject);
    var ace = copy.createDataObject();
    copy({
        source: ["build_support/mini_require.js"],
        dest: ace
    });
    copy({
        source: [
            copy.source.commonjs({
                project: project,
                require: options.requires
            })
        ],
        filter: [ copy.filter.moduleDefines ],
        dest: ace
    });
    
    copy({
        source: ace,
        filter: filters,
        dest:   targetDir + '/' + name + suffix
    });
    
    if (options.compat) {
        project.assumeAllFilesLoaded();
        copy({
            source: [
            copy.source.commonjs({
                    project: cloneProject(project),
                    require: [ "pilot/index" ]
                })
            ],
            filter: filters,
            dest:   targetDir + "/" + name + "-compat" + suffix
        });
    }

    console.log('# ace modes ---------');
    
    project.assumeAllFilesLoaded();
    options.modes.forEach(function(mode) {
        console.log("mode " + mode);
        copy({
            source: [
            copy.source.commonjs({
                    project: cloneProject(project),
                    require: [ 'ace/mode/' + mode ]
                })
            ],
            filter: filters,
            dest:   targetDir + "/mode-" + mode + suffix
        });
    });
    
    console.log('# ace themes ---------');
    
    options.themes.forEach(function(theme) {
        console.log("theme " + theme);
        copy({
            source: [{
                root: ACE_HOME + '/lib',
                include: "ace/theme/" + theme + ".js"
            }],
            filter: filters,
            dest:   targetDir + "/theme-" + theme + suffix
        });
    });
    
    console.log('# ace worker ---------');
    
    options.workers.forEach(function(mode) {
        console.log("worker for " + mode + " mode");
        var worker = copy.createDataObject();
        var workerProject = copy.createCommonJsProject({
            roots: [
                ACE_HOME + '/lib'
            ],
            textPluginPattern: /^ace\/requirejs\/text!/
        });
        copy({
            source: [
                copy.source.commonjs({
                    project: workerProject,
                    require: [
                        'ace/lib/fixoldbrowsers',
                        'ace/lib/event_emitter',
                        'ace/lib/oop',
                        'ace/mode/' + mode + '_worker'
                    ]
                })
            ],
            filter: [ copy.filter.moduleDefines, filterTextPlugin ],
            dest: worker
        });
        copy({
            source: [
                ACE_HOME + "/lib/ace/worker/worker.js",
                worker
            ],
            filter: [ /* copy.filter.uglifyjs */],
            dest: targetDir + "/worker-" + mode + ".js"
        });
    });
    
    console.log('# ace key bindings ---------');
    
    // copy key bindings
    project.assumeAllFilesLoaded();
    options.keybindings.forEach(function(keybinding) {
        copy({
            source: [
            copy.source.commonjs({
                    project: cloneProject(project),
                    require: [ 'ace/keyboard/keybinding/' + keybinding ]
                })
            ],
            filter: filters,
            dest: "build/src/keybinding-" + keybinding + suffix
        });
    });
}

// TODO: replace with project.clone once it is fixed in dryice
function cloneProject(project) {
    var clone = copy.createCommonJsProject({
        roots: project.roots,
        ignores: project.ignoreRequires
    });

    Object.keys(project.currentFiles).forEach(function(module) {
        clone.currentFiles[module] = project.currentFiles[module];
    });

    Object.keys(project.ignoredFiles).forEach(function(module) {
        clone.ignoredFiles[module] = project.ignoredFiles[module];
    });

    return clone;
}

function filterTextPlugin(text) {
    return text.replace(/(['"])ace\/requirejs\/text\!/g, "$1text!");
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
