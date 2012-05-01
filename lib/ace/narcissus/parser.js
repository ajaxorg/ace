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

var lexer = require('./lexer');
var definitions = require('./definitions');
var options = require('./options');
var Tokenizer = lexer.Tokenizer;

var Dict = definitions.Dict;
var Stack = definitions.Stack;

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

function Parser(tokenizer) {
    tokenizer.parser = this;
    this.t = tokenizer;
    this.x = null;
    this.unexpectedEOF = false;
    options.mozillaMode && (this.mozillaMode = true);
    options.parenFreeMode && (this.parenFreeMode = true);
}

function StaticContext(parentScript, parentBlock, inModule, inFunction, strictMode) {
    this.parentScript = parentScript;
    this.parentBlock = parentBlock || parentScript;
    this.inModule = inModule || false;
    this.inFunction = inFunction || false;
    this.inForLoopInit = false;
    this.topLevel = true;
    this.allLabels = new Stack();
    this.currentLabels = new Stack();
    this.labeledTargets = new Stack();
    this.defaultLoopTarget = null;
    this.defaultTarget = null;
    this.strictMode = strictMode;
}

StaticContext.prototype = {
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
        var isDefaultLoopTarget = target.isLoop;
        var isDefaultTarget = isDefaultLoopTarget || target.type === SWITCH;

        if (this.currentLabels.isEmpty()) {
            if (isDefaultLoopTarget) this.update({ defaultLoopTarget: target });
            if (isDefaultTarget) this.update({ defaultTarget: target });
            return this;
        }

        target.labels = new Dict();
        this.currentLabels.forEach(function(label) {
            target.labels.set(label, true);
        });
        return this.update({ currentLabels: new Stack(),
                             labeledTargets: this.labeledTargets.push(target),
                             defaultLoopTarget: isDefaultLoopTarget
                             ? target
                             : this.defaultLoopTarget,
                             defaultTarget: isDefaultTarget
                             ? target
                             : this.defaultTarget });
    },
    nest: function() {
        return this.topLevel ? this.update({ topLevel: false }) : this;
    },
    canImport: function() {
        return this.topLevel && !this.inFunction;
    },
    canExport: function() {
        return this.inModule && this.topLevel && !this.inFunction;
    },
    banWith: function() {
        return this.strictMode || this.inModule;
    },
    modulesAllowed: function() {
        return this.topLevel && !this.inFunction;
    }
};

var Pp = Parser.prototype;

Pp.mozillaMode = false;

Pp.parenFreeMode = false;

Pp.withContext = function(x, f) {
    var x0 = this.x;
    this.x = x;
    var result = f.call(this);
    // NB: we don't bother with finally, since exceptions trash the parser
    this.x = x0;
    return result;
};

Pp.newNode = function newNode(opts) {
    return new Node(this.t, opts);
};

Pp.fail = function fail(msg) {
    throw this.t.newSyntaxError(msg);
};

Pp.match = function match(tt, scanOperand, keywordIsName) {
    return this.t.match(tt, scanOperand, keywordIsName);
};

Pp.mustMatch = function mustMatch(tt, keywordIsName) {
    return this.t.mustMatch(tt, keywordIsName);
};

Pp.peek = function peek(scanOperand) {
    return this.t.peek(scanOperand);
};

Pp.peekOnSameLine = function peekOnSameLine(scanOperand) {
    return this.t.peekOnSameLine(scanOperand);
};

Pp.done = function done() {
    return this.t.done;
};

/*
 * Script :: (boolean, boolean, boolean) -> node
 *
 * Parses the toplevel and module/function bodies.
 */
Pp.Script = function Script(inModule, inFunction, expectEnd) {
    var node = this.newNode(scriptInit());
    var x2 = new StaticContext(node, node, inModule, inFunction);
    this.withContext(x2, function() {
        this.Statements(node, true);
    });
    if (expectEnd && !this.done())
        this.fail("expected end of input");
    return node;
};

/*
 * Pragma :: (expression statement node) -> boolean
 *
 * Checks whether a node is a pragma and annotates it.
 */
function Pragma(n) {
    if (n.type === SEMICOLON) {
        var e = n.expression;
        if (e.type === STRING && e.value === "use strict") {
            n.pragma = "strict";
            return true;
        }
    }
    return false;
}

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

    this.filename = t.filename;
    this.children = [];

    for (var prop in init)
        this[prop] = init[prop];
}

/*
 * SyntheticNode :: (optional init object) -> node
 */
function SyntheticNode(init) {
    this.children = [];
    for (var prop in init)
        this[prop] = init[prop];
    this.synthetic = true;
}

var Np = Node.prototype = SyntheticNode.prototype = {};
Np.constructor = Node;

var TO_SOURCE_SKIP = {
    type: true,
    value: true,
    lineno: true,
    start: true,
    end: true,
    tokenizer: true,
    assignOp: true
};
function unevalableConst(code) {
    var token = definitions.tokens[code];
    var constName = definitions.opTypeNames.hasOwnProperty(token)
        ? definitions.opTypeNames[token]
        : token in definitions.keywords
        ? token.toUpperCase()
        : token;
    return { toSource: function() { return constName } };
}
Np.toSource = function toSource() {
    var mock = {};
    var self = this;
    mock.type = unevalableConst(this.type);
    // avoid infinite recursion in case of back-links
    if (this.generatingSource)
        return mock.toSource();
    this.generatingSource = true;
    if ("value" in this)
        mock.value = this.value;
    if ("lineno" in this)
        mock.lineno = this.lineno;
    if ("start" in this)
        mock.start = this.start;
    if ("end" in this)
        mock.end = this.end;
    if (this.assignOp)
        mock.assignOp = unevalableConst(this.assignOp);
    for (var key in this) {
        if (this.hasOwnProperty(key) && !(key in TO_SOURCE_SKIP))
            mock[key] = this[key];
    }
    try {
        return mock.toSource();
    } finally {
        delete this.generatingSource;
    }
};

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
    var INDENTATION = "    ";
    var n = ++Node.indentLevel;
    var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
    for (i = 0; i < a.length; i++)
        s += ",\n" + INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
    n = --Node.indentLevel;
    s += "\n" + INDENTATION.repeat(n) + "}";
    return s;
}

Np.synth = function(init) {
    var node = new SyntheticNode(init);
    node.filename = this.filename;
    node.lineno = this.lineno;
    node.start = this.start;
    node.end = this.end;
    return node;
};

