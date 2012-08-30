var fs = require("fs");
var path = require("path");
if (!fs.existsSync)
    fs.existsSync = path.existsSync;

require("amd-loader");

function generateTestData() {
    var root = Array(5).join("../") + "/demo/kitchen-sink/docs"
    var docs = fs.readdirSync(root)
	var specialDocs = fs.readdirSync(".")
    var modes = fs.readdirSync("../").filter(function(x){
        return /(\w+)_highlight_rules.js$/.test(x)
    }).map(function(x) {
        return x.replace(/_highlight_rules.js$/, "")
    });

    console.log(docs)
    console.log(modes)

    docs.forEach(function(docName){
        var p = docName.toLowerCase().split("."), modeName
        if (modes.indexOf(p[0]) != -1) {
            modeName = p[0]
        } else if (modes.indexOf(p[1]) != -1) {
            modeName = p[1]
        } else {
            modeName = {"txt": "text", cpp: "c_cpp"}[p[1]]
        }

        if (!modeName) {
            return console.error(p)
        }
		
		var filePath = "text_" + modeName + ".txt"
		if (specialDocs.indexOf(filePath) == -1) {
			filePath = root + "/" + docName
		}
		
        var text = fs.readFileSync(filePath, "utf8")
        var Mode = require("../" + modeName).Mode;
        var tokenizer = new Mode().getTokenizer();

        var state = "start"
        var data = text.split(/\n|\r|\r\n]/).map(function(line) {
            var tokens = tokenizer.getLineTokens(line, state)
            state = tokens.state
            tokens = tokens.tokens
            return {
                state: state,
                values: tokens.map(function(x) {return x.value}),
                types: tokens.map(function(x) {return x.type})
            }
        })

        fs.writeFileSync("tokens_" + modeName + ".json", JSON.stringify(data, null, 1), "utf8")
    })
}

function test() {
    var docs = fs.readdirSync(".").filter(function(x){
        return /^tokens_\w+.json/.test(x)
    });
    docs.forEach(function(x, i){
        var modeName = x.match(/tokens_(.*).json/)[1]

        console.log(("  " + (i+1)).slice(-3) + ") testing: \u001b[33m" + modeName + "\u001b[0m")

        var text = fs.readFileSync("./" + x, "utf8")
        var data = JSON.parse(text)
        var Mode = require("../" + modeName).Mode;
        var tokenizer = new Mode().getTokenizer();

        var state = "start"
        data.forEach(function(lineData) {
            var line = lineData.values.join("")

            var tokens = tokenizer.getLineTokens(line, state)
            var values = tokens.tokens.map(function(x) {return x.value})
            var types = tokens.tokens.map(function(x) {return x.type})

            testEqual(lineData.state, tokens.state)
            testEqual(lineData.types, types)
            testEqual(lineData.values, values)

            state = lineData.state
        })
    })

    console.log("\u001b[32m" + "all ok" + "\u001b[0m")

    function testEqual(a, b) {
        if (a + "" !== b + "")
            throw a + "!=" + b
    }
}

if (process.argv[2] == "gen") {
    generateTestData(process.argv.splice(3))
} else {
    test()
}
