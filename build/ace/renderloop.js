define(function(c) {
  var e = c("./lib/event");
  c = function(b) {
    this.onRender = b;
    this.pending = false;
    this.changes = 0
  };
  (function() {
    this.schedule = function(b) {
      this.changes |= b;
      if(!this.pending) {
        this.pending = true;
        var a = this;
        this.setTimeoutZero(function() {
          a.pending = false;
          a.onRender(a.changes);
          a.changes = 0
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(b) {
        if(!this.attached) {
          var a = this;
          e.addListener(window, "message", function(d) {
            if(d.source == window && a.callback && d.data == a.messageName) {
              e.stopPropagation(d);
              a.callback()
            }
          });
          this.attached = true
        }this.callback = b;
        window.postMessage(this.messageName, "*")
      }
    }else {
      this.setTimeoutZero = function(b) {
        setTimeout(b, 0)
      }
    }
  }).call(c.prototype);
  return c
});