define(function(d, F) {
  F.launch = function(c) {
    function s() {
      c.editor.getDocument().setMode(l[k.value] || l.text)
    }
    function t() {
      var a = b[u.value];
      c.editor.setDocument(a);
      a = a.getMode();
      k.value = a instanceof m ? "javascript" : a instanceof n ? "css" : a instanceof o ? "html" : a instanceof v ? "xml" : a instanceof p ? "python" : a instanceof q ? "php" : "text";
      c.editor.focus()
    }
    function w() {
      c.editor.setTheme(x.value)
    }
    function y() {
      z.checked ? c.editor.setSelectionStyle("line") : c.editor.setSelectionStyle("text")
    }
    function A() {
      c.editor.setHighlightActiveLine(!!B.checked)
    }
    function C() {
      c.editor.setShowInvisibles(!!D.checked)
    }
    function E() {
      g.style.width = document.documentElement.clientWidth - 4 + "px";
      g.style.height = document.documentElement.clientHeight - 55 - 4 - 23 + "px";
      c.editor.resize()
    }
    var h = d("pilot/event"), G = d("ace/editor").Editor, H = d("ace/virtual_renderer").VirtualRenderer, I = d("ace/theme/textmate"), i = d("ace/document").Document, m = d("ace/mode/javascript").Mode, n = d("ace/mode/css").Mode, o = d("ace/mode/html").Mode, v = d("ace/mode/xml").Mode, p = d("ace/mode/python").Mode, q = d("ace/mode/php").Mode, J = d("ace/mode/text").Mode, j = d("ace/undomanager").UndoManager, b = {};
    b.js = new i(document.getElementById("jstext").innerHTML);
    b.js.setMode(new m);
    b.js.setUndoManager(new j);
    b.css = new i(document.getElementById("csstext").innerHTML);
    b.css.setMode(new n);
    b.css.setUndoManager(new j);
    b.html = new i(document.getElementById("htmltext").innerHTML);
    b.html.setMode(new o);
    b.html.setUndoManager(new j);
    b.python = new i(document.getElementById("pythontext").innerHTML);
    b.python.setMode(new p);
    b.python.setUndoManager(new j);
    b.php = new i(document.getElementById("phptext").innerHTML);
    b.php.setMode(new q);
    b.php.setUndoManager(new j);
    var g = document.getElementById("editor");
    c.editor = new G(new H(g, I));
    var l = {text:new J, xml:new v, html:new o, css:new n, javascript:new m, python:new p, php:new q}, k = document.getElementById("mode");
    k.onchange = s;
    s();
    var u = document.getElementById("doc");
    u.onchange = t;
    t();
    var x = document.getElementById("theme");
    x.onchange = w;
    w();
    var z = document.getElementById("select_style");
    z.onchange = y;
    y();
    var B = document.getElementById("highlight_active");
    B.onchange = A;
    A();
    var D = document.getElementById("show_hidden");
    D.onchange = C;
    C();
    window.jump = function() {
      var a = document.getElementById("jump"), e = c.editor.getCursorPosition();
      e = c.editor.renderer.textToScreenCoordinates(e.row, e.column);
      a.style.left = e.pageX + "px";
      a.style.top = e.pageY + "px";
      a.style.display = "block"
    };
    window.onresize = E;
    E();
    h.addListener(g, "dragover", function(a) {
      return h.preventDefault(a)
    });
    h.addListener(g, "drop", function(a) {
      try {
        var e = a.dataTransfer.files[0]
      }catch(K) {
        return h.stopEvent()
      }if(window.FileReader) {
        var r = new FileReader;
        r.onload = function() {
          c.editor.getSelection().selectAll();
          var f = "text";
          if(/^.*\.js$/i.test(e.name)) {
            f = "javascript"
          }else {
            if(/^.*\.xml$/i.test(e.name)) {
              f = "xml"
            }else {
              if(/^.*\.html$/i.test(e.name)) {
                f = "html"
              }else {
                if(/^.*\.css$/i.test(e.name)) {
                  f = "css"
                }else {
                  if(/^.*\.py$/i.test(e.name)) {
                    f = "python"
                  }else {
                    if(/^.*\.php$/i.test(e.name)) {
                      f = "php"
                    }
                  }
                }
              }
            }
          }c.editor.onTextInput(r.result);
          k.value = f;
          c.editor.getDocument().setMode(l[f])
        };
        r.readAsText(e)
      }return h.preventDefault(a)
    })
  }
});