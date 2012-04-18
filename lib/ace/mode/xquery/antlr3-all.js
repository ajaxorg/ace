/*
Copyright (c) 2003-2008 Terence Parr. All rights reserved.
Code licensed under the BSD License:
http://www.antlr.org/license.html

Some parts of the ANTLR class:
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/
/*
Some portions:
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
define(function(require, exports, module){
var NewLazyTokenStream = exports.NewLazyTokenStream = function(tokenSource) {

  this.tokenSource = tokenSource;
  this.tokens = [];
  this.isWsExplicit = false;
  this.p = 0;
  this.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL;
  
  this.LT = function(k) {
    if (k == 0)
      return null;
    if (k < 0)
      return this.readReverseNthGoodToken(-k);

    return this.readNthGoodToken(k);
  };

  this.get = function(i) {
    if (i >= this.tokens.length)
      return org.antlr.runtime.Token.EOF_TOKEN;
    else
      return this.tokens[i];
  };

  this.getTokenSource = function() {
    return this.tokenSource;
  };

  this.toString = function(start, stop) {
     if(start == undefined) {
       return this.toString(0, this.tokens.length - 1);
     } else
     if(start instanceof org.antlr.runtime.Token) {
       return this.toString(start.getTokenIndex(), stop.getTokenIndex());
     } else {
      if (start < 0)
        start = 0;
      if (this.p <= stop) {
        this.readNTokens(stop - this.p + 1);
      }

          var sb = "";
          for (var i = start; i <= stop && i < this.tokens.length; i++) {
              sb += this.tokens[i].getText();
          }
          return sb;
      }
    };

    this.LA = function(i) {
        return this.LT(i).getType();
    };

    this.done = false;

    this.consume = function() {
        if (this.done) {
          return;
        }
        this.p++;
        if (!this.isWsExplicit) {
            this.jumpToFirstValidToken();
        }
    };

    this.getSourceName = function() {
      return this.getTokenSource().getSourceName();
    };

    this.index = function() {
        return this.p;
    };

    this.mark = function() {
        this.lastMarker = this.index();
        return this.lastMarker;
    };

    this.release = function(marker) {
    };

    this.rewind = function(marker) {
      if(arguments.length == 1) {
        this.seek(marker);
      } else {
        this.seek(this.lastMarker);
      }
    };

    this.seek = function(index) {
        this.p = index;
        this.done = false;
    };

    this.size = function() {
        return this.tokens.length;
    };

    this.setTokenSource = function(source) {
        this.tokenSource = source;
        this.setWsExplicit(source.isWsExplicit);
        // un-read the unused tokens
        // they are different for the new source
        if (this.p < this.tokens.length) {
            var rIndex = this.p > 0 ? this.tokens[this.p - 1].getStopIndex() : 0;
            this.tokenSource.rewindToIndex(rIndex + 1);
            for (var i = this.tokens.length - 1; i >= this.p; i--) {
                this.tokens.splice(i, 1);
            }
        }

        // if we ignore WS, jump to next token
        if (!this.isWsExplicit) {
            this.jumpToFirstValidToken();
        }
    };

    this.setWsExplicit = function(explicit) {
        this.isWsExplicit = explicit;
        if (!explicit) {
          this.jumpToFirstValidToken();
        }
    };

    this.readNthGoodToken = function(n) {
        var count = this.tokens.length;
        // number of buffered tokens available
        var avt = count - this.p;
        // i counts good tokens, j counts all tokens
        var i = 1, j = 0;
        var t = null;
        while (i <= n) {
            if (j < avt) // read from buffer
                t = this.tokens[this.p + j];
            else { // read from source
                t = this.tokenSource.nextToken();
                if (t == org.antlr.runtime.Token.EOF_TOKEN) {
                    return t;
                }
                t.setTokenIndex(count++);
                this.tokens.push(t);
            }
            if (this.isWsExplicit || t.getChannel() == this.channel) {
               i++;
            }
            j++;
        }
        return t;
    };

    this.readReverseNthGoodToken = function(n) {
        if (n == 0 || (this.p - n) < 0)
            return null;

        // i counts good tokens, j counts all tokens
        var i = 1, j = 0;
        var t = null;
        while (this.p - 1 - j >= 0) {
            t = this.get(this.p - 1 - j);

            if (this.isWsExplicit || t.getChannel() == this.channel) {
                if (i++ == n)
                    return t;
            }
            j++;
        }
        return null;
    };

    this.readNTokens = function(n) {
        var t = null;
        for (var i = 0; i < n; i++) {
            if (this.tokens.length > this.p + i)
                continue;

            t = this.tokenSource.nextToken();
            if (t == org.antlr.runtime.Token.EOF_TOKEN)
                return;
            
            t.setTokenIndex(this.p + i);
            this.tokens.push(t);
        }
    };

    this.jumpToFirstValidToken = function() {
        var t = this.LT(1);
        if (t != org.antlr.runtime.Token.EOF_TOKEN) {
            this.done = false;
            this.p = t.getTokenIndex();
        }
    }; 
};

// create org.antlr module
if (typeof org == "undefined" || !org) {
    var org = {};
}
if (typeof org.antlr == "undefined" || !org.antlr) {
    /**
     * The org.antlr global namespace object.  If antlr is already defined, the
     * existing antlr object will not be overwritten so that defined
     * namespaces are preserved.
     * @namespace org.antlr
     */
    org.antlr = {};
}

/**
 * The global JavaScript object.
 */
org.antlr.global = (function() {
    return this;
}).call(null);

/**
 * Returns the namespace specified and creates it if it doesn't exist.
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * org.antlr.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @static
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 * @example
 * org.antlr.namespace("org.antlr.property.package");
 */
org.antlr.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=org.antlr.global;

        // ANTLR is implied, so it is ignored if it is included
        for (j=0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

/**
 * org.antlr.env is used to keep track of what is known about the library and
 * the browsing environment
 * @namespace org.antlr.env
 */
org.antlr.env = org.antlr.env || {};

/**
 * JavaScript runtime library code.
 * @name org.antlr.runtime
 * @namespace
 */
/**
 * JavaScript runtime library tree parser code.
 * @name org.antlr.runtime.tree
 * @namespace
 */
org.antlr.namespace("org.antlr.runtime.tree");

/**
 * Provides the language utilites and extensions used by the library
 * @namespace org.antlr.lang
 */
org.antlr.lang = org.antlr.lang || /** @lends org.antlr.lang */ {
    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isArray: function(o) { 
        if (o) {
           var l = org.antlr.lang;
           return l.isNumber(o.length) && l.isFunction(o.splice);
        }
        return false;
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isFunction: function(o) {
        return typeof o === 'function';
    },
        
    /**
     * Determines whether or not the provided object is null
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNull: function(o) {
        return o === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @param {any} o The object being testing
     * @return {boolean} the result
     */  
    isObject: function(o) {
return (o && (typeof o === 'object' || org.antlr.lang.isFunction(o))) || false;
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isString: function(o) {
        return typeof o === 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isUndefined: function(o) {
        return typeof o === 'undefined';
    },
    
    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @private
     */
    _IEEnumFix: function(r, s) {
        if (false) {
            var add=["toString", "valueOf"], i;
            for (i=0;i<add.length;i=i+1) {
                var fname=add[i],f=s[fname];
                if (org.antlr.lang.isFunction(f) && f!=Object.prototype[fname]) {
                    r[fname]=f;
                }
            }
        }
    },
       
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} [overrides]  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error("org.antlr.lang.extend failed, please check that " +
                            "all dependencies are included.");
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i]=overrides[i];
            }

            org.antlr.lang._IEEnumFix(subc.prototype, overrides);
        }
    },
   
    /**
     * Applies all properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or 
     * more methods/properties can be specified (as additional 
     * parameters).  This option will overwrite the property if receiver 
     * has it already.  If true is passed as the third parameter, all 
     * properties will be applied and _will_ overwrite properties in 
     * the receiver.
     *
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  [arguments] zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything
     *        in the supplier will be used unless it would
     *        overwrite an existing property in the receiver. If true
     *        is specified as the third parameter, all properties will
     *        be applied and will overwrite an existing property in
     *        the receiver
     */
    augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("Absorb failed, verify dependencies.");
        }
        var a=arguments, i, p, override=a[2];
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (override || !r[p]) {
                    r[p] = s[p];
                }
            }
            
            org.antlr.lang._IEEnumFix(r, s);
        }
    },
 
    /**
     * Same as org.antlr.lang.augmentObject, except it only applies prototype properties
     * @see org.antlr.lang.augmentObject
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  [arguments] zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything 
     *        in the supplier will be used unless it would overwrite an existing 
     *        property in the receiver.  if true is specified as the third 
     *        parameter, all properties will be applied and will overwrite an 
     *        existing property in the receiver
     */
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        org.antlr.lang.augmentObject.apply(this, a);
    },

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.
     * @param arguments {Object*} the objects to merge
     * @return the new merged object
     */
    merge: function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            org.antlr.lang.augmentObject(o, a[i], true);
        }
        return o;
    },

    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values, 
     * including 0/false/''
     * @param o {any} the item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    isValue: function(o) {
        var l = org.antlr.lang;
return (l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o));
    },

    /** @namespace org.antlr.lang.array Array convenience methods. */
    array: /** @lends org.antlr.lang.array */ {
        /**
         * Retrieve the last element of an array. Throws an error if a is not
         * an array or empty.
         * @param a {Array} the array stack to peek in
         * @return the last element of the array
         */
         peek: function(a) {
            if (!org.antlr.lang.isArray(a)) {
                throw new Error("org.antlr.lang.array.peek: a is not an array.");
            }
            var l = a.length;
            if (l<=0) {
                throw new Error("org.antlr.lang.array.peek: a is empty.");
            }
            return a[l-1];
        }
    }
};
/** The set of fields needed by an abstract recognizer to recognize input
 *  and recover from errors etc...  As a separate state object, it can be
 *  shared among multiple grammars; e.g., when one grammar imports another.
 *
 *  These fields are publically visible but the actual state pointer per
 *  parser is protected.
 */
org.antlr.runtime = {};
org.antlr.runtime.RecognizerSharedState = function() {
    /** Track the set of token types that can follow any rule invocation.
     *  Stack grows upwards.  When it hits the max, it grows 2x in size
     *  and keeps going.
     */
    this.following = [];

    this._fsp = -1;

    /** This is true when we see an error and before having successfully
     *  matched a token.  Prevents generation of more than one error message
     *  per error.
     */
    this.errorRecovery = false;

    /** The index into the input stream where the last error occurred.
     *  This is used to prevent infinite loops where an error is found
     *  but no token is consumed during recovery...another error is found,
     *  ad naseum.  This is a failsafe mechanism to guarantee that at least
     *  one token/tree node is consumed for two errors.
     */
    this.lastErrorIndex = -1;

    /** In lieu of a return value, this indicates that a rule or token
     *  has failed to match.  Reset to false upon valid token match.
     */
    this.failed = false;

    /** Did the recognizer encounter a syntax error?  Track how many. */
    this.syntaxErrors = 0;

    /** If 0, no backtracking is going on.  Safe to exec actions etc...
     *  If >0 then it's the level of backtracking.
     */
    this.backtracking = 0;

    /** An array[size num rules] of Map<Integer,Integer> that tracks
     *  the stop token index for each rule.  ruleMemo[ruleIndex] is
     *  the memoization table for ruleIndex.  For key ruleStartIndex, you
     *  get back the stop token for associated rule or MEMO_RULE_FAILED.
     *
     *  This is only used if rule memoization is on (which it is by default).
     */
    this.ruleMemo = null;


    // LEXER FIELDS (must be in same state object to avoid casting
    //               constantly in generated code and Lexer object) :(


    /** The goal of all lexer rules/methods is to create a token object.
     *  This is an instance variable as multiple rules may collaborate to
     *  create a single token.  nextToken will return this object after
     *  matching lexer rule(s).  If you subclass to allow multiple token
     *  emissions, then set this to the last token to be matched or
     *  something nonnull so that the auto token emit mechanism will not
     *  emit another token.
     */
    this.token = null;

    /** What character index in the stream did the current token start at?
     *  Needed, for example, to get the text for current token.  Set at
     *  the start of nextToken.
     */
    this.tokenStartCharIndex = -1;

    /** The line on which the first character of the token resides */
    // this.tokenStartLine;

    /** The character position of first character within the line */
    // this.tokenStartCharPositionInLine;

    /** The channel number for the current token */
    // this.channel;

    /** The token type for the current token */
    // this.type;

    /** You can set the text for the current token to override what is in
     *  the input char buffer.  Use setText() or can set this instance var.
     */
    this.text = null;
};
org.antlr.runtime.IndexOutOfBoundsException = function(m) {
    org.antlr.runtime.IndexOutOfBoundsException.superclass.constructor.call(this, m);
};

org.antlr.lang.extend(org.antlr.runtime.IndexOutOfBoundsException, Error, {
    name: "org.antlr.runtime.IndexOutOfBoundsException"
});
/** The root of the ANTLR exception hierarchy.
 *
 *  <p>To avoid English-only error messages and to generally make things
 *  as flexible as possible, these exceptions are not created with strings,
 *  but rather the information necessary to generate an error.  Then
 *  the various reporting methods in Parser and Lexer can be overridden
 *  to generate a localized error message.  For example, MismatchedToken
 *  exceptions are built with the expected token type.
 *  So, don't expect getMessage() to return anything.</p>
 *
 *  <p>ANTLR generates code that throws exceptions upon recognition error and
 *  also generates code to catch these exceptions in each rule.  If you
 *  want to quit upon first error, you can turn off the automatic error
 *  handling mechanism using rulecatch action, but you still need to
 *  override methods mismatch and recoverFromMismatchSet.</p>
 *
 *  <p>In general, the recognition exceptions can track where in a grammar a
 *  problem occurred and/or what was the expected input.  While the parser
 *  knows its state (such as current input symbol and line info) that
 *  state can change before the exception is reported so current token index
 *  is computed and stored at exception time.  From this info, you can
 *  perhaps print an entire line of input not just a single token, for example.
 *  Better to just say the recognizer had a problem and then let the parser
 *  figure out a fancy report.</p>
 *
 *  @class
 *  @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.tree.TreeNodeStream|org.antlr.runtime.ANTLRStringStream} input input stream that has an exception.
 *  @extends Error
 *
 */
org.antlr.runtime.RecognitionException = function(input) {
    org.antlr.runtime.RecognitionException.superclass.constructor.call(this);
    this.input = input;
    this.index = input.index();
    if ( input instanceof NewLazyTokenStream ) {//org.antlr.runtime.CommonTokenStream ) {
        this.token = input.LT(1);
        this.line = this.token.getLine();
        this.charPositionInLine = this.token.getCharPositionInLine();
    }
    if ( input instanceof org.antlr.runtime.tree.TreeNodeStream ) {
        this.extractInformationFromTreeNodeStream(input);
    }
    else if ( input instanceof org.antlr.runtime.ANTLRStringStream ) {
        // Note: removed CharStream from hierarchy in JS port so checking for
        // StringStream instead
        this.c = input.LA(1);
        this.line = input.getLine();
        this.charPositionInLine = input.getCharPositionInLine();
    }
    else {
        this.c = input.LA(1);
    }

    this.message = this.toString();
};

org.antlr.lang.extend(org.antlr.runtime.RecognitionException, Error,
/** @lends org.antlr.runtime.RecognitionException.prototype */
{
	/**
     * What input stream did the error occur in?
     */
    input: null,

    /** What is index of token/char were we looking at when the error occurred?
     *  @type Number
     */
	index: null,

	/** The current Token when an error occurred.  Since not all streams
	 *  can retrieve the ith Token, we have to track the Token object.
	 *  For parsers.  Even when it's a tree parser, token might be set.
     *  @type org.antlr.runtime.CommonToken
	 */
	token: null,

	/** If this is a tree parser exception, node is set to the node with
	 *  the problem.
     *  @type Object
	 */
	node: null,

	/** The current char when an error occurred. For lexers.
     *  @type Number
     */
	c: null,

	/** Track the line at which the error occurred in case this is
	 *  generated from a lexer.  We need to track this since the
	 *  unexpected char doesn't carry the line info.
     *  @type Number
	 */
	line: null,

    /** The exception's class name.
     *  @type String
     */
    name: "org.antlr.runtime.RecognitionException",

    /** Position in the line where exception occurred.
     *  @type Number
     */
	charPositionInLine: null,

	/** If you are parsing a tree node stream, you will encounter som
	 *  imaginary nodes w/o line/col info.  We now search backwards looking
	 *  for most recent token with line/col info, but notify getErrorHeader()
	 *  that info is approximate.
     *  @type Boolean
	 */
	approximateLineInfo: null,

    /** Gather exception information from input stream.
     *  @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.tree.TreeNodeStream|org.antlr.runtime.ANTLRStringStream} input input stream that has an exception.
     */
	extractInformationFromTreeNodeStream: function(input) {
		var nodes = input,
            priorNode,
            priorPayLoad,
            type,
            text,
            i;

		this.node = nodes.LT(1);
		var adaptor = nodes.getTreeAdaptor(),
		    payload = adaptor.getToken(this.node);
		if ( payload ) {
			this.token = payload;
			if ( payload.getLine()<= 0 ) {
				// imaginary node; no line/pos info; scan backwards
				i = -1;
				priorNode = nodes.LT(i);
				while ( priorNode ) {
					priorPayload = adaptor.getToken(priorNode);
					if ( priorPayload && priorPayload.getLine()>0 ) {
						// we found the most recent real line / pos info
						this.line = priorPayload.getLine();
						this.charPositionInLine = priorPayload.getCharPositionInLine();
						this.approximateLineInfo = true;
						break;
					}
					--i;
					priorNode = nodes.LT(i);
				}
			}
			else { // node created from real token
				this.line = payload.getLine();
				this.charPositionInLine = payload.getCharPositionInLine();
			}
		}
		else if ( this.node instanceof org.antlr.runtime.tree.CommonTree) {
			this.line = this.node.getLine();
			this.charPositionInLine = this.node.getCharPositionInLine();
			if ( this.node instanceof org.antlr.runtime.tree.CommonTree) {
				this.token = this.node.token;
			}
		}
		else {
			type = adaptor.getType(this.node);
			text = adaptor.getText(this.node);
			this.token = new org.antlr.runtime.CommonToken(type, text);
		}
	},

	/** Return the token type or char of the unexpected input element
     *  @return {Number} type of the unexpected input element.
     */
    getUnexpectedType: function() {
		if ( this.input instanceof NewLazyTokenStream) {//org.antlr.runtime.CommonTokenStream ) {
			return this.token.getType();
		}
		else if ( this.input instanceof org.antlr.runtime.tree.TreeNodeStream ) {
			var nodes = this.input;
			var adaptor = nodes.getTreeAdaptor();
			return adaptor.getType(this.node);
		}
		else {
			return this.c;
		}
	}
});
org.antlr.runtime.MismatchedTokenException = function(expecting, input) {
    if (arguments.length===0) {
        this.expecting = org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
    } else {
        org.antlr.runtime.MismatchedTokenException.superclass.constructor.call(
                this, input);
        this.expecting = expecting;
    }
};

org.antlr.lang.extend(
    org.antlr.runtime.MismatchedTokenException,
    org.antlr.runtime.RecognitionException, {
    toString: function() {
        return "MismatchedTokenException(" +
                this.getUnexpectedType() + "!=" + this.expecting + ")";
    },
    name: "org.antlr.runtime.MismatchedTokenException"
});
/** An extra token while parsing a TokenStream */
org.antlr.runtime.UnwantedTokenException = function(expecting, input) {
    if (arguments.length>0) {
        org.antlr.runtime.UnwantedTokenException.superclass.constructor.call(
                this, expecting, input);
    }
};

org.antlr.lang.extend(
    org.antlr.runtime.UnwantedTokenException,
    org.antlr.runtime.MismatchedTokenException, {
    getUnexpectedToken: function() {
        return this.token;
    },
    toString: function() {
        var exp = ", expected "+this.expecting;
        if ( this.expecting===org.antlr.runtime.Token.INVALID_TOKEN_TYPE ) {
            exp = "";
        }
        if ( !org.antlr.lang.isValue(this.token) ) {
            return "UnwantedTokenException(found="+exp+")";
        }
        return "UnwantedTokenException(found="+this.token.getText()+exp+")";
    },
    name: "org.antlr.runtime.UnwantedTokenException"
});
org.antlr.runtime.MissingTokenException = function(expecting, input, inserted) {
    if (arguments.length>0) {
        org.antlr.runtime.MissingTokenException.superclass.constructor.call(
                this, expecting, input);
        this.inserted = inserted;
    }
};

org.antlr.lang.extend(
    org.antlr.runtime.MissingTokenException,
    org.antlr.runtime.MismatchedTokenException, {
    getMissingType: function() {
        return this.expecting;
    },

    toString: function() {
        if (org.antlr.lang.isValue(this.inserted) &&
            org.antlr.lang.isValue(this.token))
        {
            return "MissingTokenException(inserted "+this.inserted+" at "+this.token.getText()+")";
        }
        if ( org.antlr.lang.isValue(this.token) ) {
            return "MissingTokenException(at "+this.token.getText()+")";
        }
        return "MissingTokenException";
    },
    name: "org.antlr.runtime.MissingTokenException"
});
org.antlr.runtime.NoViableAltException = function(grammarDecisionDescription,
                                            decisionNumber,
                                            stateNumber,
                                            input)
{
    org.antlr.runtime.NoViableAltException.superclass.constructor.call(this, input);
    this.grammarDecisionDescription = grammarDecisionDescription;
    this.decisionNumber = decisionNumber;
    this.stateNumber = stateNumber;
};

org.antlr.lang.extend(
    org.antlr.runtime.NoViableAltException,
    org.antlr.runtime.RecognitionException, {
    toString: function() {
        if ( this.input instanceof org.antlr.runtime.ANTLRStringStream ) {
            return "NoViableAltException('"+this.getUnexpectedType()+"'@["+this.grammarDecisionDescription+"])";
        }
        else {
            return "NoViableAltException("+this.getUnexpectedType()+"@["+this.grammarDecisionDescription+"])";
        }
    },
    name: "org.antlr.runtime.NoViableAltException"
});
/** The recognizer did not match anything for a ()+ loop.
 *
 *  @class
 *  @param {Number} decisionNumber
 *  @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.tree.TreeNodeStream|org.antlr.runtime.ANTLRStringStream} input input stream that has an exception.
 *  @extends org.antlr.runtime.RecognitionException
 */
