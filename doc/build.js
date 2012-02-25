var argv = require("optimist").argv,
    ndoc = require(argv._[0] || "./build/ndoc/bin/ndoc");

console.log("GENERATING DOCUMENTATION");

var srcPath = process.cwd() + "/../lib/ace";

ndoc.main(["--path=" + srcPath, "-o", "./out/", "-t", "ACE API", "--skin", "./resources/ace/skins"], function(err) {
    if (err) {
        console.error(err);
        process.exit(-1);
   }
});