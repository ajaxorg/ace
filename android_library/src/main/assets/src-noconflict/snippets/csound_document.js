ace.define("ace/snippets/csound_document",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# <CsoundSynthesizer>\n\
snippet synth\n\
	<CsoundSynthesizer>\n\
	<CsInstruments>\n\
	${1}\n\
	</CsInstruments>\n\
	<CsScore>\n\
	e\n\
	</CsScore>\n\
	</CsoundSynthesizer>\n\
";
exports.scope = "csound_document";

});
