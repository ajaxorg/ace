define(function() {
  var d = {};
  d.stringReverse = function(a) {
    return a.split("").reverse().join("")
  };
  d.stringRepeat = function(a, b) {
    return(new Array(b + 1)).join(a)
  };
  d.arrayIndexOf = Array.prototype.indexOf ? function(a, b) {
    return a.indexOf(b)
  } : function(a, b) {
    for(var c = 0;c < a.length;c++) {
      if(a[c] == b) {
        return c
      }
    }return-1
  };
  d.isArray = function(a) {
    return Object.prototype.toString.call(a) == "[object Array]"
  };
  d.copyObject = function(a) {
    var b = {};
    for(var c in a) {
      b[c] = a[c]
    }return b
  };
  d.arrayToMap = function(a) {
    for(var b = {}, c = 0;c < a.length;c++) {
      b[a[c]] = 1
    }return b
  };
  d.escapeRegExp = function(a) {
    return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  d.bind = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  };
  d.deferredCall = function(a) {
    var b = null, c = function() {
      b = null;
      a()
    };
    return{schedule:function() {
      b || (b = setTimeout(c, 0))
    }, call:function() {
      d.cancel();
      a()
    }, cancel:function() {
      clearTimeout(b);
      b = null
    }}
  };
  return d
});