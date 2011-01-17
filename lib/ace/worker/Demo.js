
define(function(require, exports, module) {
    
exports.Demo = function(sender) {
    this.sender = sender;
}

(function() {
    
    this.juhu = function() {
        console.log("JUHU")
    }
    
}).call(exports.Demot.prototype);

});