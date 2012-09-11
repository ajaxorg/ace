var fs = require("fs");
if (!fs.existsSync)
    fs.existsSync = require("path").existsSync;

require("amd-loader");

var cwd = __dirname + "/";

function generateTestData() {
    var root = Array(5).join("../") + "/demo/kitchen-sink/docs";
    var docs = fs.readdirSync(cwd + root);
    var specialDocs = fs.readdirSync(cwd);
    var modes = fs.readdirSync(cwd + "../").filter(function(x){
        return /^\w+_highlight_rules.js$/.test(x);
    }).map(function(x) {
        return x.replace(/_highlight_rules.js$/, "");
    });

    console.log("Docs:", docs);
    console.log("Modes:", modes);

    docs.forEach(function(docName) {
        var p = docName.toLowerCase().split(".");
        if (!p[1])
            return;
        var modeName;
        if (modes.indexOf(p[0]) != -1)
            modeName = p[0];
        else if (modes.indexOf(p[1]) != -1)
            modeName = p[1];
        else
            modeName = {"txt": "text", cpp: "c_cpp"}[p[1]];

        var filePath = "text_" + modeName + ".txt";
        if (specialDocs.indexOf(filePath) == -1) {
            filePath = root + "/" + docName;
        }

        var text = fs.readFileSync(cwd + filePath, "utf8");
        try {
            var Mode = require("../" + modeName).Mode;
        } catch(e) {
            console.warn("Can't load mode :" + modeName, e);
            return;
        }
        var tokenizer = new Mode().getTokenizer();

        var state = "start";
        var data = text.split(/\n|\r|\r\n/).map(function(line) {
            var tokens = tokenizer.getLineTokens(line, state);
            state = tokens.state;
            tokens = tokens.tokens;
            return {
                state: state,
                data: tokens.map(function(x) {return [x.type, x.value]})
            };
        });
        var jsonStr = JSON.stringify(data, null, 1);
        jsonStr = jsonStr.replace(/\n {4}/g, " ").replace(/\n {3}]/g, " ]");
        fs.writeFileSync(cwd + "tokens_" + modeName + ".json", jsonStr, "utf8");
    });
}

function test(startAt) {
    var docs = fs.readdirSync(cwd).filter(function(x) {
        return /^tokens_\w+.json$/.test(x);
    });
    if (startAt && startAt > 1)
        docs = docs.slice(startAt - 1);
    docs.forEach(function(x, i) {
        var modeName = x.match(/tokens_(.*).json/)[1];

        console.log(padNumber(i+1, 3) + ") testing: \u001b[33m" + modeName + "\u001b[0m");

        var text = fs.readFileSync(cwd + x, "utf8");
        var data = JSON.parse(text);
        var Mode = require("../" + modeName).Mode;
        var tokenizer = new Mode().getTokenizer();

        var state = "start";
        data.forEach(function(lineData) {
            lineData.values = [];
            lineData.types = [];
            lineData.data.forEach(function(x) {
                lineData.types.push(x[0]);
                lineData.values.push(x[1]);
            });

            var line = lineData.values.join("");

            var tokens = tokenizer.getLineTokens(line, state);
            var values = tokens.tokens.map(function(x) {return x.value;});
            var types = tokens.tokens.map(function(x) {return x.type;});

            var success = true;
            testEqual([
                lineData.state, tokens.state,
                lineData.types, types,
                lineData.values, values]);

            state = lineData.state;
        });
    });

    console.log("\u001b[32m" + "all ok" + "\u001b[0m");

    function testEqual(a) {
        var err;
        if (a[0] !== a[1]) {
            console.log(a[0],a[1]);
            err = 1;
        }

        if ( a[2] + "" !== a[3] + "" || a[4] + "" !== a[5] + "") {
            arrayDiff(a[2],a[3]);
            arrayDiff(a[4],a[5]);
            err = 1;
        }
        if (err) {
            throw "error";
        }
    }

    function arrayDiff(a1, a2) {
        var l = Math.max(a1.length, a2.length);
        var out = [];
        for (var i = 0; i < l; i++) {
            out.push("\n", padNumber(i+1, 3), ") ");
            if (a1[i] !== a2[i])
                out.push("\u001b[31m", a1[i], " != ", a2[i], "\u001b[0m");
            else
                out.push(a1[i]);
        }
        console.log(out.join(""));
    }
    function padNumber(num, digits) {
        return ("      " + num).slice(-digits);
    }
}

if (process.argv[2] == "gen")
    generateTestData(process.argv.splice(3));
else
    test(parseInt(process.argv[2],10) || 0);
