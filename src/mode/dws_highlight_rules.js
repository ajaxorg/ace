    "use strict";

	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
	var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
	var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;

	var DWSHighlightRules = function() {
		var keywordMapper = this.createKeywordMapper({
			"keyword.control": "absolute|abstract|all|and|and_then|array|as|attribute|begin|bindable|case|class" +
				"|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization" +
				"|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is" +
				"|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private" +
				"|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr" +
				"|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor|async|await|override|new|function|procedure"
		}, "identifier", true);

		this.$rules = {
			start: [{
					caseInsensitive: true,
					token: 'keyword',
					regex: '\\b(asm)\\b',
					next: 'js-start'
				},{
					caseInsensitive: true,
					token: ['variable', "text",
						'storage.type.prototype',
						'entity.name.function.prototype'
					],
					regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))'
				}, {
					caseInsensitive: true,
					token: ['variable', "text", 'storage.type.function', 'entity.name.function'],
					regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?'
				}, {
					caseInsensitive: true,
					token: keywordMapper,
					regex: /\b[a-z_]+\b/
				}, {
					token: 'constant.numeric',
					regex: '\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'
				}, {
					token: 'punctuation.definition.comment',
					regex: '--.*$'
				}, {
					token: 'punctuation.definition.comment',
					regex: '//.*$'
				}, {
					caseInsensitive: true,
					token: 'entity.name.function',
					regex: '\\{\\$[I|R]*',
					push: [{
							token: 'punctuation.definition.string.begin',
							regex: '"',
							push: [{ token: 'constant.character.escape', regex: '\\\\.' },
								{
									token: 'punctuation.definition.string.end',
									regex: '"',
									next: 'pop'
								},
								{ defaultToken: 'string.quoted.double' }
							]
							//Double quoted strings are an extension and (generally) support C-style escape sequences.
						},{
							token: 'punctuation.definition.string.begin',
							regex: '\'',
							push: [{
									token: 'constant.character.escape.apostrophe',
									regex: '\'\''
								},
								{
									token: 'punctuation.definition.string.end',
									regex: '\'',
									next: 'pop'
								},
								{ defaultToken: 'string.quoted.single' }
							]
						},
						{
							token: 'entity.name.function',
							regex: '\\}',
							next: 'pop'
						},
						{ defaultToken: 'directive' }
					]
				}, {
					token: 'punctuation.definition.comment',
					regex: '\\/\\*',
					push: [{
							token: 'punctuation.definition.comment',
							regex: '\\*\\/',
							next: 'pop'
						},
						{ defaultToken: 'comment.block.one' }
					]
				}, {
					token: 'punctuation.definition.comment',
					regex: '\\{',
					push: [{
							token: 'punctuation.definition.comment',
							regex: '\\}',
							next: 'pop'
						},
						{ defaultToken: 'comment.block.two' }
					]
				}, {
					token: 'punctuation.definition.string.begin',
					regex: '"',
					push: [{ token: 'constant.character.escape', regex: '\\\\.' },
						{
							token: 'punctuation.definition.string.end',
							regex: '"',
							next: 'pop'
						},
						{ defaultToken: 'string.quoted.double' }
					]
				}, {
					token: 'punctuation.definition.string.begin',
					regex: '\\#"',
					next: 'continue_string_quoted_double'
				}, {
					token: 'punctuation.definition.string.begin',
					regex: '\'',
					push: [{
							token: 'constant.character.escape.apostrophe',
							regex: '\'\''
						},
						{
							token: 'punctuation.definition.string.end',
							regex: '\'',
							next: 'pop'
						},
						{ defaultToken: 'string.quoted.single' }
					]
				}, {
					token: 'punctuation.definition.string.begin',
					regex: '\\#\'',
					next: 'continue_string_quoted_single'
				}, {
					token: 'keyword.operator',
					regex: '[+\\-;,/*%]|:=|=]'
				}, {
					token: 'paren.lparen',
					regex: '[\\(|\\[]' 
				}, {
					token: 'paren.rparen',
					regex: '[\\)|\\]]'
				}
			],
			continue_string_quoted_single: [
				{
					token: 'constant.character.escape.apostrophe',
					regex: '\'\''
				},
				{
					token: 'constant.character.escape.css.start',
					regex: '\\/\\/<css\\?',
					next: 'css1-start'
				},
				{
					token: 'punctuation.definition.string.end',
					regex: '\'',
					next: 'pop'
				},
				{ defaultToken: 'string.multiline.quoted.single' }
			],
			continue_string_quoted_double: [
				{ token: 'constant.character.escape', regex: '\\\\.' },
				{
					token: 'punctuation.definition.string.end',
					regex: '"',
					next: 'pop'
				},
				{
					token: 'constant.character.escape.css.start',
					regex: '\\/\\/<css\\?',
					next: 'css2-start'
				},
				{ defaultToken: 'string.multiline.quoted.double' }
			]
		};
		
		this.embedRules(JavaScriptHighlightRules, 'js-',[
			{
				caseInsensitive: true,
				token: ["keyword","text", "keyword.operator", "text"],
				regex: "\\b(end)(\\s*)([;.]*)(\\s*)$",
				next: "start"
			}
		]);
		
		
		this.embedRules(CssHighlightRules, 'css1-',[
			{
				caseInsensitive: true,
				token: 'constant.character.escape.css.end',
				regex: "\\/\\/\\?>",
				next: "continue_string_quoted_single"
			}
		]);
		
		this.embedRules(CssHighlightRules, 'css2-',[
			{
				caseInsensitive: true,
				token: 'constant.character.escape.css.end',
				regex: "\\/\\/\\?>",
				next: "continue_string_quoted_double"
			}
		]);
		

		this.normalizeRules();
	};

	oop.inherits(DWSHighlightRules, TextHighlightRules);

	exports.DWSHighlightRules = DWSHighlightRules;
	
});
