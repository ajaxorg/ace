
define(function(require, exports, module) {
    
var Demo = exports.Demo = function(sender) {
    this.sender = sender;
};

(function() {
    
    this.juhu = function() {
        console.log("JUHU")
    }
    
}).call(Demo.prototype);

});