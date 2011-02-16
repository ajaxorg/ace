Ace (Ajax.org Cloud9 Editor)
============================

Ace is a standalone code editor written in JavaScript. Our goal is to create a web based code editor that matches and extends the features, usability and performance of existing native editors such as TextMate, Vim or Eclipse. It can be easily embedded in any web page and JavaScript application. Ace is developed as the primary editor for [Cloud9 IDE](http://www.cloud9ide.com/) and the successor of the Mozilla Skywriter (Bespin) Project.

Features
--------

* Syntax highlighting
* Auto indentation and outdent
* An optional command line
* Work with huge documents (100,000 lines and more are no problem)
* Fully customizable key bindings including VI and Emacs modes
* Themes (TextMate themes can be imported)
* Search and replace with regular expressions
* Highlight matching parentheses
* Toggle between soft tabs and real tabs
* Displays hidden characters

Take Ace for a spin!
--------------------

Check out the Ace live [demo](http://ajaxorg.github.com/ace/build/editor.html) or get a [Cloud9 IDE account](http://run.cloud9ide.com) to experience Ace while editing one of your own GitHub projects.

If you want, you can use Ace as a textarea replacement thanks to the [Ace Bookmarklet](http://ajaxorg.github.com/ace/build/textarea/editor.html).

History
-------

Previously known as “Bespin” or lately “Skywriter” it’s now known as Ace (Ajax.org Cloud9 Editor)! Bespin and Ace started as two independent projects both aiming to build a no compromise code editor component for the web. Bespin started as part of Mozilla Labs and was based on the canvas tag, while Ace is the Editor component of the Cloud9 IDE and is using the DOM for rendering. After the release of Ace at JSConf.eu 2010 in Berlin the Skywriter team decided to merge Ace with a simplified version of Skywriter's plugin system and some of Skywriter's extensibility points. All these changes have been merged back to Ace now, which supersedes Skywriter. Both Ajax.org and Mozilla are actively developing and maintaining Ace.

Getting the code
----------------

Ace is a community project. We actively encourage and support contributions. The Ace source code is hosted on GitHub. It is released under the Mozilla tri-license (MPL/GPL/LGPL). This is the same license used by Firefox. This license is friendly to all kinds of projects, whether open source or not. Take charge of your editor and add your favorite language highlighting and keybindings!

    git clone git://github.com/ajaxorg/ace.git
    git submodule update --init --recursive

Embedding Ace
-------------

Ace can be easily embedded into any existing web page. The Ace git repository ships with a pre-packaged version of Ace inside of the `build` directory. The same packaged files are also available as a separate [download](https://github.com/ajaxorg/ace/downloads). Simply copy the contents of the `src` subdirectory somewhere into your project and take a look at the included demos of how to use Ace.

The easiest version is simply:

    <div id="editor">some text</div>
    <script src="src/ace.js" type="text/javascript" charset="utf-8"></script>
    <script>
    window.onload = function() {
        var editor = ace.edit("editor");
    };
    </script>
    
To change the theme simply include the Theme's JavaScript file

    <script src="src/theme-twilight.js" type="text/javascript" charset="utf-8"></script>
    
and configure the editor to use the theme:

    editor.setTheme("ace/theme/twilight");
    
By default the editor only supports plain text mode. However all other language modes are available as separate modules. After including the mode's Javascript file

    <script src="src/mode-javascript.js" type="text/javascript" charset="utf-8"></script>
    
the mode can be used like this:

    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());

Running Ace
-----------

After the checkout Ace works out of the box. No build step is required. Simply open 'editor.html' in any browser except Google Chrome. Google Chrome doesn't allow XMLHTTPRequests from files loaded from disc (i.e. with a file:/// URL). To open the Ace in Chrome simply start the bundled mini HTTP server:

    ./static.py

The editor can then be opened at http://localhost:9999/editor.html.

Package Ace
-----------

To package Ace we use the dryice build tool developed by the Mozilla Skywriter team. To install dryice and all its dependencies simply call:

    npm link .

Afterwards Ace can by build by calling

    ./Makefile.dryice.js

The packaged Ace will be put in the 'build' folder.

Running the Unit Tests
----------------------

The Ace unit tests run on node.js. Before the first run a couple of node mudules have to be installed. The easiest way to do this is by using the node package manager (npm). In the Ace base directory simply call

    npm link .

To run the tests call:

    node lib/ace/test/all.js

