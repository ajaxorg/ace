
var PATH = require("path"),
    FS = require("fs"),
    CONNECT = require("connect"),
    BUNDLER = require("sourcemint-platform-nodejs/lib/bundler");


exports.main = function(options) {

    var server = CONNECT();

    server.use(CONNECT.router(function(app) {

        app.get(/^\/loader.js/, CONNECT.static(PATH.dirname(require.resolve("sourcemint-loader-js/loader.js"))));

        app.get(/^(?:\/demo\/kitchen-sink)(?:\.js)?(\/.*)?$/, BUNDLER.hoist(PATH.dirname(__dirname) + "/demo/kitchen-sink", {
            distributionBasePath: __dirname + "/dist",
            packageIdHashSeed: "__ACE__",
            bundleLoader: false,
            logger: {
                log: function() {
                    console.log.apply(null, arguments);
                }
            }
        }));

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
}

if (require.main === module) {
    // TODO: Make configurable via command-line flag.
    exports.main({
        port: 8888
    });
}