/*
 * Helper init objects for common nodes.
 */

var LOOP_INIT = { isLoop: true };

function blockInit() {
    return { type: BLOCK, varDecls: [] };
}

function scriptInit() {
    return { type: SCRIPT,
             funDecls: [],
             varDecls: [],
             modDefns: new Dict(),
             modAssns: new Dict(),
             modDecls: new Dict(),
             modLoads: new Dict(),
             impDecls: [],
             expDecls: [],
             exports: new Dict(),
             hasEmptyReturn: false,
             hasReturnWithValue: false,
             hasYield: false };
}

definitions.defineGetter(Np, "length",
                         function() {
                             throw new Error("Node.prototype.length is gone; " +
                                             "use n.children.length instead");
                         });

definitions.defineProperty(String.prototype, "repeat",
                           function(n) {
                               var s = "", t = this + s;
                               while (--n >= 0)
                                   s += t;
                               return s;
                           }, false, false, true);

Pp.MaybeLeftParen = function MaybeLeftParen() {
    if (this.parenFreeMode)
        return this.match(LEFT_PAREN) ? LEFT_PAREN : END;
    return this.mustMatch(LEFT_PAREN).type;
};

Pp.MaybeRightParen = function MaybeRightParen(p) {
    if (p === LEFT_PAREN)
        this.mustMatch(RIGHT_PAREN);
}

/*
 * Statements :: (node[, boolean]) -> void
 *
 * Parses a sequence of Statements.
 */
Pp.Statements = function Statements(n, topLevel) {
    var prologue = !!topLevel;
    try {
        while (!this.done() && this.peek(true) !== RIGHT_CURLY) {
            var n2 = this.Statement();
            n.push(n2);
            if (prologue && Pragma(n2)) {
                this.x.strictMode = true;
                n.strict = true;
            } else {
                prologue = false;
            }
        }
    } catch (e) {
        try {
            if (this.done())
                this.unexpectedEOF = true;
        } catch(e) {}
        throw e;
    }
}

Pp.Block = function Block() {
    this.mustMatch(LEFT_CURLY);
    var n = this.newNode(blockInit());
    var x2 = this.x.update({ parentBlock: n }).pushTarget(n);
    this.withContext(x2, function() {
        this.Statements(n);
    });
    this.mustMatch(RIGHT_CURLY);
    return n;
}

var DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

/*
 * Export :: (binding node, boolean) -> Export
 *
 * Static semantic representation of a module export.
 */
function Export(node, isDefinition) {
    this.node = node;                 // the AST node declaring this individual export
    this.isDefinition = isDefinition; // is the node an 'export'-annotated definition?
    this.resolved = null;             // resolved pointer to the target of this export
}

/*
 * registerExport :: (Dict, EXPORT node) -> void
 */
function registerExport(exports, decl) {
    function register(name, exp) {
        if (exports.has(name))
            throw new SyntaxError("multiple exports of " + name);
        exports.set(name, exp);
    }

    switch (decl.type) {
      case MODULE:
      case FUNCTION:
        register(decl.name, new Export(decl, true));
        break;

      case VAR:
        for (var i = 0; i < decl.children.length; i++)
            register(decl.children[i].name, new Export(decl.children[i], true));
        break;

      case LET:
      case CONST:
        throw new Error("NYI: " + definitions.tokens[decl.type]);

      case EXPORT:
        for (var i = 0; i < decl.pathList.length; i++) {
            var path = decl.pathList[i];
            switch (path.type) {
              case OBJECT_INIT:
                for (var j = 0; j < path.children.length; j++) {
                    // init :: IDENTIFIER | PROPERTY_INIT
                    var init = path.children[j];
                    if (init.type === IDENTIFIER)
                        register(init.value, new Export(init, false));
                    else
                        register(init.children[0].value, new Export(init.children[1], false));
                }
                break;

              case DOT:
                register(path.children[1].value, new Export(path, false));
                break;

              case IDENTIFIER:
                register(path.value, new Export(path, false));
                break;

              default:
                throw new Error("unexpected export path: " + definitions.tokens[path.type]);
            }
        }
        break;

      default:
        throw new Error("unexpected export decl: " + definitions.tokens[exp.type]);
    }
}

/*
 * Module :: (node) -> Module
 *
 * Static semantic representation of a module.
 */
function Module(node) {
    var exports = node.body.exports;
    var modDefns = node.body.modDefns;

    var exportedModules = new Dict();

    exports.forEach(function(name, exp) {
        var node = exp.node;
        if (node.type === MODULE) {
            exportedModules.set(name, node);
        } else if (!exp.isDefinition && node.type === IDENTIFIER && modDefns.has(node.value)) {
            var mod = modDefns.get(node.value);
            exportedModules.set(name, mod);
        }
    });

    this.node = node;
    this.exports = exports;
    this.exportedModules = exportedModules;
}

/*
 * Statement :: () -> node
 *
 * Parses a Statement.
 */
