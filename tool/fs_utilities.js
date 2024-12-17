const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath) {
    let files = [];
    const entries = fs.readdirSync(dirPath);

    entries.sort().forEach(entry => {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(fullPath));
        }
        else if (stat.isFile()) {
            files.push(fullPath);
        }
    });

    return files;
}

function cleanDeclarationFiles() {
    const baseDir = path.resolve(__dirname, '../src');
    const files = getAllFiles(baseDir);

    files.forEach(file => {
        if (file.endsWith('.d.ts')) {
            fs.unlinkSync(file);
        }
    });
}

exports.getAllFiles = getAllFiles;
exports.cleanDeclarationFiles = cleanDeclarationFiles;