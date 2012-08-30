/*
 * 
 * Based on json_parse.js
 * Lexer function checks the xml document for errors.
 * 
 * Luis Bustamante <luis.bustamante AT outlook.com>
 * 
 */

define(function(require, exports, module) {
"use strict";



//We are defining the function inside of another function to avoid creating
//global variables.

 var at,     // The index of the current character
     ch,     // The current character
     escapee = {
         '"':  '"',
         '\\': '\\',
         '/':  '/',
         b:    '\b',
         f:    '\f',
         n:    '\n',
         r:    '\r',
         t:    '\t'
     },
     text,

     error = function (m) {

//Call error when something is wrong.

         throw {
             name:    'SyntaxError',
             message: m,
             at:      at,
             text:    text
         };
     },

     next = function (c) {

//If a c parameter is provided, verify that it matches the current character.

         if (c && c !== ch) {
             error("Expected '" + c + "' instead of '" + ch + "'");
         }

//Get the next character. When there are no more characters,
//return the empty string.

         ch = text.charAt(at);
         at += 1;
         return ch;
     },

     number = function () {

//Parse a number value.

         var number,
             string = '';

         if (ch === '-') {
             string = '-';
             next('-');
         }
         while (ch >= '0' && ch <= '9') {
             string += ch;
             next();
         }
         if (ch === '.') {
             string += '.';
             while (next() && ch >= '0' && ch <= '9') {
                 string += ch;
             }
         }
         if (ch === 'e' || ch === 'E') {
             string += ch;
             next();
             if (ch === '-' || ch === '+') {
                 string += ch;
                 next();
             }
             while (ch >= '0' && ch <= '9') {
                 string += ch;
                 next();
             }
         }
         number = +string;
         if (isNaN(number)) {
             error("Bad number");
         } else {
             return number;
         }
     },

     string = function () {

//Parse a string value.

         var hex,
             i,
             string = '',
             uffff;

//When parsing for string values, we must look for " and \ characters.

         if (ch === '"') {
             while (next()) {
                 if (ch === '"') {
                     next();
                     return string;
                 } else if (ch === '\\') {
                     next();
                     if (ch === 'u') {
                         uffff = 0;
                         for (i = 0; i < 4; i += 1) {
                             hex = parseInt(next(), 16);
                             if (!isFinite(hex)) {
                                 break;
                             }
                             uffff = uffff * 16 + hex;
                         }
                         string += String.fromCharCode(uffff);
                     } else if (typeof escapee[ch] === 'string') {
                         string += escapee[ch];
                     } else {
                         break;
                     }
                 } else {
                     string += ch;
                 }
             }
         }
         error("Bad string");
     },

    
     white = function () {

//Skip whitespace.

         while (ch && ch <= ' ') {
             next();
         }
     },

     word = function () {

//true, false, or null.

         switch (ch) {
         case 't':
             next('t');
             next('r');
             next('u');
             next('e');
             return true;
         case 'f':
             next('f');
             next('a');
             next('l');
             next('s');
             next('e');
             return false;
         case 'n':
             next('n');
             next('u');
             next('l');
             next('l');
             return null;
         }
         error("Unexpected '" + ch + "'");
     },

     value,  // Place holder for the value function.

//Parse an array value.

     array = function () {



         var array = [];

         if (ch === '[') {
             next('[');
             white();
             if (ch === ']') {
                 next(']');
                 return array;   // empty array
             }
             while (ch) {
                 array.push(value());
                 white();
                 if (ch === ']') {
                     next(']');
                     return array;
                 }
                 next(',');
                 white();
             }
         }
         error("Bad array");
     },

//Parse a tag attribute
     
     loadAttribute = function (attributes){
     	
     	var key = "";
     	var value = "";
     	
     	
     	while( ch && ch !== '='){
 			if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9") || ":"){
 				key += ch;
 				next();
 			}else{
 				error("Attribute '" + key + "' must be named with alphanumeric characters and must have an assigned value ");
 			}
     	}
     	if(ch === '='){
     		next('=');
     		white();
     		if(ch === '"'){
     			next('"');
     			while(ch && ch !== '"'){
     				value += ch;
     				next();
     			}
             	next('"');
             	if(attributes[key]== undefined){
             		attributes[key] = value;
             	}else{
             		error("Attribute '" + key + "' already exists");
             	}
             	
             	
             	return attributes;
     		}else{
     			error("Expecting correct declaration of value");
     		}
     	}else{
     		error("A value must be assigned to this attribute");
     	}


     	
     },
     

     
//Parse an xml declaration
     
     declarationTag = function() {
     	
     	var attributes = {};
     	var name = "";
 		
 		
 		//see if it is has a xml declaration
 		if(ch === '?'){
 			next('?');
 			
 			white();
 			while(ch && ch !== ' ' && ch !== '?' && ch > ' '){
 				name += ch;
 				next();
 			}
 			
     	
 			white();
     	       	        	
 			while(ch && ch !== '?'){
 				white();
 				 attributes = loadAttribute(attributes);

 				if(ch === '"'){
 					next('"');
 				}
 				white();
 			}
     	
 			next('?');
 			next('>');
     	
 			return attributes;
     	
 		}else{
 			error("Missing or Badformed xml declaration tag");
 		}
     	
     },

//Parse an end tag for the given name
     
     endTag = function(nodeName){
     	var nodeCloseName = "";
     	
     	next('/');
			white();
			while(ch && ch !== ' ' && ch !== '>' && ch !=='\n' && ch !=='\t'){
				nodeCloseName += ch;
				next();
			}
			white();
			//end of the end-tag. Verifies that the name of the tag is same at the beginning and end
			next('>');
			if(nodeCloseName !== nodeName){
				error("Start-tag '" + nodeName + "' does not match the End-tag '" + nodeCloseName + "'")
			}else{
				return nodeCloseName;
			}
     },
     
//the main xml lexer

     xmlLexer = function(){

     	var startTags = [];
     	var tags = [];

			
     	
     	while(ch && ch === '<'){
     		next('<');
     		
     		
     		//a start-tag
     		if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9")){
     			//name of the start-tag
     			var nodeName = "";
     			
     			while(ch && ch !== ' ' && ch !== '>' && ch !== '/' && ch > ' '){
     				nodeName += ch;
     				next();
     			}
     			
     			//store the start-tag
     			startTags.push(nodeName);
     			tags.push(nodeName);
     			
     			white();
     			
     			//load attributes
     			//attributes should not be repeated
     			var attributes = {};
     			
     			while(ch && ch !== '>' && ch !== '/' ){
     				white();
     				attributes = loadAttribute(attributes);
     				white();
     			}
     			
     			//pop if empty-element-tag
     			if(ch === '/'){
     				next('/');
     				next('>');
     				
     				//pop element in the array of childs 
     				startTags.pop();
     				
         			//there should only be text if this is a nested tag
     				if(startTags.length > 0){
         				while(ch && ch !== '<' ){
         					next();
         				}
     				}
     				
     			}else{
     				//just a start-tag
     				next('>');
     				//may contain children nodes
     				white();
					
     				//optional text
     				while(ch && ch !== '<' ){
     					next();
     				}
     			}
     				
     			
     		}else if(ch === '/'){
     		//a end-tag
     			var nodeName;
     			nodeName = startTags.pop();
     			endTag(nodeName);
     			
     			//there should only be text if this is a nested tag
 				if(startTags.length > 0){
     				while(ch && ch !== '<' ){
     					next();
     				}
 				}
     			white();
     			
     			
     		}else if(ch === '!'){
     		//a comment or a CDATA
     			
     			next('!');
     			
     			//a comment
     			if(ch === '-'){
    				
     				next('-');
     				next('-');
 				
     				//ignored the text while waiting for the end of the comment
     				while(ch){
     					if(ch === '-'){
     						next('-');
     						if(ch === '-'){
     							next('-');
     							if(ch == '>'){
     								next('>');
     								break;
     							}
     						}
     					}
     					if(ch === '<'){
     						error("Comment must be finished before starting a new tag");
     					}
     					next();
 				
     				}
     				white();
     			}else if(ch === '['){
     			//CDATA - A CDATA section starts with "<![CDATA[" and ends with "]]>":
     				next('[');
     				next('C');
     				next('D');
     				next('A');
     				next('T');
     				next('A');
     				next('[');
     				
     				//ignored the text while waiting for the end of the CDATA
     				while(ch){
     					if(ch === ']'){
     						next(']');
     						if(ch === ']'){
     							next(']');
     							if(ch == '>'){
     								next('>');
     								break;
     							}else{
     								error("Expecting end of CDATA");
     							}
     						}
     					}
     					if(ch === '<'){
     						error("CDATA must be finished before starting a new tag");
     					}
     					next();
     					
     				}
     				
     			}else if(ch === 'D'){
     				//<!DOCTYPE
     				
     				next('D');
     				next('O');
     				next('C');
     				next('T');
     				next('Y');
     				next('P');
     				next('E');
     				
     				//ignore text until end of DOCTYPE
     				
     				while(ch && ch !== '>'){
     					if(ch === '<'){
     						error("CDATA must be finished before starting a new tag");
     					}
     					next();
     					
     				}
     			}
     			
     		}else if(ch === '?'){
     		//extra declaration
     		
     			declarationTag();
     			white();
     		
     		}else{
     		//not identified
     			error("Expecting tag or comment, but found '" + ch + "'");
     		}
     		
     		
     	}
     	return tags;
     },
     

     

