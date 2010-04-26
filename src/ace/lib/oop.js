require.def("ace/lib/oop", function() {

    var oop = {};
    
    oop.inherits = function(ctor, superCtor) {
        var tempCtor = function() {};
        tempCtor.prototype = superCtor.prototype;
        ctor.super_ = superCtor.prototype;
        ctor.prototype = new tempCtor();
        ctor.prototype.constructor = ctor;
    };

    oop.mixin = function(obj, mixin) {
        for (var key in mixin) {
            obj[key] = mixin[key];
        }
    };

    oop.implement = function(proto, mixin) {
        oop.mixin(proto, mixin);
    };

    return oop;
});