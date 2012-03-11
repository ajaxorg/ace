Develop & Distribute ACE using the Sourcemint Loader
====================================================

The [Sourcemint JavaScript Loader](https://github.com/sourcemint/loader-js) is an optimized
module loader that boots sets of *statically linked* modules from *bundles*. An application may
load additional bundles by using *dynamic links*.

*Bundles* are generated from the AMD formatted source files on the fly during development (using a server helper)
and in-batch for production builds. To generate bundles the Sourcemint [RequireJS SDK](https://github.com/sourcemint/sdk-requirejs)
and [Platform NodeJS](https://github.com/sourcemint/platform-nodejs) projects are used.


Development
===========

**Requirements:**

  * [NodeJS](http://nodejs.org/)

**Install:**

    git clone git://github.com/ajaxorg/ace.git
    cd ace
    # TMP: Switch to sourcemint branch
    git checkout sourcemint
    cd sourcemint
    npm install

**Start development server:**

    node dev

**NOTE:** Modified source files are automatically reloaded on browser refresh so there is no
need to restart the server during development.


Production
==========

To generate production bundles, use the same setup as for *Development*, then run:

    // NOT YET IMPLEMENTED
    node build ../demo/kitchen-sink ./dist

Where `../demo/kitchen-sink` is the path to your ACE bootstrap package which embeds ACE in the page
or provides an interface for the rest of your application to interact with ACE.

Everything needed for ACE (and your bootstrap package) to run will be written to the `./dist` directory which can be 
used in a production application by serving these static files via a web server. To load the bootstrap file use:

    <!-- Load the Sourcemint JavaScript Loader -->
    <script type="text/javascript" src="./dist/loader.min.js"></script>
    <!-- Load ACE bootstrap file -->
    <script type="text/javascript">
        require.sandbox("./dist/kitchen-sink.js", function(sandbox) {
            sandbox.main();
        });
    </script>

See `../demo/kitchen-sink` for an example of how to write an ACE bootstrap package.

See [Embedding Ace](https://github.com/ajaxorg/ace) and [Embedding API](https://github.com/ajaxorg/ace/wiki/Embedding---API)
for more information on how to embed and interact with ACE.