org.antlr.runtime.EarlyExitException = function(decisionNumber, input) {
    org.antlr.runtime.EarlyExitException.superclass.constructor.call(
            this, input);
    this.decisionNumber = decisionNumber;
};

org.antlr.lang.extend(
    org.antlr.runtime.EarlyExitException,
    org.antlr.runtime.RecognitionException,
/** @lends org.antlr.runtime.EarlyExitException.prototype */
{
    /** Name of this class.
     *  @type String
     */
    name: "org.antlr.runtime.EarlyExitException"
});
org.antlr.runtime.MismatchedSetException = function(expecting, input) {
    org.antlr.runtime.MismatchedSetException.superclass.constructor.call(
            this, input);
    this.expecting = expecting;
};

org.antlr.lang.extend(
    org.antlr.runtime.MismatchedSetException,
    org.antlr.runtime.RecognitionException, {
    toString: function() {
        return "MismatchedSetException(" +
                this.getUnexpectedType() + "!=" + this.expecting + ")";
    },
    name: "org.antlr.runtime.MismatchedSetException"
});
org.antlr.runtime.MismatchedNotSetException = function(expecting, input) {
    org.antlr.runtime.MismatchedNotSetException.superclass.constructor.call(this, expecting, input);
};

org.antlr.lang.extend(
    org.antlr.runtime.MismatchedNotSetException,
    org.antlr.runtime.MismatchedSetException, {
    toString: function() {
        return "MismatchedNotSetException(" +
                this.getUnexpectedType() + "!=" + this.expecting + ")";
    },
    name: "org.antlr.runtime.MismatchedNotSetException"
});
org.antlr.runtime.MismatchedRangeException = function(a, b, input) {
    if (arguments.length===0) {
        return this;
    }

    org.antlr.runtime.MismatchedRangeException.superclass.constructor.call(
            this, input);
    this.a = a;
    this.b = b;
};

org.antlr.lang.extend(
    org.antlr.runtime.MismatchedRangeException,
    org.antlr.runtime.RecognitionException, {
    toString: function() {
        return "MismatchedRangeException(" +
                this.getUnexpectedType()+" not in ["+this.a+","+this.b+"])";
    },
    name: "org.antlr.runtime.MismatchedRangeException"
});
/** A semantic predicate failed during validation.  Validation of predicates
 *  occurs when normally parsing the alternative just like matching a token.
 *  Disambiguating predicate evaluation occurs when we hoist a predicate into
 *  a prediction decision.
 *
 *  @class
 *  @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.tree.TreeNodeStream|org.antlr.runtime.ANTLRStringStream} input input stream that has an exception.
 *  @param {String} ruleName name of the rule in which the exception occurred.
 *  @param {String} predicateText the predicate that failed.
 *  @extends org.antlr.runtime.RecognitionException
 */
org.antlr.runtime.FailedPredicateException = function(input, ruleName, predicateText){
    org.antlr.runtime.FailedPredicateException.superclass.constructor.call(this, input);
    this.ruleName = ruleName;
    this.predicateText = predicateText;
};

org.antlr.lang.extend(
    org.antlr.runtime.FailedPredicateException,
    org.antlr.runtime.RecognitionException,
/** @lends org.antlr.runtime.FailedPredicateException.prototype */
{
    /** Create a string representation of this exception.
     *  @returns {String}
     */ 
    toString: function() {
        return "FailedPredicateException("+this.ruleName+",{"+this.predicateText+"}?)";
    },

    /** Name of this class.
     *  @type String
     */
    name: "org.antlr.runtime.FailedPredicateException"
});
/**
 * A BitSet similar to java.util.BitSet.
 *
 * <p>JavaScript Note: There is no good way to implement something like this in 
 * JavaScript.  JS has no true int type, arrays are usually implemented as
 * hashes, etc.  This class should probably be nixed for something that is
 * similarly (in)efficient, but more clear.</p>
 *
 * @class
 * @param {Number|Array} [bits] a 32 bit number or array of 32 bit numbers
 *                              representing the bitset.  These are typically
 *                              generated by the ANTLR Tool.
 */
org.antlr.runtime.BitSet = function(bits) {
    if (!bits) {
        bits = org.antlr.runtime.BitSet.BITS;
    }

    if (org.antlr.lang.isArray(bits)) {
        /**
         * An array of Numbers representing the BitSet.
         * @type Array
         */
        this.bits = bits;
    } else if(org.antlr.lang.isNumber(bits)) {
        this.bits = [];
    }
};

org.antlr.lang.augmentObject(org.antlr.runtime.BitSet, {
    /**
     * Number of bits in each number.
     * @constant
     * @memberOf org.antlr.runtime.BitSet
     */
    BITS: 32,

    /**
     * Log (base 2) of the number of bits in each number.
     * @constant
     * @memberOf org.antlr.runtime.BitSet
     */
    LOG_BITS: 5,  // 2^5 == 32 

    /**
     * We will often need to do a mod operator (i mod nbits).  Its
     * turns out that, for powers of two, this mod operation is
     * same as (i & (nbits-1)).  Since mod is slow, we use a
     * precomputed mod mask to do the mod instead.
     * @constant
     * @memberOf org.antlr.runtime.BitSet
     */
    MOD_MASK: 31, // BITS - 1

    /**
     * Create mask for bit modded to fit in a single word.
     * @example
     * bitmask(35) => 00000000000000000000000000000100
     * bitmask(3)  => 00000000000000000000000000000100
     * @param {Number} bitNumber the bit to create a mask for.
     * @returns {Number} the bitmask.
     * @memberOf org.antlr.runtime.BitSet
     * @private
     */
    bitMask: function(bitNumber) {
        var bitPosition = bitNumber & org.antlr.runtime.BitSet.MOD_MASK;
        return 1 << bitPosition;
    },

    /**
     * Calculate the minimum number of bits needed to represent el.
     * @param {Number} el a number to be included in the BitSet.
     * @returns {Number} the number of bits need to create a BitSet with member
     *                   el.
     * @memberOf org.antlr.runtime.BitSet
     * @private
     */
    numWordsToHold: function(el) {
        return (el >> org.antlr.runtime.BitSet.LOG_BITS) + 1;
    },

    /**
     * @param {Number} bit a number to be included in the BitSet
     * @returns {Number} the index of the word in the field bits that would
     *                   hold bit.
     * @memberOf org.antlr.runtime.BitSet
     * @private
     */
    wordNumber: function(bit) {
        return bit >> org.antlr.runtime.BitSet.LOG_BITS; // bit / BITS
    },

    /**
     * BitSet factory method.
     * 
     * <p>Operates in a number of modes:
     * <ul>
     * <li>If el is a number create the BitSet containing that number.</li>
     * <li>If el is an array create the BitSet containing each number in the
     * array.</li>
     * <li>If el is a BitSet return el.</li>
     * <li>If el is an Object create the BitSet containing each numeric value
     * in el.</li>
     * <li>If el is a number and el2 is a number return a BitSet containing
     * the numbers between el and el2 (inclusive).</li>
     * </ul>
     * </p>
     * @param {Number|Array|org.antlr.runtime.BitSet|Object} el
     * @param {Number} el2
     * @returns {org.antlr.runtime.BitSet}
     * @memberOf org.antlr.runtime.BitSet
     */
    of: function(el, el2) {
        var i, n, s, keys;

        if (org.antlr.lang.isNumber(el)) {
            if (org.antlr.lang.isNumber(el2)) {
                s = new org.antlr.runtime.BitSet(el2 + 1);
                for (i = el; i <= el2; i++) {
                    n = org.antlr.runtime.BitSet.wordNumber(i);
                    s.bits[n] |= org.antlr.runtime.BitSet.bitMask(i);
                }
                return s;
            } else {
                s = new org.antlr.runtime.BitSet(el + 1);
                s.add(el);
                return s;
            }
        } else if(org.antlr.lang.isArray(el)) {
            s = new org.antlr.runtime.BitSet();
            for (i=el.length-1; i>=0; i--) {
                s.add(el[i]);
            }
            return s;
        } else if (el instanceof org.antlr.runtime.BitSet) {
            if (!el) {
                return null;
            }
            return el;
        } else if (el instanceof org.antlr.runtime.IntervalSet) {
            if (!el) {
                return null;
            }
            s = new org.antlr.runtime.BitSet();
            s.addAll(el);
            return s;
        } else if (org.antlr.lang.isObject(el)) {
            keys = [];
            for (i in el) {
                if (org.antlr.lang.isNumber(i)) {
                    keys.push(i);
                }
            }
            return org.antlr.runtime.BitSet.of(keys);
        }
    }
});