// Parse an object value.
     object = function () {



         var key,
             object = {};

         if (ch === '{') {
             next('{');
             white();
             if (ch === '}') {
                 next('}');
                 return object;   // empty object
             }
             while (ch) {
                 key = string();
                 white();
                 next(':');
                 if (Object.hasOwnProperty.call(object, key)) {
                     error('Duplicate key "' + key + '"');
                 }
                 object[key] = value();
                 white();
                 if (ch === '}') {
                     next('}');
                     return object;
                 }
                 next(',');
                 white();
             }
         }
         error("Bad object");
     };

//Parse a XML value. It could be a tag, an object, an array, a string, a number,
//or a word.

     
 value = function () {


     white();
     switch (ch) {
     case '<':
     	return xmlLexer();
     case '{':
         return object();
     case '[':
         return array();
     case '"':
         return string();
     case '-':
         return number();
     default:
         return ch >= '0' && ch <= '9' ? number() : word();
     }
 };

//Return the xml_lexer function. It will have access to all of the above
//functions and variables.

 return function (source, reviver) {
     var result;

     text = source;
     at = 0;
     ch = ' ';
     result = value();
     white();
     if (ch) {
         error("Syntax error");
     }

//If there is a reviver function, we recursively walk the new structure,
//passing each name/value pair to the reviver function for possible
//transformation, starting with a temporary root object that holds the result
//in an empty key. If there is not a reviver function, we simply return the
//result.

     return typeof reviver === 'function' ? function walk(holder, key) {
         var k, v, value = holder[key];
         if (value && typeof value === 'object') {
             for (k in value) {
                 if (Object.hasOwnProperty.call(value, k)) {
                     v = walk(value, k);
                     if (v !== undefined) {
                         value[k] = v;
                     } else {
                         delete value[k];
                     }
                 }
             }
         }
         return reviver.call(holder, key, value);
     }({'': result}, '') : result;
 };



});