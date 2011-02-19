/* -*- Mode: JS; tab-width: 4; indent-tabs-mode: nil; -*-
 * vim: set sw=4 ts=4 et tw=78:
 * ***** BEGIN LICENSE BLOCK *****
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tom Austin <taustin@ucsc.edu>
 *   Brendan Eich <brendan@mozilla.org>
 *   Shu-Yu Guo <shu@rfrn.org>
 *   Dave Herman <dherman@mozilla.com>
 *   Dimitris Vardoulakis <dimvar@ccs.neu.edu>
 *   Patrick Walton <pcwalton@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * Narcissus - JS implemented in JS.
 *
 * Parser.
 */

define(function(require, exports, module) {

var lexer = require("ace/narcissus/jslex");
var definitions = require("ace/narcissus/jsdefs");

const StringMap = definitions.StringMap;
const Stack = definitions.Stack;

// Set constants in the local scope.
eval(definitions.consts);

/*
 * pushDestructuringVarDecls :: (node, hoisting node) -> void
 *
 * Recursively add all destructured declarations to varDecls.
 */
function pushDestructuringVarDecls(n, s) {
    for (var i in n) {
        var sub = n[i];
        if (sub.type === IDENTIFIER) {
            s.varDecls.push(sub);
        } else {
            pushDestructuringVarDecls(sub, s);
        }
    }
}

// NESTING_TOP: top-level
// NESTING_SHALLOW: nested within static forms such as { ... } or labeled statement
// NESTING_DEEP: nested within dynamic forms such as if, loops, etc.
const NESTING_TOP = 0, NESTING_SHALLOW = 1, NESTING_DEEP = 2;

function StaticContext(parentScript, parentBlock, inFunction, inForLoopInit, nesting) {
    this.parentScript = parentScript;
    this.parentBlock = parentBlock;
    this.inFunction = inFunction;
    this.inForLoopInit = inForLoopInit;
    this.nesting = nesting;
    this.allLabels = new Stack();
    this.currentLabels = new Stack();
    this.labeledTargets = new Stack();
    this.defaultTarget = null;
    definitions.options.ecma3OnlyMode && (this.ecma3OnlyMode = true);
    definitions.options.parenFreeMode && (this.parenFreeMode = true);
}

StaticContext.prototype = {
    ecma3OnlyMode: false,
    parenFreeMode: false,
    // non-destructive update via prototype extension
    update: function(ext) {
        var desc = {};
        for (var key in ext) {
            desc[key] = {
                value: ext[key],
                writable: true,
                enumerable: true,
                configurable: true
            }
        }
        return Object.create(this, desc);
    },
    pushLabel: function(label) {
        return this.update({ currentLabels: this.currentLabels.push(label),
                             allLabels: this.allLabels.push(label) });
    },
    pushTarget: function(target) {
        var isDefaultTarget = target.isLoop || target.type === SWITCH;

        if (this.currentLabels.isEmpty()) {
            return isDefaultTarget
                 ? this.update({ defaultTarget: target })
                 : this;
        }

        target.labels = new StringMap();
        this.currentLabels.forEach(function(label) {
            target.labels.set(label, true);
        });
        return this.update({ currentLabels: new Stack(),
                             labeledTargets: this.labeledTargets.push(target),
                             defaultTarget: isDefaultTarget
                                            ? target
                                            : this.defaultTarget });
    },
    nest: function(atLeast) {
        var nesting = Math.max(this.nesting, atLeast);
        return (nesting !== this.nesting)
             ? this.update({ nesting: nesting })
             : this;
    }
};

/*
 * Script :: (tokenizer, boolean) -> node
 *
 * Parses the toplevel and function bodies.
 */
function Script(t, inFunction) {
    var n = new Node(t, scriptInit());
    var x = new StaticContext(n, n, inFunction, false, NESTING_TOP);
    Statements(t, x, n);
    return n;
}

// We extend Array slightly with a top-of-stack method.
definitions.defineProperty(Array.prototype, "top",
                           function() {
                               return this.length && this[this.length-1];
                           }, false, false, true);

/*
 * Node :: (tokenizer, optional init object) -> node
 */
function Node(t, init) {
    var token = t.token;
    if (token) {
        // If init.type exists it will override token.type.
        this.type = token.type;
        this.value = token.value;
        this.lineno = token.lineno;

        // Start and end are file positions for error handling.
        this.start = token.start;
        this.end = token.end;
    } else {
        this.lineno = t.lineno;
    }

    // Node uses a tokenizer for debugging (getSource, filename getter).
    this.tokenizer = t;
    this.children = [];

    for (var prop in init)
        this[prop] = init[prop];
}

var Np = Node.prototype = {};
Np.constructor = Node;
Np.toSource = Object.prototype.toSource;

// Always use push to add operands to an expression, to update start and end.
Np.push = function (kid) {
    // kid can be null e.g. [1, , 2].
    if (kid !== null) {
        if (kid.start < this.start)
            this.start = kid.start;
        if (this.end < kid.end)
            this.end = kid.end;
    }
    return this.children.push(kid);
}

Node.indentLevel = 0;

function tokenString(tt) {
    var t = definitions.tokens[tt];
    return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
}

Np.toString = function () {
    var a = [];
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'type' && i !== 'target')
            a.push({id: i, value: this[i]});
    }
    a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
    const INDENTATION = "    ";
    var n = ++Node.indentLevel;
    var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
    for (i = 0; i < a.length; i++)
        s += ",\n" + INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
    n = --Node.indentLevel;
    s += "\n" + INDENTATION.repeat(n) + "}";
    return s;
}