org.antlr.runtime.BitSet.prototype = {
    /**
     * Add el into this set.
     * @param {Number} el the number to add to the set.
     */
    add: function(el) {
        var n = org.antlr.runtime.BitSet.wordNumber(el);
        if (n >= this.bits.length) {
            this.growToInclude(el);
        }
        this.bits[n] |= org.antlr.runtime.BitSet.bitMask(el);
    },

    /**
     * Add multiple elements into this set.
     * @param {Array|org.antlr.runtime.BitSet} elements the elements to be added to
     *                                           this set.
     */
    addAll: function(elements) {
        var other,
            i,
            e;

        if ( elements instanceof org.antlr.runtime.BitSet ) {
            this.orInPlace(elements);
        }
		else if ( elements instanceof org.antlr.runtime.IntervalSet ) {
			other = elements;
			// walk set and add each interval
            /* @todo after implementing intervalset
			for (Iterator iter = other.intervals.iterator(); iter.hasNext();) {
				Interval I = (Interval) iter.next();
				this.orInPlace(BitSet.range(I.a,I.b));
			}*/
		} else if (org.antlr.lang.isArray(elements)) {
    		for (i = 0; i < elements.length; i++) {
	    		e = elements[i];
		    	this.add(e);
    		}
        } else {
            return;
        }
	},

    /**
     * Clone this BitSet and then {@link #andInPlace} with a.
     * @param {org.antlr.runtime.BitSet} a a bit set.
     * @returns {org.antlr.runtime.BitSet}
     */
    and: function(a) {
        var s = this.clone();
        s.andInPlace(a);
        return s;
    },

    /**
     * Perform a logical AND of this target BitSet with the argument BitSet.
     *
     * This bit set is modified so that each bit in it has the value true if 
     * and only if it both initially had the value true and the corresponding 
     * bit in the bit set argument also had the value true. 
     * @param {org.antlr.runtime.BitSet} a a bit set.
     * @returns {org.antlr.runtime.BitSet}
     */
    andInPlace: function(a) {
        var min = Math.min(this.bits.length, a.bits.length),
            i;
        for (i = min - 1; i >= 0; i--) {
            this.bits[i] &= a.bits[i];
        }
        // clear all bits in this not present in a (if this bigger than a).
        for (i = min; i < this.bits.length; i++) {
            this.bits[i] = 0;
        }
    },

    /**
     * Clear all bits or a specific bit.
     *
     * If no arguments given, sets all of the bits in this BitSet to false.
     * If one argument given, sets the bit specified by the index to false.
     * @param {Number} [el] the index of the bit to be cleared.
     */
    clear: function(el) {
        if (arguments.length===0) {
            var i;
            for (i = this.bits.length - 1; i >= 0; i--) {
                this.bits[i] = 0;
            }
            return;
        }

        var n = org.antlr.runtime.BitSet.wordNumber(el);
        if (n >= this.bits.length) {	// grow as necessary to accommodate
            this.growToInclude(el);
        }
        this.bits[n] &= ~org.antlr.runtime.BitSet.bitMask(el);
    },

    /**
     * Cloning this BitSet produces a new BitSet  that is equal to it. 
     *
     * The clone of the bit set is another bit set that has exactly the same
     * bit set to true as this bit set. 
     * @returns {org.antlr.runtime.BitSet} a clone of this BitSet.
     */
    clone: function() {
        var i, len, b=[];
        for (i=0, len=this.bits.length; i<len; i++) {
            b[i] = this.bits[i];
        }
        return new org.antlr.runtime.BitSet(b);
    },

    /**
     * Returns the number of bits of space actually in use by this BitSet to 
     * represent bit values.
     *
     * The maximum element in the set is the size - 1st element. 
     * @returns {Number} the number of bits currently in this bit set.
     */
    size: function() {
        var deg = 0, i, word, bit;
        for (i = this.bits.length - 1; i >= 0; i--) {
            word = this.bits[i];
            if (word !== 0) {
                for (bit = org.antlr.runtime.BitSet.BITS - 1; bit >= 0; bit--) {
                    if ((word & (1 << bit)) !== 0) {
                        deg++;
                    }
                }
            }
        }
        return deg;
    },

    /**
     * Compares this object against the specified object.
     *
     * The result is true if and only if the argument is not null and is a
     * BitSet object that has exactly the same set of bits set to true as
     * this bit set. That is, for every nonnegative int index k,
     * <pre><code>
     * ((BitSet)obj).get(k) == this.get(k)
     * </code></pre>
     * must be true. The current sizes of the two bit sets are not compared.
     * @param {Object} other the object to compare with.
     * @returns {Boolean} if the objects are the same; false otherwise.
     */
    equals: function(other) {
        if ( !other || !(other instanceof org.antlr.runtime.BitSet) ) {
            return false;
        }

        var otherSet = other,
            i,
            n = Math.min(this.bits.length, otherSet.bits.length);

        // for any bits in common, compare
        for (i=0; i<n; i++) {
            if (this.bits[i] != otherSet.bits[i]) {
                return false;
            }
        }

        // make sure any extra bits are off

        if (this.bits.length > n) {
            for (i = n+1; i<this.bits.length; i++) {
                if (this.bits[i] !== 0) {
                    return false;
                }
            }
        }
        else if (otherSet.bits.length > n) {
            for (i = n+1; i<otherSet.bits.length; i++) {
                if (otherSet.bits[i] !== 0) {
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Grows the set to a larger number of bits.
     * @param {Number} bit element that must fit in set
     * @private
     */
    growToInclude: function(bit) {
        var newSize = Math.max(this.bits.length << 1, org.antlr.runtime.BitSet.numWordsToHold(bit)),
            newbits = [], //new Array(newSize),
            i;
        for (i=0, len=this.bits.length; i<len; i++) {
            newbits[i] = this.bits[i];
        }
        this.bits = newbits;
    },

    /**
     * Returns the value of the bit with the specified index.
     *
     * The value is true if the bit with the index el is currently set 
     * in this BitSet; otherwise, the result is false.
     * @param {Number} el the bit index.
     * @returns {Boolean} the value of the bit with the specified index.
     */
    member: function(el) {
        var n = org.antlr.runtime.BitSet.wordNumber(el);
        if (n >= this.bits.length) { return false; }
        return (this.bits[n] & org.antlr.runtime.BitSet.bitMask(el)) !== 0;
    },

    /**
     * Returns the index of the first bit that is set to true.
     * If no such bit exists then -1 is returned.
     * @returns {Number} the index of the next set bit.
     */
    getSingleElement: function() {
        var i;
        for (i = 0; i < (this.bits.length << org.antlr.runtime.BitSet.LOG_BITS); i++) {
            if (this.member(i)) {
                return i;
            }
        }
        return -1; //Label.INVALID;
    },

    /**
     * Returns true if this BitSet contains no bits that are set to true.
     * @returns {Boolean} boolean indicating whether this BitSet is empty.
     */
    isNil: function() {
        var i;
        for (i = this.bits.length - 1; i >= 0; i--) {
            if (this.bits[i] !== 0) {
                return false;
            }
        }
        return true;
    },

    /**
     * If a bit set argument is passed performs a {@link #subtract} of this bit
     * set with the argument bit set.  If no argument is passed, clone this bit
     * set and {@link #notInPlace}.
     * @param {org.antlr.runtime.BitSet} [set]
     * @returns {org.antlr.runtime.BitSet}
     */
    complement: function(set) {
        if (set) {
            return set.subtract(this);
        } else {
            var s = this.clone();
            s.notInPlace();
            return s;
        }
    },

    /**
     * If no arguments are passed sets all bits to the complement of their
     * current values.  If one argument is passed sets each bit from the
     * beginning of the bit set to index1 (inclusive) to the complement of its
     * current value.  If two arguments are passed sets each bit from the
     * specified index1 (inclusive) to the sepcified index2 (inclusive) to the
     * complement of its current value.
     * @param {Number} index1
     * @param {Number} index2
     */
    notInPlace: function() {
        var minBit, maxBit, i, n;
        if (arguments.length===0) {
            for (i = this.bits.length - 1; i >= 0; i--) {
                this.bits[i] = ~this.bits[i];
            }
        } else {
            if (arguments.length===1) {
                minBit = 0;
                maxBit = arguments[0];
            } else {
                minBit = arguments[0];
                maxBit = arguments[1];
            }
            // make sure that we have room for maxBit
            this.growToInclude(maxBit);
            for (i = minBit; i <= maxBit; i++) {
                n = org.antlr.runtime.BitSet.wordNumber(i);
                this.bits[n] ^= org.antlr.runtime.BitSet.bitMask(i);
            }
        }

    },

    /**
     * Performs a logical OR of this bit set with the bit set argument.
     * If no argument is passed, return this bit set.  Otherwise a clone of
     * this bit set is modified so that a bit in it has the value true if and
     * only if it either already had the value true or the corresponding bit
     * in the bit set argument has the value true.
     * @param {org.antlr.runtime.BitSet} [a] a bit set.
     * @returns {org.antlr.runtime.BitSet}
     */
    or: function(a) {
		if ( !a ) {
			return this;
		}
        var s = this.clone();
        s.orInPlace(a);
        return s;
    },

    /**
     * Performs a logical {@link #or} in place.
     * @param {org.antlr.runtime.BitSet} [a]
     * @returns {org.antlr.runtime.BitSet}
     */
    orInPlace: function(a) {
		if ( !a ) {
			return;
		}
        // If this is smaller than a, grow this first
        if (a.bits.length > this.bits.length) {
            this.setSize(a.bits.length);
        }
        var min = Math.min(this.bits.length, a.bits.length),
            i;
        for (i = min - 1; i >= 0; i--) {
            this.bits[i] |= a.bits[i];
        }
    },

    /**
     * Sets the bit specified by the index to false.
     * @param {Number} bitIndex the index of the bit to be cleared.
     */
    remove: function(el) {
        var n = org.antlr.runtime.BitSet.wordNumber(el);
        if (n >= this.bits.length) {
            this.growToInclude(el);
        }
        this.bits[n] &= ~org.antlr.runtime.BitSet.bitMask(el);
    },

    /**
     * Grows the internal bits array to include at least nwords numbers.
     * @private
     * @param {Number} nwords how many words the new set should be
     * @private
     */
    setSize: function(nwords) {
        var n = nwords - this.bits.length;
        while (n>=0) {
            this.bits.push(0);
            n--;
        }
    },

    /**
     * Returns the number of bits capable of being represented by this bit set
     * given its current size.
     * @returns {Number} the maximum number of bits that can be represented at
     *                   the moment.
     * @private
     */
    numBits: function() {
        return this.bits.length << org.antlr.runtime.BitSet.LOG_BITS; // num words * bits per word
    },

    /**
     * Return how much space is being used by the bits array not
     * how many actually have member bits on.
     * @returns {Number} the length of the internal bits array.
     * @private
     */
    lengthInLongWords: function() {
        return this.bits.length;
    },

    /**
     * Is this bit set contained within a?
     * @param {org.antlr.runtime.BitSet} a bit set
     * @returns {Boolean} true if and only if a is a subset of this bit set.
     */
    subset: function(a) {
        if (!a) { return false; }
        return this.and(a).equals(this);
    },

    /**
     * Subtract the elements of the argument bit set from this bit set in place.
     * That is, for each set bit in the argument bit set, set the corresponding
     * bit in this bit set to false.
     * @param {org.antlr.runtime.BitSet} a bit set.
     */
    subtractInPlace: function(a) {
        if (!a) { return; }
        // for all words of 'a', turn off corresponding bits of 'this'
        var i;
        for (i = 0; i < this.bits.length && i < a.bits.length; i++) {
            this.bits[i] &= ~a.bits[i];
        }
    },

    /**
     * Perform a {@link #subtractInPlace} on a clone of this bit set.
     * @param {org.antlr.runtime.BitSet} a bit set.
     * @returns {org.antlr.runtime.BitSet} the new bit set.
     */
    subtract: function(a) {
        if (!a || !(a instanceof org.antlr.runtime.BitSet)) { return null; }

        var s = this.clone();
        s.subtractInPlace(a);
        return s;
    },

    /* antlr-java needs this to make its class hierarchy happy . . .
    toList: function() {
		throw new Error("BitSet.toList() unimplemented");
	},
    */

    /**
     * Creates an array of the indexes of each bit set in this bit set.
     * @returns {Array}
     */
    toArray: function() {
        var elems = [], //new Array(this.size()),
            i,
            en = 0;
        for (i = 0; i < (this.bits.length << org.antlr.runtime.BitSet.LOG_BITS); i++) {
            if (this.member(i)) {
                elems[en++] = i;
            }
        }
        return elems;
    },

    /**
     * Returns the internal representation of this bit set.
     * This representation is an array of numbers, each representing 32 bits.
     * @returns {Array}
     */
    toPackedArray: function() {
        return this.bits;
    },

    /**
     * Returns a string representation of this bit set.
     * <p>For every index for which this BitSet contains a bit in the set state,
     * the decimal representation of that index is included in the result.
     * Such indices are listed in order from lowest to highest, separated by
     * ", " (a comma and a space) and surrounded by braces, resulting in the
     * usual mathematical notation for a set of integers.</p>
     * 
     * <p>If a grammar g is passed, print g.getTokenDisplayName(i) for each set
     * index instead of the numerical index.</p>
     *
     * <>If two arguments are passed, the first will be used as a custom
     * separator string.  The second argument is an array whose i-th element
     * will be added if the corresponding bit is set.</p>
     *
     * @param {Object|String} [arg1] an Object with function property
     *      getTokenDispalyName or a String that will be used as a list
     *      separator.
     * @param {Array} [vocabulary] array from which the i-th value will be
     *      drawn if the corresponding bit is set.  Must pass a string as the
     *      first argument if using this option.
     * @return A commma-separated list of values
     */
    toString: function() {
        if (arguments.length===0) {
            return this.toString1(null);
        } else {
            if (org.antlr.lang.isString(arguments[0])) {
                if (!org.antlr.lang.isValue(arguments[1])) {
                    return this.toString1(null);
                } else {
                    return this.toString2(arguments[0], arguments[1]);
                }
            } else {
                return this.toString1(arguments[0]);
            }
        }
    },

    /**
     * Transform a bit set into a string by formatting each element as an
     * integer separator The string to put in between elements
     * @private
     * @return A commma-separated list of values
     */
    toString1: function(g) {
        var buf = "{",
            separator = ",",
            i,
		    havePrintedAnElement = false;

        for (i = 0; i < (this.bits.length << org.antlr.runtime.BitSet.LOG_BITS); i++) {
            if (this.member(i)) {
                if (i > 0 && havePrintedAnElement ) {
                    buf += separator;
                }
                if ( g ) {
                    buf += g.getTokenDisplayName(i);
                }
                else {
                    buf += i.toString();
                }
				havePrintedAnElement = true;
            }
        }
        return buf + "}";
    },

    /**
     * Create a string representation where instead of integer elements, the
     * ith element of vocabulary is displayed instead.  Vocabulary is a Vector
     * of Strings.
     * separator The string to put in between elements
     * @private
     * @return A commma-separated list of character constants.
     */
    toString2: function(separator, vocabulary) {
        var str = "",
            i;
        for (i = 0; i < (this.bits.length << org.antlr.runtime.BitSet.LOG_BITS); i++) {
            if (this.member(i)) {
                if (str.length > 0) {
                    str += separator;
                }
                if (i >= vocabulary.size()) {
                    str += "'" + i + "'";
                }
                else if (!org.antlr.lang.isValue(vocabulary.get(i))) {
                    str += "'" + i + "'";
                }
                else {
                    str += vocabulary.get(i);
                }
            }
        }
        return str;
    }

    /*
     * Dump a comma-separated list of the words making up the bit set.
     * Split each 32 bit number into two more manageable 16 bit numbers.
     * @returns {String} comma separated list view of the this.bits property.
     *
    toStringOfHalfWords: function() {
        var s = "",
            tmp,
            i;
        for (i = 0; i < this.bits.length; i++) {
            if (i !== 0) {
                s+=", ";
            }
            tmp = this.bits[i];
            tmp &= 0xFFFF;
            s += tmp + "UL, ";
            tmp = this.bits[i] >> 16;
            tmp &= 0xFFFF;
            s += tmp+"UL";
        }
		return s;
    },
    */

    /*
     * Dump a comma-separated list of the words making up the bit set.
     * This generates a comma-separated list of Java-like long int constants.
     *
    toStringOfWords: function() {
        var s="",
            i;
        for (i = 0; i < this.bits.length; i++) {
            if (i !== 0) {
                s+=", ";
            }
            s += this.bits[i]+"L";
        }
        return s;
    },

    toStringWithRanges: function() {
        return this.toString();
    }
    */
};

/*
 *
 *
org.antlr.runtime.IntervalSet = function() {
        throw new Error("not implemented");
};
*/
org.antlr.runtime.CharStream = {
    EOF: -1
};
org.antlr.runtime.CommonToken = function() {
    var oldToken;

    this.charPositionInLine = -1; // set to invalid position
    this.channel = 0; // org.antlr.runtime.CommonToken.DEFAULT_CHANNEL
    this.index = -1;

    if (arguments.length == 1) {
        if (org.antlr.lang.isNumber(arguments[0])) {
            this.type = arguments[0];
        } else {
            oldToken = arguments[0];
            this.text = oldToken.getText();
            this.type = oldToken.getType();
            this.line = oldToken.getLine();
            this.index = oldToken.getTokenIndex();
            this.charPositionInLine = oldToken.getCharPositionInLine();
            this.channel = oldToken.getChannel();
            if ( oldToken instanceof org.antlr.runtime.CommonToken ) {
                this.start = oldToken.start;
                this.stop = oldToken.stop;
            }
        }
    } else if (arguments.length == 2) {
        this.type = arguments[0];
        this.text = arguments[1];
        this.channel = 0; // org.antlr.runtime.CommonToken.DEFAULT_CHANNEL
    } else if (arguments.length == 5) {
        this.input = arguments[0];
        this.type = arguments[1];
        this.channel = arguments[2];
        this.start = arguments[3];
        this.stop = arguments[4];
    }
};

org.antlr.runtime.CommonToken.prototype = {
    getType: function() {
        return this.type;
    },

    setLine: function(line) {
        this.line = line;
    },

    getText: function() {
        if ( org.antlr.lang.isString(this.text) ) {
            return this.text;
        }
        if ( !this.input ) {
            return null;
        }
        this.text = this.input.substring(this.start,this.stop);
        return this.text;
    },

    /** Override the text for this token.  getText() will return this text
     *  rather than pulling from the buffer.  Note that this does not mean
     *  that start/stop indexes are not valid.  It means that that input
     *  was converted to a new string in the token object.
     */
    setText: function(text) {
        this.text = text;
    },

    getLine: function() {
        return this.line;
    },

    getCharPositionInLine: function() {
        return this.charPositionInLine;
    },

    setCharPositionInLine: function(charPositionInLine) {
        this.charPositionInLine = charPositionInLine;
    },

    getChannel: function() {
        return this.channel;
    },

    setChannel: function(channel) {
        this.channel = channel;
    },

    setType: function(type) {
        this.type = type;
    },

    getStartIndex: function() {
        return this.start;
    },

    setStartIndex: function(start) {
        this.start = start;
    },

    getStopIndex: function() {
        return this.stop;
    },

    setStopIndex: function(stop) {
        this.stop = stop;
    },

    getTokenIndex: function() {
        return this.index;
    },

    setTokenIndex: function(index) {
        this.index = index;
    },

    getInputStream: function() {
        return this.input;
    },

    setInputStream: function(input) {
        this.input = input;
    },

    toString: function() {
        var channelStr = "";
        if ( this.channel>0 ) {
            channelStr=",channel="+this.channel;
        }
        var txt = this.getText();
        if ( !org.antlr.lang.isNull(txt) ) {
            txt = txt.replace(/\n/g,"\\\\n");
            txt = txt.replace(/\r/g,"\\\\r");
            txt = txt.replace(/\t/g,"\\\\t");
        }
        else {
            txt = "<no text>";
        }
        return "[@"+this.getTokenIndex()+","+this.start+":"+this.stop+"='"+txt+"',<"+this.type+">"+channelStr+","+this.line+":"+this.getCharPositionInLine()+"]";
    }
};
// NB: Because Token has static members of type CommonToken, the Token dummy
// constructor is defined in CommonToken.  All methods and vars of Token are
// defined here.  Token is an interface, not a subclass in the Java runtime.

/**
 * @class Abstract base class of all token types.
 * @name Token
 * @memberOf org.antlr.runtime
 */
org.antlr.runtime.Token = function() {};
org.antlr.lang.augmentObject(org.antlr.runtime.Token, /** @lends Token */ {
    EOR_TOKEN_TYPE: 1,

    /** imaginary tree navigation type; traverse "get child" link */
    DOWN: 2,
    /** imaginary tree navigation type; finish with a child list */
    UP: 3,

    MIN_TOKEN_TYPE: 4, // UP+1,

    EOF: org.antlr.runtime.CharStream.EOF,
    EOF_TOKEN: new org.antlr.runtime.CommonToken(org.antlr.runtime.CharStream.EOF),

    INVALID_TOKEN_TYPE: 0,
    INVALID_TOKEN: new org.antlr.runtime.CommonToken(0),

    /** In an action, a lexer rule can set token to this SKIP_TOKEN and ANTLR
     *  will avoid creating a token for this symbol and try to fetch another.
     */
    SKIP_TOKEN: new org.antlr.runtime.CommonToken(0),

    /** All tokens go to the parser (unless skip() is called in that rule)
     *  on a particular "channel".  The parser tunes to a particular channel
     *  so that whitespace etc... can go to the parser on a "hidden" channel.
     */
    DEFAULT_CHANNEL: 0,

    /** Anything on different channel than DEFAULT_CHANNEL is not parsed
     *  by parser.
     */
    HIDDEN_CHANNEL: 99
});

org.antlr.lang.augmentObject(org.antlr.runtime.CommonToken, org.antlr.runtime.Token);
org.antlr.runtime.tree = {};
org.antlr.runtime.tree.RewriteCardinalityException = function(elementDescription) {
    this.elementDescription = elementDescription;
};

/** Base class for all exceptions thrown during AST rewrite construction.
 *  This signifies a case where the cardinality of two or more elements
 *  in a subrule are different: (ID INT)+ where |ID|!=|INT|
 */
org.antlr.lang.extend(org.antlr.runtime.tree.RewriteCardinalityException, Error, {
    getMessage: function() {
		if ( org.antlr.lang.isString(this.elementDescription) ) {
			return this.elementDescription;
		}
		return null;
	},
    name: function() {
        return "org.antlr.runtime.tree.RewriteCardinalityException";
    }
});
/** Ref to ID or expr but no tokens in ID stream or subtrees in expr stream */
org.antlr.runtime.tree.RewriteEmptyStreamException = function(elementDescription) {
    var sup = org.antlr.runtime.tree.RewriteEmptyStreamException.superclass; 
    sup.constructor.call(this, elementDescription);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteEmptyStreamException,
                  org.antlr.runtime.tree.RewriteCardinalityException, {
    name: function() {
        return "org.antlr.runtime.tree.RewriteEmptyStreamException";
    }
});
/** No elements within a (...)+ in a rewrite rule */
org.antlr.runtime.tree.RewriteEarlyExitException = function(elementDescription) {
    var sup = org.antlr.runtime.tree.RewriteEarlyExitException.superclass;
    if (org.antlr.lang.isUndefined(elementDescription)) {
        elementDescription = null;
    }
    sup.constructor.call(this, elementDescription);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteEarlyExitException,
                  org.antlr.runtime.tree.RewriteCardinalityException, {
    name: function() {
        return "org.antlr.runtime.tree.RewriteEarlyExitException";
    }    
});
org.antlr.runtime.MismatchedTreeNodeException = function(expecting, input) {
    if (expecting && input) {
        org.antlr.runtime.MismatchedTreeNodeException.superclass.constructor.call(
                this, input);
        this.expecting = expecting;
    }
};

org.antlr.lang.extend(
    org.antlr.runtime.MismatchedTreeNodeException,
    org.antlr.runtime.RecognitionException, {
    toString: function() {
        return "MismatchedTreeNodeException(" +
                this.getUnexpectedType() + "!=" + this.expecting + ")";
    },
    name: "org.antlr.runtime.MismatchedTreeNodeException"
});
/** A generic tree implementation with no payload.  You must subclass to
 *  actually have any user data.  ANTLR v3 uses a list of children approach
 *  instead of the child-sibling approach in v2.  A flat tree (a list) is
 *  an empty node whose children represent the list.  An empty, but
 *  non-null node is called "nil".
 */
org.antlr.runtime.tree.BaseTree = function() {};

org.antlr.runtime.tree.BaseTree.prototype = {
    getChild: function(i) {
        if ( !this.children || i>=this.children.length ) {
            return null;
        }
        return this.children[i];
    },

    /** Get the children internal List; note that if you directly mess with
     *  the list, do so at your own risk.
     */
    getChildren: function() {
        return this.children;
    },

    getFirstChildWithType: function(type) {
        var i, t;
        for (i = 0; this.children && i < this.children.length; i++) {
            t = this.children[i];
            if ( t.getType()===type ) {
                return t;
            }
        }    
        return null;
    },

    getChildCount: function() {
        if ( !this.children ) {
            return 0;
        }
        return this.children.length;
    },

    /** Add t as child of this node.
     *
     *  Warning: if t has no children, but child does
     *  and child isNil then this routine moves children to t via
     *  t.children = child.children; i.e., without copying the array.
     */
    addChild: function(t) {
        if ( !org.antlr.lang.isValue(t) ) {
            return; // do nothing upon addChild(null)
        }
        var childTree = t, n, i, c;
        if ( childTree.isNil() ) { // t is an empty node possibly with children
            if ( this.children && this.children == childTree.children ) {
                throw new Error("attempt to add child list to itself");
            }
            // just add all of childTree's children to this
            if ( childTree.children ) {
                if ( this.children ) { // must copy, this has children already
                    n = childTree.children.length;
                    for (i = 0; i < n; i++) {
                        c = childTree.children[i];
                        this.children.push(c);
                        // handle double-link stuff for each child of nil root
                        c.setParent(this);
                        c.setChildIndex(this.children.length-1);
                    }
                }
                else {
                    // no children for this but t has children; just set pointer
                    // call general freshener routine
                    this.children = childTree.children;
                    this.freshenParentAndChildIndexes();
                }
            }
        }
        else { // child is not nil (don't care about children)
            if ( !this.children ) {
                this.children = this.createChildrenList(); // create children list on demand
            }
            this.children.push(t);
            childTree.setParent(this);
            childTree.setChildIndex(this.children.length-1);
        }
    },

    /** Add all elements of kids list as children of this node */
    addChildren: function(kids) {
        var i, t;
        for (i = 0; i < kids.length; i++) {
            t = kids[i];
            this.addChild(t);
        }
    },

    setChild: function(i, t) {
        if ( !t ) {
            return;
        }
        if ( t.isNil() ) {
            throw new Error("Can't set single child to a list");
        }
        if ( !this.children ) {
            this.children = this.createChildrenList();
        }
        this.children[i] = t;
        t.setParent(this);
        t.setChildIndex(i);
    },

    deleteChild: function(i) {
        if ( !this.children ) {
            return null;
        }
        if (i<0 || i>=this.children.length) {
            throw new Error("Index out of bounds.");
        }
        var killed = this.children.splice(i, 1)[0];
        // walk rest and decrement their child indexes
        this.freshenParentAndChildIndexes(i);
        return killed;
    },

    /** Delete children from start to stop and replace with t even if t is
     *  a list (nil-root tree).  num of children can increase or decrease.
     *  For huge child lists, inserting children can force walking rest of
     *  children to set their childindex; could be slow.
     */
    replaceChildren: function(startChildIndex, stopChildIndex, t) {
        if ( !this.children ) {
            throw new Error("indexes invalid; no children in list");
        }
        var replacingHowMany = stopChildIndex - startChildIndex + 1;
        var replacingWithHowMany;
        var newTree = t;
        var newChildren = null;
        // normalize to a list of children to add: newChildren
        if ( newTree.isNil() ) {
            newChildren = newTree.children;
        }
        else {
            newChildren = [];
            newChildren.push(newTree);
        }
        replacingWithHowMany = newChildren.length;
        var numNewChildren = newChildren.length;
        var delta = replacingHowMany - replacingWithHowMany;
        var j, i, child, indexToDelete, c, killed, numToInsert;
        // if same number of nodes, do direct replace
        if ( delta === 0 ) {
            j = 0; // index into new children
            for (i=startChildIndex; i<=stopChildIndex; i++) {
                child = newChildren[j];
                this.children[i] = child;
                child.setParent(this);
                child.setChildIndex(i);
                j++;
            }
        }
        else if ( delta > 0 ) { // fewer new nodes than there were
            // set children and then delete extra
            for (j=0; j<numNewChildren; j++) {
                this.children[startChildIndex+j] = newChildren[j];
            }
            indexToDelete = startChildIndex+numNewChildren;
            for (c=indexToDelete; c<=stopChildIndex; c++) {
                // delete same index, shifting everybody down each time
                killed = this.children.splice(indexToDelete, 1)[0];
            }
            this.freshenParentAndChildIndexes(startChildIndex);
        }
        else { // more new nodes than were there before
            // fill in as many children as we can (replacingHowMany) w/o moving data
            for (j=0; j<replacingHowMany; j++) {
                this.children[startChildIndex+j] = newChildren[j];
            }
            numToInsert = replacingWithHowMany-replacingHowMany;
            for (j=replacingHowMany; j<replacingWithHowMany; j++) {
                this.children.splice(startChildIndex+j, 0, newChildren[j]);
            }
            this.freshenParentAndChildIndexes(startChildIndex);
        }
    },

    /** Override in a subclass to change the impl of children list */
    createChildrenList: function() {
        return [];
    },

    isNil: function() {
        return false;
    },

    freshenParentAndChildIndexes: function(offset) {
        if (!org.antlr.lang.isNumber(offset)) {
            offset = 0;
        }
        var n = this.getChildCount(),
            c,
            child;
        for (c = offset; c < n; c++) {
            child = this.getChild(c);
            child.setChildIndex(c);
            child.setParent(this);
        }
    },

    sanityCheckParentAndChildIndexes: function(parent, i) {
        if (arguments.length===0) {
            parent = null;
            i = -1;
        }

        if ( parent!==this.getParent() ) {
            throw new Error("parents don't match; expected "+parent+" found "+this.getParent());
        }
        if ( i!==this.getChildIndex() ) {
            throw new Error("child indexes don't match; expected "+i+" found "+this.getChildIndex());
        }
        var n = this.getChildCount(),
            c,
            child;
        for (c = 0; c < n; c++) {
            child = this.getChild(c);
            child.sanityCheckParentAndChildIndexes(this, c);
        }
    },

    /** BaseTree doesn't track child indexes. */
    getChildIndex: function() {
        return 0;
    },
    setChildIndex: function(index) {
    },

    /** BaseTree doesn't track parent pointers. */
    getParent: function() {
        return null;
    },
    setParent: function(t) {
    },

    getTree: function() {
        return this;
    },

    /** Print out a whole tree not just a node */
    toStringTree: function() {
        if ( !this.children || this.children.length===0 ) {
            return this.toString();
        }
        var buf = "",
            i,
            t;
        if ( !this.isNil() ) {
            buf += "(";
            buf += this.toString();
            buf += ' ';
        }
        for (i = 0; this.children && i < this.children.length; i++) {
            t = this.children[i];
            if ( i>0 ) {
                buf += ' ';
            }
            buf += t.toStringTree();
        }
        if ( !this.isNil() ) {
            buf += ")";
        }
        return buf;
    },

    getLine: function() {
        return 0;
    },

    getCharPositionInLine: function() {
        return 0;
    }
};
/** A tree node that is wrapper for a Token object.  After 3.0 release
 *  while building tree rewrite stuff, it became clear that computing
 *  parent and child index is very difficult and cumbersome.  Better to
 *  spend the space in every tree node.  If you don't want these extra
 *  fields, it's easy to cut them out in your own BaseTree subclass.
 */
org.antlr.runtime.tree.CommonTree = function(node) {
    /** What token indexes bracket all tokens associated with this node
     *  and below?
     */
    this.startIndex = -1;
    this.stopIndex = -1;

    /** What index is this node in the child list? Range: 0..n-1 */
    this.childIndex = -1;

    /** Who is the parent node of this node; if null, implies node is root */
    this.parent = null;

    /** A single token is the payload */
    this.token = null;

    if (node instanceof org.antlr.runtime.tree.CommonTree) {
        org.antlr.runtime.tree.CommonTree.superclass.constructor.call(this, node);
        this.token = node.token;
        this.startIndex = node.startIndex;
        this.stopIndex = node.stopIndex;
    } else if (node instanceof org.antlr.runtime.CommonToken) {
        this.token = node;
    }
};

/** A tree node that is wrapper for a Token object. */
org.antlr.lang.extend(org.antlr.runtime.tree.CommonTree, org.antlr.runtime.tree.BaseTree, {
    getToken: function() {
        return this.token;
    },

    dupNode: function() {
        return new org.antlr.runtime.tree.CommonTree(this);
    },

    isNil: function() {
        return !this.token;
    },

    getType: function() {
        if ( !this.token ) {
            return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
        }
        return this.token.getType();
    },

    getText: function() {
        if ( !this.token ) {
            return null;
        }
        return this.token.getText();
    },

    getLine: function() {
        if ( !this.token || this.token.getLine()===0 ) {
            if ( this.getChildCount()>0 ) {
                return this.getChild(0).getLine();
            }
            return 0;
        }
        return this.token.getLine();
    },

    getCharPositionInLine: function() {
        if ( !this.token || this.token.getCharPositionInLine()===-1 ) {
            if ( this.getChildCount()>0 ) {
                return this.getChild(0).getCharPositionInLine();
            }
            return 0;
        }
        return this.token.getCharPositionInLine();
    },

    getTokenStartIndex: function() {
        if ( this.token ) {
            return this.token.getTokenIndex();
        }
        return this.startIndex;
    },

    setTokenStartIndex: function(index) {
        this.startIndex = index;
    },

    getTokenStopIndex: function() {
        if ( this.token ) {
            return this.token.getTokenIndex();
        }
        return this.stopIndex;
    },

    setTokenStopIndex: function(index) {
        this.stopIndex = index;
    },

    getChildIndex: function() {
        return this.childIndex;
    },

    getParent: function() {
        return this.parent;
    },

    setParent: function(t) {
        this.parent = t;
    },

    setChildIndex: function(index) {
        this.childIndex = index;
    },

    toString: function() {
        if ( this.isNil() ) {
            return "nil";
        }
        if ( this.getType()===org.antlr.runtime.Token.INVALID_TOKEN_TYPE ) {
            return "<errornode>";
        }
        if ( !this.token ) {
            return null;
        }
        return this.token.getText();
    }
});
/** What does a tree look like?  ANTLR has a number of support classes
 *  such as CommonTreeNodeStream that work on these kinds of trees.  You
 *  don't have to make your trees implement this interface, but if you do,
 *  you'll be able to use more support code.
 *
 *  NOTE: When constructing trees, ANTLR can build any kind of tree; it can
 *  even use Token objects as trees if you add a child list to your tokens.
 *
 *  This is a tree node without any payload; just navigation and factory stuff.
 */
org.antlr.runtime.tree.Tree = {
    INVALID_NODE: new org.antlr.runtime.tree.CommonTree(org.antlr.runtime.Token.INVALID_TOKEN)
};
org.antlr.runtime.tree.CommonErrorNode = function(input, start, stop, e) {
    if ( !stop ||
            (stop.getTokenIndex() < start.getTokenIndex() &&
             stop.getType()!=org.antlr.runtime.Token.EOF) )
    {
        // sometimes resync does not consume a token (when LT(1) is
        // in follow set.  So, stop will be 1 to left to start. adjust.
        // Also handle case where start is the first token and no token
        // is consumed during recovery; LT(-1) will return null.
        stop = start;
    }
    this.input = input;
    this.start = start;
    this.stop = stop;
    this.trappedException = e;
};

org.antlr.lang.extend(org.antlr.runtime.tree.CommonErrorNode, org.antlr.runtime.tree.CommonTree, {
    isNil: function() {
        return false;
    },

    getType: function() {
        return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
    },

    getText: function() {
        var badText = null;
        if ( this.start instanceof org.antlr.runtime.CommonToken ) {
            var i = this.start.getTokenIndex();
            var j = this.stop.getTokenIndex();
            if ( this.stop.getType() === org.antlr.runtime.Token.EOF ) {
                j = this.input.size();
            }
            badText = this.input.toString(i, j);
        }
        else if ( this.start instanceof org.antlr.runtime.tree.CommonTree ) {
            badText = this.input.toString(this.start, this.stop);
        }
        else {
            // people should subclass if they alter the tree type so this
            // next one is for sure correct.
            badText = "<unknown>";
        }
        return badText;
    },

    toString: function() {
        if ( this.trappedException instanceof org.antlr.runtime.MissingTokenException ) {
            return "<missing type: "+
                   this.trappedException.getMissingType()+
                   ">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.UnwantedTokenException ) {
            return "<extraneous: "+
                   this.trappedException.getUnexpectedToken()+
                   ", resync="+this.getText()+">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.MismatchedTokenException ) {
            return "<mismatched token: "+this.trappedException.token+", resync="+this.getText()+">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.NoViableAltException ) {
            return "<unexpected: "+this.trappedException.token+
                   ", resync="+this.getText()+">";
        }
        return "<error: "+this.getText()+">";
    }
});
/** A TreeAdaptor that works with any Tree implementation. */
org.antlr.runtime.tree.BaseTreeAdaptor = function() {
    this.uniqueNodeID = 1;
};

org.antlr.runtime.tree.BaseTreeAdaptor.prototype = {
    nil: function() {
        return this.create(null);
    },

    /** create tree node that holds the start and stop tokens associated
     *  with an error.
     *
     *  If you specify your own kind of tree nodes, you will likely have to
     *  override this method. CommonTree returns Token.INVALID_TOKEN_TYPE
     *  if no token payload but you might have to set token type for diff
     *  node type.
     */
    errorNode: function(input, start, stop, e) {
        var t = new org.antlr.runtime.tree.CommonErrorNode(input, start, stop, e);
        return t;
    },

    isNil: function(tree) {
        return tree.isNil();
    },

    /** This is generic in the sense that it will work with any kind of
     *  tree (not just Tree interface).  It invokes the adaptor routines
     *  not the tree node routines to do the construction.  
     */
    dupTree: function(t, parent) {
        if (arguments.length===1) {
            parent = null;
        }
        if ( !t ) {
            return null;
        }
        var newTree = this.dupNode(t);
        // ensure new subtree root has parent/child index set
        this.setChildIndex(newTree, this.getChildIndex(t)); // same index in new tree
        this.setParent(newTree, parent);
        var n = this.getChildCount(t),
            i, child, newSubTree;
        for (i = 0; i < n; i++) {
            child = this.getChild(t, i);
            newSubTree = this.dupTree(child, t);
            this.addChild(newTree, newSubTree);
        }
        return newTree;
    },

    /** Add a child to the tree t.  If child is a flat tree (a list), make all
     *  in list children of t.  Warning: if t has no children, but child does
     *  and child isNil then you can decide it is ok to move children to t via
     *  t.children = child.children; i.e., without copying the array.  Just
     *  make sure that this is consistent with have the user will build
     *  ASTs.
     */
    addChild: function(t, child) {
        if ( t && org.antlr.lang.isValue(child) ) {
            t.addChild(child);
        }
    },

    /** If oldRoot is a nil root, just copy or move the children to newRoot.
     *  If not a nil root, make oldRoot a child of newRoot.
     *
     *    old=^(nil a b c), new=r yields ^(r a b c)
     *    old=^(a b c), new=r yields ^(r ^(a b c))
     *
     *  If newRoot is a nil-rooted single child tree, use the single
     *  child as the new root node.
     *
     *    old=^(nil a b c), new=^(nil r) yields ^(r a b c)
     *    old=^(a b c), new=^(nil r) yields ^(r ^(a b c))
     *
     *  If oldRoot was null, it's ok, just return newRoot (even if isNil).
     *
     *    old=null, new=r yields r
     *    old=null, new=^(nil r) yields ^(nil r)
     *
     *  Return newRoot.  Throw an exception if newRoot is not a
     *  simple node or nil root with a single child node--it must be a root
     *  node.  If newRoot is ^(nil x) return x as newRoot.
     *
     *  Be advised that it's ok for newRoot to point at oldRoot's
     *  children; i.e., you don't have to copy the list.  We are
     *  constructing these nodes so we should have this control for
     *  efficiency.
     */
    becomeRoot: function(newRoot, oldRoot) {
        if (newRoot instanceof org.antlr.runtime.CommonToken || !newRoot) {
            newRoot = this.create(newRoot);
        }

        var newRootTree = newRoot,
            oldRootTree = oldRoot;
        if ( !oldRoot ) {
            return newRoot;
        }
        // handle ^(nil real-node)
        if ( newRootTree.isNil() ) {
            if ( newRootTree.getChildCount()>1 ) {
                // TODO: make tree run time exceptions hierarchy
                throw new Error("more than one node as root (TODO: make exception hierarchy)");
            }
            newRootTree = newRootTree.getChild(0);
        }
        // add oldRoot to newRoot; addChild takes care of case where oldRoot
        // is a flat list (i.e., nil-rooted tree).  All children of oldRoot
        // are added to newRoot.
        newRootTree.addChild(oldRootTree);
        return newRootTree;
    },

    /** Transform ^(nil x) to x */
    rulePostProcessing: function(root) {
        var r = root;
        if ( r && r.isNil() ) {
            if ( r.getChildCount()===0 ) {
                r = null;
            }
            else if ( r.getChildCount()===1 ) {
                r = r.getChild(0);
                // whoever invokes rule will set parent and child index
                r.setParent(null);
                r.setChildIndex(-1);
            }
        }
        return r;
    },

    create: function(tokenType, fromToken) {
        var text, t;
        if (arguments.length===2) {
            if (org.antlr.lang.isString(arguments[1])) {
                text = arguments[1];
                fromToken = this.createToken(tokenType, text);
                t = this.create(fromToken);
                return t;
            } else {
                fromToken = this.createToken(fromToken);
                fromToken.setType(tokenType);
                t = this.create(fromToken);
                return t;
            }
        } else if (arguments.length===3) {
            text = arguments[2];
            fromToken = this.createToken(fromToken);
            fromToken.setType(tokenType);
            fromToken.setText(text);
            t = this.create(fromToken);
            return t;
        }
    },

    getType: function(t) {
        t.getType();
        return 0;
    },

    setType: function(t, type) {
        throw new Error("don't know enough about Tree node");
    },

    getText: function(t) {
        return t.getText();
    },

    setText: function(t, text) {
        throw new Error("don't know enough about Tree node");
    },

    getChild: function(t, i) {
        return t.getChild(i);
    },

    setChild: function(t, i, child) {
        t.setChild(i, child);
    },

    deleteChild: function(t, i) {
        return t.deleteChild(i);
    },

    getChildCount: function(t) {
        return t.getChildCount();
    },

    getUniqueID: function(node) {
        if ( !this.treeToUniqueIDMap ) {
             this.treeToUniqueIDMap = {};
        }
        var prevID = this.treeToUniqueIDMap[node];
        if ( org.antlr.lang.isValue(prevID) ) {
            return prevID;
        }
        var ID = this.uniqueNodeID;
        this.treeToUniqueIDMap[node] = ID;
        this.uniqueNodeID++;
        return ID;
        // GC makes these nonunique:
        // return System.identityHashCode(node);
    }
};
/** A TreeAdaptor that works with any Tree implementation.  It provides
 *  really just factory methods; all the work is done by BaseTreeAdaptor.
 *  If you would like to have different tokens created than ClassicToken
 *  objects, you need to override this and then set the parser tree adaptor to
 *  use your subclass.
 *
 *  To get your parser to build nodes of a different type, override
 *  create(Token).
 */
org.antlr.runtime.tree.CommonTreeAdaptor = function() {};

org.antlr.lang.extend(org.antlr.runtime.tree.CommonTreeAdaptor,
                  org.antlr.runtime.tree.BaseTreeAdaptor, {
    /** Duplicate a node.  This is part of the factory;
     *    override if you want another kind of node to be built.
     *
     *  I could use reflection to prevent having to override this
     *  but reflection is slow.
     */
    dupNode: function(t) {
        if ( !org.antlr.lang.isValue(t) ) {
            return null;
        }
        return t.dupNode();
    },

    create: function(payload) {
        if (arguments.length>1) {
            return org.antlr.runtime.tree.CommonTreeAdaptor.superclass.create.apply(this, arguments);
        }
        return new org.antlr.runtime.tree.CommonTree(payload);
    },

    /** Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     *
     * Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  This is a variant of createToken where the new token is derived from
     *  an actual real input token.  Typically this is for converting '{'
     *  tokens to BLOCK etc...  You'll see
     *
     *    r : lc='{' ID+ '}' -> ^(BLOCK[$lc] ID+) ;
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     */
    createToken: function(fromToken) {
        if (arguments.length===2) {
            return new org.antlr.runtime.CommonToken(arguments[0], arguments[1]);
        } else {
            return new org.antlr.runtime.CommonToken(arguments[0]);
        }
    },

    /** Track start/stop token for subtree root created for a rule.
     *  Only works with Tree nodes.  For rules that match nothing,
     *  seems like this will yield start=i and stop=i-1 in a nil node.
     *  Might be useful info so I'll not force to be i..i.
     */
    setTokenBoundaries: function(t, startToken, stopToken) {
        if ( !org.antlr.lang.isValue(t) ) {
            return;
        }
        var start = 0,
            stop = 0;
        if ( org.antlr.lang.isValue(startToken) ) {
            if (startToken.getTokenIndex) {
                start = startToken.getTokenIndex();
            } else if (startToken.getStartIndex) {
                start = startToken.getStartIndex();
            } else {
                start = startToken.getTokenStartIndex();
            }
        }
        if ( org.antlr.lang.isValue(stopToken) ) {
            if (stop.getTokenIndex) {
                stop = stopToken.getTokenIndex();
            } else if (stopToken.getStopIndex) {
                stop = stopToken.getStopIndex();
            } else {
                stop = stopToken.getTokenStopIndex();
            }
        }
        t.setTokenStartIndex(start);
        t.setTokenStopIndex(stop);
    },

    getTokenStartIndex: function(t) {
        if (!t) {
            return -1;
        }
        return t.getTokenStartIndex();
    },

    getTokenStopIndex: function(t) {
        if (!t) {
            return -1;
        }
        return t.getTokenStopIndex();
    },

    getText: function(t) {
        if (!t) {
            return null;
        }
        return t.getText();
    },

    getType: function(t) {
        if (!t) {
            return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
        }
        return t.getType();
    },

    /** What is the Token associated with this node?  If
     *  you are not using CommonTree, then you must
     *  override this in your own adaptor.
     */
    getToken: function(t) {
        if ( t instanceof org.antlr.runtime.tree.CommonTree ) {
            return t.getToken();
        }
        return null; // no idea what to do
    },

    getChild: function(t, i) {
        if (!t) {
            return null;
        }
        return t.getChild(i);
    },

    getChildCount: function(t) {
        if (!t) {
            return 0;
        }
        return t.getChildCount();
    },

    getParent: function(t) {
        return t.getParent();
    },

    setParent: function(t, parent) {
        t.setParent(parent);
    },

    getChildIndex: function(t) {
        return t.getChildIndex();
    },

    setChildIndex: function(t, index) {
        t.setChildIndex(index);
    },

    replaceChildren: function(parent, startChildIndex, stopChildIndex, t) {
        if ( parent ) {
            parent.replaceChildren(startChildIndex, stopChildIndex, t);
        }
    }
});
/**
 * A stream of characters created from a JavaScript string that in turn gets
 * fed to a lexer.
 * @class
 * @param {String} data the string from which this stream will be created.
 */
org.antlr.runtime.ANTLRStringStream = function(data) {
    /**
     * Location in the stream.
     * Ranges from 0 to (stream length - 1).
     * @private
     * @type Number
     */
    this.p = 0;

    /**
     * The current line in the input.
     * Ranges from 1 to (number of lines).
     * @private
     * @type Number
     */
    this.line = 1;

    /**
     * The index of the character relative to the beginning of the line.
     * Ranges from 0 to (length of line - 1).
     * @private
     * @type Number
     */
    this.charPositionInLine = 0;

    /**
     * Tracks how deep mark() calls are nested
     * @private
     * @type Number
     */
    this.markDepth = 0;

    /**
     * An Array of objects that tracks the stream state
     * values line, charPositionInLine, and p that can change as you
     * move through the input stream.  Indexed from 1..markDepth.
     * A null is kept at index 0.  Created upon first call to mark().
     * @private
     * @type Array
     */
    this.markers = null;

    /**
     * Track the last mark() call result value for use in rewind().
     * @private
     * @type Number
     */
    this.lastMarker = null;

    /**
     * The data being scanned.
     * @private
     * @type String
     */
    this.data = data;

    /**
     * The number of characters in the stream.
     * @private
     * @type Number
     */
    this.n = data.length;
};

org.antlr.runtime.ANTLRStringStream.prototype = {
    /**
     * Reset the stream so that it's in the same state it was
     * when the object was created *except* the data array is not
     * touched.
     */
    reset: function() {
       this.p = 0;
       this.line = 1;
       this.charPositionInLine = 0;
       this.markDepth = 0;
    },

    /**
     * Consume the next character of data in the stream.
     */
    consume: function() {
        //console.log("prev p="+ this.p +", c="+ this.data.charAt(this.p));
        if ( this.p < this.n ) {
            this.charPositionInLine++;
            if ( this.data.charAt(this.p)==="\n" ) {
                this.line++;
                this.charPositionInLine=0;
            }
            this.p++;
            //console.log("p moves to " + this.p + " (c='"+ this.data.charAt(this.p) +"')");
        }
    },

    /**
     * Get character at current input pointer + i ahead where i=1 is next int.
     * Negative indexes are allowed.  LA(-1) is previous token (token
     * just matched).  LA(-i) where i is before first token should
     * yield -1, invalid char / EOF.
     * @param {Number} i non-zero amount of lookahead or lookback
     * @returns {String|Number} The charcter at the specified position or -1 if
     *      you fell off either end of the stream.
     */
    LA: function(i) {
        if ( i<0 ) {
            i++; // e.g., translate LA(-1) to use offset i=0; then data[p+0-1]
        }

        var new_pos = this.p+i-1;
        if (new_pos>=this.n || new_pos<0) {
            return org.antlr.runtime.CharStream.EOF;
        }
        return this.data.charAt(new_pos);
    },


    /**
     * Return the current input symbol index 0..n where n indicates the
     * last symbol has been read.  The index is the index of char to
     * be returned from LA(1) (i.e. the one about to be consumed).
     * @returns {Number} the index of the current input symbol
     */
    index: function() {
        return this.p;
    },

    /**
     * The length of this stream.
     * @returns {Number} the length of this stream.
     */
    size: function() {
        return this.n;
    },

    /**
     * Tell the stream to start buffering if it hasn't already.  Return
     * current input position, index(), or some other marker so that
     * when passed to rewind() you get back to the same spot.
     * rewind(mark()) should not affect the input cursor.  The Lexer
     * tracks line/col info as well as input index so its markers are
     * not pure input indexes.  Same for tree node streams.
     *
     * <p>Marking is a mechanism for storing the current position of a stream
     * in a stack.  This corresponds with the predictive look-ahead mechanism
     * used in Lexers.</p>
     * @returns {Number} the current size of the mark stack.
     */
    mark: function() {
        if ( !this.markers ) {
            this.markers = [];
            this.markers.push(null); // depth 0 means no backtracking, leave blank
        }
        this.markDepth++;
        var state = null;
        if ( this.markDepth>=this.markers.length ) {
            state = {};
            this.markers.push(state);
        }
        else {
            state = this.markers[this.markDepth];
        }
        state.p = this.p;
        state.line = this.line;
        state.charPositionInLine = this.charPositionInLine;
        this.lastMarker = this.markDepth;
        return this.markDepth;
    },

    /**
     * Rewind to the input position of the last marker.
     * Used currently only after a cyclic DFA and just
     * before starting a sem/syn predicate to get the
     * input position back to the start of the decision.
     * Do not "pop" the marker off the state.  mark(i)
     * and rewind(i) should balance still. It is
     * like invoking rewind(last marker) but it should not "pop"
     * the marker off.  It's like seek(last marker's input position).
     * @param {Number} [m] the index in the mark stack to load instead of the
     *      last.
     */
    rewind: function(m) {
        if (!org.antlr.lang.isNumber(m)) {
            m = this.lastMarker;
        }

        var state = this.markers[m];
        // restore stream state
        this.seek(state.p);
        this.line = state.line;
        this.charPositionInLine = state.charPositionInLine;
        this.release(m);
    },

    /**
     * You may want to commit to a backtrack but don't want to force the
     * stream to keep bookkeeping objects around for a marker that is
     * no longer necessary.  This will have the same behavior as
     * rewind() except it releases resources without the backward seek.
     * This must throw away resources for all markers back to the marker
     * argument.  So if you're nested 5 levels of mark(), and then release(2)
     * you have to release resources for depths 2..5.
     * @param {Number} marker the mark depth above which all mark states will
     *      be released.
     */
    release: function(marker) {
        // unwind any other markers made after m and release m
        this.markDepth = marker;
        // release this marker
        this.markDepth--;
    },

    /**
     * Set the input cursor to the position indicated by index.  This is
     * normally used to seek ahead in the input stream.  No buffering is
     * required to do this unless you know your stream will use seek to
     * move backwards such as when backtracking.
     *
     * <p>This is different from rewind in its multi-directional
     * requirement and in that its argument is strictly an input cursor
     * (index).</p>
     *
     * <p>For char streams, seeking forward must update the stream state such
     * as line number.  For seeking backwards, you will be presumably
     * backtracking using the mark/rewind mechanism that restores state and
     * so this method does not need to update state when seeking backwards.</p>
     *
     * <p>Currently, this method is only used for efficient backtracking using
     * memoization, but in the future it may be used for incremental
     * parsing.</p>
     *
     * <p>The index is 0..n-1.  A seek to position i means that LA(1) will
     * return the ith symbol.  So, seeking to 0 means LA(1) will return the
     * first element in the stream.</p>
     *
     * <p>Esentially this method method moves the input position,
     * {@link #consume}-ing data if necessary.</p>
     *
     * @param {Number} index the position to seek to.
     */
    seek: function(index) {
        if ( index<=this.p ) {
            this.p = index; // just jump; don't update stream state (line, ...)
            return;
        }
        // seek forward, consume until p hits index
        while ( this.p<index ) {
            this.consume();
        }
    },

    /**
     * Retrieve a substring from this stream.
     * @param {Number} start the starting index of the substring (inclusive).
     * @param {Number} stop the last index of the substring (inclusive).
     * @returns {String}
     */
    substring: function(start, stop) {
        return this.data.substr(start,stop-start+1);
    },

    /**
     * Return the current line position in the stream.
     * @returns {Number} the current line position in the stream (1..numlines).
     */
    getLine: function() {
        return this.line;
    },

    /**
     * Get the index of the character relative to the beginning of the line.
     * Ranges from 0 to (length of line - 1).
     * @returns {Number}
     */
    getCharPositionInLine: function() {
        return this.charPositionInLine;
    },

    /**
     * Set the current line in the input stream.
     * This is used internally when performing rewinds.
     * @param {Number} line
     * @private
     */
    setLine: function(line) {
        this.line = line;
    },

    /**
     * Set the index of the character relative to the beginning of the line.
     * Ranges from 0 to (length of line - 1).
     * @param {Number} pos
     * @private
     */
    setCharPositionInLine: function(pos) {
        this.charPositionInLine = pos;
    },

    /** Where are you getting symbols from? Normally, implementations will
     *  pass the buck all the way to the lexer who can ask its input stream
     *  for the file name or whatever.
     */
    getSourceName: function() {
        return null;
    }
};

/**
 * Alias for {@link #LA}.
 * @methodOf org.antlr.runtime.ANTLRStringStream.prototype
 * @name LT
 */
org.antlr.runtime.ANTLRStringStream.LT = org.antlr.runtime.ANTLRStringStream.LA;
/** The most common stream of tokens is one where every token is buffered up
 *  and tokens are prefiltered for a certain channel (the parser will only
 *  see these tokens and cannot change the filter channel number during the
 *  parse).
 *
 *  TODO: how to access the full token stream?  How to track all tokens matched per rule?
 */
org.antlr.runtime.CommonTokenStream = function(tokenSource, channel) {
    this.p = -1;
    this.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL;
    this.v_discardOffChannelTokens = false;

    this.tokens = [];
    if (arguments.length >= 2) {
        this.channel = channel;
    } else if (arguments.length === 1) {
        this.tokenSource = tokenSource;
    }
};

org.antlr.runtime.CommonTokenStream.prototype = {
    /** Reset this token stream by setting its token source. */
    setTokenSource: function(tokenSource) {
        this.tokenSource = tokenSource;
        this.tokens = [];
        this.p = -1;
        this.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL;
    },

    /** Load all tokens from the token source and put in tokens.
     *  This is done upon first LT request because you might want to
     *  set some token type / channel overrides before filling buffer.
     */
    fillBuffer: function() {
        var index = 0,
            t = this.tokenSource.nextToken(),
            discard,
            channelI;
        while ( org.antlr.lang.isValue(t) && 
                t.getType()!=org.antlr.runtime.CharStream.EOF )
        {
            discard = false;
            // is there a channel override for token type?
            if ( this.channelOverrideMap ) {
                channelI = this.channelOverrideMap[t.getType()];
                if ( org.antlr.lang.isValue(channelI) ) {
                    t.setChannel(channelI);
                }
            }
            if ( this.discardSet && this.discardSet[t.getType()] )
            {
                discard = true;
            }
            else if ( this.v_discardOffChannelTokens &&
                    t.getChannel()!=this.channel )
            {
                discard = true;
            }
            if ( !discard )    {
                t.setTokenIndex(index);
                this.tokens.push(t);
                index++;
            }
            t = this.tokenSource.nextToken();
        }
        // leave p pointing at first token on channel
        this.p = 0;
        this.p = this.skipOffTokenChannels(this.p);
    },

    /** Move the input pointer to the next incoming token.  The stream
     *  must become active with LT(1) available.  consume() simply
     *  moves the input pointer so that LT(1) points at the next
     *  input symbol. Consume at least one token.
     *
     *  Walk past any token not on the channel the parser is listening to.
     */
    consume: function() {
        if ( this.p<this.tokens.length ) {
            this.p++;
            this.p = this.skipOffTokenChannels(this.p); // leave p on valid token
        }
    },

    /** Given a starting index, return the index of the first on-channel
     *  token.
     */
    skipOffTokenChannels: function(i) {
        var n = this.tokens.length;
        while ( i<n && (this.tokens[i]).getChannel()!=this.channel ) {
            i++;
        }
        return i;
    },

    skipOffTokenChannelsReverse: function(i) {
        while ( i>=0 && (this.tokens[i]).getChannel()!=this.channel ) {
            i--;
        }
        return i;
    },

    /** A simple filter mechanism whereby you can tell this token stream
     *  to force all tokens of type ttype to be on channel.  For example,
     *  when interpreting, we cannot exec actions so we need to tell
     *  the stream to force all WS and NEWLINE to be a different, ignored
     *  channel.
     */
    setTokenTypeChannel: function(ttype, channel) {
        if ( !this.channelOverrideMap ) {
            this.channelOverrideMap = {};
        }
        this.channelOverrideMap[ttype] = channel;
    },

    discardTokenType: function(ttype) {
        if ( !this.discardSet ) {
            this.discardSet = {};
        }
        this.discardSet[ttype] = true;
    },

    discardOffChannelTokens: function(b) {
        this.v_discardOffChannelTokens = b;
    },

    /** Given a start and stop index, return a List of all tokens in
     *  the token type BitSet.  Return null if no tokens were found.  This
     *  method looks at both on and off channel tokens.
     */
    getTokens: function(start, stop, types) {
        if ( this.p === -1 ) {
            this.fillBuffer();
        }

        if (arguments.length===0) {
            return this.tokens;
        }

        if (org.antlr.lang.isArray(types)) {
            types = new org.antlr.runtime.BitSet(types);
        } else if (org.antlr.lang.isNumber(types)) {
            types = org.antlr.runtime.BitSet.of(types);
        }

        if ( stop>=this.tokens.length ) {
            stop=this.tokens.length-1;
        }
        if ( start<0 ) {
            start=0;
        }
        if ( start>stop ) {
            return null;
        }

        // list = tokens[start:stop]:{Token t, t.getType() in types}
        var filteredTokens = [],
            i,
            t;
        for (i=start; i<=stop; i++) {
            t = this.tokens[i];
            if ( !this.types || types.member(t.getType()) ) {
                filteredTokens.push(t);
            }
        }
        if ( filteredTokens.length===0 ) {
            filteredTokens = null;
        }
        return filteredTokens;
    },

    /** Get the ith token from the current position 1..n where k=1 is the
     *  first symbol of lookahead.
     */
    LT: function(k) {
        if ( this.p === -1 ) {
            this.fillBuffer();
        }
        if ( k===0 ) {
            return null;
        }
        if ( k<0 ) {
            return this.LB(-1*k);
        }
        if ( (this.p+k-1) >= this.tokens.length ) {
            return org.antlr.runtime.Token.EOF_TOKEN;
        }
        var i = this.p,
            n = 1;
        // find k good tokens
        while ( n<k ) {
            // skip off-channel tokens
            i = this.skipOffTokenChannels(i+1); // leave p on valid token
            n++;
        }
        if ( i>=this.tokens.length ) {
            return org.antlr.runtime.Token.EOF_TOKEN;
        }
        return this.tokens[i];
    },

    /** Look backwards k tokens on-channel tokens */
    LB: function(k) {
        if ( this.p === -1 ) {
            this.fillBuffer();
        }
        if ( k===0 ) {
            return null;
        }
        if ( (this.p-k)<0 ) {
            return null;
        }

        var i = this.p,
            n = 1;
        // find k good tokens looking backwards
        while ( n<=k ) {
            // skip off-channel tokens
            i = this.skipOffTokenChannelsReverse(i-1); // leave p on valid token
            n++;
        }
        if ( i<0 ) {
            return null;
        }
        return this.tokens[i];
    },

    /** Return absolute token i; ignore which channel the tokens are on;
     *  that is, count all tokens not just on-channel tokens.
     */
    get: function(i) {
        return this.tokens[i];
    },

    LA: function(i) {
        return this.LT(i).getType();
    },

    mark: function() {
        if ( this.p === -1 ) {
            this.fillBuffer();
        }
        this.lastMarker = this.index();
        return this.lastMarker;
    },

    release: function(marker) {
        // no resources to release
    },

    size: function() {
        return this.tokens.length;
    },

    index: function() {
        return this.p;
    },

    rewind: function(marker) {
        if (!org.antlr.lang.isNumber(marker)) {
            marker = this.lastMarker;
        }
        this.seek(marker);
    },

    reset: function() {
        this.p = -1;
        this.lastMarker = 0;
    },

    seek: function(index) {
        this.p = index;
    },

    getTokenSource: function() {
        return this.tokenSource;
    },

    getSourceName: function() {
        return this.getTokenSource().getSourceName();
    },

    toString: function(start, stop) {
        if (arguments.length===0) {
            if ( this.p === -1 ) {
                this.fillBuffer();
            }
            start = 0;
            stop = this.tokens.length-1;
        }

        if (!org.antlr.lang.isNumber(start) && !org.antlr.lang.isNumber(stop)) {
            if ( org.antlr.lang.isValue(start) && org.antlr.lang.isValue(stop) ) {
                start = start.getTokenIndex();
                stop = stop.getTokenIndex();
            } else {
                return null;
            }
        }

        var buf = "",
            i;
 
        if ( start<0 || stop<0 ) {
            return null;
        }
        if ( this.p == -1 ) {
            this.fillBuffer();
        }
        if ( stop>=this.tokens.length ) {
            stop = this.tokens.length-1;
        }
        for (i = start; i <= stop; i++) {
            t = this.tokens[i];
            buf = buf + this.tokens[i].getText();
        }
        return buf;
    }
};
/* Useful for dumping out the input stream after doing some
 *  augmentation or other manipulations.
 *
 *  You can insert stuff, replace, and delete chunks.  Note that the
 *  operations are done lazily--only if you convert the buffer to a
 *  String.  This is very efficient because you are not moving data around
 *  all the time.  As the buffer of tokens is converted to strings, the
 *  toString() method(s) check to see if there is an operation at the
 *  current index.  If so, the operation is done and then normal String
 *  rendering continues on the buffer.  This is like having multiple Turing
 *  machine instruction streams (programs) operating on a single input tape. :)
 *
 *  Since the operations are done lazily at toString-time, operations do not
 *  screw up the token index values.  That is, an insert operation at token
 *  index i does not change the index values for tokens i+1..n-1.
 *
 *  Because operations never actually alter the buffer, you may always get
 *  the original token stream back without undoing anything.  Since
 *  the instructions are queued up, you can easily simulate transactions and
 *  roll back any changes if there is an error just by removing instructions.
 *  For example,
 *
 *   CharStream input = new ANTLRFileStream("input");
 *   TLexer lex = new TLexer(input);
 *   TokenRewriteStream tokens = new TokenRewriteStream(lex);
 *   T parser = new T(tokens);
 *   parser.startRule();
 *
 *      Then in the rules, you can execute
 *      Token t,u;
 *      ...
 *      input.insertAfter(t, "text to put after t");}
 *         input.insertAfter(u, "text after u");}
 *         System.out.println(tokens.toString());
 *
 *  Actually, you have to cast the 'input' to a TokenRewriteStream. :(
 *
 *  You can also have multiple "instruction streams" and get multiple
 *  rewrites from a single pass over the input.  Just name the instruction
 *  streams and use that name again when printing the buffer.  This could be
 *  useful for generating a C file and also its header file--all from the
 *  same buffer:
 *
 *      tokens.insertAfter("pass1", t, "text to put after t");}
 *         tokens.insertAfter("pass2", u, "text after u");}
 *         System.out.println(tokens.toString("pass1"));
 *         System.out.println(tokens.toString("pass2"));
 *
 *  If you don't use named rewrite streams, a "default" stream is used as
 *  the first example shows.
 */

org.antlr.runtime.TokenRewriteStream = function() {
    var sup = org.antlr.runtime.TokenRewriteStream.superclass;

    /** You may have multiple, named streams of rewrite operations.
     *  I'm calling these things "programs."
     *  Maps String (name) -> rewrite (List)
     */
    this.programs = null;

    /** Map String (program name) -> Integer index */
    this.lastRewriteTokenIndexes = null;


    if (arguments.length===0) {
        this.init();
    } else {
        sup.constructor.apply(this, arguments);
        this.init();
    }
};

(function(){
var trs = org.antlr.runtime.TokenRewriteStream;

org.antlr.lang.augmentObject(trs, {
    DEFAULT_PROGRAM_NAME: "default",
    PROGRAM_INIT_SIZE: 100,
    MIN_TOKEN_INDEX: 0
});

//
// Define the rewrite operation hierarchy
//

trs.RewriteOperation = function(index, text) {
    this.index = index;
    this.text = text;
};

/** Execute the rewrite operation by possibly adding to the buffer.
 *  Return the index of the next token to operate on.
 */
trs.RewriteOperation.prototype = {
    execute: function(buf) {
        return this.index;
    },
    toString: function() {
        /*String opName = getClass().getName();
        int $index = opName.indexOf('$');
        opName = opName.substring($index+1, opName.length());
        return opName+"@"+index+'"'+text+'"';*/
        return this.text;
    }
};

trs.InsertBeforeOp = function(index, text) {
    trs.InsertBeforeOp.superclass.constructor.call(this, index, text);
};
org.antlr.lang.extend(trs.InsertBeforeOp, trs.RewriteOperation, {
    execute: function(buf) {
        buf.push(this.text);
        return this.index;
    }
});

/** I'm going to try replacing range from x..y with (y-x)+1 ReplaceOp
 *  instructions.
 */
trs.ReplaceOp = function(from, to, text) {
    trs.ReplaceOp.superclass.constructor.call(this, from, text); 
    this.lastIndex = to;
};
org.antlr.lang.extend(trs.ReplaceOp, trs.RewriteOperation, {
    execute: function(buf) {
        if (org.antlr.lang.isValue(this.text)) {
            buf.push(this.text);
        }
        return this.lastIndex+1;
    }
});

trs.DeleteOp = function(from, to) {
    trs.DeleteOp.superclass.constructor.call(this, from, to); 
};
org.antlr.lang.extend(trs.DeleteOp, trs.ReplaceOp);

org.antlr.lang.extend(trs, org.antlr.runtime.CommonTokenStream, {
    init: function() {
        this.programs = {};
        this.programs[trs.DEFAULT_PROGRAM_NAME] = [];
        this.lastRewriteTokenIndexes = {};
    },

    /** Rollback the instruction stream for a program so that
     *  the indicated instruction (via instructionIndex) is no
     *  longer in the stream.  UNTESTED!
     */
    rollback: function() {
        var programName,
            instructionIndex;

        if (arguments.length===1) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            instructionIndex = arguments[0];
        } else if (arguments.length===2) {
            programName = arguments[0];
            instructionIndex = arguments[1];
        }
        var is = this.programs[programName];
        if (is) {
            programs[programName] = is.slice(trs.MIN_TOKEN_INDEX, this.instructionIndex);
        }
    },

    /** Reset the program so that no instructions exist */
    deleteProgram: function(programName) {
        programName = programName || trs.DEFAULT_PROGRAM_NAME;
        this.rollback(programName, trs.MIN_TOKEN_INDEX);
    },

    /** Add an instruction to the rewrite instruction list ordered by
     *  the instruction number (use a binary search for efficiency).
     *  The list is ordered so that toString() can be done efficiently.
     *
     *  When there are multiple instructions at the same index, the instructions
     *  must be ordered to ensure proper behavior.  For example, a delete at
     *  index i must kill any replace operation at i.  Insert-before operations
     *  must come before any replace / delete instructions.  If there are
     *  multiple insert instructions for a single index, they are done in
     *  reverse insertion order so that "insert foo" then "insert bar" yields
     *  "foobar" in front rather than "barfoo".  This is convenient because
     *  I can insert new InsertOp instructions at the index returned by
     *  the binary search.  A ReplaceOp kills any previous replace op.  Since
     *  delete is the same as replace with null text, i can check for
     *  ReplaceOp and cover DeleteOp at same time. :)
     */
    addToSortedRewriteList: function() {
        var programName,
            op;
        if (arguments.length===1) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            op = arguments[0];
        } else if (arguments.length===2) {
            programName = arguments[0];
            op = arguments[1];
        }

        var rewrites = this.getProgram(programName);
        var len, pos, searchOp, replaced, prevOp, i;
        for (pos=0, len=rewrites.length; pos<len; pos++) {
            searchOp = rewrites[pos];
            if (searchOp.index===op.index) {
                // now pos is the index in rewrites of first op with op.index

                // an instruction operating already on that index was found;
                // make this one happen after all the others
                if (op instanceof trs.ReplaceOp) {
                    replaced = false;
                    // look for an existing replace
                    for (i=pos; i<rewrites.length; i++) {
                        prevOp = rewrites[pos];
                        if (prevOp.index!==op.index) {
                            break;
                        }
                        if (prevOp instanceof trs.ReplaceOp) {
                            rewrites[pos] = op; // replace old with new
                            replaced=true;
                            break;
                        }
                        // keep going; must be an insert
                    }
                    if ( !replaced ) {
                        // add replace op to the end of all the inserts
                        rewrites.splice(i, 0, op);
                    }
                } else {
                    // inserts are added in front of existing inserts
                    rewrites.splice(pos, 0, op);
                }
                break;
            } else if (searchOp.index > op.index) {
                rewrites.splice(pos, 0, op);
                break;
            }
        }
        if (pos===len) {
            rewrites.push(op);
        }
    },

    insertAfter: function() {
        var index, programName, text;
        if (arguments.length===2) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            index = arguments[0];
            text = arguments[1];
        } else if (arguments.length===3) {
            programName = arguments[0];
            index = arguments[1];
            text = arguments[2];
        }

        if (index instanceof org.antlr.runtime.CommonToken) {
            // index is a Token, grab it's stream index
            index = index.index; // that's ugly
        }

        // insert after is the same as insert before the next index
        this.insertBefore(programName, index+1, text);
    },

    insertBefore: function() {
        var index, programName, text;
        if (arguments.length===2) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            index = arguments[0];
            text = arguments[1];
        } else if (arguments.length===3) {
            programName = arguments[0];
            index = arguments[1];
            text = arguments[2];
        }

        if (index instanceof org.antlr.runtime.CommonToken) {
            // index is a Token, grab it's stream index
            index = index.index; // that's ugly
        }

        this.addToSortedRewriteList(
                programName,
                new trs.InsertBeforeOp(index,text)
                );
    },

    replace: function() {
        var programName, first, last, text;
        if (arguments.length===2) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            first = arguments[0];
            last = arguments[0];
            text = arguments[1];
        } else if (arguments.length===3) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            first = arguments[0];
            last = arguments[1];
            text = arguments[2];
        } if (arguments.length===4) {
            programName = arguments[0];
            first = arguments[1];
            last = arguments[2];
            text = arguments[3];
        } 

        if (first instanceof org.antlr.runtime.CommonToken) {
            first = first.index;
        }

        if (last instanceof org.antlr.runtime.CommonToken) {
            last = last.index; // that's ugly
        }

        if ( first > last || last<0 || first<0 ) {
            return;
        }
        this.addToSortedRewriteList(
                programName,
                new trs.ReplaceOp(first, last, text));
    },

    // !!! API Break: delete is a JS keyword, so using remove instead.
    remove: function() {
        // convert arguments to a real array
        var args=[], i=arguments.length-1;
        while (i>=0) {
            args[i] = arguments[i];
            i--;
        }

        args.push("");
        this.replace.apply(this, args);
    },

    getLastRewriteTokenIndex: function(programName) {
        programName = programName || trs.DEFAULT_PROGRAM_NAME;
        return this.lastRewriteTokenIndexes[programName] || -1;
    },

    setLastRewriteTokenIndex: function(programName, i) {
        this.lastRewriteTokenIndexes[programName] = i;
    },

    getProgram: function(name) {
        var is = this.programs[name];
        if ( !is ) {
            is = this.initializeProgram(name);
        }
        return is;
    },

    initializeProgram: function(name) {
        var is = [];
        this.programs[name] = is;
        return is;
    },

    toOriginalString: function(start, end) {
        if (!org.antlr.lang.isNumber(start)) {
            start = trs.MIN_TOKEN_INDEX;
        }
        if (!org.antlr.lang.isNumber(end)) {
            end = this.size()-1;
        }

        var buf = [], i;
        for (i=start; i>=trs.MIN_TOKEN_INDEX && i<=end && i<this.tokens.length; i++) {
            buf.push(this.get(i).getText());
        }
        return buf.join("");
    },

    toString: function() {
        var programName, start, end;
        if (arguments.length===0) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            start = trs.MIN_TOKEN_INDEX;
            end = this.size() - 1;
        } else if (arguments.length===1) {
            programName = arguments[0];
            start = trs.MIN_TOKEN_INDEX;
            end = this.size() - 1;
        } else if (arguments.length===2) {
            programName = trs.DEFAULT_PROGRAM_NAME;
            start = arguments[0];
            end = arguments[1];
        }

        var rewrites = this.programs[programName];
        if ( !rewrites || rewrites.length===0 ) {
            return this.toOriginalString(start,end);
        }

        /// Index of first rewrite we have not done
        var rewriteOpIndex = 0,
            tokenCursor=start,
            buf = [],
            op;
        while ( tokenCursor>=trs.MIN_TOKEN_INDEX &&
                tokenCursor<=end &&
                tokenCursor<this.tokens.length )
        {
            // execute instructions associated with this token index
            if ( rewriteOpIndex<rewrites.length ) {
                op = rewrites[rewriteOpIndex];

                // skip all ops at lower index
                while (op.index<tokenCursor && rewriteOpIndex<rewrites.length) {
                    rewriteOpIndex++;
                    if ( rewriteOpIndex<rewrites.length ) {
                        op = rewrites[rewriteOpIndex];
                    }
                }

                // while we have ops for this token index, exec them
                while (tokenCursor===op.index && rewriteOpIndex<rewrites.length) {
                    //System.out.println("execute "+op+" at instruction "+rewriteOpIndex);
                    tokenCursor = op.execute(buf);
                    //System.out.println("after execute tokenCursor = "+tokenCursor);
                    rewriteOpIndex++;
                    if ( rewriteOpIndex<rewrites.length ) {
                        op = rewrites[rewriteOpIndex];
                    }
                }
            }
            // dump the token at this index
            if ( tokenCursor<=end ) {
                buf.push(this.get(tokenCursor).getText());
                tokenCursor++;
            }
        }
        // now see if there are operations (append) beyond last token index
        var opi;
        for (opi=rewriteOpIndex; opi<rewrites.length; opi++) {
            op = rewrites[opi];
            if ( op.index>=this.size() ) {
                op.execute(buf); // must be insertions if after last token
            }
        }

        return buf.join("");
    },

    toDebugString: function(start, end) {
        if (!org.antlr.lang.isNumber(start)) {
            start = trs.MIN_TOKEN_INDEX;
        }
        if (!org.antlr.lang.isNumber(end)) {
            end = this.size()-1;
        }

        var buf = [],
            i;
        for (i=start; i>=trs.MIN_TOKEN_INDEX && i<=end && i<this.tokens.length; i++) {
            buf.push(this.get(i));
        }
        return buf.join("");
    }
});

})();
/** A stream of tree nodes, accessing nodes from a tree of some kind */
org.antlr.runtime.tree.TreeNodeStream = function() {};
/** A buffered stream of tree nodes.  Nodes can be from a tree of ANY kind.
 *
 *  This node stream sucks all nodes out of the tree specified in
 *  the constructor during construction and makes pointers into
 *  the tree using an array of Object pointers. The stream necessarily
 *  includes pointers to DOWN and UP and EOF nodes.
 *
 *  This stream knows how to mark/release for backtracking.
 *
 *  This stream is most suitable for tree interpreters that need to
 *  jump around a lot or for tree parsers requiring speed (at cost of memory).
 *  There is some duplicated functionality here with UnBufferedTreeNodeStream
 *  but just in bookkeeping, not tree walking etc...
 *
 *  @see UnBufferedTreeNodeStream
 */
