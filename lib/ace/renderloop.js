"use strict";

var event = require("./lib/event");

/** 
 *
 *
 * Batches changes (that force something to be redrawn) in the background.
 * @class RenderLoop
 **/


var RenderLoop = function(onRender, win) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
    this.$recursionLimit = 2;
    this.window = win || window;
    var _self = this;
    this._flush = function(ts) {
        _self.pending = false;
        var changes = _self.changes;

        if (changes) {
            event.blockIdle(100);
            _self.changes = 0;
            _self.onRender(changes);
        }
        
        if (_self.changes) {
            if (_self.$recursionLimit-- < 0) return;
            _self.schedule();
        } else {
            _self.$recursionLimit = 2;
        }
    };
};

(function() {

    this.schedule = function(change) {
        this.changes = this.changes | change;
        if (this.changes && !this.pending) {
            event.nextFrame(this._flush);
            this.pending = true;
        }
    };

    this.clear = function(change) {
        var changes = this.changes;
        this.changes = 0;
        return changes;
    };

}).call(RenderLoop.prototype);

exports.RenderLoop = RenderLoop;
