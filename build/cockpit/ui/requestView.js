define(function(b, j, c) {
  function i(a, d) {
    this.request = a;
    this.cliView = d;
    this.imagePath = g;
    this.throb = this.duration = this.show = this.hide = this.output = this.rowout = this.rowin = null;
    (new k).processNode(l.cloneNode(true), this);
    this.cliView.output.appendChild(this.rowin);
    this.cliView.output.appendChild(this.rowout);
    this.request.addEventListener("output", this.onRequestChange.bind(this))
  }
  var e = b("pilot/dom"), h = b("pilot/event"), f = b('text!cockpit/ui/requestView.html!\n<div class=cptRow>\n  <!-- The div for the input (i.e. what was typed) --\>\n  <div class="cptRowIn" save="${rowin}"\n      onclick="${copyToInput}"\n      ondblclick="${executeRequest}">\n  \n    <!-- What the user actually typed --\>\n    <div class="cptGt">&gt; </div>\n    <div class="cptOutTyped">${request.typed}</div>\n\n    <!-- The extra details that appear on hover --\>\n    <div class=cptHover save="${duration}"></div>\n    <img class=cptHover onclick="${hideOutput}" save="${hide}"\n        alt="Hide command output" _src="${imagePath}/minus.png"/>\n    <img class="cptHover cptHidden" onclick="${showOutput}" save="${show}"\n        alt="Show command output" _src="${imagePath}/plus.png"/>\n    <img class=cptHover onclick="${remove}"\n        alt="Remove this command from the history" _src="${imagePath}/closer.png"/>\n  \n  </div>\n  \n  <!-- The div for the command output --\>\n  <div class="cptRowOut" save="${rowout}">\n    <div class="cptRowOutput" save="${output}"></div>\n    <img _src="${imagePath}/throbber.gif" save="${throb}"/>\n  </div>\n</div>\n'), 
  k = b("pilot/domtemplate").Templater;
  b = b("text!cockpit/ui/requestView.css!\n.cptRowIn {\n  display: box; display: -moz-box; display: -webkit-box;\n  box-orient: horizontal; -moz-box-orient: horizontal; -webkit-box-orient: horizontal;\n  box-align: center; -moz-box-align: center; -webkit-box-align: center;\n  color: #333;\n  background-color: #EEE;\n  width: 100%;\n  font-family: consolas, courier, monospace;\n}\n.cptRowIn > * { padding-left: 2px; padding-right: 2px; }\n.cptRowIn > img { cursor: pointer; }\n.cptHover { display: none; }\n.cptRowIn:hover > .cptHover { display: block; }\n.cptRowIn:hover > .cptHover.cptHidden { display: none; }\n.cptOutTyped {\n  box-flex: 1; -moz-box-flex: 1; -webkit-box-flex: 1;\n  font-weight: bold; color: #000; font-size: 120%;\n}\n.cptRowOutput { padding-left: 10px; line-height: 1.2em; }\n.cptRowOutput strong,\n.cptRowOutput b,\n.cptRowOutput th,\n.cptRowOutput h1,\n.cptRowOutput h2,\n.cptRowOutput h3 { color: #000; }\n.cptRowOutput a { font-weight: bold; color: #666; text-decoration: none; }\n.cptRowOutput a: hover { text-decoration: underline; cursor: pointer; }\n.cptRowOutput input[type=password],\n.cptRowOutput input[type=text],\n.cptRowOutput textarea {\n  color: #000; font-size: 120%;\n  background: transparent; padding: 3px;\n  border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;\n}\n.cptRowOutput table,\n.cptRowOutput td,\n.cptRowOutput th { border: 0; padding: 0 2px; }\n.cptRowOutput .right { text-align: right; }\n");
  e.importCssString(b);
  b = document.createElement("div");
  b.innerHTML = f;
  var l = b.querySelector(".cptRow");
  f = c.id.split("/").pop() + ".js";
  var g;
  if(c.uri.substr(-f.length) !== f) {
    console.error("module.id", c.id);
    console.error("module.uri", c.uri);
    console.error("filename", f);
    console.error("Can't work out path from module.uri/module/id");
    g = "."
  }else {
    g = c.uri.substr(0, c.uri.length - f.length) + "images"
  }i.prototype = {copyToInput:function() {
    this.cliView.element.value = this.request.typed
  }, executeRequest:function() {
    this.cliView.cli.update({typed:this.request.typed, cursor:{start:0, end:0}});
    this.cliView.cli.exec()
  }, hideOutput:function(a) {
    this.output.style.display = "none";
    e.addCssClass(this.hide, "cmd_hidden");
    e.removeCssClass(this.show, "cmd_hidden");
    h.stopPropagation(a)
  }, showOutput:function(a) {
    this.output.style.display = "block";
    e.removeCssClass(this.hide, "cmd_hidden");
    e.addCssClass(this.show, "cmd_hidden");
    h.stopPropagation(a)
  }, remove:function(a) {
    this.cliView.output.removeChild(this.rowin);
    this.cliView.output.removeChild(this.rowout);
    h.stopPropagation(a)
  }, onRequestChange:function() {
    this.duration.innerHTML = this.request.duration ? "completed in " + this.request.duration / 1E3 + " sec " : "";
    this.output.innerHTML = "";
    this.request.outputs.forEach(function(a) {
      var d;
      if(typeof a == "string") {
        d = document.createElement("p");
        d.innerHTML = a
      }else {
        d = a
      }this.output.appendChild(d)
    }, this);
    this.cliView.scrollOutputToBottom();
    e.setCssClass(this.output, "cmd_error", this.request.error);
    this.throb.style.display = this.request.completed ? "none" : "block"
  }};
  j.RequestView = i
});