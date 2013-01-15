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

 define(function(require, exports, module) {
"use strict";

var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;
var net = require("ace/lib/net");

var modelist = require("./modelist");
/*********** demo documents ***************************/
var fileCache = {};

function initDoc(file, path, doc) {
    if (doc.prepare)
        file = doc.prepare(file);

    var session = new EditSession(file);
    session.setUndoManager(new UndoManager());
    doc.session = session;
    doc.path = path;
    if (doc.wrapped) {
        session.setUseWrapMode(true);
        session.setWrapLimitRange(80, 80);
    }
    var mode = modelist.getModeFromPath(path);
    session.modeName = mode.name;
    session.setMode(mode.mode);
}


function makeHuge(txt) {
    for (var i = 0; i < 5; i++)
        txt += txt;
    return txt;
}

var docs = {
    "docs/AsciiDoc.asciidoc": "AsciiDoc",
    "docs/javascript.js": "JavaScript",
    "docs/clojure.clj": "Clojure",
    "docs/coffeescript.coffee": "Coffeescript",
    "docs/coldfusion.cfm": "ColdFusion",
    "docs/cpp.cpp": "C/C++",
    "docs/csharp.cs": "C#",
    "docs/css.css": "CSS",
    "docs/curly.curly": "Curly",
    "docs/dart.dart": "Dart",
    "docs/diff.diff": "Diff",
    "docs/dot.dot": "Dot",
    "docs/glsl.glsl": "Glsl",
    "docs/golang.go": "Go",
    "docs/groovy.groovy": "Groovy",
    "docs/haml.haml": "Haml",
    "docs/Haxe.hx": "haXe",
    "docs/html.html": "HTML",
    "docs/jade.jade": "Jade",
    "docs/java.java": "Java",
    "docs/jsp.jsp": "JSP",
    "docs/json.json": "JSON",
    "docs/jsx.jsx": "JSX",
    "docs/latex.tex": {name: "LaTeX", wrapped: true},
    "docs/less.less": "LESS",
    "docs/lisp.lisp": "Lisp",
    "docs/liquid.liquid": "Liquid",
    "docs/lua.lua": "Lua",
    "docs/lucene.lucene": "Lucene",
    "docs/luapage.lp": "LuaPage",
    "docs/Makefile": "Makefile",
    "docs/markdown.md": {name: "Markdown", wrapped: true},
    "docs/objectivec.m": {name: "Objective-C"},
    "docs/ocaml.ml": "OCaml",
    "docs/OpenSCAD.scad": "OpenSCAD",
    "docs/perl.pl": "Perl",
    "docs/pgsql.pgsql": {name: "pgSQL", wrapped: true},
    "docs/php.php": "PHP",
    "docs/plaintext.txt": {name: "Plain Text", prepare: makeHuge, wrapped: true},
    "docs/powershell.ps1": "Powershell",
    "docs/python.py": "Python",
    "docs/r.r": "R",
    "docs/rdoc.Rd": "RDoc",
    "docs/rhtml.rhtml": "RHTML",
    "docs/ruby.rb": "Ruby",
    "docs/abap.abap": "SAP - ABAP",
    "docs/scala.scala": "Scala",
    "docs/scss.scss": "SCSS",
    "docs/sh.sh": "SH",
    "docs/stylus.styl": "Stylus",
    "docs/sql.sql": {name: "SQL", wrapped: true},
    "docs/svg.svg": "SVG",
    "docs/tcl.tcl": "Tcl",
    "docs/tex.tex": "Tex",
    "docs/textile.textile": {name: "Textile", wrapped: true},
    "docs/typescript.ts": "Typescript",
    "docs/vbscript.vbs": "VBScript",
    "docs/xml.xml": "XML",
    "docs/xquery.xq": "XQuery",
    "docs/yaml.yaml": "YAML",
    "docs/c9search.c9search_results": "C9 Search Results"
};

var ownSource = {
    /* filled from require*/
};

var hugeDocs = {
    "build/src/ace.js": "",
    "build/src-min/ace.js": ""
};

if (window.require && window.require.s) try {
    for (var path in window.require.s.contexts._.defined) {
        if (path.indexOf("!") != -1)
            path = path.split("!").pop();
        else
            path = path + ".js";
        ownSource[path] = "";
    }
} catch(e) {}

function prepareDocList(docs) {
    var list = [];
    for (var path in docs) {
        var doc = docs[path];
        if (typeof doc != "object")
            doc = {name: doc || path};

        doc.path = path;
        doc.desc = doc.name.replace(/^(ace|docs|demo|build)\//, "");
        if (doc.desc.length > 18)
            doc.desc = doc.desc.slice(0, 7) + ".." + doc.desc.slice(-9);

        fileCache[doc.name] = doc;
        list.push(doc);
    }

    return list;
}

function loadDoc(name, callback) {
    var doc = fileCache[name];
    if (!doc)
        return callback(null);

    if (doc.session)
        return callback(doc.session);

    // TODO: show load screen while waiting
    var path = doc.path;
    var parts = path.split("/");
    if (parts[0] == "docs")
        path = "demo/kitchen-sink/" + path;
    else if (parts[0] == "ace")
        path = "lib/" + path;

    net.get(path, function(x) {
        initDoc(x, path, doc);
        callback(doc.session);
    });
}

module.exports = {
    fileCache: fileCache,
    docs: prepareDocList(docs),
    ownSource: prepareDocList(ownSource),
    hugeDocs: prepareDocList(hugeDocs),
    initDoc: initDoc,
    loadDoc: loadDoc
};
module.exports.all = {
    "Mode Examples": module.exports.docs,
    "Huge documents": module.exports.hugeDocs,
    "own source": module.exports.ownSource
};

});

