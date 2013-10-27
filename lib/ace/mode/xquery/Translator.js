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
  
  var Errors = require("./Errors").Errors;
  var StaticContext = require("./StaticContext").StaticContext;
  var CommentParser = require("./CommentParser").CommentParser;
  var CommentHandler = require("./CommentHandler").CommentHandler;

  
  var Translator = exports.Translator = function(ast){
    
    var markers = [];
    var outline = [];
    
    var isMainModule = true;
    
    var defaultFnNs = "http://www.w3.org/2005/xpath-functions";
    
    var namespaces = {
      "local": "http://www.w3.org/2005/xquery-local-functions",
      "xs": "http://www.w3.org/2001/XMLSchema",
      "fn": "http://www.w3.org/2005/xpath-functions",
      "jn": "http://www.jsoniq.org/functions",
      "an": "http://www.zorba-xquery.com/annotations",
      "db": "http://www.zorba-xquery.com/modules/store/static/collections/dml",
      "idx": "http://www.zorba-xquery.com/modules/store/static/indexes/dml",
      "zerr": "http://www.zorba-xquery.com/errors",
      "err": "http://www.w3.org/2005/xqt-error"
    };
    
    var declaredNS = {
      "jn": { ns: "http://www.jsoniq.org/functions", pos: { sl: 0, sc: 0, el: 0, ec: 0 }, type: "module", auto: true },
      "fn": { ns: "http://www.w3.org/2005/xpath-functions", pos: { sl: 0, sc: 0, el: 0, ec: 0 }, type: "module", auto: true }
    };
    
    var referencedPrefixes = {};
   
    var declaredFunctions = {};
    var functionReferences = {};

    var declaredVariables = {};

    var rootSctx = new StaticContext(ast.pos);
    var sctx = rootSctx;
    
    function pushSctx(pos) {
      sctx.children.push(new StaticContext(pos, sctx));
      sctx = sctx.children[sctx.children.length - 1];
    }
    
    function popSctx(pos) {
     
      if(pos !== undefined) {
        sctx.pos.el = pos.el;
        sctx.pos.ec = pos.ec;
      }

      var varDecls = sctx.varDecls;
      var varRefs  = sctx.varRefs;
      
      for(var i in varDecls) {
        var varDecl = varDecls[i];
        var varRef  = varRefs[i];
        //We don't throw unused variable warnings for public VarDecl
        if(varRef === undefined && varDecl.kind !== "VarDecl") {
          markers.push(Errors.unusedVar(varDecl.pos, i));
        }
      }
      
      for(var i in varRefs) {
        var varDecl = varDecls[i];
        var varRef  = varRefs[i];
        if(varDecl === undefined){
          if(sctx.parent.parent === undefined) {
            for(var j = 0; j < varRef.length; j++) {
              var v = varRef[j];
              markers.push(Errors.XPST0008(v.pos, i));
            }
          } else {
            if(sctx.parent.varRefs[i] === undefined) {
              sctx.parent.varRefs[i] = [];
            }
            sctx.parent.varRefs[i] = sctx.parent.varRefs[i].concat(varRef);
          }
        }
      }
      
      sctx = sctx.parent;
    }
    
    function resolvesEQName(value) {
      if(value.substring(0, 2) === "Q{") {
          
      } else {
        return value;
      }
    }

    function joinFields(arr, fieldName, separator){
      separator = separator || ', ';
      var vals = [];
      arr.forEach(function(el){
        if (el[fieldName]){
          vals.push(el[fieldName]);
        }
      });
      return vals.join(separator);
    };

    this.XQuery = function(node) {
      pushSctx(node.pos);
      this.visitChildren(node);
      popSctx(node.pos);
      
      //Check for duplicates in namespaces declarations and unused namespace declarations
      var dNS = {};
      for(var prefix in declaredNS) {
        var ns = declaredNS[prefix].ns;
        var pos = declaredNS[prefix].pos;
        var type = declaredNS[prefix].type;
        if(referencedPrefixes[prefix] === undefined && declaredNS[prefix].auto === undefined) {
          var msg = '"' + prefix + '": unused namespace prefix.';
          var err = Errors.warning(pos,msg);
          err.prefix = prefix;
          err.ns = ns;
          err.nsType = type;
          markers.push(err);
        }
        if(dNS[ns] === undefined) {
          dNS[ns] = {prefix: prefix, positions: [pos]};
        } else if(type !== "schema"){
          dNS[ns].positions.push(pos);
        }
      }
      for(var ns in dNS) {
        var prefix = dNS[ns].prefix;
        var positions = dNS[ns].positions;
        if(positions.length > 1) {
          for(var i = 1; i < positions.length; i++) {
            var msg = '"' + ns + '": is already available with the prefix "' + prefix + '".';
            markers.push(Errors.warning(positions[i], msg));
          }
        }
      }
      return true;
    };

    
    this.ModuleDecl = function(node) {
      isMainModule = false;
     
      var Handler = function() {
        var prefix = "";
        var ns = "";
        
        this.NCName = function(ncname) {
          prefix = getNodeValue(ncname);
        };
        
        this.URILiteral = function(uri) {
          ns = getNodeValue(uri);
          ns = ns.substring(1, ns.length - 1);
          namespaces[prefix] = ns;
        };
      };
      
      this.visitChildren(node, new Handler());
      
      return true;
    };
    
    this.ModuleImport = function(node) {
     
      var handler = new function() {
        var prefix = "";
        var moduleURI = null;
        //var locationHints = [];
        
        this.NCName = function(ncname) {
          prefix = getNodeValue(ncname);
        };
        
        this.URILiteral = function(uri) {
          uri = getNodeValue(uri);
          uri = uri.substring(1, uri.length - 1);
          if(moduleURI === null) {
            moduleURI = uri;
            if (declaredNS[prefix] === undefined) {
              declaredNS[prefix] = { ns: moduleURI, pos: node.pos, type: "module" };
              namespaces[prefix] = moduleURI;
            } else {
              markers.push(Errors.XQST0033(node.pos, prefix, moduleURI));
            }
          } else {
            //locationHints.push(uri);
          }
        };
      };
      
      this.visitChildren(node, handler);
      return true;
    };
    
    this.SchemaImport = function(node) {
      var that = this;
      
      var handler = new function() {
        var prefix = "";
        var schemaURI = null;
        //var locationHints = [];
        
        this.SchemaPrefix = function(schemaPrefix) {
          var Handler = function() {
            this.NCName = function(ncname) {
              prefix = getNodeValue(ncname);
            }
          };
          that.visitChildren(schemaPrefix, new Handler());
        };
        
        this.URILiteral = function(uri) {
          uri = getNodeValue(uri);
          uri = uri.substring(1, uri.length - 1);
          if(schemaURI === null) {
            schemaURI = uri;
            if (declaredNS[prefix] === undefined) {
              declaredNS[prefix] = { ns: schemaURI, pos: node.pos, type: "schema" };
            } else {
              markers.push(Errors.XQST0033(node.pos, prefix, schemaURI));
            }
          } else {
            //locationHints.push(uri);
          }
        };
      };
      
      this.visitChildren(node, handler);
      return true;
    };
    
    this.NamespaceDecl = function(node) {
     
      var handler = new function() {
        var prefix = "";
        var moduleURI = "";
        
        this.NCName = function(ncname) {
          prefix = getNodeValue(ncname);
        };
        
        this.URILiteral = function(uri) {
          moduleURI = getNodeValue(uri);
          moduleURI = moduleURI.substring(1, moduleURI.length - 1);
          if (declaredNS[prefix] === undefined) {
            declaredNS[prefix] = { ns: moduleURI, pos: node.pos, type: "decl" };
          } else {
             markers.push(Errors.XQST0033(node.pos, prefix, moduleURI));
          }
        };
      };
      
      this.visitChildren(node, handler);
      return true;
    };
    
    this.DefaultNamespaceDecl = function(node) {      
      var Handler = function() {
        var fn = false;
        var ns = "";
        
        this.TOKEN = function(token) {
          fn = fn ? true : (token.value === "function");
        };
        
        this.URILiteral = function(uri) {
          ns = getNodeValue(uri);
          ns = ns.substring(1, ns.length - 1);
          if(fn) {
            defaultFnNs = ns;
          }
        };
      };
      
      this.visitChildren(node, new Handler());
      
      return true;
    };
    
    
    
    
    var statementCount = [];
    this.StatementsAndOptionalExpr = function(node) {
      pushSctx(node.pos);
      statementCount.push(0);
      this.visitChildren(node);
      for(var i = 1; i <= statementCount[statementCount.length - 1]; i++) {
        popSctx(node.pos);
      }
      statementCount.pop();
      popSctx();
      return true;
    };
    
    this.StatementsAndExpr = function(node) {
      pushSctx(node.pos);
      statementCount.push(0);
      this.visitChildren(node);
      for(var i = 1; i <= statementCount[statementCount.length - 1]; i++) {
        popSctx(node.pos);
      }
      statementCount.pop();
      popSctx();
      return true;
    };
    
    this.BlockStatement = function(node) {
      pushSctx(node.pos);
      statementCount.push(0);
      this.visitChildren(node);
      for(var i = 1; i <= statementCount[statementCount.length - 1]; i++) {
        popSctx(node.pos);
      }
      statementCount.pop();
      popSctx();
      return true;
    };
    
    this.visitExprSingles = function(node) {
      for(var i=0; i < node.children.length; i++) {
        var child = node.children[i];
        if(child.name === "ExprSingle" || child.name === "VarValue" || child.name === "VarDefaultValue") {
          this.visit(child);
        }
      }
    };
    
    var VarHandler = function(node) {
        
        this.ExprSingle = this.VarValue = this.VarDefaultValue = function(exprSingle) {
          return true;
        };
        
        this.VarName = this.EQName = function(varName) {
          var value = getNodeValue(varName);
          if(value.substring(0, 2) !== "Q{") {
            if(sctx.varDecls[value] === undefined) {
              // TODO add additional info
              sctx.varDecls[value] = { pos: varName.pos, kind: node.name };
            } else if(node.name == "Param"){
              markers.push(Errors.XQST0039(node.pos, value));
            } else {
              markers.push(Errors.XQST0049(node.pos, value));
            }
            //var prefix = value.substring(0, value.indexOf(":"));
            //var name = value.substring(value.indexOf(":") + 1);
            //sctx.varRefs[value] = true; //({ prefix: prefix, name: name });
          }
        };
    };
    
    this.Param = function(node) {
      var param = {}
      param.name = "$" + getNodeValue(node.children[1]);
      if (node.children[3]){
        // TypeDeclaration
        param.type = getNodeValue(node.children[3].children[2]);
      }
      //We don't process external functions
      if(!isExternal)
        this.visitChildren(node, new VarHandler(node));
      fnParams.push(param);
      return true;  
    };

   
    this.TransformExpr = function(node) {
      pushSctx(node.pos);
      this.visitExprSingles(node);
      this.visitChildren(node, new VarHandler(node));
      popSctx();
      return true;
    };

    this.QuantifiedExpr = function(node) {
      pushSctx(node.pos);
      this.visitExprSingles(node);
      this.visitChildren(node, new VarHandler(node));
      popSctx();
      return true;
    };
    
    var clauseCount = [];
    this.FLWORExpr = function(node) {
      pushSctx(node.pos);
      
      clauseCount.push(0);
      this.visitChildren(node);
      for(var i = 1; i <= clauseCount[clauseCount.length - 1]; i++) {
        popSctx(node.pos);
      }
      clauseCount.pop();
      
      popSctx();
      return true;
    };
    
    //this.Statements = function(node) {
      //pushSctx();
      //this.visitChildren(node);
      //popSctx();
    //};
    
    //this.Statement = function(node) {
    //  this.visitChildren(node);
    //  return true;
    //};
    
     this.LetBinding = function(node){
      this.visitExprSingles(node);
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    };

    this.ForBinding = function(node) {
      this.visitExprSingles(node);
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.TumblingWindowClause = function(node) {
      this.visitExprSingles(node);
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.WindowVars = function(node) {
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    }
    
    this.SlidingWindowClause = function(node) {
      this.visitExprSingles(node);
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.PositionalVar = function(node) {
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.CurrentItem = function(node) {
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.PreviousItem = function(node) {
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.NextItem = function(node) {
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    this.CountClause = function(node) {
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;
      this.visitChildren(node, new VarHandler(node));
      return true;
    };
    
    var isDecl = false;
    this.GroupingSpec = function(node) {
      isDecl = false;
      pushSctx(node.pos);
      clauseCount[clauseCount.length - 1]++;

      for(var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if(child.value === ":=") {
          isDecl = true;
        }
      }
      return false;
    };
    
    this.GroupingVariable = function(node) {
      if(isDecl) {
        var value = getNodeValue(node).substring(1);
        if(value.substring(0, 2) !== "Q{") {
          if(sctx.varDecls[value] === undefined) {
            // TODO add additional info
            sctx.varDecls[value] = { pos: node.pos, kind: node.name };
          } else {
            markers.push(Errors.XQST0049(node.pos, value));
          }
        }
        this.visitChildren(node.children[0], new VarHandler(node));
      } else {
        if(node.children.length === 2) {
          var name = getNodeValue(node.children[1]);
          var decl = sctx.getVarDecl(name);
          if(decl) { 
            decl.kind = "GroupingVariable";
          }
        }
        this.visitChildren(node);
      }
      return false;
    };

    var name = "";
    var displayPos = null;
    this.VarDecl = this.VarDeclStatement = function(node){
      var isStmt = (node.name === 'VarDeclStatement');
      var _self = this;
      var varNames = [];
      var varPos = [];
      var varTypes = {};
      if (!isStmt){
        decl.isExternal = false;
      }else{
        // VarDeclStatement contains Annotation*
        // (for VarDecl they were already parsed)
        decl = { annotations: {} };
      }
      var displayPos;

      var decls;
      var VarDeclHandler = function(){
        var varPosIndex = 0;
        this.ExprSingle = function(exprSingle) {
          return true;
        };
        this.VarName = function(node){
          var varName = getNodeValue(node);
          varNames.push(varName);
          varPos[varPosIndex++] = node.pos;
          if (!isStmt){ displayPos = node.pos; }
          if (decls[varName]){
            // Duplicate variable declaration
            markers.push(Errors.XQST0049(node.pos, value));
          }
        };
        this.TypeDeclaration = function(node){
          var TypeDeclarationHandler = function(){
            this.SequenceType = function(node){
              varTypes[varNames[varNames.length-1]] = getNodeValue(node);
            };
          };
          _self.visitChildren(node, new TypeDeclarationHandler());
        };
        this.TOKEN = function(node){
          if (node.value === "external"){
            decl.isExternal = true;                
          }
        };
      };

      if (isStmt){
        _self.visitExprSingles(node);
        pushSctx(node.pos);
        statementCount[statementCount.length - 1]++;
        decls = sctx.varDecls;
      } else {
        pushSctx(node.pos);
        _self.visitExprSingles(node);
        popSctx();
        decls = declaredVariables;
      }

      _self.visitChildren(node, new VarDeclHandler());

      var newDecls = []; 
      // Annotations are the same for all variables in a VarDeclStatement
      var annotations = decl.annotations;
      var varPosIndex = 0;
      varNames.forEach(function(curName){
        var newDecl = {
          annotations: annotations,
          pos: varPos[varPosIndex++], 
          kind: node.name
        };
        if (decl.isExternal){
          newDecl.isExternal = true;
        }
        if (varTypes[curName]){
          newDecl.type = varTypes[curName];
        }
        
        decls[curName] = decls[curName] || newDecl;
        if (!isStmt){
          // Global variable from VarDecl
          var firstSctx = rootSctx.children[0];
          firstSctx.varDecls[curName] = firstSctx.varDecls[curName] || newDecl;
        }
      });

      if (!isStmt){
        outline.push({
          displayPos: displayPos,
          icon: "property",
          name:  "$" + varNames[0],
          pos: node.pos,
          items: []
        });
      }

      return true;

    };

    // TODO Ensure that all nodes that can contain Annotations reset
    // decl = { annotations: {} } before being processed so that
    // they can retrieve their correct annotations from the decl object
    // (See this.AnnotatedDecl, this.VarDeclStatement). 
    this.Annotation = function(node){
      var _self = this;
      var annoName = "";
      var anno = {
        literals: []
      };
      var AnnotationHandler = function(){
        this.EQName = function(node){
          annoName = getNodeValue(node);
          var parts = annoName.split(":");
          if (annoName.substring(0,2) !== "Q{" && parts.length > 1){
            anno.prefix = parts[0];
            anno.name = parts[1];
          }else{
            anno.name = annoName;
          }
          if (annoName === "updating" && decl.annotations.updating){
            // TODO multiple 'updating' annotations error 
            // TODO combine with other multiple annos errors/warnings?
          }
        };

        this.Literal = function(node){
          anno.literals.push(getNodeValue(node));
        };
      };

      _self.visitChildren(node, new AnnotationHandler());
      decl.annotations[annoName] = anno;
      return true;
    };

    this.CompatibilityAnnotation = function(node){
      var _self = this;
      if (decl.annotations.updating){
        // TODO multiple 'updating' annotations error 
      }else{
        decl.annotations.updating = {
          name: "updating",
          literals: []
        };
      }
      return true;
    };


    var decl = {};
    var fnParams = [];
    var isExternal = false;
    /* AnnotatedDecl in the Prolog */
    this.AnnotatedDecl = function(node) {
      var _self = this;
      decl = {
        pos: node.pos,
        annotations: {} 
      };

      var Handler = function(){
        this.FunctionDecl = function(node) {
          if (lastXQDoc.pos && decl.pos.sl - lastXQDoc.pos.el <= 1){
            decl.doc = lastXQDoc.value;
            lastXQDoc.pos = undefined;
          }

          decl.isExternal = isExternal = 
            node.children[node.children.length - 1].value &&
            node.children[node.children.length - 1].value === "external";
          fnParams = [];
          var eQName = "";
          var name = "";
          var displayPos = null;
          pushSctx(node.pos);
          var Handler = function(){
            this.EQName = function(node) {
              eQName = getNodeValue(node);
              name = eQName + "(";
              displayPos = node.pos;
            };
            this.SequenceType = function(node){
              decl.type = getNodeValue(node);
            };
          };
          _self.visitChildren(node, new Handler());
          popSctx();
          
          decl.params = fnParams.slice();

          var arity = fnParams.length;
          node.arity = "" + arity;
          if(declaredFunctions[eQName] && 
              declaredFunctions[eQName][arity] !== undefined) {
            markers.push(Errors.XQST0034(displayPos, eQName)); 
          } else {
            name += joinFields(fnParams, "name") +")";
            outline.push({
              displayPos: displayPos,
              icon: "method",
              name: name,
              pos: node.pos,
              items: []
            });
            if(declaredFunctions[eQName] === undefined) {
              declaredFunctions[eQName] = {};
            }
            declaredFunctions[eQName][arity] = decl;
          }
          return true;
        };
      };

      this.visitChildren(node, new Handler());
      return true;
    };


    var fnCall = false;
    var fnName = "";
    var arity = 0;
    this.FunctionCall = function(node) {
      fnCall = true;
      arity = 0;
      fnName = "";
      this.visitChildren(node);
      fnCall = false;

      //For fn:count($grouping-var), we throw a warning
      if(node.children.length === 2 && node.children[0].value === "count" && defaultFnNs === "http://www.w3.org/2005/xpath-functions") {
        var params = getNodeValue(node.children[1]);
        if(params.substring(0, 2) === "($") {
          var varName = params.substring(2, params.length - 1);
          var decl = sctx.getVarDecl(varName);
          if(decl && decl.kind === "GroupingVariable") {
            var warning = Errors.countOnGroupingVar(node.pos, varName);
            markers.push(warning);
          }
        }
      }

      if(functionReferences[fnName] === undefined) {
        functionReferences[fnName] = {};
      }
      if(functionReferences[fnName][arity] === undefined) {
        functionReferences[fnName][arity] = [];
      }
      functionReferences[fnName][arity].push(node.children[0].pos);
      node.arity = arity;
      return true;
    };
   
    this.Argument = function(node) {
      arity++;
      return false;
    };
    
    this.EQName = function(node) {
      var value = getNodeValue(node);
      if(fnCall) {
        fnName = value;
      }
      if(value.substring(0, 2) !== "Q{" && value.indexOf(":") !== -1) {
        var prefix = value.substring(0, value.indexOf(":"));
        var localName = value.substring(value.indexOf(":") + 1);
        if(declaredNS[prefix] === undefined && namespaces[prefix] === undefined) {
          markers.push(Errors.XPST0081(node.pos, prefix, localName));
        } else {
          referencedPrefixes[prefix] = true;
        }
        //if(fnCall && declaredNS[prefix] !== undefined && declaredNS[prefix].type !== "module") {
        //  markers.push(Errors.warning(node.pos, '"' + prefix + '" is not a module prefix.'));
        //}
      }   
      return false;
    };
    
    this.QName = function(node) {
      var value = getNodeValue(node);
      if(value.indexOf(":") !== -1) {
        var prefix = value.substring(0, value.indexOf(":"));
        referencedPrefixes[prefix] = true;
      }
      return false;  
    };
    
    this.Wildcard = function(node) {
      var value = getNodeValue(node);
      var prefix = value.substring(0, value.indexOf(":"));
      if(prefix != "*") {
        referencedPrefixes[prefix] = true;
      }
      return true;
    };
    
    this.VarRef = function(node) {
      var value = getNodeValue(node).substring(1);
      if(value.substring(0, 2) !== "Q{" && value.indexOf(":") === -1) {
        //var prefix = value.substring(0, value.indexOf(":"));
        //var name = value.substring(value.indexOf(":") + 1);
        //console.log("VarRef: " + value);
        if(sctx.varRefs[value] === undefined) {
          sctx.varRefs[value] = [];
        }
        node.pos.sc++;
        sctx.varRefs[value].push({ pos: node.pos }); //({ prefix: prefix, name: name });
      }
      this.visitChildren(node);
      return true;
    };

    var lastXQDoc = {};
    var lastComment = {};
    this.WS = function(node) {
      var _self = this;
      var wsCode = getNodeValue(node);
      //console.log("WS:\n" + wsCode);
      var h = new CommentHandler(wsCode);
      var parser = new CommentParser(wsCode, h);
      parser.parse_Comments();
      var commentAst = h.getParseTree();
      //console.log(JSON.stringify(commentAst, null, 2));

      // Handler for a 'Comments' node which is the result of 
      // CommentParser.parse_Comments()
      var Handler = function() {
        var pos;
        this.Comment = function(node){
          pos = node.pos;
          var CHandler = function(){
            this.CommentContents = function(node) {
              var content = node.value;
              var isXQDoc = content.length > 0 && content[0] === '~';
              if (isXQDoc){
                content = content.substring(1);
                lastXQDoc.pos = pos;
                lastXQDoc.value = commentToDocString(content);
              }else{
                lastComment.pos = pos;
                lastComment.value = commentToDocString(content);
              }
            };
          };

          _self.visitChildren(node, new CHandler());
          return true;
        };
      };

     this.visitChildren(commentAst, new Handler());
      return true;
    }

   
    // Ensure ': ' before content for all non-WS lines
    // Ensure all lines start with a space
    function normalizeComment(commentStr){
      var lines = commentStr.split('\n');
      for (var i = 0; i < lines.length; i++){
        var curLine = lines[i];
        if (curLine.isWS()){
          // Line is WS, skip
          lines[i] = "";
          continue;
        }else if (curLine[0] === ':'){
          // Line starts with ':' at first char, prepend space
          curLine = ' ' + curLine;
        }else{
          var lTrimmed = curLine.ltrimSpaces();
          // Index of the first non-WS char
          var contentIndex = curLine.length - lTrimmed.length;
          if (lTrimmed[0] != ':'){
            // Have to add ':'
            if (contentIndex <= 2){
              curLine = ' : ' + lTrimmed; 
            }else{
              // Content started at contentIndex >= 2
              curLine[contentIndex - 2] = ':';
            }
          }else if (lTrimmed.length == 1){
            // Line starts with WS* and ends with ':'
            curLine = curLine + ' ';
          }
        }
        lines[i] = curLine;
      }
      return lines.join('\n');
    }

    // Align to the left, remove leading ':', remove trailing and leading
    // empty lines, remove trailing ws on lines
    function trimComment(normalizedComment){
      var lines = normalizedComment.split('\n');
      
      var startLine = 0;
      var endLine = 0;     

      // Find minIndent
      var minIndent = Number.MAX_VALUE; 
      for (var i = 0; i < lines.length; i++){
        if (lines[i].isWS()){ 
          if (startLine === i){
            startLine++;
          }
          continue; 
        }else{
          endLine = i + 1;
        }
        var colonIndex = lines[i].indexOf(': ');
        if (colonIndex === -1) {
          // Non-normalized line, ignore
          console.log(
              "Warning: trimComment: Non-normalized comment line \"" + lines[i] + '"');
          continue;
        }
        // Substitute ':'
        lines[i][colonIndex] = ' ';
        if (minIndent > colonIndex) { minIndent = colonIndex; }
      }

      // Remove minIndent + 2 spaces from all lines
      if (minIndent != Number.MAX_VALUE){
        for (var i = 0; i < lines.length; i++){
          lines[i] = lines[i].substring(minIndent+2).rtrimSpaces(); 
        }
      }

      return lines.slice(startLine, endLine).join('\n');
    }

    function commentToDocString(commentStr){
      return trimComment(normalizeComment(commentStr));
    }

    function getNodeValue(node) {
      var value = "";
      if(node.value === undefined) {
        for(var i=0; i < node.children.length; i++)
        {
          var child = node.children[i];
          value += getNodeValue(child);
        }
      } else {
        value += node.value;
      }
      return value;
    }
    
    this.visit = function(node) {
      var name = node.name;
      var skip = false;
     
     if(typeof this[name] === "function")
       skip = this[name](node) === true ? true : false ;
     
     if(!skip) {
       this.visitChildren(node);
     }
    };
    
    this.visitChildren = function(node, handler) {
      for(var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if(handler !== undefined && typeof handler[child.name] === "function") {
            handler[child.name](child);
        } else {
          this.visit(child);
        }
      }
    };

    if (String.prototype.isWS != 'function'){
      String.prototype.isWS = function(){
        return this.trim() === '';
      }
    }

    if (String.prototype.rtrimSpaces != 'function'){
      String.prototype.rtrimSpaces = function(s) { 
        return this.replace(/[ \t]+$/, '');
      }
    }

    if (String.prototype.ltrimSpaces != 'function'){
      String.prototype.ltrimSpaces = function(s) { 
        return this.replace(/^[ \t]+/, '');
      }
    }   

    if (String.prototype.fromChar != 'function'){
      String.prototype.fromChar = function(c, n) { 
        if (!n || n < 1){
          n = 1;
        }
        var arr = new Array(n+1);
        return arr.join(c);        
      }
    }

    this.translate = function() {
      this.visit(ast);
      ast.markers = markers;
      ast.outline = outline;
      ast.sctx = rootSctx;
      ast.sctx.namespaces = namespaces;
      ast.sctx.declaredNS = declaredNS;
      ast.sctx.defaultFnNs = defaultFnNs;
      ast.sctx.functionReferences = functionReferences;
      ast.sctx.declaredFunctions = declaredFunctions;
      ast.sctx.varDecls = declaredVariables;
      return ast;
    };
  };
});
