if (typeof process !== "undefined") {
    require("../../support/paths");
    require("ace/test/mockdom");
}

var theme = require("ace/theme/tomorrow");
var EditSession = require("ace/edit_session").EditSession;
var Editor = require("ace/editor").Editor;
var MockRenderer = require("ace/test/mockrenderer").MockRenderer;
var TextLayer = require("ace/layer/text").Text;

/** Ace highlighting but server side
 */
var ServerSideHighlighter = module.exports = function() {
};

(function () {
    
    /** Returns a mode from /ace/mode based on a filename
     *
     * @param {string} fileName name of the file without directory information
     * @returns {mode} A mode that can highlight the given file, or TextMode if nothing matched
     */
    function getMode (fileName) {
        var extension = fileName.match(/\.(\w+)$/)[1];
        
        switch (extension) {
            case "js":
                var JavascriptMode = require("ace/mode/javascript").Mode;
                return new JavascriptMode();
            default:
                var TextMode = require("ace/mode/text").Mode;
                return new TextMode();
        }
    }
    
    /** Transforms a given input code snippet into HTML using the given mode
    *
    * @param {string} input Code snippet
    * @param {mode} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
    * @param {string} r Code snippet
    * @returns {object} An object containing: html, css
    */
    function render (input, mode, theme) {
        var session = new EditSession("");
        session.setMode(mode);// || new JavaScriptMode());
        
        var editor = new Editor(new MockRenderer(), session);
        var textLayer = new TextLayer(document.createElement("div"));
        textLayer.setSession(session);
        textLayer.config = {
            characterWidth: 10,
            lineHeight: 20
        };
        
        session.setValue(input);
                
        var stringBuilder = [], length =  session.getLength();
        var tokens = session.getTokens(0, length - 1);
        
        for(var ix = 0; ix < length; ix++) {
            var lineTokens = tokens[ix].tokens;
            stringBuilder.push("<span class='ace_gutter ace_gutter-cell'>" + (ix+1) + "</span>");
            textLayer.$renderLine(stringBuilder, 0, lineTokens, true);
            stringBuilder.push("<br>");
        }
        
        // let's prepare the whole html
        var html = "<div class=':cssClass'>\
            <div class='ace_editor'>\
                :code\
            </div>\
        </div>".replace(/:cssClass/, theme.cssClass).replace(/:code/, stringBuilder.join(""));
                
        return {
            css: theme.cssText,
            html: html
        };
    }
        
    this.getMode = getMode;
    this.render = render;
}).call(ServerSideHighlighter.prototype);

//"/**\n\
//         * juhu\n\
//         * kinner \n\
//         */\n\
//        function a(b) {\n\
//            return b;\n\
//        }"