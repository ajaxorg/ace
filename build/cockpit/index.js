define(function(a, d) {
  d.startup = function(b, c) {
    a("pilot/index");
    a("cockpit/cli").startup(b, c);
    window.testCli = a("cockpit/test/testCli");
    a("cockpit/ui/settings").startup(b, c);
    a("cockpit/ui/cliView").startup(b, c)
  }
});