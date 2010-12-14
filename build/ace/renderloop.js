define(function(d) {
  var e = d("./lib/event");
  d = function(b) {
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
          var c = a.changes;
          a.changes = 0;
          a.onRender(c)
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(b) {
        if(!this.attached) {
          var a = this;
          e.addListener(window, "message", function(c) {
            if(c.source == window && a.callback && c.data == a.messageName) {
              e.stopPropagation(c);
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
  }).call(d.prototype);
  return d
});