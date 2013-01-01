// This file was generated on Wed Dec 12, 2012 20:06 (UTC+01) by REx v5.20 which is Copyright (c) 1979-2012 by Gunther Rademacher <grd@gmx.net>
// REx command line: CommentParser.ebnf -tree -javascript -a xqlint

                                                            // line 2 "CommentParser.ebnf"
                                                            /* ***** BEGIN LICENSE BLOCK *****
                                                             * Distributed under the BSD license:
                                                             *
                                                             * Copyright (c) 2010, Ajax.org B.V.
                                                             * All rights reserved.
                                                             *
                                                             * Redistribution and use in source and binary forms, with or without
                                                             * modification, are permitted provided that the following conditions are met:
                                                             *     * Redistributions of source code must retain the above copyright
                                                             *       notice, this list of conditions and the following disclaimer.
                                                             *     * Redistributions in binary form must reproduce the above copyright
                                                             *       notice, this list of conditions and the following disclaimer in the
                                                             *       documentation and/or other materials provided with the distribution.
                                                             *     * Neither the name of Ajax.org B.V. nor the
                                                             *       names of its contributors may be used to endorse or promote products
                                                             *       derived from this software without specific prior written permission.
                                                             *
                                                             * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
                                                             * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
                                                             * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                                                             * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
                                                             * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
                                                             * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
                                                             * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
                                                             * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
                                                             * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
                                                             * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                                             *
                                                             * ***** END LICENSE BLOCK ***** */

                                                            define(function(require, exports, module){
                                                            var CommentParser = exports.CommentParser = function CommentParser(string, parsingEventHandler)
                                                            {
                                                              init(string, parsingEventHandler);
                                                            // line 40 "CommentParser.js"
  var self = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var
      begin = b,
      end = e,
      state = s,
      offending = o,
      expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};

    this.getMessage = function()
    {
      return offending < 0 ? "lexical analysis failed" : "syntax error";
    };
  };

  function init(string, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = string;
    size = string.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  function reset(l, b, e)
  {
                 b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    end = e;
    eventHandler.reset(input);
  }

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? CommentParser.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = getExpectedTokenSet(e.getState());
    }
    else
    {
      expected = [CommentParser.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var tokenSet = this.getExpectedTokenSet(e);
    var found = this.getOffendingToken(e);
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    var size = e.getEnd() - e.getBegin();
    return e.getMessage()
         + (found == null ? "" : ", found " + found)
         + "\nwhile expecting "
         + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
         + "\n"
         + (size == 0 ? "" : "after successfully scanning " + size + " characters beginning ")
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_Comments = function()
  {
    eventHandler.startNonterminal("Comments", e0);
    for (;;)
    {
      lookahead1(0);                // S^WS | EOF | '(:'
      if (l1 == 3)                  // EOF
      {
        break;
      }
      switch (l1)
      {
      case 1:                       // S^WS
        shift(1);                   // S^WS
        break;
      default:
        parse_Comment();
      }
    }
    shift(3);                       // EOF
    eventHandler.endNonterminal("Comments", e0);
  };

  function parse_Comment()
  {
    eventHandler.startNonterminal("Comment", e0);
    shift(4);                       // '(:'
    for (;;)
    {
      lookahead1(1);                // CommentContents | '(:' | ':)'
      if (l1 == 5)                  // ':)'
      {
        break;
      }
      switch (l1)
      {
      case 2:                       // CommentContents
        shift(2);                   // CommentContents
        break;
      default:
        parse_Comment();
      }
    }
    shift(5);                       // ':)'
    eventHandler.endNonterminal("Comment", e0);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var eventHandler;

  function error(b, e, s, l, t)
  {
    throw new self.ParseException(b, e, s, l, t);
  }

  function shift(t)
  {
    if (l1 == t)
    {
      eventHandler.terminal(CommentParser.TOKEN[l1], b1, e1 > size ? size : e1);
      b0 = b1; e0 = e1; l1 = 0;
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function lookahead1(set)
  {
    if (l1 == 0)
    {
      l1 = match(set);
      b1 = begin;
      e1 = end;
    }
  }

  var input;
  var size;
  var begin;
  var end;
  var state;

  function match(tokenset)
  {
    var nonbmp = false;
    begin = end;
    var current = end;
    var result = CommentParser.INITIAL[tokenset];

    for (var code = result & 15; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = CommentParser.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = CommentParser.MAP1[(c0 & 31) + CommentParser.MAP1[(c1 & 31) + CommentParser.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
            nonbmp = true;
          }
        }
        var lo = 0, hi = 1;
        for (var m = 1; ; m = (hi + lo) >> 1)
        {
          if (CommentParser.MAP2[m] > c0) hi = m - 1;
          else if (CommentParser.MAP2[2 + m] < c0) lo = m + 1;
          else {charclass = CommentParser.MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 4) + code - 1;
      code = CommentParser.TRANSITION[(i0 & 3) + CommentParser.TRANSITION[i0 >> 2]];

      if (code > 15)
      {
        result = code;
        code &= 15;
        end = current;
      }
    }

    result >>= 4;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      error(begin, end, state, -1, -1);
    }

    if (nonbmp)
    {
      for (var i = result >> 3; i > 0; --i)
      {
        --end;
        var c1 = end < size ? input.charCodeAt(end) : 0;
        if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      }
    }
    else
    {
      end -= result >> 3;
    }

    return (result & 7) - 1;
  }

  function getExpectedTokenSet(s)
  {
    var set = [];
    if (s > 0)
    {
      for (var i = 0; i < 6; i += 32)
      {
        var j = i;
        for (var f = ec(i >>> 5, s); f != 0; f >>>= 1, ++j)
        {
          if ((f & 1) != 0)
          {
            set[set.length] = CommentParser.TOKEN[j];
          }
        }
      }
    }
    return set;
  }

  function ec(t, s)
  {
    var i0 = t * 9 + s - 1;
    return CommentParser.EXPECTED[i0];
  }
}

CommentParser.MAP0 =
[
  /*   0 */ 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2,
  /*  36 */ 2, 2, 2, 2, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  /*  72 */ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  /* 108 */ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
];

CommentParser.MAP1 =
[
  /*   0 */ 54, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56,
  /*  27 */ 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56,
  /*  54 */ 88, 120, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147,
  /*  76 */ 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0,
  /* 104 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  /* 140 */ 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  /* 176 */ 2, 2, 2
];

CommentParser.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 2, 2
];

CommentParser.INITIAL =
[
  /* 0 */ 1, 2
];

CommentParser.TRANSITION =
[
  /*  0 */ 33, 33, 33, 33, 28, 37, 32, 33, 31, 37, 32, 33, 43, 50, 53, 33, 31, 39, 33, 33, 46, 57, 59, 33, 63, 33, 33,
  /* 27 */ 33, 35, 5, 35, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 96, 5, 4, 6, 0, 0, 7, 0, 80, 184, 184, 184, 184, 0, 0, 0, 185,
  /* 58 */ 80, 185, 0, 0, 0, 64, 0, 0, 0
];

CommentParser.EXPECTED =
[
  /* 0 */ 26, 52, 2, 16, 4, 20, 36, 4, 4
];

CommentParser.TOKEN =
[
  "(0)",
  "S",
  "CommentContents",
  "EOF",
  "'(:'",
  "':)'"
];

                                                            // line 54 "CommentParser.ebnf"
                                                            });
                                                            // line 371 "CommentParser.js"
// End
