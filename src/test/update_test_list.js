#!/usr/bin/env node
var { execSync } = require("child_process");
var fs = require("fs");
 
// Run the git command to list files
var stdout = execSync("git ls-tree -r HEAD --name-only", { cwd: __dirname + "/../../" }).toString();

// Filter the list for files matching /src.*_test.js/
var testFiles = stdout
    .split("\n")
    .filter(file => /src.*_test\.js$/.test(file))
    .map(file => file.replace(/^src\//, "ace/").replace(/.js$/, ""));

if (testFiles.length === 0) {
    console.log("No matching test files found.");
    process.exit(1);
}

var testListFilePath = __dirname + "/test_list.js";
var data = `module.exports = [\n    "${testFiles.join('",\n    "')}"\n];`;

// Write the updated content back to the file
fs.writeFileSync(testListFilePath, data, "utf8");
console.log(`Updated testNames array in ${testListFilePath} successfully.`);
