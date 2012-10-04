define(function(require, exports, module) {
"use strict";
/** simple statusbar **/
var dom = require("ace/lib/dom");
var lang = require("ace/lib/lang");

var StatusBar = function(editor, parentNode) {
	this.element = dom.createElement("div");
	this.element.style.cssText = "color: gray; position:absolute; right:0; border-left:1px solid";
	parentNode.appendChild(this.element);

	var statusUpdate = lang.deferredCall(function(){
		this.updateStatus(editor)
	}.bind(this));
	editor.on("changeStatus", function() {
		statusUpdate.schedule(50);
	});
	editor.on("changeSelection", function() {
		statusUpdate.schedule(50);
	});
};

(function(){
	this.updateStatus = function(editor) {
		var status = [];
		function add(str, separator) {
			str && status.push(str, separator || "|");
		}
		
		if (editor.$vimModeHandler)
			add(editor.$vimModeHandler.getStatusText());
		else if (editor.commands.recording)
			add("REC");
		
		var c = editor.selection.lead;
		add(c.row + ":" + c.column, " ");
		if (!editor.selection.isEmpty()) {
			var r = editor.getSelectionRange();
			add("(" + (r.end.row - r.start.row) + ":"  +(r.end.column - r.start.column) + ")");
		}
		status.pop();
		this.element.textContent = status.join("");
	};
}).call(StatusBar.prototype);

exports.StatusBar = StatusBar;

});