define(function(d, b) {
  function p(a) {
    if(!a.name) {
      throw new Error("All registered commands must have a name");
    }if(a.params == null) {
      a.params = []
    }if(!Array.isArray(a.params)) {
      throw new Error("command.params must be an array in " + a.name);
    }a.params.forEach(function(c) {
      if(!c.name) {
        throw new Error("In " + a.name + ": all params must have a name");
      }k(a.name, c)
    }, this);
    g[a.name] = a;
    h.push(a.name);
    h.sort()
  }
  function k(a, c) {
    var f = c.type;
    c.type = q.getType(f);
    if(c.type == null) {
      throw new Error("In " + a + "/" + c.name + ": can't find type for: " + JSON.stringify(f));
    }
  }
  function r(a) {
    a = typeof a === "string" ? a : a.name;
    delete g[a];
    s.arrayRemove(h, a)
  }
  function t(a) {
    return g[a]
  }
  function u() {
    return h
  }
  function v(a, c, f, j) {
    if(typeof a === "string") {
      a = g[a]
    }if(!a) {
      return false
    }j = new e({command:a, args:f, typed:j});
    a.exec(c, f || {}, j);
    return true
  }
  function e(a) {
    a = a || {};
    this.command = a.command;
    this.args = a.args;
    this.typed = a.typed;
    this._begunOutput = false;
    this.start = new Date;
    this.end = null;
    this.error = this.completed = false
  }
  d("pilot/console");
  d("pilot/stacktrace");
  var l = d("pilot/oop"), m = d("pilot/event_emitter").EventEmitter, n = d("pilot/catalog");
  d("pilot/types");
  var q = d("pilot/types"), s = d("pilot/lang"), o = {name:"command", description:"A command is a bit of functionality with optional typed arguments which can do something small like moving the cursor around the screen, or large like cloning a project from VCS.", indexOn:"name"};
  b.startup = function() {
    n.addExtensionSpec(o)
  };
  b.shutdown = function() {
    n.removeExtensionSpec(o)
  };
  var g = {}, h = [];
  b.removeCommand = r;
  b.addCommand = p;
  b.getCommand = t;
  b.getCommandNames = u;
  b.exec = v;
  b.upgradeType = k;
  l.implement(b, m);
  var i = [];
  l.implement(e.prototype, m);
  e.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];
    for(i.push(this);i.length > 100;) {
      i.shiftObject()
    }b._dispatchEvent("output", {requests:i, request:this})
  };
  e.prototype.doneWithError = function(a) {
    this.error = true;
    this.done(a)
  };
  e.prototype.async = function() {
    this._begunOutput || this._beginOutput()
  };
  e.prototype.output = function(a) {
    this._begunOutput || this._beginOutput();
    if(typeof a !== "string" && !(a instanceof Node)) {
      a = a.toString()
    }this.outputs.push(a);
    this._dispatchEvent("output", {});
    return this
  };
  e.prototype.done = function(a) {
    this.completed = true;
    this.end = new Date;
    this.duration = this.end.getTime() - this.start.getTime();
    a && this.output(a);
    this._dispatchEvent("output", {})
  };
  b.Request = e
});