org.antlr.runtime.tree.CommonTreeNodeStream = function(adaptor,
                                                    tree,
                                                    initialBufferSize)
{
    if (arguments.length===1) {
        tree = adaptor;
        adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();
    }
    if (arguments.length <= 2) {
        initialBufferSize =
            org.antlr.runtime.tree.CommonTreeNodeStream.DEFAULT_INITIAL_BUFFER_SIZE;
    }

    /** Reuse same DOWN, UP navigation nodes unless this is true */
    this.uniqueNavigationNodes = false;

    /** The index into the nodes list of the current node (next node
     *  to consume).  If -1, nodes array not filled yet.
     */
    this.p = -1;

    var Token = org.antlr.runtime.Token;
    this.root = tree;
    this.adaptor = adaptor;
    this.nodes = []; //new ArrayList(initialBufferSize);
    this.down = this.adaptor.create(Token.DOWN, "DOWN");
    this.up = this.adaptor.create(Token.UP, "UP");
    this.eof = this.adaptor.create(Token.EOF, "EOF");
};

org.antlr.lang.augmentObject(org.antlr.runtime.tree.CommonTreeNodeStream, {
    DEFAULT_INITIAL_BUFFER_SIZE: 100,
    INITIAL_CALL_STACK_SIZE: 10
});

