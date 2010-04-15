ace.provide("ace.MEventEmitter");

ace.MEventEmitter.$initEvents = function() {
    this._eventRegistry = {};
};

ace.MEventEmitter.$dispatchEvent = function(eventName, e) {
    var listeners = this._eventRegistry[eventName];
    if (!listeners) return;

    var e = e || {};
    e.type = eventName;

    for (var i=0; i<listeners.length; i++) {
        listeners[i](e);
    }
};

ace.MEventEmitter.addEventListener = function(eventName, callback) {
    var listeners = this._eventRegistry[eventName];
    if (!listeners) {
      var listeners = this._eventRegistry[eventName] = [];
    }
    if (ace.arrayIndexOf(listeners, callback) == -1) {
        listeners.push(callback);
    }
};