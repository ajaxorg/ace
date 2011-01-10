define(function(l, h) {
  var d = l("pilot/console"), m = l("pilot/stacktrace").Trace, n = 0, o = false, i = [], g = [];
  Promise = function() {
    this._status = 0;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];
    this._id = n++;
    i[this._id] = this
  };
  Promise.prototype.isPromise = true;
  Promise.prototype.isComplete = function() {
    return this._status != 0
  };
  Promise.prototype.isResolved = function() {
    return this._status == 1
  };
  Promise.prototype.isRejected = function() {
    return this._status == -1
  };
  Promise.prototype.then = function(a, b) {
    if(typeof a === "function") {
      if(this._status === 1) {
        a.call(null, this._value)
      }else {
        this._status === 0 && this._onSuccessHandlers.push(a)
      }
    }if(typeof b === "function") {
      if(this._status === -1) {
        b.call(null, this._value)
      }else {
        this._status === 0 && this._onErrorHandlers.push(b)
      }
    }return this
  };
  Promise.prototype.chainPromise = function(a) {
    var b = new Promise;
    b._chainedFrom = this;
    this.then(function(c) {
      try {
        b.resolve(a(c))
      }catch(e) {
        b.reject(e)
      }
    }, function(c) {
      b.reject(c)
    });
    return b
  };
  Promise.prototype.resolve = function(a) {
    return this._complete(this._onSuccessHandlers, 1, a, "resolve")
  };
  Promise.prototype.reject = function(a) {
    return this._complete(this._onErrorHandlers, -1, a, "reject")
  };
  Promise.prototype._complete = function(a, b, c, e) {
    if(this._status != 0) {
      d.group("Promise already closed");
      d.error("Attempted " + e + "() with ", c);
      d.error("Previous status = ", this._status, ", previous value = ", this._value);
      d.trace();
      if(this._completeTrace) {
        d.error("Trace of previous completion:");
        this._completeTrace.log(5)
      }d.groupEnd();
      return this
    }if(o) {
      this._completeTrace = new m(new Error)
    }this._status = b;
    this._value = c;
    a.forEach(function(j) {
      j.call(null, this._value)
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;
    delete i[this._id];
    for(g.push(this);g.length > 20;) {
      g.shift()
    }return this
  };
  Promise.group = function(a) {
    a instanceof Array || (a = Array.prototype.slice.call(arguments));
    if(a.length === 0) {
      return(new Promise).resolve([])
    }var b = new Promise, c = [], e = 0, j = function(k) {
      return function(f) {
        c[k] = f;
        e++;
        b._status !== -1 && e === a.length && b.resolve(c)
      }
    };
    a.forEach(function(k, f) {
      f = j(f);
      var p = b.reject.bind(b);
      k.then(f, p)
    });
    return b
  };
  h.Promise = Promise;
  h._outstanding = i;
  h._recent = g
});