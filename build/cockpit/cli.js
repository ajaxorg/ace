define(function(l, o) {
  function j(b, a, c, d, e) {
    this.status = b;
    this.message = a;
    if(typeof c === "number") {
      this.start = c;
      this.end = d;
      this.predictions = e
    }else {
      this.start = c.start;
      this.end = c.end;
      this.predictions = c.predictions
    }
  }
  function u(b, a) {
    this.status = b.status;
    this.message = b.message;
    if(a) {
      this.start = a.start;
      this.end = a.end
    }else {
      this.end = this.start = 0
    }this.predictions = b.predictions
  }
  function h(b, a, c, d, e) {
    this.emitter = b;
    this.setText(a);
    this.start = c;
    this.end = d;
    this.priorSpace = e
  }
  function q(b, a) {
    this.param = b;
    this.requisition = a;
    this.setValue(b.defaultValue)
  }
  function p(b) {
    this.env = b;
    this.commandAssignment = new q(s, this)
  }
  function i(b, a) {
    p.call(this, b);
    if(a && a.flags) {
      this.flags = a.flags
    }
  }
  l("pilot/console");
  var v = l("pilot/lang"), r = l("pilot/oop"), w = l("pilot/event_emitter").EventEmitter;
  l("pilot/types");
  var k = l("pilot/types").Status;
  l("pilot/types");
  var t = l("pilot/canon");
  o.startup = function() {
    t.upgradeType("command", s)
  };
  j.prototype = {};
  j.sort = function(b, a) {
    a !== undefined && b.forEach(function(c) {
      c.distance = c.start === h.AT_CURSOR ? 0 : a < c.start ? c.start - a : a > c.end ? a - c.end : 0
    }, this);
    b.sort(function(c, d) {
      if(a !== undefined) {
        var e = c.distance - d.distance;
        if(e != 0) {
          return e
        }
      }return d.status - c.status
    });
    a !== undefined && b.forEach(function(c) {
      delete c.distance
    }, this);
    return b
  };
  o.Hint = j;
  r.inherits(u, j);
  h.prototype = {merge:function(b) {
    if(b.emitter != this.emitter) {
      throw new Error("Can't merge Arguments from different EventEmitters");
    }return new h(this.emitter, this.text + b.priorSpace + b.text, this.start, b.end, this.priorSpace)
  }, setText:function(b) {
    if(b == null) {
      throw new Error("Illegal text for Argument: " + b);
    }var a = {argument:this, oldText:this.text, text:b};
    this.text = b;
    this.emitter._dispatchEvent("argumentChange", a)
  }, toString:function() {
    return this.priorSpace + this.text
  }};
  h.merge = function(b, a, c) {
    a = a === undefined ? 0 : a;
    c = c === undefined ? b.length : c;
    var d;
    for(a = a;a < c;a++) {
      var e = b[a];
      d = d ? d.merge(e) : e
    }return d
  };
  h.AT_CURSOR = -1;
  q.prototype = {param:undefined, conversion:undefined, value:undefined, arg:undefined, value:undefined, setValue:function(b) {
    if(this.value !== b) {
      if(b === undefined) {
        b = this.param.defaultValue;
        this.arg = undefined
      }this.value = b;
      b = b == null ? "" : this.param.type.stringify(b);
      this.arg && this.arg.setText(b);
      this.conversion = undefined;
      this.requisition._assignmentChanged(this)
    }
  }, arg:undefined, setArgument:function(b) {
    if(this.arg !== b) {
      this.arg = b;
      this.conversion = this.param.type.parse(b.text);
      this.conversion.arg = b;
      this.value = this.conversion.value;
      this.requisition._assignmentChanged(this)
    }
  }, getHint:function() {
    if(this.param.getCustomHint && this.value && this.arg) {
      var b = this.param.getCustomHint(this.value, this.arg);
      if(b) {
        return b
      }
    }b = "<strong>" + this.param.name + "</strong>: ";
    if(this.param.description) {
      b += this.param.description.trim();
      if(b.charAt(b.length - 1) !== ".") {
        b += "."
      }if(b.charAt(b.length - 1) !== " ") {
        b += " "
      }
    }var a = k.VALID, c = this.arg ? this.arg.start : h.AT_CURSOR, d = this.arg ? this.arg.end : h.AT_CURSOR, e;
    if(this.conversion) {
      a = this.conversion.status;
      if(this.conversion.message) {
        b += this.conversion.message
      }e = this.conversion.predictions
    }var f = this.arg && this.arg.text !== "";
    f = this.value !== undefined || f;
    if(this.param.defaultValue === undefined && !f) {
      a = k.INVALID;
      b += "<strong>Required<strong>"
    }return new j(a, b, c, d, e)
  }, complete:function() {
    this.conversion && this.conversion.predictions && this.conversion.predictions.length > 0 && this.setValue(this.conversion.predictions[0])
  }, decrement:function() {
    var b = this.param.type.decrement(this.value);
    b != null && this.setValue(b)
  }, increment:function() {
    var b = this.param.type.increment(this.value);
    b != null && this.setValue(b)
  }, toString:function() {
    return this.arg ? this.arg.toString() : ""
  }};
  o.Assignment = q;
  var s = {name:"command", type:"command", description:"The command to execute", getCustomHint:function(b, a) {
    var c = [];
    c.push("<strong><tt> &gt; ");
    c.push(b.name);
    b.params && b.params.length > 0 && b.params.forEach(function(d) {
      d.defaultValue === undefined ? c.push(" [" + d.name + "]") : c.push(" <em>[" + d.name + "]</em>")
    }, this);
    c.push("</tt></strong><br/>");
    c.push(b.description ? b.description : "(No description)");
    c.push("<br/>");
    if(b.params && b.params.length > 0) {
      c.push("<ul>");
      b.params.forEach(function(d) {
        c.push("<li>");
        c.push("<strong><tt>" + d.name + "</tt></strong>: ");
        c.push(d.description ? d.description : "(No description)");
        if(d.defaultValue === undefined) {
          c.push(" <em>[Required]</em>")
        }else {
          d.defaultValue === null ? c.push(" <em>[Optional]</em>") : c.push(" <em>[Default: " + d.defaultValue + "]</em>")
        }c.push("</li>")
      }, this);
      c.push("</ul>")
    }return new j(k.VALID, c.join(""), a)
  }};
  p.prototype = {commandAssignment:undefined, assignmentCount:undefined, _assignments:undefined, _hints:undefined, _assignmentChanged:function(b) {
    if(b.param.name === "command") {
      this._assignments = {};
      b.value && b.value.params.forEach(function(a) {
        this._assignments[a.name] = new q(a, this)
      }, this);
      this.assignmentCount = Object.keys(this._assignments).length;
      this._dispatchEvent("commandChange", {command:b.value})
    }
  }, getAssignment:function(b) {
    return this._assignments[typeof b === "string" ? b : Object.keys(this._assignments)[b]]
  }, getParameterNames:function() {
    return Object.keys(this._assignments)
  }, cloneAssignments:function() {
    return Object.keys(this._assignments).map(function(b) {
      return this._assignments[b]
    }, this)
  }, _updateHints:function() {
    this._hints.push(this.commandAssignment.getHint());
    Object.keys(this._assignments).map(function(b) {
      b = this._assignments[b];
      b.arg && this._hints.push(b.getHint())
    }, this);
    j.sort(this._hints)
  }, getWorstHint:function() {
    return this._hints[0]
  }, getArgs:function() {
    var b = {};
    Object.keys(this._assignments).forEach(function(a) {
      b[a] = this.getAssignment(a).value
    }, this);
    return b
  }, setDefaultValues:function() {
    Object.keys(this._assignments).forEach(function(b) {
      this._assignments[b].setValue(undefined)
    }, this)
  }, exec:function() {
    t.exec(this.commandAssignment.value, this.env, this.getArgs(), this.toCanonicalString())
  }, toCanonicalString:function() {
    var b = [];
    b.push(this.commandAssignment.value.name);
    Object.keys(this._assignments).forEach(function(a) {
      a = this._assignments[a];
      var c = a.param.type;
      if(a.value !== a.param.defaultValue) {
        b.push(" ");
        b.push(c.stringify(a.value))
      }
    }, this);
    return b.join("")
  }};
  r.implement(p.prototype, w);
  o.Requisition = p;
  r.inherits(i, p);
  (function() {
    i.prototype.update = function(a) {
      this.input = a;
      this._hints = [];
      a = this._tokenize(a.typed);
      this._split(a);
      this.commandAssignment.value && this._assign(a);
      this._updateHints()
    };
    i.prototype.getInputStatusMarkup = function() {
      var a = this.toString().split("").map(function() {
        return k.VALID
      });
      this._hints.forEach(function(c) {
        for(var d = c.start;d <= c.end;d++) {
          if(c.status > a[d]) {
            a[d] = c.status
          }
        }
      }, this);
      return a
    };
    i.prototype.toString = function() {
      var a = Object.keys(this._assignments).map(function(c) {
        return this._assignments[c].toString()
      }, this);
      a.unshift(this.commandAssignment.toString());
      return a.join("")
    };
    var b = i.prototype._updateHints;
    i.prototype._updateHints = function() {
      b.call(this);
      var a = this.input.cursor;
      this._hints.forEach(function(c) {
        var d = a.end >= c.start && a.end <= c.end;
        if(!(a.start >= c.start && a.start <= c.end || d) && c.status === k.INCOMPLETE) {
          c.status = k.INVALID
        }
      }, this);
      j.sort(this._hints)
    };
    i.prototype.getHints = function() {
      return this._hints
    };
    i.prototype.getAssignmentAt = function(a) {
      var c = this.commandAssignment.arg;
      if(c && a <= c.end) {
        return this.commandAssignment
      }c = Object.keys(this._assignments);
      for(var d = 0;d < c.length;d++) {
        var e = this._assignments[c[d]];
        if(e.arg && a <= e.arg.end) {
          return e
        }
      }throw new Error("position (" + a + ") is off end of requisition (" + this.toString() + ")");
    };
    i.prototype._tokenize = function(a) {
      function c(x) {
        return x.replace(/\uF000/g, " ").replace(/\uF001/g, "'").replace(/\uF002/g, '"')
      }
      if(a == null || a.length === 0) {
        return[new h(this, "", 0, 0, "")]
      }var d = 1;
      a = a.replace(/\\\\/g, "\\").replace(/\\b/g, "\u0008").replace(/\\f/g, "\u000c").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\v/g, "\u000b").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\ /g, "\uf000").replace(/\\'/g, "\uf001").replace(/\\"/g, "\uf002");
      for(var e = 0, f = 0, g = "", m = [];;) {
        if(e >= a.length) {
          if(d !== 1) {
            d = c(a.substring(f, e));
            m.push(new h(this, d, f, e, g))
          }else {
            if(e !== f) {
              g = a.substring(f, e);
              m.push(new h(this, "", e, e, g))
            }
          }break
        }var n = a[e];
        switch(d) {
          case 1:
            if(n === "'") {
              g = a.substring(f, e);
              d = 3;
              f = e + 1
            }else {
              if(n === '"') {
                g = a.substring(f, e);
                d = 4;
                f = e + 1
              }else {
                if(!/ /.test(n)) {
                  g = a.substring(f, e);
                  d = 2;
                  f = e
                }
              }
            }break;
          case 2:
            if(n === " ") {
              d = c(a.substring(f, e));
              m.push(new h(this, d, f, e, g));
              d = 1;
              f = e;
              g = ""
            }break;
          case 3:
            if(n === "'") {
              d = c(a.substring(f, e));
              m.push(new h(this, d, f, e, g));
              d = 1;
              f = e + 1;
              g = ""
            }break;
          case 4:
            if(n === '"') {
              d = c(a.substring(f, e));
              m.push(new h(this, d, f, e, g));
              d = 1;
              f = e + 1;
              g = ""
            }break
        }
        e++
      }return m
    };
    i.prototype._split = function(a) {
      for(var c = 1, d;c <= a.length;) {
        d = h.merge(a, 0, c);
        this.commandAssignment.setArgument(d);
        if(!this.commandAssignment.value) {
          break
        }if(this.commandAssignment.value.exec) {
          for(d = 0;d < c;d++) {
            a.shift()
          }break
        }c++
      }
    };
    i.prototype._assign = function(a) {
      if(a.length === 0) {
        this.setDefaultValues()
      }else {
        if(this.assignmentCount === 0) {
          this._hints.push(new j(k.INVALID, this.commandAssignment.value.name + " does not take any parameters", h.merge(a)))
        }else {
          if(this.assignmentCount === 1) {
            var c = this.getAssignment(0);
            if(c.param.type.name === "text") {
              c.setArgument(h.merge(a));
              return
            }
          }c = this.cloneAssignments();
          var d = this.getParameterNames();
          c.forEach(function(e) {
            for(var f = "--" + e.name, g = 0;;) {
              if(f !== a[g].text) {
                g++;
                if(g >= a.length) {
                  break
                }
              }else {
                if(e.param.type.name === "boolean") {
                  e.setValue(true)
                }else {
                  if(g + 1 < a.length) {
                    this._hints.push(new j(k.INCOMPLETE, "Missing value for: " + f, a[g]))
                  }else {
                    a.splice(g + 1, 1);
                    e.setArgument(a[g + 1])
                  }
                }v.arrayRemove(d, e.name);
                a.splice(g, 1)
              }
            }
          }, this);
          d.forEach(function(e) {
            e = this.getAssignment(e);
            if(a.length === 0) {
              e.setValue(undefined)
            }else {
              var f = a[0];
              a.splice(0, 1);
              e.setArgument(f)
            }
          }, this);
          if(a.length > 0) {
            c = h.merge(a);
            this._hints.push(new j(k.INVALID, "Input '" + c.text + "' makes no sense.", c))
          }
        }
      }
    }
  })();
  o.CliRequisition = i
});