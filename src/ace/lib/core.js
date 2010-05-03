if (!window.ace)
    ace = {};

(function() {

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