var panino = require("panino");

var srcPath = process.cwd() + "/../lib/ace";

panino.main(["--path=" + srcPath, "-o", "./out/", "-r", "-t", "ACE API", "--skin", "./resources/ace/skins"], function(err) {
    if (err) {
        console.error(err);
        process.exit(-1);
   }
});