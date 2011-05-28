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

var args = process.argv;
var target = null;
var targetDir = null;
if (args.length == 3) {
    target = args[2];
    // Check if 'target' contains some allowed value.
    if (target != "normal" && target != "bm") {
        target = null;
    }
}

if (!target) {
    console.log("--- Ace Dryice Build Tool ---");
    console.log("");
    console.log("Options:");
    console.log("  normal      Runs embedded build of Ace");
    console.log("  bm          Runs bookmarklet build of Ace");
    process.exit(0);
} else {
    if (target == "normal") {
        targetDir = "build";
    } else {
        targetDir = "build/textarea";
        function shadow(input) {
            if (typeof input !== 'string') {
                input = input.toString();
            }

            return input.replace(/define\(/g, "__ace_shadowed__.define(");
        }
    }
}

console.log("using targetDir '", targetDir, "'");

var copy = require('dryice').copy;

var aceHome = __dirname;

console.log('# ace ---------');

var aceProject = [
    aceHome + '/support/pilot/lib',
    aceHome + '/lib'
];

if (target == "normal") {
    aceProject.push(aceHome + '/demo');

    copy({
        source: "build_support/editor.html",
        dest:   targetDir + '/editor.html'
    });
} else if(target == "bm") {
    copy({
        source: "build_support/editor_textarea.html",
        dest:   targetDir + '/editor.html'
    });
    copy({
        source: "build_support/style.css",
        dest:   targetDir + '/style.css'
    });
}

var project = copy.createCommonJsProject(aceProject);


function filterTextPlugin(text) {
    return text.replace(/(['"])text\!/g, "$1text/");
    /*return text
        .replace(/define\(\s*['"]text\!\)/g, "text/")
        .replace(/require\(\s*['"]text\!\)/g, "text/")*/
}

var ace = copy.createDataObject();
copy({
    source: [
        target == "normal"
            ? 'build_support/mini_require.js'
            : 'build_support/mini_require_textarea.js'
    ],
    dest: ace
});
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: [
                "pilot/fixoldbrowsers",
                "ace/ace"
            ]
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
copy({
    source: [
        target == "normal"
            ? 'build_support/boot.js'
            : 'build_support/boot_textarea.js'
    ],
    dest: ace
});

if (target == "normal") {
    // Create the compressed and uncompressed output files
    copy({
        source: ace,
        filter: [copy.filter.uglifyjs, filterTextPlugin],
        dest:   targetDir + '/src/ace.js'
    });
    copy({
        source: ace,
        filter: [filterTextPlugin],
        dest:   targetDir + '/src/ace-uncompressed.js'
    });
} else if (target == "bm") {
    copy({
        source: ace,
        filter: [
            shadow,
            copy.filter.uglifyjs
        ],
        dest:   targetDir + '/src/ace.js'
    });
    copy({
        source: ace,
        filter: [
            shadow
        ],
        dest:   targetDir + '/src/ace-uncompressed.js'
    });
}

var modeThemeFilters;
if (target == "normal") {
    modeThemeFilters = [
        copy.filter.moduleDefines,
        copy.filter.uglifyjs,
        filterTextPlugin
    ];
} else if (target == "bm") {
    modeThemeFilters = [
        copy.filter.moduleDefines,
        shadow,
        copy.filter.uglifyjs
    ]
}

console.log('# ace modes ---------');

project.assumeAllFilesLoaded();
[
    "css", "html", "javascript", "php", "python", "xml", "ruby", "java", "c_cpp",
    "coffee", "perl", "csharp", "svg", "clojure"
].forEach(function(mode) {
    console.log("mode " + mode);
    copy({
        source: [
            copy.source.commonjs({
                project: project.clone(),
                require: [ 'ace/mode/' + mode ]
            })
        ],
        filter: modeThemeFilters,
        dest:   targetDir + "/src/mode-" + mode + ".js"
    });
});

console.log('# ace themes ---------');

[
    "clouds", "clouds_midnight", "cobalt", "dawn", "idle_fingers", "kr_theme",
    "mono_industrial", "monokai", "pastel_on_dark", "twilight", "eclipse",
    "merbivore", "merbivore_soft", "vibrant_ink"
].forEach(function(theme) {
    copy({
        source: [{
            root: aceHome + '/lib',
            include: "ace/theme/" + theme + ".js"
        }],
        filter: modeThemeFilters,
        dest:   targetDir + "/src/theme-" + theme + ".js"
    });
});

console.log('# ace License | Readme | Changelog ---------');

copy({
    source: aceHome + "/LICENSE",
    dest:   targetDir + '/LICENSE'
});
copy({
    source: aceHome + "/Readme.md",
    dest:   targetDir + '/Readme.md'
});
copy({
    source: aceHome + "/ChangeLog.txt",
    dest:   targetDir + '/ChangeLog.txt'
});

// For the bookmarklet build, we are done.
if (target == "bm") {
    process.exit(0);
}

console.log('# ace worker ---------');

["javascript", "coffee"].forEach(function(mode) {
    console.log("worker for " + mode + " mode");
    var worker = copy.createDataObject();
    var workerProject = copy.createCommonJsProject([
        aceHome + '/support/pilot/lib',
        aceHome + '/lib'
    ]);
    copy({
        source: [
            copy.source.commonjs({
                project: workerProject,
                require: [
                    'pilot/fixoldbrowsers',
                    'pilot/event_emitter',
                    'pilot/oop',
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
        filter: [ copy.filter.uglifyjs, filterTextPlugin ],
        dest: "build/src/worker-" + mode + ".js"
    });
});

console.log('# ace key bindings ---------');

// copy key bindings
project.assumeAllFilesLoaded();
["vim", "emacs"].forEach(function(keybinding) {
    copy({
        source: [
            copy.source.commonjs({
                project: project.clone(),
                require: [ 'ace/keyboard/keybinding/' + keybinding ]
            })
        ],
        filter: [ copy.filter.moduleDefines, copy.filter.uglifyjs, filterTextPlugin ],
        dest: "build/src/keybinding-" + keybinding + ".js"
    });
});

console.log('# cockpit ---------');

project.assumeAllFilesLoaded();
project.addRoot(aceHome + '/support/cockpit/lib');

var cockpit = copy.createDataObject();
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: [ 'cockpit/index' ]
        })
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: cockpit
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.css$|.*\.html$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: cockpit
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.png$|.*\.gif$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.base64 ],
    dest: cockpit
});

// Create the compressed and uncompressed output files
copy({
    source: cockpit,
    filter: copy.filter.uglifyjs,
    dest: 'build/src/cockpit.js'
});
copy({
    source: cockpit,
    dest: 'build/src/cockpit-uncompressed.js'
});

// copy complex demo
//copy({
//    source: aceHome + "/editor.html",
//    filter: [ function(data) {
//        var includes = [
//            "ace", "cockpit",
//            "keybinding-vim", "keybinding-emacs",
//            "mode-javascript", "mode-css", "mode-html", "mode-php", "mode-python",
//            "mode-xml",
//            "theme-clouds", "theme-clouds_midnight", "theme-cobalt",
//            "theme-dawn", "theme-idle_fingers", "theme-kr_theme",
//            "theme-mono_industrial", "theme-monokai", "theme-pastel_on_dark",
//            "theme-twilight"
//        ].map(function(module) {
//            return '<script src="src/' + module + '.js" type="text/javascript"></script>';
//        }).join("\n");
//        return (
//            data.replace('<script src="demo/require.js" type="text/javascript" charset="utf-8"></script>', includes)
//                .replace('<script src="demo/boot.js" type="text/javascript"></script>', '<script src="demo/demo.js" type="text/javascript"></script>\n<script>require("demo").launch()</script>')
//        )
//    } ],
//    dest: "build/editor-demo.html"
//});
//copy({
//    source: [{
//        root: aceHome + '/demo',
//        include: "demo.js"
//    }],
//    filter: [ copy.filter.moduleDefines ],
//    dest: "build/demo/demo.js"
//});
//copy({
//    source: aceHome + '/demo/styles.css',
//    dest: "build/demo/styles.css"
//});
//copy({
//    source: aceHome + '/demo/logo.png',
//    dest: "build/demo/logo.png"
//});