Pp.Statement = function Statement() {
    var i, label, n, n2, p, c, ss, tt = this.t.get(true), tt2, x0, x2, x3;

    var comments = this.t.blockComments;

    // Cases for statements ending in a right curly return early, avoiding the
    // common semicolon insertion magic after this switch.
    switch (tt) {
      case IMPORT:
        if (!this.x.canImport())
            this.fail("illegal context for import statement");
        n = this.newNode();
        n.pathList = this.ImportPathList();
        this.x.parentScript.impDecls.push(n);
        break;

      case EXPORT:
        if (!this.x.canExport())
            this.fail("export statement not in module top level");
        switch (this.peek()) {
          case MODULE:
          case FUNCTION:
          case LET:
          case VAR:
          case CONST:
            n = this.Statement();
            n.blockComments = comments;
            n.exported = true;
            this.x.parentScript.expDecls.push(n);
            registerExport(this.x.parentScript.exports, n);
            return n;
        }
        n = this.newNode();
        n.pathList = this.ExportPathList();
        this.x.parentScript.expDecls.push(n);
        registerExport(this.x.parentScript.exports, n);
        break;

      case FUNCTION:
        // DECLARED_FORM extends funDecls of x, STATEMENT_FORM doesn't.
        return this.FunctionDefinition(true, this.x.topLevel ? DECLARED_FORM : STATEMENT_FORM, comments);

      case LEFT_CURLY:
        n = this.newNode(blockInit());
        x2 = this.x.update({ parentBlock: n }).pushTarget(n).nest();
        this.withContext(x2, function() {
            this.Statements(n);
        });
        this.mustMatch(RIGHT_CURLY);
        return n;

      case IF:
        n = this.newNode();
        n.condition = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
            n.thenPart = this.Statement();
            n.elsePart = this.match(ELSE, true) ? this.Statement() : null;
        });
        return n;

      case SWITCH:
        // This allows CASEs after a DEFAULT, which is in the standard.
        n = this.newNode({ cases: [], defaultIndex: -1 });
        n.discriminant = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
            this.mustMatch(LEFT_CURLY);
            while ((tt = this.t.get()) !== RIGHT_CURLY) {
                switch (tt) {
                  case DEFAULT:
                    if (n.defaultIndex >= 0)
                        this.fail("More than one switch default");
                    // FALL THROUGH
                  case CASE:
                    n2 = this.newNode();
                    if (tt === DEFAULT)
                        n.defaultIndex = n.cases.length;
                    else
                        n2.caseLabel = this.Expression(COLON);
                    break;

                  default:
                    this.fail("Invalid switch case");
                }
                this.mustMatch(COLON);
                n2.statements = this.newNode(blockInit());
                while ((tt=this.peek(true)) !== CASE && tt !== DEFAULT &&
                       tt !== RIGHT_CURLY)
                    n2.statements.push(this.Statement());
                n.cases.push(n2);
            }
        });
        return n;

      case FOR:
        n = this.newNode(LOOP_INIT);
        n.blockComments = comments;
        if (this.match(IDENTIFIER)) {
            if (this.t.token.value === "each")
                n.isEach = true;
            else
                this.t.unget();
        }
        if (!this.parenFreeMode)
            this.mustMatch(LEFT_PAREN);
        x2 = this.x.pushTarget(n).nest();
        x3 = this.x.update({ inForLoopInit: true });
        n2 = null;
        if ((tt = this.peek(true)) !== SEMICOLON) {
            this.withContext(x3, function() {
                if (tt === VAR || tt === CONST) {
                    this.t.get();
                    n2 = this.Variables();
                } else if (tt === LET) {
                    this.t.get();
                    if (this.peek() === LEFT_PAREN) {
                        n2 = this.LetBlock(false);
                    } else {
                        // Let in for head, we need to add an implicit block
                        // around the rest of the for.
                        this.x.parentBlock = n;
                        n.varDecls = [];
                        n2 = this.Variables();
                    }
                } else {
                    n2 = this.Expression();
                }
            });
        }
        if (n2 && this.match(IN)) {
            n.type = FOR_IN;
            this.withContext(x3, function() {
                n.object = this.Expression();
                if (n2.type === VAR || n2.type === LET) {
                    c = n2.children;

                    // Destructuring turns one decl into multiples, so either
                    // there must be only one destructuring or only one
                    // decl.
                    if (c.length !== 1 && n2.destructurings.length !== 1) {
                        // FIXME: this.fail ?
                        throw new SyntaxError("Invalid for..in left-hand side",
                                              this.filename, n2.lineno);
                    }
                    if (n2.destructurings.length > 0) {
                        n.iterator = n2.destructurings[0];
                    } else {
                        n.iterator = c[0];
                    }
                    n.varDecl = n2;
                } else {
                    if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                        n2.destructuredNames = this.checkDestructuring(n2);
                    }
                    n.iterator = n2;
                }
            });
        } else {
            x3.inForLoopInit = false;
            n.setup = n2;
            this.mustMatch(SEMICOLON);
            if (n.isEach)
                this.fail("Invalid for each..in loop");
            this.withContext(x3, function() {
                n.condition = (this.peek(true) === SEMICOLON)
                    ? null
                    : this.Expression();
                this.mustMatch(SEMICOLON);
                tt2 = this.peek(true);
                n.update = (this.parenFreeMode
                            ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2]
                            : tt2 === RIGHT_PAREN)
                    ? null
                    : this.Expression();
            });
        }
        if (!this.parenFreeMode)
            this.mustMatch(RIGHT_PAREN);
        this.withContext(x2, function() {
            n.body = this.Statement();
        });
        return n;

      case WHILE:
        n = this.newNode({ isLoop: true });
        n.blockComments = comments;
        n.condition = this.HeadExpression();
        x2 = this.x.pushTarget(n).nest();
        this.withContext(x2, function() {
            n.body = this.Statement();
        });
        return n;

      case DO:
        n = this.newNode({ isLoop: true });
        n.blockComments = comments;
        x2 = this.x.pushTarget(n).next();
        this.withContext(x2, function() {
            n.body = this.Statement();
        });
        this.mustMatch(WHILE);
        n.condition = this.HeadExpression();
        // <script language="JavaScript"> (without version hints) may need
        // automatic semicolon insertion without a newline after do-while.
        // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
        this.match(SEMICOLON);
        return n;

      case BREAK:
      case CONTINUE:
        n = this.newNode();
        n.blockComments = comments;

        // handle the |foo: break foo;| corner case
        x2 = this.x.pushTarget(n);

        if (this.peekOnSameLine() === IDENTIFIER) {
            this.t.get();
            n.label = this.t.token.value;
        }

        if (n.label) {
            n.target = x2.labeledTargets.find(function(target) {
                return target.labels.has(n.label)
            });
        } else if (tt === CONTINUE) {
            n.target = x2.defaultLoopTarget;
        } else {
            n.target = x2.defaultTarget;
        }

        if (!n.target)
            this.fail("Invalid " + ((tt === BREAK) ? "break" : "continue"));
        if (!n.target.isLoop && tt === CONTINUE)
            this.fail("Invalid continue");

        break;

      case TRY:
        n = this.newNode({ catchClauses: [] });
        n.blockComments = comments;
        n.tryBlock = this.Block();
        while (this.match(CATCH)) {
            n2 = this.newNode();
            p = this.MaybeLeftParen();
            switch (this.t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                // Destructured catch identifiers.
                this.t.unget();
                n2.varName = this.DestructuringExpression(true);
                break;
              case IDENTIFIER:
                n2.varName = this.t.token.value;
                break;
              default:
                this.fail("missing identifier in catch");
                break;
            }
            if (this.match(IF)) {
                if (!this.mozillaMode)
                    this.fail("Illegal catch guard");
                if (n.catchClauses.length && !n.catchClauses.top().guard)
                    this.fail("Guarded catch after unguarded");
                n2.guard = this.Expression();
            }
            this.MaybeRightParen(p);
            n2.block = this.Block();
            n.catchClauses.push(n2);
        }
        if (this.match(FINALLY))
            n.finallyBlock = this.Block();
        if (!n.catchClauses.length && !n.finallyBlock)
            this.fail("Invalid try statement");
        return n;

      case CATCH:
      case FINALLY:
        this.fail(definitions.tokens[tt] + " without preceding try");

      case THROW:
        n = this.newNode();
        n.exception = this.Expression();
        break;

      case RETURN:
        n = this.ReturnOrYield();
        break;

      case WITH:
        if (this.x.banWith())
            this.fail("with statements not allowed in strict code or modules");
        n = this.newNode();
        n.blockComments = comments;
        n.object = this.HeadExpression();
        x2 = this.x.pushTarget(n).next();
        this.withContext(x2, function() {
            n.body = this.Statement();
        });
        return n;

      case VAR:
      case CONST:
        n = this.Variables();
        break;

      case LET:
        if (this.peek() === LEFT_PAREN) {
            n = this.LetBlock(true);
            return n;
        }
        n = this.Variables();
        break;

      case DEBUGGER:
        n = this.newNode();
        break;

      case NEWLINE:
      case SEMICOLON:
        n = this.newNode({ type: SEMICOLON });
        n.blockComments = comments;
        n.expression = null;
        return n;

      case IDENTIFIER:
      case USE:
      case MODULE:
        switch (this.t.token.value) {
          case "use":
            if (!isPragmaToken(this.peekOnSameLine())) {
                this.t.unget();
                break;
            }
            return this.newNode({ type: USE, params: this.Pragmas() });

          case "module":
            if (!this.x.modulesAllowed())
                this.fail("module declaration not at top level");
            this.x.parentScript.hasModules = true;
            tt = this.peekOnSameLine();
            if (tt !== IDENTIFIER && tt !== LEFT_CURLY) {
                this.t.unget();
                break;
            }
            n = this.newNode({ type: MODULE });
            n.blockComments = comments;
            this.mustMatch(IDENTIFIER);
            label = this.t.token.value;

            if (this.match(LEFT_CURLY)) {
                n.name = label;
                n.body = this.Script(true, false);
                n.module = new Module(n);
                this.mustMatch(RIGHT_CURLY);
                this.x.parentScript.modDefns.set(n.name, n);
                return n;
            }

            this.t.unget();
            this.ModuleVariables(n);
            return n;

          default:
            tt = this.peek();
            // Labeled statement.
            if (tt === COLON) {
                label = this.t.token.value;
                if (this.x.allLabels.has(label))
                    this.fail("Duplicate label: " + label);
                this.t.get();
                n = this.newNode({ type: LABEL, label: label });
                n.blockComments = comments;
                x2 = this.x.pushLabel(label).nest();
                this.withContext(x2, function() {
                    n.statement = this.Statement();
                });
                n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                return n;
            }
            // FALL THROUGH
        }
        // FALL THROUGH

      default:
        // Expression statement.
        // We unget the current token to parse the expression as a whole.
        n = this.newNode({ type: SEMICOLON });
        this.t.unget();
        n.blockComments = comments;
        n.expression = this.Expression();
        n.end = n.expression.end;
        break;
    }

    n.blockComments = comments;
    this.MagicalSemicolon();
    return n;
}

