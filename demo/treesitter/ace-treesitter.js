(async function() {
	const url = `${LANGUAGE_BASE_URL}/tree-sitter-javascript.wasm`

	await TreeSitter.init();
	const ace = await req("ace/ace");
	Range = ace.Range;

  var editor = ace.edit("editor");
  editor.session.setMode("ace/mode/text");
  await setValue(editor);

	parser = new TreeSitter();

	const JavaScript = await TreeSitter.Language.load(url);
	parser.setLanguage(JavaScript);

	const sourceCode = editor.session.getValue();

	query = parser.getLanguage().query(queryText);
  session = editor.getSession();
  session.tree = parser.parse(sourceCode);

	session.bgTokenizer.stop();
	bgTokenizer = {
		document: session.getDocument(),
		tokens: null,
		getTokens(row) {

			if (!this.tokens) {
				this.tokens = computeTokens(session);
			}
			return this.tokens[row];

				// return [{
				// 	value: this.document.getLine(row),
				// 	type: "text"
				// }]
		},
		$updateOnChange(delta) {
			onChange(delta, this.tokens);
		},
		getState(row) {},
		scheduleStart() {
			console.log("schedule start");
		}
	}

	session.bgTokenizer = bgTokenizer;

	//session.on("change", onChange);

	function onChange(e, tokens) {
		console.time("change");
		const startIndex = session.getDocument().positionToIndex(e.start);
		const endIndex = session.getDocument().positionToIndex(e.end);
		const action = e.action;

		if (action == "insert") {
			session.tree.edit({
				startIndex,
				startPosition: e.start,
				oldEndIndex: startIndex,
				newEndIndex: endIndex,
				oldEndPosition: e.start,
				newEndPosition: e.end
			});
		} else if (action == "remove") {
			const endIndex = startIndex + e.lines.join("\n").length;
			session.tree.edit({
				startIndex,
				startPosition: e.start,
				oldEndIndex: endIndex,
				newEndIndex: startIndex,
				oldEndPosition: e.end,
				newEndPosition: e.start
			});
		} else {
			throw new Error(`invalid action: ${action}`);
		}

		const newTree = parser.parse(session.getDocument().getValue(), session.tree);
		console.timeEnd("change");

    const rangesWithSyntaxChanges = session.tree.getChangedRanges(newTree);

    let applicableRange = e;
    if (rangesWithSyntaxChanges.length > 0) {
    	applicableRange = unionRanges(applicableRange, {
    		start: rangesWithSyntaxChanges[0].startPosition,
    		end:  rangesWithSyntaxChanges[0].endPosition
    	});	
    }

  	// Extend range to full lines so managing the cache becomes easier
  	// TODO: Here is room for optimization.
  	applicableRange = {
  		start: {
  			row: applicableRange.start.row,
  			column: 0
  		},
  		end: {
  			row: applicableRange.end.row,
  			column: session.getDocument().getLine(applicableRange.end.row).length
  		}
  	}

  	// remove old range from cache
  	let len = applicableRange.end.row - applicableRange.start.row;
  	if (action == "remove") {
  		tokens.splice(applicableRange.start.row, len + 1);
  	} else {
  		tokens.splice(applicableRange.start.row, 1, ...Array.from({length: len+1}, (_, i) => []));
  	}
  	if (tokens.length == 0) {
  		tokens.push([]);
  	}


	  console.time("capture");
	  let captures = query.captures(
    	newTree.rootNode,
    	applicableRange.start,
    	applicableRange.end,
	  );
	  console.timeEnd("capture");
	  
	  //insert new range into cache
		for (let token of tokenIterator(session, captures)) {
			if (!tokens[token.row]) {
				tokens[token.row] = [];
			}
			tokens[token.row].push(token);
		}

		if (session.tree) session.tree.delete();
    session.tree = newTree;
	};
})();

function computeTokens(session) {
	const doc = session.getDocument();

	let i = 0;
	let tokens = [];
	for (let i=0; i<doc.getLength(); i++) {
		tokens[i] = [];
	}

  let captures = query.captures(
  	session.tree.rootNode,
	);

	for (let token of tokenIterator(session, captures)) {
		tokens[token.row].push(token);
	}

	return tokens
}

function* tokenIterator(session, captures) {
  const doc = session.getDocument();

	let prevEnd = {
		row: 0,
		column:0
	};
	let prevCapture = null;
	for (let capture of captures) {
		const start = capture.node.startPosition;
		const end = capture.node.endPosition;

		if (prevCapture 
			&& prevCapture.node.endPosition.row == capture.node.endPosition.row 
			&& prevCapture.node.endPosition.column == capture.node.endPosition.column) {
			prevEnd = end;
			prevCapture = capture;

			continue;
		}

		if (prevEnd.row < start.row) {
			prevEnd = {
				row: start.row,
				column: 0
			}
		}
		if (prevEnd.column < start.column) {
			yield {
				row: prevEnd.row,
				type: "text",
				value : doc.getTextRange({
					start: {
						row: prevEnd.row,
						column: prevEnd.column
					},
					end: {
						row: prevEnd.row,
						column: start.column	
					}
				})
			};
		}

		if (start.row == end.row) {
			yield token = {
				row: start.row,
				type: capture.name,
				value: doc.getTextRange({
					start,
					end
				})
			};
		} else {
			yield token = {
				row: start.row,
				type: capture.name,
				value: doc.getTextRange({
					start,
					end: {
						row: start.row,
						column: Number.MAX_SAFE_INTEGER
					}
				})						
			};	
			for (let i=start.row+1; i<end.row; i++) {
				yield token = {
					row: i,
					type: capture.name,
					value: doc.getTextRange({
						start: {
							row: i,
							column: 0
						},
						end: {
							row: i,
							column: Number.MAX_SAFE_INTEGER
						}
					})						
				};							
			}				
			yield token = {
				row: end.row,
				type: capture.name,
				value: doc.getTextRange({
					start: {
						row: end.row,
						column: 0
					},
					end
				})						
			};
		}

		prevEnd = end;
		prevCapture = capture;
	}
}

