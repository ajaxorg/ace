require.def("ace/ace", [
        "ace/lib/core",
        "ace/lib/dom",
        "ace/lib/event",
        "ace/lib/lang",
        "ace/lib/oop"
    ], function(core, dom, evt, lang, oop) {

    var ace = {};

    oop.mixin(ace, core);
    oop.mixin(ace, dom);
    oop.mixin(ace, evt);
    oop.mixin(ace, lang);
    oop.mixin(ace, oop);

    return ace;
});