/*
 * isPragmaToken :: (number) -> boolean
 */
function isPragmaToken(tt) {
    switch (tt) {
      case IDENTIFIER:
      case STRING:
      case NUMBER:
      case NULL:
      case TRUE:
      case FALSE:
        return true;
    }
    return false;
}

/*
 * Pragmas :: () -> Array[Array[token]]
 */
Pp.Pragmas = function Pragmas() {
    var pragmas = [];
    do {
        pragmas.push(this.Pragma());
    } while (this.match(COMMA));
    this.MagicalSemicolon();
    return pragmas;
}

/*
 * Pragmas :: () -> Array[token]
 */
Pp.Pragma = function Pragma() {
    var items = [];
    var tt;
    do {
        tt = this.t.get(true);
        items.push(this.t.token);
    } while (isPragmaToken(this.peek()));
    return items;
}

/*
 * MagicalSemicolon :: () -> void
 */
Pp.MagicalSemicolon = function MagicalSemicolon() {
    var tt;
    if (this.t.lineno === this.t.token.lineno) {
        tt = this.peekOnSameLine();
        if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY)
            this.fail("missing ; before statement");
    }
    this.match(SEMICOLON);
}

/*
 * ReturnOrYield :: () -> (RETURN | YIELD) node
 */
Pp.ReturnOrYield = function ReturnOrYield() {
    var n, b, tt = this.t.token.type, tt2;

    var parentScript = this.x.parentScript;

    if (tt === RETURN) {
        if (!this.x.inFunction)
            this.fail("Return not in function");
    } else /* if (tt === YIELD) */ {
        if (!this.x.inFunction)
            this.fail("Yield not in function");
        parentScript.hasYield = true;
    }
    n = this.newNode({ value: undefined });

    tt2 = (tt === RETURN) ? this.peekOnSameLine(true) : this.peek(true);
    if (tt2 !== END && tt2 !== NEWLINE &&
        tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY
        && (tt !== YIELD ||
            (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN &&
             tt2 !== COLON && tt2 !== COMMA))) {
        if (tt === RETURN) {
            n.value = this.Expression();
            parentScript.hasReturnWithValue = true;
        } else {
            n.value = this.AssignExpression();
        }
    } else if (tt === RETURN) {
        parentScript.hasEmptyReturn = true;
    }

    return n;
}

/*
 * ModuleExpression :: () -> (STRING | IDENTIFIER | DOT) node
 */
Pp.ModuleExpression = function ModuleExpression() {
    return this.match(STRING) ? this.newNode() : this.QualifiedPath();
}

/*
 * ImportPathList :: () -> Array[DOT node]
 */
Pp.ImportPathList = function ImportPathList() {
    var a = [];
    do {
        a.push(this.ImportPath());
    } while (this.match(COMMA));
    return a;
}

/*
 * ImportPath :: () -> DOT node
 */
Pp.ImportPath = function ImportPath() {
    var n = this.QualifiedPath();
    if (!this.match(DOT)) {
        if (n.type === IDENTIFIER)
            this.fail("cannot import local variable");
        return n;
    }

    var n2 = this.newNode();
    n2.push(n);
    n2.push(this.ImportSpecifierSet());
    return n2;
}

