define(function(i, f) {
  var j = i("pilot/promise").Promise;
  f.xhr = function(c, g, h, e) {
    var d = new j;
    if(!skywriter.proxy || !skywriter.proxy.xhr) {
      var a = new XMLHttpRequest;
      a.onreadystatechange = function() {
        if(a.readyState === 4) {
          var b = a.status;
          if(b !== 0 && b !== 200) {
            b = new Error(a.responseText + " (Status " + a.status + ")");
            b.xhr = a;
            d.reject(b)
          }else {
            d.resolve(a.responseText)
          }
        }
      }.bind(this);
      a.open("GET", g, h);
      e && e(a);
      a.send()
    }else {
      skywriter.proxy.xhr.call(this, c, g, h, e, d)
    }return d
  };
  f.Worker = function(c) {
    return!skywriter.proxy || !skywriter.proxy.worker ? new Worker(c) : new skywriter.proxy.worker(c)
  }
});