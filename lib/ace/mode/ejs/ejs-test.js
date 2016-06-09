if (typeof process !== "undefined") {
    require("amd-loader");
}

'use strict';

const assert = require('assert');
const ejsLint = require('./ejs-lint');

describe('EJS Linter', function(){
	it('shouldn\'t throw an error on a properly formatted tag', function(){
		var results = ejsLint("<% variable %>");
		assert(results.errors.length === 0, "Errors were found on valid EJS");

		results = ejsLint("<%-: recipient | salutation %>\
			\
			<%= hostName %> let me know this meeting will be <%= acceptedTimes[0] %>. \
			<% if (!isVirtual(locationType)) { %><br><br>I'll check with <%= locationOwner %> about the location.<% } %>\
			\
			<%-: broker | signature %>");
		assert(results.errors.length === 0, "Errors were found on valid EJS");
	});

	it('should throw a warning on a single %> tag', function(){
		var results = ejsLint("%>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw a single warning if there\'s are multiple trailing end tags', function(){
		var results = ejsLint("%> %>\
								%>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw multiple warnings if there are multiple end tags between valid tag sequences', function(){
		var results = ejsLint("<% %> %> %>\n\
								%>\n\
								%> <% %>");
		assert(results.errors.length === 4, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
		assert(results.errors[1].errorType === "warning", "Wrong error type");
		assert(results.errors[1].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[1].line === 0, "Error occurred on wrong line");
		assert(results.errors[2].errorType === "warning", "Wrong error type");
		assert(results.errors[2].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[2].line === 1, "Error occurred on wrong line");
		assert(results.errors[3].errorType === "warning", "Wrong error type");
		assert(results.errors[3].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[3].line === 2, "Error occurred on wrong line");
	});

	it('should throw multiple warnings if there are multiple end tags before a valid tag sequence', function(){
		var results = ejsLint("%> %>\n\
								%>\n\
								%> <% %>");
		assert(results.errors.length === 4, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
		assert(results.errors[1].errorType === "warning", "Wrong error type");
		assert(results.errors[1].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[1].line === 0, "Error occurred on wrong line");
		assert(results.errors[2].errorType === "warning", "Wrong error type");
		assert(results.errors[2].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[2].line === 1, "Error occurred on wrong line");
		assert(results.errors[3].errorType === "warning", "Wrong error type");
		assert(results.errors[3].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[3].line === 2, "Error occurred on wrong line");
	});

	it('should throw an error if an open tag is unpaired', function(){
		var results = ejsLint("<% %> <% %> <%");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "This opening tag is never closed. Please use '%>' to close it", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw an error on a solitary open tag', function(){
		var results = ejsLint("<%");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "This opening tag is never closed. Please use '%>' to close it", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw only one error if multiple open tags are unpaired', function(){
		var results = ejsLint("<% %> <% %> <% <% <% <%");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "This opening tag is never closed. Please use '%>' to close it", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw an error if an open tag is inside a pair of tags', function(){
		var results = ejsLint("<% <% %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "Can't have a '<%' tag inside a pair of tags", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw only one error if multiple open tags are inside a pair of tags', function(){
		var results = ejsLint("<% <% <% <% <% %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "Can't have a '<%' tag inside a pair of tags", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw only one error if multiple instances of open tag inside a pair of tags', function(){
		var results = ejsLint("<% <% <% <% <% %>\n\
								<% <% %>\n\
								<% <% <% %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "Can't have a '<%' tag inside a pair of tags", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw a warning if there\'s a % inside a set of tags', function(){
		var results = ejsLint("<% % %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "Did you mean to put a tag instead of '%'?", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});	

	it('should throw only one warning even if there are multiple % inside a set of tags', function(){
		var results = ejsLint("<% %%%%%%%%%% %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "Did you mean to put a tag instead of '%'?", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should parse to a console.log for an insert tag', function(){
		var results = ejsLint("<%= getSenderName(PROPOSE_LOCATION) %>");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === "console.log( getSenderName(PROPOSE_LOCATION) );", "ParsedJs does not have the expected value");
	});

	it('should parse to multiple console.logs for a properly formatted filter tag', function(){
		var results = ejsLint("<%-: recipient | salutation %>");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === "console.log( recipient );console.log( salutation );", "ParsedJs does not have the expected value");
	});

	it('should throw an error for a filter tag missing a |', function(){
		var results = ejsLint("<%-: recipient salutation %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "Filter statement is missing a '|'.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw a warning for a poorly formatted filter tag (\'-\') ', function(){
		var results = ejsLint("<%- recipient | salutation %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "Did you mean for this to be a filter? Use '-:' at the start of a tag to use filters", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should throw a warning for a poorly formatted filter tag (\':\') ', function(){
		var results = ejsLint("<%: recipient | salutation %>");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "Did you mean for this to be a filter? Use '-:' at the start of a tag to use filters", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
	});

	it('should parse a tag without filter or insert', function(){
		var results = ejsLint("<% look, a normal ejs tag. this will get parsed like it is javascript, even though it is just text %>");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === " look, a normal ejs tag. this will get parsed like it is javascript, even though it is just text ", "ParsedJs does not have the expected value");
	});

	it('should parse a series of tags without filter or insert', function(){
		var results = ejsLint("<% look, a normal ejs tag. this will get parsed like it is javascript, even though it is just text %>\n" + 
								"<% oh boy, another tag %>\n \n \n <% another one %>");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === " look, a normal ejs tag. this will get parsed like it is javascript, "
								+ "even though it is just text \n oh boy, another tag \n\n\n another one ", "ParsedJs does not have the expected value");

	});

	it('should parse out nothing from an empty tag', function(){
		var results = ejsLint("<%%>");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === "", "ParsedJs does not have the expected value");

	});

	it('should parse out new line characters from between tags', function(){
		var results = ejsLint("\n<%%>\n\n<%%><%%><%%>\n<%%>\n");
		assert(results.errors.length === 0, "There shouldn't be any errors here...");
		assert(results.parsed === "\n\n\n\n\n", "ParsedJs does not have the expected value");
	});

	it('should parse a complicated series of tags', function(){
		var results = ejsLint("\n <% randomText %> <%=insertConsoleLog()%> \n" +
								"<%- this won\'t show up, cool%> \n\n <%%> <%-: will this be in a log ... nope%>" + 
								"<%-: recipient | salutation %>");
		assert(results.errors.length === 2, "There shouldn't be any errors here...");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "Did you mean for this to be a filter? Use '-:' at the start of a tag to use filters", "Wrong error message");
		assert(results.errors[0].line === 2, "Error occurred on wrong line");
		assert(results.errors[1].errorType === "error", "Wrong error type");
		assert(results.errors[1].message === "Filter statement is missing a '|'.", "Wrong error message");
		assert(results.errors[1].line === 4, "Error occurred on wrong line");
		assert(results.parsed === "\n randomText console.log(insertConsoleLog());\n\n\nconsole.log( recipient );console.log( salutation );", "ParsedJs does not have the expected value");

	});

	it('should throw all the expected warnings on a very messed up input', function(){
		var results = ejsLint("%>\n<% %>\n<%-: % no filterTag %> <%- %>\n<%");
		assert(results.errors.length === 5, "Wrong number of errors");
		assert(results.errors[0].errorType === "warning", "Wrong error type");
		assert(results.errors[0].message === "End tag is not paired with an open tag.", "Wrong error message");
		assert(results.errors[0].line === 0, "Error occurred on wrong line");
		assert(results.errors[1].errorType === "warning", "Wrong error type");
		assert(results.errors[1].message === "Did you mean to put a tag instead of '%'?", "Wrong error message");
		assert(results.errors[1].line === 2, "Error occurred on wrong line");
		assert(results.errors[2].errorType === "error", "Wrong error type");
		assert(results.errors[2].message === "Filter statement is missing a '|'.", "Wrong error message");
		assert(results.errors[2].line === 2, "Error occurred on wrong line");
		assert(results.errors[3].errorType === "warning", "Wrong error type");
		assert(results.errors[3].message === "Did you mean for this to be a filter? Use '-:' at the start of a tag to use filters", "Wrong error message");
		assert(results.errors[3].line === 2, "Error occurred on wrong line");
		assert(results.errors[4].errorType === "error", "Wrong error type");
		assert(results.errors[4].message === "This opening tag is never closed. Please use '%>' to close it", "Wrong error message");
		assert(results.errors[4].line === 3, "Error occurred on wrong line");
	});

	it('should handle line numbering correctly even when given a complicated filter', function(){
		var results = ejsLint("\n <%-: recipient\n\n\n | \n\n\nsalutation \n%> \n <%");
		assert(results.errors.length === 1, "Wrong number of errors");
		assert(results.parsed === "\nconsole.log( recipient\n\n\n );console.log( \n\n\nsalutation \n);\n", "ParsedJs does not have the expected value");
		assert(results.errors[0].errorType === "error", "Wrong error type");
		assert(results.errors[0].message === "This opening tag is never closed. Please use '%>' to close it", "Wrong error message");
		assert(results.errors[0].line === 9, "Error occurred on wrong line");
	});



});