/*
 * ExplicitSpecifierSet :: (() -> node) -> OBJECT_INIT node
 */
Pp.ExplicitSpecifierSet = function ExplicitSpecifierSet(SpecifierRHS) {
    var n, n2, id, tt;

    n = this.newNode({ type: OBJECT_INIT });
    this.mustMatch(LEFT_CURLY);

    if (!this.match(RIGHT_CURLY)) {
        do {
            id = this.Identifier();
            if (this.match(COLON)) {
                n2 = this.newNode({ type: PROPERTY_INIT });
                n2.push(id);
                n2.push(SpecifierRHS());
                n.push(n2);
            } else {
                n.push(id);
            }
        } while (!this.match(RIGHT_CURLY) && this.mustMatch(COMMA));
    }

    return n;
}

/*
 * ImportSpecifierSet :: () -> (IDENTIFIER | OBJECT_INIT) node
 */
Pp.ImportSpecifierSet = function ImportSpecifierSet() {
    var self = this;
    return this.match(MUL)
        ? this.newNode({ type: IDENTIFIER, name: "*" })
    : ExplicitSpecifierSet(function() { return self.Identifier() });
}

/*
 * Identifier :: () -> IDENTIFIER node
 */
Pp.Identifier = function Identifier() {
    this.mustMatch(IDENTIFIER);
    return this.newNode({ type: IDENTIFIER });
}

/*
 * IdentifierName :: () -> IDENTIFIER node
 */
Pp.IdentifierName = function IdentifierName() {
    this.mustMatch(IDENTIFIER, true);
    return this.newNode({ type: IDENTIFIER });
}

/*
 * QualifiedPath :: () -> (IDENTIFIER | DOT) node
 */
Pp.QualifiedPath = function QualifiedPath() {
    var n, n2;

    n = this.Identifier();

    while (this.match(DOT)) {
        if (this.peek() !== IDENTIFIER) {
            // Unget the '.' token, which isn't part of the QualifiedPath.
            this.t.unget();
            break;
        }
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.Identifier());
        n = n2;
    }

    return n;
}

/*
 * ExportPath :: () -> (IDENTIFIER | DOT | OBJECT_INIT) node
 */
Pp.ExportPath = function ExportPath() {
    var self = this;
    if (this.peek() === LEFT_CURLY)
        return this.ExplicitSpecifierSet(function() { return self.QualifiedPath() });
    return this.QualifiedPath();
}

/*
 * ExportPathList :: () -> Array[(IDENTIFIER | DOT | OBJECT_INIT) node]
 */
Pp.ExportPathList = function ExportPathList() {
    var a = [];
    do {
        a.push(this.ExportPath());
    } while (this.match(COMMA));
    return a;
}

/*
 * FunctionDefinition :: (boolean,
 *                        DECLARED_FORM or EXPRESSED_FORM or STATEMENT_FORM,
 *                        [string] or null or undefined)
 *                    -> node
 */
Pp.FunctionDefinition = function FunctionDefinition(requireName, functionForm, comments) {
    var tt;
    var f = this.newNode({ params: [], paramComments: [] });
    if (typeof comments === "undefined")
        comments = null;
    f.blockComments = comments;
    if (f.type !== FUNCTION)
        f.type = (f.value === "get") ? GETTER : SETTER;
    if (this.match(MUL))
        f.isExplicitGenerator = true;
    if (this.match(IDENTIFIER, false, true))
        f.name = this.t.token.value;
    else if (requireName)
        this.fail("missing function identifier");

    var inModule = this.x.inModule;
    x2 = new StaticContext(null, null, inModule, true, this.x.strictMode);
    this.withContext(x2, function() {
        this.mustMatch(LEFT_PAREN);
        if (!this.match(RIGHT_PAREN)) {
            do {
                tt = this.t.get();
                f.paramComments.push(this.t.lastBlockComment());
                switch (tt) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    // Destructured formal parameters.
                    this.t.unget();
                    f.params.push(this.DestructuringExpression());
                    break;
                  case IDENTIFIER:
                    f.params.push(this.t.token.value);
                    break;
                  default:
                    this.fail("missing formal parameter");
                }
            } while (this.match(COMMA));
            this.mustMatch(RIGHT_PAREN);
        }

        // Do we have an expression closure or a normal body?
        tt = this.t.get(true);
        if (tt !== LEFT_CURLY)
            this.t.unget();

        if (tt !== LEFT_CURLY) {
            f.body = this.AssignExpression();
        } else {
            f.body = this.Script(inModule, true);
        }
    });

    if (tt === LEFT_CURLY)
        this.mustMatch(RIGHT_CURLY);

    f.end = this.t.token.end;
    f.functionForm = functionForm;
    if (functionForm === DECLARED_FORM)
        this.x.parentScript.funDecls.push(f);

    if (this.x.inModule && !f.isExplicitGenerator && f.body.hasYield)
        this.fail("yield in non-generator function");

    if (f.isExplicitGenerator || f.body.hasYield)
        f.body = this.newNode({ type: GENERATOR, body: f.body });

    return f;
}

/*
 * ModuleVariables :: (MODULE node) -> void
 *
 * Parses a comma-separated list of module declarations (and maybe
 * initializations).
 */
Pp.ModuleVariables = function ModuleVariables(n) {
    var n1, n2;
    do {
        n1 = this.Identifier();
        if (this.match(ASSIGN)) {
            n2 = this.ModuleExpression();
            n1.initializer = n2;
            if (n2.type === STRING)
                this.x.parentScript.modLoads.set(n1.value, n2.value);
            else
                this.x.parentScript.modAssns.set(n1.value, n1);
        }
        n.push(n1);
    } while (this.match(COMMA));
}

/*
 * Variables :: () -> node
 *
 * Parses a comma-separated list of var declarations (and maybe
 * initializations).
 */
