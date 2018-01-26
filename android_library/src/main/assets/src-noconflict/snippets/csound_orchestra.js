ace.define("ace/snippets/csound_orchestra",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# else\n\
snippet else\n\
	else\n\
		${1:/* statements */}\n\
# elseif\n\
snippet elseif\n\
	elseif ${1:/* condition */} then\n\
		${2:/* statements */}\n\
# if\n\
snippet if\n\
	if ${1:/* condition */} then\n\
		${2:/* statements */}\n\
	endif\n\
# instrument block\n\
snippet instr\n\
	instr ${1:name}\n\
		${2:/* statements */}\n\
	endin\n\
# i-time while loop\n\
snippet iwhile\n\
	i${1:Index} = ${2:0}\n\
	while i${1:Index} < ${3:/* count */} do\n\
		${4:/* statements */}\n\
		i${1:Index} += 1\n\
	od\n\
# k-rate while loop\n\
snippet kwhile\n\
	k${1:Index} = ${2:0}\n\
	while k${1:Index} < ${3:/* count */} do\n\
		${4:/* statements */}\n\
		k${1:Index} += 1\n\
	od\n\
# opcode\n\
snippet opcode\n\
	opcode ${1:name}, ${2:/* output types */ 0}, ${3:/* input types */ 0}\n\
		${4:/* statements */}\n\
	endop\n\
# until loop\n\
snippet until\n\
	until ${1:/* condition */} do\n\
		${2:/* statements */}\n\
	od\n\
# while loop\n\
snippet while\n\
	while ${1:/* condition */} do\n\
		${2:/* statements */}\n\
	od\n\
";
exports.scope = "csound_orchestra";

});
