/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/RenderLoop",
    ["ace/lib/oop",
     "ace/MEventEmitter"],
    function(oop, MEventEmitter) {

var RenderLoop = function(fps) {
    this.interval = 1000 / fps;
};

(function() {

    oop.implement(this, MEventEmitter);
    
    if (window.mozRequestAnimationFrame) {
        
        this.start = function() {
            var _self = this;
            this.stop();
            
            this.$onTimeout = function() {
                _self.$dispatchEvent("tick");
                window.mozRequestAnimationFrame();
            }
            window.addEventListener("MozBeforePaint", this.$onTimeout, false);
            window.mozRequestAnimationFrame();
        };
    
        this.stop = function() {
            window.removeEventListener("MozBeforePaint", this.$onTimeout, false);
        }
        
    } else {   
        
        this.start = function() {
            var _self = this;
            this.stop();
            
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
            if (this.$timer)
                clearTimeout(this.$timer);        
        }
    }
    
}).call(RenderLoop.prototype);

return RenderLoop;
});    