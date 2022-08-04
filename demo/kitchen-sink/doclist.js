"use strict";

var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;
var net = require("ace/lib/net");

var modelist = require("ace/ext/modelist");
/*********** demo documents ***************************/
var fileCache = {};

function initDoc(file, path, doc) {
    if (doc.prepare)
        file = doc.prepare(file);

    var session = new EditSession(file);
    session.setUndoManager(new UndoManager());
    doc.session = session;
    doc.path = path;
    session.name = doc.name;
    if (doc.wrapped) {
        session.setUseWrapMode(true);
        session.setWrapLimitRange(80, 80);
    }
    var mode = modelist.getModeForPath(path);
    session.modeName = mode.name;
    session.setMode(mode.mode);
    return session;
}


function makeHuge(txt) {
    for (var i = 0; i < 5; i++)
        txt += txt;
    return txt;
}

var docs = {
    "docs/javascript.js": {order: 1, name: "JavaScript"},

    "docs/latex.tex": {name: "LaTeX", wrapped: true},
    "docs/markdown.md": {name: "Markdown", wrapped: true},
    "docs/mushcode.mc": {name: "MUSHCode", wrapped: true},
    "docs/pgsql.pgsql": {name: "pgSQL", wrapped: true},
    "docs/plaintext.txt": {name: "Plain Text", prepare: makeHuge, wrapped: true},
    "docs/sql.sql": {name: "SQL", wrapped: true},

    "docs/textile.textile": {name: "Textile", wrapped: true},

    "docs/c9search.c9search_results": "C9 Search Results",
    "docs/mel.mel": "MEL",
    "docs/Nix.nix": "Nix"
};

var ownSource = {
    /* filled from require*/
};

var hugeDocs = require.toUrl ? {
    "build/src/ace.js": "",
    "build/src-min/ace.js": ""
} : {
    "src/ace.js": "",
    "src-min/ace.js": ""
};

modelist.modes.forEach(function(m) {
    var ext = m.extensions.split("|")[0];
    if (ext[0] === "^") {
        path = ext.substr(1);
    } else {
        var path = m.name + "." + ext;
    }
    path = "docs/" + path;
    if (!docs[path]) {
        docs[path] = {name: m.caption};
    } else if (typeof docs[path] == "object" && !docs[path].name) {
        docs[path].name = m.caption;
    }
});



if (window.require && window.require.s) try {
    for (var path in window.require.s.contexts._.defined) {
        if (path.indexOf("!") != -1)
            path = path.split("!").pop();
        else
            path = path + ".js";
        ownSource[path] = "";
    }
} catch(e) {}

function sort(list) {
    return list.sort(function(a, b) {
        var cmp = (b.order || 0) - (a.order || 0);
        return cmp || a.name && a.name.localeCompare(b.name);
    });
}

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

        fileCache[doc.name.toLowerCase()] = doc;
        list.push(doc);
    }

    return list;
}

function loadDoc(name, callback) {
    var doc = fileCache[name.toLowerCase()];
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

function saveDoc(name, callback) {
    var doc = name;
    if (typeof(name) === 'string') {
        doc = fileCache[name.toLowerCase()];
    }
    if (!doc || !doc.session)
        return callback("Unknown document: " + name);

    var path = doc.path;
    var parts = path.split("/");
    if (parts[0] == "docs")
        path = "demo/kitchen-sink/" + path;
    else if (parts[0] == "ace")
        path = "lib/" + path;

    upload(path, doc.session.getValue(), callback);
}

function upload(url, data, callback) {
    var absUrl = net.qualifyURL(url);
    if (/^file:/.test(absUrl))
        absUrl = "http://localhost:8888/" + url;
    url = absUrl;
    if (!/^https?:/.test(url))
        return callback(new Error("Unsupported url scheme"));
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(!/^2../.test(xhr.status));
        }
    };
    xhr.send(data);
}

module.exports = {
    fileCache: fileCache,
    docs: sort(prepareDocList(docs)),
    ownSource: prepareDocList(ownSource),
    hugeDocs: prepareDocList(hugeDocs),
    initDoc: initDoc,
    loadDoc: loadDoc,
    saveDoc: saveDoc
};
module.exports.all = {
    "Mode Examples": module.exports.docs,
    "Huge documents": module.exports.hugeDocs,
    "own source": module.exports.ownSource
};