function printTree(tree) {
	const cursor = tree.walk();
	let indent = 0;
	let visitedChildren = false;
	while(true) {

    let displayName;
    if (cursor.nodeIsMissing) {
      displayName = `MISSING ${cursor.nodeType}`
    } else if (cursor.nodeIsNamed) {
      displayName = cursor.nodeType;
    } else {
    	displayName = `"${cursor.nodeText}"`;
    }

		if (visitedChildren) {
			if (cursor.gotoNextSibling()) {
				visitedChildren = false;
			} else if (cursor.gotoParent()) {
				indent--;
				visitedChildren = true;
			} else {
				break;
			}
		} else {
      const start = cursor.startPosition;
      const end = cursor.endPosition;

			console.log(`${'  '.repeat(indent)} ${displayName} [${start.row}, ${start.column}] - [${end.row}, ${end.column}]`)
      if (cursor.gotoFirstChild()) {
        visitedChildren = false;
        indent++;
      } else {
        visitedChildren = true;
      }
		}
	}
	cursor.delete();
}

async function req(moduleId) {
	return new Promise((resolve, reject) => {
		require([moduleId], function(mod) {
			resolve(mod);
		});
	});
}

async function setValue(editor) {
    const net = await req("ace/lib/net");
    return new Promise((resolve, reject) => {
	    net.get("./ace-treesitter.js", function(text, e) {
	    	if (e) {
	    		return reject(e);
	    	}
	        //editor.session.setValue(text);
	        editor.session.setValue('console.log("juhu")');
	        resolve();
	    });
    });
}

function unionRanges(...ranges) {
	let range = Range.fromPoints(ranges[0].start, ranges[0].end);
	for (let i=1; i<ranges.length; i++) {
		let other= ranges[i];

		if (range.comparePoint(other.start) < 0) {
			range.start = other.start;
		}

		if (range.comparePoint(other.end) > 0) {
			range.end = other.end;
		}
	}

	return range;
}

var queryText = `([
    (identifier)
    (shorthand_property_identifier)
    (shorthand_property_identifier_pattern)
 ] @constant
 (#match? @constant "^[A-Z_][A-Z\\d_]+$"))


((identifier) @constructor
 (#match? @constructor "^[A-Z]"))

((identifier) @variable.builtin
 (#match? @variable.builtin "^(arguments|module|console|window|document)$")
 (#is-not? local))

((identifier) @function.builtin
 (#eq? @function.builtin "require")
 (#is-not? local))

; Function and method definitions
;--------------------------------

(function
  name: (identifier) @function)
(function_declaration
  name: (identifier) @function)
(method_definition
  name: (property_identifier) @function.method)

(pair
  key: (property_identifier) @function.method
  value: [(function) (arrow_function)])

(assignment_expression
  left: (member_expression
    property: (property_identifier) @function.method)
  right: [(function) (arrow_function)])

(variable_declarator
  name: (identifier) @function
  value: [(function) (arrow_function)])

(assignment_expression
  left: (identifier) @function
  right: [(function) (arrow_function)])

; Function and method calls
;--------------------------

(call_expression
  function: (identifier) @function)

(call_expression
  function: (member_expression
    property: (property_identifier) @function.method))

; Variables
;----------

(identifier) @variable

; Properties
;-----------

(property_identifier) @property

; Literals
;---------

(this) @variable.builtin
(super) @variable.builtin

[
  (true)
  (false)
  (null)
  (undefined)
] @constant.builtin

(comment) @comment

[
  (string)
  (template_string)
] @string

(regex) @string.special
(number) @number

; Tokens
;-------

(template_substitution
  "\${" @punctuation.special
  "}" @punctuation.special) @embedded

[
  ";"
  "?."
  "."
  ","
] @punctuation.delimiter

[
  "-"
  "--"
  "-="
  "+"
  "++"
  "+="
  "*"
  "*="
  "**"
  "**="
  "/"
  "/="
  "%"
  "%="
  "<"
  "<="
  "<<"
  "<<="
  "="
  "=="
  "==="
  "!"
  "!="
  "!=="
  "=>"
  ">"
  ">="
  ">>"
  ">>="
  ">>>"
  ">>>="
  "~"
  "^"
  "&"
  "|"
  "^="
  "&="
  "|="
  "&&"
  "||"
  "??"
  "&&="
  "||="
  "??="
] @operator

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
]  @punctuation.bracket

[
  "as"
  "async"
  "await"
  "break"
  "case"
  "catch"
  "class"
  "const"
  "continue"
  "debugger"
  "default"
  "delete"
  "do"
  "else"
  "export"
  "extends"
  "finally"
  "for"
  "from"
  "function"
  "get"
  "if"
  "import"
  "in"
  "instanceof"
  "let"
  "new"
  "of"
  "return"
  "set"
  "static"
  "switch"
  "target"
  "throw"
  "try"
  "typeof"
  "var"
  "void"
  "while"
  "with"
  "yield"
] @keyword`