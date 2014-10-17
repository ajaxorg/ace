var fs = require('fs');
var lib = require('./lib');
var path = require('path');

function main(displayName, extRe) {
    var name = lib.snakeCase(displayName).replace(/[^\w]/g, "");

    /** demo **/
    var demoFileExt = extRe.split("|")[0] || name;
    var demoFileName = demoFileExt[0] == "^" ? demoFileExt.substr(1) : name + "." + demoFileExt;
    var demoFilePath = lib.AceRoot + "demo/kitchen-sink/docs/" + demoFileName;
    fs.writeFileSync(demoFilePath, "TODO add a nice demo!", "utf8");
    console.log("Created demo file at: " + path.normalize(demoFilePath));

    /** mode **/
    var template = fs.readFileSync(__dirname + "/templates/mode.js", "utf8");
    var modePath = lib.AceLib + "ace/mode/" + name + ".js";
    var text = lib.fillTemplate(template, {
        languageHighlightFilename: name,
        languagename: name,
        lineCommentStart: "TODO",
        blockCommentStart: "TODO",
        blockCommentEnd: "TODO"
    });
    fs.writeFileSync(modePath, text);
    console.log("Created mode file at: " + path.normalize(modePath));

    /** highlight rules **/
    template = fs.readFileSync(__dirname + "/templates/highlight_rules.js", "utf8");
    var hlPath = lib.AceLib + "ace/mode/" + name + "_highlight_rules.js";
    template = template.replace(/\/\* THIS[\s\S]*?\*{3}\/\s*/, "");
    text = lib.fillTemplate(template, {
        language: name,
        languageTokens: '{\n\
            start: [{\n\
                token: "string.start",\n\
                regex: \'"\',\n\
                next: "qstring"\n\
            }],\n\
            qstring: [{\n\
                token: "escape",\n\
                regex: /\\\\./,\n\
            }, {\n\
                token: "string.end",\n\
                regex: \'"\',\n\
                next: "start"\n\
            }],\n\
        }'
    });
    fs.writeFileSync(hlPath, text);
    console.log("Created mode file at: " + path.normalize(hlPath));

    /** snippets **/
    template = fs.readFileSync(__dirname + "/templates/snippets.js", "utf8");
    var snipetsPath = lib.AceLib + "ace/snippets/" + name + ".js";
    text = lib.fillTemplate(template, {
        languagename: name,
        snippets: ""
    });
    fs.writeFileSync(snipetsPath, text);
    console.log("Created snippets file at: " + path.normalize(snipetsPath));

    /** modelist **/
    var modelistPath = lib.AceLib + "ace/ext/modelist.js";
    var modelist = fs.readFileSync(modelistPath, "utf8").replace(/\r\n?/g, "\n");
    modelist = modelist.replace(/(supportedModes = {\n)([\s\S]*?)(\n^};)/m, function(_, m1, m2, m3) {
        var langs = m2.split(/,\n/);
        var offset = langs[0].trim().indexOf("[");
        var padding = Array(Math.max(offset - displayName.length - 1, 0) + 1).join(" ");
        var newLang = "    " + displayName + ":" + padding + "[\"" + extRe + "\"]";
        langs = langs.concat(newLang).map(function(x) {
            return {
                value: x,
                id: x.match(/[^"':\s]+/)[0].toLowerCase()
            };
        });
        langs[langs.length - 1].isNew = true;
        
        langs = langs.filter(function(x) {
            console.log(x.id, displayName)
            return x.id != displayName.toLowerCase() || x.isNew;
        });
        langs = langs.sort(function(a, b) {
            return a.id.localeCompare(b.id);
        }).map(function(x) {
            return x.value;
        });
        
        return m1 + langs.join(",\n") + m3;
    });
    fs.writeFileSync(modelistPath, modelist, "utf8");
    console.log("Updated modelist at: " + path.normalize(modelistPath));
}

if (!module.parent) {
    var args = process.argv.slice(2);
    var displayName = args[0];
    var extRe = args[1];
    if (!displayName || ! extRe) {
        console.log("Usage: ModeName ext1|ext2");
        process.exit(1);
    }    
} else {
    module.exports = main;
}

