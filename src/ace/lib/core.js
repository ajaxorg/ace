if (!window.ace)
    ace = {};

(function() {

    var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();

    this.isWin = (os == "win");
    this.isMac = (os == "mac");
    this.isLinux = (os == "linux");

    this.provide = function(namespace) {
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

}).call(ace);