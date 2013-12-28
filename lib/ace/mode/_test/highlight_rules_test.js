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
        return !/(_highlight_rules|behaviour|worker)\.js$/.test(x) && /\.js$/.test(x);
    }).map(function(x) {
        return x.replace(/\.js$/, "");
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
            console.warn("Can't load mode :" + modeName, p, e);
            return;
        }
        var tokenizer = new Mode().getTokenizer();

        var state = "start";
        var data = text.split(/\n|\r|\r\n/).map(function(line) {
            var data = tokenizer.getLineTokens(line, state);
            var tmp = [];
            tmp.push(JSON.stringify(data.state));
            var tokenizedLine = "";
            data.tokens.forEach(function(x) {
                tokenizedLine += x.value;
                tmp.push(JSON.stringify([x.type, x.value]));
            });
            if (tokenizedLine != line)
                tmp.push(JSON.stringify(line));
            state = data.state;
            return tmp.join(",\n  ");
        });
        
        jsonStr = "[[\n   " + data.join("\n],[\n   ") + "\n]]";
        fs.writeFileSync(cwd + "tokens_" + modeName + ".json", jsonStr, "utf8");
    });
}

function test(startAt) {
    var modes = fs.readdirSync(cwd).map(function(x) {
        return (x.match(/tokens_(.*).json/) || {})[1];
    }).filter(function(x){return !!x});

    for (var i = Math.max(0, startAt||0); i < modes.length; i++)
        testMode(modes[i], i);

    console.log("\u001b[32m" + "all ok" + "\u001b[0m");
}
function testMode(modeName, i) {
    console.log(padNumber(i+1, 3) + ") testing: \u001b[33m" + modeName + "\u001b[0m");

    var text = fs.readFileSync(cwd + "tokens_" + modeName + ".json", "utf8");
    var data = JSON.parse(text);
    var Mode = require("../" + modeName).Mode;
    var tokenizer = new Mode().getTokenizer();

    var state = "start";
    data.forEach(function(lineData) {
        lineData.values = [];
        lineData.types = [];
        lineData.state = lineData.shift();
        var line = null;
        if (typeof lineData[lineData.length - 1] == "string")
            line = lineData.pop()
        lineData.forEach(function(x) {
            lineData.types.push(x[0]);
            lineData.values.push(x[1]);
        });
        if (typeof line != "string")
            line = lineData.values.join("");

        var tokens = tokenizer.getLineTokens(line, state);
        var values = tokens.tokens.map(function(x) {return x.value;});
        var types = tokens.tokens.map(function(x) {return x.type;});

        var success = true;
        var err = testEqual([
            JSON.stringify(lineData.state), JSON.stringify(tokens.state),
            lineData.types, types,
            lineData.values, values]);
        
        if (err) {
            console.log(line)
            throw "error";
        }

        state = tokens.state;
    });
}
function testEqual(a) {
    var err;
    if (a[0] + "" !== a[1] + "") {
        console.log(a[0],a[1]);
        err = 1;
    }

    if ( a[2] + "" !== a[3] + "" || a[4] + "" !== a[5] + "") {
        arrayDiff(a[2],a[3]);
        arrayDiff(a[4],a[5]);
        err = 1;
    }
    return err;
}
function arrayDiff(a1, a2) {
    var l = Math.max(a1.length, a2.length);
    var out = [];
    for (var i = 0; i < l; i++) {
        out.push("\n", padNumber(i+1, 3), ") ");
        if (a1[i] !== a2[i])
            out.push("\u001b[31m", a1[i], "\u001b[0m != \u001b[32m", a2[i], "\u001b[0m");
        else
            out.push(a1[i]);
    }
    console.log(out.join(""));
}
function padNumber(num, digits) {
    return ("      " + num).slice(-digits);
}

// cli
var arg = process.argv[2];
if (!arg)
    test()
else if (/--?g(en)?/.test(arg))
    generateTestData(process.argv.splice(3));
else if (/\d+/.test(arg))
    test(parseInt(process.argv[2],10) || 0);
else
    testMode(arg, -1)