Np.getSource = function () {
    return this.tokenizer.source.slice(this.start, this.end);
};

/*
 * Helper init objects for common nodes.
 */

const LOOP_INIT = { isLoop: true };

function blockInit() {
    return { type: BLOCK, varDecls: [] };
}

function scriptInit() {
    return { type: SCRIPT,
             funDecls: [],
             varDecls: [],
             modDecls: [],
             impDecls: [],
             expDecls: [],
             loadDeps: [],
             hasEmptyReturn: false,
             hasReturnWithValue: false,
             isGenerator: false };
}

definitions.defineGetter(Np, "filename",
                         function() {
                             return this.tokenizer.filename;
                         });

definitions.defineProperty(String.prototype, "repeat",
                           function(n) {
                               var s = "", t = this + s;
                               while (--n >= 0)
                                   s += t;
                               return s;
                           }, false, false, true);

function MaybeLeftParen(t, x) {
    if (x.parenFreeMode)
        return t.match(LEFT_PAREN) ? LEFT_PAREN : END;
    return t.mustMatch(LEFT_PAREN).type;
}

function MaybeRightParen(t, p) {
    if (p === LEFT_PAREN)
        t.mustMatch(RIGHT_PAREN);
}

/*
 * Statements :: (tokenizer, compiler context, node) -> void
 *
 * Parses a sequence of Statements.
 */
function Statements(t, x, n) {
    try {
        while (!t.done && t.peek(true) !== RIGHT_CURLY)
            n.push(Statement(t, x));
    } catch (e) {
        if (t.done)
            t.unexpectedEOF = true;
        throw e;
    }
}

function Block(t, x) {
    t.mustMatch(LEFT_CURLY);
    var n = new Node(t, blockInit());
    Statements(t, x.update({ parentBlock: n }).pushTarget(n), n);
    t.mustMatch(RIGHT_CURLY);
    return n;
}

const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

/*
 * Statement :: (tokenizer, compiler context) -> node
 *
 * Parses a Statement.
 */