Pp.Variables = function Variables(letBlock) {
    var n, n2, ss, i, s, tt;

    tt = this.t.token.type;
    switch (tt) {
      case VAR:
      case CONST:
        s = this.x.parentScript;
        break;
      case LET:
        s = this.x.parentBlock;
        break;
      case LEFT_PAREN:
        tt = LET;
        s = letBlock;
        break;
    }

    n = this.newNode({ type: tt, destructurings: [] });

    do {
        tt = this.t.get();
        if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
            // Need to unget to parse the full destructured expression.
            this.t.unget();

            var dexp = this.DestructuringExpression(true);

            n2 = this.newNode({ type: IDENTIFIER,
                                name: dexp,
                                readOnly: n.type === CONST });
            n.push(n2);
            pushDestructuringVarDecls(n2.name.destructuredNames, s);
            n.destructurings.push({ exp: dexp, decl: n2 });

            if (this.x.inForLoopInit && this.peek() === IN) {
                continue;
            }

            this.mustMatch(ASSIGN);
            if (this.t.token.assignOp)
                this.fail("Invalid variable initialization");

            n2.blockComment = this.t.lastBlockComment();
            n2.initializer = this.AssignExpression();

            continue;
        }

        if (tt !== IDENTIFIER)
            this.fail("missing variable name");

        n2 = this.newNode({ type: IDENTIFIER,
                            name: this.t.token.value,
                            readOnly: n.type === CONST });
        n.push(n2);
        s.varDecls.push(n2);

        if (this.match(ASSIGN)) {
            var comment = this.t.lastBlockComment();
            if (this.t.token.assignOp)
                this.fail("Invalid variable initialization");

            n2.initializer = this.AssignExpression();
        } else {
            var comment = this.t.lastBlockComment();
        }
        n2.blockComment = comment;
    } while (this.match(COMMA));

    return n;
}

/*
 * LetBlock :: (boolean) -> node
 *
 * Does not handle let inside of for loop init.
 */
Pp.LetBlock = function LetBlock(isStatement) {
    var n, n2;

    // t.token.type must be LET
    n = this.newNode({ type: LET_BLOCK, varDecls: [] });
    this.mustMatch(LEFT_PAREN);
    n.variables = this.Variables(n);
    this.mustMatch(RIGHT_PAREN);

    if (isStatement && this.peek() !== LEFT_CURLY) {
        /*
         * If this is really an expression in let statement guise, then we
         * need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
         * the return value of the expression.
         */
        n2 = this.newNode({ type: SEMICOLON, expression: n });
        isStatement = false;
    }

    if (isStatement)
        n.block = this.Block();
    else
        n.expression = this.AssignExpression();

    return n;
}

Pp.checkDestructuring = function checkDestructuring(n, simpleNamesOnly) {
    if (n.type === ARRAY_COMP)
        this.fail("Invalid array comprehension left-hand side");
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
            lhss[idx] = this.checkDestructuring(sub, simpleNamesOnly);
        } else {
            if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                // In declarations, lhs must be simple names
                this.fail("missing name in pattern");
            }

            lhss[idx] = sub;
        }
    }

    return lhss;
}

Pp.DestructuringExpression = function DestructuringExpression(simpleNamesOnly) {
    var n = this.PrimaryExpression();
    // Keep the list of lefthand sides for varDecls
    n.destructuredNames = this.checkDestructuring(n, simpleNamesOnly);
    return n;
}

Pp.GeneratorExpression = function GeneratorExpression(e) {
    return this.newNode({ type: GENERATOR,
                          expression: e,
                          tail: this.ComprehensionTail() });
}

Pp.ComprehensionTail = function ComprehensionTail() {
    var body, n, n2, n3, p;

    // t.token.type must be FOR
    body = this.newNode({ type: COMP_TAIL });

    do {
        // Comprehension tails are always for..in loops.
        n = this.newNode({ type: FOR_IN, isLoop: true });
        if (this.match(IDENTIFIER)) {
            // But sometimes they're for each..in.
            if (this.mozillaMode && this.t.token.value === "each")
                n.isEach = true;
            else
                this.t.unget();
        }
        p = this.MaybeLeftParen();
        switch(this.t.get()) {
          case LEFT_BRACKET:
          case LEFT_CURLY:
            this.t.unget();
            // Destructured left side of for in comprehension tails.
            n.iterator = this.DestructuringExpression();
            break;

          case IDENTIFIER:
            n.iterator = n3 = this.newNode({ type: IDENTIFIER });
            n3.name = n3.value;
            n.varDecl = n2 = this.newNode({ type: VAR });
            n2.push(n3);
            this.x.parentScript.varDecls.push(n3);
            // Don't add to varDecls since the semantics of comprehensions is
            // such that the variables are in their own function when
            // desugared.
            break;

          default:
            this.fail("missing identifier");
        }
        this.mustMatch(IN);
        n.object = this.Expression();
        this.MaybeRightParen(p);
        body.push(n);
    } while (this.match(FOR));

    // Optional guard.
    if (this.match(IF))
        body.guard = this.HeadExpression();

    return body;
}

Pp.HeadExpression = function HeadExpression() {
    var p = this.MaybeLeftParen();
    var n = this.ParenExpression();
    this.MaybeRightParen(p);
    if (p === END && !n.parenthesized) {
        var tt = this.peek();
        if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt])
            this.fail("Unparenthesized head followed by unbraced body");
    }
    return n;
}

Pp.ParenExpression = function ParenExpression() {
    // Always accept the 'in' operator in a parenthesized expression,
    // where it's unambiguous, even if we might be parsing the init of a
    // for statement.
    var x2 = this.x.update({
        inForLoopInit: this.x.inForLoopInit && (this.t.token.type === LEFT_PAREN)
    });
    var n = this.withContext(x2, function() {
        return this.Expression();
    });
    if (this.match(FOR)) {
        if (n.type === YIELD && !n.parenthesized)
            this.fail("Yield expression must be parenthesized");
        if (n.type === COMMA && !n.parenthesized)
            this.fail("Generator expression must be parenthesized");
        n = this.GeneratorExpression(n);
    }

    return n;
}

/*
 * Expression :: () -> node
 *
 * Top-down expression parser matched against SpiderMonkey.
 */
Pp.Expression = function Expression() {
    var n, n2;

    n = this.AssignExpression();
    if (this.match(COMMA)) {
        n2 = this.newNode({ type: COMMA });
        n2.push(n);
        n = n2;
        do {
            n2 = n.children[n.children.length-1];
            if (n2.type === YIELD && !n2.parenthesized)
                this.fail("Yield expression must be parenthesized");
            n.push(this.AssignExpression());
        } while (this.match(COMMA));
    }

    return n;
}

