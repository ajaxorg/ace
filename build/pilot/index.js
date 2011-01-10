define(function(a, c) {
  var d = [a("pilot/fixoldbrowsers"), a("pilot/types/basic"), a("pilot/types/command"), a("pilot/types/settings"), a("pilot/commands/settings"), a("pilot/commands/basic"), a("pilot/settings/canon"), a("pilot/canon")];
  c.startup = function(e, f) {
    d.forEach(function(b) {
      typeof b.startup === "function" && b.startup(e, f)
    })
  }
});