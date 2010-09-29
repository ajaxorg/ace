/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/VirtualRenderer",
    ["ace/lib/oop",
     "ace/MEventEmitter"],
    function(oop, MEventEmitter) {

var RenderLoop = function(fps) {
    this.running = false;
    this.interval = 1000 / fps;
}

(function() {

    oop.implement(this, MEventEmitter);
    
    this.start = function() {
        var _self = this;
        this.stop();
            
        this.running = true;
        this.$timer = setTimeout(onTimeout, 0);
        
        function onTimeout() {
            var start = new Date();
            _self.$dispatchEvent("tick");
            var end = new Date();
            var timeout = Math.max(10, _self.interval - (end - start));
            this.$timer = setTimeout(onTimeout, timeout);
        }
    };
    
    this.stop = function() {
        this.running = false;
        if (this.$timer)
            clearTimeout(this.$timer);        
    }
    
}).call(RenderLoop.prototype);

return RenderLoop;
});    