Pp.AssignExpression = function AssignExpression() {
    var n, lhs;

    // Have to treat yield like an operand because it could be the leftmost
    // operand of the expression.
    if (this.match(YIELD, true))
        return this.ReturnOrYield();

    n = this.newNode({ type: ASSIGN });
    lhs = this.ConditionalExpression();

    if (!this.match(ASSIGN)) {
        return lhs;
    }

    n.blockComment = this.t.lastBlockComment();

    switch (lhs.type) {
      case OBJECT_INIT:
      case ARRAY_INIT:
        lhs.destructuredNames = this.checkDestructuring(lhs);
        // FALL THROUGH
      case IDENTIFIER: case DOT: case INDEX: case CALL:
        break;
      default:
        this.fail("Bad left-hand side of assignment");
        break;
    }

    n.assignOp = lhs.assignOp = this.t.token.assignOp;
    n.push(lhs);
    n.push(this.AssignExpression());

    return n;
}

Pp.ConditionalExpression = function ConditionalExpression() {
    var n, n2;

    n = this.OrExpression();
    if (this.match(HOOK)) {
        n2 = n;
        n = this.newNode({ type: HOOK });
        n.push(n2);
        /*
         * Always accept the 'in' operator in the middle clause of a ternary,
         * where it's unambiguous, even if we might be parsing the init of a
         * for statement.
         */
        var x2 = this.x.update({ inForLoopInit: false });
        this.withContext(x2, function() {
            n.push(this.AssignExpression());
        });
        if (!this.match(COLON))
            this.fail("missing : after ?");
        n.push(this.AssignExpression());
    }

    return n;
}

Pp.OrExpression = function OrExpression() {
    var n, n2;

    n = this.AndExpression();
    while (this.match(OR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.AndExpression());
        n = n2;
    }

    return n;
}

Pp.AndExpression = function AndExpression() {
    var n, n2;

    n = this.BitwiseOrExpression();
    while (this.match(AND)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseOrExpression());
        n = n2;
    }

    return n;
}

Pp.BitwiseOrExpression = function BitwiseOrExpression() {
    var n, n2;

    n = this.BitwiseXorExpression();
    while (this.match(BITWISE_OR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseXorExpression());
        n = n2;
    }

    return n;
}

Pp.BitwiseXorExpression = function BitwiseXorExpression() {
    var n, n2;

    n = this.BitwiseAndExpression();
    while (this.match(BITWISE_XOR)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.BitwiseAndExpression());
        n = n2;
    }

    return n;
}

Pp.BitwiseAndExpression = function BitwiseAndExpression() {
    var n, n2;

    n = this.EqualityExpression();
    while (this.match(BITWISE_AND)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.EqualityExpression());
        n = n2;
    }

    return n;
}

Pp.EqualityExpression = function EqualityExpression() {
    var n, n2;

    n = this.RelationalExpression();
    while (this.match(EQ) || this.match(NE) ||
           this.match(STRICT_EQ) || this.match(STRICT_NE)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.RelationalExpression());
        n = n2;
    }

    return n;
}

Pp.RelationalExpression = function RelationalExpression() {
    var n, n2;

    /*
     * Uses of the in operator in shiftExprs are always unambiguous,
     * so unset the flag that prohibits recognizing it.
     */
    var x2 = this.x.update({ inForLoopInit: false });
    this.withContext(x2, function() {
        n = this.ShiftExpression();
        while ((this.match(LT) || this.match(LE) || this.match(GE) || this.match(GT) ||
                (!this.x.inForLoopInit && this.match(IN)) ||
                this.match(INSTANCEOF))) {
            n2 = this.newNode();
            n2.push(n);
            n2.push(this.ShiftExpression());
            n = n2;
        }
    });

    return n;
}

Pp.ShiftExpression = function ShiftExpression() {
    var n, n2;

    n = this.AddExpression();
    while (this.match(LSH) || this.match(RSH) || this.match(URSH)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.AddExpression());
        n = n2;
    }

    return n;
}

Pp.AddExpression = function AddExpression() {
    var n, n2;

    n = this.MultiplyExpression();
    while (this.match(PLUS) || this.match(MINUS)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.MultiplyExpression());
        n = n2;
    }

    return n;
}

Pp.MultiplyExpression = function MultiplyExpression() {
    var n, n2;

    n = this.UnaryExpression();
    while (this.match(MUL) || this.match(DIV) || this.match(MOD)) {
        n2 = this.newNode();
        n2.push(n);
        n2.push(this.UnaryExpression());
        n = n2;
    }

    return n;
}

Pp.UnaryExpression = function UnaryExpression() {
    var n, n2, tt;

    switch (tt = this.t.get(true)) {
      case DELETE: case VOID: case TYPEOF:
      case NOT: case BITWISE_NOT: case PLUS: case MINUS:
        if (tt === PLUS)
            n = this.newNode({ type: UNARY_PLUS });
        else if (tt === MINUS)
            n = this.newNode({ type: UNARY_MINUS });
        else
            n = this.newNode();
        n.push(this.UnaryExpression());
        break;

      case INCREMENT:
      case DECREMENT:
        // Prefix increment/decrement.
        n = this.newNode();
        n.push(this.MemberExpression(true));
        break;

      default:
        this.t.unget();
        n = this.MemberExpression(true);

        // Don't look across a newline boundary for a postfix {in,de}crement.
        if (this.t.tokens[(this.t.tokenIndex + this.t.lookahead - 1) & 3].lineno ===
            this.t.lineno) {
            if (this.match(INCREMENT) || this.match(DECREMENT)) {
                n2 = this.newNode({ postfix: true });
                n2.push(n);
                n = n2;
            }
        }
        break;
    }

    return n;
}

Pp.MemberExpression = function MemberExpression(allowCallSyntax) {
    var n, n2, name, tt;

    if (this.match(NEW)) {
        n = this.newNode();
        n.push(this.MemberExpression(false));
        if (this.match(LEFT_PAREN)) {
            n.type = NEW_WITH_ARGS;
            n.push(this.ArgumentList());
        }
    } else {
        n = this.PrimaryExpression();
    }

    while ((tt = this.t.get()) !== END) {
        switch (tt) {
          case DOT:
            n2 = this.newNode();
            n2.push(n);
            n2.push(this.IdentifierName());
            break;

          case LEFT_BRACKET:
            n2 = this.newNode({ type: INDEX });
            n2.push(n);
            n2.push(this.Expression());
            this.mustMatch(RIGHT_BRACKET);
            break;

          case LEFT_PAREN:
            if (allowCallSyntax) {
                n2 = this.newNode({ type: CALL });
                n2.push(n);
                n2.push(this.ArgumentList());
                break;
            }

            // FALL THROUGH
          default:
            this.t.unget();
            return n;
        }

        n = n2;
    }

    return n;
}

