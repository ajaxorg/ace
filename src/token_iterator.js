"use strict";

var Range = require("./range").Range;

/**
 * 
 *
 * This class provides an essay way to treat the document as a stream of tokens, and provides methods to iterate over these tokens.
 * @class TokenIterator
 **/

/**
 * Creates a new token iterator object. The inital token index is set to the provided row and column coordinates.
 * @param {EditSession} session The session to associate with
 * @param {Number} initialRow The row to start the tokenizing at
 * @param {Number} initialColumn The column to start the tokenizing at
 *
 * @constructor
 **/
var TokenIterator = function(session, initialRow, initialColumn) {
    this.$session = session;
    this.$row = initialRow;
    this.$rowTokens = session.getTokens(initialRow);

    var token = session.getTokenAt(initialRow, initialColumn);
    this.$tokenIndex = token ? token.index : -1;
};

(function() {
   
    /**
     * Tokenizes all the items from the current point to the row prior in the document. 
     * @returns {[String]} If the current point is not at the top of the file, this function returns `null`. Otherwise, it returns an array of the tokenized strings.
     **/ 
    this.stepBackward = function() {
        this.$tokenIndex -= 1;
        
        while (this.$tokenIndex < 0) {
            this.$row -= 1;
            if (this.$row < 0) {
                this.$row = 0;
                return null;
            }
                
            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = this.$rowTokens.length - 1;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };
  
    /**
     * Tokenizes all the items from the current point until the next row in the document. If the current point is at the end of the file, this function returns `null`. Otherwise, it returns the tokenized string.
     * @returns {String}
     **/   
    this.stepForward = function() {
        this.$tokenIndex += 1;
        var rowCount;
        while (this.$tokenIndex >= this.$rowTokens.length) {
            this.$row += 1;
            if (!rowCount)
                rowCount = this.$session.getLength();
            if (this.$row >= rowCount) {
                this.$row = rowCount - 1;
                return null;
            }

            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = 0;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };
 
    /**
     * 
     * Returns the current tokenized string.
     * @returns {String}
     **/      
    this.getCurrentToken = function () {
        return this.$rowTokens[this.$tokenIndex];
    };

    /**
     * 
     * Returns the current row.
     * @returns {Number}
     **/      
    this.getCurrentTokenRow = function () {
        return this.$row;
    };

    /**
     * 
     * Returns the current column.
     * @returns {Number}
     **/     
    this.getCurrentTokenColumn = function() {
        var rowTokens = this.$rowTokens;
        var tokenIndex = this.$tokenIndex;
        
        // If a column was cached by EditSession.getTokenAt, then use it
        var column = rowTokens[tokenIndex].start;
        if (column !== undefined)
            return column;
            
        column = 0;
        while (tokenIndex > 0) {
            tokenIndex -= 1;
            column += rowTokens[tokenIndex].value.length;
        }
        
        return column;  
    };

    /**
     * Return the current token position.
     * @returns {Position}
     */
    this.getCurrentTokenPosition = function() {
        return {row: this.$row, column: this.getCurrentTokenColumn()};
    };
    
    /**
     * Return the current token range.
     * @returns {Range}
     */
    this.getCurrentTokenRange = function() {
        var token = this.$rowTokens[this.$tokenIndex];
        var column = this.getCurrentTokenColumn();
        return new Range(this.$row, column, this.$row, column + token.value.length);
    };
    
}).call(TokenIterator.prototype);

exports.TokenIterator = TokenIterator;
