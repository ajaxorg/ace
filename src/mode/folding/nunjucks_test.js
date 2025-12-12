"use strict";

var NunjucksMode = require("../nunjucks").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new NunjucksMode();
    },

    "test: nunjucks folding": function() {
        var session = new EditSession([
            '{% block header %}',
            '  <section class="left">',
            '    {% block left %}{% endblock %}',
            '    {% set standardModal %}',
            '      {% include "standardModalData.html" %}',
            '      {% set cls = cycler("odd", "even") %}',
            '    {% endset %}',
            '    {% if hungry %}',
            '      I am hungry',
            '    {% elif tired %}',
            '      I am tired',
            '    {% else %}',
            '      I am good!',
            '    {% endif %}',
            '  </section>',
            '{% endblock %}'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "");  // set with =
        assert.equal(session.getFoldWidget(6), "end");
        assert.equal(session.getFoldWidget(7), "start");
        assert.equal(session.getFoldWidget(8), "");
        assert.equal(session.getFoldWidget(9), "start");
        assert.equal(session.getFoldWidget(10), "");
        assert.equal(session.getFoldWidget(11), "start");
        assert.equal(session.getFoldWidget(12), "");
        assert.equal(session.getFoldWidget(13), "end");
        assert.equal(session.getFoldWidget(14), "end");
        assert.equal(session.getFoldWidget(15), "end");

        assert.range(session.getFoldWidgetRange(0), 0, 18, 15, 0);
        assert.range(session.getFoldWidgetRange(1), 1, 24, 14, 2);
        assert.range(session.getFoldWidgetRange(3), 3, 27, 6, 4);
        assert.range(session.getFoldWidgetRange(6), 3, 27, 6, 4);
        assert.range(session.getFoldWidgetRange(7), 7, 19, 9, 4);
        assert.range(session.getFoldWidgetRange(11), 11, 14, 13, 4);
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();