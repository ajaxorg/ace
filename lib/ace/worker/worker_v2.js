/*global self*/
define(function (require, exports, module) {
  var EventEmitter = require("ace/lib/event_emitter").EventEmitter;
  var oop = require("ace/lib/oop");

  if (typeof window == "undefined") {
    if (typeof self != "undefined") window = self;
    if (typeof global != "undefined") window = global;
  }

  if (!window.console) {
    window.console = function () {
      var msgs = Array.prototype.slice.call(arguments, 0);
      postMessage({ type: "log", data: msgs });
    };
    window.console.error =
      window.console.warn =
      window.console.log =
      window.console.trace =
        window.console;
  }
  window.window = window;

  window.onerror = function (message, file, line, col, err) {
    postMessage({
      type: "error",
      data: {
        message: message,
        data: err && err.data,
        file: file,
        line: line,
        col: col,
        stack: err && err.stack
      }
    });
  };

  var Sender = function () {};
  (function () {
    oop.implement(this, EventEmitter);

    this.callback = function (data, callbackId) {
      postMessage({
        type: "call",
        id: callbackId,
        data: data
      });
    };

    this.emit = function (name, data) {
      postMessage({
        type: "event",
        name: name,
        data: data
      });
    };
  }.call(Sender.prototype));

  window.initSender = function initSender(clazz) {
    sender = window.sender = new Sender();
    main = window.main = new clazz(sender);
  };

  var main = (window.main = null);
  var sender = (window.sender = null);

  window.updateRequireConfig = function (config) {
    window.require.config(config);
  };

  window.onmessage = function (e) {
    var msg = e.data;
    if (msg.event && sender) {
      sender._signal(msg.event, msg.data);
    } else if (msg.command) {
      if (main && main[msg.command]) main[msg.command].apply(main, msg.args);
      else if (window[msg.command]) window[msg.command].apply(window, msg.args);
      else throw new Error("Unknown command:" + msg.command);
    } else {
      if (msg.requireConfig) {
        if (!window.require || typeof define != "function")
          importScripts(msg.requireConfig.requireSourceUrl);
        window.require.config(msg.requireConfig);
      }
    }
  };

  module.exports = window;
});
