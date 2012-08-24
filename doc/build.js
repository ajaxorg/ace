var path = require("path");

var panino = require("panino");

var srcPath = __dirname + "/../lib/ace";

var buildOptions = {
	parseOptions: "./parseOptions.json",
	additionalObjs: "./additionalObjs.json"
}

var options = {
  title       : "Ace API",
  linkFormat  : 'http://example.com/{file}#{line}',
  output      : "../api/",
  outputAssets : "../api/resources",
  skin        : "./resources/ace/templates/layout.jade",
  assets      : "./resources/ace/skeleton",
  additionalObjs : "./additionalObjs.json",
  exclude     : ["**/*_test.js", "**/mode/**", "**/test/**", "**/theme/**", "**/worker/**"],
  index       : "./index.md"
};

files = [srcPath];

panino.parse(files, options, function (err, ast) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  panino.render('html', ast, options, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});