function Statement(t, x) {
    var i, label, n, n2, p, c, ss, tt = t.get(true), tt2, x2, x3;

    // Cases for statements ending in a right curly return early, avoiding the
    // common semicolon insertion magic after this switch.
    switch (tt) {
      case FUNCTION:
        // DECLARED_FORM extends funDecls of x, STATEMENT_FORM doesn't.
        return FunctionDefinition(t, x, true,
                                  (x.nesting !== NESTING_TOP)
                                  ? STATEMENT_FORM
                                  : DECLARED_FORM);

      case LEFT_CURLY:
        n = new Node(t, blockInit());
        Statements(t, x.update({ parentBlock: n }).pushTarget(n).nest(NESTING_SHALLOW), n);
        t.mustMatch(RIGHT_CURLY);
        return n;

      case IF:
        n = new Node(t);
        n.condition = HeadExpression(t, x);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        n.thenPart = Statement(t, x2);
        n.elsePart = t.match(ELSE) ? Statement(t, x2) : null;
        return n;

      case SWITCH:
        // This allows CASEs after a DEFAULT, which is in the standard.
        n = new Node(t, { cases: [], defaultIndex: -1 });
        n.discriminant = HeadExpression(t, x);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        t.mustMatch(LEFT_CURLY);
        while ((tt = t.get()) !== RIGHT_CURLY) {
            switch (tt) {
              case DEFAULT:
                if (n.defaultIndex >= 0)
                    throw t.newSyntaxError("More than one switch default");
                // FALL THROUGH
              case CASE:
                n2 = new Node(t);
                if (tt === DEFAULT)
                    n.defaultIndex = n.cases.length;
                else
                    n2.caseLabel = Expression(t, x2, COLON);
                break;

              default:
                throw t.newSyntaxError("Invalid switch case");
            }
            t.mustMatch(COLON);
            n2.statements = new Node(t, blockInit());
            while ((tt=t.peek(true)) !== CASE && tt !== DEFAULT &&
                    tt !== RIGHT_CURLY)
                n2.statements.push(Statement(t, x2));
            n.cases.push(n2);
        }
        return n;

      case FOR:
        n = new Node(t, LOOP_INIT);
        if (t.match(IDENTIFIER)) {
            if (t.token.value === "each")
                n.isEach = true;
            else
                t.unget();
        }
        if (!x.parenFreeMode)
            t.mustMatch(LEFT_PAREN);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        x3 = x.update({ inForLoopInit: true });
        if ((tt = t.peek()) !== SEMICOLON) {
            if (tt === VAR || tt === CONST) {
                t.get();
                n2 = Variables(t, x3);
            } else if (tt === LET) {
                t.get();
                if (t.peek() === LEFT_PAREN) {
                    n2 = LetBlock(t, x3, false);
                } else {
                    // Let in for head, we need to add an implicit block
                    // around the rest of the for.
                    x3.parentBlock = n;
                    n.varDecls = [];
                    n2 = Variables(t, x3);
                }
            } else {
                n2 = Expression(t, x3);
            }
        }
        if (n2 && t.match(IN)) {
            n.type = FOR_IN;
            n.object = Expression(t, x3);
            if (n2.type === VAR || n2.type === LET) {
                c = n2.children;

                // Destructuring turns one decl into multiples, so either
                // there must be only one destructuring or only one
                // decl.
                if (c.length !== 1 && n2.destructurings.length !== 1) {
                    throw new SyntaxError("Invalid for..in left-hand side",
                                          t.filename, n2.lineno);
                }
                if (n2.destructurings.length > 0) {
                    n.iterator = n2.destructurings[0];
                } else {
                    n.iterator = c[0];
                }
                n.varDecl = n2;
            } else {
                if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                    n2.destructuredNames = checkDestructuring(t, x3, n2);
                }
                n.iterator = n2;
            }
        } else {
            n.setup = n2;
            t.mustMatch(SEMICOLON);
            if (n.isEach)
                throw t.newSyntaxError("Invalid for each..in loop");
            n.condition = (t.peek() === SEMICOLON)
                          ? null
                          : Expression(t, x3);
            t.mustMatch(SEMICOLON);
            tt2 = t.peek();
            n.update = (x.parenFreeMode
                        ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2]
                        : tt2 === RIGHT_PAREN)
                       ? null
                       : Expression(t, x3);
        }
        if (!x.parenFreeMode)
            t.mustMatch(RIGHT_PAREN);
        n.body = Statement(t, x2);
        return n;

      case WHILE:
        n = new Node(t, { isLoop: true });
        n.condition = HeadExpression(t, x);
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        return n;

      case DO:
        n = new Node(t, { isLoop: true });
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        t.mustMatch(WHILE);
        n.condition = HeadExpression(t, x);
        if (!x.ecmaStrictMode) {
            // <script language="JavaScript"> (without version hints) may need
            // automatic semicolon insertion without a newline after do-while.
            // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            t.match(SEMICOLON);
            return n;
        }
        break;

      case BREAK:
      case CONTINUE:
        n = new Node(t);

        // handle the |foo: break foo;| corner case
        x2 = x.pushTarget(n);

        if (t.peekOnSameLine() === IDENTIFIER) {
            t.get();
            n.label = t.token.value;
        }

        n.target = n.label
                 ? x2.labeledTargets.find(function(target) { return target.labels.has(n.label) })
                 : x2.defaultTarget;

        if (!n.target)
            throw t.newSyntaxError("Invalid " + ((tt === BREAK) ? "break" : "continue"));
        if (!n.target.isLoop && tt === CONTINUE)
            throw t.newSyntaxError("Invalid continue");

        break;

      case TRY:
        n = new Node(t, { catchClauses: [] });
        n.tryBlock = Block(t, x);
        while (t.match(CATCH)) {
            n2 = new Node(t);
            p = MaybeLeftParen(t, x);
            switch (t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                // Destructured catch identifiers.
                t.unget();
                n2.varName = DestructuringExpression(t, x, true);
                break;
              case IDENTIFIER:
                n2.varName = t.token.value;
                break;
              default:
                throw t.newSyntaxError("missing identifier in catch");
                break;
            }
            if (t.match(IF)) {
                if (x.ecma3OnlyMode)
                    throw t.newSyntaxError("Illegal catch guard");
                if (n.catchClauses.length && !n.catchClauses.top().guard)
                    throw t.newSyntaxError("Guarded catch after unguarded");
                n2.guard = Expression(t, x);
            }
            MaybeRightParen(t, p);
            n2.block = Block(t, x);
            n.catchClauses.push(n2);
        }
        if (t.match(FINALLY))
            n.finallyBlock = Block(t, x);
        if (!n.catchClauses.length && !n.finallyBlock)
            throw t.newSyntaxError("Invalid try statement");
        return n;

      case CATCH:
      case FINALLY:
        throw t.newSyntaxError(definitions.tokens[tt] + " without preceding try");

      case THROW:
        n = new Node(t);
        n.exception = Expression(t, x);
        break;

      case RETURN:
        n = ReturnOrYield(t, x);
        break;

      case WITH:
        n = new Node(t);
        n.object = HeadExpression(t, x);
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        return n;

      case VAR:
      case CONST:
        n = Variables(t, x);
        break;

      case LET:
        if (t.peek() === LEFT_PAREN)
            n = LetBlock(t, x, true);
        else
            n = Variables(t, x);
        break;

      case DEBUGGER:
        n = new Node(t);
        break;

      case NEWLINE:
      case SEMICOLON:
        n = new Node(t, { type: SEMICOLON });
        n.expression = null;
        return n;

      default:
        if (tt === IDENTIFIER) {
            tt = t.peek();
            // Labeled statement.
            if (tt === COLON) {
                label = t.token.value;
                if (x.allLabels.has(label))
                    throw t.newSyntaxError("Duplicate label");
                t.get();
                n = new Node(t, { type: LABEL, label: label });
                n.statement = Statement(t, x.pushLabel(label).nest(NESTING_SHALLOW));
                n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                return n;
            }
        }

        // Expression statement.
        // We unget the current token to parse the expression as a whole.
        n = new Node(t, { type: SEMICOLON });
        t.unget();
        n.expression = Expression(t, x);
        n.end = n.expression.end;
        break;
    }

    MagicalSemicolon(t);
    return n;
}

