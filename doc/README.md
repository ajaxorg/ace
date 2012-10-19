# Introduction

The API doc build takes a look a source Javascript files in the _lib_ directory, and turns it into HTML output in the _api_ directory. It uses [Panino](https://github.com/gjtorikian/panino-docs) to perform the conversion.

For any questions on the build system, please see that repo.

# Building

In the root directory, just run:

    make doc

In this directory, just run:

    npm install
    node build.js

