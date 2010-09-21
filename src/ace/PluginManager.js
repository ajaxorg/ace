require.def("ace/PluginManager", [], function() {

var PluginManager = {
    commands : {},

    registerCommand : function(name, command) {
        this.commands[name] = command;
    }
};

return PluginManager;
});