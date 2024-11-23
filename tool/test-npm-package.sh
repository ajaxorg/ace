#!/bin/bash
set -euxo pipefail

# Navigate to the ace repository root
cd "$(dirname "$0")/.."

# npm pack the ace repository
npm pack

rm -f ace-code-latest.tgz

# Get the name of the packed file
PACKAGE_FILE=$(ls ace-*.tgz | sort -V | tail -n 1)

mv "$PACKAGE_FILE" ace-code-latest.tgz


# Install the ace package from the npm pack result
# npm install "../../$PACKAGE_FILE"

cd demo/test_package

# Clean up previous installation
rm -rf node_modules/ace-code
rm -f package-lock.json

# Install TypeScript
npm install

# Run TypeScript type checking
npm run build
npm run test

# Clean up
cd ../..
rm ace-code-latest.tgz
