/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    require
*/

/**
 * Add Editor Menu Options
 * @fileOverview Add Editor Menu Options <br />
 * The menu options property needs to be added to the editor
 *  so that the settings menu can know about options for 
 *  selection elements and track which option is selected.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */
 
define(function(require, exports, module) {
'use strict';

/**
 * The menu options property needs to be added to the editor
 *  so that the settings menu can know about options for 
 *  selection elements and track which option is selected.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {ace.Editor} editor An instance of the ace editor.
 */
module.exports.addEditorMenuOptions = function addEditorMenuOptions (editor) {
    editor.menuOptions = {
        "setNewLineMode" : [{
                "textContent" : "unix",
                "value" : "unix"
            }, {
                "textContent" : "windows",
                "value" : "windows"
            }, {
                "textContent" : "auto",
                "value" : "auto"
            }
        ],
        "setTheme" : [{
                "textContent" : "ambiance",
                "value" : "ace/theme/ambiance"
            }, {
                "textContent" : "chaos",
                "value" : "ace/theme/chaos"
            }, {
                "textContent" : "chrome",
                "value" : "ace/theme/chrome"
            }, {
                "textContent" : "clouds",
                "value" : "ace/theme/clouds"
            }, {
                "textContent" : "clouds_midnight",
                "value" : "ace/theme/clouds_midnight"
            }, {
                "textContent" : "cobalt",
                "value" : "ace/theme/cobalt"
            }, {
                "textContent" : "crimson_editor",
                "value" : "ace/theme/crimson_editor"
            }, {
                "textContent" : "dawn",
                "value" : "ace/theme/dawn"
            }, {
                "textContent" : "dreamweaver",
                "value" : "ace/theme/dreamweaver"
            }, {
                "textContent" : "eclipse",
                "value" : "ace/theme/eclipse"
            }, {
                "textContent" : "github",
                "value" : "ace/theme/github"
            }, {
                "textContent" : "idle_fingers",
                "value" : "ace/theme/idle_fingers"
            }, {
                "textContent" : "kr",
                "value" : "ace/theme/kr"
            }, {
                "textContent" : "merbivore",
                "value" : "ace/theme/merbivore"
            }, {
                "textContent" : "merbivore_soft",
                "value" : "ace/theme/merbivore_soft"
            }, {
                "textContent" : "monokai",
                "value" : "ace/theme/monokai"
            }, {
                "textContent" : "mono_industrial",
                "value" : "ace/theme/mono_industrial"
            }, {
                "textContent" : "pastel_on_dark",
                "value" : "ace/theme/pastel_on_dark"
            }, {
                "textContent" : "solarized_dark",
                "value" : "ace/theme/solarized_dark"
            }, {
                "textContent" : "solarized_light",
                "value" : "ace/theme/solarized_light"
            }, {
                "textContent" : "textmate",
                "value" : "ace/theme/textmate"
            }, {
                "textContent" : "tomorrow",
                "value" : "ace/theme/tomorrow"
            }, {
                "textContent" : "tomorrow_night",
                "value" : "ace/theme/tomorrow_night"
            }, {
                "textContent" : "tomorrow_night_blue",
                "value" : "ace/theme/tomorrow_night_blue"
            }, {
                "textContent" : "tomorrow_night_bright",
                "value" : "ace/theme/tomorrow_night_bright"
            }, {
                "textContent" : "tomorrow_night_eighties",
                "value" : "ace/theme/tomorrow_night_eighties"
            }, {
                "textContent" : "twilight",
                "value" : "ace/theme/twilight"
            }, {
                "textContent" : "vibrant_ink",
                "value" : "ace/theme/vibrant_ink"
            }, {
                "textContent" : "xcode",
                "value" : "ace/theme/xcode"
            }
        ],
        "setMode" : [{
                "textContent" : "abap",
                "value" : "ace/mode/abap"
            }, {
                "textContent" : "asciidoc",
                "value" : "ace/mode/asciidoc"
            }, {
                "textContent" : "c9search",
                "value" : "ace/mode/c9search"
            }, {
                "textContent" : "clojure",
                "value" : "ace/mode/clojure"
            }, {
                "textContent" : "coffee",
                "value" : "ace/mode/coffee"
            }, {
                "textContent" : "coldfusion",
                "value" : "ace/mode/coldfusion"
            }, {
                "textContent" : "csharp",
                "value" : "ace/mode/csharp"
            }, {
                "textContent" : "css",
                "value" : "ace/mode/css"
            }, {
                "textContent" : "curly",
                "value" : "ace/mode/curly"
            }, {
                "textContent" : "c_cpp",
                "value" : "ace/mode/c_cpp"
            }, {
                "textContent" : "dart",
                "value" : "ace/mode/dart"
            }, {
                "textContent" : "diff",
                "value" : "ace/mode/diff"
            }, {
                "textContent" : "django",
                "value" : "ace/mode/django"
            }, {
                "textContent" : "dot",
                "value" : "ace/mode/dot"
            }, {
                "textContent" : "ftl",
                "value" : "ace/mode/ftl"
            }, {
                "textContent" : "glsl",
                "value" : "ace/mode/glsl"
            }, {
                "textContent" : "golang",
                "value" : "ace/mode/golang"
            }, {
                "textContent" : "groovy",
                "value" : "ace/mode/groovy"
            }, {
                "textContent" : "haml",
                "value" : "ace/mode/haml"
            }, {
                "textContent" : "haxe",
                "value" : "ace/mode/haxe"
            }, {
                "textContent" : "html",
                "value" : "ace/mode/html"
            }, {
                "textContent" : "jade",
                "value" : "ace/mode/jade"
            }, {
                "textContent" : "java",
                "value" : "ace/mode/java"
            }, {
                "textContent" : "javascript",
                "value" : "ace/mode/javascript"
            }, {
                "textContent" : "json",
                "value" : "ace/mode/json"
            }, {
                "textContent" : "jsp",
                "value" : "ace/mode/jsp"
            }, {
                "textContent" : "jsx",
                "value" : "ace/mode/jsx"
            }, {
                "textContent" : "latex",
                "value" : "ace/mode/latex"
            }, {
                "textContent" : "less",
                "value" : "ace/mode/less"
            }, {
                "textContent" : "liquid",
                "value" : "ace/mode/liquid"
            }, {
                "textContent" : "lisp",
                "value" : "ace/mode/lisp"
            }, {
                "textContent" : "livescript",
                "value" : "ace/mode/livescript"
            }, {
                "textContent" : "logiql",
                "value" : "ace/mode/logiql"
            }, {
                "textContent" : "lsl",
                "value" : "ace/mode/lsl"
            }, {
                "textContent" : "lua",
                "value" : "ace/mode/lua"
            }, {
                "textContent" : "luapage",
                "value" : "ace/mode/luapage"
            }, {
                "textContent" : "lucene",
                "value" : "ace/mode/lucene"
            }, {
                "textContent" : "makefile",
                "value" : "ace/mode/makefile"
            }, {
                "textContent" : "markdown",
                "value" : "ace/mode/markdown"
            }, {
                "textContent" : "objectivec",
                "value" : "ace/mode/objectivec"
            }, {
                "textContent" : "ocaml",
                "value" : "ace/mode/ocaml"
            }, {
                "textContent" : "pascal",
                "value" : "ace/mode/pascal"
            }, {
                "textContent" : "perl",
                "value" : "ace/mode/perl"
            }, {
                "textContent" : "pgsql",
                "value" : "ace/mode/pgsql"
            }, {
                "textContent" : "php",
                "value" : "ace/mode/php"
            }, {
                "textContent" : "powershell",
                "value" : "ace/mode/powershell"
            }, {
                "textContent" : "python",
                "value" : "ace/mode/python"
            }, {
                "textContent" : "r",
                "value" : "ace/mode/r"
            }, {
                "textContent" : "rdoc",
                "value" : "ace/mode/rdoc"
            }, {
                "textContent" : "rhtml",
                "value" : "ace/mode/rhtml"
            }, {
                "textContent" : "ruby",
                "value" : "ace/mode/ruby"
            }, {
                "textContent" : "sass",
                "value" : "ace/mode/sass"
            }, {
                "textContent" : "scad",
                "value" : "ace/mode/scad"
            }, {
                "textContent" : "scala",
                "value" : "ace/mode/scala"
            }, {
                "textContent" : "scheme",
                "value" : "ace/mode/scheme"
            }, {
                "textContent" : "scss",
                "value" : "ace/mode/scss"
            }, {
                "textContent" : "sh",
                "value" : "ace/mode/sh"
            }, {
                "textContent" : "sql",
                "value" : "ace/mode/sql"
            }, {
                "textContent" : "stylus",
                "value" : "ace/mode/stylus"
            }, {
                "textContent" : "svg",
                "value" : "ace/mode/svg"
            }, {
                "textContent" : "tcl",
                "value" : "ace/mode/tcl"
            }, {
                "textContent" : "tex",
                "value" : "ace/mode/tex"
            }, {
                "textContent" : "text",
                "value" : "ace/mode/text"
            }, {
                "textContent" : "textile",
                "value" : "ace/mode/textile"
            }, {
                "textContent" : "tmsnippet",
                "value" : "ace/mode/tmsnippet"
            }, {
                "textContent" : "tm_snippet",
                "value" : "ace/mode/tm_snippet"
            }, {
                "textContent" : "toml",
                "value" : "ace/mode/toml"
            }, {
                "textContent" : "typescript",
                "value" : "ace/mode/typescript"
            }, {
                "textContent" : "vbscript",
                "value" : "ace/mode/vbscript"
            }, {
                "textContent" : "xml",
                "value" : "ace/mode/xml"
            }, {
                "textContent" : "xquery",
                "value" : "ace/mode/xquery"
            }, {
                "textContent" : "yaml",
                "value" : "ace/mode/yaml"
            }
        ]
    };
};


});