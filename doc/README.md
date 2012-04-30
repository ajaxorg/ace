# Introduction

The API doc build takes a look a source Javascript files in the _lib_ directory, and turns it into HTML output in the _api_ directory. It uses [Panino](https://github.com/gjtorikian/panino-docs) to perform the conversion.

For any questions, please see that repo.

# Building

In the root directory, just run:

    make doc

In this directory, just run:

    node build.js

# Build File

Here's a breakdown of what the arguments in _build.js_ are doing:

`--path=srcPath`: The location of the Ace source
`-o=../api/`:  The location of the output 
`-a=./additionalObjs.json`: A list of URLs to use for "missing objects" that the documentation requires
`-i=index.md`: The location of the Ace index/landing page
`-t=Ace API`: The title of the documentation
`--skin=./resources/ace/`: The location of all the templates and design
`-s`: Choose to split each class into its own file