org.antlr.lang.extend(org.antlr.runtime.tree.CommonTreeNodeStream,
                  org.antlr.runtime.tree.TreeNodeStream, 
{
    StreamIterator: function() {
        var i = 0,
            nodes = this.nodes,
            eof = this.eof;

        return {
            hasNext: function() {
                return i<nodes.length;
            },

            next: function() {
                var current = i;
                i++;
                if ( current < nodes.length ) {
                    return nodes[current];
                }
                return eof;
            },

            remove: function() {
                throw new Error("cannot remove nodes from stream");
            }
        };
    },

    /** Walk tree with depth-first-search and fill nodes buffer.
     *  Don't do DOWN, UP nodes if its a list (t is isNil).
     */
    fillBuffer: function(t) {
        var reset_p = false;
        if (org.antlr.lang.isUndefined(t)) {
            t = this.root;
            reset_p = true;
        }

        var nil = this.adaptor.isNil(t);
        if ( !nil ) {
            this.nodes.push(t); // add this node
        }
        // add DOWN node if t has children
        var n = this.adaptor.getChildCount(t);
        if ( !nil && n>0 ) {
            this.addNavigationNode(org.antlr.runtime.Token.DOWN);
        }
        // and now add all its children
        var c, child;
        for (c=0; c<n; c++) {
            child = this.adaptor.getChild(t,c);
            this.fillBuffer(child);
        }
        // add UP node if t has children
        if ( !nil && n>0 ) {
            this.addNavigationNode(org.antlr.runtime.Token.UP);
        }

        if (reset_p) {
            this.p = 0; // buffer of nodes intialized now
        }
    },

    getNodeIndex: function(node) {
        if ( this.p==-1 ) {
            this.fillBuffer();
        }
        var i, t;
        for (i=0; i<this.nodes.length; i++) {
            t = this.nodes[i];
            if ( t===node ) {
                return i;
            }
        }
        return -1;
    },

    /** As we flatten the tree, we use UP, DOWN nodes to represent
     *  the tree structure.  When debugging we need unique nodes
     *  so instantiate new ones when uniqueNavigationNodes is true.
     */
    addNavigationNode: function(ttype) {
        var navNode = null;
        if ( ttype===org.antlr.runtime.Token.DOWN ) {
            if ( this.hasUniqueNavigationNodes() ) {
                navNode = this.adaptor.create(org.antlr.runtime.Token.DOWN, "DOWN");
            }
            else {
                navNode = this.down;
            }
        }
        else {
            if ( this.hasUniqueNavigationNodes() ) {
                navNode = this.adaptor.create(org.antlr.runtime.Token.UP, "UP");
            }
            else {
                navNode = this.up;
            }
        }
        this.nodes.push(navNode);
    },

    get: function(i) {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        return this.nodes[i];
    },

    LT: function(k) {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        if ( k===0 ) {
            return null;
        }
        if ( k<0 ) {
            return this.LB(-1*k);
        }
        if ( (this.p+k-1) >= this.nodes.length ) {
            return this.eof;
        }
        return this.nodes[this.p+k-1];
    },

    getCurrentSymbol: function() { return this.LT(1); },

    /** Look backwards k nodes */
    LB: function(k) {
        if ( k===0 ) {
            return null;
        }
        if ( (this.p-k)<0 ) {
            return null;
        }
        return this.nodes[this.p-k];
    },

    getTreeSource: function() {
        return this.root;
    },

    getSourceName: function() {
        return this.getTokenStream().getSourceName();
    },

    getTokenStream: function() {
        return this.tokens;
    },

    setTokenStream: function(tokens) {
        this.tokens = tokens;
    },

    getTreeAdaptor: function() {
        return this.adaptor;
    },

    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },

    hasUniqueNavigationNodes: function() {
        return this.uniqueNavigationNodes;
    },

    setUniqueNavigationNodes: function(uniqueNavigationNodes) {
        this.uniqueNavigationNodes = uniqueNavigationNodes;
    },

    consume: function() {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        this.p++;
    },

    LA: function(i) {
        return this.adaptor.getType(this.LT(i));
    },

    mark: function() {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        this.lastMarker = this.index();
        return this.lastMarker;
    },

    release: function(marker) {
        // no resources to release
    },

    index: function() {
        return this.p;
    },

    rewind: function(marker) {
        if (!org.antlr.lang.isNumber(marker)) {
            marker = this.lastMarker;
        }
        this.seek(marker);
    },

    seek: function(index) {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        this.p = index;
    },

    /** Make stream jump to a new location, saving old location.
     *  Switch back with pop().
     */
    push: function(index) {
        if ( !this.calls ) {
            this.calls = [];
        }
        this.calls.push(this.p); // save current index
        this.seek(index);
    },

    /** Seek back to previous index saved during last push() call.
     *  Return top of stack (return index).
     */
    pop: function() {
        var ret = this.calls.pop();
        this.seek(ret);
        return ret;
    },

    reset: function() {
        this.p = -1;
        this.lastMarker = 0;
        if (this.calls) {
            this.calls = [];
        }
    },

    size: function() {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        return this.nodes.length;
    },

    iterator: function() {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        return this.StreamIterator();
    },

    replaceChildren: function(parent, startChildIndex, stopChildIndex, t) {
        if ( parent ) {
            this.adaptor.replaceChildren(parent, startChildIndex, stopChildIndex, t);
        }
    },

    /** Debugging */
    toTokenString: function(start, stop) {
        if ( this.p===-1 ) {
            this.fillBuffer();
        }
        var buf='', i, t;
        for (i = start; i < this.nodes.length && i <= stop; i++) {
            t = this.nodes[i];
            buf += " "+this.adaptor.getToken(t);
        }
        return buf;
    },

    /** Used for testing, just return the token type stream */
    toString: function(start, stop) {
        var buf = "",
            text,
            t,
            i;
        if (arguments.length===0) {
            if ( this.p===-1 ) {
                this.fillBuffer();
            }
            for (i = 0; i < this.nodes.length; i++) {
                t = this.nodes[i];
                buf += " ";
                buf += this.adaptor.getType(t);
            }
            return buf;
        } else {
            if ( !org.antlr.lang.isNumber(start) || !org.antlr.lang.isNumber(stop) ) {
                return null;
            }
            if ( this.p===-1 ) {
                this.fillBuffer();
            }
            //System.out.println("stop: "+stop);
            if ( start instanceof org.antlr.runtime.tree.CommonTree ) {
                //System.out.print("toString: "+((CommonTree)start).getToken()+", ");
            } else {
                //System.out.println(start);
            }
            if ( stop instanceof org.antlr.runtime.tree.CommonTree ) {
                //System.out.println(((CommonTree)stop).getToken());
            } else {
                //System.out.println(stop);
            }
            // if we have the token stream, use that to dump text in order
            var beginTokenIndex,
                endTokenIndex;
            if ( this.tokens ) {
                beginTokenIndex = this.adaptor.getTokenStartIndex(start);
                endTokenIndex = this.adaptor.getTokenStopIndex(stop);
                // if it's a tree, use start/stop index from start node
                // else use token range from start/stop nodes
                if ( this.adaptor.getType(stop)===org.antlr.runtime.Token.UP ) {
                    endTokenIndex = this.adaptor.getTokenStopIndex(start);
                }
                else if ( this.adaptor.getType(stop)==org.antlr.runtime.Token.EOF )
                {
                    endTokenIndex = this.size()-2; // don't use EOF
                }
                return this.tokens.toString(beginTokenIndex, endTokenIndex);
            }
            // walk nodes looking for start
            t = null;
            i = 0;
            for (; i < this.nodes.length; i++) {
                t = this.nodes[i];
                if ( t===start ) {
                    break;
                }
            }
            // now walk until we see stop, filling string buffer with text
            buf = text = "";
            t = this.nodes[i];
            while ( t!==stop ) {
                text = this.adaptor.getText(t);
                if ( !org.antlr.lang.isString(text) ) {
                    text = " "+this.adaptor.getType(t).toString();
                }
                buf += text;
                i++;
                t = nodes[i];
            }
            // include stop node too
            text = this.adaptor.getText(stop);
            if ( !org.antlr.lang.isString(text) ) {
                text = " "+this.adaptor.getType(stop).toString();
            }
            buf += text;
            return buf;
        }
    }
});
/** A generic list of elements tracked in an alternative to be used in
 *  a -> rewrite rule.  We need to subclass to fill in the next() method,
 *  which returns either an AST node wrapped around a token payload or
 *  an existing subtree.
 *
 *  Once you start next()ing, do not try to add more elements.  It will
 *  break the cursor tracking I believe.
 *
 *  @see org.antlr.runtime.tree.RewriteRuleSubtreeStream
 *  @see org.antlr.runtime.tree.RewriteRuleTokenStream
 *
 *  TODO: add mechanism to detect/puke on modification after reading from stream
 */