function MagicalSemicolon(t) {
    var tt;
    if (t.lineno === t.token.lineno) {
        tt = t.peekOnSameLine();
        if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY)
            throw t.newSyntaxError("missing ; before statement");
    }
    t.match(SEMICOLON);
}

function ReturnOrYield(t, x) {
    var n, b, tt = t.token.type, tt2;

    var parentScript = x.parentScript;

    if (tt === RETURN) {
        if (!x.inFunction)
            throw t.newSyntaxError("Return not in function");
    } else /* if (tt === YIELD) */ {
        if (!x.inFunction)
            throw t.newSyntaxError("Yield not in function");
        parentScript.isGenerator = true;
    }
    n = new Node(t, { value: undefined });

    tt2 = t.peek(true);
    if (tt2 !== END && tt2 !== NEWLINE &&
        tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY
        && (tt !== YIELD ||
            (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN &&
             tt2 !== COLON && tt2 !== COMMA))) {
        if (tt === RETURN) {
            n.value = Expression(t, x);
            parentScript.hasReturnWithValue = true;
        } else {
            n.value = AssignExpression(t, x);
        }
    } else if (tt === RETURN) {
        parentScript.hasEmptyReturn = true;
    }

    // Disallow return v; in generator.
    if (parentScript.hasReturnWithValue && parentScript.isGenerator)
        throw t.newSyntaxError("Generator returns a value");

    return n;
}

/*
 * FunctionDefinition :: (tokenizer, compiler context, boolean,
 *                        DECLARED_FORM or EXPRESSED_FORM or STATEMENT_FORM)
 *                    -> node
 */
function FunctionDefinition(t, x, requireName, functionForm) {
    var tt;
    var f = new Node(t, { params: [] });
    if (f.type !== FUNCTION)
        f.type = (f.value === "get") ? GETTER : SETTER;
    if (t.match(IDENTIFIER))
        f.name = t.token.value;
    else if (requireName)
        throw t.newSyntaxError("missing function identifier");

    var x2 = new StaticContext(null, null, true, false, NESTING_TOP);

    t.mustMatch(LEFT_PAREN);
    if (!t.match(RIGHT_PAREN)) {
        do {
            switch (t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                // Destructured formal parameters.
                t.unget();
                f.params.push(DestructuringExpression(t, x2));
                break;
              case IDENTIFIER:
                f.params.push(t.token.value);
                break;
              default:
                throw t.newSyntaxError("missing formal parameter");
                break;
            }
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_PAREN);
    }

    // Do we have an expression closure or a normal body?
    tt = t.get();
    if (tt !== LEFT_CURLY)
        t.unget();

    if (tt !== LEFT_CURLY) {
        f.body = AssignExpression(t, x2);
        if (f.body.isGenerator)
            throw t.newSyntaxError("Generator returns a value");
    } else {
        f.body = Script(t, true);
    }

    if (tt === LEFT_CURLY)
        t.mustMatch(RIGHT_CURLY);

    f.end = t.token.end;
    f.functionForm = functionForm;
    if (functionForm === DECLARED_FORM)
        x.parentScript.funDecls.push(f);
    return f;
}

