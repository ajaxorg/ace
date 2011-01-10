var deps = ["pilot/fixoldbrowsers", "pilot/types/basic", "pilot/types/command", "pilot/types/settings", "pilot/commands/settings", "pilot/commands/basic", "pilot/settings/canon", "pilot/canon"], packages = deps.slice();
packages.unshift("require", "exports", "module");
define(packages, function(b, c) {
  c.startup = function(d, e) {
    deps.forEach(function(a) {
      a = b(a);
      typeof a.startup === "function" && a.startup(d, e)
    })
  }
});