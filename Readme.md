Ace (Ajax.org Cloud9 Editor)
============================

Ace is a standalone code editor written in JavaScript. Our goal is to create a browser based editor that matches and extends the features, usability and performance of existing native editors such as TextMate, Vim or Eclipse. It can be easily embedded in any web page or JavaScript application. Ace is developed as the primary editor for [Cloud9 IDE](http://www.cloud9ide.com/) and the successor of the Mozilla Skywriter (Bespin) Project.

Features
--------

* Syntax highlighting
* Automatic indent and outdent
* An optional command line
* Handles huge documents (100,000 lines and more are no problem)
* Fully customizable key bindings including VIM and Emacs modes
* Themes (TextMate themes can be imported)
* Search and replace with regular expressions
* Highlight matching parentheses
* Toggle between soft tabs and real tabs
* Displays hidden characters
* Drag and drop text using the mouse
* Line wrapping
* Code folding
* Multiple selections
* Live syntax checker (currently JavaScript/CoffeeScript/Css/XQuery)

Take Ace for a spin!
--------------------

Check out the Ace live [demo](http://ajaxorg.github.com/ace-builds/kitchen-sink.html) or get a [Cloud9 IDE account](http://c9.io) to experience Ace while editing one of your own GitHub projects.

If you want, you can use Ace as a textarea replacement thanks to the [Ace Bookmarklet](http://ajaxorg.github.com/ace-builds/textarea/editor.html).

Getting the code
----------------

Ace is a community project. We actively encourage and support contributions. The Ace source code is hosted on GitHub. It is released under the Mozilla tri-license (MPL/GPL/LGPL), the same license used by Firefox. This license is friendly to all kinds of projects, whether open source or not. Take charge of your editor and add your favorite language highlighting and keybindings!

```bash
    git clone git://github.com/ajaxorg/ace.git
```

Embedding Ace
-------------

Ace can be easily embedded into any existing web page. You can either use one of pre-packaged versions of [ace](https://github.com/ajaxorg/ace-builds/) (just copy one of `src*` subdirectories somewhere into your project), or use requireJS to load contents of [lib/ace](https://github.com/ajaxorg/ace/tree/master/lib/ace) as `ace`


The easiest version is simply:

```html
    <div id="editor">some text</div>
    <script src="src/ace.js" type="text/javascript" charset="utf-8"></script>
    <script>
        var editor = ace.edit("editor");
    </script>
```

With "editor" being the id of the DOM element, which should be converted to an editor. Note that this element must be explicitly sized and positioned `absolute` or `relative` for Ace to work. e.g.

```css
    #editor {
        position: absolute;
        width: 500px;
        height: 400px;
    }
```

To change the theme simply include the Theme's JavaScript file

```html
    <script src="src/theme-twilight.js" type="text/javascript" charset="utf-8"></script>
```

and configure the editor to use the theme:

```javascript
    editor.setTheme("ace/theme/twilight");
```

By default the editor only supports plain text mode; many other languages are available as separate modules. After including the mode's JavaScript file:

```html
    <script src="src/mode-javascript.js" type="text/javascript" charset="utf-8"></script>
```

Then the mode can be used like this:

```javascript
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());
```

and take a look at the one of [included](https://github.com/ajaxorg/ace-builds/blob/master/editor.html) [demos](https://github.com/ajaxorg/ace/blob/master/demo/kitchen-sink/demo.js) of how to use Ace.

Documentation
-------------

You can find api documentation at [http://ajaxorg.github.com/ace/api/index.html](http://ajaxorg.github.com/ace/api/index.html).

And a lot more sample code in the [demo app](https://github.com/ajaxorg/ace/blob/master/demo/kitchen-sink/demo.js).

There is also some documentation on the [wiki page](https://github.com/ajaxorg/ace/wiki).

If you still need help, feel free to drop a mail on the [ace mailing list](http://groups.google.com/group/ace-discuss).

Running Ace
-----------

After the checkout Ace works out of the box. No build step is required. Open 'editor.html' in any browser except Google Chrome. Google Chrome doesn't allow XMLHTTPRequests from files loaded from disc (i.e. with a file:/// URL). To open Ace in Chrome simply start the bundled mini HTTP server:

```bash
    ./static.py
```

Or using Node.JS

```bash
    npm install mime
    ./static.js
```

The editor can then be opened at http://localhost:8888/index.html.

Package Ace
-----------

To package Ace we use the dryice build tool developed by the Mozilla Skywriter team. Make sure you at latest version of dryice

```bash
    npm install
    node ./Makefile.dryice.js ;; -m to minify, -nc to use namespaced requre, -target ./path/to/build/dir
```

Running the Unit Tests
----------------------

The Ace unit tests can run on node.js. Assuming you have already done `npm install`, just call:

```bash
    node lib/ace/test/all.js
```

You can also run the tests in your browser by serving:

    http://localhost:8888/lib/ace/test/tests.html

This makes debugging failing tests way more easier.

Continuous Integration status
-----------------------------

This project is tested with [Travis CI](http://travis-ci.org)
[![Build Status](https://secure.travis-ci.org/ajaxorg/ace.png)](http://travis-ci.org/ajaxorg/ace)

Contributing
------------

Ace wouldn't be what it is without contributions! Feel free to fork and improve/enhance Ace any way you want. If you feel that the editor or the Ace community will benefit from your changes, please open a pull request. To protect the interests of the Ace contributors and users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is the simplest of agreements, requiring that the contributions you make to an ajax.org project are only those you're allowed to make. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes ten minutes, and only needs to be completed once.  There are two versions of the agreement:

1. [The Individual CLA](https://github.com/ajaxorg/ace/raw/master/doc/Contributor_License_Agreement-v2.pdf): use this version if you're working on an ajax.org in your spare time, or can clearly claim ownership of copyright in what you'll be submitting.
2. [The Corporate CLA](https://github.com/ajaxorg/ace/raw/master/doc/Corporate_Contributor_License_Agreement-v2.pdf): have your corporate lawyer review and submit this if your company is going to be contributing to ajax.org  projects

If you want to contribute to an ajax.org project please print the CLA and fill it out and sign it. Then either send it by snail mail or fax to us or send it back scanned (or as a photo) by email.

Email: fabian.jakobs@web.de

Fax: +31 (0) 206388953

Address: Ajax.org B.V.
  Keizersgracht 241
  1016 EA, Amsterdam
  the Netherlands