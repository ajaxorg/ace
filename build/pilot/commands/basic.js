define(function(l, m) {
  var i = l("pilot/typecheck"), e = l("pilot/canon"), j = {plainPrefix:'<h2>Welcome to Skywriter - Code in the Cloud</h2><ul><li><a href="http://labs.mozilla.com/projects/skywriter" target="_blank">Home Page</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter" target="_blank">Wiki</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/UserGuide" target="_blank">User Guide</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/Tips" target="_blank">Tips and Tricks</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/FAQ" target="_blank">FAQ</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/DeveloperGuide" target="_blank">Developers Guide</a></li></ul>', 
  plainSuffix:'For more information, see the <a href="https://wiki.mozilla.org/Labs/Skywriter">Skywriter Wiki</a>.'}, n = {name:"help", params:[{name:"search", type:"text", description:"Search string to narrow the output.", defaultValue:null}], description:"Get help on the available commands.", exec:function(b, c, g) {
    b = [];
    var a = e.getCommand(c.search);
    if(a && a.exec) {
      b.push(a.description ? a.description : "No description for " + c.search)
    }else {
      var k = false;
      !c.search && j.plainPrefix && b.push(j.plainPrefix);
      if(a) {
        b.push("<h2>Sub-Commands of " + a.name + "</h2>");
        b.push("<p>" + a.description + "</p>")
      }else {
        if(c.search) {
          if(c.search == "hidden") {
            c.search = "";
            k = true
          }b.push("<h2>Commands starting with '" + c.search + "':</h2>")
        }else {
          b.push("<h2>Available Commands:</h2>")
        }
      }var f = e.getCommandNames();
      f.sort();
      b.push("<table>");
      for(var d = 0;d < f.length;d++) {
        a = e.getCommand(f[d]);
        if(!(!k && a.hidden)) {
          if(a.description !== undefined) {
            if(!(c.search && a.name.indexOf(c.search) !== 0)) {
              if(!(!c.search && a.name.indexOf(" ") != -1)) {
                if(!(a && a.name == c.search)) {
                  b.push("<tr>");
                  b.push('<th class="right">' + a.name + "</th>");
                  b.push("<td>" + a.description + "</td>");
                  b.push("</tr>")
                }
              }
            }
          }
        }
      }b.push("</table>");
      !c.search && j.plainSuffix && b.push(j.plainSuffix)
    }g.done(b.join(""))
  }}, p = {name:"eval", params:[{name:"javascript", type:"text", description:"The JavaScript to evaluate"}], description:"evals given js code and show the result", hidden:true, exec:function(b, c, g) {
    var a;
    b = c.javascript;
    try {
      a = eval(b)
    }catch(k) {
      a = "<b>Error: " + k.message + "</b>"
    }var f = c = "", d;
    if(i.isFunction(a)) {
      c = (a + "").replace(/\n/g, "<br>").replace(/ /g, "&#160");
      f = "function"
    }else {
      if(i.isObject(a)) {
        f = Array.isArray(a) ? "array" : "object";
        var h = [], o;
        for(d in a) {
          if(a.hasOwnProperty(d)) {
            o = i.isFunction(a[d]) ? "[function]" : i.isObject(a[d]) ? "[object]" : a[d];
            h.push({name:d, value:o})
          }
        }h.sort(function(s, t) {
          return s.name.toLowerCase() < t.name.toLowerCase() ? -1 : 1
        });
        for(d = 0;d < h.length;d++) {
          c += "<b>" + h[d].name + "</b>: " + h[d].value + "<br>"
        }
      }else {
        c = a;
        f = typeof a
      }
    }g.done("Result for eval <b>'" + b + "'</b> (type: " + f + "): <br><br>" + c)
  }}, r = {name:"skywriter", hidden:true, exec:function(b, c, g) {
    b = Math.floor(Math.random() * q.length);
    g.done("Skywriter " + q[b])
  }}, q = ["really wants you to trick it out in some way.", "is your Web editor.", "would love to be like Emacs on the Web.", "is written on the Web platform, so you can tweak it."];
  e = l("pilot/canon");
  m.startup = function() {
    e.addCommand(n);
    e.addCommand(p);
    e.addCommand(r)
  };
  m.shutdown = function() {
    e.removeCommand(n);
    e.removeCommand(p);
    e.removeCommand(r)
  }
});