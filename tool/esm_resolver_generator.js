var fs = require("fs");
const {modeList, jsFileList} = require("../Makefile.dryice");

function buildResolver() {
    var moduleNames = getModuleNames();
    var loader = "import ace from \"./src/ace\";\n";
    loader = loader + moduleNames.map(function (moduleName) {
        return `ace.config.setModuleLoader('${moduleName}', () => import('./${moduleName.replace("ace", "src") + ".js"}'));`;
    }).join('\n') + "\n\nexport * as default from \"./src/ace\";";

    var declaration = 'export * from "./ace"';

    fs.writeFileSync(__dirname + '/../esm-resolver.js', loader, "utf8");
    fs.writeFileSync(__dirname + '/../esm-resolver.d.ts', declaration, "utf8");
}

function getModuleNames() {
    let paths = [];
    var modeNames = modeList("src/mode");
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
    paths.push(...modeNamePaths, ...snippetsPaths, ...themesPaths, ...keyBindingsPaths, ...extPaths);
    return paths;
}

buildResolver();
