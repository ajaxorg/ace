ace.provide("ace.MEventEmitter");

ace.MEventEmitter = function() {

    this.$dispatchEvent = function(eventName, e) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners || !listeners.length) return;

        var e = e || {};
        e.type = eventName;

        for (var i=0; i<listeners.length; i++) {
            listeners[i](e);
        }
    };

    this.addEventListener = function(eventName, callback) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners) {
          var listeners = this.$eventRegistry[eventName] = [];
        }
        if (ace.arrayIndexOf(listeners, callback) == -1) {
            listeners.push(callback);
        }
    };

    this.removeEventListener = function(eventName, callback) {
        this.$eventRegistry = this.$eventRegistry || {};

        var listeners = this.$eventRegistry[eventName];
        if (!listeners) {
          return;
        }
        var index = ace.arrayIndexOf(listeners, callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
};