Pp.ArgumentList = function ArgumentList() {
    var n, n2;

    n = this.newNode({ type: LIST });
    if (this.match(RIGHT_PAREN, true))
        return n;
    do {
        n2 = this.AssignExpression();
        if (n2.type === YIELD && !n2.parenthesized && this.peek() === COMMA)
            this.fail("Yield expression must be parenthesized");
        if (this.match(FOR)) {
            n2 = this.GeneratorExpression(n2);
            if (n.children.length > 1 || this.peek(true) === COMMA)
                this.fail("Generator expression must be parenthesized");
        }
        n.push(n2);
    } while (this.match(COMMA));
    this.mustMatch(RIGHT_PAREN);

    return n;
}

Pp.PrimaryExpression = function PrimaryExpression() {
    var n, n2, tt = this.t.get(true);

    switch (tt) {
      case FUNCTION:
        n = this.FunctionDefinition(false, EXPRESSED_FORM);
        break;

      case LEFT_BRACKET:
        n = this.newNode({ type: ARRAY_INIT });
        while ((tt = this.peek(true)) !== RIGHT_BRACKET) {
            if (tt === COMMA) {
                this.t.get();
                n.push(null);
                continue;
            }
            n.push(this.AssignExpression());
            if (tt !== COMMA && !this.match(COMMA))
                break;
        }

        // If we matched exactly one element and got a FOR, we have an
        // array comprehension.
        if (n.children.length === 1 && this.match(FOR)) {
            n2 = this.newNode({ type: ARRAY_COMP,
                                expression: n.children[0],
                                tail: this.ComprehensionTail() });
            n = n2;
        }
        this.mustMatch(RIGHT_BRACKET);
        break;

      case LEFT_CURLY:
        var id, fd;
        n = this.newNode({ type: OBJECT_INIT });

        object_init:
        if (!this.match(RIGHT_CURLY)) {
            do {
                tt = this.t.get();
                if ((this.t.token.value === "get" || this.t.token.value === "set") &&
                    this.peek() === IDENTIFIER) {
                    n.push(this.FunctionDefinition(true, EXPRESSED_FORM));
                } else {
                    var comments = this.t.blockComments;
                    switch (tt) {
                      case IDENTIFIER: case NUMBER: case STRING:
                        id = this.newNode({ type: IDENTIFIER });
                        break;
                      case RIGHT_CURLY:
                        break object_init;
                      default:
                        if (this.t.token.value in definitions.keywords) {
                            id = this.newNode({ type: IDENTIFIER });
                            break;
                        }
                        this.fail("Invalid property name");
                    }
                    if (this.match(COLON)) {
                        n2 = this.newNode({ type: PROPERTY_INIT });
                        n2.push(id);
                        n2.push(this.AssignExpression());
                        n2.blockComments = comments;
                        n.push(n2);
                    } else {
                        // Support, e.g., |var {x, y} = o| as destructuring shorthand
                        // for |var {x: x, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                        if (this.peek() !== COMMA && this.peek() !== RIGHT_CURLY)
                            this.fail("missing : after property");
                        n.push(id);
                    }
                }
            } while (this.match(COMMA));
            this.mustMatch(RIGHT_CURLY);
        }
        break;

      case LEFT_PAREN:
        n = this.ParenExpression();
        this.mustMatch(RIGHT_PAREN);
        n.parenthesized = true;
        break;

      case LET:
        n = this.LetBlock(false);
        break;

      case NULL: case THIS: case TRUE: case FALSE:
      case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
        n = this.newNode();
        break;

      default:
        this.fail("missing operand; found " + definitions.tokens[tt]);
        break;
    }

    return n;
}

/*
 * parse :: (source, filename, line number) -> node
 */
function parse(s, f, l) {
    var t = new Tokenizer(s, f, l, options.allowHTMLComments);
    var p = new Parser(t);
    return p.Script(false, false, true);
}

/*
 * parseFunction :: (source, boolean,
 *                   DECLARED_FORM or EXPRESSED_FORM or STATEMENT_FORM,
 *                   filename, line number)
 *               -> node
 */
function parseFunction(s, requireName, form, f, l) {
    var t = new Tokenizer(s, f, l);
    var p = new Parser(t);
    p.x = new StaticContext(null, null, false, false, false);
    return p.FunctionDefinition(requireName, form);
}

/*
 * parseStdin :: (source, {line number}, string, (string) -> boolean) -> program node
 */
function parseStdin(s, ln, prefix, isCommand) {
    // the special .begin command is only recognized at the beginning
    if (s.match(/^[\s]*\.begin[\s]*$/)) {
        ++ln.value;
        return parseMultiline(ln, prefix);
    }

    // commands at the beginning are treated as the entire input
    if (isCommand(s.trim()))
        s = "";

    for (;;) {
        try {
            var t = new Tokenizer(s, "stdin", ln.value, false);
            var p = new Parser(t);
            var n = p.Script(false, false);
            ln.value = t.lineno;
            return n;
        } catch (e) {
            if (!p.unexpectedEOF)
                throw e;

            // commands in the middle are not treated as part of the input
            var more;
            do {
                if (prefix)
                    putstr(prefix);
                more = readline();
                if (!more)
                    throw e;
            } while (isCommand(more.trim()));

            s += "\n" + more;
        }
    }
}

/*
 * parseMultiline :: ({line number}, string | null) -> program node
 */
function parseMultiline(ln, prefix) {
    var s = "";
    for (;;) {
        if (prefix)
            putstr(prefix);
        var more = readline();
        if (more === null)
            return null;
        // the only command recognized in multiline mode is .end
        if (more.match(/^[\s]*\.end[\s]*$/))
            break;
        s += "\n" + more;
    }
    var t = new Tokenizer(s, "stdin", ln.value, false);
    var p = new Parser(t);
    var n = p.Script(false, false);
    ln.value = t.lineno;
    return n;
}

exports.parse = parse;
exports.parseStdin = parseStdin;
exports.parseFunction = parseFunction;
exports.Node = Node;
exports.DECLARED_FORM = DECLARED_FORM;
exports.EXPRESSED_FORM = EXPRESSED_FORM;
exports.STATEMENT_FORM = STATEMENT_FORM;
exports.Tokenizer = Tokenizer;
exports.Parser = Parser;
exports.Module = Module;
exports.Export = Export;

});
