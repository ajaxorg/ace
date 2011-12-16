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

var args = process.argv;
var target = null;
var TARGET_DIR = "build";
var NAMESPACE = "ace";
var ROOT_MODULE = "ace/ace";


if (args.length == 3) {
    target = args[2];
    // Check if 'target' contains some allowed value.
    if (target != "normal" && target != "bm") {
        target = null;
    }
}

try {
    var version = JSON.parse(fs.readFileSync(__dirname + "/package.json")).version;
    var ref = fs.readFileSync(__dirname + "/.git-ref").toString();
} catch(e) {
    ref = "";
    version = "";
}

if (!target) {
    console.log("--- Ace Dryice Build Tool ---");
    console.log("");
    console.log("Options:");
    console.log("  normal      Runs embedded build of Ace");
    console.log("  bm          Runs bookmarklet build of Ace");
    process.exit(0);
} else if (target == "bm") {
    TARGET_DIR = "build/textarea";
    NAMESPACE = "__ace_shadowed__";
    ROOT_MODULE = ["ace/ext/textarea"];
}

console.log("using targetDir '", TARGET_DIR, "'");

var copy = require('dryice').copy;

var aceHome = __dirname;

var aceProject = {
    roots: [
        aceHome + '/lib',
        aceHome + '/demo'
    ],
    textPluginPattern: /^ace\/requirejs\/text!/
};

if (target == "normal") {
    copy({
        source: "build_support/editor.html",
        dest:   TARGET_DIR + '/editor.html'
    });
    
    demo();
} else if (target == "bm") {
    copy({
        source: "build_support/editor_textarea.html",
        dest:   TARGET_DIR + '/editor.html'
    });
    copy({
        source: "doc/site/images/body_background.png",
        dest:   TARGET_DIR + '/body_background.png'
    });
    copy({
        source: "build_support/style.css",
        dest:   TARGET_DIR + '/style.css'
    });
}

var project = copy.createCommonJsProject(aceProject);


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

