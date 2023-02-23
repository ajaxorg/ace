var fs = require("fs");

function buildResolver() {
    var moduleNames = getModuleNames();
    var loader = "import ace from \"./src/ace\";\n";
    loader = loader + moduleNames.map(function (moduleName) {
        return `ace.config.setModuleLoader('${moduleName}', () => import('./${moduleName.replace("ace", "src") + ".js"}'));`;
    }).join('\n') + "\n\nexport * as default from \"./src/ace\";";

    fs.writeFileSync(__dirname + '/../esm-resolver.js', loader, "utf8");
}

function jsFileList(path, filter) {
    path = "./" + path;
    if (!filter) filter = /_test/;

    return fs.readdirSync(path).map(function (x) {
        if (x.slice(-3) == ".js" && !filter.test(x) && !/\s|BASE|(\b|_)dummy(\b|_)|\.css\.js$/.test(x)) return x.slice(0, -3);
    }).filter(Boolean);
}

function getModuleNames() {
    let paths = [];
    var modeNames = modeList();
    // modes
    let modeNamePaths = modeNames.map(function (name) {
        return "ace/mode/" + name;
    });
    // snippets
    let snippetsPaths = jsFileList("src/snippets").map(function (name) {
        return "ace/snippets/" + name;
    });
    // themes
    let themesPaths = jsFileList("src/theme").map(function (name) {
        return "ace/theme/" + name;
    });
    // keybindings
    let keyBindingsPaths = ["vim", "emacs", "sublime", "vscode"].map(function (name) {
        return "ace/keyboard/" + name;
    });
    // extensions
    let extPaths = jsFileList("src/ext").map(function (name) {
        return "ace/ext/" + name;
    });
    // workers
    let workersPath = workers("src/mode").map(function (name) {
        return "src/mode/" + name + "_worker";
    });
    paths.push(...modeNamePaths, ...snippetsPaths, ...themesPaths, ...keyBindingsPaths, ...extPaths, ...workersPath);
    return paths;
}

function modeList() {
    return jsFileList("src/mode", /_highlight_rules|_test|_worker|xml_util|_outdent|behaviour|completions/);
}

function workers(path) {
    return jsFileList(path).map(function (x) {
        if (x.slice(-7) == "_worker") return x.slice(0, -7);
    }).filter(function (x) {
        return !!x;
    });
}

buildResolver();
