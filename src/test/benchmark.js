if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var EditSession = require("../edit_session").EditSession;

module.exports = {
    setUp : function() {
        this.start = Date.now();
    },
    
    tearDown : function() {
        console.log("took: ", Date.now() - this.start + "ms");
    },
    
    "test: document to screen position": function() {
        var s = new EditSession(Array(6000).join('someText\n'));

        for (var i=0; i<6000; i++)
            s.documentToScreenPosition(i, 0);

        for (var i=0; i<6000; i++)
            s.documentToScreenPosition(i, 0);

        console.log(s.$rowCache.length);
    },
    
    "test: screen to document position": function() {
        var s = new EditSession(Array(6000).join('someText\n'));

        for (var i=0; i<6000; i++)
            s.screenToDocumentPosition(i, 0);

        for (var i=0; i<6000; i++)
            s.documentToScreenPosition(i, 0);

        console.log(s.$rowCache.length);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