org.antlr.runtime.tree.RewriteRuleElementStream = function(adaptor, elementDescription, el) {
    /** Cursor 0..n-1.  If singleElement!=null, cursor is 0 until you next(),
     *  which bumps it to 1 meaning no more elements.
     */
    this.cursor = 0;

    /** Once a node / subtree has been used in a stream, it must be dup'd
     *  from then on.  Streams are reset after subrules so that the streams
     *  can be reused in future subrules.  So, reset must set a dirty bit.
     *  If dirty, then next() always returns a dup.
     *
     *  I wanted to use "naughty bit" here, but couldn't think of a way
     *  to use "naughty".
     */
    this.dirty = false;

    this.elementDescription = elementDescription;
    this.adaptor = adaptor;
    if (el) {
        if (org.antlr.lang.isArray(el)) {
            this.singleElement = null;
            this.elements = el;
        } else {
            this.add(el);
        }
    }
};

org.antlr.runtime.tree.RewriteRuleElementStream.prototype = {
    /** Reset the condition of this stream so that it appears we have
     *  not consumed any of its elements.  Elements themselves are untouched.
     *  Once we reset the stream, any future use will need duplicates.  Set
     *  the dirty bit.
     */
    reset: function() {
        this.cursor = 0;
        this.dirty = true;
    },

    add: function(el) {
        if ( !org.antlr.lang.isValue(el) ) {
            return;
        }
        if ( this.elements ) { // if in list, just add
            this.elements.push(el);
            return;
        }
        if ( !org.antlr.lang.isValue(this.singleElement) ) { // no elements yet, track w/o list
            this.singleElement = el;
            return;
        }
        // adding 2nd element, move to list
        this.elements = [];
        this.elements.push(this.singleElement);
        this.singleElement = null;
        this.elements.push(el);
    },

    /** Return the next element in the stream.  If out of elements, throw
     *  an exception unless size()==1.  If size is 1, then return elements[0].
     *  Return a duplicate node/subtree if stream is out of elements and
     *  size==1.  If we've already used the element, dup (dirty bit set).
     */
    nextTree: function() {
        var n = this.size(),
            el;
        if ( this.dirty || (this.cursor>=n && n==1) ) {
            // if out of elements and size is 1, dup
            el = this._next();
            return this.dup(el);
        }
        // test size above then fetch
        el = this._next();
        return el;
    },

    /** do the work of getting the next element, making sure that it's
     *  a tree node or subtree.  Deal with the optimization of single-
     *  element list versus list of size > 1.  Throw an exception
     *  if the stream is empty or we're out of elements and size>1.
     *  protected so you can override in a subclass if necessary.
     */
    _next: function() {
        var n = this.size();
        if (n===0) {
            throw new org.antlr.runtime.tree.RewriteEmptyStreamException(this.elementDescription);
        }
        if ( this.cursor>= n) { // out of elements?
            if ( n===1 ) {  // if size is 1, it's ok; return and we'll dup
                return this.toTree(this.singleElement);
            }
            // out of elements and size was not 1, so we can't dup
            throw new org.antlr.runtime.tree.RewriteCardinalityException(this.elementDescription);
        }
        // we have elements
        if ( org.antlr.lang.isValue(this.singleElement) ) {
            this.cursor++; // move cursor even for single element list
            return this.toTree(this.singleElement);
        }
        // must have more than one in list, pull from elements
        var o = this.toTree(this.elements[this.cursor]);
        this.cursor++;
        return o;
    },

    /** Ensure stream emits trees; tokens must be converted to AST nodes.
     *  AST nodes can be passed through unmolested.
     */
    toTree: function(el) {
        if (el && el.getTree) {
            return el.getTree();
        }
        return el;
    },

    hasNext: function() {
         return (org.antlr.lang.isValue(this.singleElement) && this.cursor < 1) ||
               (this.elements && this.cursor < this.elements.length);
    },

    size: function() {
        var n = 0;
        if ( org.antlr.lang.isValue(this.singleElement) ) {
            n = 1;
        }
        if ( this.elements ) {
            return this.elements.length;
        }
        return n;
    },

    getDescription: function() {
        return this.elementDescription;
    }
};
/** Queues up nodes matched on left side of -> in a tree parser. This is
 *  the analog of RewriteRuleTokenStream for normal parsers. 
 */
org.antlr.runtime.tree.RewriteRuleNodeStream = function(adaptor, elementDescription, el) {
    org.antlr.runtime.tree.RewriteRuleNodeStream.superclass.constructor.apply(this, arguments);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteRuleNodeStream,
                  org.antlr.runtime.tree.RewriteRuleElementStream,
{
    nextNode: function() {
        return this._next();
    },

    toTree: function(el) {
        return this.adaptor.dupNode(el);
    },

    dup: function() {
        // we dup every node, so don't have to worry about calling dup; short-
        // circuited next() so it doesn't call.
        throw new Error("dup can't be called for a node stream.");
    }
});
org.antlr.runtime.tree.RewriteRuleTokenStream = function(adaptor, elementDescription, el) {
    var sup = org.antlr.runtime.tree.RewriteRuleTokenStream.superclass;
    sup.constructor.apply(this, arguments);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteRuleTokenStream,
                  org.antlr.runtime.tree.RewriteRuleElementStream, {
    /** Get next token from stream and make a node for it */
    nextNode: function() {
        var t = this._next();
        return this.adaptor.create(t);
    },

    nextToken: function() {
        return this._next();
    },

    /** Don't convert to a tree unless they explicitly call nextTree.
     *  This way we can do hetero tree nodes in rewrite.
     */
    toTree: function(el) {
        return el;
    },

    dup: function(el) {
        throw new Error("dup can't be called for a token stream.");
    }
});
org.antlr.runtime.tree.RewriteRuleSubtreeStream = function() {
    var sup = org.antlr.runtime.tree.RewriteRuleSubtreeStream.superclass;
    sup.constructor.apply(this, arguments);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteRuleSubtreeStream,
                  org.antlr.runtime.tree.RewriteRuleElementStream, {
	/** Treat next element as a single node even if it's a subtree.
	 *  This is used instead of next() when the result has to be a
	 *  tree root node.  Also prevents us from duplicating recently-added
	 *  children; e.g., ^(type ID)+ adds ID to type and then 2nd iteration
	 *  must dup the type node, but ID has been added.
	 *
	 *  Referencing a rule result twice is ok; dup entire tree as
	 *  we can't be adding trees as root; e.g., expr expr.
	 *
	 *  Hideous code duplication here with super.next().  Can't think of
	 *  a proper way to refactor.  This needs to always call dup node
	 *  and super.next() doesn't know which to call: dup node or dup tree.
	 */
    nextNode: function() {
		var n = this.size(),
            el;
		if ( this.dirty || (this.cursor>=n && n===1) ) {
			// if out of elements and size is 1, dup (at most a single node
			// since this is for making root nodes).
			el = this._next();
			return this.adaptor.dupNode(el);
		}
		// test size above then fetch
		el = this._next();
		return el;
	},

    dup: function(el) {
		return this.adaptor.dupTree(el);
	}
});/** A generic recognizer that can handle recognizers generated from
 *  lexer, parser, and tree grammars.  This is all the parsing
 *  support code essentially; most of it is error recovery stuff and
 *  backtracking.
 *
 *  <p>This class should not be instantiated directly.  Instead, use one of its
 *  subclasses.</p>
 *
 *  @class
 *  @param {org.antlr.runtime.RecognizerSharedState} [state] optional state object
 *      with which to initialize this recognizer.
 */
org.antlr.runtime.BaseRecognizer = function(state) {
    /** State of a lexer, parser, or tree parser are collected into a state
     *  object so the state can be shared.  This sharing is needed to
     *  have one grammar import others and share same error variables
     *  and other state variables.  It's a kind of explicit multiple
     *  inheritance via delegation of methods and shared state.
     */
    this.state = state || new org.antlr.runtime.RecognizerSharedState();
};

/* static vars, methods */
org.antlr.lang.augmentObject(org.antlr.runtime.BaseRecognizer, {
    MEMO_RULE_FAILED: -2,
    MEMO_RULE_UNKNOWN: -1,
    INITIAL_FOLLOW_STACK_SIZE: 100,
    MEMO_RULE_FAILED_I: -2,
    DEFAULT_TOKEN_CHANNEL: org.antlr.runtime.Token.DEFAULT_CHANNEL,
    HIDDEN: org.antlr.runtime.Token.HIDDEN_CHANNEL,
    NEXT_TOKEN_RULE_NAME: "nextToken"
});

