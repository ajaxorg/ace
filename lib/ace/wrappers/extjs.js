
define(function(require, exports, module) {

// TODO: Move this out of here
require("pilot/fixoldbrowsers");

var CANON = require("pilot/canon");
var EDITOR = require("ace/editor").Editor;
var RENDERER = require("ace/virtual_renderer").VirtualRenderer;
var THEME_TEXTMATE = require("ace/theme/textmate");

Ext.ux.AceEditor = Ext.extend(Ext.BoxComponent, {

    initComponent: function() {
        Ext.ux.AceEditor.superclass.initComponent.call(this);
        var self = this;

        self.value = null;

        self.addEvents(
            "editor-save",
            "editor-saveas"
        );
        CANON.addCommand({
            name: "save",
            exec: function(env, args, request) {
                self.fireEvent('editor-save', self);
            }
        });
        CANON.addCommand({
            name: "saveas",
            exec: function(env, args, request) {
                self.fireEvent('editor-saveas', self);
            }
        });
    },

    onRender: function() {
        Ext.BoxComponent.superclass.onRender.apply(this, arguments);
    
    
        this.editor = new EDITOR(new RENDERER(this.el.dom, THEME_TEXTMATE));
        this.editor.resize();

        if(this.value!==null) {
            this.setValue(this.value[0], this.value[1]);
        }

        var self = this;
        this.editor.getDocument().addEventListener("changeDelta", function() {
            self.fireEvent('editor-changeDelta', self);
        });
    },

    onResize: function( aw, ah ){
        if(this.editor) {
            this.editor.resize();
        }
    },

    getValue: function() {
        return this.editor.getDocument().getValue();
    },

    setValue: function(value, options) {
        if(!this.editor) {
            this.value = [value, options];
            return;
        }
        this.value = null;

        options = options || {};

        var doc = this.editor.getDocument(),
            ext,
            mode;

        if(typeof options.basename != "undefined" && (ext = options.basename.match(/\.([\w]+)$/))) {
            switch(ext[1]) {
                case "xml":
                case "xhtml":
                case "rdf":
                    mode = require("ace/mode/xml").Mode;
                    break;
                case "htm":
                case "html":
                    mode = require("ace/mode/html").Mode;
                    break;
                case "js":
                case "json":
                    mode = require("ace/mode/javascript").Mode;
                    break;
                case "css":
                    mode = require("ace/mode/css").Mode;
                    break;
                case "py":
                    mode = require("ace/mode/python").Mode;
                    break;
                case "php":
                    mode = require("ace/mode/php").Mode;
                    break;
                default:
                    mode = require("ace/mode/text").Mode;
                    break;
            }
        } else {
            mode = require("ace/mode/text").Mode;
        }
        doc.setMode(new mode());        
        doc.setValue(value);
    }
});

});