/*
 * Variables :: (tokenizer, compiler context) -> node
 *
 * Parses a comma-separated list of var declarations (and maybe
 * initializations).
 */
function Variables(t, x, letBlock) {
    var n, n2, ss, i, s, tt;

    tt = t.token.type;
    switch (tt) {
      case VAR:
      case CONST:
        s = x.parentScript;
        break;
      case LET:
        s = x.parentBlock;
        break;
      case LEFT_PAREN:
        tt = LET;
        s = letBlock;
        break;
    }

    n = new Node(t, { type: tt, destructurings: [] });

    do {
        tt = t.get();
        if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
            // Need to unget to parse the full destructured expression.
            t.unget();

            var dexp = DestructuringExpression(t, x, true);

            n2 = new Node(t, { type: IDENTIFIER,
                               name: dexp,
                               readOnly: n.type === CONST });
            n.push(n2);
            pushDestructuringVarDecls(n2.name.destructuredNames, s);
            n.destructurings.push({ exp: dexp, decl: n2 });

            if (x.inForLoopInit && t.peek() === IN) {
                continue;
            }

            t.mustMatch(ASSIGN);
            if (t.token.assignOp)
                throw t.newSyntaxError("Invalid variable initialization");

            n2.initializer = AssignExpression(t, x);

            continue;
        }

        if (tt !== IDENTIFIER)
            throw t.newSyntaxError("missing variable name");

        n2 = new Node(t, { type: IDENTIFIER,
                           name: t.token.value,
                           readOnly: n.type === CONST });
        n.push(n2);
        s.varDecls.push(n2);

        if (t.match(ASSIGN)) {
            if (t.token.assignOp)
                throw t.newSyntaxError("Invalid variable initialization");

            n2.initializer = AssignExpression(t, x);
        }
    } while (t.match(COMMA));

    return n;
}

/*
 * LetBlock :: (tokenizer, compiler context, boolean) -> node
 *
 * Does not handle let inside of for loop init.
 */
function LetBlock(t, x, isStatement) {
    var n, n2;

    // t.token.type must be LET
    n = new Node(t, { type: LET_BLOCK, varDecls: [] });
    t.mustMatch(LEFT_PAREN);
    n.variables = Variables(t, x, n);
    t.mustMatch(RIGHT_PAREN);

    if (isStatement && t.peek() !== LEFT_CURLY) {
        /*
         * If this is really an expression in let statement guise, then we
         * need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
         * the return value of the expression.
         */
        n2 = new Node(t, { type: SEMICOLON,
                           expression: n });
        isStatement = false;
    }

    if (isStatement)
        n.block = Block(t, x);
    else
        n.expression = AssignExpression(t, x);

    return n;
}

function checkDestructuring(t, x, n, simpleNamesOnly) {
    if (n.type === ARRAY_COMP)
        throw t.newSyntaxError("Invalid array comprehension left-hand side");
    if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT)
        return;

    var lhss = {};
    var nn, n2, idx, sub, cc, c = n.children;
    for (var i = 0, j = c.length; i < j; i++) {
        if (!(nn = c[i]))
            continue;
        if (nn.type === PROPERTY_INIT) {
            cc = nn.children;
            sub = cc[1];
            idx = cc[0].value;
        } else if (n.type === OBJECT_INIT) {
            // Do we have destructuring shorthand {foo, bar}?
            sub = nn;
            idx = nn.value;
        } else {
            sub = nn;
            idx = i;
        }

        if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
            lhss[idx] = checkDestructuring(t, x, sub, simpleNamesOnly);
        } else {
            if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                // In declarations, lhs must be simple names
                throw t.newSyntaxError("missing name in pattern");
            }

            lhss[idx] = sub;
        }
    }

    return lhss;
}

function DestructuringExpression(t, x, simpleNamesOnly) {
    var n = PrimaryExpression(t, x);
    // Keep the list of lefthand sides for varDecls
    n.destructuredNames = checkDestructuring(t, x, n, simpleNamesOnly);
    return n;
}

function GeneratorExpression(t, x, e) {
    return new Node(t, { type: GENERATOR,
                         expression: e,
                         tail: ComprehensionTail(t, x) });
}

