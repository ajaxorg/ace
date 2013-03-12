define(function(require, exports, module) {
"use strict";

/************** modes ***********************/
var modes = [];
function getModeFromPath(path) {
    var mode = modesByName.text;
    var fileName = path.split(/[\/\\]/).pop();
    for (var i = 0; i < modes.length; i++) {
        if (modes[i].supportsFile(fileName)) {
            mode = modes[i];
            break;
        }
    }
    return mode;
}

var Mode = function(name, desc, extensions) {
    this.name = name;
    this.desc = desc;
    this.mode = "ace/mode/" + name;
    if (/\^/.test(extensions)) {
        var re = extensions.replace(/\|(\^)?/g, function(a, b){
            return "$|" + (b ? "^" : "^.*\\.");
        }) + "$";
    } else {
        var re = "^.*\\.(" + extensions + ")$";
    }   

    this.extRe = new RegExp(re, "gi");
};

Mode.prototype.supportsFile = function(filename) {
    return filename.match(this.extRe);
};

var modesByName = {
    abap:       ["ABAP"         , "abap"],
    asciidoc:   ["AsciiDoc"     , "asciidoc"],
    c9search:   ["C9Search"     , "c9search_results"],
    coffee:     ["CoffeeScript" , "^Cakefile|coffee|cf|cson"],
    coldfusion: ["ColdFusion"   , "cfm"],
    csharp:     ["C#"           , "cs"],
    css:        ["CSS"          , "css"],
    curly:      ["Curly"        , "curly"],
    dart:       ["Dart"         , "dart"],
    diff:       ["Diff"         , "diff|patch"],
    dot:        ["Dot"          , "dot"],
    ftl:        ["FreeMarker"   , "ftl"],
    glsl:       ["Glsl"         , "glsl|frag|vert"],
    golang:     ["Go"           , "go"],
    groovy:     ["Groovy"       , "groovy"],
    haxe:       ["haXe"         , "hx"],
    haml:       ["HAML"         , "haml"],
    html:       ["HTML"         , "htm|html|xhtml"],
    c_cpp:      ["C/C++"        , "c|cc|cpp|cxx|h|hh|hpp"],
    clojure:    ["Clojure"      , "clj"],
    jade:       ["Jade"         , "jade"],
    java:       ["Java"         , "java"],
    jsp:        ["JSP"          , "jsp"],
    javascript: ["JavaScript"   , "js"],
    json:       ["JSON"         , "json"],
    jsx:        ["JSX"          , "jsx"],
    latex:      ["LaTeX"        , "latex|tex|ltx|bib"],
    less:       ["LESS"         , "less"],
    lisp:       ["Lisp"         , "lisp"],
    scheme:     ["Scheme"       , "scm|rkt"],
    liquid:     ["Liquid"       , "liquid"],
    livescript: ["LiveScript"   , "ls"],
    logiql:     ["LogiQL"       , "logic|lql"],
    lua:        ["Lua"          , "lua"],
    luapage:    ["LuaPage"      , "lp"], // http://keplerproject.github.com/cgilua/manual.html#templates
    lucene:     ["Lucene"       , "lucene"],
    lsl:        ["LSL"          , "lsl"],
    makefile:   ["Makefile"     , "^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],
    markdown:   ["Markdown"     , "md|markdown"],
    objectivec: ["Objective-C"  , "m"],
    ocaml:      ["OCaml"        , "ml|mli"],
    pascal:     ["Pascal"       , "pas|p"],
    perl:       ["Perl"         , "pl|pm"],
    pgsql:      ["pgSQL"        , "pgsql"],
    php:        ["PHP"          , "php|phtml"],
    powershell: ["Powershell"   , "ps1"],
    python:     ["Python"       , "py"],
    r:          ["R"            , "r"],
    rdoc:       ["RDoc"         , "Rd"],
    rhtml:      ["RHTML"        , "Rhtml"],
    ruby:       ["Ruby"         , "ru|gemspec|rake|rb"],
    scad:       ["OpenSCAD"     , "scad"],
    scala:      ["Scala"        , "scala"],
    scss:       ["SCSS"         , "scss"],
    sass:       ["SASS"         , "sass"],
    sh:         ["SH"           , "sh|bash|bat"],
    sql:        ["SQL"          , "sql"],
    stylus:     ["Stylus"       , "styl|stylus"],
    svg:        ["SVG"          , "svg"],
    tcl:        ["Tcl"          , "tcl"],
    tex:        ["Tex"          , "tex"],
    text:       ["Text"         , "txt"],
    textile:    ["Textile"      , "textile"],
    tm_snippet: ["tmSnippet"    , "tmSnippet"],
    toml:       ["toml"         , "toml"],
    typescript: ["Typescript"   , "typescript|ts|str"],
    vbscript:   ["VBScript"     , "vbs"],
    xml:        ["XML"          , "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
    xquery:     ["XQuery"       , "xq"],
    yaml:       ["YAML"         , "yaml"]
};

for (var name in modesByName) {
    var mode = modesByName[name];
    mode = new Mode(name, mode[0], mode[1]);
    modesByName[name] = mode;
    modes.push(mode);
}

module.exports = {
    getModeFromPath: getModeFromPath,
    modes: modes,
    modesByName: modesByName
};

});