org.antlr.runtime.BaseRecognizer.prototype = {
    /** Reset the parser's state.  Subclasses must rewinds the input stream */
    reset: function() {
        var i, len;

        // wack everything related to error recovery
        if (!this.state) {
            return; // no shared state work to do
        }
        this.state._fsp = -1;
        this.state.errorRecovery = false;
        this.state.lastErrorIndex = -1;
        this.state.failed = false;
        this.state.syntaxErrors = 0;
        // wack everything related to backtracking and memoization
        this.state.backtracking = 0;
        // wipe cache
        if (this.state.ruleMemo) {
            for (i=0, len=this.state.ruleMemo.length; i<len; i++) {
                this.state.ruleMemo[i] = null;
            }
        }
    },

    /** Match current input symbol against ttype.  Attempt
     *  single token insertion or deletion error recovery.  If
     *  that fails, throw {@link org.antlr.runtime.MismatchedTokenException}.
     *
     *  <p>To turn off single token insertion or deletion error
     *  recovery, override {@link #mismatchRecover} and have it call
     *  plain {@link #mismatch}, which does not recover.  Then any error
     *  in a rule will cause an exception and immediate exit from
     *  rule.  Rule would recover by resynchronizing to the set of
     *  symbols that can follow rule ref.</p>
     *
     *  @param {org.antlr.runtime.IntStream} input input stream to match against.
     *  @param {Number} ttype  input type to match.
     *  @param {org.antlr.runtime.BitSet} [follow] set of tokens that can follow the
     *      matched token.
     *  @returns {Object} the matched symbol
     */
    match: function(input, ttype, follow) {
        var matchedSymbol = this.getCurrentInputSymbol(input);
        if ( input.LA(1)===ttype ) {
            input.consume();
            this.state.errorRecovery = false;
            this.state.failed = false;
            return matchedSymbol;
        }
        if ( this.state.backtracking>0 ) {
            this.state.failed = true;
            return matchedSymbol;
        }
        matchedSymbol = this.recoverFromMismatchedToken(input, ttype, follow);
        return matchedSymbol;
    },

    /**
     * Match any token.
     * @param {org.antlr.runtime.IntStream} input input stream to match against.
     */
    matchAny: function(input) {
        this.state.errorRecovery = false;
        this.state.failed = false;
        input.consume();
    },

    /**
     * Is the following token (LA(2)) the unwanted type (ttype)?
     * @param {org.antlr.runtime.IntStream} input input stream to match against.
     * @param {Number} ttype the undesired token type.
     * @returns {Boolean} true if and only if the following token is the
     *      unwanted type.
     */
    mismatchIsUnwantedToken: function(input, ttype) {
        return input.LA(2)===ttype;
    },

    /**
     * Does the stream appear to be missing a single token?
     * @param {org.antlr.runtime.IntStream} input input stream to match against.
     * @param {org.antlr.runtime.BitSet} [follow] set of tokens that can follow the
     *      matched token.
     * @returns {Boolean} true if and only if it appears that the stream is
     *      missing a single token.
     */
    mismatchIsMissingToken: function(input, follow) {
        if ( !follow ) {
            // we have no information about the follow; we can only consume
            // a single token and hope for the best
            return false;
        }
        // compute what can follow this grammar element reference
        if ( follow.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE) ) {
            if ( this.state._fsp>=0 ) { // remove EOR if we're not the start symbol
                follow.remove(org.antlr.runtime.Token.EOR_TOKEN_TYPE);
            }
            var viableTokensFollowingThisRule = this.computeContextSensitiveRuleFOLLOW();
            follow = follow.or(this.viableTokensFollowingThisRule);
        }
        // if current token is consistent with what could come after set
        // then we know we're missing a token; error recovery is free to
        // "insert" the missing token

        // BitSet cannot handle negative numbers like -1 (EOF) so I leave EOR
        // in follow set to indicate that the fall of the start symbol is
        // in the set (EOF can follow).
        if ( follow.member(input.LA(1)) ||
             follow.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE) )
        {
            return true;
        }
        return false;
    },

    /** Factor out what to do upon token mismatch so tree parsers can behave
     *  differently.  Override and call {@link #mismatchRecover}
     *  to get single token insertion and deletion.
     *
     *  @param {org.antlr.runtime.IntStream} input input stream to match against.
     *  @param {Number} ttype  input type to match.
     *  @param {org.antlr.runtime.BitSet} [follow] set of tokens that can follow the
     *      matched token.
     */
    mismatch: function(input, ttype, follow) {
        if ( this.mismatchIsUnwantedToken(input, ttype) ) {
            throw new org.antlr.runtime.UnwantedTokenException(ttype, input);
        } else if ( this.mismatchIsMissingToken(input, follow) ) {
            throw new org.antlr.runtime.MissingTokenException(ttype, input, null);
        }
        throw new org.antlr.runtime.MismatchedTokenException(ttype, input);
    },

    /** Report a recognition problem.
     *
     *  <p>This method sets errorRecovery to indicate the parser is recovering
     *  not parsing.  Once in recovery mode, no errors are generated.
     *  To get out of recovery mode, the parser must successfully match
     *  a token (after a resync).  So it will go:</p>
     *  <ol>
     *      <li>error occurs</li>
     *      <li>enter recovery mode, report error</li>
     *      <li>consume until token found in resynch set</li>
     *      <li>try to resume parsing</li>
     *      <li>next match() will reset errorRecovery mode</li>
     *  </ol>
     *
     *  <p>If you override, make sure to update this.state.syntaxErrors if you
     *  care about that.</p>
     *  @param {org.antlr.runtime.RecognitionException} e the error to be reported.
     */
    reportError: function(e) {
      if(this.input.size() != 0) {
        var token = this.input.get(e.index);
        var errorMessage = "";
        var column = 0;
        var line = 0;
        if(token.getType() == -1) {
          token = this.input.get(this.input.size() - 1);
        }
        errorMessage = this.getErrorMessage(e, this.getTokenNames());
        column = token.getStartIndex();
        line = token.getLine() - 1;

        var error = {
          line: line,
          message: errorMessage,
          column: column
        };
        this.addError(error);
      }
        // if we've already reported an error and have not matched a token
        // yet successfully, don't report any errors.
        if ( this.state.errorRecovery ) {
            return;
        }
        this.state.syntaxErrors++;
        this.state.errorRecovery = true;

        this.displayRecognitionError(this.getTokenNames(), e);
    },

    /**
     * Assemble recognition error message.
     * @param {Array} tokenNames array of token names (strings).
     * @param {org.antlr.runtime.RecognitionException} e the error to be reported.
     */
    displayRecognitionError: function(tokenNames, e) {
        var hdr = this.getErrorHeader(e),
            msg = this.getErrorMessage(e, tokenNames);
        this.emitErrorMessage(hdr+" "+msg);
    },

    /**
     * Create error header message.  Format is <q>line
     * lineNumber:positionInLine</q>.
     * @param {org.antlr.runtime.RecognitionException} e the error to be reported.
     * @returns {String} The error header.
     */
    getErrorHeader: function(e) {
        /* handle null input */
        if (!org.antlr.lang.isNumber(e.line)) {
            e.line = 0;
        }
        return "line "+e.line+":"+e.charPositionInLine;
    },

    /**
     * Override this method to change where error messages go.
     * Defaults to "alert"-ing the error in browsers and "print"-ing the error
     * in other environments (e.g. Rhino, SpiderMonkey).
     * @param {String} msg the error message to be displayed.
     */
    emitErrorMessage: function(msg) {
      //throw msg;
      console.log(msg);
    },

    /** What error message should be generated for the various
     *  exception types?
     *
     *  <p>Not very object-oriented code, but I like having all error message
     *  generation within one method rather than spread among all of the
     *  exception classes. This also makes it much easier for the exception
     *  handling because the exception classes do not have to have pointers back
     *  to this object to access utility routines and so on. Also, changing
     *  the message for an exception type would be difficult because you
     *  would have to be subclassing exceptions, but then somehow get ANTLR
     *  to make those kinds of exception objects instead of the default.</p>
     *
     *  <p>For grammar debugging, you will want to override this to add
     *  more information such as the stack frame and no viable alts.</p>
     *
     *  <p>Override this to change the message generated for one or more
     *  exception types.</p>
     *
     * @param {Array} tokenNames array of token names (strings).
     * @param {org.antlr.runtime.RecognitionException} e the error to be reported.
     * @returns {String} the error message to be emitted.
     */
    getErrorMessage: function(e, tokenNames) {
        var msg = (e && e.getMessage) ? e.getMessage() : null,
            mte,
            tokenName;
        if ( e instanceof org.antlr.runtime.UnwantedTokenException ) {
            var ute = e;
            tokenName="<unknown>";
            if ( ute.expecting== org.antlr.runtime.Token.EOF ) {
                tokenName = "EOF";
            } else {
                tokenName = tokenNames[ute.expecting];
            }
            msg = "extraneous input "+this.getTokenErrorDisplay(ute.getUnexpectedToken())+
                " expecting "+tokenName;
        }
        else if ( e instanceof org.antlr.runtime.MissingTokenException ) {
            mte = e;
            tokenName="<unknown>";
            if ( mte.expecting== org.antlr.runtime.Token.EOF ) {
                tokenName = "EOF";
            } else {
                tokenName = tokenNames[mte.expecting];
            }
            msg = "missing "+tokenName+" at "+this.getTokenErrorDisplay(e.token);
        }
        else if ( e instanceof org.antlr.runtime.MismatchedTokenException ) {
            mte = e;
            tokenName="<unknown>";
            if ( mte.expecting== org.antlr.runtime.Token.EOF ) {
                tokenName = "EOF";
            }
            else {
                tokenName = tokenNames[mte.expecting];
            }
            msg = "mismatched input "+this.getTokenErrorDisplay(e.token)+
                " expecting "+tokenName;
        }
        else if ( e instanceof org.antlr.runtime.NoViableAltException ) {
            msg = "no viable alternative at input "+this.getTokenErrorDisplay(e.token);
        }
        else if ( e instanceof org.antlr.runtime.EarlyExitException ) {
            msg = "required (...)+ loop did not match anything at input "+
                this.getTokenErrorDisplay(e.token);
        }
        else if ( e instanceof org.antlr.runtime.MismatchedSetException ) {
            msg = "mismatched input "+this.getTokenErrorDisplay(e.token)+
                " expecting set "+e.expecting;
        }
        else if ( e instanceof org.antlr.runtime.MismatchedNotSetException ) {
            msg = "mismatched input "+this.getTokenErrorDisplay(e.token)+
                " expecting set "+e.expecting;
        }
        else if ( e instanceof org.antlr.runtime.FailedPredicateException ) {
            msg = "rule "+e.ruleName+" failed predicate: {"+
                e.predicateText+"}?";
        }
        return msg;
    },

    /** Get number of recognition errors (lexer, parser, tree parser).  Each
     *  recognizer tracks its own number.  So parser and lexer each have
     *  separate count.  Does not count the spurious errors found between
     *  an error and next valid token match
     *
     *  See also reportError()
     */
    getNumberOfSyntaxErrors: function() {
        return this.state.syntaxErrors;
    },

    /** How should a token be displayed in an error message? The default
     *  is to display just the text, but during development you might
     *  want to have a lot of information spit out.  Override in that case
     *  to use t.toString() (which, for CommonToken, dumps everything about
     *  the token). This is better than forcing you to override a method in
     *  your token objects because you don't have to go modify your lexer
     *  so that it creates a new Java type.
     */
    getTokenErrorDisplay: function(t) {
        var s = t.getText();
        if ( !org.antlr.lang.isValue(s) ) {
            if ( t.getType()==org.antlr.runtime.Token.EOF ) {
                s = "<EOF>";
            }
            else {
                s = "<"+t.getType()+">";
            }
        }
        s = s.replace(/\n/g,"\\n");
        s = s.replace(/\r/g,"\\r");
        s = s.replace(/\t/g,"\\t");
        return "'"+s+"'";
    },

    /** Recover from an error found on the input stream.  This is
     *  for NoViableAlt and mismatched symbol exceptions.  If you enable
     *  single token insertion and deletion, this will usually not
     *  handle mismatched symbol exceptions but there could be a mismatched
     *  token that the match() routine could not recover from.
     */
    recover: function(input, re) {
        if ( this.state.lastErrorIndex==input.index() ) {
            // uh oh, another error at same token index; must be a case
            // where LT(1) is in the recovery token set so nothing is
            // consumed; consume a single token so at least to prevent
            // an infinite loop; this is a failsafe.
            input.consume();
        }
        this.state.lastErrorIndex = input.index();
        var followSet = this.computeErrorRecoverySet();
        this.beginResync();
        this.consumeUntil(input, followSet);
        this.endResync();
    },

    /** A hook to listen in on the token consumption during error recovery.
     *  The DebugParser subclasses this to fire events to the listenter.
     */
    beginResync: function() {
    },

    endResync: function() {
    },

    /*  Compute the error recovery set for the current rule.  During
     *  rule invocation, the parser pushes the set of tokens that can
     *  follow that rule reference on the stack; this amounts to
     *  computing FIRST of what follows the rule reference in the
     *  enclosing rule. This local follow set only includes tokens
     *  from within the rule; i.e., the FIRST computation done by
     *  ANTLR stops at the end of a rule.
     *
     *  EXAMPLE
     *
     *  When you find a "no viable alt exception", the input is not
     *  consistent with any of the alternatives for rule r.  The best
     *  thing to do is to consume tokens until you see something that
     *  can legally follow a call to r *or* any rule that called r.
     *  You don't want the exact set of viable next tokens because the
     *  input might just be missing a token--you might consume the
     *  rest of the input looking for one of the missing tokens.
     *
     *  Consider grammar:
     *
     *  a : '[' b ']'
     *    | '(' b ')'
     *    ;
     *  b : c '^' INT ;
     *  c : ID
     *    | INT
     *    ;
     *
     *  At each rule invocation, the set of tokens that could follow
     *  that rule is pushed on a stack.  Here are the various "local"
     *  follow sets:
     *
     *  FOLLOW(b1_in_a) = FIRST(']') = ']'
     *  FOLLOW(b2_in_a) = FIRST(')') = ')'
     *  FOLLOW(c_in_b) = FIRST('^') = '^'
     *
     *  Upon erroneous input "[]", the call chain is
     *
     *  a -> b -> c
     *
     *  and, hence, the follow context stack is:
     *
     *  depth  local follow set     after call to rule
     *    0         <EOF>                    a (from main())
     *    1          ']'                     b
     *    3          '^'                     c
     *
     *  Notice that ')' is not included, because b would have to have
     *  been called from a different context in rule a for ')' to be
     *  included.
     *
     *  For error recovery, we cannot consider FOLLOW(c)
     *  (context-sensitive or otherwise).  We need the combined set of
     *  all context-sensitive FOLLOW sets--the set of all tokens that
     *  could follow any reference in the call chain.  We need to
     *  resync to one of those tokens.  Note that FOLLOW(c)='^' and if
     *  we resync'd to that token, we'd consume until EOF.  We need to
     *  sync to context-sensitive FOLLOWs for a, b, and c: {']','^'}.
     *  In this case, for input "[]", LA(1) is in this set so we would
     *  not consume anything and after printing an error rule c would
     *  return normally.  It would not find the required '^' though.
     *  At this point, it gets a mismatched token error and throws an
     *  exception (since LA(1) is not in the viable following token
     *  set).  The rule exception handler tries to recover, but finds
     *  the same recovery set and doesn't consume anything.  Rule b
     *  exits normally returning to rule a.  Now it finds the ']' (and
     *  with the successful match exits errorRecovery mode).
     *
     *  So, you cna see that the parser walks up call chain looking
     *  for the token that was a member of the recovery set.
     *
     *  Errors are not generated in errorRecovery mode.
     *
     *  ANTLR's error recovery mechanism is based upon original ideas:
     *
     *  "Algorithms + Data Structures = Programs" by Niklaus Wirth
     *
     *  and
     *
     *  "A note on error recovery in recursive descent parsers":
     *  http://portal.acm.org/citation.cfm?id=947902.947905
     *
     *  Later, Josef Grosch had some good ideas:
     *
     *  "Efficient and Comfortable Error Recovery in Recursive Descent
     *  Parsers":
     *  ftp://www.cocolab.com/products/cocktail/doca4.ps/ell.ps.zip
     *
     *  Like Grosch I implemented local FOLLOW sets that are combined
     *  at run-time upon error to avoid overhead during parsing.
     */
    computeErrorRecoverySet: function() {
        return this.combineFollows(false);
    },


    /** Compute the context-sensitive FOLLOW set for current rule.
     *  This is set of token types that can follow a specific rule
     *  reference given a specific call chain.  You get the set of
     *  viable tokens that can possibly come next (lookahead depth 1)
     *  given the current call chain.  Contrast this with the
     *  definition of plain FOLLOW for rule r:
     *
     *   FOLLOW(r)={x | S=>*alpha r beta in G and x in FIRST(beta)}
     *
     *  where x in T* and alpha, beta in V*; T is set of terminals and
     *  V is the set of terminals and nonterminals.  In other words,
     *  FOLLOW(r) is the set of all tokens that can possibly follow
     *  references to r in *any* sentential form (context).  At
     *  runtime, however, we know precisely which context applies as
     *  we have the call chain.  We may compute the exact (rather
     *  than covering superset) set of following tokens.
     *
     *  For example, consider grammar:
     *
     *  stat : ID '=' expr ';'      // FOLLOW(stat)=={EOF}
     *       | "return" expr '.'
     *       ;
     *  expr : atom ('+' atom)* ;   // FOLLOW(expr)=={';','.',')'}
     *  atom : INT                  // FOLLOW(atom)=={'+',')',';','.'}
     *       | '(' expr ')'
     *       ;
     *
     *  The FOLLOW sets are all inclusive whereas context-sensitive
     *  FOLLOW sets are precisely what could follow a rule reference.
     *  For input input "i=(3);", here is the derivation:
     *
     *  stat => ID '=' expr ';'
     *       => ID '=' atom ('+' atom)* ';'
     *       => ID '=' '(' expr ')' ('+' atom)* ';'
     *       => ID '=' '(' atom ')' ('+' atom)* ';'
     *       => ID '=' '(' INT ')' ('+' atom)* ';'
     *       => ID '=' '(' INT ')' ';'
     *
     *  At the "3" token, you'd have a call chain of
     *
     *    stat -> expr -> atom -> expr -> atom
     *
     *  What can follow that specific nested ref to atom?  Exactly ')'
     *  as you can see by looking at the derivation of this specific
     *  input.  Contrast this with the FOLLOW(atom)={'+',')',';','.'}.
     *
     *  You want the exact viable token set when recovering from a
     *  token mismatch.  Upon token mismatch, if LA(1) is member of
     *  the viable next token set, then you know there is most likely
     *  a missing token in the input stream.  "Insert" one by just not
     *  throwing an exception.
     */
    computeContextSensitiveRuleFOLLOW: function() {
        return this.combineFollows(true);
    },

    combineFollows: function(exact) {
        var top = this.state._fsp,
            i,
            localFollowSet,
            followSet = new org.antlr.runtime.BitSet();
        for (i=top; i>=0; i--) {
            localFollowSet = this.state.following[i];
            followSet.orInPlace(localFollowSet);
            if ( exact ) {
                // can we see end of rule?
                if ( localFollowSet.member(org.antlr.runtime.Token.EOR_TOKEN_TYPE) )
                {
                    // Only leave EOR in set if at top (start rule); this lets
                    // us know if have to include follow(start rule); i.e., EOF
                    if ( i>0 ) {
                        followSet.remove(org.antlr.runtime.Token.EOR_TOKEN_TYPE);
                    }
                }
                else { // can't see end of rule, quit
                    break;
                }
            }
        }
        return followSet;
    },

    /** Attempt to recover from a single missing or extra token.
     *
     *  EXTRA TOKEN
     *
     *  LA(1) is not what we are looking for.  If LA(2) has the right token,
     *  however, then assume LA(1) is some extra spurious token.  Delete it
     *  and LA(2) as if we were doing a normal match(), which advances the
     *  input.
     *
     *  MISSING TOKEN
     *
     *  If current token is consistent with what could come after
     *  ttype then it is ok to "insert" the missing token, else throw
     *  exception For example, Input "i=(3;" is clearly missing the
     *  ')'.  When the parser returns from the nested call to expr, it
     *  will have call chain:
     *
     *    stat -> expr -> atom
     *
     *  and it will be trying to match the ')' at this point in the
     *  derivation:
     *
     *       => ID '=' '(' INT ')' ('+' atom)* ';'
     *                          ^
     *  match() will see that ';' doesn't match ')' and report a
     *  mismatched token error.  To recover, it sees that LA(1)==';'
     *  is in the set of tokens that can follow the ')' token
     *  reference in rule atom.  It can assume that you forgot the ')'.
     */
    recoverFromMismatchedToken: function(input,
                                         ttype,
                                         follow)
    {
        var e = null;
        // if next token is what we are looking for then "delete" this token
        if ( this.mismatchIsUnwantedToken(input, ttype) ) {
            e = new org.antlr.runtime.UnwantedTokenException(ttype, input);
            this.beginResync();
            input.consume(); // simply delete extra token
            this.endResync();
            this.reportError(e);  // report after consuming so AW sees the token in the exception
            // we want to return the token we're actually matching
            var matchedSymbol = this.getCurrentInputSymbol(input);
            input.consume(); // move past ttype token as if all were ok
            return matchedSymbol;
        }
        // can't recover with single token deletion, try insertion
        if ( this.mismatchIsMissingToken(input, follow) ) {
            var inserted = this.getMissingSymbol(input, e, ttype, follow);
            e = new org.antlr.runtime.MissingTokenException(ttype, input, inserted);
            this.reportError(e);  // report after inserting so AW sees the token in the exception
            return inserted;
        }
        // even that didn't work; must throw the exception
        e = new org.antlr.runtime.MismatchedTokenException(ttype, input);
        throw e;
    },

    recoverFromMismatchedSet: function(input,
                                       e,
                                       follow)
    {
        if ( this.mismatchIsMissingToken(input, follow) ) {
            // System.out.println("missing token");
            this.reportError(e);
            // we don't know how to conjure up a token for sets yet
            return this.getMissingSymbol(input, e, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, follow);
        }
        throw e;
    },

    /** Match needs to return the current input symbol, which gets put
     *  into the label for the associated token ref; e.g., x=ID.  Token
     *  and tree parsers need to return different objects. Rather than test
     *  for input stream type or change the IntStream interface, I use
     *  a simple method to ask the recognizer to tell me what the current
     *  input symbol is.
     * 
     *  This is ignored for lexers.
     */
    getCurrentInputSymbol: function(input) { return null; },

    /** Conjure up a missing token during error recovery.
     *
     *  The recognizer attempts to recover from single missing
     *  symbols. But, actions might refer to that missing symbol.
     *  For example, x=ID {f($x);}. The action clearly assumes
     *  that there has been an identifier matched previously and that
     *  $x points at that token. If that token is missing, but
     *  the next token in the stream is what we want we assume that
     *  this token is missing and we keep going. Because we
     *  have to return some token to replace the missing token,
     *  we have to conjure one up. This method gives the user control
     *  over the tokens returned for missing tokens. Mostly,
     *  you will want to create something special for identifier
     *  tokens. For literals such as '{' and ',', the default
     *  action in the parser or tree parser works. It simply creates
     *  a CommonToken of the appropriate type. The text will be the token.
     *  If you change what tokens must be created by the lexer,
     *  override this method to create the appropriate tokens.
     */
    getMissingSymbol: function(input,
                               e,
                               expectedTokenType,
                               follow)
    {
        return null;
    },


    /** Consume tokens until one matches the given token set */
    consumeUntil: function(input, set) {
        var ttype = input.LA(1);
        while (ttype != org.antlr.runtime.Token.EOF && !set.member(ttype) ) {
            input.consume();
            ttype = input.LA(1);
        }
    },

    /** Push a rule's follow set using our own hardcoded stack */
    pushFollow: function(fset) {
        if ( (this.state._fsp +1)>=this.state.following.length ) {
            var f = [];
            var i;
            for (i=this.state.following.length-1; i>=0; i--) {
                f[i] = this.state.following[i];
            }
            this.state.following = f;
        }
        this.state._fsp++;
        this.state.following[this.state._fsp] = fset;
    },

    /** Return List<String> of the rules in your parser instance
     *  leading up to a call to this method.  You could override if
     *  you want more details such as the file/line info of where
     *  in the parser java code a rule is invoked.
     *
     *  This is very useful for error messages and for context-sensitive
     *  error recovery.
     *
     *  A more general version of getRuleInvocationStack where you can
     *  pass in, for example, a RecognitionException to get it's rule
     *  stack trace.  This routine is shared with all recognizers, hence,
     *  static.
     *
     *  TODO: move to a utility class or something; weird having lexer call this
     *
     *  Most JS interpreters can't do real stack reflection.  See this
     *  spidermonkey bug, for example:
     *  https://bugzilla.mozilla.org/show_bug.cgi?id=332104
     *
     *  JS is supposed to get real stack traces in v4, at which time it would
     *  be easy to implement this function.
     *
     *  Until then I'll leave this unimplemented.  If there is enough clamor
     *  it would be possible to keep track of the invocation stack using an
     *  auxillary array, but that will definitely be a performance hit.
     */
    getRuleInvocationStack: function(e, recognizerClassName)
    {
        throw new Error("Not implemented.");
    },

    getBacktrackingLevel: function() {
        return this.state.backtracking;
    },

    /** Used to print out token names like ID during debugging and
     *  error reporting.  The generated parsers implement a method
     *  that overrides this to point to their String[] tokenNames.
     */
    getTokenNames: function() {
        return null;
    },

    /** For debugging and other purposes, might want the grammar name.
     *  Have ANTLR generate an implementation for this method.
     */
    getGrammarFileName: function() {
        return null;
    },

    /** A convenience method for use most often with template rewrites.
     *  Convert a List<Token> to List<String>
     */
    toStrings: function(tokens) {
        if ( !tokens ) {
            return null;
        }
        var strings = [];
        var i;
        for (i=0; i<tokens.length; i++) {
            strings.push(tokens[i].getText());
        }
        return strings;
    },

    /** Given a rule number and a start token index number, return
     *  MEMO_RULE_UNKNOWN if the rule has not parsed input starting from
     *  start index.  If this rule has parsed input starting from the
     *  start index before, then return where the rule stopped parsing.
     *  It returns the index of the last token matched by the rule.
     *
     *  For now we use a hashtable and just the slow Object-based one.
     *  Later, we can make a special one for ints and also one that
     *  tosses out data after we commit past input position i.
     */
    getRuleMemoization: function(ruleIndex, ruleStartIndex) {
        if ( !this.state.ruleMemo[ruleIndex] ) {
            this.state.ruleMemo[ruleIndex] = {};
        }
        var stopIndexI =
            this.state.ruleMemo[ruleIndex][ruleStartIndex];
        if ( !org.antlr.lang.isNumber(stopIndexI) ) {
            return org.antlr.runtime.BaseRecognizer.MEMO_RULE_UNKNOWN;
        }
        return stopIndexI;
    },

    /** Has this rule already parsed input at the current index in the
     *  input stream?  Return the stop token index or MEMO_RULE_UNKNOWN.
     *  If we attempted but failed to parse properly before, return
     *  MEMO_RULE_FAILED.
     *
     *  This method has a side-effect: if we have seen this input for
     *  this rule and successfully parsed before, then seek ahead to
     *  1 past the stop token matched for this rule last time.
     */
    alreadyParsedRule: function(input, ruleIndex) {
        var stopIndex = this.getRuleMemoization(ruleIndex, input.index());
        if ( stopIndex==org.antlr.runtime.BaseRecognizer.MEMO_RULE_UNKNOWN ) {
            return false;
        }
        if ( stopIndex==org.antlr.runtime.BaseRecognizer.MEMO_RULE_FAILED ) {
            //System.out.println("rule "+ruleIndex+" will never succeed");
            this.state.failed=true;
        }
        else {
            input.seek(stopIndex+1); // jump to one past stop token
        }
        return true;
    },

    /** Record whether or not this rule parsed the input at this position
     *  successfully.  Use a standard java hashtable for now.
     */
    memoize: function(input,
                      ruleIndex,
                      ruleStartIndex)
    {
        var stopTokenIndex = this.state.failed ? 
            org.antlr.runtime.BaseRecognizer.MEMO_RULE_FAILED : input.index()-1;
        if ( !org.antlr.lang.isValue(this.state.ruleMemo) ) {
            throw new Error("!!!!!!!!! memo array is null for "+ this.getGrammarFileName());
        }
        if ( ruleIndex >= this.state.ruleMemo.length ) {
            throw new Error("!!!!!!!!! memo size is "+this.state.ruleMemo.length+", but rule index is "+ruleIndex);
        }
        if ( org.antlr.lang.isValue(this.state.ruleMemo[ruleIndex]) ) {
            this.state.ruleMemo[ruleIndex][ruleStartIndex] = stopTokenIndex;
        }
    },

    /** return how many rule/input-index pairs there are in total.
     *  TODO: this includes synpreds.
     */
    getRuleMemoizationCacheSize: function() {
        var n = 0, i;
        for (i = 0; this.state.ruleMemo && i < this.state.ruleMemo.length; i++) {
            var ruleMap = this.state.ruleMemo[i];
            if ( ruleMap ) {
                // @todo need to get size of rulemap?
                n += ruleMap.length; // how many input indexes are recorded?
            }
        }
        return n;
    },

    traceIn: function(ruleName, ruleIndex, inputSymbol)  {
        this.emitErrorMessage("enter "+ruleName+" "+inputSymbol);
        if ( this.state.failed ) {
            this.emitErrorMessage(" failed="+this.failed);
        }
        if ( this.state.backtracking>0 ) {
            this.emitErrorMessage(" backtracking="+this.state.backtracking);
        }
        // System.out.println();
    },

    traceOut: function(ruleName, ruleIndex, inputSymbol) {
        this.emitErrorMessage("exit "+ruleName+" "+inputSymbol);
        if ( this.state.failed ) {
            this.emitErrorMessage(" failed="+this.state.failed);
        }
        if ( this.state.backtracking>0 ) {
            this.emitErrorMessage(" backtracking="+this.state.backtracking);
        }
    }
};
/** A lexer is recognizer that draws input symbols from a character stream.
 *  lexer grammars result in a subclass of this object. A Lexer object
 *  uses simplified match() and error recovery mechanisms in the interest
 *  of speed.
 */
