#!/bin/bash
set -euxo pipefail

cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

npm install

rm -rf ../ace-builds
node ./Makefile.dryice.js full --target ../ace-builds

cat > ../ace-builds/package.json <<'EOF'
{
    "name": "ace-builds",
    "main": "./src-noconflict/ace.js",
    "typings": "ace.d.ts",
    "version": "1.38.0",
    "description": "Ace (Ajax.org Cloud9 Editor)",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/ajaxorg/ace-builds.git"
    },
    "author": "",
    "license": "BSD-3-Clause",
    "bugs": {
        "url": "https://github.com/ajaxorg/ace-builds/issues"
    },
    "homepage": "https://github.com/ajaxorg/ace-builds"
}
EOF

cd ../ace-builds
npm pack

rm -f "$REPO_ROOT/ace-builds-latest.tgz"

PACKAGE_FILE=$(ls ace-builds-*.tgz | sort -V | tail -n 1)

mv "$PACKAGE_FILE" "$REPO_ROOT/ace-builds-latest.tgz"

cd "$REPO_ROOT/demo/test_ace_builds"

rm -rf node_modules
rm -f package-lock.json

npm install "$REPO_ROOT/ace-builds-latest.tgz"

npm i typescript@latest

rm -f index.js
npm run build
npm run test

cd "$REPO_ROOT"
rm -f ace-builds-latest.tgz