define(function(require, exports, module) {
    "use strict";
    
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
            resourceFound = false,
            variableFound = false,
            localFound = false,
            error = function (m) {
    
    // Call error when something is wrong.
    
                throw {
                    name:    'SyntaxError',
                    message: m,
                    at:      at,
                    text:    text
                };
            },
    
            next = function (c) {
    
    // If a c parameter is provided, verify that it matches the current character.
    
                if (c && c !== ch) {
                    error("Expected '" + c + "' instead of '" + ch + "'");
                }
    
    // Get the next character. When there are no more characters,
    // return the empty string.
    
                ch = text.charAt(at);
                at += 1;
                return ch;
            }, 
            peek = function(c) {
                var char = text.charAt(at);
                if(c && c===char) 
                    return true;
                return false;
            },         
    
            number = function () {
    
    // Parse a number value.
    
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
    
    // Parse a string value.
    
                var hex,
                    i,
                    string = '',
                    uffff;
    
    // When parsing for string values, we must look for " and \ characters.
    
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
                        } else if (ch == "\n" || ch == "\r") {
                            break;
                        } else {
                            string += ch;
                        }
                    }
                }
                error("Bad string");
            },
    
            white = function () {
    
    // Skip whitespace.
    
                while (ch && ch <= ' ') {
                    next();
                }
            },
    
            value,  // Place holder for the value function.
    
            array = function () {
    
    // Parse an array value.
    
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

            scanFor = function () {
                var key = getKey();
                if (key === "for") {
                    var for_name = '';
                    white();
                    if (isLetter(ch)) {
                        while(ch) {
                            if(isWhitespace(ch)) 
                                break;
                            for_name+=ch;
                            next();
                        }
                        if(for_name.length===0) {
                            error("Expected variable name.");
                        }
                        white();
                        next('i');
                        next('n');
                        white();
                        var ident = identifier();
                        white();
                        if(ident.endsWith(':') || ch===':') {
                            white();
                            if(isLetter(ch)) {
                                while(ch) {
                                    if(ch===']' || ch ==='}')
                                        return;
                                    identifier();
                                    white();
                                }
                                return;
                            }
                            else if (ch === '{') {
                                object();
                                return;
                            }
                        }
                    }
                }
            },

            heredoc = function() {
                var heredocStr = '', delimeter = '';

                if(ch==='<') {
                    next('<');
                    next('<');
                    if (ch === '-') {
                        next('-');
                    }
                    while(ch) {
                        if(ch === '\n') {
                            break;
                        }
                        delimeter += ch;
                        next();
                    }
                    if(delimeter.length===0) {
                        error("Delimiter is not specified");
                    }
                    while(ch) {
                        // check for delimiter
                        if(ch==='\n') {
                            heredoc+=ch;
                            var word = '';
                            next('\n');
                            white();
                            while(ch) {
                                if(isWhitespace(ch)) 
                                    break;
                                word+=ch;
                                next();
                            }
                            if(word === delimeter)
                                return heredocStr;
                            else {
                                heredocStr+=word;
                            }
                        }
                        heredocStr+=ch;
                        if(ch === '\n')
                            continue;
                        next();
                    }
                }
            },

            getKey = function () {
                var key = '';
                key+=ch;
                if(isLetter(ch)) {
                    while (next()) {
                        if (isLetter(ch) || isDigit(ch) || ch === '_') {
                            key+=ch;
                        }
                        else if (isWhitespace(ch) || isEOF()) {
                            return key;
                        }
                        else {
                            error("Keys can only contain alphanumeric or _ characters")
                        }
                    }
                }
            },
    
            comment = function () {
                var comment = '';
                if(ch === '/') {
                    next('/');
                    if(ch === '/') {
                        next('/');
                        while(ch) {
                            if(ch==='\n') {
                                next('\n');
                                return comment;
                            }
                            comment+=ch;
                            next();
                        }
                    }
                    else if (ch === '*') {
                        next('*');
                        while (ch) {
                            if (ch=== '*') {
                                next('*');
                                if (ch === '/') {
                                    next('/');
                                    return comment;
                                }
                            }
                            comment+=ch;
                            next();
                        }
                        error("comment not terminated");
                    }
                }
                else if (ch === '#') {
                    next('#');
                    while(ch) {
                        if(ch==='\n') 
                            return comment;
                        comment+=ch;
                        next();
                    }
                }
                else
                    error('Bad comment');
    
            },

            identifier = function () {
                var parenNesting=0, bracketNesting=0, braceNesting = 0;
                var identifier = '';
                if(isLetter(ch)) {
                    while(ch) {
                        if (ch === '(') 
                            parenNesting++;
                        else if (ch === '[')
                            bracketNesting++;
                        else if (ch === '{')
                            braceNesting++;
                        else if (ch === ')' && parenNesting>0) 
                            parenNesting--;
                        else if (ch === ']' && bracketNesting>0)
                            bracketNesting--;
                        else if (ch === '}' && bracketNesting>0)
                            braceNesting--;
                        else if(isComment()) {
                            return identifier;
                        }
                        else if(ch ==='\n' && parenNesting===0 && bracketNesting===0) {
                            return identifier;
                        }
                        identifier+=ch;
                        next();
                    }
                    if(parenNesting>0) {
                        error("Missing paranthesis");
                    }
                    if (bracketNesting>0) {
                        error("Missing bracket");
                    }
                    if (braceNesting>0) {
                        error("Missing curly brace");
                    }
                    if(identifier)
                        return identifier;
                }
                else 
                    error("Identifier should start with a letter");
            },

            object = function () {
    
    // Parse an object value.
    
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
                        if(isFor()) {
                            scanFor();
                        }
                        else if(isLetter(ch)) {
                            key = getKey();
                            if(key === "dynamic") {
                                var dynamic;
                                white();
                                if(ch === '"') {
                                    dynamic = string();
                                    object['dynamic'] = dynamic;
                                }
                                else {
                                    error("Expected dynamic block name but found: "+ch);
                                }
                                if(!object.hasOwnProperty('dynamic') || object['dynamic'].length === 0) {
                                    error("Missing dynamic block name");
                                }
                                white();
                                if (ch === '{') {
                                    object[dynamic] = value();
                                    white();
                                }
                                else {
                                    error("Expected '{'");
                                }
                                continue;
                            }
                            white();
                            if (ch === '=') {
                                next ('=');
                            }
                            else if (ch === '{') 
                                ;
                            else {
                                error('Expected = or {');
                            }
                            object[key] = value();
                            white();
                            if (ch === '}') {
                                next('}');
                                return object;
                            }
                            white();
                        }
                        else if (isComment()) {
                            comment();
                            white();
                        }
                        else if (ch === '}') {
                            next('}');
                            return object;
                        }
                        else {
                            error("Invalid character: "+ch);
                        }
                    }
                }
                error("Bad object");
            },

            resource = function () {
                var key,
                    resource = {},
                    name;
                white();

                if(isLetter(ch)) {
                    key = getKey();
                    if (key!=null) {
                        if (key === 'resource' || key === 'data') {
                            resourceFound = true;
                            white();
                        
                            if(ch === '"') {
                                resource['terraform_res_type'] = string();
                            }
                            if(!resource.hasOwnProperty('terraform_res_type') || resource['terraform_res_type'].length === 0) {
                                error("Missing type");
                            }
                            else {
                                white();
                                if(ch === '"') {
                                    name = string();
                                    resource['terraform_res_name'] = name;
                                }
                            }
                            if (!resource.hasOwnProperty('terraform_res_name') || resource['terraform_res_name'].length === 0) {
                                error("Missing resource/datasource name");
                            }
                            white();
                            if (ch === '{') {
                                resource[name] = object();
                            }
                            else {
                                error("Expected '{'");
                            }
                            if (resource[name])
                                return resource;

                        }
                        else if (key === 'variable' || key === 'output' || key === 'module') {
                            white();
                            if(ch === '"') {
                                name = string();
                                resource['var_name'] = name;
                            }
                            if(!resource.hasOwnProperty('var_name') || resource['var_name'].length === 0) {
                                error("Missing name");
                            }
                            white();
                            if (ch === '{') {
                                resource[name] = object();
                            }
                            else 
                                error("Expected '{'");
                            if (resource[name])
                                return resource;
                        }
                        else if (key === 'locals') {
                            white();
                            if (ch === '{') {
                                resource['local'] = object();
                            }
                            if (resource[name])
                                return resource;
                        }
                        else {
                            white();
                            if (ch === '{') {
                                resource[key] = object();
                            }
                            else if (ch === '=') {
                                next('=');
                                resource[key] = value();
                            }
                            else {
                                error("Expected '{' or '='");
                            }
                            return resource;
                        }
                    }
                    else {
                        error("Syntax error");
                    }
                }
                else if(ch === '/' || ch === '#') {
                    comment();
                }
                else 
                    error("Invalid character: '" + ch +"'. Must start with an alphabet or comment");
            }
    
        value = function () {
    
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    
            white();
            switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            case '#', '/':
                return comment();
            case '<':
                if(peek('<'))
                    return heredoc();
            default:
                if( ch >= '0' && ch <= '9') {
                    return number();
                }
                else if (isFor()) {
                    scanFor();
                }
                else if (isLetter(ch)) {
                    return identifier();
                }
            }
        };

        function isLetter(c) {
            return (/[a-zA-Z]/).test(c) || c === '_';
        }

        function isDigit(c){
            return /\d/.test(c);
        }

        function isWhitespace(c){
            return /\s/.test(c);
        }

        function isEOF() {
            if (at>=text.length) {
                return true;
            }
            return false;
        }
        function isComment() {
            if (ch==='/') {
                if (peek('/') || peek('*')) {
                    return true;
                }
                return false;
            }
            else if(ch==='#') {
                return true;
            }
            return false;
        }

        function isFor() {
            if (ch === 'f' && peek('o') && text.charAt(at+1)==='r' && isWhitespace(text.charAt(at+2)))
                return true;
            return false;
        }

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.
    
        return function (source, reviver) {
            var result, start=0;
    
            text = source;
            at = 0;
            ch = ' ';
            while (ch) {
                result = resource();
                if(at===start)
                    error('Syntax error');
                white();
                if(ch && resourceFound) {
                    error("Invalid character: '"+ch+"'. Only one resource/datasource can be declared");
                }
            }
    
    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.
    
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
    