var ace = copy.createDataObject();
copy({
    source: ["build_support/mini_require.js"],
    dest: ace
});
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: ROOT_MODULE
        })
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: ace
});
copy({
    source: {
        root: project,
        include: /.*\.css$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: ace
});

console.log('# ace ---------');

// Create the compressed and uncompressed output files
copy({
    source: ace,
    filter: [filterTextPlugin, exportAce(NAMESPACE, ROOT_MODULE), copy.filter.uglifyjs],
    dest:   TARGET_DIR + '/src/ace.js'
});
copy({
    source: ace,
    filter: [filterTextPlugin, exportAce(NAMESPACE, ROOT_MODULE)],
    dest:   TARGET_DIR + '/src/ace-uncompressed.js'
});
copy({
    source: ace,
    filter: [filterTextPlugin, namespace(NAMESPACE), exportAce(NAMESPACE, ROOT_MODULE, NAMESPACE), copy.filter.uglifyjs],
    dest:   TARGET_DIR + '/src/ace-noconflict.js'
});
copy({
    source: ace,
    filter: [filterTextPlugin, namespace(NAMESPACE), exportAce(NAMESPACE, ROOT_MODULE, NAMESPACE)],
    dest:   TARGET_DIR + '/src/ace-uncompressed-noconflict.js'
});

project.assumeAllFilesLoaded();
copy({
    source: [
        copy.source.commonjs({
            project: cloneProject(project),
            require: [ "pilot/index" ]
        })
    ],
    filter: [filterTextPlugin, copy.filter.uglifyjs],
    dest:   TARGET_DIR + "/src/ace-compat.js"
});
    
var modeThemeFilters = [
    copy.filter.moduleDefines,
    filterTextPlugin,
    copy.filter.uglifyjs
];

console.log('# ace modes ---------');

project.assumeAllFilesLoaded();
[
    "css", "html", "javascript", "php", "coldfusion", "python", "lua", "xml", "ruby", "java", "c_cpp",
    "coffee", "perl", "csharp", "haxe", "svg", "clojure", "scss", "json", "groovy",
    "ocaml", "scala", "textile", "scad", "markdown", "latex", "powershell", "sql"
].forEach(function(mode) {
    console.log("mode " + mode);
    var source = [
        copy.source.commonjs({
            project: cloneProject(project),
            require: [ 'ace/mode/' + mode ]
        })
    ];
    copy({
        source: source,
        filter: modeThemeFilters,
        dest:   TARGET_DIR + "/src/mode-" + mode + ".js"
    });
    copy({
        source: source,
        filter: [namespace(NAMESPACE)].concat(modeThemeFilters),
        dest:   TARGET_DIR + "/src/mode-" + mode + "-noconflict.js"
    });
});

console.log('# ace themes ---------');

[
    "chrome", "clouds", "clouds_midnight", "cobalt", "crimson_editor", "dawn", 
    "dreamweaver", "eclipse",
    "idle_fingers", "kr_theme", "merbivore", "merbivore_soft",
    "mono_industrial", "monokai", "pastel_on_dark", "solarized_dark",
    "solarized_light", "textmate", "tomorrow", "tomorrow_night",
    "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties",
    "twilight", "vibrant_ink"
].forEach(function(theme) {
    var source = [{
        root: aceHome + '/lib',
        include: "ace/theme/" + theme + ".js"
    }];
    copy({
        source: source,
        filter: modeThemeFilters,
        dest:   TARGET_DIR + "/src/theme-" + theme + ".js"
    });
    copy({
        source: source,
        filter: [namespace(NAMESPACE)].concat(modeThemeFilters),
        dest:   TARGET_DIR + "/src/theme-" + theme + "-noconflict.js"
    });
});

console.log('# ace License | Readme | Changelog ---------');

copy({
    source: aceHome + "/LICENSE",
    dest:   TARGET_DIR + '/LICENSE'
});
copy({
    source: aceHome + "/Readme.md",
    dest:   TARGET_DIR + '/Readme.md'
});
copy({
    source: aceHome + "/ChangeLog.txt",
    dest:   TARGET_DIR + '/ChangeLog.txt'
});

// For the bookmarklet build, we are done.
if (target == "bm") {
    process.exit(0);
}

console.log('# ace worker ---------');

["javascript", "coffee", "css"].forEach(function(mode) {
    console.log("worker for " + mode + " mode");
    var worker = copy.createDataObject();
    var workerProject = copy.createCommonJsProject({
        roots: [
            aceHome + '/lib'
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
        filter: [ copy.filter.moduleDefines],
        dest: worker
    });
    copy({
        source: [
            aceHome + "/lib/ace/worker/worker.js",
            worker
        ],
        filter: [ filterTextPlugin/*, copy.filter.uglifyjs*/ ],
        dest: "build/src/worker-" + mode + ".js"
    });
});

console.log('# ace key bindings ---------');

// copy key bindings
project.assumeAllFilesLoaded();
["vim", "emacs"].forEach(function(keybinding) {
    var source = [
        copy.source.commonjs({
            project: cloneProject(project),
            require: [ 'ace/keyboard/keybinding/' + keybinding ]
        })
    ];
    copy({
        source: source,
        filter: modeThemeFilters,
        dest: "build/src/keybinding-" + keybinding + ".js"
    });
    copy({
        source: source,
        filter: [namespace(NAMESPACE)].concat(modeThemeFilters),
        dest: "build/src/keybinding-" + keybinding + "-noconflict.js"
    });
});

function demo() {
    console.log('# kitchen sink ---------');

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

    var project = copy.createCommonJsProject(aceProject);
    var demo = copy.createDataObject();
    copy({
        source: [
            'build_support/mini_require.js'
        ],
        dest: demo
    });
    copy({
        source: [
            copy.source.commonjs({
                project: project,
                require: [ "kitchen-sink/demo" ]
            })
        ],
        filter: [ copy.filter.moduleDefines ],
        dest: demo
    });
    copy({
        source: demo,
        filter: [ filterTextPlugin ],
        dest: 'build/demo/kitchen-sink/kitchen-sink-uncompressed.js'
    });
    copy({
        source: demo,
        filter: [ copy.filter.uglifyjs, filterTextPlugin ],
        dest: 'build/demo/kitchen-sink/kitchen-sink.js'
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
};

