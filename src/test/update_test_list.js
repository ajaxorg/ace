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
    process.exit(0);
}

// Read the all_browser.js file
var allBrowserFilePath = __dirname + "/all_browser.js";
var data = fs.readFileSync(allBrowserFilePath, "utf8");

// Replace the testNames array with the new list
var updatedData = data.replace(
    /var testNames = \[[^\]]*?\];/,
    `var testNames = [\n    "${testFiles.join('",\n    "')}"\n];`
);

// Write the updated content back to the file
fs.writeFileSync(allBrowserFilePath, updatedData, "utf8");
console.log("Updated testNames array in all_browser.js successfully.");
