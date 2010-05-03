(function() {

    this.inherits = function(ctor, superCtor) {
        var tempCtor = function() {};
        tempCtor.prototype = superCtor.prototype;
        ctor.super_ = superCtor.prototype;
        ctor.prototype = new tempCtor();
        ctor.prototype.constructor = ctor;
    };

    this.mixin = function(obj, mixin) {
        for (var key in mixin) {
            obj[key] = mixin[key];
        }
    };

    this.implement = function(proto, mixin) {
        mixin.call(proto);
    };

}).call(ace);