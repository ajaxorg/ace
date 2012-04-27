var panino = require("panino");

var srcPath = process.cwd() + "/../lib/ace";

panino.main(["--path=" + srcPath, "-o", "./out/", "-a", "./additionalObjs.json", "-i", "index.md", "-t", "Ace API", "--skin", "./resources/ace/"], function(err) {
    if (err) {
        console.error(err);
        process.exit(-1);
   }
});