function ComprehensionTail(t, x) {
    var body, n, n2, n3, p;

    // t.token.type must be FOR
    body = new Node(t, { type: COMP_TAIL });

    do {
        // Comprehension tails are always for..in loops.
        n = new Node(t, { type: FOR_IN, isLoop: true });
        if (t.match(IDENTIFIER)) {
            // But sometimes they're for each..in.
            if (t.token.value === "each")
                n.isEach = true;
            else
                t.unget();
        }
        p = MaybeLeftParen(t, x);
        switch(t.get()) {
          case LEFT_BRACKET:
          case LEFT_CURLY:
            t.unget();
            // Destructured left side of for in comprehension tails.
            n.iterator = DestructuringExpression(t, x);
            break;

          case IDENTIFIER:
            n.iterator = n3 = new Node(t, { type: IDENTIFIER });
            n3.name = n3.value;
            n.varDecl = n2 = new Node(t, { type: VAR });
            n2.push(n3);
            x.parentScript.varDecls.push(n3);
            // Don't add to varDecls since the semantics of comprehensions is
            // such that the variables are in their own function when
            // desugared.
            break;

          default:
            throw t.newSyntaxError("missing identifier");
        }
        t.mustMatch(IN);
        n.object = Expression(t, x);
        MaybeRightParen(t, p);
        body.push(n);
    } while (t.match(FOR));

    // Optional guard.
    if (t.match(IF))
        body.guard = HeadExpression(t, x);

    return body;
}

function HeadExpression(t, x) {
    var p = MaybeLeftParen(t, x);
    var n = ParenExpression(t, x);
    MaybeRightParen(t, p);
    if (p === END && !n.parenthesized) {
        var tt = t.peek();
        if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt])
            throw t.newSyntaxError("Unparenthesized head followed by unbraced body");
    }
    return n;
}

function ParenExpression(t, x) {
    // Always accept the 'in' operator in a parenthesized expression,
    // where it's unambiguous, even if we might be parsing the init of a
    // for statement.
    var n = Expression(t, x.update({ inForLoopInit: x.inForLoopInit &&
                                                    (t.token.type === LEFT_PAREN) }));

    if (t.match(FOR)) {
        if (n.type === YIELD && !n.parenthesized)
            throw t.newSyntaxError("Yield expression must be parenthesized");
        if (n.type === COMMA && !n.parenthesized)
            throw t.newSyntaxError("Generator expression must be parenthesized");
        n = GeneratorExpression(t, x, n);
    }

    return n;
}

/*
 * Expression :: (tokenizer, compiler context) -> node
 *
 * Top-down expression parser matched against SpiderMonkey.
 */
function Expression(t, x) {
    var n, n2;

    n = AssignExpression(t, x);
    if (t.match(COMMA)) {
        n2 = new Node(t, { type: COMMA });
        n2.push(n);
        n = n2;
        do {
            n2 = n.children[n.children.length-1];
            if (n2.type === YIELD && !n2.parenthesized)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            n.push(AssignExpression(t, x));
        } while (t.match(COMMA));
    }

    return n;
}

function AssignExpression(t, x) {
    var n, lhs;

    // Have to treat yield like an operand because it could be the leftmost
    // operand of the expression.
    if (t.match(YIELD, true))
        return ReturnOrYield(t, x);

    n = new Node(t, { type: ASSIGN });
    lhs = ConditionalExpression(t, x);

    if (!t.match(ASSIGN)) {
        return lhs;
    }

    switch (lhs.type) {
      case OBJECT_INIT:
      case ARRAY_INIT:
        lhs.destructuredNames = checkDestructuring(t, x, lhs);
        // FALL THROUGH
      case IDENTIFIER: case DOT: case INDEX: case CALL:
        break;
      default:
        throw t.newSyntaxError("Bad left-hand side of assignment");
        break;
    }

    n.assignOp = t.token.assignOp;
    n.push(lhs);
    n.push(AssignExpression(t, x));

    return n;
}

function ConditionalExpression(t, x) {
    var n, n2;

    n = OrExpression(t, x);
    if (t.match(HOOK)) {
        n2 = n;
        n = new Node(t, { type: HOOK });
        n.push(n2);
        /*
         * Always accept the 'in' operator in the middle clause of a ternary,
         * where it's unambiguous, even if we might be parsing the init of a
         * for statement.
         */
        n.push(AssignExpression(t, x.update({ inForLoopInit: false })));
        if (!t.match(COLON))
            throw t.newSyntaxError("missing : after ?");
        n.push(AssignExpression(t, x));
    }

    return n;
}

