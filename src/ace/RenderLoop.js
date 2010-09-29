/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/RenderLoop", function() {

var RenderLoop = function(onRender) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
};

(function() {

    this.schedule = function(change) {
        this.changes = this.changes | change;
        if (!this.pending) {
            this.pending = true;
            var _self = this;
            this.setTimeoutZero(function() {
                _self.pending = false;
                _self.onRender(_self.changes);
                _self.changes = 0;
            })
        }
    };
    
    if (window.postMessage) {
        
        this.messageName = "zero-timeout-message";
        
        this.setTimeoutZero = function(callback) {
            if (!this.attached) {
                var _self = this;
                window.addEventListener("message", function(e) {
                    if (e.source == window && _self.callback && e.data == _self.messageName) {
                        e.stopPropagation();
                        _self.callback();
                    }
                }, false);
                this.attached = true;
            }
            this.callback = callback;
            window.postMessage(this.messageName, "*");
        }
        
    } else {
        
        this.setTimeoutZero = function(callback) {
            setTimeout(callback, 0);
        }
    }
    
}).call(RenderLoop.prototype);

return RenderLoop;
});    