org.antlr.runtime.Lexer = function(input, state) {
    if (state) {
        org.antlr.runtime.Lexer.superclass.constructor.call(this, state);
    }
    if (input) {
        this.input = input;
    }
};

org.antlr.lang.extend(org.antlr.runtime.Lexer, org.antlr.runtime.BaseRecognizer, {
    reset: function() {
        // reset all recognizer state variables
        org.antlr.runtime.Lexer.superclass.reset.call(this);
        if ( org.antlr.lang.isValue(this.input) ) {
            this.input.seek(0); // rewind the input
        }
        if ( !org.antlr.lang.isValue(this.state) ) {
            return; // no shared state work to do
        }
        this.state.token = null;
        this.state.type = org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
        this.state.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL;
        this.state.tokenStartCharIndex = -1;
        this.state.tokenStartCharPositionInLine = -1;
        this.state.tokenStartLine = -1;
        this.state.text = null;
    },

    /** Return a token from this source; i.e., match a token on the char
     *  stream.
     */
    nextToken: function() {
        while (true) {
            this.state.token = null;
            this.state.channel = org.antlr.runtime.Token.DEFAULT_CHANNEL;
            this.state.tokenStartCharIndex = this.input.index();
            this.state.tokenStartCharPositionInLine = this.input.getCharPositionInLine();
            this.state.tokenStartLine = this.input.getLine();
            this.state.text = null;
            if ( this.input.LA(1)===org.antlr.runtime.CharStream.EOF ) {
                return org.antlr.runtime.Token.EOF_TOKEN;
            }
            try {
                this.mTokens();
                if ( !org.antlr.lang.isValue(this.state.token) ) {
                    this.emit();
                }
                else if ( this.state.token==org.antlr.runtime.Token.SKIP_TOKEN ) {
                    continue;
                }
                return this.state.token;
            }
            catch (re) {
                if (re instanceof org.antlr.runtime.NoViableAltException) {
                    this.reportError(re);
                    this.recover(re);
                } else if ( re instanceof org.antlr.runtime.RecognitionException ) {
                    this.reportError(re);
                } else {
                    throw re;
                }
            }
        }
    },

    /** Instruct the lexer to skip creating a token for current lexer rule
     *  and look for another token.  nextToken() knows to keep looking when
     *  a lexer rule finishes with token set to SKIP_TOKEN.  Recall that
     *  if token==null at end of any token rule, it creates one for you
     *  and emits it.
     */
    skip: function() {
        this.state.token = org.antlr.runtime.Token.SKIP_TOKEN;
    },

    /** Set the char stream and reset the lexer */
    setCharStream: function(input) {
        this.input = null;
        this.reset();
        this.input = input;
    },

    getCharStream: function() {
        return this.input;
    },

    getSourceName: function() {
        return this.input.getSourceName();
    },

    /** Currently does not support multiple emits per nextToken invocation
     *  for efficiency reasons.  Subclass and override this method and
     *  nextToken (to push tokens into a list and pull from that list rather
     *  than a single variable as this implementation does).
     *
     *  The standard method called to automatically emit a token at the
     *  outermost lexical rule.  The token object should point into the
     *  char buffer start..stop.  If there is a text override in 'text',
     *  use that to set the token's text.  Override this method to emit
     *  custom Token objects.
     *
     *  If you are building trees, then you should also override
     *  Parser or TreeParser.getMissingSymbol().
     */
    emit: function() {
        if (arguments.length===0) {
            var t = new org.antlr.runtime.CommonToken(this.input, this.state.type, this.state.channel, this.state.tokenStartCharIndex, this.getCharIndex()-1);
            t.setLine(this.state.tokenStartLine);
            t.setText(this.state.text);
            t.setCharPositionInLine(this.state.tokenStartCharPositionInLine);
            this.state.token = t;
            return t;
        } else {
            this.state.token = arguments[0];
        }
    },

    match: function(s) {
        var i = 0,
            mte;

        if (org.antlr.lang.isString(s)) {
            while ( i<s.length ) {
                if ( this.input.LA(1)!=s.charAt(i) ) {
                    if ( this.state.backtracking>0 ) {
                        this.state.failed = true;
                        return;
                    }
                    mte = new org.antlr.runtime.MismatchedTokenException(s.charAt(i), this.input);
                    this.recover(mte);
                    throw mte;
                }
                i++;
                this.input.consume();
                this.state.failed = false;
            }
        } else if (org.antlr.lang.isNumber(s)) {
            if ( this.input.LA(1)!=s ) {
                if ( this.state.backtracking>0 ) {
                    this.state.failed = true;
                    return;
                }
                mte = new org.antlr.runtime.MismatchedTokenException(s, this.input);
                this.recover(mte);
                throw mte;
            }
            this.input.consume();
            this.state.failed = false;
        }
    },

    matchAny: function() {
        this.input.consume();
    },

    matchRange: function(a, b) {
        if ( this.input.LA(1)<a || this.input.LA(1)>b ) {
            if ( this.state.backtracking>0 ) {
                this.state.failed = true;
                return;
            }
            mre = new org.antlr.runtime.MismatchedRangeException(a,b,this.input);
            this.recover(mre);
            throw mre;
        }
        this.input.consume();
        this.state.failed = false;
    },

    getLine: function() {
        return this.input.getLine();
    },

    getCharPositionInLine: function() {
        return this.input.getCharPositionInLine();
    },

    /** What is the index of the current character of lookahead? */
    getCharIndex: function() {
        return this.input.index();
    },

    /** Return the text matched so far for the current token or any
     *  text override.
     */
    getText: function() {
        if ( org.antlr.lang.isString(this.state.text) ) {
            return this.state.text;
        }
        return this.input.substring(this.state.tokenStartCharIndex,this.getCharIndex()-1);
    },

    /** Set the complete text of this token; it wipes any previous
     *  changes to the text.
     */
    setText: function(text) {
        this.state.text = text;
    },

    reportError: function(e) {
        /** TODO: not thought about recovery in lexer yet.
         *
        // if we've already reported an error and have not matched a token
        // yet successfully, don't report any errors.
        if ( errorRecovery ) {
            //System.err.print("[SPURIOUS] ");
            return;
        }
        errorRecovery = true;
         */

        this.displayRecognitionError(this.getTokenNames(), e);
    },

    getErrorMessage: function(e, tokenNames) {
        var msg = null;
        if ( e instanceof org.antlr.runtime.MismatchedTokenException ) {
            msg = "mismatched character "+this.getCharErrorDisplay(e.c)+" expecting "+this.getCharErrorDisplay(e.expecting);
        }
        else if ( e instanceof org.antlr.runtime.NoViableAltException ) {
            msg = "no viable alternative at character "+this.getCharErrorDisplay(e.c);
        }
        else if ( e instanceof org.antlr.runtime.EarlyExitException ) {
            msg = "required (...)+ loop did not match anything at character "+this.getCharErrorDisplay(e.c);
        }
        else if ( e instanceof org.antlr.runtime.MismatchedNotSetException ) {
            msg = "mismatched character "+this.getCharErrorDisplay(e.c)+" expecting set "+e.expecting;
        }
        else if ( e instanceof org.antlr.runtime.MismatchedSetException ) {
            msg = "mismatched character "+this.getCharErrorDisplay(e.c)+" expecting set "+e.expecting;
        }
        else if ( e instanceof org.antlr.runtime.MismatchedRangeException ) {
            msg = "mismatched character "+this.getCharErrorDisplay(e.c)+" expecting set "+
                this.getCharErrorDisplay(e.a)+".."+this.getCharErrorDisplay(e.b);
        }
        else {
            msg = org.antlr.runtime.Lexer.superclass.getErrorMessage.call(this, e, tokenNames);
        }
        return msg;
    },

    getCharErrorDisplay: function(c) {
        var s = c; //String.fromCharCode(c);
        switch ( s ) {
            case org.antlr.runtime.Token.EOF :
                s = "<EOF>";
                break;
            case "\n" :
                s = "\\n";
                break;
            case "\t" :
                s = "\\t";
                break;
            case "\r" :
                s = "\\r";
                break;
        }
        return "'"+s+"'";
    },

    /** Lexers can normally match any char in it's vocabulary after matching
     *  a token, so do the easy thing and just kill a character and hope
     *  it all works out.  You can instead use the rule invocation stack
     *  to do sophisticated error recovery if you are in a fragment rule.
     */
    recover: function(re) {
        this.input.consume();
    },

    traceIn: function(ruleName, ruleIndex)  {
        var inputSymbol = String.fromCharCode(this.input.LT(1))+" line="+this.getLine()+":"+this.getCharPositionInLine();
        org.antlr.runtime.Lexer.superclass.traceIn.call(this, ruleName, ruleIndex, inputSymbol);
    },

    traceOut: function(ruleName, ruleIndex)  {
		var inputSymbol = String.fromCharCode(this.input.LT(1))+" line="+this.getLine()+":"+this.getCharPositionInLine();
		org.antlr.runtime.Lexer.superclass.traceOut.call(this, ruleName, ruleIndex, inputSymbol);
	}
});
/** Rules that return more than a single value must return an object
 *  containing all the values.  Besides the properties defined in
 *  RuleLabelScope.predefinedRulePropertiesScope there may be user-defined
 *  return values.  This class simply defines the minimum properties that
 *  are always defined and methods to access the others that might be
 *  available depending on output option such as template and tree.
 *
 *  Note text is not an actual property of the return value, it is computed
 *  from start and stop using the input stream's toString() method.  I
 *  could add a ctor to this so that we can pass in and store the input
 *  stream, but I'm not sure we want to do that.  It would seem to be undefined
 *  to get the .text property anyway if the rule matches tokens from multiple
 *  input streams.
 *
 *  I do not use getters for fields of objects that are used simply to
 *  group values such as this aggregate.  The getters/setters are there to
 *  satisfy the superclass interface.
 */
org.antlr.runtime.ParserRuleReturnScope = function() {};

org.antlr.runtime.ParserRuleReturnScope.prototype = {
    getStart: function() { return this.start; },
    getStop: function() { return this.stop; }
};
/** This is identical to the ParserRuleReturnScope except that
 *  the start property is a tree nodes not Token object
 *  when you are parsing trees.  To be generic the tree node types
 *  have to be Object.
 */
org.antlr.runtime.tree.TreeRuleReturnScope = function(){};

org.antlr.runtime.tree.TreeRuleReturnScope.prototype = {
    getStart: function() { return this.start; }
};
/** A parser for TokenStreams.  "parser grammars" result in a subclass
 *  of this.
 */
org.antlr.runtime.Parser = function(input, state) {
    org.antlr.runtime.Parser.superclass.constructor.call(this, state);
    this.setTokenStream(input);
};

org.antlr.lang.extend(org.antlr.runtime.Parser, org.antlr.runtime.BaseRecognizer, {
    reset: function() {
        // reset all recognizer state variables
		org.antlr.runtime.Parser.superclass.reset.call(this);
		if ( org.antlr.lang.isValue(this.input) ) {
			this.input.seek(0); // rewind the input
		}
	},

    getCurrentInputSymbol: function(input) {
        return input.LT(1);
    },

    getMissingSymbol: function(input,
                               e,
                               expectedTokenType,
                               follow)
    {
        var tokenText =
            "<missing "+this.getTokenNames()[expectedTokenType]+">";
        var t = new org.antlr.runtime.CommonToken(expectedTokenType, tokenText);
        var current = input.LT(1);
        var old_current;
        if ( current.getType() === org.antlr.runtime.Token.EOF ) {
            old_current = current;
            current = input.LT(-1);
            // handle edge case where there are no good tokens in the stream
            if (!current) {
                current = old_current;
            }
        }
        t.line = current.getLine();
        t.charPositionInLine = current.getCharPositionInLine();
        t.channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
        return t;
    },


	/** Set the token stream and reset the parser */
    setTokenStream: function(input) {
		this.input = null;
		this.reset();
		this.input = input;
	},

    getTokenStream: function() {
		return this.input;
	},

    getSourceName: function() {
        return this.input.getSourceName();
    },

    traceIn: function(ruleName, ruleIndex)  {
		org.antlr.runtime.Parser.superclass.traceIn.call(
                this, ruleName, ruleIndex, this.input.LT(1));
	},

    traceOut: function(ruleName, ruleIndex)  {
		org.antlr.runtime.Parser.superclass.traceOut.call(
                this, ruleName, ruleIndex, this.input.LT(1));
	}
});
/** A DFA implemented as a set of transition tables.
 *
 *  Any state that has a semantic predicate edge is special; those states
 *  are generated with if-then-else structures in a specialStateTransition()
 *  which is generated by cyclicDFA template.
 *
 *  There are at most 32767 states (16-bit signed short).
 *  Could get away with byte sometimes but would have to generate different
 *  types and the simulation code too.  For a point of reference, the Java
 *  lexer's Tokens rule DFA has 326 states roughly.
 */
org.antlr.runtime.DFA = function() {};

org.antlr.runtime.DFA.prototype = {
    /** From the input stream, predict what alternative will succeed
     *  using this DFA (representing the covering regular approximation
     *  to the underlying CFL).  Return an alternative number 1..n.  Throw
     *  an exception upon error.
     */
    predict: function(input) {
        var mark = input.mark(), // remember where decision started in input
            s = 0, // we always start at s0
            specialState,
            c,
            snext;

        try {
            while ( true ) {
                specialState = this.special[s];
                if ( specialState>=0 ) {
                    s = this.specialStateTransition(specialState,input);
                    if (s===-1) {
                        this.noViableAlt(s, input);
                        return 0;
                    }
                    input.consume();
                    continue;
                }
                if ( this.accept[s] >= 1 ) {
                    return this.accept[s];
                }
                // look for a normal char transition
                c = input.LA(1); // -1 == \uFFFF, all tokens fit in 65000 space

                if (c===org.antlr.runtime.Token.EOF) {
                    c = -1;
                } else if (org.antlr.lang.isString(c)) {
                    c = c.charCodeAt(0);
                }

                if (c>=this.min[s] && c<=this.max[s]) {
                    snext = this.transition[s][c-this.min[s]]; // move to next state
                    if ( snext < 0 ) {
                        // was in range but not a normal transition
                        // must check EOT, which is like the else clause.
                        // eot[s]>=0 indicates that an EOT edge goes to another
                        // state.
                        if ( this.eot[s]>=0 ) {  // EOT Transition to accept state?
                            s = this.eot[s];
                            input.consume();
                            // TODO: I had this as return accept[eot[s]]
                            // which assumed here that the EOT edge always
                            // went to an accept...faster to do this, but
                            // what about predicated edges coming from EOT
                            // target?
                            continue;
                        }
                        this.noViableAlt(s,input);
                        return 0;
                    }
                    s = snext;
                    input.consume();
                    continue;
                }
                if ( this.eot[s]>=0 ) {  // EOT Transition?
                    s = this.eot[s];
                    input.consume();
                    continue;
                }
                if ( c==org.antlr.runtime.Token.EOF && this.eof[s]>=0 ) {  // EOF Transition to accept state?
                    return this.accept[this.eof[s]];
                }
                // not in range and not EOF/EOT, must be invalid symbol
                this.noViableAlt(s,input);
                return 0;
            }
        }
        finally {
            input.rewind(mark);
        }
    },

    noViableAlt: function(s, input) {
        if (this.recognizer.state.backtracking>0) {
            this.recognizer.state.failed=true;
            return;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(),
                                     this.decisionNumber,
                                     s,
                                     input);
        this.error(nvae);
        throw nvae;
    },

    /** A hook for debugging interface */
    error: function(nvae) { },

    specialStateTransition: function(s, input) {
        return -1;
    },

    getDescription: function() {
        return "n/a";
    }
};

org.antlr.lang.augmentObject(org.antlr.runtime.DFA, {
    /** Given a String that has a run-length-encoding of some unsigned shorts
     *  like "\1\2\3\9", convert to short[] {2,9,9,9}.
     */
    unpackEncodedString: function(encodedString) {
        // walk first to find how big it is.
        var i,
            data = [],
            di = 0,
            n,
            v,
            j;
        for (i=0; i<encodedString.length; i+=2) {
            n = encodedString.charCodeAt(i);
            v = encodedString.charCodeAt(i+1);
            if (v===0xffff) {
                v = -1; // overflow at 16 bits
            }
            // add v n times to data
            for (j=1; j<=n; j++) {
                data[di++] = v;
            }
        }
        return data;
    },

    // alias
    unpackEncodedStringToUnsignedChars: function(encodedString) {
        return org.antlr.runtime.DFA.unpackEncodedString(encodedString);
    }
});
/** A parser for a stream of tree nodes.  "tree grammars" result in a subclass
 *  of this.  All the error reporting and recovery is shared with Parser via
 *  the BaseRecognizer superclass.
*/
org.antlr.runtime.tree.TreeParser = function(input) {
    org.antlr.runtime.tree.TreeParser.superclass.constructor.call(this, arguments[1]);
    this.setTreeNodeStream(input);
};

(function(){
var TP = org.antlr.runtime.tree.TreeParser;

org.antlr.lang.augmentObject(TP, {
    DOWN: org.antlr.runtime.Token.DOWN,
    UP: org.antlr.runtime.Token.UP
});

org.antlr.lang.extend(TP, org.antlr.runtime.BaseRecognizer, {
    reset: function() {
        TP.superclass.reset.call(this); // reset all recognizer state variables
        if ( this.input ) {
            this.input.seek(0); // rewind the input
        }
    },

    /** Set the input stream */
    setTreeNodeStream: function(input) {
        this.input = input;
    },

    getTreeNodeStream: function() {
        return this.input;
    },

    getSourceName: function() {
        return this.input.getSourceName();
    },

    getCurrentInputSymbol: function(input) {
        return input.LT(1);
    },

    getMissingSymbol: function(input, e, expectedTokenType, follow) {
        var tokenText =
            "<missing "+this.getTokenNames()[expectedTokenType]+">";
        return new org.antlr.runtime.tree.CommonTree(new org.antlr.runtime.CommonToken(expectedTokenType, tokenText));
    },

    /** Match '.' in tree parser has special meaning.  Skip node or
     *  entire tree if node has children.  If children, scan until
     *  corresponding UP node.
     */
    matchAny: function(ignore) { // ignore stream, copy of this.input
        this.state.errorRecovery = false;
        this.state.failed = false;
        var look = this.input.LT(1);
        if ( this.input.getTreeAdaptor().getChildCount(look)===0 ) {
            this.input.consume(); // not subtree, consume 1 node and return
            return;
        }
        // current node is a subtree, skip to corresponding UP.
        // must count nesting level to get right UP
        var level=0,
            tokenType = this.input.getTreeAdaptor().getType(look);
        while ( tokenType!==org.antlr.runtime.Token.EOF &&
                !(tokenType===TP.UP && level===0) )
        {
            this.input.consume();
            look = this.input.LT(1);
            tokenType = this.input.getTreeAdaptor().getType(look);
            if ( tokenType === TP.DOWN ) {
                level++;
            }
            else if ( tokenType === TP.UP ) {
                level--;
            }
        }
        this.input.consume(); // consume UP
    },

    /** We have DOWN/UP nodes in the stream that have no line info; override.
     *  plus we want to alter the exception type.  Don't try to recover
     *       *  from tree parser errors inline...
     */
    mismatch: function(input, ttype, follow) {
        throw new org.antlr.runtime.MismatchedTreeNodeException(ttype, input);
    },

    /** Prefix error message with the grammar name because message is
     *  always intended for the programmer because the parser built
     *  the input tree not the user.
     */
    getErrorHeader: function(e) {
        return this.getGrammarFileName()+": node from "+
               (e.approximateLineInfo?"after ":"")+"line "+e.line+":"+e.charPositionInLine;
    },

    /** Tree parsers parse nodes they usually have a token object as
     *  payload. Set the exception token and do the default behavior.
     */
    getErrorMessage: function(e, tokenNames) {
        var adaptor;
        if ( this instanceof TP ) {
            adaptor = e.input.getTreeAdaptor();
            e.token = adaptor.getToken(e.node);
            if ( !org.antlr.lang.isValue(e.token) ) { // could be an UP/DOWN node
                e.token = new org.antlr.runtime.CommonToken(
                        adaptor.getType(e.node),
                        adaptor.getText(e.node));
            }
        }
        return TP.superclass.getErrorMessage.call(this, e, tokenNames);
    },

    traceIn: function(ruleName, ruleIndex) {
        TP.superclass.traceIn.call(this, ruleName, ruleIndex, this.input.LT(1));
    },

    traceOut: function(ruleName, ruleIndex) {
        TP.superclass.traceOut.call(this, ruleName, ruleIndex, this.input.LT(1));
    }
});

})();

exports.org = org;

});