function OrExpression(t, x) {
    var n, n2;

    n = AndExpression(t, x);
    while (t.match(OR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(AndExpression(t, x));
        n = n2;
    }

    return n;
}

function AndExpression(t, x) {
    var n, n2;

    n = BitwiseOrExpression(t, x);
    while (t.match(AND)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseOrExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseOrExpression(t, x) {
    var n, n2;

    n = BitwiseXorExpression(t, x);
    while (t.match(BITWISE_OR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseXorExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseXorExpression(t, x) {
    var n, n2;

    n = BitwiseAndExpression(t, x);
    while (t.match(BITWISE_XOR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseAndExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseAndExpression(t, x) {
    var n, n2;

    n = EqualityExpression(t, x);
    while (t.match(BITWISE_AND)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(EqualityExpression(t, x));
        n = n2;
    }

    return n;
}

function EqualityExpression(t, x) {
    var n, n2;

    n = RelationalExpression(t, x);
    while (t.match(EQ) || t.match(NE) ||
           t.match(STRICT_EQ) || t.match(STRICT_NE)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(RelationalExpression(t, x));
        n = n2;
    }

    return n;
}

function RelationalExpression(t, x) {
    var n, n2;

    /*
     * Uses of the in operator in shiftExprs are always unambiguous,
     * so unset the flag that prohibits recognizing it.
     */
    var x2 = x.update({ inForLoopInit: false });
    n = ShiftExpression(t, x2);
    while ((t.match(LT) || t.match(LE) || t.match(GE) || t.match(GT) ||
           (!x.inForLoopInit && t.match(IN)) ||
           t.match(INSTANCEOF))) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(ShiftExpression(t, x2));
        n = n2;
    }

    return n;
}

function ShiftExpression(t, x) {
    var n, n2;

    n = AddExpression(t, x);
    while (t.match(LSH) || t.match(RSH) || t.match(URSH)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(AddExpression(t, x));
        n = n2;
    }

    return n;
}

function AddExpression(t, x) {
    var n, n2;

    n = MultiplyExpression(t, x);
    while (t.match(PLUS) || t.match(MINUS)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(MultiplyExpression(t, x));
        n = n2;
    }

    return n;
}

function MultiplyExpression(t, x) {
    var n, n2;

    n = UnaryExpression(t, x);
    while (t.match(MUL) || t.match(DIV) || t.match(MOD)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(UnaryExpression(t, x));
        n = n2;
    }

    return n;
}

function UnaryExpression(t, x) {
    var n, n2, tt;

    switch (tt = t.get(true)) {
      case DELETE: case VOID: case TYPEOF:
      case NOT: case BITWISE_NOT: case PLUS: case MINUS:
        if (tt === PLUS)
            n = new Node(t, { type: UNARY_PLUS });
        else if (tt === MINUS)
            n = new Node(t, { type: UNARY_MINUS });
        else
            n = new Node(t);
        n.push(UnaryExpression(t, x));
        break;

      case INCREMENT:
      case DECREMENT:
        // Prefix increment/decrement.
        n = new Node(t);
        n.push(MemberExpression(t, x, true));
        break;

      default:
        t.unget();
        n = MemberExpression(t, x, true);

        // Don't look across a newline boundary for a postfix {in,de}crement.
        if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno ===
            t.lineno) {
            if (t.match(INCREMENT) || t.match(DECREMENT)) {
                n2 = new Node(t, { postfix: true });
                n2.push(n);
                n = n2;
            }
        }
        break;
    }

    return n;
}

function MemberExpression(t, x, allowCallSyntax) {
    var n, n2, name, tt;

    if (t.match(NEW)) {
        n = new Node(t);
        n.push(MemberExpression(t, x, false));
        if (t.match(LEFT_PAREN)) {
            n.type = NEW_WITH_ARGS;
            n.push(ArgumentList(t, x));
        }
    } else {
        n = PrimaryExpression(t, x);
    }

    while ((tt = t.get()) !== END) {
        switch (tt) {
          case DOT:
            n2 = new Node(t);
            n2.push(n);
            t.mustMatch(IDENTIFIER);
            n2.push(new Node(t));
            break;

          case LEFT_BRACKET:
            n2 = new Node(t, { type: INDEX });
            n2.push(n);
            n2.push(Expression(t, x));
            t.mustMatch(RIGHT_BRACKET);
            break;

          case LEFT_PAREN:
            if (allowCallSyntax) {
                n2 = new Node(t, { type: CALL });
                n2.push(n);
                n2.push(ArgumentList(t, x));
                break;
            }

            // FALL THROUGH
          default:
            t.unget();
            return n;
        }

        n = n2;
    }

    return n;
}

function ArgumentList(t, x) {
    var n, n2;

    n = new Node(t, { type: LIST });
    if (t.match(RIGHT_PAREN, true))
        return n;
    do {
        n2 = AssignExpression(t, x);
        if (n2.type === YIELD && !n2.parenthesized && t.peek() === COMMA)
            throw t.newSyntaxError("Yield expression must be parenthesized");
        if (t.match(FOR)) {
            n2 = GeneratorExpression(t, x, n2);
            if (n.children.length > 1 || t.peek(true) === COMMA)
                throw t.newSyntaxError("Generator expression must be parenthesized");
        }
        n.push(n2);
    } while (t.match(COMMA));
    t.mustMatch(RIGHT_PAREN);

    return n;
}

function PrimaryExpression(t, x) {
    var n, n2, tt = t.get(true);

    switch (tt) {
      case FUNCTION:
        n = FunctionDefinition(t, x, false, EXPRESSED_FORM);
        break;

      case LEFT_BRACKET:
        n = new Node(t, { type: ARRAY_INIT });
        while ((tt = t.peek(true)) !== RIGHT_BRACKET) {
            if (tt === COMMA) {
                t.get();
                n.push(null);
                continue;
            }
            n.push(AssignExpression(t, x));
            if (tt !== COMMA && !t.match(COMMA))
                break;
        }

        // If we matched exactly one element and got a FOR, we have an
        // array comprehension.
        if (n.children.length === 1 && t.match(FOR)) {
            n2 = new Node(t, { type: ARRAY_COMP,
                               expression: n.children[0],
                               tail: ComprehensionTail(t, x) });
            n = n2;
        }
        t.mustMatch(RIGHT_BRACKET);
        break;

      case LEFT_CURLY:
        var id, fd;
        n = new Node(t, { type: OBJECT_INIT });

      object_init:
        if (!t.match(RIGHT_CURLY)) {
            do {
                tt = t.get();
                if ((t.token.value === "get" || t.token.value === "set") &&
                    t.peek() === IDENTIFIER) {
                    if (x.ecma3OnlyMode)
                        throw t.newSyntaxError("Illegal property accessor");
                    n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                } else {
                    switch (tt) {
                      case IDENTIFIER: case NUMBER: case STRING:
                        id = new Node(t, { type: IDENTIFIER });
                        break;
                      case RIGHT_CURLY:
                        if (x.ecma3OnlyMode)
                            throw t.newSyntaxError("Illegal trailing ,");
                        break object_init;
                      default:
                        if (t.token.value in definitions.keywords) {
                            id = new Node(t, { type: IDENTIFIER });
                            break;
                        }
                        throw t.newSyntaxError("Invalid property name");
                    }
                    if (t.match(COLON)) {
                        n2 = new Node(t, { type: PROPERTY_INIT });
                        n2.push(id);
                        n2.push(AssignExpression(t, x));
                        n.push(n2);
                    } else {
                        // Support, e.g., |var {x, y} = o| as destructuring shorthand
                        // for |var {x: x, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                        if (t.peek() !== COMMA && t.peek() !== RIGHT_CURLY)
                            throw t.newSyntaxError("missing : after property");
                        n.push(id);
                    }
                }
            } while (t.match(COMMA));
            t.mustMatch(RIGHT_CURLY);
        }
        break;

      case LEFT_PAREN:
        n = ParenExpression(t, x);
        t.mustMatch(RIGHT_PAREN);
        n.parenthesized = true;
        break;

      case LET:
        n = LetBlock(t, x, false);
        break;

      case NULL: case THIS: case TRUE: case FALSE:
      case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
        n = new Node(t);
        break;

      default:
        throw t.newSyntaxError("missing operand");
        break;
    }

    return n;
}

/*
 * parse :: (source, filename, line number) -> node
 */
function parse(s, f, l) {
    var t = new lexer.Tokenizer(s, f, l);
    var n = Script(t, false);
    if (!t.done)
        throw t.newSyntaxError("Syntax error");

    return n;
}

/*
 * parseStdin :: (source, {line number}) -> node
 */
function parseStdin(s, ln) {
    for (;;) {
        try {
            var t = new lexer.Tokenizer(s, "stdin", ln.value);
            var n = Script(t, false);
            ln.value = t.lineno;
            return n;
        } catch (e) {
            if (!t.unexpectedEOF)
                throw e;
            var more = readline();
            if (!more)
                throw e;
            s += "\n" + more;
        }
    }
}

exports.parse = parse;
exports.parseStdin = parseStdin;
exports.Node = Node;
exports.DECLARED_FORM = DECLARED_FORM;
exports.EXPRESSED_FORM = EXPRESSED_FORM;
exports.STATEMENT_FORM = STATEMENT_FORM;
exports.Tokenizer = lexer.Tokenizer;
exports.FunctionDefinition = FunctionDefinition;

});