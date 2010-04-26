require.def("ace/lib/core", function() {

    var core = {};
    var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();

    core.isWin = (os == "win");
    core.isMac = (os == "mac");
    core.isLinux = (os == "linux");
    core.isIE = ! + "\v1";

    core.provide = function(namespace) {
        var parts = namespace.split(".");
        var obj = window;
        for (var i=0; i<parts.length; i++) {
            var part = parts[i];
            if (!obj[part]) {
                obj[part] = {};
            }
            obj = obj[part];
        }
    };

    return core;

});