var panino = require("panino");

var srcPath = process.cwd() + "/../lib/ace";

panino.main(["--path=" + srcPath, "-o", "../api/", "-a", "./additionalObjs.json", "-i", "index.md", "-t", "Ace API", "--skin", "./resources/ace/", "-s"], function(err) {
    if (err) {
        console.error(err);
        process.exit(-1);
   }
});