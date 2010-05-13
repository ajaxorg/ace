(function() {

    var self = this;

    this.isIE = ! + "\v1";

    this.addListener = function(elem, type, callback) {
        if (elem.addEventListener) {
            return elem.addEventListener(type, callback, false);
        }
        if (elem.attachEvent) {
            var wrapper = function() {
                callback(window.event);
            };
            callback.$$wrapper = wrapper;
            elem.attachEvent("on" + type, wrapper);
        }
    };

    this.removeListener = function(elem, type, callback) {
        if (elem.removeEventListener) {
            return elem.removeEventListener(type, callback, false);
        }
        if (elem.detachEvent) {
            elem.detachEvent("on" + type, callback.$$wrapper || callback);
        }
    };

    this.stopEvent = function(e) {
        self.stopPropagation(e);
        self.preventDefault(e);
        return false;
    };

    this.stopPropagation = function(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    };

    this.preventDefault = function(e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
    };

    this.getDocumentX = function(event) {
        if (event.clientX) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            return event.clientX + scrollLeft;
        } else {
            return event.pageX;
        }
    };

    this.getDocumentY = function(event) {
        if (event.clientY) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            return event.clientY + scrollTop;
        } else {
            return event.pageX;
        }
    };

    if (document.documentElement.setCapture) {
        this.capture = function(el, eventHandler, releaseCaptureHandler) {
            function onMouseMove(e) {
                eventHandler(e);
                return self.stopPropagation(e);
            }

            function onReleaseCapture(e) {
                eventHandler && eventHandler(e);
                releaseCaptureHandler && releaseCaptureHandler();

                self.removeListener(el, "mousemove", eventHandler);
                self.removeListener(el, "mouseup", onReleaseCapture);
                self.removeListener(el, "losecapture", onReleaseCapture);

                el.releaseCapture();
            }

            self.addListener(el, "mousemove", eventHandler);
            self.addListener(el, "mouseup", onReleaseCapture);
            self.addListener(el, "losecapture", onReleaseCapture);
            el.setCapture();
        };
    }
    else {
        this.capture = function(el, eventHandler, releaseCaptureHandler) {
            function onMouseMove(e) {
                eventHandler(e);
                e.stopPropagation();
            }

            function onMouseUp(e) {
                eventHandler && eventHandler(e);
                releaseCaptureHandler && releaseCaptureHandler();

                document.removeEventListener("mousemove", onMouseMove, true);
                document.removeEventListener("mouseup", onMouseUp, true);

                e.stopPropagation();
            }

            document.addEventListener("mousemove", onMouseMove, true);
            document.addEventListener("mouseup", onMouseUp, true);
        };
    }

    this.addMouseWheelListener = function(el, callback) {
        var listener = function(e) {
            e.wheel = (e.wheelDelta) ? e.wheelDelta / 120
                    : -(e.detail || 0) / 3;
            callback(e);
        };
        self.addListener(el, "DOMMouseScroll", listener);
        self.addListener(el, "mousewheel", listener);
    };

    this.addTripleClickListener = function(el, callback) {
        var clicks = 0;
        var listener = function(e) {
           clicks += 1;
           if (clicks == 1) {
               setTimeout(function() {
                   clicks = 0;
               }, 600);
           }

           if (clicks == 3) {
               clicks = 0;
               callback(e);
           }
           return self.preventDefault(e);
        };

        self.addListener(el, "mousedown", listener);
        this.isIE && self.addListener(el, "dblclick", listener);
    };

    this.addKeyListener = function(el, callback) {
      var lastDown = null;

      self.addListener(el, "keydown", function(e) {
          lastDown = e.keyIdentifier || e.keyCode;
          return callback(e);
      });

      if (ace.isMac) {
          self.addListener(el, "keypress", function(e) {
              var keyId = e.keyIdentifier || e.keyCode;
              if (lastDown !== keyId) {
                  return callback(e);
              } else {
                  lastDown = null;
              }
          });
      }
    };
}).call(ace);