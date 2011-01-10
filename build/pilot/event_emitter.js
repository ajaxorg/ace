define(function(d, e) {
  d = {};
  d._dispatchEvent = function(a, b) {
    this._eventRegistry = this._eventRegistry || {};
    var c = this._eventRegistry[a];
    if(c && c.length) {
      b = b || {};
      b.type = a;
      for(a = 0;a < c.length;a++) {
        c[a](b)
      }
    }
  };
  d.on = d.addEventListener = function(a, b) {
    this._eventRegistry = this._eventRegistry || {};
    var c = this._eventRegistry[a];
    c || (c = this._eventRegistry[a] = []);
    c.indexOf(b) == -1 && c.push(b)
  };
  d.removeEventListener = function(a, b) {
    this._eventRegistry = this._eventRegistry || {};
    if(a = this._eventRegistry[a]) {
      b = a.indexOf(b);
      b !== -1 && a.splice(b, 1)
    }
  };
  e.EventEmitter = d
});