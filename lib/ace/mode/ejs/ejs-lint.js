define(function(require, exports, module) {
	"use strict";

	var errors = [];
	var parsedJs = "";
	var lineNum = 0;

	var START_TAG_STR = "<%";
	var END_TAG_STR = "%>";

	var START_TAG_RE = /<%/;
	var END_TAG_RE = /%>/;
	var INSERT_RE = /\=/;
	var FILTER_RE = /-:/;
	var FILTER_SPLIT_RE = /\|/;
	var POORLY_FORMATTED_FILTER_RE = /-|:/;
	var NEW_LINE_RE = /\n/g;
	var PERCENTAGE_RE = /%/;
	var FILTER_ARG_RE = /:/;

	var pushError = function(line, col, type, message) {
		errors.push({
			line: line,
			column: col,
			errorType: type,
			message: message
		});
	};

	//Processes a string to increment lineNum global and parsedJs
	var parseNewLines = function(str) {
		//Find how many new line characters we jumped
		var newLines = str.match(NEW_LINE_RE);

		if (!!newLines) {
			//Add new line characters equal to the number that appeared in nonTagText
			parsedJs = parsedJs + "\n".repeat(newLines.length);

			//Add that many lines to the lineNum counter
			lineNum += newLines.length;
		}
	};

	//Adds a console.log statement of str
	var addConsoleLog = function(str) {
		parsedJs = parsedJs + "console.log(" + str + ");";
	};

	//Returns -1 if no such tag, or tag's index if text has it
	var textHasTag = function(text, tag){
		var tagMatch = text.match(tag);
		return (tagMatch && tagMatch.hasOwnProperty('index')) ? tagMatch.index : -1;
	};

	//Returns true if the text starts with the tag, false otherwise
	var textStartsWithTag = function(text, tag){
		var tagMatch = text.match(tag);
		return (tagMatch && tagMatch.hasOwnProperty('index') && tagMatch.index === 0);
	};

	//Returns the line number of the end of the block of text, assuming that it directly follows
	//the current lineNum
	var getLineNum = function(text) {
		var newLines = text.match(NEW_LINE_RE);
		return (!!newLines) ? lineNum + newLines.length : lineNum;
	};

	var parseTagContents = function(tagContents) {
		var beforeTag;

		//Check if there's a startTag in between tags
		var startTagIndex = textHasTag(tagContents, START_TAG_RE);

		//If there is, throw error
		if (startTagIndex > -1) {
			//Find the line number and column of the start tag
			beforeTag = tagContents.substring(0, startTagIndex);

			var startTagLineNum = getLineNum(beforeTag);

			pushError(startTagLineNum, 0, "error", "Can't have a '<%' tag inside a pair of tags");

			//Parse out new lines from tagContents anyway
			parseNewLines(tagContents);

			//Stop parsing the contents if there's a stray start tag
			return false;
		}

		var percentageTagIndex = textHasTag(tagContents, PERCENTAGE_RE);

		if (percentageTagIndex > -1) {
			//Find the line number and column of the percentage tag
			beforeTag = tagContents.substring(0, percentageTagIndex);

			var percentageTagLineNum = getLineNum(beforeTag);
			pushError(percentageTagLineNum, 0, "warning", "Did you mean to put a tag instead of '%'?");
		}

		var remainingContents = tagContents;

		var isPoorlyFormattedFilter = false;
		var isFilter = false;

		//Check if this is an insert
		var isInsert = textStartsWithTag(tagContents, INSERT_RE);

		//If so...
		if (isInsert) {
			//remove the '='
			remainingContents = tagContents.substring(1);

			//Check if the remaining contents is a valid identifier
			//If it's an invalid identifier, jsLinter will catch
			addConsoleLog(remainingContents);
		}
		else {
			//Check if this is a filter
			isFilter = textStartsWithTag(tagContents, FILTER_RE);

			//If so...
			if (isFilter){
				//remove the '-:'
				remainingContents = tagContents.substring(2);

				//check if the remaining contains |
				var filterSplitTagIndex = textHasTag(remainingContents, FILTER_SPLIT_RE);

				//If it does...
				if (filterSplitTagIndex > -1) {
					//split on filter, add console.logs for both sides
					addConsoleLog(remainingContents.substring(0, filterSplitTagIndex));

					remainingContents = remainingContents.substring(filterSplitTagIndex + 1);
					
					//Check if the second part has an argument within it, if so add console.logs for both
					var filterArgTagIndex = textHasTag(remainingContents, FILTER_ARG_RE);

					if (filterArgTagIndex > -1) {
						addConsoleLog(remainingContents.substring(0, filterArgTagIndex));
						addConsoleLog(remainingContents.substring(filterArgTagIndex + 1));
					} else {
						addConsoleLog(remainingContents);
					}

				}
				else {
					//Else throw error for poorly formatted filter
					pushError(lineNum, 0, "error", "Filter statement is missing a '|'.");
				}
			}
			else {
				//Check if it's a poorly formatted filter
				isPoorlyFormattedFilter = textStartsWithTag(tagContents, POORLY_FORMATTED_FILTER_RE);

				//If so, throw a warning on that character asking if they meant to do a filter
				if (isPoorlyFormattedFilter) {
					pushError(lineNum, 0, "warning",
						"Did you mean for this to be a filter? Use '-:' at the start of a tag to use filters");
				}
			}
		}

		//If it was a poorly formatted filter, parseNewLines(tagContents) and return
		if (isPoorlyFormattedFilter) {
			parseNewLines(tagContents);
		}
		else {
			//Update the line number
			lineNum = getLineNum(tagContents);

			//if it's not a filter or insert, assume it's just some plain old javascript
			if (!isFilter && !isInsert) {
				//Add it to parsedJs, count newLines to increment lineNum and return
				parsedJs = parsedJs + tagContents;
			}
		}

		return true;
	};

	var lint = function(originalText) {
		var remainingText = originalText;

		while (remainingText) {
			var startTagIndex = textHasTag(remainingText, START_TAG_RE);
			var endTagIndex, contentsbeforeEndTag, endTagLineNum;

			if (startTagIndex > -1) {
				var preStartTagText = remainingText.substring(0, startTagIndex);

				//Push warnings for any end tags prior to a startTag
				endTagIndex = textHasTag(preStartTagText, END_TAG_RE);
				while (endTagIndex > -1){
					contentsbeforeEndTag = preStartTagText.substring(0, endTagIndex);

					parseNewLines(contentsbeforeEndTag);

					pushError(lineNum, 0, "warning", "End tag is not paired with an open tag.");

					preStartTagText = preStartTagText.substring(endTagIndex + END_TAG_STR.length);
					endTagIndex = textHasTag(preStartTagText, END_TAG_RE);
				}

				//Pull out the text before the startTag and parse it for new lines
				parseNewLines(preStartTagText);

				//Set remainingText to just be the stuff after the non-tag text
				remainingText = remainingText.substring(startTagIndex);
			}

			endTagIndex = textHasTag(remainingText, END_TAG_RE);

			//Case we have an open tag and not a closed tag
			if (startTagIndex > -1 && endTagIndex === -1) {
				//Return an error on the location of the startTag and exit
				pushError(lineNum, 0, "error", "This opening tag is never closed. Please use '%>' to close it");

				break;
			}
			//Case we have both tags
			else if (startTagIndex > -1 && endTagIndex > -1) {
				//Pull out the text between the tags (NOT INCLUDING TAGS)
				var tagContents = remainingText.substring(START_TAG_STR.length, endTagIndex);

				//Set remainingText to be the text following the end tag (NOT INCLUDING END TAG)
				remainingText = remainingText.substring(endTagIndex + END_TAG_STR.length);

				//Send the tagContents to another function to parse
				//If parseTagContents returns false, break
				if (!parseTagContents(tagContents)) {
					break;
				}
			}
			//Case we have a closed tag but not an open tag
			else if (startTagIndex === -1 && endTagIndex > -1) {
				//Push warning if there's an end tag floating around after we're out of start tags
				contentsbeforeEndTag = remainingText.substring(0, endTagIndex);

				endTagLineNum = getLineNum(contentsbeforeEndTag);
				pushError(endTagLineNum, 0, "warning", "End tag is not paired with an open tag.");
				break;
			}
			//Case we have neither tag
			else {
				parseNewLines(remainingText);
				break;
			}
		}
		return { "errors": errors, "parsed": parsedJs };
	};

	return function (sourceText) {
		//Initialize variables to allow for multiple uses w/o re-initializing
		errors = [];
		lineNum = 0;
		parsedJs = "";

		//Returns an object with two fields:
		//	errors: { line: Num, column: num, message: String, errorType : String}
		//	parsed: String (of javascript parsed out)
		return lint(sourceText);
	};
});
