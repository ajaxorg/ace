
var PATH = require("path"),
    FS = require("fs"),
    CONNECT = require("connect"),
    BUNDLER = require("sourcemint-platform-nodejs/lib/bundler");


exports.main = function(options) {

    // Rebuild bundles to get a clean start.

    console.log("Building fresh bundles from source ...");
    
    if (!PATH.existsSync(__dirname + "/dist")) {
        FS.mkdir(__dirname + "/dist", 0755);
    }

    BUNDLER.bundle(PATH.dirname(__dirname) + "/demo/kitchen-sink", __dirname + "/dist", {
        packageIdHashSeed: "__ACE__",
        forceCompleteBuild: true,
        writeManifest: true
    }).then(function() {

        console.log("... Done. Bundles will be updated as changes are detected in source files.");

        var server = CONNECT();

        server.use(CONNECT.router(function(app) {

            app.get(/^\/loader.js/, CONNECT.static(PATH.dirname(require.resolve("sourcemint-loader-js/loader.js"))));

            app.get(/^(\/demo\/kitchen-sink)(\.js)?(\/(.*))?$/, function (req, res) {

                req.url = req.params[2] || "";

                BUNDLER.Middleware(PATH.dirname(__dirname) + "/demo/kitchen-sink", __dirname + "/dist", {
                    packageIdHashSeed: "__ACE__",
                    // TODO: https://github.com/sourcemint/bundler-js/issues/3
                    rebuildChanges: false
                }).handle(req, res);
            });

            app.get(/^\//, function(req, res)
            {
                CONNECT.static(__dirname)(req, res, function()
                {
                    res.writeHead(404);
                    res.end("Not found!");
                });                
            });
        }));

        server.listen(options.port, "127.0.0.1");

        console.log("ACE development server running at http://127.0.0.1:" + options.port + "/");

    }, function(err) {
        console.error(err.stack);
    });
}

if (require.main === module) {
    // TODO: Make configurable via command-line flag.
    exports.main({
        port: 8888
    });
}
