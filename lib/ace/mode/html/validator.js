define(function(require, exports, module){
require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Name = require('./xml/util/Name').Name;
var NameClassVisitor = require('./NameClassVisitor').NameClassVisitor;
var NormalizedNsNameClass = require('./NormalizedNsNameClass').NormalizedNsNameClass;

function AbstractNameClassNormalizer() {}

AbstractNameClassNormalizer.IMPOSSIBLE = "\u0000";

AbstractNameClassNormalizer.prototype.IMPOSSIBLE = AbstractNameClassNormalizer.IMPOSSIBLE;

AbstractNameClassNormalizer.prototype.contains = function(name) {};

AbstractNameClassNormalizer.prototype.accept = function(visitor) {};

AbstractNameClassNormalizer.prototype.normalize = function() {
    var mentionedNames = [];
    var mentionedNamespaces = [];
    this.accept((function(){
        function Function() {
            NameClassVisitor.call(this);
        }
        Function.prototype = Object.create(NameClassVisitor.prototype, {
            constructor: {value: NameClassVisitor}
        });

        Function.prototype.visitChoice = function(nc1, nc2) {
            nc1.accept(this);
            nc2.accept(this);
        };

        Function.prototype.visitNsName = function(ns) {
            mentionedNamespaces.push(ns);
        };

        Function.prototype.visitNsNameExcept = function(ns, nc) {
            mentionedNamespaces.push(ns);
            nc.accept(this);
        };

        Function.prototype.visitAnyName = function(nc) {
            nc.accept(this);
        };

        Function.prototype.visitName = function(name) {
            mentionedNames.push(name);
        };

        Function.prototype.visitNull = function() {
        };

        Function.prototype.visitError = function() {
        };

        return new Function();
    })());
    if (this.contains(new Name(this.IMPOSSIBLE, this.IMPOSSIBLE))) {
        var includedNames = [];
        var excludedNamespaces = [];
        var excludedNames = [];
        for (var i = 0, ns; ns = mentionedNamespaces[i]; i++) {
            if (!this.contains(new Name(ns, this.IMPOSSIBLE)))
                excludedNamespaces.push(ns);
        }
        for (var i = 0, name; name = mentionedNames[i]; i++) {
            var contains = this.contains(name);
            if (excludedNamespaces.indexOf(name.getNamespaceUri()) > -1) {
                if (contains)
                includedNames.push(name);
            }
            else if (!contains)
                excludedNames.push(name);
        }
        return new NormalizedAnyNameClass(includedNames, excludedNamespaces, excludedNames);
    }
    var nsMap = {};
    for (var i = 0, ns; ns = mentionedNamespaces[i]; i++) {
        if (this.contains(new Name(ns, this.IMPOSSIBLE)) && nsMap[ns] == null)
            nsMap[ns] = [];
    }
    var includedNames = [];
    for (var i = 0, name; name = mentionedNames[i]; i++) {
        var contains = this.contains(name);
        var excluded = nsMap[name.getNamespaceUri()];
        if (excluded == null) {
            if (contains)
            includedNames.push(name);
        }
        else if (!contains)
            excluded.push(name.getLocalName());
    }
    return new NormalizedNsNameClass(includedNames, nsMap);
};

exports.AbstractNameClassNormalizer = AbstractNameClassNormalizer;
},{"./NameClassVisitor":45,"./NormalizedNsNameClass":48,"./xml/util/Name":176}],2:[function(require,module,exports){
/**
 * @implements {PatternFunction}
 * @constructor
 */
function AbstractPatternFunction() {}

AbstractPatternFunction.prototype.caseEmpty = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseNotAllowed = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseError = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseGroup = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseInterleave = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseChoice = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseOneOrMore = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseElement = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseAttribute = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseData = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseDataExcept = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseValue = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseText = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseList = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseAfter = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseRef = function(pattern) {
    return this.caseOther(pattern);
}

AbstractPatternFunction.prototype.caseOther = function(pattern) {/*absctract*/}


exports.AbstractPatternFunction = AbstractPatternFunction;
},{}],3:[function(require,module,exports){
var BinaryPattern = require('./BinaryPattern').BinaryPattern;

/**
 *
 * @param {Pattern} p1
 * @param {Pattern} p2
 * @class
 * @extends BinaryPattern
 */
function AfterPattern(p1, p2) {
    BinaryPattern.call(this, false, p1, p2);
}

AfterPattern.prototype = Object.create(BinaryPattern.prototype);

AfterPattern.prototype.isNotAllowed = function() {
    return this.p1.isNotAllowed();
}

AfterPattern.prototype.apply = function(f) {
    return f.caseAfter(this);
}

exports.AfterPattern = AfterPattern;
},{"./BinaryPattern":12}],4:[function(require,module,exports){
var ChoiceNameClass = require('./ChoiceNameClass').ChoiceNameClass;
var OverlapDetector = require('./OverlapDetector').OverlapDetector;

function Alphabet() {
    this.nameClass = null;
}

Alphabet.prototype.isEmpty = function() {
    return this.nameClass == null;
}

Alphabet.prototype.addElement = function(nc) {
    if (this.nameClass == null)
        this.nameClass = nc;
    else if (nc != null)
        this.nameClass = new ChoiceNameClass(this.nameClass, nc);
}

Alphabet.prototype.addAlphabet = function(a) {
    this.addElement(a.nameClass);
}

Alphabet.prototype.checkOverlap = function(a) {
    if (this.nameClass != null && a.nameClass != null)
        OverlapDetector.checkOverlap(this.nameClass, a.nameClass,
            "interleave_element_overlap_name",
            "interleave_element_overlap_ns",
            "interleave_element_overlap");
}

exports.Alphabet = Alphabet;
},{"./ChoiceNameClass":17,"./OverlapDetector":54}],5:[function(require,module,exports){
var CommentListImpl = require('./CommentListImpl').CommentListImpl;

function AnnotationsImpl() {}

AnnotationsImpl.prototype = Object.create(CommentListImpl.prototype, {
    constructor: {value: AnnotationsImpl}
});

AnnotationsImpl.prototype.addAttribute = function(ns, localName, prefix, value, loc) {};

AnnotationsImpl.prototype.addElement = function(voidValue) {};

AnnotationsImpl.prototype.addComment = function(comments) {};

AnnotationsImpl.prototype.addLeadingComment = function(comments) {};

exports.AnnotationsImpl = AnnotationsImpl;
},{"./CommentListImpl":19}],6:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;
/**
 *
 * @param {Name} name
 * @class
 * @implements NameClass
 */
function AnyNameClass() {

}

AnyNameClass.prototype = Object.create(NameClass.prototype,
    {constructor: {value: AnyNameClass}});

AnyNameClass.prototype.contains = function(name) {
    return true;
}

AnyNameClass.prototype.containsSpecificity = function(name) {
    return this.SPECIFICITY_ANY_NAME;
}

AnyNameClass.prototype.equals = function(obj) {
    return obj != null && obj instanceof AnyNameClass;
}
AnyNameClass.prototype.accept = function(visitor) {
    visitor.visitAnyName();
}

AnyNameClass.prototype.isOpen = function() {
    return true;
}

exports.AnyNameClass = AnyNameClass;
},{"./NameClass":43}],7:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;

function AnyNameExceptNameClass(nameClass) {
    NameClass.call(this);
    this.nameClass = nameClass;
}

AnyNameExceptNameClass.prototype = Object.create(NameClass.prototype, {
    constructor: {value: AnyNameExceptNameClass}
});

AnyNameExceptNameClass.prototype.contains = function(name) {
    return !this.nameClass.contains(name);
}

AnyNameExceptNameClass.prototype.containsSpecificity = function(name) {
    return this.contains(name) ? this.SPECIFICITY_ANY_NAME : this.SPECIFICITY_NONE;
}

AnyNameExceptNameClass.prototype.equals = function(obj) {
    if (obj == null || !(obj instanceof AnyNameExceptNameClass))
        return false;
    return this.nameClass.equals(obj.nameClass);
}

AnyNameExceptNameClass.prototype.accept = function(visitor) {
    visitor.visitAnyNameExcept(nameClass);
}

AnyNameExceptNameClass.prototype.isOpen = function() {
    return true;
}

exports.AnyNameExceptNameClass = AnyNameExceptNameClass;
},{"./NameClass":43}],8:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;

function ApplyAfterFunction(builder) {
    this.builder = builder;
}

ApplyAfterFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
    constructor: {value: ApplyAfterFunction}
});

ApplyAfterFunction.prototype.caseAfter = function(p) {
    return this.builder.makeAfter(p.getOperand1(), this.apply(p.getOperand2()));
}

ApplyAfterFunction.prototype.caseChoice = function(p) {
    return this.builder.makeChoice(p.getOperand1().apply(this),
        p.getOperand2().apply(this));
}

ApplyAfterFunction.prototype.caseNotAllowed = function(p) {
    return p;
}

ApplyAfterFunction.prototype.caseOther = function(p) {
    throw new AssertionError("ApplyAfterFunction applied to " + p.getClass().getName());
}

ApplyAfterFunction.prototype.apply = function(p) {/*abstract*/}

exports.ApplyAfterFunction = ApplyAfterFunction;
},{"./AbstractPatternFunction":2}],9:[function(require,module,exports){
var Name = require('./xml/util/Name').Name;
var NameClassVisitor = require('./NameClassVisitor').NameClassVisitor;
var WellKnownNamespaces = require('./xml/util/WellKnownNamespaces').WellKnownNamespaces;

function AttributeNameClassChecker() {
    this.errorMessageId = null;
}

AttributeNameClassChecker.prototype = Object.create(NameClassVisitor.prototype, {
    constructor: {value: AttributeNameClassChecker}
});

AttributeNameClassChecker.prototype.visitChoice = function(nc1, nc2) {
    nc1.accept(this);
    nc2.accept(this);
};

AttributeNameClassChecker.prototype.visitNsName = function(ns) {
    if (ns === WellKnownNamespaces.XMLNS)
        this.errorMessageId = "xmlns_uri_attribute";
};

AttributeNameClassChecker.prototype.visitNsNameExcept = function(ns, nc) {
    this.visitNsName(ns);
    nc.accept(this);
};

AttributeNameClassChecker.prototype.visitAnyName = function() {
};

AttributeNameClassChecker.prototype.visitAnyNameExcept = function(nc) {
    nc.accept(this);
};

AttributeNameClassChecker.prototype.visitName = function(name) {
    this.visitNsName(name.getNamespaceUri());
    if (name.equals(new Name("", "xmlns")))
        this.errorMessageId = "xmlns_attribute";
};

AttributeNameClassChecker.prototype.visitNull = function() {
};

AttributeNameClassChecker.prototype.visitError = function() {
};

AttributeNameClassChecker.prototype.checkNameClass = function(nc) {
    this.errorMessageId = null;
    nc.accept(this);
    return this.errorMessageId;
};

exports.AttributeNameClassChecker = AttributeNameClassChecker;
},{"./NameClassVisitor":45,"./xml/util/Name":176,"./xml/util/WellKnownNamespaces":178}],10:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function AttributePattern(nameClass, value, loc) {
    // todo remove debug
    if (nameClass === undefined)
        throw 'Undefined nameClass';
    Pattern.call(this, false, this.EMPTY_CONTENT_TYPE);
    this.nameClass = nameClass;
    this.p = value;
    this.loc = loc;
}

AttributePattern.prototype = Object.create(Pattern.prototype, {
    constructor: {value: AttributePattern}
});

AttributePattern.prototype.expand = function(b) {
    var ep = this.p.expand(b);
    if (ep != this.p)
        return b.makeAttribute(this.nameClass, ep, this.loc);
    else
        return this;
}


AttributePattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_attribute");
        case this.ELEMENT_CONTEXT:
            if (this.nameClass.isOpen())
                throw new RestrictionViolationException("open_name_class_not_repeated");
            break;
        case this.ELEMENT_REPEAT_GROUP_CONTEXT:
            throw new RestrictionViolationException("one_or_more_contains_group_contains_attribute");
        case this.ELEMENT_REPEAT_INTERLEAVE_CONTEXT:
            throw new RestrictionViolationException("one_or_more_contains_interleave_contains_attribute");
        case this.LIST_CONTEXT:
            throw new RestrictionViolationException("list_contains_attribute");
        case this.ATTRIBUTE_CONTEXT:
            throw new RestrictionViolationException("attribute_contains_attribute");
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_attribute");
    }
    dad.addAttribute(this.nameClass);
    try {
        this.p.checkRestrictions(this.ATTRIBUTE_CONTEXT, null, null);
    }
    catch (e) {
        if (e instanceof RestrictionViolationException)
            e.maybeSetLocator(this.loc);
        throw e;
    }
}


AttributePattern.prototype.samePattern = function(other) {
    if (!(other instanceof AttributePattern))
        return false;
    var ap = /**AttributePattern*/ other;
    return this.nameClass.equals(ap.nameClass)&& this.p == ap.p;
}


AttributePattern.prototype.checkRecursion = function(depth) {
    this.p.checkRecursion(depth);
}


AttributePattern.prototype.apply = function(f) {
    return f.caseAttribute(this);
}


AttributePattern.prototype.getContent = function() {
    return this.p;
}


AttributePattern.prototype.getNameClass = function() {
    return this.nameClass;
}


AttributePattern.prototype.getLocator = function() {
    return this.loc;
}

exports.AttributePattern = AttributePattern;
},{"./Pattern":55}],11:[function(require,module,exports){
/*
Copyright or � or Copr. Nicolas Debeissat, Brett Zamir

nicolas.debeissat@gmail.com (http://debeissat.nicolas.free.fr/) brettz9@yahoo.com

This software is a computer program whose purpose is to parse XML
files respecting SAX2 specifications.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 

As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 

In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.

*/

(function () { // Begin namespace

/*
 int 	getIndex(java.lang.String qName)
          Look up the index of an attribute by XML qualified (prefixed) name.
 int 	getIndex(java.lang.String uri, java.lang.String localName)
          Look up the index of an attribute by Namespace name.
 int 	getLength()
          Return the number of attributes in the list.
 java.lang.String 	getLocalName(int index)
          Look up an attribute's local name by index.
 java.lang.String 	getQName(int index)
          Look up an attribute's XML qualified (prefixed) name by index.
 java.lang.String 	getType(int index)
          Look up an attribute's type by index.
 java.lang.String 	getType(java.lang.String qName)
          Look up an attribute's type by XML qualified (prefixed) name.
 java.lang.String 	getType(java.lang.String uri, java.lang.String localName)
          Look up an attribute's type by Namespace name.
 java.lang.String 	getURI(int index)
          Look up an attribute's Namespace URI by index.
 java.lang.String 	getValue(int index)
          Look up an attribute's value by index.
 java.lang.String 	getValue(java.lang.String qName)
          Look up an attribute's value by XML qualified (prefixed) name.
 java.lang.String 	getValue(java.lang.String uri, java.lang.String localName)
          Look up an attribute's value by Namespace name.
 */

// Private helpers for AttributesImpl (private static treated as private instance below)
function _getIndexByQName(qName) {
    var i = this.attsArray.length;
    while (i--) {
        if (this.attsArray[i].qName === qName) {
            return i;
        }
    }
    return -1;
}
function _getIndexByURI(uri, localName) {
    var i = this.attsArray.length;
    while (i--) {
        if (this.attsArray[i].namespaceURI === uri && this.attsArray[i].localName === localName) {
            return i;
        }
    }
    return -1;
}
function _getValueByIndex(index) {
    return this.attsArray[index] ? this.attsArray[index].value : null;
}
function _getValueByQName(qName) {
    var i = this.attsArray.length;
    while (i--) {
        if (this.attsArray[i].qName.equals(qName)) {
            return this.attsArray[i].value;
        }
    }
    return null;
}
function _getValueByURI(uri, localName) {
    var i = this.attsArray.length;
    while (i--) {
        if (this.attsArray[i].namespaceURI === uri && this.attsArray[i].localName === localName) {
            return this.attsArray[i].value;
        }
    }
    return null;
}

function Sax_Attribute(namespaceURI, prefix, localName, qName, type, value) {
    this.namespaceURI = namespaceURI;
    //avoiding error, the empty prefix of attribute must be null
    if (prefix === undefined || prefix === "") {
        this.prefix = null;
    } else {
        this.prefix = prefix;
    }
    this.localName = localName;
    this.qName = qName;
    this.type = type;
    this.value = value;
}

// INCOMPLETE
// http://www.saxproject.org/apidoc/org/xml/sax/helpers/AttributesImpl.html
function AttributesImpl(attsArray) {
    if (attsArray) {
        this.attsArray = attsArray;
    } else {
        this.attsArray = [];
    }
}

// INTERFACE: Attributes: http://www.saxproject.org/apidoc/org/xml/sax/Attributes.html
AttributesImpl.prototype.getIndex = function(arg1, arg2) {
    if (arg2 === undefined) {
        return _getIndexByQName.call(this, arg1);
    } else {
        return _getIndexByURI.call(this, arg1, arg2);
    }
};
AttributesImpl.prototype.getLength = function() {
    return this.attsArray.length;
};
//in order not to parse qname several times, add that convenience method
AttributesImpl.prototype.getPrefix = function(index) {
    return this.attsArray[index].prefix;
};
AttributesImpl.prototype.getLocalName = function(index) {
    return this.attsArray[index].localName;
};
AttributesImpl.prototype.getQName = function(index) {
    return this.attsArray[index].qName;
};
//not supported
AttributesImpl.prototype.getType = function(arg1, arg2) { // Should allow 1-2 arguments of different types: idnex or qName or uri+localName
    // Besides CDATA (default when not supported), could return "ID", "IDREF", "IDREFS", "NMTOKEN", "NMTOKENS", "ENTITY", "ENTITIES", or "NOTATION" (always in upper case).
    // "For an enumerated attribute that is not a notation, the parser will report the type as 'NMTOKEN'."
    // If uri and localName passed, should return the "attribute type as a string, or null if the attribute is not in the list or if Namespace processing is not being performed."
    // If qName passed, should return the "attribute type as a string, or null if the attribute is not in the list or if qualified names are not available."
    return "CDATA";
};
AttributesImpl.prototype.getURI = function(index) {
    return this.attsArray[index].namespaceURI;
};
AttributesImpl.prototype.getValue = function(arg1, arg2) {
    if (arg2 === undefined) {
        if (typeof arg1 === "string") {
            return _getValueByQName.call(this, arg1);
        } else {
            return _getValueByIndex.call(this, arg1);
        }
    } else {
        return _getValueByURI.call(this, arg1, arg2);
    }
};
// Other AttributesImpl methods
AttributesImpl.prototype.addAttribute = function (uri, localName, qName, type, value) {
    var prefix = null;
    if (localName.length !== qName.length) {
        prefix = qName.split(":")[0];
    }
    this.attsArray.push(new Sax_Attribute(uri, prefix, localName, qName, type, value));
};
//in order not to parse qname several times, add that convenience method
AttributesImpl.prototype.addAttribute = function (uri, prefix, localName, qName, type, value) {
    this.attsArray.push(new Sax_Attribute(uri, prefix, localName, qName, type, value));
};
AttributesImpl.prototype.clear = function () {
    this.attsArray = [];
};
AttributesImpl.prototype.removeAttribute = function (index) {
    this.attsArray.splice(index, 1);
};
//not sure those two functions should be available
AttributesImpl.prototype.setAttribute = function (index, uri, localName, qName, type, value) {};
AttributesImpl.prototype.setAttributes = function (atts) {};

AttributesImpl.prototype.setLocalName = function (index, localName) {
    this.attsArray[index].localName = localName;
};
AttributesImpl.prototype.setQName = function (index, qName) {
    var att = this.attsArray[index];
    att.qName = qName;
    if (name.indexOf(":") !== -1) {
        var splitResult = qName.split(":");
        att.prefix = splitResult[0];
        att.localName = splitResult[1];
    } else {
        att.prefix = null;
        att.localName = qName;
    }
};
AttributesImpl.prototype.setType = function (index, type) {
    this.attsArray[index].type = type;
};
AttributesImpl.prototype.setURI = function (index, uri) {
    this.attsArray[index].namespaceURI = uri;
};
AttributesImpl.prototype.setValue = function (index, value) {
    this.attsArray[index].value = value;
};


/*
Attributes2Impl()
          Construct a new, empty Attributes2Impl object.
Attributes2Impl(Attributes atts)
          Copy an existing Attributes or Attributes2 object.
*/
// http://www.saxproject.org/apidoc/org/xml/sax/ext/Attributes2Impl.html
// When implemented, use this attribute class if this.features['http://xml.org/sax/features/use-attributes2'] is true
function Attributes2Impl (atts) {
    if (atts) {}
    throw 'Attributes2Impl is presently unimplemented';
}
Attributes2Impl.prototype = new AttributesImpl();

// INTERFACE: Attributes2: http://www.saxproject.org/apidoc/org/xml/sax/ext/Attributes2.html
/*
 boolean 	isDeclared(int index)
          Returns false unless the attribute was declared in the DTD.
 boolean 	isDeclared(java.lang.String qName)
          Returns false unless the attribute was declared in the DTD.
 boolean 	isDeclared(java.lang.String uri, java.lang.String localName)
          Returns false unless the attribute was declared in the DTD.
 boolean 	isSpecified(int index)
          Returns true unless the attribute value was provided by DTD defaulting.
 boolean 	isSpecified(java.lang.String qName)
          Returns true unless the attribute value was provided by DTD defaulting.
 boolean 	isSpecified(java.lang.String uri, java.lang.String localName)
          Returns true unless the attribute value was provided by DTD defaulting.
*/
Attributes2Impl.prototype.isDeclared = function (indexOrQNameOrURI, localName) {
};
Attributes2Impl.prototype.isSpecified = function (indexOrQNameOrURI, localName) {
};
// Other Attributes2Impl methods
/*
 void 	addAttribute(java.lang.String uri, java.lang.String localName, java.lang.String qName, java.lang.String type, java.lang.String value)
          Add an attribute to the end of the list, setting its "specified" flag to true.
void 	removeAttribute(int index)
          Remove an attribute from the list.
 void 	setAttributes(Attributes atts)
          Copy an entire Attributes object.
 void 	setDeclared(int index, boolean value)
          Assign a value to the "declared" flag of a specific attribute.
 void 	setSpecified(int index, boolean value)
          Assign a value to the "specified" flag of a specific attribute.
 **/
Attributes2Impl.prototype.addAttribute = function (uri, localName, qName, type, value) {
};
Attributes2Impl.prototype.removeAttribute = function (index) {
};
Attributes2Impl.prototype.setAttributes = function (atts) {
};
Attributes2Impl.prototype.setDeclared = function (index, value) {
};
Attributes2Impl.prototype.setSpecified = function (index, value) {
};

this.AttributesImpl = AttributesImpl;

}.call(exports)); // end namespace
},{}],12:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function BinaryPattern(nullable, p1, p2) {
    Pattern.call(this, nullable,  Math.max(p1.getContentType(), p2.getContentType()));
    this.p1 = p1;
    this.p2 = p2;
}

BinaryPattern.prototype = Object.create(Pattern.prototype ,{
    constructor: {value: BinaryPattern}
});

BinaryPattern.prototype.checkRecursion = function(depth) {
    this.p1.checkRecursion(depth);
    this.p2.checkRecursion(depth);
}

/**
 *
 * @param {Integer} context
 * @param {DuplicateAttributeDetector} dad
 * @param {Alphabet} alpha
 */
BinaryPattern.prototype.checkRestrictions = function(context, dad, alpha) {
    this.p1.checkRestrictions(context, dad, alpha);
    this.p2.checkRestrictions(context, dad, alpha);
}

/**
 *
 * @param {Pattern} other
 * @return {Boolean}
 */
BinaryPattern.prototype.samePattern = function(other) {
    if (this.constructor.name != other.constructor.name)
        return false;
    var b = /*{BinaryPattern}*/other;
    return this.p1 == b.p1 && this.p2 == b.p2;
}

BinaryPattern.prototype.getOperand1 = function() {
    return this.p1;
}

BinaryPattern.prototype.getOperand2 = function() {
    return this.p2;
}

exports.BinaryPattern = BinaryPattern;
},{"./Pattern":55}],13:[function(require,module,exports){
var DataDerivType = require('./DataDerivType').DataDerivType;
var SingleDataDerivType = require('./SingleDataDerivType').SingleDataDerivType;
var DataDerivFunction = require('./DataDerivFunction').DataDerivFunction;
var InconsistentDataDerivType = require('./InconsistentDataDerivType').InconsistentDataDerivType;


function BlankDataDerivType() {
    this.blankMemo = null;
    this.nonBlankMemo = null;
}

BlankDataDerivType.prototype = Object.create(DataDerivType.prototype, {
    constructor: {value: BlankDataDerivType}
});

BlankDataDerivType.prototype.dataDeriv = function(builder, p, str, vc, fail) {
    if (DataDerivFunction.isBlank(str)) {
        if (this.blankMemo == null || (fail != null && this.blankMemo.isNotAllowed()))
            this.blankMemo = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        return this.blankMemo;
    }
    else {
        if (this.nonBlankMemo == null || (fail != null && this.nonBlankMemo.isNotAllowed()))
            this.nonBlankMemo = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        return this.nonBlankMemo;
    }
}

BlankDataDerivType.prototype.copy = function() {
    return new BlankDataDerivType();
}

BlankDataDerivType.prototype.combine = function(ddt) {
    if (ddt instanceof BlankDataDerivType || ddt instanceof SingleDataDerivType)
        return this;
    return InconsistentDataDerivType.getInstance();
}

exports.BlankDataDerivType = BlankDataDerivType;
},{"./DataDerivFunction":22,"./DataDerivType":23,"./InconsistentDataDerivType":38,"./SingleDataDerivType":80}],14:[function(require,module,exports){
var SchemaBuilderImpl = require('./SchemaBuilderImpl').SchemaBuilderImpl;

function BuiltinDatatypeBuilder(dt) {
    this.dt = dt;
}

BuiltinDatatypeBuilder.prototype.addParameter = function(name, value, context) {
    throw new DatatypeException(SchemaBuilderImpl.localizer.message("builtin_param"));
}

BuiltinDatatypeBuilder.prototype.createDatatype = function() {
    return this.dt;
}

exports.BuiltinDatatypeBuilder = BuiltinDatatypeBuilder;
},{"./SchemaBuilderImpl":76}],15:[function(require,module,exports){
var BuiltinDatatypeBuilder = require('./BuiltinDatatypeBuilder').BuiltinDatatypeBuilder;
var TokenDatatype = require('./TokenDatatype').TokenDatatype;
var StringDatatype = require('./StringDatatype').StringDatatype;

function BuiltinDatatypeLibrary() {
    this.tokenDatatypeBuilder = new BuiltinDatatypeBuilder(new TokenDatatype());
    this.stringDatatypeBuilder= new BuiltinDatatypeBuilder(new StringDatatype());
}


BuiltinDatatypeLibrary.prototype.createDatatypeBuilder = function(type) {
    if (type === "token")
        return this.tokenDatatypeBuilder;
    else if (type === "string")
        return this.stringDatatypeBuilder;
    throw new DatatypeException();
}

BuiltinDatatypeLibrary.prototype.createDatatype = function(type) {
    return this.createDatatypeBuilder(type).createDatatype();
}

exports.BuiltinDatatypeLibrary = BuiltinDatatypeLibrary;
},{"./BuiltinDatatypeBuilder":14,"./StringDatatype":84,"./TokenDatatype":89}],16:[function(require,module,exports){
var WellKnownNamespaces = require('./xml/util/WellKnownNamespaces').WellKnownNamespaces;
var BuiltinDatatypeLibrary = require('./BuiltinDatatypeLibrary').BuiltinDatatypeLibrary;

function BuiltinDatatypeLibraryFactory(factory) {
    this.cache = {};
    this.lastDatatypeLibrary = null;
    this.lastDatatypeLibraryUri = null;
    this.builtinDatatypeLibrary = new BuiltinDatatypeLibrary();
    this.factory = factory;
    // todo
//    this.cache[WellKnownNamespaces.RELAX_NG_COMPATIBILITY_DATATYPES] =
//        new CompatibilityDatatypeLibrary(this);
}

BuiltinDatatypeLibraryFactory.prototype.createDatatypeLibrary = function(uri) {
    if (uri === "")
        return this.builtinDatatypeLibrary;
    if (uri === this.lastDatatypeLibraryUri)
        return this.lastDatatypeLibrary;
    var library = this.cache[uri];
    if (library == null) {
        if (this.factory == null)
            return null;
        library = this.factory.createDatatypeLibrary(uri);
        if (library == null)
            return null;
        this.cache[uri] = library;
    }
    this.lastDatatypeLibraryUri = uri;
    return this.lastDatatypeLibrary = library;
}

exports.BuiltinDatatypeLibraryFactory = BuiltinDatatypeLibraryFactory;
},{"./BuiltinDatatypeLibrary":15,"./xml/util/WellKnownNamespaces":178}],17:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;
/**
 *
 * @param {Name} name
 * @class
 * @implements NameClass
 */
function ChoiceNameClass(nameClass1, nameClass2) {
    this.nameClass1 = nameClass1;
    this.nameClass2 = nameClass2;
}

ChoiceNameClass.prototype = Object.create(NameClass.prototype,
    {constructor: {value: ChoiceNameClass}});

ChoiceNameClass.prototype.contains = function(name) {
    return (this.nameClass1.contains(name)
        || this.nameClass2.contains(name));
}

ChoiceNameClass.prototype.containsSpecificity = function(name) {
    return Math.max(this.nameClass1.containsSpecificity(name),
        this.nameClass2.containsSpecificity(name));
}

ChoiceNameClass.prototype.equals = function(obj) {
    if (obj == null || !(obj instanceof ChoiceNameClass))
        return false;
    var other = /**ChoiceNameClass*/obj;
    return (this.nameClass1.equals(other.nameClass1)
        && this.nameClass2.equals(other.nameClass2));
}

ChoiceNameClass.prototype.accept = function(visitor) {
    visitor.visitChoice(this.nameClass1, this.nameClass2);
}

ChoiceNameClass.prototype.isOpen = function() {
    return this.nameClass1.isOpen() || this.nameClass2.isOpen();
}

exports.ChoiceNameClass = ChoiceNameClass;
},{"./NameClass":43}],18:[function(require,module,exports){
var BinaryPattern = require('./BinaryPattern').BinaryPattern;

/**
 *
 * @param {Pattern} p1
 * @param {Pattern} p2
 * @constructor
 */
function ChoicePattern(p1, p2) {
    BinaryPattern.call(this, p1.isNullable() || p2.isNullable(), p1, p2);
}

ChoicePattern.prototype = Object.create(BinaryPattern.prototype);

/**
 *
 * @param {SchemaPatternBuilder} b
 * @return {Pattern}
 */
ChoicePattern.prototype.expand = function(b) {
    var ep1 = this.p1.expand(b);
    var ep2 = this.p2.expand(b);
    if (ep1 != this.p1 || ep2 != this.p2)
        return b.makeChoice(ep1, ep2);
    else
        return this;
}

/**
 *
 * @param {Pattern} p
 * @return {Boolean}
 */
ChoicePattern.prototype.containsChoice = function(p) {
    return this.p1.containsChoice(p) || this.p2.containsChoice(p);
}

/**
 *
 * @param {PatternFunction} f
 * @return {*}
 */
ChoicePattern.prototype.apply = function(f) {
    return f.caseChoice(this);
}

/**
 *
 * @param {Integer} context
 * @param {DuplicateAttributeDetector} dad
 * @param {Alphabet} alpha
 */
ChoicePattern.prototype.checkRestrictions = function(context, dad, alpha) {
    if (dad != null)
        dad.startChoice();
    this.p1.checkRestrictions(context, dad, alpha);
    if (dad != null)
        dad.alternative();
    this.p2.checkRestrictions(context, dad, alpha);
    if (dad != null)
        dad.endChoice();
}

exports.ChoicePattern = ChoicePattern;
},{"./BinaryPattern":12}],19:[function(require,module,exports){
/**
 *
 * @class
 * @implements CommentList
 */
function CommentListImpl() {}

CommentListImpl.prototype.addComment = function(value, loc) {};

exports.CommentListImpl = CommentListImpl;
},{}],20:[function(require,module,exports){
var DataDerivType = require('./DataDerivType').DataDerivType;
var ValueDataDerivType = require('./ValueDataDerivType').ValueDataDerivType;
var InconsistentDataDerivType = require('./InconsistentDataDerivType').InconsistentDataDerivType;
var DataDerivFailure = require('./DataDerivFailure').DataDerivFailure;
var DatatypeException = require('./relaxng/datatype/DatatypeException').DatatypeException;

function DataDataDerivType(dp) {
    DataDerivType.call(this);
    this.validMemo = null;
    this.invalidMemo = null;
    this.dp = dp;
}

DataDataDerivType.prototype = Object.create(DataDerivType.prototype, {
    constructor: {value: DataDataDerivType}
});

DataDataDerivType.prototype.dataDeriv = function(builder, p, str, vc, fail) {
    var isValid;
    var dt = this.dp.getDatatype();
    var ddf = null;
    if (fail != null) {
        try {
            dt.checkValid(str, vc);
            isValid = true;
        }
        catch (e) {
            if (e instanceof DatatypeException) {
                isValid = false;
                ddf = new DataDerivFailure(this.dp, e);
            }
            else
                throw e;
        }
    }
    else
        isValid = dt.isValid(str, vc);
    if (isValid) {
        if (this.validMemo == null || (fail != null && this.validMemo.isNotAllowed()))
            this.validMemo = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        return this.validMemo;
    }
    else {
        if (this.invalidMemo == null)
            this.invalidMemo = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        else if (this.invalidMemo.isNotAllowed() && ddf != null)
            fail.push(ddf);
        return this.invalidMemo;
    }
}

DataDataDerivType.prototype.copy = function() {
    return new DataDataDerivType(this.dp);
}


DataDataDerivType.prototype.combine = function(ddt) {
    if (ddt instanceof DataDataDerivType) {
        if (ddt.dp.getDatatype() == this.dp.getDatatype())
        return this;
        return InconsistentDataDerivType.getInstance();
    }
    if (ddt instanceof ValueDataDerivType) {
        if (ddt.getDatatype() == this.dp.getDatatype())
        return ddt;
        return InconsistentDataDerivType.getInstance();
    }
    return ddt.combine(this);
}

exports.DataDataDerivType = DataDataDerivType;
},{"./DataDerivFailure":21,"./DataDerivType":23,"./InconsistentDataDerivType":38,"./ValueDataDerivType":93,"./relaxng/datatype/DatatypeException":168}],21:[function(require,module,exports){
var ValuePattern = require('./ValuePattern').ValuePattern;
var DataPattern = require('./DataPattern').DataPattern;
/**
 * Provides information about why a DataDerivFunction returned notAllowed.
 * @constructor
 */
function DataDerivFailure() {
    this.datatype = null;
    this.datatypeName = null;
    this.datatypeParams = null;
    this.message = null;
    this.stringValue = null;
    this.value = null;
    // except non-null means it matched the except
    this.except = null;
    // index where error occurred if known
    this.index = 0;
    this.tokenIndex = -1;
    this.tokenStart = -1;
    this.tokenEnd = -1;
    if (arguments[0] instanceof ValuePattern) {
        var p = arguments[0];
        this.datatype = p.getDatatype();
        this.datatypeName = p.getDatatypeName();
        this.datatypeParams = null;
        this.message = null;
        this.except = null;
        this.index = -1;
        this.stringValue = p.stringValue;
        this.value = p.value;
    } else if (arguments[0] instanceof DataPattern) {
        var p = arguments[0];
        var e = arguments[1];
        this.datatype = p.getDatatype();
        this.datatypeName = p.getDatatypeName();
        this.datatypeParams = p.getParams();
        this.message = e.message;
        this.index = e.index;
    } else {
        throw new Error('invalid argument' + p.constructor.name);
    }
}

DataDerivFailure.prototype.equals = function(obj) {
    if (!(obj instanceof DataDerivFailure))
        return false;
    var other = /**DataDerivFailure*/ obj;
    return (this.datatype == other.datatype
        && this.equal(this.message, other.message)
        && this.equal(this.stringValue, other.stringValue)
        && this.except == other.except
        && this.tokenIndex == other.tokenIndex
        && this.index == other.index);
}

DataDerivFailure.prototype.equal = function(o1, o2) {
    if (o1 == null)
        return o2 == null;
    return o1.equals(o2);
}

DataDerivFailure.prototype.getDatatype = function() {
    return this.datatype;
}

DataDerivFailure.prototype.getDatatypeName = function() {
    return this.datatypeName;
}

DataDerivFailure.prototype.getDatatypeParams = function() {
    return this.datatypeParams;
}

DataDerivFailure.prototype.getMessage = function() {
    return this.message;
}

DataDerivFailure.prototype.getStringValue = function() {
    return this.stringValue;
}

DataDerivFailure.prototype.getValue = function() {
    return this.value;
}

DataDerivFailure.prototype.getExcept = function() {
    return this.except;
}

DataDerivFailure.prototype.getIndex = function() {
    return this.index;
}

DataDerivFailure.prototype.getTokenIndex = function() {
    return this.tokenIndex;
}

DataDerivFailure.prototype.getTokenStart = function() {
    return this.tokenStart;
}

DataDerivFailure.prototype.getTokenEnd = function() {
    return this.tokenEnd;
}

DataDerivFailure.prototype.setToken = function(tokenIndex, tokenStart, tokenEnd) {
    this.tokenIndex = tokenIndex;
    this.tokenStart = tokenStart;
    this.tokenEnd = tokenEnd;
    if (this.index < 0)
        this.index += tokenStart;
}

exports.DataDerivFailure = DataDerivFailure;
},{"./DataPattern":26,"./ValuePattern":94}],22:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var DataDerivFailure = require('./DataDerivFailure').DataDerivFailure;
var DatatypeException = require('./relaxng/datatype/DatatypeException').DatatypeException;

function DataDerivFunction(str, vc, builder, fail) {
    this.str = str;
    this.vc = vc;
    this.builder = builder;
    this.fail = fail;
}

DataDerivFunction.isBlank = function(str) {
    var len = str.length;
    for (var i = 0; i < len; i++) {
        switch (str.charAt(i)) {
            case '\r':
            case '\n':
            case ' ':
            case '\t':
                break;
            default:
                return false;
        }
    }
    return true;
}

DataDerivFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
    constructor: {value: DataDerivFunction}
});

DataDerivFunction.prototype.isBlank = DataDerivFunction.isBlank;

DataDerivFunction.prototype.caseText = function(p) {
    return p;
}

DataDerivFunction.prototype.caseRef = function(p) {
    return this.memoApply(p.getPattern());
}

DataDerivFunction.prototype.caseList = function(p) {
    var len = this.str.length;
    var tokenIndex = 0;
    var tokenStart = -1;
    var memo = this.builder.getPatternMemo(p.getOperand());
    for (var i = 0; i < len; i++) {
        switch (this.str.charAt(i)) {
            case '\r':
            case '\n':
            case ' ':
            case '\t':
                if (tokenStart >= 0) {
                    memo = this.tokenDeriv(memo, tokenIndex++, tokenStart, i);
                    tokenStart = -1;
                }
                break;
            default:
                if (tokenStart < 0)
                    tokenStart = i;
                break;
        }
    }
    if (tokenStart >= 0)
        memo = this.tokenDeriv(memo, tokenIndex++, tokenStart, len);
    if (memo.getPattern().isNullable())
        return this.builder.makeEmpty();
    if (memo.isNotAllowed())
        return memo.getPattern();
    // pseudo-token to try and force some failures
    this.tokenDeriv(memo, tokenIndex, len, len);
    // XXX handle the case where this didn't produce any failures
    return this.builder.makeNotAllowed();
}

DataDerivFunction.prototype.tokenDeriv = function(p, tokenIndex, start, end) {
    var failStartSize = this.failSize();
    var deriv = p.dataDeriv(this.str.substring(start, end), this.vc, this.fail);
    if (this.fail != null && deriv.isNotAllowed()) {
        for (var i = this.fail.length - 1; i >= failStartSize; --i)
        this.fail[i].setToken(tokenIndex, start, end);
    }
    return deriv;
}

DataDerivFunction.prototype.caseValue = function(p) {
    var dt = p.getDatatype();
    var value = dt.createValue(this.str, this.vc);
    if (value != null && dt.sameValue(p.getValue(), value))
        return this.builder.makeEmpty();
    if (this.fail != null) {
        if (value == null) {
            try {
                dt.checkValid(this.str, this.vc);
            }
            catch (e) {
                if (e instanceof DatatypeException)
                    this.fail.push(new DataDerivFailure(dt, p.getDatatypeName(), e));
                else
                    throw e;
            }
        }
        else
            this.fail.push(new DataDerivFailure(p));
    }
    return this.builder.makeNotAllowed();
}

DataDerivFunction.prototype.caseData = function(p) {
    if (p.allowsAnyString())
        return this.builder.makeEmpty();
    if (this.fail != null) {
        try {
            p.getDatatype().checkValid(this.str, this.vc);
            return this.builder.makeEmpty();
        }
        catch (e) {
            if (e instanceof DatatypeException) {
                this.fail.push(new DataDerivFailure(p, e));
                return this.builder.makeNotAllowed();
            }
            else
                throw e;
        }
    }
    if (p.getDatatype().isValid(this.str, this.vc))
        return this.builder.makeEmpty();
    else
        return this.builder.makeNotAllowed();
}

DataDerivFunction.prototype.caseDataExcept = function(p) {
    var tem = this.caseData(p);
    if (tem.isNullable() && this.memoApply(p.getExcept()).isNullable()) {
        if (this.fail != null)
            this.fail.push(new DataDerivFailure(p));
        return this.builder.makeNotAllowed();
    }
    return tem;
}

DataDerivFunction.prototype.caseAfter = function(p) {
    var p1 = p.getOperand1();
    var failStartSize = this.failSize();
    if (this.memoApplyWithFailure(p1).isNullable())
        return p.getOperand2();
    if (p1.isNullable() && this.isBlank(this.str)) {
        this.clearFailures(failStartSize);
        return p.getOperand2();
    }
    return this.builder.makeNotAllowed();
}

DataDerivFunction.prototype.caseChoice = function(p) {
    var failStartSize = this.failSize();
    var tem = this.builder.makeChoice(this.memoApplyWithFailure(p.getOperand1()),
        this.memoApplyWithFailure(p.getOperand2()));
    if (!tem.isNotAllowed())
        this.clearFailures(failStartSize);
    return tem;
}

DataDerivFunction.prototype.caseGroup = function(p) {
    var failStartSize = this.failSize();
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var tem = this.builder.makeGroup(this.memoApplyWithFailure(p1), p2);
    if (p1.isNullable())
        tem = this.builder.makeChoice(tem, this.memoApplyWithFailure(p2));
    if (!tem.isNotAllowed())
        this.clearFailures(failStartSize);
    return tem;
}

// list//interleave is prohibited, so I don't think this can happen
DataDerivFunction.prototype.caseInterleave = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    return this.builder.makeChoice(this.builder.makeInterleave(this.memoApply(p1), p2),
        this.builder.makeInterleave(p1, this.memoApply(p2)));
}

DataDerivFunction.prototype.caseOneOrMore = function(p) {
    return this.builder.makeGroup(this.memoApplyWithFailure(p.getOperand()),
        this.builder.makeOptional(p));
}

DataDerivFunction.prototype.caseOther = function(p) {
    return this.builder.makeNotAllowed();
}

DataDerivFunction.prototype.memoApply = function(p) {
    return this.builder.getPatternMemo(p).dataDeriv(this.str, this.vc).getPattern();
}

DataDerivFunction.prototype.memoApplyWithFailure = function(p) {
    return this.builder.getPatternMemo(p).dataDeriv(this.str, this.vc, this.fail).getPattern();
}

DataDerivFunction.prototype.failSize = function() {
    return this.fail == null ? 0 : this.fail.length;
}

DataDerivFunction.prototype.clearFailures = function(failStartSize) {
    if (this.fail != null)
        this.fail.splice(failStartSize);
}

exports.DataDerivFunction = DataDerivFunction;
},{"./AbstractPatternFunction":2,"./DataDerivFailure":21,"./relaxng/datatype/DatatypeException":168}],23:[function(require,module,exports){
var DataDerivFunction = require('./DataDerivFunction').DataDerivFunction;

/**
 *
 * @constructor
 */
function DataDerivType() {}

/**
 * @abstract
 */
DataDerivType.prototype.copy = function() {}

/**
 * @abstract
 * @param {DataDerivType} ddt
 */
DataDerivType.prototype.combine = function(ddt) {}

/**
 *
 * @param {ValidatorPatternBuilder} builder
 * @param {Pattern} p
 * @param {String} str
 * @param {ValidationContext} vc
 * @param {DataDerivFailure[]} fail
 * @return {PatternMemo}
 */
DataDerivType.prototype.dataDeriv = function(builder, p, str, vc, fail) {
    return builder.getPatternMemo(p.apply(new DataDerivFunction(str, vc, builder, fail)));
}

exports.DataDerivType = DataDerivType;
},{"./DataDerivFunction":22}],24:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var SingleDataDerivType = require('./SingleDataDerivType').SingleDataDerivType;
var BlankDataDerivType = require('./BlankDataDerivType').BlankDataDerivType;
var ValueDataDerivType = require('./ValueDataDerivType').ValueDataDerivType;
var DataDataDerivType = require('./DataDataDerivType').DataDataDerivType;
var InconsistentDataDerivType = require('./InconsistentDataDerivType').InconsistentDataDerivType;

function DataDerivTypeFunction(builder) {
    this.builder = builder;
}

DataDerivTypeFunction.dataDerivType = function(builder, pattern) {
    return pattern.apply(builder.getDataDerivTypeFunction());
}

DataDerivTypeFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
    constructor: {value: DataDerivTypeFunction}
});

DataDerivTypeFunction.prototype.dataDerivType = DataDerivTypeFunction.dataDerivType;

DataDerivTypeFunction.prototype.caseOther = function(p) {
    return new SingleDataDerivType();
}

DataDerivTypeFunction.prototype.caseRef = function(p) {
    return this.apply(p.getPattern());
}

DataDerivTypeFunction.prototype.caseAfter = function(p) {
    var p1 = p.getOperand1();
    var ddt = this.apply(p.getOperand1());
    if (!p1.isNullable())
        return ddt;
    return ddt.combine(new BlankDataDerivType());
}

DataDerivTypeFunction.prototype.caseBinary = function(p) {
    return this.apply(p.getOperand1()).combine(this.apply(p.getOperand2()));
}

DataDerivTypeFunction.prototype.caseChoice = function(p) {
    return this.caseBinary(p);
}

DataDerivTypeFunction.prototype.caseGroup = function(p) {
    return this.caseBinary(p);
}

DataDerivTypeFunction.prototype.caseInterleave = function(p) {
    return this.caseBinary(p);
}

DataDerivTypeFunction.prototype.caseOneOrMore = function(p) {
    return this.apply(p.getOperand());
}

DataDerivTypeFunction.prototype.caseList = function(p) {
    return InconsistentDataDerivType.getInstance();
}

DataDerivTypeFunction.prototype.caseValue = function(p) {
    return new ValueDataDerivType(p.getDatatype(), p.getDatatypeName());
}

DataDerivTypeFunction.prototype.caseData = function(p) {
    if (p.allowsAnyString())
        return new SingleDataDerivType();
    return new DataDataDerivType(p);
}

DataDerivTypeFunction.prototype.caseDataExcept = function(p) {
    if (p.allowsAnyString())
        return this.apply(p.getExcept());
    return new DataDataDerivType(p).combine(this.apply(p.getExcept()));
}

DataDerivTypeFunction.prototype.apply = function(p) {
    return this.builder.getPatternMemo(p).dataDerivType();
}

exports.DataDerivTypeFunction = DataDerivTypeFunction;
},{"./AbstractPatternFunction":2,"./BlankDataDerivType":13,"./DataDataDerivType":20,"./InconsistentDataDerivType":38,"./SingleDataDerivType":80,"./ValueDataDerivType":93}],25:[function(require,module,exports){
var DataPattern = require('./DataPattern').DataPattern;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;

function DataExceptPattern(dt, dtName, params, except, loc) {
    DataPattern.call(this, dt, dtName, params);
    this.except = except;
    this.loc = loc;
}

DataExceptPattern.prototype = Object.create(DataPattern.prototype, {
    constructor: {value: DataExceptPattern}
});

DataExceptPattern.prototype.samePattern = function(other) {
    if (!DataPattern.prototype.samePattern.call(this, other))
        return false;
    return this.except.samePattern(other.except);
}

DataExceptPattern.prototype.apply = function(f) {
    return f.caseDataExcept(this);
}

DataExceptPattern.prototype.checkRestrictions = function(context, dad, alpha) {
    DataPattern.prototype.checkRestrictions.call(this, context, dad, alpha);
    try {
        this.except.checkRestrictions(this.DATA_EXCEPT_CONTEXT, null, null);
    }
    catch (e) {
        if (e instanceof RestrictionViolationException)
            e.maybeSetLocator(this.loc);
        throw e;
    }
}

DataExceptPattern.prototype.getExcept = function() {
    return this.except;
}

exports.DataExceptPattern  = DataExceptPattern;
},{"./DataPattern":26,"./RestrictionViolationException":71}],26:[function(require,module,exports){
var StringPattern = require('./StringPattern').StringPattern;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;
var Datatype2 = require('./datatype/Datatype2').Datatype2;

function DataPattern(dt, dtName, params) {
    StringPattern.call(this);
    this.dt = dt;
    this.dtName = dtName;
    this.params = params;
}

DataPattern.prototype = Object.create(StringPattern.prototype, {
    constructor: {value: DataPattern}
});

DataPattern.prototype.samePattern = function(other) {
    if (other.constructor != this.constructor)
        return false;
    return this.dt.equals(other.dt);
}

DataPattern.prototype.apply = function(f) {
    return f.caseData(this);
}

DataPattern.prototype.getDatatype = function() {
    return this.dt;
}

DataPattern.prototype.getDatatypeName = function() {
    return this.dtName;
}

DataPattern.prototype.getParams = function() {
    // todo Collections.unmodifiableList
    return this.params;
}

DataPattern.prototype.allowsAnyString = function() {
    return this.dt instanceof Datatype2 && this.dt.alwaysValid();
}

DataPattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_data");
    }
}

exports.DataPattern = DataPattern;
},{"./RestrictionViolationException":71,"./StringPattern":86,"./datatype/Datatype2":96}],27:[function(require,module,exports){
function DatatypeValue(value, dt) {
    this.value = value;
    this.dt = dt;
}

DatatypeValue.prototype.equals = function(obj) {
    if (!(obj instanceof DatatypeValue))
        return false;
    var other = /**DatatypeValue*/ obj;
    if (other.dt != this.dt)
        return false;
    return this.dt.sameValue(this.value, other.value);
}

exports.DatatypeValue = DatatypeValue;
},{}],28:[function(require,module,exports){
var OverlapDetector = require('./OverlapDetector').OverlapDetector;

function Alternative(startIndex, parent){
    this.startIndex = startIndex;
    this.endIndex = startIndex;
    this.parent = parent;
}

function DuplicateAttributeDetector(){
    this.nameClasses = [];
    this.alternatives = null;
}

DuplicateAttributeDetector.prototype.addAttribute = function(nc) {
    var lim = this.nameClasses.length;
    for (var a = this.alternatives; a != null; a = a.parent) {
        for (var i = a.endIndex; i < lim; i++)
            this.checkAttributeOverlap(nc, this.nameClasses[i]);
        lim = a.startIndex;
    }
    for (var i = 0; i < lim; i++)
        this.checkAttributeOverlap(nc, this.nameClasses[i]);
    this.nameClasses.push(nc);
}

DuplicateAttributeDetector.prototype.checkAttributeOverlap = function(nc1, nc2) {
    OverlapDetector.checkOverlap(nc1, nc2,
        "duplicate_attribute_name",
        "duplicate_attribute_ns",
        "duplicate_attribute");
}

DuplicateAttributeDetector.prototype.startChoice = function() {
    this.alternatives = new Alternative(this.nameClasses.length, this.alternatives);
}

DuplicateAttributeDetector.prototype.alternative = function() {
    this.alternatives.endIndex = this.nameClasses.length;
}

DuplicateAttributeDetector.prototype.endChoice = function() {
    this.alternatives = this.alternatives.parent;
}

exports.DuplicateAttributeDetector = DuplicateAttributeDetector;
},{"./OverlapDetector":54}],29:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;
var DuplicateAttributeDetector = require('./DuplicateAttributeDetector').DuplicateAttributeDetector;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;

function ElementPattern(nameClass, pattern, locator) {
    Pattern.call(this, false, this.ELEMENT_CONTENT_TYPE);
    this.nameClass = nameClass;
    this.origNameClass = nameClass;
    this.pattern = pattern;
    this.locator = locator;
    this.expanded = false;
    this.checkedRestrictions = false;
}

ElementPattern.prototype = Object.create(Pattern.prototype);

ElementPattern.prototype.checkRestrictions = function(context, dad, alpha) {
        if (alpha != null)
            alpha.addElement(this.origNameClass);
        if (this.checkedRestrictions)
            return;
        switch (context) {
            case this.DATA_EXCEPT_CONTEXT:
                throw new RestrictionViolationException("data_except_contains_element");
            case this.LIST_CONTEXT:
                throw new RestrictionViolationException("list_contains_element");
            case this.ATTRIBUTE_CONTEXT:
                throw new RestrictionViolationException("attribute_contains_element");
        }
        this.checkedRestrictions = true;
        try {
            this.pattern.checkRestrictions(this.ELEMENT_CONTEXT, new DuplicateAttributeDetector(), null);
        }
        catch (e) {
            if (e instanceof RestrictionViolationException) {
                this.checkedRestrictions = false;
                e.maybeSetLocator(this.locator);
            }
            throw e;
        }
}

ElementPattern.prototype.expand = function(patternBuilder) {
    if (!this.expanded) {
        this.expanded = true;
        this.pattern = this.pattern.expand(patternBuilder);
        if (this.pattern.isNotAllowed())
            this.nameClass = new NullNameClass();
    }
    return this;
}

ElementPattern.prototype.samePattern = function(other) {
    if (!(other instanceof ElementPattern))
        return false;
    // todo equality
    return this.nameClass === other.nameClass && this.pattern === other.pattern;
}

ElementPattern.prototype.checkRecursion = function(depth) {
    this.pattern.checkRecursion(depth + 1);
}

ElementPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseElement(this);
}

ElementPattern.prototype.setContent = function(pattern) {
    this.pattern = pattern;
}

ElementPattern.prototype.getContent = function() {
    return this.pattern;
}


ElementPattern.prototype.getNameClass = function() {
    return this.nameClass;
}

ElementPattern.prototype.getLocator = function() {
    return this.locator;
}

exports.ElementPattern = ElementPattern;
},{"./DuplicateAttributeDetector":28,"./Pattern":55,"./RestrictionViolationException":71}],30:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function EmptyPattern() {
    Pattern.call(this, true, this.EMPTY_CONTENT_TYPE, 'hash_code');
}

EmptyPattern.prototype = Object.create(Pattern.prototype);

EmptyPattern.prototype.samePattern = function(other) {
    return other instanceof EmptyPattern;
}

EmptyPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseEmpty(this);
}

EmptyPattern.prototype.checkRestrictions = function(context, dublicateAttributeDetector, alphabet) {
    switch (context) {
        case this.DATA_EXCEPT_CONTEXT:
            throw new Error('RestrictionViolationException("data_except_contains_empty")');
        case this.START_CONTEXT:
            throw new  Error('RestrictionViolationException("start_contains_empty")');
    }
}

exports.EmptyPattern = EmptyPattern;
},{"./Pattern":55}],31:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;

function EndAttributesFunction(builder) {
    this.builder = builder;
}

EndAttributesFunction.prototype = Object.create(AbstractPatternFunction.prototype);

EndAttributesFunction.prototype.caseOther = function(p) {
    return p;
}

EndAttributesFunction.prototype.caseGroup = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var q1 = this.memoApply(p1);
    var q2 = this.memoApply(p2);
    if (p1 === q1 && p2 === q2)
        return p;
    return this.builder.makeGroup(q1, q2);
}

EndAttributesFunction.prototype.caseInterleave = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var q1 = this.memoApply(p1);
    var q2 = this.memoApply(p2);
    if (p1 === q1 && p2 === q2)
        return p;
    return this.builder.makeInterleave(q1, q2);
}

EndAttributesFunction.prototype.caseChoice = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var q1 = this.memoApply(p1);
    var q2 = this.memoApply(p2);
    if (p1 === q1 && p2 === q2)
        return p;
    return this.builder.makeChoice(q1, q2);
}

EndAttributesFunction.prototype.caseOneOrMore = function(p) {
    var p1 = p.getOperand();
    var q1 = this.memoApply(p1);
    if (p1 === q1)
        return p;
    return this.builder.makeOneOrMore(q1);
}

EndAttributesFunction.prototype.caseAfter = function(p) {
    var p1 = p.getOperand1();
    var q1 = this.memoApply(p1);
    if (p1 === q1)
        return p;
    return this.builder.makeAfter(q1, p.getOperand2());
}

EndAttributesFunction.prototype.caseAttribute = function(p) {
    return this.builder.makeNotAllowed();
}

EndAttributesFunction.prototype.memoApply = function(p) {
    return this.apply(this.builder.getPatternMemo(p)).getPattern();
}

EndAttributesFunction.prototype.apply = function(memo) {
    return memo.endAttributes(this);
}

EndAttributesFunction.prototype.getPatternBuilder = function(p) {
    return this.builder;
}

exports.EndAttributesFunction = EndAttributesFunction;
},{"./AbstractPatternFunction":2}],32:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;

/**
 *
 * @param {ValidatorPatternBuilder} builder
 * @constructor
 */
function EndTagDerivFunction(builder) {
    this.builder = builder;
}

EndTagDerivFunction.prototype = Object.create(AbstractPatternFunction.prototype);

EndTagDerivFunction.prototype.caseOther = function(pattern) {
    return this.builder.makeNotAllowed();
}

EndTagDerivFunction.prototype.caseChoice = function(pattern) {
    return this.builder.makeChoice(this.memoApply(pattern.getOperand1()),
            this.memoApply(pattern.getOperand2()));
}

EndTagDerivFunction.prototype.caseAfter = function(pattern) {
    if (pattern.getOperand1().isNullable())
        return pattern.getOperand2();
    else
        return this.builder.makeNotAllowed();
}

EndTagDerivFunction.prototype.memoApply = function(pattern) {
    return this.apply(this.builder.getPatternMemo(pattern)).getPattern();
}

EndTagDerivFunction.prototype.apply = function(memo) {
    return memo.endTagDeriv(this);
}

exports.EndTagDerivFunction = EndTagDerivFunction;
},{"./AbstractPatternFunction":2}],33:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;

function ErrorNameClass() {
    NameClass.call(this);
}

ErrorNameClass.prototype = Object.create(NameClass.prototype, {
    constructor: {value: ErrorNameClass}
});

ErrorNameClass.prototype.contains = function(name) {
    return false;
}

ErrorNameClass.prototype.containsSpecificity = function(name) {
    return this.SPECIFICITY_NONE;
}

ErrorNameClass.prototype.accept = function(visitor) {
    visitor.visitError();
}

ErrorNameClass.prototype.isOpen = function() {
    return false;
}

exports.ErrorNameClass = ErrorNameClass;
},{"./NameClass":43}],34:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function ErrorPattern() {
    Pattern.call(this, true, this.EMPTY_CONTENT_TYPE, 'hash_code');
}

ErrorPattern.prototype = Object.create(Pattern.prototype);

ErrorPattern.prototype.samePattern = function(other) {
    return other instanceof ErrorPattern;
}

ErrorPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseError(this);
}

exports.ErrorPattern = ErrorPattern;
},{"./Pattern":55}],35:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;
var VoidValue = require('./VoidValue').VoidValue;
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;

function FindElementFunction(builder, name) {
    this.builder = builder;
    this.name = name;
    this.processed = [];
    this.specificity = NameClass.SPECIFICITY_NONE;
    this.pattern = null;
}

FindElementFunction.findElement = function(builder, name, start) {
    var f = new FindElementFunction(builder, name);
    start.apply(f);
    if (f.pattern == null)
        return builder.makeNotAllowed();
    return f.pattern;
}

FindElementFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
    constructor: {value: FindElementFunction}
});


FindElementFunction.prototype.findElement = FindElementFunction.findElement;

FindElementFunction.prototype.haveProcessed = function(p) {
    if (this.processed.indexOf(p) > -1)
        return true;
    this.processed.push(p);
    return false;
}

FindElementFunction.prototype.caseBinary = function(p) {
    if (!this.haveProcessed(p)) {
        p.getOperand1().apply(this);
        p.getOperand2().apply(this);
    }
    return VoidValue.VOID;
}

FindElementFunction.prototype.caseGroup = function(p) {
    return this.caseBinary(p);
}

FindElementFunction.prototype.caseInterleave = function(p) {
    return this.caseBinary(p);
}

FindElementFunction.prototype.caseChoice = function(p) {
    return this.caseBinary(p);
}

FindElementFunction.prototype.caseOneOrMore = function(p) {
    if (!this.haveProcessed(p))
        p.getOperand().apply(this);
    return VoidValue.VOID;
}

FindElementFunction.prototype.caseElement = function(p) {
    if (!this.haveProcessed(p)) {
        var s = p.getNameClass().containsSpecificity(this.name);
        if (s > this.specificity) {
            this.specificity = s;
            this.pattern = p.getContent();
        }
        else if (s == this.specificity && s != NameClass.SPECIFICITY_NONE)
            this.pattern = this.builder.makeChoice(this.pattern, p.getContent());
        p.getContent().apply(this);
    }
    return VoidValue.VOID;
}

FindElementFunction.prototype.caseOther = function(p) {
    return VoidValue.VOID;
}

exports.FindElementFunction = FindElementFunction;
},{"./AbstractPatternFunction":2,"./NameClass":43,"./VoidValue":95}],36:[function(require,module,exports){
var BinaryPattern = require('./BinaryPattern').BinaryPattern;

/**
 *
 * @param {Pattern} p1
 * @param {Pattern} p2
 * @class
 * @extends BinaryPattern
 */
function GroupPattern(p1, p2) {
    BinaryPattern.call(this, p1.isNullable() && p2.isNullable(), p1, p2);
}

GroupPattern.prototype = Object.create(BinaryPattern.prototype,
    {constructor: {value: GroupPattern}});

GroupPattern.prototype.expand = function(b) {
    var ep1 = this.p1.expand(b);
    var ep2 = this.p2.expand(b);
    if (ep1 !== this.p1 || ep2 !== this.p2)
        return b.makeGroup(ep1, ep2);
    else
        return this;
}

GroupPattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_group");
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_group");
    }
    BinaryPattern.prototype.checkRestrictions.call(this, context == this.ELEMENT_REPEAT_CONTEXT
        ? this.ELEMENT_REPEAT_GROUP_CONTEXT
        : context,
        dad,
        alpha);
    if (context != this.LIST_CONTEXT
        && !this.contentTypeGroupable(this.p1.getContentType(), this.p2.getContentType()))
        throw new RestrictionViolationException("group_string");
}

GroupPattern.prototype.apply = function(f) {
    return f.caseGroup(this);
}

exports.GroupPattern = GroupPattern;
},{"./BinaryPattern":12}],37:[function(require,module,exports){
var EndAttributesFunction = require('./EndAttributesFunction').EndAttributesFunction;

function IgnoreMissingAttributesFunction(builder) {
    EndAttributesFunction.call(this, builder);
}

IgnoreMissingAttributesFunction.prototype = Object.create(EndAttributesFunction.prototype);

IgnoreMissingAttributesFunction.prototype.caseAttribute = function(pattern) {
    return this.getPatternBuilder().makeEmpty();
}

IgnoreMissingAttributesFunction.prototype.apply = function(memo) {
    return memo.ignoreMissingAttributes(this);
}

exports.IgnoreMissingAttributesFunction = IgnoreMissingAttributesFunction;
},{"./EndAttributesFunction":31}],38:[function(require,module,exports){
var DataDerivType = require('./DataDerivType').DataDerivType;

function InconsistentDataDerivType() {
    DataDerivType.call(this);
}

InconsistentDataDerivType.prototype = Object.create(DataDerivType.prototype, {
    constructor: {value: InconsistentDataDerivType}
});

InconsistentDataDerivType.instance = new InconsistentDataDerivType();

InconsistentDataDerivType.getInstance = function() {
    return this.instance;
};
InconsistentDataDerivType.prototype.combine = function(ddt) {
    return this;
};

InconsistentDataDerivType.prototype.copy = function() {
    return this;
};

exports.InconsistentDataDerivType = InconsistentDataDerivType;
},{"./DataDerivType":23}],39:[function(require,module,exports){
var BinaryPattern = require('./BinaryPattern').BinaryPattern;
var Alphabet = require('./Alphabet').Alphabet;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;
/**
 *
 * @param {Pattern} p1
 * @param {Pattern} p2
 * @class
 * @extends BinaryPattern
 */
function InterleavePattern(p1, p2) {
    BinaryPattern.call(this, p1.isNullable() && p2.isNullable(), p1, p2);
}

InterleavePattern.prototype = Object.create(BinaryPattern.prototype);

/**
 *
 * @param {SchemaPatternBuilder} b
 * @return {Pattern}
 */
InterleavePattern.prototype.expand = function(b) {
    var ep1 = this.p1.expand(b);
    var ep2 = this.p2.expand(b);
    if (ep1 != this.p1 || ep2 != this.p2)
        return b.makeInterleave(ep1, ep2);
    else
        return this;
}

/**
 *
 * @param {PatternFunction} f
 * @return {*}
 */
InterleavePattern.prototype.apply = function(f) {
    return f.caseInterleave(this);
}

/**
 *
 * @param {Integer} context
 * @param {DuplicateAttributeDetector} dad
 * @param {Alphabet} alpha
 */
InterleavePattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_interleave");
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_interleave");
        case this.LIST_CONTEXT:
            throw new RestrictionViolationException("list_contains_interleave");
    }
    if (context == this.ELEMENT_REPEAT_CONTEXT)
        context = this.ELEMENT_REPEAT_INTERLEAVE_CONTEXT;
    var a1;
    if (alpha != null && alpha.isEmpty())
        a1 = alpha;
    else
        a1 = new Alphabet();
    this.p1.checkRestrictions(context, dad, a1);
    if (a1.isEmpty())
        this.p2.checkRestrictions(context, dad, a1);
    else {
        var a2 = new Alphabet();
        this.p2.checkRestrictions(context, dad, a2);
        a1.checkOverlap(a2);
        if (alpha != null) {
            if (alpha != a1)
                alpha.addAlphabet(a1);
            alpha.addAlphabet(a2);
        }
    }
    if (!this.contentTypeGroupable(this.p1.getContentType(), this.p2.getContentType()))
        throw new RestrictionViolationException("interleave_string");
    if (this.p1.getContentType() == this.MIXED_CONTENT_TYPE
        && this.p2.getContentType() == this.MIXED_CONTENT_TYPE)
        throw new RestrictionViolationException("interleave_text_overlap");
}

exports.InterleavePattern = InterleavePattern;
},{"./Alphabet":4,"./BinaryPattern":12,"./RestrictionViolationException":71}],40:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;

function ListPattern(p, locator) {
    Pattern.call(this, false, this.DATA_CONTENT_TYPE);
    this.p = p;
    this.locator = locator;
}

ListPattern.prototype = Object.create(Pattern.prototype, {
    constructor: {value: ListPattern}
});

ListPattern.prototype.expand = function(b) {
    var ep = this.p.expand(b);
    if (ep != this.p)
        return b.makeList(ep, this.locator);
    else
        return this;
};

ListPattern.prototype.checkRecursion = function(depth) {
    this.p.checkRecursion(depth);
};

ListPattern.prototype.samePattern = function(other) {
    return (other instanceof ListPattern
        && this.p == other.p);
};

ListPattern.prototype.apply = function(f) {
    return f.caseList(this);
};

ListPattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_list");
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_list");
        case this.LIST_CONTEXT:
            throw new RestrictionViolationException("list_contains_list");
    }
    try {
        this.p.checkRestrictions(this.LIST_CONTEXT, dad, null);
    }
    catch (e) {
        if (e instanceof RestrictionViolationException)
            e.maybeSetLocator(this.locator);
        throw e;
    }
};

ListPattern.prototype.getOperand = function() {
    return this.p;
};

exports.ListPattern = ListPattern;
},{"./Pattern":55,"./RestrictionViolationException":71}],41:[function(require,module,exports){
var messages = require('./resources/messages.json');

function format(text, args) {
	return text.replace(/{([0-9]+)}/g, function(match, index) {
		return args[index];
	});
}

function Localizer() {

}

Localizer.prototype.message = function(key, args) {
    if (!Array.isArray(args))
        args = Array.prototype.slice.call(arguments, 1);
    var message = messages[key];
    return format(message, args);
}

exports.Localizer = Localizer;
},{"./resources/messages.json":170}],42:[function(require,module,exports){
var EndAttributesFunction = require('./EndAttributesFunction').EndAttributesFunction;

/**
 *
 * @param {ValidatorPatternBuilder} builder
 * @class
 * @extends {EndAttributesFunction}
 */
function MixedTextDerivFunction(builder) {
    EndAttributesFunction.call(this, builder);
}

MixedTextDerivFunction.prototype = Object.create(EndAttributesFunction.prototype);

MixedTextDerivFunction.prototype.caseText = function(p) {
    return p;
}

MixedTextDerivFunction.prototype.caseGroup = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var q1 = this.memoApply(p1);
    var tem = (q1 === p1) ? p : this.getPatternBuilder().makeGroup(q1, p2);
    if (!p1.isNullable())
        return tem;
    return this.getPatternBuilder().makeChoice(tem, this.memoApply(p2));
}

MixedTextDerivFunction.prototype.caseInterleave = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var q1 = this.memoApply(p1);
    var q2 = this.memoApply(p2);
    var i1 = (q1 === p1) ? p : this.getPatternBuilder().makeInterleave(q1, p2);
    var i2 = (q2 === p2) ? p : this.getPatternBuilder().makeInterleave(p1, q2);
    return this.getPatternBuilder().makeChoice(i1, i2);
}

MixedTextDerivFunction.prototype.caseOneOrMore = function(p) {
    return this.getPatternBuilder().makeGroup(this.memoApply(p.getOperand()),
        this.getPatternBuilder().makeOptional(p));
}

MixedTextDerivFunction.prototype.caseOther = function(p) {
    return this.getPatternBuilder().makeNotAllowed();
}

MixedTextDerivFunction.prototype.apply = function(memo) {
    return memo.mixedTextDeriv(this);
}

exports.MixedTextDerivFunction = MixedTextDerivFunction;
},{"./EndAttributesFunction":31}],43:[function(require,module,exports){
/**
 *
 * @interface
 */
function NameClass() {}

NameClass.SPECIFICITY_NONE = -1;
NameClass.SPECIFICITY_ANY_NAME = 0;
NameClass.SPECIFICITY_NS_NAME = 1;
NameClass.SPECIFICITY_NAME = 2;
NameClass.prototype.contains = function(name) {}
NameClass.prototype.containsSpecificity = function(name) {}
NameClass.prototype.accept = function(visitor) {}
NameClass.prototype.isOpen = function() {}

NameClass.prototype.SPECIFICITY_NONE = NameClass.SPECIFICITY_NONE;
NameClass.prototype.SPECIFICITY_ANY_NAME = NameClass.SPECIFICITY_ANY_NAME;
NameClass.prototype.SPECIFICITY_NS_NAME = NameClass.SPECIFICITY_NS_NAME;
NameClass.prototype.SPECIFICITY_NAME = NameClass.SPECIFICITY_NAME;

exports.NameClass = NameClass;
},{}],44:[function(require,module,exports){
var AbstractNameClassNormalizer = require('./AbstractNameClassNormalizer').AbstractNameClassNormalizer;

function NameClassNormalizer(nameClass) {
    this.nameClass = nameClass;
}

NameClassNormalizer.prototype = Object.create(AbstractNameClassNormalizer.prototype, {
    constructor: {value: NameClassNormalizer}
});

NameClassNormalizer.prototype.contains = function(name) {
    return this.nameClass.contains(name);
};

NameClassNormalizer.prototype.accept = function(visitor) {
    this.nameClass.accept(visitor);
};

NameClassNormalizer.prototype.getNameClass = function() {
    return this.nameClass;
};

NameClassNormalizer.prototype.setNameClass = function(nameClass) {
    this.nameClass = nameClass;
};

exports.NameClassNormalizer = NameClassNormalizer;
},{"./AbstractNameClassNormalizer":1}],45:[function(require,module,exports){
function NameClassVisitor() {}

NameClassVisitor.prototype.visitChoice = function(nc1, nc2) {}
NameClassVisitor.prototype.visitNsName = function(ns) {}
NameClassVisitor.prototype.visitNsNameExcept = function(ns, nc) {}
NameClassVisitor.prototype.visitAnyName = function() {}
NameClassVisitor.prototype.visitAnyNameExcept = function(nc) {}
NameClassVisitor.prototype.visitName = function(name) {}
NameClassVisitor.prototype.visitNull = function() {}
NameClassVisitor.prototype.visitError = function() {}

exports.NameClassVisitor = NameClassVisitor;
},{}],46:[function(require,module,exports){
var SchemaBuilderImpl = require('./SchemaBuilderImpl').SchemaBuilderImpl;

function NameFormatter() {}

NameFormatter.format = function(name) {
    var localName = name.getLocalName();
    var namespaceUri = name.getNamespaceUri();
    if (namespaceUri === "")
        return SchemaBuilderImpl.localizer.message("name_absent_namespace", localName);
    else
        return SchemaBuilderImpl.localizer.message("name_with_namespace", namespaceUri, localName);
};

exports.NameFormatter = NameFormatter;
},{"./SchemaBuilderImpl":76}],47:[function(require,module,exports){
/**
 * Create a NormalizedNameClass representing a name class without any wildcards.
 * @param includedNames an immutable set of names
 */
function NormalizedNameClass(includedNames) {
    this.includedNames = includedNames;
}

NormalizedNameClass.prototype.isEmpty = function() {
    return this.includedNames.length == 0;
};

NormalizedNameClass.prototype.contains = function(name) {
    return this.includedNames.indexOf(name) > -1;
};

NormalizedNameClass.prototype.isAnyNameIncluded = function() {
    return false;
};

NormalizedNameClass.prototype.getExcludedNamespaces = function() {
    return null;
};

NormalizedNameClass.prototype.getIncludedNames = function() {
    return this.includedNames;
};

NormalizedNameClass.prototype.getExcludedNames = function() {
    return null;
};

NormalizedNameClass.prototype.getIncludedNamespaces = function() {
    return [];
};

NormalizedNameClass.prototype.getExcludedLocalNames = function(ns) {
    return null;
};

NormalizedNameClass.prototype.equals = function(obj) {};

NormalizedNameClass.prototype.equal = function(nc1, nc2) {
    return (nc1.includedNames.length == nc2.includedNames.length
            && nc1.includedNames.every(function(item, index){
                return nc2.includedNames[index] === item;
            }));
};

NormalizedNameClass.prototype.immutable = function(set) {
    // todo Collections.unmodifiableSet(set);
    return set;
};

NormalizedNameClass.prototype.includesNamespace = function(ns) {};


exports.NormalizedNameClass = NormalizedNameClass;
},{}],48:[function(require,module,exports){
var NormalizedNameClass = require('./NormalizedNameClass').NormalizedNameClass;

function NormalizedNsNameClass(includedNames, nsMap) {
    NormalizedNameClass.call(this, includedNames);
    this.nsMap = nsMap;
    this.includedNamespaces = this.immutable(Object.keys(nsMap));
}

NormalizedNsNameClass.prototype = Object.create(NormalizedNameClass.prototype, {
    constructor: {value: NormalizedNsNameClass}
});

NormalizedNsNameClass.prototype.isEmpty = function() {
    return NormalizedNameClass.prototype.isEmpty.call(this) && this.nsMap.length == 0;
};

NormalizedNsNameClass.prototype.contains = function(name) {
    var excludedLocalNames = this.nsMap[name.getNamespaceUri()];
    if (excludedLocalNames == null)
        return NormalizedNameClass.prototype.contains.call(this, name);
    else
        return !(excludedLocalNames.indexOf(name.getLocalName()) > -1);
};

NormalizedNsNameClass.prototype.getIncludedNamespaces = function() {
    return this.includedNamespaces;
};

NormalizedNsNameClass.prototype.getExcludedLocalNames = function(ns) {
    return this.nsMap[ns];
};

NormalizedNsNameClass.prototype.equals = function(obj) {
    if (!(obj instanceof NormalizedNsNameClass))
        return false;
    var other = /**NormalizedNsNameClass*/ obj;
    // todo nsMap item equality
    if (this.nsMap.length !== other.nsMap.length || !this.nsMap.every(function(item, index){
            return other.nsMap[index] === item;
        }))
        return false;
    return this.equal(this, other);
};

NormalizedNsNameClass.prototype.includesNamespace = function(ns) {
    return this.getIncludedNamespaces().contains(ns);
};

exports.NormalizedNsNameClass = NormalizedNsNameClass;
},{"./NormalizedNameClass":47}],49:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function NotAllowedPattern() {
    Pattern.call(this, false, this.EMPTY_CONTENT_TYPE, 'hash_code');
}

NotAllowedPattern.prototype = Object.create(Pattern.prototype);

NotAllowedPattern.prototype.isNotAllowed = function() {
    return true;
}

NotAllowedPattern.prototype.samePattern = function(other) {
    // needs to work for UnexpandedNotAllowedPattern
    return other.constructor.name == this.constructor.name;
}

NotAllowedPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseNotAllowed(this);
}

exports.NotAllowedPattern = NotAllowedPattern;
},{"./Pattern":55}],50:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;

function NsNameClass(namespaceUri) {
    this.namespaceUri = namespaceUri;
}

NsNameClass.prototype = Object.create(NameClass.prototype, {
    constructor: {value: NsNameClass}
});

NsNameClass.prototype.contains = function(name) {
    return this.namespaceUri === name.getNamespaceUri();
};

NsNameClass.prototype.containsSpecificity = function(name) {
    return this.contains(name) ? this.SPECIFICITY_NS_NAME : this.SPECIFICITY_NONE;
};

NsNameClass.prototype.equals = function(obj) {
    if (obj == null || !(obj instanceof NsNameClass))
        return false;
    return this.namespaceUri === obj.namespaceUri;
};

NsNameClass.prototype.accept = function(visitor) {
    visitor.visitNsName(this.namespaceUri);
};

NsNameClass.prototype.isOpen = function() {
    return true;
};

NsNameClass.prototype.getNamespaceUri = function() {
    return this.namespaceUri;
};

exports.NsNameClass = NsNameClass;
},{"./NameClass":43}],51:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;

function NsNameExceptNameClass(namespaceUri, nameClass) {
    this.namespaceUri = namespaceUri;
    this.nameClass = nameClass;
}

NsNameExceptNameClass.prototype = Object.create(NameClass.prototype, {
    constructor: {value: NsNameExceptNameClass}
});

NsNameExceptNameClass.prototype.contains = function(name) {
    return (this.namespaceUri === name.getNamespaceUri()
        && !this.nameClass.contains(name));
};

NsNameExceptNameClass.prototype.containsSpecificity = function(name) {
    return this.contains(name) ? this.SPECIFICITY_NS_NAME : this.SPECIFICITY_NONE;
};

NsNameExceptNameClass.prototype.equals = function(obj) {
    if (obj == null || !(obj instanceof NsNameExceptNameClass))
        return false;
    return (this.namespaceUri === obj.namespaceUri
        && this.nameClass.equals(obj.nameClass));
};

NsNameExceptNameClass.prototype.accept = function(visitor) {
    visitor.visitNsNameExcept(this.namespaceURI, this.nameClass);
};

NsNameExceptNameClass.prototype.isOpen = function() {
    return true;
};

exports.NsNameExceptNameClass = NsNameExceptNameClass;
},{"./NameClass":43}],52:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;

/**
 *
 * @class
 * @implements NameClass
 */
function NullNameClass() {
    NameClass.call(this);
}

NullNameClass.prototype = Object.create(NameClass.prototype, {
    constructor: {value: NullNameClass}
});

NullNameClass.prototype.contains = function(name) {
    return false;
};

NullNameClass.prototype.containsSpecificity = function(name) {
    return this.SPECIFICITY_NONE;
};

NullNameClass.prototype.equals = function(obj) {
    if (obj == null || !(obj instanceof NullNameClass))
        return false;
    return true;
};

NullNameClass.prototype.accept = function(visitor) {
    visitor.visitNull();
};

NullNameClass.prototype.isOpen = function() {
    return false;
};

exports.NullNameClass = NullNameClass;
},{"./NameClass":43}],53:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

/**
 *
 * @param {Pattern} p
 * @class
 * @extends Pattern
 */
function OneOrMorePattern(p) {
    Pattern.call(this, p.isNullable(), p.getContentType());
    this.p = p;
}

OneOrMorePattern.prototype = Object.create(Pattern.prototype);

OneOrMorePattern.prototype.expand = function(b) {
    var ep = this.p.expand(b);
    if (ep !== this.p)
        return b.makeOneOrMore(ep);
    else
        return this;
}

OneOrMorePattern.prototype.checkRecursion = function(depth) {
    this.p.checkRecursion(depth);
}

OneOrMorePattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_one_or_more");
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_one_or_more");
    }

    this.p.checkRestrictions(context === this.ELEMENT_CONTEXT
        ? this.ELEMENT_REPEAT_CONTEXT
        : context,
        dad,
        alpha);
    if (context !== this.LIST_CONTEXT
        && !this.contentTypeGroupable(this.p.getContentType(), this.p.getContentType()))
        throw new RestrictionViolationException("one_or_more_string");
}

OneOrMorePattern.prototype.samePattern = function(other) {
    return (other instanceof OneOrMorePattern
        && this.p === other.p);
}

OneOrMorePattern.prototype.apply = function(f) {
    return f.caseOneOrMore(this);
}

OneOrMorePattern.prototype.getOperand = function() {
    return this.p;
}

exports.OneOrMorePattern = OneOrMorePattern;

},{"./Pattern":55}],54:[function(require,module,exports){
var Name = require('./xml/util/Name').Name;
var SimpleNameClass = require('./SimpleNameClass').SimpleNameClass;

function OverlapDetector(nc1, nc2) {
    this.overlapExample = null;
    this.nc1 = nc1;
    this.nc2 = nc2;
    nc1.accept(this);
    nc2.accept(this);
}

OverlapDetector.IMPOSSIBLE = "\u0000";

OverlapDetector.prototype.IMPOSSIBLE = OverlapDetector.IMPOSSIBLE;

OverlapDetector.prototype.probe = function(name) {
    if (this.nc1.contains(name) && this.nc2.contains(name))
        this.overlapExample = name;
}

OverlapDetector.prototype.visitChoice = function(nc1, nc2) {
    nc1.accept(this);
    nc2.accept(this);
}

OverlapDetector.prototype.visitNsName = function(ns) {
    this.probe(new Name(ns, this.IMPOSSIBLE));
}

OverlapDetector.prototype.visitNsNameExcept = function(ns, ex) {
    this.probe(new Name(ns, this.IMPOSSIBLE));
    ex.accept(this);
}

OverlapDetector.prototype.visitAnyName = function() {
    this.probe(new Name(this.IMPOSSIBLE, this.IMPOSSIBLE));
}

OverlapDetector.prototype.visitAnyNameExcept = function(ex) {
    this.probe(new Name(this.IMPOSSIBLE, this.IMPOSSIBLE));
    ex.accept(this);
}

OverlapDetector.prototype.visitName = function(name) {
    this.probe(name);
}

OverlapDetector.prototype.visitNull = function() {

}

OverlapDetector.prototype.visitError = function() {

}

OverlapDetector.checkOverlap = OverlapDetector.prototype.checkOverlap = function(nc1, nc2, messageForName, messageForNs, messageForOther) {
    if (nc2 instanceof SimpleNameClass) {
        var snc = /**SimpleNameClass*/ nc2;
        if (nc1.contains(snc.getName()))
            throw new RestrictionViolationException(messageForName, snc.getName());
    }
    else if (nc1 instanceof SimpleNameClass) {
        var snc = /**SimpleNameClass*/ nc1;
        if (nc2.contains(snc.getName()))
            throw new RestrictionViolationException(messageForName, snc.getName());
    }
    else {
        var name = new OverlapDetector(nc1, nc2).overlapExample;
        if (name != null) {
            var localName = name.getLocalName();
            if (localName == this.IMPOSSIBLE) {
                var ns = name.getNamespaceUri();
                if (ns == this.IMPOSSIBLE)
                    throw new RestrictionViolationException(messageForOther);
                else
                    throw new RestrictionViolationException(messageForNs, ns);
            }
            else
                throw new RestrictionViolationException(messageForName, name);
        }
    }
}

exports.OverlapDetector = OverlapDetector;
},{"./SimpleNameClass":79,"./xml/util/Name":176}],55:[function(require,module,exports){
function Pattern(nullable, contentType) {
    if (arguments.length > 0) {
        this.nullable = nullable;
        this.contentType = contentType;
    } else {
        this.nullable = false;
        this.contentType = this.EMPTY_CONTENT_TYPE;
    }
}

Pattern.EMPTY_CONTENT_TYPE = 0;
Pattern.ELEMENT_CONTENT_TYPE = 1;
Pattern.MIXED_CONTENT_TYPE = 2;
Pattern.DATA_CONTENT_TYPE = 3;

Pattern.START_CONTEXT = 0;
Pattern.ELEMENT_CONTEXT = 1;
Pattern.ELEMENT_REPEAT_CONTEXT = 2;
Pattern.ELEMENT_REPEAT_GROUP_CONTEXT = 3;
Pattern.ELEMENT_REPEAT_INTERLEAVE_CONTEXT = 4;
Pattern.ATTRIBUTE_CONTEXT = 5;
Pattern.LIST_CONTEXT = 6;
Pattern.DATA_EXCEPT_CONTEXT = 7;


Pattern.prototype.checkRecursion = function(depth) {}

Pattern.prototype.expand = function(patternBuilder) {
    return this;
}

Pattern.prototype.isNullable = function() {
    return this.nullable;
}

Pattern.prototype.isNotAllowed = function() {
    return false;
}

Pattern.prototype.checkRestrictions = function(context, dublicateAttributeDetector, alphabet) {}

Pattern.prototype.samePattern = function(pattern) {/*abstract*/}

Pattern.prototype.getContentType = function() {
    return this.contentType;
}

Pattern.prototype.containsChoice = function(p) {
    return this == p;
}

Pattern.prototype.apply = function(patternFunction) {/*abstract*/}

Pattern.prototype.contentTypeGroupable = function(contentType1, contentType2) {
    if (contentType1 == this.EMPTY_CONTENT_TYPE || contentType2 == this.EMPTY_CONTENT_TYPE)
        return true;
    if (contentType1 == this.DATA_CONTENT_TYPE || contentType2 == this.DATA_CONTENT_TYPE)
        return false;
    return true;
}

Pattern.prototype.EMPTY_CONTENT_TYPE = Pattern.EMPTY_CONTENT_TYPE;
Pattern.prototype.ELEMENT_CONTENT_TYPE = Pattern.ELEMENT_CONTENT_TYPE;
Pattern.prototype.MIXED_CONTENT_TYPE = Pattern.MIXED_CONTENT_TYPE;
Pattern.prototype.DATA_CONTENT_TYPE = Pattern.DATA_CONTENT_TYPE;

Pattern.prototype.START_CONTEXT = Pattern.START_CONTEXT;
Pattern.prototype.ELEMENT_CONTEXT = Pattern.ELEMENT_CONTEXT;
Pattern.prototype.ELEMENT_REPEAT_CONTEXT = Pattern.ELEMENT_REPEAT_CONTEXT;
Pattern.prototype.ELEMENT_REPEAT_GROUP_CONTEXT = Pattern.ELEMENT_REPEAT_GROUP_CONTEXT;
Pattern.prototype.ELEMENT_REPEAT_INTERLEAVE_CONTEXT = Pattern.ELEMENT_REPEAT_INTERLEAVE_CONTEXT;
Pattern.prototype.ATTRIBUTE_CONTEXT = Pattern.ATTRIBUTE_CONTEXT;
Pattern.prototype.LIST_CONTEXT = Pattern.LIST_CONTEXT;
Pattern.prototype.DATA_EXCEPT_CONTEXT = Pattern.DATA_EXCEPT_CONTEXT;

exports.Pattern = Pattern;
},{}],56:[function(require,module,exports){
var EmptyPattern = require('./EmptyPattern').EmptyPattern;
var NotAllowedPattern = require('./NotAllowedPattern').NotAllowedPattern;
var OneOrMorePattern = require('./OneOrMorePattern').OneOrMorePattern;
var ChoicePattern = require('./ChoicePattern').ChoicePattern;
var GroupPattern = require('./GroupPattern').GroupPattern;
var InterleavePattern = require('./InterleavePattern').InterleavePattern;
var PatternInterner = require('./PatternInterner').PatternInterner;

/**
 * @param {PatternBuilder} [parent]
 * @constructor
 */
function PatternBuilder(parent) {
    if (parent) {
        this.empty = parent.empty;
        this.notAllowed = parent.notAllowed;
        this.interner = new PatternInterner(parent.interner);
    } else {
        this.empty = new EmptyPattern();
        this.notAllowed = new NotAllowedPattern();
        this.interner = new PatternInterner();
    }
}

/**
 @return Pattern
 */
PatternBuilder.prototype.makeEmpty = function() {
    return this.empty;
}

/**
 @return Pattern
 */
PatternBuilder.prototype.makeNotAllowed = function() {
    return this.notAllowed;
}

/**
 @param {Pattern} pattern1
 @param {Pattern} pattern2
 @return Pattern
 */
PatternBuilder.prototype.makeGroup = function(pattern1, pattern2) {
    if (pattern1 == this.empty)
        return pattern2;
    if (pattern2 == this.empty)
        return pattern1;
    if (pattern1 == this.notAllowed || pattern2 == this.notAllowed)
        return this.notAllowed;
//    if (false && p1 instanceof GroupPattern)
    var pattern = new GroupPattern(pattern1, pattern2);
    return this.interner.intern(pattern);
}

/**
 @param {Pattern} pattern1
 @param {Pattern} pattern2
 @return Pattern
 */
PatternBuilder.prototype.makeInterleave = function(pattern1, pattern2) {
    if (pattern1 == this.empty)
        return pattern2;
    if (pattern2 == this.empty)
        return pattern1;
    if (pattern1 == this.notAllowed || pattern2 == this.notAllowed)
        return this.notAllowed;
    //
    var pattern = new InterleavePattern(pattern1, pattern2);
    return this.interner.intern(pattern);
}

PatternBuilder.prototype.makeChoice = function(pattern1, pattern2) {
    if (pattern1 == this.empty && pattern2.isNullable())
        return pattern2;
    if (pattern2 == this.empty && pattern1.isNullable())
        return pattern1;
    var pattern = new ChoicePattern(pattern1, pattern2);
    return this.interner.intern(pattern);
}

PatternBuilder.prototype.makeOneOrMore = function(pattern) {
    if (pattern == this.empty || pattern == this.notAllowed || pattern instanceof  OneOrMorePattern)
        return pattern;
    pattern = new OneOrMorePattern(pattern);
    return this.interner.intern(pattern);
}

PatternBuilder.prototype.makeOptional = function(pattern) {
    return this.makeChoice(pattern, this.empty);
}

PatternBuilder.prototype.makeZeroOrMore = function(pattern) {
    return this.makeOptional(this.makeOneOrMore(pattern));
}

exports.PatternBuilder = PatternBuilder;
},{"./ChoicePattern":18,"./EmptyPattern":30,"./GroupPattern":36,"./InterleavePattern":39,"./NotAllowedPattern":49,"./OneOrMorePattern":53,"./PatternInterner":57}],57:[function(require,module,exports){
function PatternInterner(parent) {
    if (parent != null) {
        this.table = parent.table;
        if (this.table != null)
            this.table = this.table.clone();
        this.used = parent.used;
        this.usedLimit = parent.usedLimit;
    } else {
        this.table = null;
        this.used = 0;
        this.usedLimit = 0;
    }
}

PatternInterner.prototype.intern = function(pattern) {
    return pattern;
}

exports.PatternInterner = PatternInterner;
},{}],58:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;
var SchemaBuilder = require('./SchemaBuilderImpl').SchemaBuilderImpl;
var FindElementFunction = require('./FindElementFunction').FindElementFunction;
var DataDerivFunction = require('./DataDerivFunction').DataDerivFunction;
var Name = require('./xml/util/Name').Name;
var PatternMemo = require('./PatternMemo').PatternMemo;

function Shared(start, builder) {
    this.start = start;
    this.builder = builder;
    this.recoverPatternTable = null;
}

Shared.prototype.findElement = function(name) {
    if (this.recoverPatternTable === null)
        this.recoverPatternTable = new Array(); // todo hashmap
    var p = null; //this.recoverPatternTable.get(name);
    if (p === null) {
        p = FindElementFunction.findElement(this.builder, name, this.start);
        // this.recoverPatternTable.set(name ,p);
    }
    return p;
}
/**
 *
 * @param {Pattern} start
 * @param {ValidatorPatternBuilder} builder
 * @class
 * @implements Matcher
 */
function PatternMatcher(start, builder) {
    if (start instanceof PatternMemo) {
        this.memo = start;
        this.shared = builder;
    } else {
        this.memo = builder.getPatternMemo(start);
        this.shared = new Shared(start, builder);
    }
    this.textTyped = false;
    this.hadError = false;
    this.ignoreNextEndTagOrAttributeValue = false;
    this.errorMessage = null;
    this.dataDerivFailureList = [];
}

PatternMatcher.prototype.start = function() {
    return new PatternMatcher(this.shared.builder.getPatternMemo(this.shared.start), this.shared);
};

PatternMatcher.FORMAT_NAMES_ELEMENT = 0x0;
PatternMatcher.FORMAT_NAMES_ATTRIBUTE = 0x1;
PatternMatcher.FORMAT_NAMES_AND = 0x0;
PatternMatcher.FORMAT_NAMES_OR = 0x2;

PatternMatcher.prototype.FORMAT_NAMES_ELEMENT = PatternMatcher.FORMAT_NAMES_ELEMENT;
PatternMatcher.prototype.FORMAT_NAMES_ATTRIBUTE = PatternMatcher.FORMAT_NAMES_ATTRIBUTE;
PatternMatcher.prototype.FORMAT_NAMES_AND = PatternMatcher.FORMAT_NAMES_AND;
PatternMatcher.prototype.FORMAT_NAMES_OR = PatternMatcher.FORMAT_NAMES_OR;

PatternMatcher.prototype.matchStartDocument = function() {
    if (this.memo.isNotAllowed())
        return this.error("schema_allows_nothing");
    return true;
}

PatternMatcher.prototype.matchEndDocument = function() {
    // XXX maybe check that memo.isNullable if !hadError
    return true;
}

/**
 *
 * @param {Name} name
 * @param {String} qName
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchStartTagOpen = function(name, qName, context) {
    if (this.setMemo(this.memo.startTagOpenDeriv(name)))
        return true;
    var next = this.memo.startTagOpenRecoverDeriv(name);
    var ok = this.ignoreError();
    if (!next.isNotAllowed()) {
        if (!ok) {
            var missing = this.requiredElementNames();
            if (missing.length === 0)
                this.error(missing.length === 1
                    ? "unexpected_element_required_element_missing"
                    : "unexpected_element_required_elements_missing",
                    this.errorArgQName(qName, name, context, false),
                    this.formatNames(missing, this.FORMAT_NAMES_ELEMENT|this.FORMAT_NAMES_AND, context));
            else
                this.error("element_not_allowed_yet",
                    this.errorArgQName(qName, name, context, false),
                    this.expectedContent(context));
        }
    }
    else {
        var builder = this.shared.builder;
        next = builder.getPatternMemo(builder.makeAfter(this.shared.findElement(name), this.memo.getPattern()));
        if (!ok)
            this.error(next.isNotAllowed() ? "unknown_element" : "out_of_context_element",
                this.errorArgQName(qName, name, context, false),
                this.expectedContent(context));
    }
    this.memo = next;
    return ok;
}

PatternMatcher.prototype.matchAttributeName = function(name, qName, context) {
    if (this.setMemo(this.memo.startAttributeDeriv(name)))
        return true;
    this.ignoreNextEndTagOrAttributeValue = true;
    var ok = this.ignoreError();
    if (ok)
        return true;
    qName = this.errorArgQName(qName, name, context, true);
    var nnc = this.memo.possibleAttributeNames();
    if (nnc.isEmpty())
        this.error("no_attributes_allowed", qName);
    else
        this.error("invalid_attribute_name", qName, this.expectedAttributes(context));
    return false;
}

PatternMatcher.prototype.matchAttributeValue = function(value, name, qName, context) {
    if (this.ignoreNextEndTagOrAttributeValue) {
        this.ignoreNextEndTagOrAttributeValue = false;
        return true;
    }
    this.dataDerivFailureList.length = 0;
    if (this.setMemo(this.memo.dataDeriv(value, context, this.dataDerivFailureList)))
        return true;
    var ok = this.error("invalid_attribute_value", this.errorArgQName(qName, name, context, true),
        this.formatDataDerivFailures(value, context));
    this.memo = this.memo.recoverAfter();
    return ok;
}

/**
 *
 * @param {Name} name
 * @param {String} qName
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchStartTagClose = function(name, qName, context) {
    var ok;
    if (this.setMemo(this.memo.endAttributes()))
        ok = true;
    else {
        ok = this.ignoreError();
        if (!ok) {
            var missing = this.requiredAttributeNames();
            if (missing.length === 0)
                this.error("required_attributes_missing_expected",
                    this.errorArgQName(qName, name, context, false),
                    this.expectedAttributes(context));
            else
                this.error(missing.length === 1 ? "required_attribute_missing" : "required_attributes_missing",
                    this.errorArgQName(qName, name, context, false),
                    this.formatNames(missing, this.FORMAT_NAMES_ATTRIBUTE|this.FORMAT_NAMES_AND, context));
        }
        this.memo = this.memo.ignoreMissingAttributes();
    }
    this.textTyped = this.memo.getPattern().getContentType() == Pattern.DATA_CONTENT_TYPE;
    return ok;
}

/**
 *
 * @param {String} string
 * @param {Name} name
 * @param {String} qName
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchTextBeforeEndTag = function(string, name, qName, context) {
    if (this.textTyped) {
        this.ignoreNextEndTagOrAttributeValue = true;
        return this.setDataDeriv(string, name, qName, context);
    }
    else
        return this.matchUntypedText(string, context);
}

/**
 *
 * @param {String} string
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchTextBeforeStartTag = function(string, context) {
    return this.matchUntypedText(string, context);
}

/**
 *
 * @param {String} string
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchUntypedText = function(string, context) {
    if (DataDerivFunction.isBlank(string))
        return true;
    if (this.setMemo(this.memo.mixedTextDeriv()))
        return true;
    return this.error("text_not_allowed", this.expectedContent(context));
}

/**
 *
 * @return {Boolean}
 */
PatternMatcher.prototype.isTextTyped = function() {
    return this.textTyped;
}

/**
 *
 * @param {String} string
 * @param {Name} name
 * @param {String} qName
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.setDataDeriv = function(string, name, qName, context) {
    this.textTyped = false;
    var textOnlyMemo = this.memo.textOnly();
    this.dataDerivFailureList.length = 0;
    if (this.setMemo(textOnlyMemo.dataDeriv(string, context, this.dataDerivFailureList)))
        return true;
    var next = this.memo.recoverAfter();
    var ok = this.ignoreError();
    if (!ok && (!next.isNotAllowed()
                || textOnlyMemo.emptyAfter().dataDeriv(string, context).isNotAllowed())) {
        var nnc = this.memo.possibleStartTagNames();
        if (!nnc.isEmpty() && DataDerivFunction.isBlang(string))
            this.error("blank_not_allowed",
                this.errorArgQName(qName, name, context, false),
                this.expectedContent(context));
        else
            this.error("invalid_element_value", this.errorArgQName(qName, name, context, false),
                this.formatDataDerivFailures(string, context));
    }
    this.memo = next;
    return ok;
}

/**
 *
 * @param {Name} name
 * @param {String} qName
 * @param {MatchContext} context
 * @return {Boolean}
 */
PatternMatcher.prototype.matchEndTag = function(name, qName, context) {
    if (this.ignoreNextEndTagOrAttributeValue) {
        this.ignoreNextEndTagOrAttributeValue = false;
        return true;
    }
    if (this.textTyped)
        return this.setDataDeriv("", name, qName, context);
    if (this.setMemo(this.memo.endTagDeriv()))
        return true;
    var ok = this.ignoreError();
    var next = this.memo.recoverAfter();
    // The tricky thing here is that the derivative that we compute may be notAllowed simply because the parent
    // is notAllowed; we don't want to give an error in this case.
    if (!ok && (!next.isNotAllowed()
        // Retry computing the deriv on a pattern where the after is OK (not notAllowed)
        || this.memo.emptyAfter().endTagDeriv().isNotAllowed())) {
        var missing = this.requiredElementNames();
        if (missing.length > 0)
            this.error(missing.length === 1
                ? "incomplete_element_required_element_missing"
                : "incomplete_element_required_elements_missing",
                this.errorArgQName(qName, name, context, false),
                this.formatNames(missing, this.FORMAT_NAMES_ELEMENT|this.FORMAT_NAMES_AND, context));
        else
        // XXX  Could do better here and describe what is required instead of what is possible
            this.error("incomplete_element_required_elements_missing_expected",
                this.errorArgQName(qName, name, context, false),
                this.expectedContent(context));
    }
    this.memo = next;
    return ok;
}

PatternMatcher.prototype.getErrorMessage = function() {
    return this.errorMessage;
}

PatternMatcher.prototype.isValidSoFar = function() {
    return !this.hadError;
}

PatternMatcher.prototype.possibleStartTagNames = function() {
    return this.memo.possibleStartTagNames();
}

PatternMatcher.prototype.possibleAttributeNames = function() {
    return this.memo.possibleAttributeNames();
}

PatternMatcher.prototype.requiredElementNames = function() {
    return this.memo.getPattern().apply(this.shared.builder.getRequiredElementsFunction());
}

PatternMatcher.prototype.requiredAttributeNames = function() {
    return this.memo.getPattern().apply(this.shared.builder.getRequiredAttributesFunction());
}

PatternMatcher.prototype.setMemo = function(memo) {
    if (memo.isNotAllowed())
        return false;
    else {
        this.memo = memo;
        return true;
    }
}

PatternMatcher.prototype.ignoreError = function() {
    return this.hadError && this.memo.isNotAllowed();
}

PatternMatcher.prototype.error = function(key) {
    if (this.ignoreError())
        return true;
    this.hadError = true;
    this.errorMessage = this.localizer().message(key,
        Array.prototype.slice.call(arguments, 1));
    return false;
}

PatternMatcher.prototype.errorArgQName = function(qName, name, context, isAttribute) {
    if (this.ignoreError())
        return null;
    if (qName == null || qName.length == 0) {
        var ns = name.getNamespaceUri();
        var localName = name.getLocalName();
        if (ns.length == 0 || (!isAttribute && ns.equals(context.resolveNamespacePrefix(""))))
            qName = localName;
        else {
            var prefix = context.getPrefix(ns);
            if (prefix != null)
                qName = prefix + ":" + localName;
            // this shouldn't happen unless the parser isn't supplying prefixes properly
            else
                qName = "{" + ns + "}" + localName;
        }
    }
    return this.quoteQName(qName);
}

PatternMatcher.prototype.UNDEFINED_TOKEN_INDEX = -3;
PatternMatcher.prototype.INCONSISTENT_TOKEN_INDEX = -2;

PatternMatcher.prototype.formatDataDerivFailures = function(str, context) {
    if (this.ignoreError())
        return null;
    if (this.dataDerivFailureList.length === 0)
        return "";
    if (this.dataDerivFailureList.length > 1) {
        // remove duplicates
        this.dataDerivFailureList = this.dataDerivFailureList.filter(function(failure, index, array) {
            return array.indexOf(failure) === index;
        });
    }
    var stringValues = [];
    var names = [];
    var messages = [];
    var tokenIndex = this.UNDEFINED_TOKEN_INDEX;
    var tokenStart = -1;
    var tokenEnd = -1;
    for (var i = 0; i < this.dataDerivFailureList.length; i++) {
        var fail = this.dataDerivFailureList[i];
        var dt = fail.datatype;
        var s = fail.stringValue;
        if (s != null) {
            var /** Object */ value = fail.getValue();
            // we imply some special semantics for Datatype2
            if (value instanceof Name && dt instanceof Datatype2)
                names.push(value);
        else if (value instanceof String && dt instanceof Datatype2)
                stringValues.push(value);
        else
            stringValues.push(s);
        }
        else {
            var message = fail.getMessage();
            // XXX this might produce strangely worded messages for 3rd party datatype libraries
            if (message != null)
                messages.push(message);
            else if (fail.getExcept() != null)
                return ""; // XXX do better for except
            else
                messages.push(this.localizer().message("require_datatype",
                    fail.getDatatypeName().getLocalName()));
        }
        switch (tokenIndex) {
            case this.INCONSISTENT_TOKEN_INDEX:
                break;
            case this.UNDEFINED_TOKEN_INDEX:
                tokenIndex = fail.getTokenIndex();
                tokenStart = fail.getTokenStart();
                tokenEnd = fail.getTokenEnd();
                break;
            default:
                if (tokenIndex != fail.getTokenIndex())
                    tokenIndex = this.INCONSISTENT_TOKEN_INDEX;
                break;
        }
    }
    if (stringValues.length > 0) {
        stringValues = stringValues.sort();
        for (var i = 0; i < stringValues.length; i++)
            stringValues[i] = this.quoteValue(stringValues[i]);
        messages.push(this.localizer().message("require_values",
            this.formatList(stringValues, "or")));
    }
    if (names.length > 0)
    // XXX provide the strings as well so that a sensible prefix can be chosen if none is declared
        messages.push(this.localizer().message("require_qnames",
            this.formatNames(names,
                this.FORMAT_NAMES_OR|this.FORMAT_NAMES_ELEMENT,
                context)));
    if (messages.length == 0)
        return "";
    var arg = this.formatList(messages, "or");
    // XXX should do something with inconsistent token index (e.g. list { integer+ } | "foo" )
    if (tokenIndex >= 0 && tokenStart >= 0 && tokenEnd <= str.length) {
        if (tokenStart == str.length())
            return this.localizer().message("missing_token", arg);
        return this.localizer().message("token_failures",
            this.quoteValue(str.substring(tokenStart, tokenEnd)),
            arg);
    }
    return this.localizer().message("data_failures", arg);
}

PatternMatcher.prototype.quoteValue = function(str) {
    return this.appendAttributeValue(str);
}

PatternMatcher.prototype.expectedAttributes = function(context) {
    if (this.ignoreError())
        return null;
    var nnc = this.memo.possibleAttributeNames();
    if (nnc.isEmpty())
        return "";
    var expectedNames = nnc.getIncludedNames();
    if (expectedNames.length > 0)
        return this.localizer().message(nnc.isAnyNameIncluded() || nnc.getIncludedNamespaces().length > 0
            ? "expected_attribute_or_other_ns"
            : "expected_attribute",
            this.formatNames(expectedNames,
                this.FORMAT_NAMES_ATTRIBUTE|this.FORMAT_NAMES_OR, context));
    return "";
}

PatternMatcher.prototype.expectedContent = function(context) {
    if (this.ignoreError())
        return null;
    var expected = [];
    if (!this.memo.endTagDeriv().isNotAllowed())
        expected.push(this.localizer().message("element_end_tag"));
    // getContentType isn't so well-defined on after patterns
    switch (this.memo.emptyAfter().getPattern().getContentType()) {
        case Pattern.MIXED_CONTENT_TYPE:
            // A pattern such as (element foo { empty }, text) has a MIXED_CONTENT_TYPE
            // but text is not allowed everywhere.
            if (!this.memo.mixedTextDeriv().isNotAllowed())
                expected.push(this.localizer().message("text"));
            break;
        case Pattern.DATA_CONTENT_TYPE:
            expected.add(this.localizer().message("data"));
            break;
    }
    var /** NormalizedNameClass */ nnc = this.memo.possibleStartTagNames();
    var expectedNames = nnc.getIncludedNames();
    // XXX say something about wildcards
    if (expectedNames.length > 0) {
        expected.push(this.localizer().message("element_list",
            this.formatNames(expectedNames,
                this.FORMAT_NAMES_ELEMENT|this.FORMAT_NAMES_OR,
                context)));
        if (nnc.isAnyNameIncluded() || nnc.getIncludedNamespaces().length > 0)
            expected.push(this.localizer().message("element_other_ns"));
    }
    if (expected.length === 0)
        return "";
    return this.localizer().message("expected", this.formatList(expected, "or"));

}

/**
 *
 * @param {Array} names
 * @param {Integer} flags
 * @param context
 */
PatternMatcher.prototype.formatNames = function(names ,flags, context) {
    if (names.length === 0)
        return "";
    var nsDecls = {};
    var qNames = this.generateQNames(names, flags, context, nsDecls);
    qNames = qNames.sort();
    for (var i = 0; i < qNames.length; i++)
        qNames[i] = this.quoteQName(qNames[i]);
    var result = this.formatList(qNames, (flags & this.FORMAT_NAMES_OR) != 0 ? "or" : "and");
    if (Object.keys(nsDecls).length != 0)
        result = this.localizer().message("qnames_nsdecls", result, this.formatNamespaceDecls(nsDecls));
    return result;
}

/**
 *
 * @param {Array} names
 * @param {Integer} flags
 * @param context
 * @param {Object} nsDecls
 */
PatternMatcher.prototype.generateQNames = function(names, flags, context, nsDecls) {
    var defaultNamespace;
    if ((flags & this.FORMAT_NAMES_ATTRIBUTE) != 0)
        defaultNamespace = "";
    else {
        defaultNamespace = context.resolveNamespacePrefix("");
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (name.namespaceUri.length == 0) {
                if (defaultNamespace != null)
                    nsDecls[""] = "";
                defaultNamespace = "";
                break;
            }
        }
    }
    var qNames = [];
    /* Set */ var undeclaredNamespaces = {};
    var namesWithUndeclaredNamespaces = [];
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var ns = name.namespaceUri;
        var prefix;
        if (ns === defaultNamespace)
            prefix = "";
        else
            prefix = context.getPrefix(ns);
        if (prefix == null) {
            undeclaredNamespaces[ns] = true;
            namesWithUndeclaredNamespaces.push(name);
        }
        else
            qNames.push(this.makeQName(prefix, name.localName));
    }
    if (namesWithUndeclaredNamespaces.length === 0)
        return qNames;
    if (Object.keys(undeclaredNamespaces).length == 1 && defaultNamespace == null)
        nsDecls[Object.keys(undeclaredNamespaces)[0]] = "";
    else
        this.choosePrefixes(undeclaredNamespaces, context, nsDecls);
    // now nsDecls has a prefix for each namespace
    for (var i = 0; i < namesWithUndeclaredNamespaces.length; i++) {
        var name = namesWithUndeclaredNamespaces[i];
        qNames.push(this.makeQName(nsDecls[name.namespaceUri], name.localName));
    }
    return qNames;
}

PatternMatcher.prototype.choosePrefixes = function(nsSet, context, nsDecls) {
//    List<String> nsList = new ArrayList<String>(nsSet);
//    Collections.sort(nsList);
//    int len = nsList.size();
//    String prefix;
//    int tryIndex = 0;
//    do {
//        if (tryIndex < GENERATED_PREFIXES.length)
//            prefix = GENERATED_PREFIXES[tryIndex];
//        else {
//            // default is just to stick as many underscores as necessary at the beginning
//            prefix = "_" + GENERATED_PREFIXES[0];
//            for (int i = GENERATED_PREFIXES.length; i < tryIndex; i++)
//            prefix += "_" + prefix;
//        }
//        for (int i = 0; i < len; i++) {
//            if (context.resolveNamespacePrefix(len == 1 ? prefix : prefix + (i + 1)) != null) {
//                prefix = null;
//                break;
//            }
//        }
//        ++tryIndex;
//    } while (prefix == null);
//    for (int i = 0; i < len; i++) {
//        String ns = nsList.get(i);
//        nsDecls.put(ns, len == 1 ? prefix : prefix + (i + 1));
//    }
}

PatternMatcher.prototype.formatList = function(list, conjunction) {
    switch (list.length) {
        case 0:
            return "";
        case 1:
            return list[0];
        case 2:
            return this.localizer().message(conjunction + "_list_pair", list[0], list[1]);
    }
    var s = this.localizer().message(conjunction + "_list_many_first", list[0]);
    for (var i = 1; i < list.length - 1; i++)
    s = this.localizer().message(conjunction + "_list_many_middle", s, list[i]);
    return this.localizer().message(conjunction + "_list_many_last", s, list[list.length - 1]);
}

PatternMatcher.prototype.formatNamespaceDecls = function(nsDecls) {
    var list = [];
    for (var ns in nsDecls) {
        var buf;
        var prefix = nsDecls[ns];
        if (prefix.length == 0)
            buf = "xmlns";
        else
            buf = "xmlns:" + prefix;
        buf += '=' + this.appendAttributeValue(ns);
        list.push(buf);
    }
    list = list.sort();
    return list.join(' ');
}

PatternMatcher.prototype.quoteForAttributeValue = function(c) {
    switch (c) {
        case '<':
            return "&lt;";
        case '"':
            return "&quot;";
        case '&':
            return "&amp;";
        case 0xA:
            return "&#xA;";
        case 0xD:
            return "&#xD;";
        case 0x9:
            return "&#x9;";
    }
    return null;
}

PatternMatcher.prototype.appendAttributeValue = function(value) {
    var buf = '"';
    for (var i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        var quoted = this.quoteForAttributeValue(c);
        if (quoted != null)
            buf += quoted;
        else
            buf += c;
    }
    buf += '"';
    return buf;
}

PatternMatcher.prototype.makeQName = function(prefix, localName) {
    if (prefix.length == 0)
        return localName;
    return prefix + ":" + localName;
}

PatternMatcher.prototype.quoteQName = function(qName) {
    return this.localizer().message("qname", qName);
}

PatternMatcher.prototype.localizer = function() {
    return SchemaBuilder.localizer;
}

exports.PatternMatcher = PatternMatcher;
},{"./DataDerivFunction":22,"./FindElementFunction":35,"./Pattern":55,"./PatternMemo":61,"./SchemaBuilderImpl":76,"./xml/util/Name":176}],59:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function AsciiCaseInsensitiveString() {

}

AsciiCaseInsensitiveString.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: AsciiCaseInsensitiveString}
});

AsciiCaseInsensitiveString.THE_INSTANCE = new AsciiCaseInsensitiveString();

AsciiCaseInsensitiveString.prototype.checkValid = function(literal) {

};

AsciiCaseInsensitiveString.prototype.createValue = function(literal, context) {
    return this.toAsciiLowerCase(literal);
};

AsciiCaseInsensitiveString.prototype.getName = function() {
    return "ASCII-case-insensitive string";
};

exports.AsciiCaseInsensitiveString = AsciiCaseInsensitiveString;
},{"./AbstractDatatype":109}],"./validator":[function(require,module,exports){
module.exports=require('o4MIuH');
},{}],61:[function(require,module,exports){
var StartTagOpenDerivFunction = require('./StartTagOpenDerivFunction').StartTagOpenDerivFunction;
var StartAttributeDerivFunction = require('./StartAttributeDerivFunction').StartAttributeDerivFunction;
var StartTagOpenRecoverDerivFunction = require('./StartTagOpenRecoverDerivFunction').StartTagOpenRecoverDerivFunction;
var DataDerivTypeFunction = require('./DataDerivTypeFunction').DataDerivTypeFunction;
var ApplyAfterFunction = require('./ApplyAfterFunction').ApplyAfterFunction;
/**
 *
 * @param {Pattern} pattern
 * @param {ValidatorPatternBuilder} builder
 * @constructor
 */
function PatternMemo(pattern, builder) {
    this.pattern = pattern;
    this.builder = builder;
    this.notAllowed = pattern.isNotAllowed();
    this.memoEndAttributes = null;
    this.memoTextOnly = null;
    this.memoEndTagDeriv = null;
    this.memoMixedTextDeriv = null;
    this.memoIgnoreMissingAttributes = null;
    this.memoDataDerivType = null;
    this.memoRecoverAfter = null;
    this.memoEmptyAfter = null;
    this.memoPossibleAttributeNames = null;
    this.memoPossibleStartTagNames = null;
}

PatternMemo.prototype.getPattern = function() {
    return this.pattern;
}

PatternMemo.prototype.getPatternBuilder = function() {
    return this.builder;
}

PatternMemo.prototype.isNotAllowed = function() {
    return this.notAllowed;
}

/**
 *
 * @param {PatternFunction} [patternFunction]
 * @return {*}
 */
PatternMemo.prototype.endAttributes = function(patternFunction) {
    if (this.memoEndAttributes == null) {
        if (!patternFunction)
            patternFunction = this.builder.getEndAttributesFunction();
        this.memoEndAttributes = this.applyForPatternMemo(patternFunction);
    }
    return this.memoEndAttributes;
}

/**
 *
 * @param {PatternFunction} [patternFunction]
 * @return {*}
 */
PatternMemo.prototype.ignoreMissingAttributes = function(patternFunction) {
    if (this.memoIgnoreMissingAttributes == null) {
        if (!patternFunction)
            patternFunction = this.builder.getIgnoreMissingAttributesFunction();
        this.memoIgnoreMissingAttributes = this.applyForPatternMemo(patternFunction);
    }
    return this.memoIgnoreMissingAttributes;
}

/**
 *
 * @param {PatternFunction} [patternFunction]
 * @return {*}
 */
PatternMemo.prototype.textOnly = function(patternFunction) {
    if (this.memoTextOnly == null) {
        if (!patternFunction)
            patternFunction = this.builder.getTextOnlyFunction();
        this.memoTextOnly = this.applyForPatternMemo(patternFunction);
    }
    return this.memoTextOnly;
}

/**
 *
 * @param {PatternFunction} [patternFunction]
 * @return {*}
 */
PatternMemo.prototype.endTagDeriv = function(patternFunction) {
    if (this.memoEndTagDeriv == null) {
        if (!patternFunction)
            patternFunction = this.builder.getEndTagDerivFunction();
        this.memoEndTagDeriv = this.applyForPatternMemo(patternFunction);
    }
    return this.memoEndTagDeriv;
}

/**
 *
 * @param {PatternFunction} [patternFunction]
 * @return {*}
 */
PatternMemo.prototype.mixedTextDeriv = function(patternFunction) {
    if (this.memoMixedTextDeriv == null) {
        if (!patternFunction)
            patternFunction = this.builder.getMixedTextDerivFunction();
        this.memoMixedTextDeriv = this.applyForPatternMemo(patternFunction);
    }
    return this.memoMixedTextDeriv;
}

/**
 *
 * @param {Name} name
 * @param {StartTagOpenDerivFunction} [f]
 */
PatternMemo.prototype.startTagOpenDeriv = function(name, f) {
    var tem;
    // todo startTagOpenDerivMap
    if (!name)
        name = f.getName();
    if (!f)
        f = new StartTagOpenDerivFunction(name, this.builder);
    tem = this.applyForPatternMemo(f);
    return tem;
}

/**
 *
 * @param {Name} name
 * @param {StartTagOpenRecoverDerivFunction} [f]
 */
PatternMemo.prototype.startTagOpenRecoverDeriv = function(name, f) {
    var tem;
    // todo startTagOpenDerivMap
    if (!name)
        name = f.getName();
    if (!f)
        f = new StartTagOpenRecoverDerivFunction(name, this.builder);
    tem = this.applyForPatternMemo(f);
    return tem;
}

/**
 *
 * @param {Name} name
 * @param {StartAttributeDerivFunction} [f]
 */
PatternMemo.prototype.startAttributeDeriv = function(name, f) {
    var tem;
    // todo startAttributeDerivMap
    if (name instanceof StartAttributeDerivFunction) {
        f = name;
        name = null;
    }
    if (!name)
        name = f.getName();
    if (!f)
        f = new StartAttributeDerivFunction(name, this.builder);
    tem = this.applyForPatternMemo(f);
    return tem;
}

PatternMemo.prototype.dataDerivType = function() {
    if (this.memoDataDerivType == null)
        this.memoDataDerivType = DataDerivTypeFunction.dataDerivType(this.builder, this.pattern).copy();
    return this.memoDataDerivType;
}

/**
 *
 * @param {String} string
 * @param {ValidationContext} validationContext
 * @param {Array} [fail]
 */
PatternMemo.prototype.dataDeriv = function(string, validationContext, fail) {
    return this.dataDerivType().dataDeriv(this.builder, this.pattern, string, validationContext, fail);
}

PatternMemo.prototype.recoverAfter = function() {
    if (this.memoRecoverAfter == null)
        this.memoRecoverAfter = this.applyForPatternMemo(this.builder.getRecoverAfterFunction());
    return this.memoRecoverAfter;
}

PatternMemo.prototype.emptyAfter = function() {
    if (this.memoEmptyAfter == null)
        this.memoEmptyAfter = this.applyForPatternMemo(new function(builder){
            var f = new ApplyAfterFunction(builder);
            f.apply = function() {
                return this.builder.makeEmpty();
            };
            f.caseOther = function(p) {
                return p;
            };
            return f;
        }(this.builder));
    return this.memoEmptyAfter;
}

PatternMemo.prototype.possibleStartTagNames = function() {
    if (this.memoPossibleStartTagNames == null)
        this.memoPossibleStartTagNames = this.builder.getPossibleStartTagNamesFunction().applyTo(this.pattern);
    return this.memoPossibleStartTagNames;
}

PatternMemo.prototype.possibleAttributeNames = function() {
    if (this.memoPossibleAttributeNames == null)
        this.memoPossibleAttributeNames = this.builder.getPossibleAttributeNamesFunction().applyTo(this.pattern);
    return this.memoPossibleAttributeNames;
}

/**
 *
 * @param {PatternFunction} f
 * @return {PatternMemo}
 */
PatternMemo.prototype.applyForPatternMemo = function(f) {
    return this.builder.getPatternMemo(this.pattern.apply(f));
}

exports.PatternMemo = PatternMemo;
},{"./ApplyAfterFunction":8,"./DataDerivTypeFunction":24,"./StartAttributeDerivFunction":81,"./StartTagOpenDerivFunction":82,"./StartTagOpenRecoverDerivFunction":83}],62:[function(require,module,exports){
var PatternMatcher = require('./PatternMatcher').PatternMatcher;
var Name = require('./xml/util/Name').Name;
var SAXParseException = require('./SAXParseException').SAXParseException;
var WellKnownNamespaces = require('./xml/util/WellKnownNamespaces').WellKnownNamespaces;


/**
 *
 * @param {String} prefix
 * @param {String} namespaceURI
 * @param {PrefixMapping} prev
 * @constructor
 */
function PrefixMapping(prefix, namespaceURI, prev) {
    this.prefix = prefix;
    // null for undeclaring
    this.namespaceURI = namespaceURI;
    this.previous = prev;
}

function Context() {
    this.prefixMapping = new PrefixMapping("xml", WellKnownNamespaces.XML, null);
}

/**
 *
 * @param {String} prefix
 * @param {String} uri
 * @throws SAXException
 */
Context.prototype.startPrefixMapping = function(prefix, uri) {
    this.prefixMapping = new PrefixMapping(prefix, "" === uri ? null : uri, this.prefixMapping);
};

/**
 *
 * @param {String} prefix
 * @throws SAXException
 */
Context.prototype.endPrefixMapping = function(prefix) {
    this.prefixMapping = this.prefixMapping.previous();
};

Context.prototype.getBaseUri = function() {
    return null;
};

/**
 *
 * @param {String} prefix
 * @return {String}
 */
Context.prototype.resolveNamespacePrefix = function(prefix) {
    var tem = this.prefixMapping;
    do {
        if (tem.prefix === prefix)
            return tem.namespaceURI;
        tem = tem.previous;
    } while (tem != null);
    return null;
};

Context.prototype.reset = function() {
    this.prefixMapping = new PrefixMapping("xml", WellKnownNamespaces.XML, null);
    this.clearDtdContext();
};

/**
 *
 * @param {String} namespaceURI
 * @return {String}
 */
Context.prototype.getPrefix = function(namespaceURI) {
    var tem = this.prefixMapping;
    do {
        if (namespaceURI === tem.namespaceURI &&
            tem.namespaceURI == this.resolveNamespacePrefix(tem.prefix))
            return tem.prefix;
        tem = tem.previous;
    } while (tem != null);
    return null;
};


/**
 *
 * @param {Pattern} pattern
 * @param {ValidatorPatternBuilder} builder
 * @param {ErrorHandler} errorHandler
 */
function PatternValidator(pattern, builder, errorHandler) {
    Context.call(this);
    this.matcher = new PatternMatcher(pattern, builder);
    this.errorHandler = errorHandler;
    this.documentLocator = null;
}

PatternValidator.prototype = Object.create(Context.prototype, {constructor: {
    value: PatternValidator
}});

/**
 *
 * @param {String} namespaceURI
 * @param {String} localName
 * @param {String} qName
 * @param {Attributes} attributes
 */
PatternValidator.prototype.startElement = function(namespaceURI, localName, qName, attributes) {
    // bufferingCharacters
    var name = new Name(namespaceURI, localName);
    this.check(this.matcher.matchStartTagOpen(name, qName, this));
    for (var i = 0; i < attributes.length; i++) {
        var attributeName = new Name(attributes[i].namespaceURI || '', attributes[i].nodeName);
        var attributeQName = (attributes[i].prefix ? attributes[i].prefix + ':' : '') + attributes[i].nodeName;
        this.check(this.matcher.matchAttributeName(attributeName, attributeQName, this));
        this.check(this.matcher.matchAttributeValue(attributes[i].nodeValue, attributeName, attributeQName, this));
    }
    this.check(this.matcher.matchStartTagClose(name, qName, this));
    // bufferingCharacters
}

/**
 *
 * @param {String} namespaceURI
 * @param {String} localName
 * @param {String} qName
 */
PatternValidator.prototype.endElement = function(namespaceURI, localName, qName) {
    // bufferingCharacters
    this.check(this.matcher.matchEndTag(new Name(namespaceURI, localName), qName, this));
}

/**
 *
 * @param {String} characters
 * @param {Integer} start
 * @param {Integer} length
 */
PatternValidator.prototype.characters = function(characters, start, length) {
    for (var i = 0; i < length; i++) {
        switch (characters[start + i]){
            case ' ':
            case '\r':
            case '\t':
            case '\n':
                break;
            default:
                this.check(this.matcher.matchUntypedText(this));
                return;
        }
    }
}


PatternValidator.prototype.endDocument = function(){
    this.check(this.matcher.matchEndDocument());
}

/**
 *
 * @param {Locator} locator
 */
PatternValidator.prototype.setDocumentLocator = function(locator){
    this.documentLocator = locator;
}

PatternValidator.prototype.startDocument = function(){
    this.check(this.matcher.matchStartDocument());
}

/**
 *
 * @param {String} target
 * @param {String} data
 */
PatternValidator.prototype.processingInstruction = function(target, data){ }

/**
 *
 * @param {String} name
 */
PatternValidator.prototype.skippedEntity = function(name){ }

/**
 *
 * @param {String} characters
 * @param {Integer} start
 * @param {Integer} length
 */
PatternValidator.prototype.ignorableWhiteSpace = function(characters, start, length){ }

/**
 *
 * @param {String} prefix
 * @param {String} uri
 */
PatternValidator.prototype.startPrefixMapping = function(prefix, uri){
    // todo
}

PatternValidator.prototype.reset = function(){
    // super.reset()
    // bufferingCharacters
    this.documentLocator = null;
    this.matcher = this.matcher.start();
}

/**
 *
 * @param {Boolean} ok
 */
PatternValidator.prototype.check = function(ok){
    if (!ok)
        this.errorHandler.error(new SAXParseException(this.matcher.getErrorMessage(), this.documentLocator));
}

exports.PatternValidator = PatternValidator;
},{"./PatternMatcher":58,"./SAXParseException":74,"./xml/util/Name":176,"./xml/util/WellKnownNamespaces":178}],63:[function(require,module,exports){
var PossibleNamesFunction = require('./PossibleNamesFunction').PossibleNamesFunction;
var VoidValue = require('./VoidValue').VoidValue;

function PossibleAttributeNamesFunction() {
    PossibleNamesFunction.call(this);
}

PossibleAttributeNamesFunction.prototype = Object.create(PossibleNamesFunction.prototype, {
    constructor: {value: PossibleAttributeNamesFunction}
});

PossibleAttributeNamesFunction.prototype.caseAttribute = function(p) {
    this.add(p.getNameClass());
    return VoidValue.VOID;
};

PossibleAttributeNamesFunction.prototype.caseGroup = function(p) {
    return this.caseBinary(p);
};

exports.PossibleAttributeNamesFunction = PossibleAttributeNamesFunction;
},{"./PossibleNamesFunction":64,"./VoidValue":95}],64:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var UnionNameClassNormalizer = require('./UnionNameClassNormalizer').UnionNameClassNormalizer;
var VoidValue = require('./VoidValue').VoidValue;
var NullNameClass = require('./NullNameClass').NullNameClass;

function PossibleNamesFunction() {
    this.normalizer = new UnionNameClassNormalizer();
}

PossibleNamesFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
    constructor: {value: PossibleNamesFunction}
});

PossibleNamesFunction.prototype.applyTo = function(p) {
    this.normalizer.setNameClass(new NullNameClass());
    p.apply(this);
    return this.normalizer.normalize();
};

PossibleNamesFunction.prototype.add = function(nc) {
    this.normalizer.add(nc);
};

PossibleNamesFunction.prototype.caseAfter = function(p) {
    return p.getOperand1().apply(this);
};

PossibleNamesFunction.prototype.caseBinary = function(p) {
    p.getOperand1().apply(this);
    p.getOperand2().apply(this);
    return VoidValue.VOID;
};

PossibleNamesFunction.prototype.caseChoice = function(p) {
    return this.caseBinary(p);
};

PossibleNamesFunction.prototype.caseInterleave = function(p) {
    return this.caseBinary(p);
};

PossibleNamesFunction.prototype.caseOneOrMore = function(p) {
    return p.getOperand().apply(this);
};

PossibleNamesFunction.prototype.caseOther = function(p) {
    return VoidValue.VOID;
};


exports.PossibleNamesFunction = PossibleNamesFunction;
},{"./AbstractPatternFunction":2,"./NullNameClass":52,"./UnionNameClassNormalizer":91,"./VoidValue":95}],65:[function(require,module,exports){
var PossibleNamesFunction = require('./PossibleNamesFunction').PossibleNamesFunction;
var VoidValue = require('./VoidValue').VoidValue;

function PossibleStartTagNamesFunction() {
    PossibleNamesFunction.call(this);
}

PossibleStartTagNamesFunction.prototype = Object.create(PossibleNamesFunction.prototype, {
    constructor: {value: PossibleStartTagNamesFunction}
});

PossibleStartTagNamesFunction.prototype.caseElement = function(p) {
    this.add(p.getNameClass());
    return VoidValue.VOID;
};

PossibleStartTagNamesFunction.prototype.caseGroup = function(p) {
    p.getOperand1().apply(this);
    if (p.getOperand1().isNullable())
        p.getOperand2().apply(this);
    return VoidValue.VOID;
};

exports.PossibleStartTagNamesFunction = PossibleStartTagNamesFunction;

},{"./PossibleNamesFunction":64,"./VoidValue":95}],66:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;

/**
 *
 * @param builder
 * @class
 * @extends AbstractPatternFunction
 */
function RecoverAfterFunction(builder) {
    this.builder = builder;
}

RecoverAfterFunction.prototype = Object.create(AbstractPatternFunction.prototype);

RecoverAfterFunction.prototype.caseOther = function(p) {
    throw new Error("recover after botch");
}

RecoverAfterFunction.prototype.caseChoice = function(p) {
    return this.builder.makeChoice(p.getOperand1().apply(this),
        p.getOperand2().apply(this));
}

RecoverAfterFunction.prototype.caseAfter = function(p) {
    return p.getOperand2();
}

exports.RecoverAfterFunction = RecoverAfterFunction;
},{"./AbstractPatternFunction":2}],67:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function RefPattern(name) {
    Pattern.call(this);
    this.name = name;
    this.pattern = null;
    this.checkRecursionDepth = -1;
    this.combineImplicit = false;
    this.combineType = this.COMBINE_NONE;
    this.replacementStatus = this.REPLACEMENT_KEEP;
    this.expanded = false;
}

RefPattern.REPLACEMENT_KEEP = 0;
RefPattern.REPLACEMENT_REQUIRE = 1;
RefPattern.REPLACEMENT_IGNORE = 2;

RefPattern.COMBINE_NONE = 0;
RefPattern.COMBINE_CHOICE = 1;
RefPattern.COMBINE_INTERLEAVE = 2;

RefPattern.prototype = Object.create(Pattern.prototype);

RefPattern.prototype.getPattern = function() {
    return this.pattern;
}

RefPattern.prototype.setPattern = function(pattern) {
    this.pattern = pattern;
}

RefPattern.prototype.getRefLocator = function() {
    return this.refLocator;
}

RefPattern.prototype.setRefLocator = function(locator) {
    this.refLocator = locator;
}

RefPattern.prototype.checkRecursion = function(depth) {
    if (this.checkRecursionDepth == -1) {
        this.checkRecursionDepth = depth;
        this.pattern.checkRecursion(depth);
        this.checkRecursionDepth = -2;
    }
    else if (depth == this.checkRecursionDepth)
    // XXX try to recover from this?
        throw new SAXParseException(SchemaBuilderImpl.localizer.message("recursive_reference", name),
            this.refLoc);
}

RefPattern.prototype.expand = function(patternBuilder) {
    if (!this.expanded) {
        this.pattern = this.pattern.expand(patternBuilder);
        this.expanded = true;
    }
    return this.pattern;
}

RefPattern.prototype.samePattern = function(other) {
    return false;
}

RefPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseRef(this);
}

RefPattern.prototype.getReplacementStatus = function() {
    return this.replacementStatus;
}

RefPattern.prototype.setReplacementStatus = function(replacementStatus) {
    this.replacementStatus = replacementStatus;
}

RefPattern.prototype.isCombineImplicit = function() {
    return this.combineImplicit;
}

RefPattern.prototype.setCombineImplicit = function() {
    this.combineImplicit = true;
}

RefPattern.prototype.getCombineType = function() {
    return this.combineType;
}

RefPattern.prototype.setCombineType = function(combineType) {
    this.combineType = combineType;
}

RefPattern.prototype.getName = function() {
    return this.name;
}


RefPattern.prototype.REPLACEMENT_KEEP = RefPattern.REPLACEMENT_KEEP;
RefPattern.prototype.REPLACEMENT_REQUIRE = RefPattern.REPLACEMENT_REQUIRE;
RefPattern.prototype.REPLACEMENT_IGNORE = RefPattern.REPLACEMENT_IGNORE;

RefPattern.prototype.COMBINE_NONE = RefPattern.COMBINE_NONE;
RefPattern.prototype.COMBINE_CHOICE = RefPattern.COMBINE_CHOICE;
RefPattern.prototype.COMBINE_INTERLEAVE = RefPattern.COMBINE_INTERLEAVE;


exports.RefPattern = RefPattern;
},{"./Pattern":55}],68:[function(require,module,exports){
var RequiredElementsOrAttributesFunction = require('./RequiredElementsOrAttributesFunction').RequiredElementsOrAttributesFunction;

function RequiredAttributesFunction() { }

RequiredAttributesFunction.prototype = Object.create(RequiredElementsOrAttributesFunction.prototype,{
    constructor: {value: RequiredAttributesFunction}
});

RequiredAttributesFunction.prototype.caseAttribute = function(p) {
    return this.caseNamed(p.getNameClass());
}

RequiredAttributesFunction.prototype.caseGroup = function(p) {
    return this.union(p);
}

exports.RequiredAttributesFunction = RequiredAttributesFunction;
},{"./RequiredElementsOrAttributesFunction":70}],69:[function(require,module,exports){
var RequiredElementsOrAttributesFunction = require('./RequiredElementsOrAttributesFunction').RequiredElementsOrAttributesFunction;

function RequiredElementsFunction() { }

RequiredElementsFunction.prototype = Object.create(RequiredElementsOrAttributesFunction.prototype,
    {constructor: {value: RequiredElementsFunction}});

RequiredElementsFunction.prototype.caseElement = function(p) {
    return this.caseNamed(p.getNameClass());
}

RequiredElementsFunction.prototype.caseGroup = function(p) {
    var p1 = p.getOperand1();
    if (!p1.isNullable())
        return p1.apply(this);
    return p.getOperand2().apply(this);
}

exports.RequiredElementsFunction = RequiredElementsFunction;
},{"./RequiredElementsOrAttributesFunction":70}],70:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var SimpleNameClass = require('./SimpleNameClass').SimpleNameClass;

function RequiredElementsOrAttributesFunction() {}

RequiredElementsOrAttributesFunction.prototype = Object.create(AbstractPatternFunction.prototype);

RequiredElementsOrAttributesFunction.prototype.caseOther = function(p) {
    return [];
}

RequiredElementsOrAttributesFunction.prototype.caseChoice = function(p) {
    var s1 = p.getOperand1().apply(this);
    var s2 = p.getOperand2().apply(this);
    if (s1.length == 0)
        return s1;
    if (s2.length == 0)
        return s2;
    s1 = s1.filter(function(n) {
        return s2.indexOf(n) != -1;
    });
    return s1;
}

RequiredElementsOrAttributesFunction.prototype.caseNamed = function(nc) {
    if (!(nc instanceof SimpleNameClass))
        return [];
    var s = [];
    s.push(nc.getName());
    return s;
}

RequiredElementsOrAttributesFunction.prototype.union = function(p) {
    var s1 = p.getOperand1().apply(this);
    var s2 = p.getOperand2().apply(this);
    if (s1.length == 0)
        return s2;
    if (s2.length == 0)
        return s1;
    s1.concat(s2);
    return s1;
}

RequiredElementsOrAttributesFunction.prototype.caseInterleave = function(p) {
    return this.union(p)
}

RequiredElementsOrAttributesFunction.prototype.caseAfter = function(p) {
    return p.getOperand1().apply(this);
}

RequiredElementsOrAttributesFunction.prototype.caseOneOrMore = function(p) {
    return p.getOperand().apply(this);
}

exports.RequiredElementsOrAttributesFunction = RequiredElementsOrAttributesFunction;
},{"./AbstractPatternFunction":2,"./SimpleNameClass":79}],71:[function(require,module,exports){
function RestrictionViolationException(messageId, name) {
    this.loc = null;
    this.messageId = messageId;
    if (typeof name == "undefined") {
        this.name = null;
        this.namespaceUri = null;
    }
    else if (typeof name == "string") {
        this.name = null;
        this.namespaceUri = name;
    }
    else {
        this.name = name;
        this.namespaceUri = null;
    }
}

RestrictionViolationException.prototype = Object.create(Error.prototype, {
    constructor: {value: RestrictionViolationException}
});

RestrictionViolationException.prototype.getMessageId = function() {
    return this.messageId;
};

RestrictionViolationException.prototype.getLocator = function() {
    return this.loc;
};

RestrictionViolationException.prototype.maybeSetLocator = function(loc) {
    if (this.loc == null)
        this.loc = loc;
};

RestrictionViolationException.prototype.getName = function() {
    return this.name;
};

RestrictionViolationException.prototype.getNamespaceUri = function() {
    return this.namespaceUri;
};


exports.RestrictionViolationException = RestrictionViolationException;
},{}],72:[function(require,module,exports){
var PatternValidator = require('./PatternValidator').PatternValidator;

/**
 * @extends PatternValidator
 * @constructor
 */
function RngValidator(pattern, builder, errorHandler) {
	PatternValidator.call(this, pattern, builder, errorHandler);
}

RngValidator.prototype = Object.create(PatternValidator.prototype, {
    constructor: {value: RngValidator}
});

RngValidator.prototype.reset = function() {
    PatternValidator.prototype.reset.call(this);
};

Object.defineProperty(RngValidator.prototype, 'contentHandler', {
    get: function() {
        return this;
    }
});

exports.RngValidator = RngValidator;
},{"./PatternValidator":62}],73:[function(require,module,exports){
// http://www.saxproject.org/apidoc/org/xml/sax/SAXException.html
function SAXException(message, exception) { // java.lang.Exception
    this.message = message;
    this.exception = exception;
}
SAXException.prototype = new Error(); // We try to make useful as a JavaScript error, though we could even implement java.lang.Exception
SAXException.constructor = SAXException;
SAXException.prototype.getMessage = function () {
    return this.message;
};
SAXException.prototype.getException = function () {
    return this.exception;
};


exports.SAXException = SAXException;

},{}],74:[function(require,module,exports){
var SAXException = require('./SAXException').SAXException;

// Not fully implemented
// http://www.saxproject.org/apidoc/org/xml/sax/SAXNotSupportedException.html
function SAXNotSupportedException (msg) { // java.lang.Exception
    this.message = msg || '';
}
SAXNotSupportedException.prototype = new SAXException();
SAXNotSupportedException.constructor = SAXNotSupportedException;

// http://www.saxproject.org/apidoc/org/xml/sax/SAXNotRecognizedException.html
function SAXNotRecognizedException (msg) { // java.lang.Exception
    this.message = msg || '';
}
SAXNotRecognizedException.prototype = new SAXException();
SAXNotRecognizedException.constructor = SAXNotRecognizedException;

//This constructor is more complex and not presently implemented;
//  see Java API to implement additional arguments correctly
// http://www.saxproject.org/apidoc/org/xml/sax/SAXParseException.html
function SAXParseException (msg, locator) { // java.lang.Exception //
    this.message = msg || '';
    this.locator = locator;
}
SAXParseException.prototype = new SAXException();
SAXParseException.constructor = SAXParseException;
SAXParseException.prototype.getColumnNumber = function () {};
SAXParseException.prototype.getLineNumber = function () {};
SAXParseException.prototype.getPublicId = function () {};
SAXParseException.prototype.getSystemId = function () {};

Object.defineProperty(SAXParseException.prototype, 'lineNumber', {
    get: function() {
        if (!this.locator)
            return -1;
        return this.locator.lineNumber;
    }
});

Object.defineProperty(SAXParseException.prototype, 'columnNumber', {
    get: function() {
        if (!this.locator)
            return -1;
        return this.locator.columnNumber;
    }
});

exports.SAXParseException = SAXParseException;
},{"./SAXException":73}],75:[function(require,module,exports){
var SchemaParser = require('./SchemaParser').SchemaParser;
var SAXParser = require('./sax').SAXParser;

function SAXParseable(source, resolver, errorHandler) {
    // SAXSubParser.call(this, resolver, errorHandler);
    this.source = source;
}

SAXParseable.prototype.parse = function(schemaBuilder, scope) {
    var xmlReader = new SAXParser();
    var schemaParser = new SchemaParser(xmlReader, this.errorHandler, schemaBuilder, null, scope);
    xmlReader.parseString(this.source);
    return schemaParser.getParsedPattern();
}

exports.SAXParseable = SAXParseable;
},{"./SchemaParser":77,"./sax":171}],76:[function(require,module,exports){
var RefPattern = require('./RefPattern').RefPattern;
var Pattern = require('./Pattern').Pattern;
var ChoiceNameClass = require('./ChoiceNameClass').ChoiceNameClass;
var SimpleNameClass = require('./SimpleNameClass').SimpleNameClass;
var AnyNameClass = require('./AnyNameClass').AnyNameClass;
var NsNameClass = require('./NsNameClass').NsNameClass;
var NsNameExceptNameClass = require('./NsNameExceptNameClass').NsNameExceptNameClass;
var AnyNameExceptNameClass = require('./AnyNameExceptNameClass').AnyNameExceptNameClass;
var ErrorNameClass = require('./ErrorNameClass').ErrorNameClass;
var Name = require('./xml/util/Name').Name;
var VoidValue = require('./VoidValue').VoidValue;
var AnnotationsImpl = require('./AnnotationsImpl').AnnotationsImpl;
var Localizer = require('./Localizer').Localizer;
var BuiltinDatatypeLibraryFactory = require('./BuiltinDatatypeLibraryFactory').BuiltinDatatypeLibraryFactory;
var DatatypeException = require('./relaxng/datatype/DatatypeException').DatatypeException;
var SAXException = require('./SAXException').SAXException;
var SAXParseException = require('./SAXParseException').SAXParseException;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;
var AttributeNameClassChecker = require('./AttributeNameClassChecker').AttributeNameClassChecker;
var NameFormatter = require('./NameFormatter').NameFormatter;


var GrammarSection = {};
GrammarSection.COMBINE_CHOICE = 'choice';
GrammarSection.COMBINE_INTERLEAVE = 'interleave';
GrammarSection.START = "#start";

var DummyDataPatternBuilder;
var DataPatternBuilderImpl;

function SchemaBuilderImpl(subParser, errorHandler, datatypeLibraryFactory, patternBuilder) {
    this.parent = null;
    this.hadError = false;
    this.subParser = subParser;
    this.errorHandler = errorHandler;
    this.datatypeLibraryFactory = datatypeLibraryFactory;
    this.patternBuilder = patternBuilder;
    this.inheritNs = '';
    this.openIncludes = null;
    this.attributeNameClassChecker = new AttributeNameClassChecker();

    var parent = this;
    /**
     *
     * @class
     * @implements DataPatternBuilder
     */
    DummyDataPatternBuilder = function() {};

    DummyDataPatternBuilder.prototype.addParam = function(name, value, context, ns, loc, anno) {
    }

    DummyDataPatternBuilder.prototype.annotation = function(ea) {
    }

    DummyDataPatternBuilder.prototype.makePattern = function(except, loc, anno) {
        return patternBuilder.makeError();
    }

    /**
     *
     * @class
     * @implements DataPatternBuilder
     */
    DataPatternBuilderImpl = function(dtb, dtName) {
        this.dtb = dtb;
        this.dtName = dtName;
        this.params = [];
    };

    DataPatternBuilderImpl.prototype.addParam = function(name, value, context, ns, loc, anno) {
        try {
            this.dtb.addParameter(name, value, new ValidationContextImpl(context, ns));
            this.params.push(name);
            this.params.push(value);
        }
        catch (e) {
            if (e instanceof DatatypeException) {
                var detail = e.getMessage();
                var pos = e.getIndex();
                var displayedParam;
                if (pos == DatatypeException.UNKNOWN)
                    displayedParam = null;
                else
                    displayedParam = this.displayParam(value, pos);
                if (displayedParam != null) {
                    if (detail != null)
                        parent.error("invalid_param_detail_display", detail, displayedParam, loc);
                    else
                        parent.error("invalid_param_display", displayedParam, loc);
                }
                else if (detail != null)
                    parent.error("invalid_param_detail", detail, loc);
                else
                    parent.error("invalid_param", loc);
            }
            else
                throw e;
        }
    };

    DataPatternBuilderImpl.prototype.annotation = function(ea) {
    };

    DataPatternBuilderImpl.prototype.displayParam = function(value, pos) {
        if (pos < 0)
            pos = 0;
        else if (pos > value.length)
            pos = value.length;
        return parent.localizer.message("display_param", value.substring(0, pos), value.substring(pos));
    };

    DataPatternBuilderImpl.prototype.makePattern = function(except, loc, anno) {
        if (arguments.length === 3)
            try {
                return parent.patternBuilder.makeDataExcept(this.dtb.createDatatype(), this.dtName, this.params, except, loc);
            }
            catch (e) {
                if (e instanceof DatatypeException) {
                    var detail = e.getMessage();
                    if (detail != null)
                        parent.error("invalid_params_detail", detail, loc);
                    else
                        parent.error("invalid_params", loc);
                    return parent.patternBuilder.makeError();
                }
                else
                    throw e;
            }
        else
            try {
                return parent.patternBuilder.makeData(this.dtb.createDatatype(), this.dtName, this.params);
            }
            catch (e) {
                if (e instanceof DatatypeException) {
                    var detail = e.getMessage();
                    if (detail != null)
                        parent.error("invalid_params_detail", detail, loc);
                    else
                        parent.error("invalid_params", loc);
                    return parent.patternBuilder.makeError();
                }
                else
                    throw e;
            }
    };
}

SchemaBuilderImpl.INHERIT_NS = '#inherit';

SchemaBuilderImpl.parse = function(parseable, errorHandler, datatypeLibraryFactory, patternBuilder, isAttributesPattern) {
    var schemaBuilder = new SchemaBuilderImpl(parseable, errorHandler, new BuiltinDatatypeLibraryFactory(datatypeLibraryFactory), patternBuilder);
    var pattern = parseable.parse(schemaBuilder, new RootScope(schemaBuilder));
    if (isAttributesPattern)
        pattern = schemaBuilder.wrapAttributesPattern(pattern);
    return schemaBuilder.expandPattern(pattern);
}

SchemaBuilderImpl.localizer = new Localizer();

SchemaBuilderImpl.prototype = Object.create(AnnotationsImpl.prototype, {
    constructor: {value: SchemaBuilderImpl}
});

SchemaBuilderImpl.prototype.localizer = SchemaBuilderImpl.localizer;

SchemaBuilderImpl.prototype.wrappAttributesPattern = function(pattern) {
    return this.makeElement(this.makeAnyName(null, null), pattern, null, null);
}

SchemaBuilderImpl.prototype.expandPattern = function(pattern) {
    if (!this.hadError) {
        try {
            pattern.checkRecursion(0);
            pattern = pattern.expand(this.patternBuilder);
            pattern.checkRestrictions(Pattern.START_CONTEXT, null, null);
            if (!this.hadError)
                return pattern;
        }
        catch (e) {
            if (e instanceof SAXParseException)
                this.error(e);
            else if (e instanceof SAXException)
                throw new BuildException(e);
            else if (e instanceof RestrictionViolationException) {
                if (e.getName() != null)
                    this.error(e.getMessageId(), NameFormatter.format(e.getName()), e.getLocator());
                else if (e.getNamespaceUri() != null)
                    this.error(e.getMessageId(), e.getNamespaceUri(), e.getLocator());
                else
                    this.error(e.getMessageId(), e.getLocator());
            }
            else
                throw e;
        }
    }
    throw new IllegalSchemaException();
}

SchemaBuilderImpl.prototype.makeChoice = function(patterns) {
    if (patterns.length == 0)
        throw new Error();
    var result = patterns[0];
    for (var i = 1; i < patterns.length; i++)
        result = this.patternBuilder.makeChoice(result, patterns[i]);
    return result;
}

SchemaBuilderImpl.prototype.makeInterleave = function(patterns, loc, anno) {
    var nPatterns = patterns.length;
    if (nPatterns <= 0)
        throw new IllegalArgumentException();
    var result = patterns[0];
    for (var i = 1; i < nPatterns; i++)
        result = this.patternBuilder.makeInterleave(result, patterns[i]);
    return result;
}

SchemaBuilderImpl.prototype.makeGroup = function(patterns, loc, anno) {
    var nPatterns = patterns.length;
    if (nPatterns <= 0)
        throw new IllegalArgumentException();
    var result = patterns[0];
    for (var i = 1; i < nPatterns; i++)
        result = this.patternBuilder.makeGroup(result, patterns[i]);
    return result;
}

SchemaBuilderImpl.prototype.makeOneOrMore = function(pattern) {
    return this.patternBuilder.makeOneOrMore(pattern);
}

SchemaBuilderImpl.prototype.makeZeroOrMore = function(pattern) {
    return this.patternBuilder.makeZeroOrMore(pattern);
}

SchemaBuilderImpl.prototype.makeOptional = function(pattern) {
    return this.patternBuilder.makeOptional(pattern);
}

SchemaBuilderImpl.prototype.makeList = function(pattern) {
    return this.patternBuilder.makeList(pattern);
}

SchemaBuilderImpl.prototype.makeMixed = function(pattern) {
    return this.patternBuilder.makeMixed(pattern);
}

SchemaBuilderImpl.prototype.makeEmpty = function() {
    return this.patternBuilder.makeEmpty();
}

SchemaBuilderImpl.prototype.makeNotAllowed = function() {
    return this.patternBuilder.makeUnexpandedNotAllowed();
}

SchemaBuilderImpl.prototype.makeText = function() {
    return this.patternBuilder.makeText();
}

SchemaBuilderImpl.prototype.makeErrorPattern = function() {
    return this.patternBuilder.makeError();
}

SchemaBuilderImpl.prototype.makeErrorNameClass = function() {
    return new ErrorNameClass();
}

SchemaBuilderImpl.prototype.makeAttribute = function(nameClass, pattern) {
    // todo check nameclass
    return this.patternBuilder.makeAttribute(nameClass, pattern);
}

SchemaBuilderImpl.prototype.makeElement = function(nameClass, pattern) {
    return this.patternBuilder.makeElement(nameClass, pattern);
}

SchemaBuilderImpl.prototype.makeDataPatternBuilder = function(datatypeLibrary, type, loc) {
    var dl = this.datatypeLibraryFactory.createDatatypeLibrary(datatypeLibrary);
    if (dl == null)
        this.error("unrecognized_datatype_library", datatypeLibrary, loc);
    else {
        try {
            return new DataPatternBuilderImpl(dl.createDatatypeBuilder(type), new Name(datatypeLibrary, type));
        }
        catch (e) {
            if (e instanceof DatatypeException) {
                var detail = e.getMessage();
                if (detail != null)
                    this.error("unsupported_datatype_detail", datatypeLibrary, type, detail, loc);
                else
                    this.error("unrecognized_datatype", datatypeLibrary, type, loc);
            }
            else
                throw e;
        }
    }
    return new DummyDataPatternBuilder();
}

SchemaBuilderImpl.prototype.makeValue = function(datatypeLibrary, type, value, context, ns, loc, anno) {
    var dl = this.datatypeLibraryFactory.createDatatypeLibrary(datatypeLibrary);
    if (dl == null)
        this.error("unrecognized_datatype_library", datatypeLibrary, loc);
    else {
        try {
            var dtb = dl.createDatatypeBuilder(type);
            try {
                var dt = dtb.createDatatype();
                var obj = dt.createValue(value, new ValidationContextImpl(context, ns));
                if (obj != null)
                    return this.patternBuilder.makeValue(dt, new Name(datatypeLibrary, type), obj, value);
                this.error("invalid_value", value, loc);
            }
            catch (e) {
                if (e instanceof DatatypeException) {
                    var detail = e.getMessage();
                    if (detail != null)
                        this.error("datatype_requires_param_detail", detail, loc);
                    else
                        this.error("datatype_requires_param", loc);
                }
                else
                    throw e;
            }
        }
        catch (e) {
            if (e instanceof DatatypeException)
                this.error("unrecognized_datatype", datatypeLibrary, type, loc);
            else
                throw e;
        }
    }
    return this.patternBuilder.makeError();
}

SchemaBuilderImpl.prototype.makeGrammar = function(parent) {
    return new Grammar(this, parent);
}

SchemaBuilderImpl.prototype.makeExternalRef = function(href, base, ns, scope, locator, annotations) {
    // @todo
}

SchemaBuilderImpl.prototype.makeNameClassChoice = function(nameClases, locator, annotations) {
    if (nameClases.length == 0)
        throw new Error('IllegalArgumentException');
    var result = nameClases[0];
    for (var i = 1; i < nameClases.length; i++)
        result = new ChoiceNameClass(result, nameClases[i]);
    return result;
}

SchemaBuilderImpl.prototype.makeName = function(ns, localName, prefix, locator, annotations) {
    return new SimpleNameClass(new Name(this.resolveInherit(ns), localName));
}

SchemaBuilderImpl.prototype.makeNsName = function(ns, locator, annotations) {
    return new NsNameClass(this.resolveInherit(ns))
}

SchemaBuilderImpl.prototype.makeNsNameExceptName = function(ns, except, locator, annotations) {
    return new NsNameExceptNameClass(this.resolveInherit(ns), except);
}

SchemaBuilderImpl.prototype.makeAnyName = function(locator, annotations) {
    return new AnyNameClass();
}

SchemaBuilderImpl.prototype.makeAnyNameExceptName = function(except, locator, annotations) {
    return new AnyNameExceptNameClass(except);
}

SchemaBuilderImpl.prototype.makeAnnotations = function(comments, context) {
    return this;
}

SchemaBuilderImpl.prototype.makeElementAnnotation = function() {
    return VoidValue.VOID;
}

SchemaBuilderImpl.prototype.addText = function(value, loc, comments) {
}

SchemaBuilderImpl.prototype.makeElementAnnotationBuilder = function(ns, localName, prefix, locator, comments, context) {
    return this;
}

SchemaBuilderImpl.prototype.makeCommentList = function() {
    return this;
}

SchemaBuilderImpl.prototype.usesComments = function() {
    return false;
}
//annotatePattern - commentAfterNameClass
SchemaBuilderImpl.prototype.resolveInherit = function(ns) {
    if (ns == this.INHERIT_NS)
        return this.inheritNs;
    return ns;
}
SchemaBuilderImpl.prototype.error = function(message) {
    if (this.errorHandler != null)
        this.errorHandler.error(message);
}
SchemaBuilderImpl.prototype.INHERIT_NS = SchemaBuilderImpl.INHERIT_NS

function Grammar(schemaBuilder, parent) {
    this.schemaBuilder = schemaBuilder;
    this.parent = parent;
    this.defines = {};
    this.startRef = new RefPattern(null);
}

Grammar.prototype = Object.create(GrammarSection);

Grammar.prototype.endGrammar = function() {
    for (var name in this.defines) {
        var refPattern = this.defines[name];
        if (refPattern.getPattern() == null) {
            this.schemaBuilder.error('reference_to_undefined', name);
            refPattern.setPattern(this.schemaBuilder.patternBuilder.makeError());
        }
    }
    var start = this.startRef.getPattern();
    if (start == null) {
        this.schemaBuilder.error('missing_start_element');
        start = this.schemaBuilder.patternBuilder.makeError();
    }
    return start;
}


Grammar.prototype.endDiv = function() {
    // nothing to do
}

Grammar.prototype.endIncludedGrammar = function() {
    return null;
}

Grammar.prototype.define = function(refPattern, combine, pattern) {
    if (typeof refPattern == 'string')
        refPattern = this.lookup(refPattern);
    switch (refPattern.getReplacementStatus()) {
        case RefPattern.REPLACEMENT_KEEP:
            if (combine == null) {
                if (refPattern.isCombineImplicit()) {
                    if (refPattern.getName() == null)
                        this.schemaBuilder.error("duplicate_start");
                    else
                        this.schemaBuilder.error("duplicate_define", refPattern.getName());
                }
                else
                    refPattern.setCombineImplicit();
            }
            else {
                var combineType = (combine == this.COMBINE_CHOICE ? RefPattern.COMBINE_CHOICE : RefPattern.COMBINE_INTERLEAVE);
                if (refPattern.getCombineType() != RefPattern.COMBINE_NONE
                    && refPattern.getCombineType() != combineType) {
                    if (refPattern.getName() == null)
                        this.schemaBuilder.error("conflict_combine_start");
                    else
                        this.schemaBuilder.error("conflict_combine_define", refPattern.getName());
                }
                refPattern.setCombineType(combineType);
            }
            if (refPattern.getPattern() == null)
                refPattern.setPattern(pattern);
            else if (refPattern.getCombineType() == RefPattern.COMBINE_INTERLEAVE)
                refPattern.setPattern(this.schemaBuilder.patternBuilder.makeInterleave(refPattern.getPattern(), pattern));
            else
                refPattern.setPattern(this.schemaBuilder.patternBuilder.makeChoice(refPattern.getPattern(), pattern));
            break;
        case RefPattern.REPLACEMENT_REQUIRE:
            RefPattern.setReplacementStatus(RefPattern.REPLACEMENT_IGNORE);
            break;
        case RefPattern.REPLACEMENT_IGNORE:
            break;
    }

}

Grammar.prototype.lookup = function(name) {
    if (name == this.START)
        return this.startRef;
    return this.lookup1(name);
}

Grammar.prototype.lookup1 = function(name) {
    var pattern = this.defines[name];
    if (!pattern) {
        pattern = new RefPattern(name);
        this.defines[name] = pattern;
    }
    return pattern;
}

Grammar.prototype.makeRef = function(name, locator, annotations) {
    var pattern = this.lookup1(name);
    //if (pattern.getRefLocator() == null && loc != null)
    //    p.setRefLocator(loc);
    return pattern;
}

Grammar.prototype.makeParentRef = function(name, locator, annotations) {
    if (this.parent == null) {
        this.schemaBuilder.error("parent_ref_outside_grammar", locator);
        return this.schemaBuilder.makeErrorPattern();
    }
    return parent.makeRef(name, locator, annotations);
}

Grammar.prototype.makeDiv = function() {
    return this;
}

Grammar.prototype.makeInclude = function() {
    return new Include(this.schemaBuilder, this);
}

function RootScope(schemaBuilder) {
    this.schemaBuilder = schemaBuilder;
}

RootScope.prototype.makeParentRef = function(name, locator, annotations) {
    this.schemaBuilder.error("parent_ref_outside_grammar", locator);
    return this.schemaBuilder.makeErrorPattern();
}

RootScope.prototype.makeRef = function(name, locator, annotations) {
    this.schemaBuilder.error("ref_outside_grammar", locator);
    return this.schemaBuilder.makeErrorPattern();
}

function ValidationContextImpl(vc, ns) {
    this.vc = vc;
    this.ns = ns.length == 0 ? null : ns;
}

ValidationContextImpl.prototype.resolveNamespacePrefix = function(prefix) {
    var result = prefix.length == 0 ? this.ns : this.vc.resolveNamespacePrefix(prefix);
    if (result == SchemaBuilderImpl.INHERIT_NS) {
        // todo schemaBuilder.inheritNs
        if (true || this.inheritNs.length == 0)
            return null;
        return this.inheritNs;
    }
    return result;

}

ValidationContextImpl.prototype.getBaseUri = function() {
    return this.vc.getBaseUri();
}

ValidationContextImpl.prototype.isUnparsedEntity = function(entityName) {
    return this.vc.isUnparsedEntity(entityName);
}

ValidationContextImpl.prototype.isNotation = function(notationName) {
    return this.vc.isNotation(notationName);
}


// todo Override
// todo Include

exports.SchemaBuilderImpl = SchemaBuilderImpl;

},{"./AnnotationsImpl":5,"./AnyNameClass":6,"./AnyNameExceptNameClass":7,"./AttributeNameClassChecker":9,"./BuiltinDatatypeLibraryFactory":16,"./ChoiceNameClass":17,"./ErrorNameClass":33,"./Localizer":41,"./NameFormatter":46,"./NsNameClass":50,"./NsNameExceptNameClass":51,"./Pattern":55,"./RefPattern":67,"./RestrictionViolationException":71,"./SAXException":73,"./SAXParseException":74,"./SimpleNameClass":79,"./VoidValue":95,"./relaxng/datatype/DatatypeException":168,"./xml/util/Name":176}],77:[function(require,module,exports){
var Localizer = require('./Localizer').Localizer;
var CommentListImpl = require('./CommentListImpl').CommentListImpl;
var SAXParseException = require('./SAXParseException').SAXParseException;
var WellKnownNamespaces = require('./xml/util/WellKnownNamespaces').WellKnownNamespaces;

function DefaultHandler() {}

DefaultHandler.prototype.comment = function() {};
DefaultHandler.prototype.processingInstruction = function() {};
DefaultHandler.prototype.skippedEntity = function() {};
DefaultHandler.prototype.ignorableWhitespace = function() {};
DefaultHandler.prototype.startDocument = function() {};
DefaultHandler.prototype.endDocument = function() {};
DefaultHandler.prototype.startPrefixMapping = function() {};
DefaultHandler.prototype.endPrefixMapping = function() {};

var SchemaBuilder = {};
SchemaBuilder.INHERIT_NS = '#inherit';


var GrammarSection = {};
GrammarSection.COMBINE_CHOICE = 'choice';
GrammarSection.COMBINE_INTERLEAVE = 'interleave';
GrammarSection.START = "#start";

function SchemaParser(xmlReader, errorHandler, schemaBuilder, grammar, scope) {
    var parent = this;

    function PrefixMapping(prefix, uri, next) {
        this.prefix = prefix;
        this.uri = uri;
        this.next = next;
    }

    function AbstractContext(context) {
        if (context) {
            // todo DtdContext.call(context);
            this.prefixMapping = context.prefixMapping;
        }
        else
            this.prefixMapping = new PrefixMapping("xml", WellKnownNamespaces.XML, null)
    }

    AbstractContext.prototype.resolveNamespacePrefix = function(prefix) {
        for (var p = this.prefixMapping; p != null; p = p.next)
            if (p.prefix === prefix)
                return p.uri;
        return null;
    }

    AbstractContext.prototype.prefixes = function() {
        var set = [];
        for (var p = this.prefixMapping; p != null; p = p.next)
            set.push(p.prefix);
        return set;
    };

    AbstractContext.prototype.copy = function() {
        return new SavedContext(this);
    };


    function SavedContext(context) {
        AbstractContext.call(this, context);
        this.baseUri = null;
    }

    SavedContext.prototype = Object.create(AbstractContext.prototype, {
        constructor: {value: SavedContext}
    });

    SavedContext.prototype.getBaseUri = function() {
        return this.baseUri;
    };


    function ContextImpl() {
        AbstractContext.call(this);
    }

    ContextImpl.prototype = Object.create(AbstractContext.prototype, {
        constructor: {value: ContextImpl}
    });

    ContextImpl.prototype.getBaseUri = function() {
        return null; // todo xmlBaseHandler.getBaseUri();
    };

    function Handler() {
        this.comments = null;
    }

    Handler.prototype.getComments = function() {
        var tem = this.comments;
        this.comments = null;
        return tem;
    };
    Handler.prototype.comment = function(value) {
        if (this.comments == null)
            this.comments = parent.schemaBuilder.makeCommentList();
        this.comments.addComment(value, parent.makeLocation());
    };
    Handler.prototype.processingInstruction = function(target, date) {};
    Handler.prototype.skippedEntity = function(name) {};
    Handler.prototype.ignorableWhitespace = function(ch, start, len) {};
    Handler.prototype.startDocument = function() {};
    Handler.prototype.endDocument = function() {};
    Handler.prototype.startPrefixMapping = function(prefix, uri) {
        parent.context.prefixMapping = new PrefixMapping(prefix, uri, parent.context.prefixMapping);
    };
    Handler.prototype.endPrefixMapping = function(prefix) {
        parent.context.prefixMapping = parent.context.prefixMapping.next;
    };
    Handler.prototype.setDocumentLocator = function(loc) {
        parent.locator = loc;
        // todo parent.xmlBaseHandler.setLocator(loc);
    };


    function State () {
        Handler.call(this);
        this.parent = null;
        this.nsInherit = null;
        this.ns = null;
        this.datatypeLibrary = null;
        this.scope = null;
        this.startLocation = null;
        this.annotations = null;
    }

    State.prototype = Object.create(Handler.prototype, {
        constructor: {value: State}
    });

    State.prototype.create = function() {}

    State.prototype.createChildState = function(localName) {}

    State.prototype.toRootState = function() {
        return null;
    }

    State.prototype.toNameClassChoiceState = function() {
        return null;
    }

    State.prototype.set = function() {
        xmlReader.setContentHandler(this);
    }

    State.prototype.setParent = function(p) {
        this.parent = p;
        this.nsInherit = p.getNs();
        this.datatypeLibrary = p.datatypeLibrary;
        this.scope = p.scope;
        this.startLocation = parent.makeLocation();
    }

    State.prototype.getNs = function() {
        return this.ns == null ? this.nsInherit : this.ns;
    }

    State.prototype.isRelaxNGElement = function(uri) {
        return uri == parent.relaxngURI;
    }

    State.prototype.startElement = function(namespaceURI, localName, qName, attributes) {
        //this.xmlBaseHandler.startElement();
        if (this.isRelaxNGElement(namespaceURI)) {
            var state = this.createChildState(localName);
            if (state == null) {
                xmlReader.setContentHandler(new Skipper(this));
                return;
            }
            state.setParent(this);
            state.set();
            state.attributes(attributes);
        } else {
            this.checkForeignElement();
            var foreignElementHandler = new ForeignElementHandler(this, this.getComments());
            foreignElementHandler.startElement(namespaceURI, localName, qName, attributes);
            xmlReader.setContentHandler(foreignElementHandler);
        }
    }
    State.prototype.endElement = function(namespaceURI, localName, qName) {
        // xmlBaseHandler.endElement();
        this.parent.set();
        this.end();
    }

    State.prototype.setName = function(name) {
        parent.error('illegal_name_attribute', name);
    }

    State.prototype.setOtherAttribute = function(name, value) {
        parent.error('illegal_attribute_ignored', name);
    }

    State.prototype.endAttributes = function() {}

    State.prototype.checkForeignElement = function() {}

    State.prototype.attributes = function(attributes) {
        for (var i = 0; i < attributes.getLength(); i++) {
            var uri = attributes.getURI(i);
            if (!uri) {
                var name = attributes.getLocalName(i);
                if (name == 'name')
                    this.setName(attributes.getValue(i).trim());
                else if (name == 'ns')
                    this.ns = attributes.getValue(i);
                else if (name == 'datatypeLibrary') {
                    this.datatypeLibrary = attributes.getValue(i);
                    // parent.checkUri(this.datatypeLibrary);
                    // @todo checks
                }
                else
                    this.setOtherAttribute(name, attributes.getValue(i));
            }
            else if (uri == parent.relaxngURI)
                parent.error('qualified_attribute', attributes.getLocalName(i));
            else if (uri == WellKnownNamespaces.XML
                && attributes.getLocalName(i) == "base")
                ;// todo xmlBaseHandler.xmlBaseAttribute(atts.getValue(i));
            else {
                if (this.annotations == null)
                    this.annotations = parent.schemaBuilder.makeAnnotations(null, parent.getContext());
                this.annotations.addAttribute(uri, attributes.getLocalName(i), parent.findPrefix(attributes.getQName(i), uri),
                    attributes.getValue(i), this.startLocation);
            }
        }
        this.endAttributes();
    }

    State.prototype.end = function() {}

    State.prototype.startDocument = function() {}

    State.prototype.endDocument = function() {
        if (this.comments != null && parent.startPattern != null) {
            parent.startPattern = parent.schemaBuilder.commentAfterPattern(parent.startPattern, this.comments);
            this.comments = null;
        }
    }

    State.prototype.characters = function(characters, start, length) {
        for (var i = 0; i < length; i++) {
            switch (characters[start + i]) {
                case ' ':
                case '\r':
                case '\n':
                case '\t':
                    break;
                default:
                    parent.error('Illegal Characters. Ignored');
                    break;
            }
        }
    }

    State.prototype.isPatternNamespaceURI = function(s) {
        return s == parent.relaxngURI;
    }

    State.prototype.endForeignChild = function(ea) {
        if (this.annotations == null)
            this.annotations = schemaBuilder.makeAnnotations(null, parent.getContext());
        this.annotations.addElement(ea);
    }

    State.prototype.mergeLeadingComments = function() {
        if (this.comments != null) {
            if (this.annotations == null)
                this.annotations = schemaBuilder.makeAnnotations(this.comments, parent.getContext());
            else
                this.annotations.addLeadingComment(this.comments);
            this.comments = null;
        }
    }


    function ForeignElementHandler(nextState, comments) {
        Handler.call(this);
        this.nextState = nextState;
        this.comments = comments;
        this.builder = null;
        this.builderStack = [];
        this.textBuf = null;
        this.textLoc = null;
    }

    ForeignElementHandler.prototype = Object.create(Handler.prototype, {
        constructor: {value: ForeignElementHandler}
    });

    ForeignElementHandler.prototype.startElement = function(namespaceURI, localName, qName, attributes) {
        this.flushText();
        if (this.builder != null)
            this.builderStack.push(this.builder);
        var loc = parent.makeLocation();
        this.builder = parent.schemaBuilder.makeElementAnnotationBuilder(namespaceURI,
            localName,
            parent.findPrefix(qName, namespaceURI),
            loc,
            this.getComments(),
            parent.getContext());
        var len = attributes.getLength();
        for (var i = 0; i < len; i++) {
            var uri = attributes.getURI(i);
            this.builder.addAttribute(uri, attributes.getLocalName(i), parent.findPrefix(attributes.getQName(i), uri),
                attributes.getValue(i), loc);
        }
    }

    ForeignElementHandler.prototype.endElement = function(namespaceURI, localName, qName, attributes) {
        this.flushText();
        if (this.comments != null)
            this.builder.addComment(this.getComments());
        var ea = this.builder.makeElementAnnotation();
        if (this.builderStack.length == 0) {
            this.nextState.endForeignChild(ea);
            this.nextState.set();
        }
        else {
            this.builder = this.builderStack.pop();
            this.builder.addElement(ea);
        }
    }

    ForeignElementHandler.prototype.characters = function(characters, start, length) {
        if (this.textBuf == null)
            this.textBuf = [];
        this.textBuf.push(characters);
        if (this.textLoc == null)
            this.textLoc = parent.makeLocation();
    }

    ForeignElementHandler.prototype.comment = function(value) {
        this.flushText();
        Handler.prototype.comment.call(this, value);
    }

    ForeignElementHandler.prototype.flushText = function() {
        if (this.textBuf != null && this.textBuf.length != 0) {
            this.builder.addText(this.textBuf.join(""), this.textLoc, this.getComments());
            this.textBuf.length = 0;
        }
        textLoc = null;
    }

    function Skipper(nextState) {
        DefaultHandler.call(this);
        this.level = 1;
        this.nextState = nextState;
    }

    Skipper.prototype = Object.create(DefaultHandler.prototype, {
        constructor: {value: Skipper}
    });

    Skipper.prototype.startElement = function(namespaceURI, localName, qName, attributes) {
        this.level++;
    }

    Skipper.prototype.endElement = function(namespaceURI, localName, qName) {
        this.level--;
        if (this.level == 0)
            this.nextState.set();
    }

    Skipper.prototype.comment = function(value) {
    }


    function EmptyContentState() {
        State.call(this);
    }

    EmptyContentState.prototype = Object.create(State.prototype, {
        constructor: {value: EmptyContentState}
    });

    EmptyContentState.prototype.createChildState = function(localName) {
        parent.error('expected_empty', localName);
        return null;
    }

    EmptyContentState.prototype.makePattern = function() {}

    EmptyContentState.prototype.end = function() {
        if (this.comments != null) {
            if (this.annotations == null)
                this.annotations = parent.schemaBuilder.makeAnnotations(null, parent.getContext());
            this.annotations.addComment(this.comments);
            this.comments = null;
        }
        this.parent.endPatternChild(this.makePattern());
    }


    function PatternContainerState() {
        State.call(this);
        this.childPatterns = [];
    }

    PatternContainerState.prototype = Object.create(State.prototype, {
        constructor: {value: PatternContainerState}
    });

    PatternContainerState.prototype.createChildState = function(localName) {
        var state = parent.patternMap[localName];
        return state.create();
    }

    PatternContainerState.prototype.buildPattern = function(patterns, loc, anno) {
        if (patterns.length == 1) {
            return patterns[0];
        }
        return parent.schemaBuilder.makeGroup(patterns, loc, anno);
    }

    PatternContainerState.prototype.endPatternChild = function(pattern) {
        // todo remove debug
        if (pattern === undefined)
            throw 'Undefined pattern';
        this.childPatterns.push(pattern);
    }

    PatternContainerState.prototype.endForeignChild = function(ea) {
        var nChildPatterns = this.childPatterns.length;
        if (nChildPatterns == 0)
            State.prototype.endForeignChild.call(this, ea);
        else
            this.childPatterns[nChildPatterns - 1] =
                parent.schemaBuilder.annotateAfterPattern(this.childPatterns[nChildPatterns - 1], ea);

    }

    PatternContainerState.prototype.end = function() {
        if (this.childPatterns.length == 0) {
            parent.error('missing_children');
            this.endPatternChild(parent.schemaBuilder.makeErrorPattern());
        }
        if (this.comments != null) {
            var nChildPatterns = this.childPatterns.length;
            this.childPatterns[nChildPatterns - 1] =
                parent.schemaBuilder.commentAfterPattern(this.childPatterns[nChildPatterns - 1], this.comments);
            this.comments = null;
        }
        this.sendPatternToParent(this.buildPattern(this.childPatterns, this.startLocation, this.annotations));
    }

    PatternContainerState.prototype.sendPatternToParent = function(pattern) {
        this.parent.endPatternChild(pattern);
    }


    function GroupState() {
        PatternContainerState.call(this);
    }

    GroupState.prototype = Object.create(PatternContainerState.prototype);

    GroupState.prototype.create = function() {
        return new GroupState();
    }


    function ZeroOrMoreState() {
        PatternContainerState.call(this);
    }

    ZeroOrMoreState.prototype = Object.create(PatternContainerState.prototype);

    ZeroOrMoreState.prototype.create = function() {
        return new ZeroOrMoreState();
    }

    ZeroOrMoreState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeZeroOrMore(PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }


    function OneOrMoreState() {
        PatternContainerState.call(this);
    }

    OneOrMoreState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: OneOrMoreState}
    });

    OneOrMoreState.prototype.create = function() {
        return new OneOrMoreState();
    }

    OneOrMoreState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeOneOrMore(PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }

    function OptionalState() {
        PatternContainerState.call(this);
    }

    OptionalState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: OptionalState}
    });

    OptionalState.prototype.create = function() {
        return new OptionalState();
    }

    OptionalState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeOptional(PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }


    function ListState() {
        PatternContainerState.call(this);
    }

    ListState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: ListState}
    });

    ListState.prototype.create = function() {
        return new ListState();
    }

    ListState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeList(PatternContainerState.prototype.buildPattern.call(this, patterns, loc, anno), loc, anno);
    }


    function ChoiceState() {
        PatternContainerState.call(this);
    }

    ChoiceState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: ChoiceState}
    });

    ChoiceState.prototype.create = function() {
        return new ChoiceState();
    }

    ChoiceState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeChoice(patterns, loc, anno);
    }


    function InterleaveState() {
        PatternContainerState.call(this);
    }

    InterleaveState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: InterleaveState}
    });

    InterleaveState.prototype.create = function() {
        return new InterleaveState();
    }

    InterleaveState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeInterleave(patterns, loc, anno);
    }


    function MixedState() {
        PatternContainerState.call(this);
    }

    MixedState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: MixedState}
    });

    MixedState.prototype.create = function() {
        return new MixedState();
    }

    MixedState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeMixed(PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }

    function ElementState() {
        PatternContainerState.call(this);
        this.nameClass = null;
        this.nameClassWasAttribute = false;
        this.name = null;
    }

    ElementState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: ElementState}
    });

    ElementState.prototype.setName = function(name) {
        this.name = name;
    }

    ElementState.prototype.setNameClass = function(nameClass) {
        this.nameClass = nameClass;
    }

    ElementState.prototype.endAttributes = function() {
        if (this.name != null) {
            this.nameClass = parent.expandName(this.name, this.getNs(), null);
            this.nameClassWasAttribute = true;
        } else {
            new NameClassChildState(this, this).set();
        }
    }

    ElementState.prototype.create = function() {
        return new ElementState();
    }

    ElementState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeElement(this.nameClass, PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }

    ElementState.prototype.endForeignChild = function(elementAnnotation) {
        if (this.nameClassWasAttribute || this.childPatterns.length > 0 || this.nameClass == null) {
            PatternContainerState.prototype.endForeignChild.call(this, elementAnnotation);
        } else {
            this.nameClass = parent.schemaBuilder.annotateAfterNameClass(this.nameClass, elementAnnotation);
        }
    }

    function RootState(grammar, scope, ns) {
        PatternContainerState.call(this);
        if (arguments.length > 0) {
            this.grammar = grammar;
            this.scope = scope;
            this.nsInherit = ns;
            this.datatypeLibrary = '';
        }
    }

    RootState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: RootState}
    });

    RootState.prototype.toRootState = function() {
        return this;
    }

    RootState.prototype.create = function() {
        return new RootState();
    }

    RootState.prototype.createChildState = function(localName) {
        if (this.grammar == null)
            return PatternContainerState.prototype.createChildState.call(this, localName);
        if (localName == 'grammar')
            return new MergeGrammarState(this.grammar);
        parent.error('expected_grammar', localName);
        return null;
    }

    RootState.prototype.checkForeignElement = function() {
        parent.error('root_bad_namespace_uri', WellKnownNamespaces.RELAX_NG);
    }

    RootState.prototype.endPatternChild = function(pattern) {
        parent.startPattern = pattern;
    }

    function NotAllowedState() {
        EmptyContentState.call(this);
    }

    NotAllowedState.prototype = Object.create(EmptyContentState.prototype, {
        constructor: {value: NotAllowedState}
    });

    NotAllowedState.prototype.create = function() {
        return new NotAllowedState();
    }

    NotAllowedState.prototype.makePattern = function() {
        return parent.schemaBuilder.makeNotAllowed(this.startLocaton, this.annotations);
    }


    function EmptyState() {
        EmptyContentState.call(this);
    }

    EmptyState.prototype = Object.create(EmptyContentState.prototype, {
        constructor: {value: EmptyState}
    });

    EmptyState.prototype.create = function() {
        return new EmptyState();
    }

    EmptyState.prototype.makePattern = function() {
        return parent.schemaBuilder.makeEmpty(this.startLocaton, this.annotations);
    }


    function TextState() {
        EmptyContentState.call(this);
    }

    TextState.prototype = Object.create(EmptyContentState.prototype, {
        constructor: {value: TextState}
    });

    TextState.prototype.create = function() {
        return new TextState();
    }

    TextState.prototype.makePattern = function() {
        return parent.schemaBuilder.makeText(this.startLocaton, this.annotations);
    }


    function ValueState() {
        EmptyContentState.call(this);
        this.type = null;
        this.buf = "";
    }

    ValueState.prototype = Object.create(EmptyContentState.prototype, {
        constructor: {value: ValueState}
    });

    ValueState.prototype.create = function() {
        return new ValueState();
    }

    ValueState.prototype.setOtherAttribute = function(name, value) {
        if (name === "type")
            this.type = parent.checkNCName(value.trim());
        else
            EmptyContentState.prototype.setOtherAttribute.call(this, name, value);
    }

    ValueState.prototype.characters = function(ch, start, len) {
        this.buf += ch.substring(start, start + len);
    }

    ValueState.prototype.checkForeignElement = function() {
        parent.error("value_contains_foreign_element");
    }

    ValueState.prototype.end = function() {
        this.mergeLeadingComments();
        EmptyContentState.prototype.end.call(this);
    }

    ValueState.prototype.makePattern = function() {
        var type, datatypeLibrary;
        if (this.type == null) {
            datatypeLibrary = "";
            type = "token";
        } else {
            datatypeLibrary = this.datatypeLibrary;
            type = this.type;
        }
        return schemaBuilder.makeValue(datatypeLibrary,
            type,
            this.buf,
            parent.getContext(),
            this.getNs(),
            this.startLocation,
            this.annotations);
    }

    function DataState() {
        State.call(this);
        this.type = null;
        this.except = null;
        this.dpb = null;
    }

    DataState.prototype = Object.create(State.prototype, {
        constructor: {value: DataState}
    });

    DataState.prototype.create = function() {
        return new DataState();
    }

    DataState.prototype.createChildState = function(localName) {
        if (localName == "param") {
            if (this.except != null)
                parent.error("param_after_except");
            return new ParamState(this.dpb);
        }
        if (localName == "except") {
            if (this.except != null)
                parent.error("multiple_except");
            return new ChoiceState();
        }
        parent.error("expected_param_except", localName);
        return null;
    }

    DataState.prototype.setOtherAttribute = function(name, value) {
        if (name === "type")
            this.type = parent.checkNCName(value.trim());
        else
            State.prototype.setOtherAttribute.call(this, name, value);
    }

    DataState.prototype.endAttributes = function() {
        if (this.type == null)
            parent.error("missing_type_attribute");
        else
            this.dpb = parent.schemaBuilder.makeDataPatternBuilder(this.datatypeLibrary, this.type, this.startLocation);

    }

    DataState.prototype.endForeignChild = function(ea) {
        this.dpb.annotation(ea);
    }

    DataState.prototype.end = function() {
        var p;
        if (this.dpb != null) {
            if (this.except != null)
                p = this.dpb.makePattern(this.except, this.startLocation, this.annotations);
            else
                p = this.dpb.makePattern(this.startLocation, this.annotations);
        }
        else
            p = parent.schemaBuilder.makeErrorPattern();
        // XXX need to capture comments
        this.parent.endPatternChild(p);
    }


    function ParamState(dpb) {
        State.call(this);
        this.dpb = dpb;
        this.buf = "";
        this.name = null;
    }

    ParamState.prototype = Object.create(State.prototype, {
        constructor: {value: ParamState}
    });

    ParamState.prototype.create = function() {
        return new ParamState();
    }

    ParamState.prototype.setName = function(name) {
        this.name = parent.checkNCName(name);
    }

    ParamState.prototype.endAttributes = function() {
        if (this.name == null)
            parent.error("missing_name_attribute");
    }

    ParamState.prototype.createChildState = function(localName) {
        parent.error("expected_empty", localName);
        return null;
    }

    ParamState.prototype.characters = function(ch, start, len) {
        this.buf += ch.substring(start, start + len);
    }

    ParamState.prototype.checkForeignElement = function() {
        parent.error("param_contains_foreign_element");
    }

    ParamState.prototype.end = function() {
        if (this.name == null)
            return;
        if (this.dpb == null)
            return;
        this.mergeLeadingComments();
        this.dpb.addParam(this.name, this.buf, parent.getContext(), this.getNs(), this.startLocation, this.annotations);
    }


    function AttributeState() {
        PatternContainerState.call(this);
        this.nameClass = null;
        this.nameClassWasAttribute = false;
        this.name = null;
    }

    AttributeState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: AttributeState}
    });

    AttributeState.prototype.create = function() {
        return new AttributeState();
    }

    AttributeState.prototype.setName = function(name) {
        this.name = name;
    }

    AttributeState.prototype.setNameClass = function(nc) {
        this.nameClass = nc;
    }

    AttributeState.prototype.endAttributes = function() {
        if (this.name != null) {
            var nsUse;
            if (this.ns != null)
                nsUse = this.ns;
            else
                nsUse = "";
            this.nameClass = parent.expandName(this.name, nsUse, null);
            this.nameClassWasAttribute = true;
        }
        else
            new NameClassChildState(this, this).set();
    }

    AttributeState.prototype.endForeignChild = function(ea) {
        if (this.nameClassWasAttribute || this.childPatterns.length > 0 || this.nameClass == null)
            PatternContainerState.prototype.endForeignChild.call(this, ea);
        else
            this.nameClass = parent.schemaBuilder.annotateAfterNameClass(this.nameClass, ea);
    }

    AttributeState.prototype.end = function() {
        if (this.childPatterns.length == 0)
            this.endPatternChild(parent.schemaBuilder.makeText(this.startLocation, null));
        PatternContainerState.prototype.end.call(this);
    }

    AttributeState.prototype.buildPattern = function(patterns, loc, anno) {
        return parent.schemaBuilder.makeAttribute(this.nameClass,
            PatternContainerState.prototype.buildPattern.call(this, patterns, loc, null), loc, anno);
    }

    AttributeState.prototype.createChildState = function(localName) {
        var tem = PatternContainerState.prototype.createChildState.call(this, localName);
        if (tem != null && this.childPatterns.length != 0)
            parent.error("attribute_multi_pattern");
        return tem;
    }


    function GrammarSectionState(section) {
        State.call(this);
        if (arguments.length > 0) {
            this.section = section;
        } else {
            this.section = null;
        }
    }

    GrammarSectionState.prototype = Object.create(State.prototype);

    GrammarSectionState.prototype.create = function() {
        return new GrammarSectionState(null);
    }

    GrammarSectionState.prototype.createChildState = function(localName) {
        if (localName == 'define')
            return new DefineState(this.section);
        if (localName == 'start')
            return new StartState(this.section);
        if (localName == 'include') {
            var include = this.section.makeInclude();
            if (include != null)
                return new IncludeState(include);
        }
        if (localName == 'div')
            return new DivState(this.section.makeDiv());
        parent.error('expected_define', localName);
        return null;
    }

    function DivState(div) {
        GrammarSectionState.call(this, div);
        this.div = div;
    }

    DivState.prototype = Object.create(GrammarSectionState.prototype, {
        constructor: {value: DivState}
    });

    DivState.prototype.end = function() {
        GrammarSectionState.prototype.end.call(this);
        this.div.endDiv();
    }


    function GrammarState() {
        GrammarSectionState.call(this);
    }

    GrammarState.prototype = Object.create(GrammarSectionState.prototype, {
        constructor: {value: GrammarSectionState}
    });

    GrammarState.prototype.setParent = function(p) {
        GrammarSectionState.prototype.setParent.call(this, p);
        this.grammar = parent.schemaBuilder.makeGrammar(this.scope);
        this.section = this.grammar;
        this.scope = this.grammar;
    }

    GrammarState.prototype.create = function() {
        return new GrammarState();
    }

    GrammarState.prototype.end = function() {
        GrammarSectionState.prototype.end.call(this);
        this.parent.endPatternChild(this.grammar.endGrammar(this.startLocation, this.annotations));
    }

    function RefState() {
        EmptyContentState.call(this);
        this.name = null;
    }

    RefState.prototype = Object.create(EmptyContentState.prototype, {
        constructor: {value: RefState}
    });

    RefState.prototype.create = function() {
        return new RefState();
    }

    RefState.prototype.endAttributes = function() {
        if (this.name == null)
            parent.error('missing_name_attribute');
    }

    RefState.prototype.setName = function(name) {
        this.name = parent.checkNCName(name);
    }

    RefState.prototype.makePattern = function() {
        if (this.name == null)
            return parent.schemaBuilder.makeErrorPattern();
        return this.scope.makeRef(this.name, this.startLocation, this.annotations);
    }
    // todo ParentRefState
    // todo ExternalRefState


    function DefinitionState(section) {
        PatternContainerState.call(this);
        this.combine = null;
        this.section = section;
    }

    DefinitionState.prototype = Object.create(PatternContainerState.prototype, {
        constructor: {value: DefinitionState}
    });

    DefinitionState.prototype.setOtherAttribute = function(name, value) {
        if (name == 'combine') {
            value = value.trim();
            if (value == 'choice')
                this.combine = GrammarSection.COMBINE_CHOICE;
            else if (value == 'interleave')
                this.combine = GrammarSection.COMBINE_INTERLEAVE;
            else
                parent.error('combine_attribute_bad_value', value);
        } else
            PatternContainerState.prototype.setOtherAttribute.call(this, name, value);
    }

    function DefineState(section) {
        DefinitionState.call(this, section);
        this.name = null;
    }

    DefineState.prototype = Object.create(DefinitionState.prototype);

    DefineState.prototype.create = function() {
        return new DefineState(null);
    }

    DefineState.prototype.setName = function(name) {
        this.name = parent.checkNCName(name);
    }

    DefineState.prototype.endAttributes = function() {
        if (this.name == null)
            parent.error('missing_name_attribute');
    }

    DefineState.prototype.sendPatternToParent = function(pattern) {
        if (this.name != null)
            this.section.define(this.name, this.combine, pattern/*, startLocation, annotations*/);
    }

    function StartState(section) {
        DefinitionState.call(this, section);
    }

    StartState.prototype = Object.create(DefinitionState.prototype, {
        constructor: {value: StartState}
    });

    StartState.prototype.create = function() {
        return new StartState(null);
    }

    StartState.prototype.sendPatternToParent = function(pattern) {
        this.section.define(GrammarSection.START, this.combine, pattern/*, startLocation, annotations*/);
    }

    StartState.prototype.createChildState = function(localName) {
        var tem = DefinitionState.prototype.createChildState.call(this, localName);
        if (tem != null && this.childPatterns != 0)
            parent.error('start_multi_pattern');
        return tem;
    }

    /**
     * @abstract
     * @constructor
     */
    function NameClassContainerState() {
        State.call(this);
    }

    NameClassContainerState.prototype = Object.create(State.prototype, {
        constructor: {value: NameClassContainerState}
    });

    NameClassContainerState.prototype.createChildState = function(localName) {
        var state = parent.nameClassMap[localName];
        if (state == null) {
            parent.error("expected_name_class", localName);
            return null;
        }
        return state.create();
    }


    function NameClassChildState(prevState, nameClassRef) {
        NameClassContainerState.call(this);
        this.prevState = prevState;
        this.nameClassRef = nameClassRef;
        this.setParent(prevState.parent);
        this.ns = prevState.ns;
    }

    NameClassChildState.prototype = Object.create(NameClassContainerState.prototype, {
        constructor: {value: NameClassChildState}
    });

    NameClassChildState.prototype.create = function() {
        return null;
    }

    NameClassChildState.prototype.endNameClassChild = function(nameClass) {
        this.nameClassRef.setNameClass(nameClass);
        this.prevState.set();
    }

    NameClassChildState.prototype.endForeignChild = function(ea) {
        this.prevState.endForeignChild(ea);
    }

    NameClassChildState.prototype.end = function() {
        this.nameClassRef.setNameClass(schemaBuilder.makeErrorNameClass());
        parent.error("missing_name_class");
        this.prevState.set();
        this.prevState.end();
    }


    function NameClassBaseState() {
        State.call(this);
    }

    NameClassBaseState.prototype = Object.create(State.prototype, {
        constructor: {value: NameClassBaseState}
    });

    /**
     * @abstract
     */
    NameClassBaseState.prototype.makeNameClass = function() {}

    NameClassBaseState.prototype.end = function() {
        this.parent.endNameClassChild(this.makeNameClass());
    }


    function NameState() {
        NameClassBaseState.call(this);
        this.buf = "";
    }

    NameState.prototype = Object.create(NameClassBaseState.prototype, {
        constructor: {value: NameState}
    });

    NameState.prototype.createChildState = function(localName) {
        parent.error("expected_name", localName);
        return null;
    }

    NameState.prototype.create = function() {
        return new NameState();
    }

    NameState.prototype.characters = function(ch, start, len) {
        this.buf += ch.substring(start, start + len);
    }

    NameState.prototype.checkForeignElement = function() {
        parent.error("name_contains_foreign_element");
    }

    NameState.prototype.makeNameClass = function() {
        this.mergeLeadingComments();
        return parent.expandName(this.buf.trim(), this.getNs(), this.annotations);
    }


    function AnyNameState() {
        NameClassBaseState.call(this);
        this.except = null;
    }

    AnyNameState.prototype = Object.create(NameClassBaseState.prototype, {
        constructor: {value: AnyNameState}
    });

    AnyNameState.prototype.create = function() {
        return new AnyNameState();
    }

    AnyNameState.prototype.createChildState = function(localName) {
        if (localName === "except") {
            if (this.except != null)
                parent.error("multiple_except");
            return new NameClassChoiceState(this.getContext());
        }
        parent.error("expected_except", localName);
        return null;
    }

    AnyNameState.prototype.getContext = function() {
        return parent.ANY_NAME_CONTEXT;
    }

    AnyNameState.prototype.makeNameClass = function() {
        if (this.except == null)
            return this.makeNameClassNoExcept();
        else
            return this.makeNameClassExcept(this.except);
    }

    AnyNameState.prototype.makeNameClassNoExcept = function() {
        return parent.schemaBuilder.makeAnyName(this.startLocation, this.annotations);
    }

    AnyNameState.prototype.makeNameClassExcept = function() {
        return parent.schemaBuilder.makeAnyNameExceptName(this.except, this.startLocation, this.annotations);
    }

    AnyNameState.prototype.endNameClassChild = function(nameClass) {
        this.except = nameClass;
    }


    function NsNameState() {
        AnyNameState.call(this);
    }

    NsNameState.prototype = Object.create(AnyNameState.prototype, {
        constructor: {value: NsNameState}
    });

    NsNameState.prototype.create = function() {
        return new NsNameState();
    }

    NsNameState.prototype.makeNameClassNoExcept = function() {
        return parent.schemaBuilder.makeNsName(this.getNs(), null, null);
    }

    NsNameState.prototype.makeNameClassExcept = function(except) {
        return schemaBuilder.makeNsNameExceptName(this.getNs(), except, null, null);
    }

    NsNameState.prototype.getContext = function() {
        return parent.NS_NAME_CONTEXT;
    }


    function NameClassChoiceState(context) {
        NameClassContainerState.call(this);
        this.nameClasses = [];
        if (context !== undefined)
            this.context = context;
        else
            this.context = parent.PATTERN_CONTEXT;
    }

    NameClassChoiceState.prototype = Object.create(NameClassContainerState.prototype, {
        constructor: {value: NameClassChoiceState}
    });

    NameClassChoiceState.prototype.create = function() {
        return new NameClassChoiceState();
    };

    NameClassChoiceState.prototype.toNameClassChoiceState = function() {
        return this;
    };

    NameClassChoiceState.prototype.setParent = function(parent) {
        NameClassContainerState.prototype.setParent.call(this, parent);
        var parentChoice = parent.toNameClassChoiceState();
        if (parentChoice != null)
            this.context = parentChoice.context;
    };

    NameClassChoiceState.prototype.createChildState = function(localName) {
        if (localName == "anyName") {
            if (this.context >= parent.ANY_NAME_CONTEXT) {
                parent.error(this.context == parent.ANY_NAME_CONTEXT
                    ? "any_name_except_contains_any_name"
                    : "ns_name_except_contains_any_name");
                return null;
            }
        }
        else if (localName == "nsName") {
            if (this.context == parent.NS_NAME_CONTEXT) {
                parent.error("ns_name_except_contains_ns_name");
                return null;
            }
        }
        return NameClassContainerState.prototype.createChildState.call(this, localName);
    };

    NameClassChoiceState.prototype.endNameClassChild = function(nc) {
        this.nameClasses.push(nc);
    };

    NameClassChoiceState.prototype.endForeignChild = function(ea) {
        var nNameClasses = this.nameClasses.length;
        if (nNameClasses == 0)
            NameClassContainerState.prototype.endForeignChild.call(this, ea);
        else
            this.nameClasses[nNameClasses - 1] =
                parent.schemaBuilder.annotateAfterNameClass(this.nameClasses[nNameClasses - 1], ea);

    };

    NameClassChoiceState.prototype.end = function() {
        if (this.nameClasses.length == 0) {
            parent.error("missing_name_class");
            this.parent.endNameClassChild(parent.schemaBuilder.makeErrorNameClass());
            return;
        }
        if (this.comments != null) {
            var nNameClasses = this.nameClasses.length;
            this.nameClasses[nNameClasses - 1] =
                parent.schemaBuilder.commentAfterNameClass(this.nameClasses[nNameClasses - 1], this.comments);
            comments = null;
        }
        this.parent.endNameClassChild(parent.schemaBuilder.makeNameClassChoice(this.nameClasses, this.startLocation, this.annotations));

    };


    SchemaParser.prototype.initPatternTable = function() {
        this.patternMap = {};
        this.patternMap['zeroOrMore'] = new ZeroOrMoreState();
        this.patternMap['oneOrMore'] = new OneOrMoreState();
        this.patternMap['optional'] = new OptionalState();
        this.patternMap['list'] = new ListState();
        this.patternMap['choice'] = new ChoiceState();
        this.patternMap['interleave'] = new InterleaveState();
        this.patternMap['group'] = new GroupState();
        this.patternMap['mixed'] = new MixedState();
        this.patternMap['element'] = new ElementState();
        this.patternMap['attribute'] = new AttributeState();
        this.patternMap['empty'] = new EmptyState();
        this.patternMap['text'] = new TextState();
        this.patternMap['value'] = new ValueState();
        this.patternMap['data'] = new DataState();
        this.patternMap['notAllowed'] = new NotAllowedState();
        this.patternMap['grammar'] = new GrammarState();
        this.patternMap['ref'] = new RefState();
// todo        this.patternMap['parentRef'] = new ParentRefState();
// todo        this.patternMap['externalRef'] = new ExternalRefState();
    }

    SchemaParser.prototype.initNameClassTable = function() {
        this.nameClassMap = {};
        this.nameClassMap['name'] = new NameState();
        this.nameClassMap['anyName'] = new AnyNameState();
        this.nameClassMap['nsName'] = new NsNameState();
        this.nameClassMap['choice'] = new NameClassChoiceState();
    }

    SchemaParser.prototype.getParsedPattern = function() {
        if (this.hadError)
            throw new IllegalSchemaException();
        return this.startPattern;
    }

    SchemaParser.prototype.error = function(key) {
        var e = new SAXParseException(this.localizer.message(key,
            Array.prototype.splice.call(arguments, 1)), this.locator);
        this.hadError = true;
        if (this.errorHandler != null)
            this.errorHandler.error(e);
    }

    SchemaParser.prototype.getContext = function() {
        return this.context;
    }

    SchemaParser.prototype.expandName = function(name, ns, annotations) {
        var colonIndex = name.indexOf(':');
        if (colonIndex == -1)
            return parent.schemaBuilder.makeName(ns, this.checkNCName(name), null, null, annotations);
        var prefix = this.checkNCName(name.substring(0, colonIndex));
        var localName = this.checkNCName(name.substring(colonIndex + 1));
        for (var tem = this.context.prefixMapping; tem != null; tem = tem.next)
            if (tem.prefix === prefix)
                return this.schemaBuilder.makeName(tem.uri, localName, prefix, null, annotations);
        this.error("undefined_prefix", prefix);
        return this.schemaBuilder.makeName("", localName, null, null, annotations);
    }

    SchemaParser.prototype.findPrefix = function(qName, uri) {
        var prefix = null;
        if (qName == null || qName == "") {
            for (var p = context.prefixMapping; p != null; p = p.next)
            if (p.uri == uri) {
                prefix = p.prefix;
                break;
            }
        }
        else {
            var off = qName.indexOf(':');
            if (off > 0)
                prefix = qName.substring(0, off);
        }
        return prefix;
    }

    SchemaParser.prototype.checkNCName = function(string) {
        //if (!Naming.isNcname(string))
        //    parent.error('invalid_ncname', string);
        return string;
    }

    SchemaParser.prototype.makeLocation = function() {
        if (this.locator == null)
            return null;
        return this.schemaBuilder.makeLocation(this.locator.getSystemId(),
            this.locator.getLineNumber(),
            this.locator.getColumnNumber());
    }

    SchemaParser.prototype.PATTERN_CONTEXT = 0;
    SchemaParser.prototype.ANY_NAME_CONTEXT = 1;
    SchemaParser.prototype.NS_NAME_CONTEXT = 2;

    this.relaxngURI = WellKnownNamespaces.RELAX_NG;
    this.localizer = new Localizer();
    this.startPattern = null;
    this.locator = null;
    this.context = new ContextImpl();
    this.hadError = false;

    this.xmlReader = xmlReader;
    this.errorHandler = errorHandler;
    this.schemaBuilder = schemaBuilder;

    this.patternMap = null;
    this.nameClassMap = null;

    this.initPatternTable();
    this.initNameClassTable();
    new RootState(grammar, scope, SchemaBuilder.INHERIT_NS).set();
}

exports.SchemaParser = SchemaParser;
},{"./CommentListImpl":19,"./Localizer":41,"./SAXParseException":74,"./xml/util/WellKnownNamespaces":178}],78:[function(require,module,exports){
var PatternBuilder = require('./PatternBuilder').PatternBuilder;
var UnexpandedNotAllowedPattern = require('./UnexpandedNotAllowedPattern').UnexpandedNotAllowedPattern;
var TextPattern = require('./TextPattern').TextPattern;
var ElementPattern = require('./ElementPattern').ElementPattern;
var AttributePattern = require('./AttributePattern').AttributePattern;
var ErrorPattern = require('./ErrorPattern').ErrorPattern;
var ValuePattern = require('./ValuePattern').ValuePattern;
var ListPattern = require('./ListPattern').ListPattern;
var DataPattern = require('./DataPattern').DataPattern;
var DataExceptPattern = require('./DataExceptPattern').DataExceptPattern;
var PatternInterner = require('./PatternInterner').PatternInterner;
var Datatype = require('./relaxng/datatype/Datatype').Datatype;

function SchemaPatternBuilder() {
    PatternBuilder.call(this);
    this.idTypes = false;
    this.unexpandedNotAllowed = new UnexpandedNotAllowedPattern();
    this.text = new TextPattern();
    this.schemaInterner = new PatternInterner();
}

SchemaPatternBuilder.prototype = Object.create(PatternBuilder.prototype);

SchemaPatternBuilder.prototype.hasIdTypes = function() {
    return this.idTypes;
}

SchemaPatternBuilder.prototype.makeElement = function(nameClass, content) {
    var pattern = new ElementPattern(nameClass, content);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeAttribute = function(nameClass, value) {
    if (value === this.notAllowed)
        return value;
    var pattern = new AttributePattern(nameClass, value);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeData = function(datatype, datatypeName, parameters) {
    this.noteDatatype(datatype);
    var pattern = new DataPattern(datatype, datatypeName, parameters);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeDataExcept = function(datatype, datatypeName, parameters, except) {
    this.noteDatatype(datatype);
    var pattern = new DataExceptPattern(datatype, datatypeName, parameters, except);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeValue = function(datatype, datatypeName, value, stringValue) {
    this.noteDatatype(datatype);
    var pattern = new ValuePattern(datatype, datatypeName, value, stringValue);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeText = function() {
    return this.text;
}

SchemaPatternBuilder.prototype.makeOneOrMore = function(pattern) {
    if (pattern === this.text)
        return pattern;
    return PatternBuilder.prototype.makeOneOrMore.call(this, pattern);
}

SchemaPatternBuilder.prototype.makeUnexpandedNotAllowed = function() {
    return this.unexpandedNotAllowed;
}

SchemaPatternBuilder.prototype.makeError = function() {
    var pattern = new ErrorPattern();
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeChoice = function(pattern1, pattern2) {
    if (pattern1 == this.notAllowed || pattern1 == pattern2)
        return pattern2;
    if (pattern2 == this.notAllowed)
        return pattern1;
    return PatternBuilder.prototype.makeChoice.call(this, pattern1, pattern2);
}

SchemaPatternBuilder.prototype.makeList = function(pattern) {
    if (pattern == this.notAllowed)
        return pattern;
    pattern = new ListPattern(pattern);
    return this.schemaInterner.intern(pattern);
}

SchemaPatternBuilder.prototype.makeMixed = function(pattern) {
    return this.makeInterleave(this.text, pattern);
}

SchemaPatternBuilder.prototype.noteDatatype = function(datatype) {
    if (datatype.getIdType() != Datatype.ID_TYPE_NULL)
        this.idTypes = true;
}

exports.SchemaPatternBuilder = SchemaPatternBuilder;
},{"./AttributePattern":10,"./DataExceptPattern":25,"./DataPattern":26,"./ElementPattern":29,"./ErrorPattern":34,"./ListPattern":40,"./PatternBuilder":56,"./PatternInterner":57,"./TextPattern":88,"./UnexpandedNotAllowedPattern":90,"./ValuePattern":94,"./relaxng/datatype/Datatype":167}],79:[function(require,module,exports){
var NameClass = require('./NameClass').NameClass;
/**
 *
 * @param {Name} name
 * @class
 * @implements NameClass
 */
function SimpleNameClass(name) {
    this.name = name;
}

SimpleNameClass.prototype = Object.create(NameClass.prototype,
    {constructor: {value: SimpleNameClass}});

SimpleNameClass.prototype.contains = function(name) {
    return this.name.equals(name);
}

SimpleNameClass.prototype.containsSpecificity = function(name) {
    return this.contains(name) ? this.SPECIFICITY_NAME : this.SPECIFICITY_NONE;
}

SimpleNameClass.prototype.equals = function(object) {
    if (object == null || !(object instanceof SimpleNameClass))
        return false;
    return this.name.equals(object.name);
}

SimpleNameClass.prototype.getName = function() {
    return this.name;
}

SimpleNameClass.prototype.accept = function(visitor) {
    visitor.visitName(this.name);
}

SimpleNameClass.prototype.isOpen = function() {
    return false;
}

exports.SimpleNameClass = SimpleNameClass;
},{"./NameClass":43}],80:[function(require,module,exports){
var DataDerivType = require('./DataDerivType').DataDerivType;

function SingleDataDerivType() {
    this.memo = null;
}

SingleDataDerivType.prototype = Object.create(DataDerivType.prototype, {
    constructor: {value: SingleDataDerivType}
});

SingleDataDerivType.prototype.dataDeriv = function(builder, p, str, vc, fail) {
    if (this.memo == null)
    // this type never adds any failures
        this.memo = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, null);
    return this.memo;
}

SingleDataDerivType.prototype.copy = function() {
    return new SingleDataDerivType();
}

SingleDataDerivType.prototype.combine = function(ddt) {
    return ddt;
}

exports.SingleDataDerivType = SingleDataDerivType;
},{"./DataDerivType":23}],81:[function(require,module,exports){
var StartTagOpenDerivFunction = require('./StartTagOpenDerivFunction').StartTagOpenDerivFunction;
var ApplyAfterFunction = require('./ApplyAfterFunction').ApplyAfterFunction;

/**
 *
 * @param name
 * @param builder
 * @class
 * @extends StartTagOpenDerivFunction
 */
function StartAttributeDerivFunction(name, builder) {
    StartTagOpenDerivFunction.call(this, name, builder);
}

StartAttributeDerivFunction.prototype = Object.create(StartTagOpenDerivFunction.prototype, {
    constructor: {value: StartAttributeDerivFunction}
});


StartAttributeDerivFunction.prototype.caseElement = function(p) {
    return this.getPatternBuilder().makeNotAllowed();
}


StartAttributeDerivFunction.prototype.caseGroup = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    return this.getPatternBuilder().makeChoice(
        this.memoApply(p1).apply((function(builder){
            function Function(builder){
                ApplyAfterFunction.call(this, builder);
            }
            Function.prototype = Object.create(ApplyAfterFunction.prototype);
            Function.prototype.apply = function(x) {
                return builder.makeGroup(x, p2);
            }
            return new Function(builder);
        })(this.builder)),
        this.memoApply(p2).apply((function(builder){
            function Function(builder){
                ApplyAfterFunction.call(this, builder);
            }
            Function.prototype = Object.create(ApplyAfterFunction.prototype);
            Function.prototype.apply = function(x) {
                return builder.makeGroup(p1, x);
            }
            return new Function(builder);
        })(this.builder)));
}


StartAttributeDerivFunction.prototype.caseAttribute = function(p) {
    if (!p.getNameClass().contains(this.getName()))
        return this.getPatternBuilder().makeNotAllowed();
    return this.getPatternBuilder().makeAfter(p.getContent(),
        this.getPatternBuilder().makeEmpty());
}


StartAttributeDerivFunction.prototype.apply = function(memo) {
    return memo.startAttributeDeriv(this);
}

exports.StartAttributeDerivFunction = StartAttributeDerivFunction;
},{"./ApplyAfterFunction":8,"./StartTagOpenDerivFunction":82}],82:[function(require,module,exports){
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var ApplyAfterFunction = require('./ApplyAfterFunction').ApplyAfterFunction;

function StartTagOpenDerivFunction(name, builder) {
    this.name = name;
    this.builder = builder;
}

StartTagOpenDerivFunction.prototype = Object.create(AbstractPatternFunction.prototype);

StartTagOpenDerivFunction.prototype.caseChoice = function(p) {
    return this.builder.makeChoice(this.memoApply(p.getOperand1()),
        this.memoApply(p.getOperand2()));
}

StartTagOpenDerivFunction.prototype.caseGroup = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    var tem = this.memoApply(p1).apply(new function(builder){
        var f = new ApplyAfterFunction(builder);
        f.apply = function(x) {
            return this.builder.makeGroup(x, p2);
        };
        return f;
    }(this.builder));
    return p1.isNullable() ? this.builder.makeChoice(tem, this.memoApply(p2)) : tem;
}

StartTagOpenDerivFunction.prototype.caseInterleave = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    return this.builder.makeChoice(
        this.memoApply(p1).apply(new function(builder){
            var f = new ApplyAfterFunction(builder);
            f.apply = function(x) {
                return this.builder.makeInterleave(x, p2);
            };
            return f;
        }(this.builder)),
        this.memoApply(p2).apply(new function(builder){
            var f = new ApplyAfterFunction(builder);
            f.apply = function(x) {
                return this.builder.makeInterleave(p1, x);
            };
            return f;
        }(this.builder)));
}

StartTagOpenDerivFunction.prototype.caseAfter = function(p) {
    var p1 = p.getOperand1();
    var p2 = p.getOperand2();
    return this.memoApply(p1).apply(new function(builder){
        var f = new ApplyAfterFunction(builder);
        f.apply = function(x) {
            return this.builder.makeAfter(x, p2);
        };
        return f;
    }(this.builder));
}

StartTagOpenDerivFunction.prototype.caseOneOrMore = function(p) {
    var p1 = p.getOperand();
    return this.memoApply(p1).apply((function(builder){
        function Function(builder){
            ApplyAfterFunction.call(this, builder);
        }
        Function.prototype = Object.create(ApplyAfterFunction.prototype);
        Function.prototype.apply = function(x) {
            return this.builder.makeGroup(x, this.builder.makeOptional(p));
        }
        return new Function(builder);
    })(this.builder));
}

StartTagOpenDerivFunction.prototype.caseElement = function(p) {
    if (!p.getNameClass().contains(this.name))
        return this.builder.makeNotAllowed();
    return this.builder.makeAfter(p.getContent(), this.builder.makeEmpty());
}

StartTagOpenDerivFunction.prototype.caseOther = function(p) {
    return this.builder.makeNotAllowed();
}

StartTagOpenDerivFunction.prototype.memoApply = function(p) {
    return this.apply(this.builder.getPatternMemo(p)).getPattern();
}

StartTagOpenDerivFunction.prototype.apply = function(memo) {
    return memo.startTagOpenDeriv(null, this);
}

StartTagOpenDerivFunction.prototype.getName = function(p) {
    return this.name;
}

StartTagOpenDerivFunction.prototype.getPatternBuilder = function(p) {
    return this.builder;
}

exports.StartTagOpenDerivFunction = StartTagOpenDerivFunction;
},{"./AbstractPatternFunction":2,"./ApplyAfterFunction":8}],83:[function(require,module,exports){
var StartTagOpenDerivFunction = require('./StartTagOpenDerivFunction').StartTagOpenDerivFunction;

function StartTagOpenRecoverDerivFunction(name, builder) {
    StartTagOpenDerivFunction.call(this, name, builder);
}

StartTagOpenRecoverDerivFunction.prototype = Object.create(StartTagOpenDerivFunction.prototype,
    {constructor: {value: StartTagOpenRecoverDerivFunction}});

StartTagOpenRecoverDerivFunction.prototype.caseGroup = function(p) {
    var tem = StartTagOpenDerivFunction.prototype.caseGroup.call(this, p);
    if (p.getOperand1().isNullable())
        return tem;
    return this.builder.makeChoice(tem, this.memoApply(p.getOperand2()));
}

StartTagOpenRecoverDerivFunction.prototype.apply = function(memo) {
    return memo.startTagOpenRecoverDeriv(null, this);
}

exports.StartTagOpenRecoverDerivFunction = StartTagOpenRecoverDerivFunction;
},{"./StartTagOpenDerivFunction":82}],84:[function(require,module,exports){
var Datatype = require('./relaxng/datatype/Datatype').Datatype;

function StringDatatype() {}

StringDatatype.prototype.isValid = function(str, vc) {
    return true;
}

StringDatatype.prototype.checkValid = function(str, vc) {
    if (!this.isValid(str, vc))
        throw new DatatypeException();
}

StringDatatype.prototype.createValue = function(str, vc) {
    return str;
}

StringDatatype.prototype.isContextDependent = function() {
    return false;
}

StringDatatype.prototype.alwaysValid = function() {
    return true;
}

StringDatatype.prototype.getIdType = function() {
    return this.ID_TYPE_NULL;
}

StringDatatype.prototype.sameValue = function(obj1, obj2) {
    return obj1 === obj2;
}

StringDatatype.prototype.valueHashCode = function(obj) {
    console.log('hashcode!');
    return JSON.stringify(obj);
}

StringDatatype.prototype.createStreamingValidator = function(vc) {
    return new StreamingValidatorImpl(this, vc);
}

exports.StringDatatype = StringDatatype;
},{"./relaxng/datatype/Datatype":167}],85:[function(require,module,exports){
function StringNormalizer() {}

StringNormalizer.normalize = function(s) {
    return s.split(/[ \r\n\t]+/).join(" ");
};

StringNormalizer.prototype.normalize = StringNormalizer.normalize;

exports.StringNormalizer = StringNormalizer;
},{}],86:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;

function StringPattern() {
    Pattern.call(this, false,  this.DATA_CONTENT_TYPE);
}

StringPattern.prototype = Object.create(Pattern.prototype, {
    constructor: {value: StringPattern}
});

exports.StringPattern = StringPattern;
},{"./Pattern":55}],87:[function(require,module,exports){
var EndAttributesFunction = require('./EndAttributesFunction').EndAttributesFunction;

/**
 *
 * @param {ValidatorPatternBuilder} builder
 * @class
 * @extends {EndAttributesFunction}
 */
function TextOnlyFunction(builder) {
    EndAttributesFunction.call(this, builder);
}

TextOnlyFunction.prototype = Object.create(EndAttributesFunction.prototype);

TextOnlyFunction.prototype.caseAttribute = function(p) {
    return p;
}

TextOnlyFunction.prototype.caseElement = function(p) {
    return this.getPatternBuilder().makeNotAllowed();
}

TextOnlyFunction.prototype.memoApply = function(memo) {
    return memo.textOnly(this);
}

exports.TextOnlyFunction = TextOnlyFunction;
},{"./EndAttributesFunction":31}],88:[function(require,module,exports){
var Pattern = require('./Pattern').Pattern;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;

function TextPattern() {
    Pattern.call(this, true, this.MIXED_CONTENT_TYPE);
}

TextPattern.prototype = Object.create(Pattern.prototype, {
    constructor: {value: TextPattern}
});

TextPattern.prototype.samePattern = function(other) {
    return other instanceof TextPattern;
}

TextPattern.prototype.apply = function(patternFunction) {
    return patternFunction.caseText(this);
}

TextPattern.prototype.checkRestrictions = function(context) {
    switch (context) {
        case this.DATA_EXCEPT_CONTEXT:
            throw new RestrictionViolationException("data_except_contains_text");
        case this.START_CONTEXT:
            throw new RestrictionViolationException("start_contains_text");
        case this.LIST_CONTEXT:
            throw new RestrictionViolationException("list_contains_text");
    }
}

exports.TextPattern = TextPattern;
},{"./Pattern":55,"./RestrictionViolationException":71}],89:[function(require,module,exports){
var StringDatatype = require('./StringDatatype').StringDatatype;
var StringNormalizer = require('./StringNormalizer').StringNormalizer;


function TokenDatatype(){
    StringDatatype.call(this);
}

TokenDatatype.prototype = Object.create(StringDatatype.prototype, {
    constructor: {value: TokenDatatype}
})

TokenDatatype.prototype.createValue = function(str, vc) {
    return StringNormalizer.normalize(str);
}

exports.TokenDatatype = TokenDatatype;
},{"./StringDatatype":84,"./StringNormalizer":85}],90:[function(require,module,exports){
var NotAllowedPattern = require('./NotAllowedPattern').NotAllowedPattern;

function UnexpandedNotAllowedPattern() {
    NotAllowedPattern.call(this);
}

UnexpandedNotAllowedPattern.prototype = Object.create(NotAllowedPattern.prototype);

UnexpandedNotAllowedPattern.prototype.isNotAllowed = function() {
    return false;
}

UnexpandedNotAllowedPattern.prototype.expand = function(patternBuilder) {
    return patternBuilder.makeNotAllowed();
}

exports.UnexpandedNotAllowedPattern = UnexpandedNotAllowedPattern;
},{"./NotAllowedPattern":49}],91:[function(require,module,exports){
var NameClassNormalizer = require('./NameClassNormalizer').NameClassNormalizer;
var ChoiceNameClass = require('./ChoiceNameClass').ChoiceNameClass;
var NullNameClass = require('./NullNameClass').NullNameClass;

function UnionNameClassNormalizer() {
    NameClassNormalizer.call(new NullNameClass());
}

UnionNameClassNormalizer.prototype = Object.create(NameClassNormalizer.prototype, {
    constructor: {value: UnionNameClassNormalizer}
});

UnionNameClassNormalizer.prototype.add = function(nameClass) {
    this.setNameClass(new ChoiceNameClass(this.getNameClass(), nameClass));
};

exports.UnionNameClassNormalizer = UnionNameClassNormalizer;
},{"./ChoiceNameClass":17,"./NameClassNormalizer":44,"./NullNameClass":52}],92:[function(require,module,exports){
var PatternBuilder = require('./PatternBuilder').PatternBuilder;
var PatternMemo = require('./PatternMemo').PatternMemo;
var ChoicePattern = require('./ChoicePattern').ChoicePattern;
var AfterPattern = require('./AfterPattern').AfterPattern;
var AbstractPatternFunction = require('./AbstractPatternFunction').AbstractPatternFunction;
var EndAttributesFunction = require('./EndAttributesFunction').EndAttributesFunction;
var IgnoreMissingAttributesFunction = require('./IgnoreMissingAttributesFunction').IgnoreMissingAttributesFunction;
var EndTagDerivFunction = require('./EndTagDerivFunction').EndTagDerivFunction;
var TextOnlyFunction = require('./TextOnlyFunction').TextOnlyFunction;
var MixedTextDerivFunction = require('./MixedTextDerivFunction').MixedTextDerivFunction;
var RecoverAfterFunction = require('./RecoverAfterFunction').RecoverAfterFunction;
var RequiredElementsFunction = require('./RequiredElementsFunction').RequiredElementsFunction;
var RequiredAttributesFunction = require('./RequiredAttributesFunction').RequiredAttributesFunction;
var DataDerivTypeFunction = require('./DataDerivTypeFunction').DataDerivTypeFunction;
var PossibleStartTagNamesFunction = require('./PossibleStartTagNamesFunction').PossibleStartTagNamesFunction;
var PossibleAttributeNamesFunction = require('./PossibleAttributeNamesFunction').PossibleAttributeNamesFunction;

var VoidValue = require('./VoidValue').VoidValue;
/**
/**
 *
 * @param {PatternBuilder} builder
 * @class
 * @extends PatternBuilder
 */

var NoteChoicesFunction;
var RemoveChoicesFunction;

function ValidatorPatternBuilder(builder) {
    PatternBuilder.call(this, builder);

    var parent = this;
    NoteChoicesFunction = function() {};

    NoteChoicesFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
        constructor: {value: NoteChoicesFunction}
    });

    NoteChoicesFunction.prototype.caseOther = function(p) {
        parent.choiceMap.push(p);
        return VoidValue.VOID;
    };

    NoteChoicesFunction.prototype.caseChoice = function(p) {
        p.getOperand1().apply(this);
        p.getOperand2().apply(this);
        return VoidValue.VOID;
    };

    RemoveChoicesFunction = function() {};

    RemoveChoicesFunction.prototype = Object.create(AbstractPatternFunction.prototype, {
        constructor: {value: RemoveChoicesFunction}
    });

    RemoveChoicesFunction.prototype.caseOther = function(p) {
        if (parent.choiceMap.indexOf(p) > -1)
            return parent.notAllowed;
        return p;
    };

    RemoveChoicesFunction.prototype.caseChoice = function(p) {
        var p1 = p.getOperand1().apply(this);
        var p2 = p.getOperand2().apply(this);
        if (p1 == p.getOperand1() && p2 == p.getOperand2())
            return p;
        if (p1 == parent.notAllowed)
            return p2;
        if (p2 == parent.notAllowed)
            return p1;
        var p3 = new ChoicePattern(p1, p2);
        return parent.interner.intern(p3);
    };

    this.choiceMap = [];
    this.endAttributesFunction = new EndAttributesFunction(this);
    this.ignoreMissingAttributesFunction = new IgnoreMissingAttributesFunction(this);
    this.endTagDerivFunction = new EndTagDerivFunction(this);
    this.mixedTextDerivFunction = new MixedTextDerivFunction(this);
    this.textOnlyFunction = new TextOnlyFunction(this);
    this.recoverAfterFunction = new RecoverAfterFunction(this);
    this.dataDerivTypeFunction = new DataDerivTypeFunction(this);

    this.removeChoicesFunction = new RemoveChoicesFunction();
    this.noteChoicesFunction = new NoteChoicesFunction();
    this.requiredElementsFunction = new RequiredElementsFunction();
    this.requiredAttributesFunction = new RequiredAttributesFunction();
    this.possibleStartTagNamesFunction = new PossibleStartTagNamesFunction();
    this.possibleAttributeNamesFunction = new PossibleAttributeNamesFunction();
}

ValidatorPatternBuilder.prototype = Object.create(PatternBuilder.prototype,
    {constructor: {value: ValidatorPatternBuilder}});

ValidatorPatternBuilder.prototype.getPatternMemo = function(p) {
    var memo = null;// todo this.patternMemoMap.get(p);
    if (memo == null) {
        memo = new PatternMemo(p, this);
        // patternMemoMap.put(p, memo);
    }
    return memo;
}

ValidatorPatternBuilder.prototype.getEndAttributesFunction = function() {
    return this.endAttributesFunction;
}

ValidatorPatternBuilder.prototype.getIgnoreMissingAttributesFunction = function() {
    return this.ignoreMissingAttributesFunction;
}

ValidatorPatternBuilder.prototype.getRequiredElementsFunction = function() {
    return this.requiredElementsFunction;
}

ValidatorPatternBuilder.prototype.getRequiredAttributesFunction = function() {
    return this.requiredAttributesFunction;
}

ValidatorPatternBuilder.prototype.getPossibleStartTagNamesFunction = function() {
    return this.possibleStartTagNamesFunction;
}

ValidatorPatternBuilder.prototype.getPossibleAttributeNamesFunction = function() {
    return this.possibleAttributeNamesFunction;
}

ValidatorPatternBuilder.prototype.getEndTagDerivFunction = function() {
    return this.endTagDerivFunction;
}

ValidatorPatternBuilder.prototype.getMixedTextDerivFunction = function() {
    return this.mixedTextDerivFunction;
}

ValidatorPatternBuilder.prototype.getTextOnlyFunction = function() {
    return this.textOnlyFunction;
}

ValidatorPatternBuilder.prototype.getRecoverAfterFunction = function() {
    return this.recoverAfterFunction;
}

ValidatorPatternBuilder.prototype.getDataDerivTypeFunction = function() {
    return this.dataDerivTypeFunction;
}

/**
 *
 * @param {Pattern} pattern1
 * @param {Pattern} pattern2
 * @return {Pattern}
 */
ValidatorPatternBuilder.prototype.makeAfter = function(p1, p2) {
    var p = new AfterPattern(p1, p2);
    return this.interner.intern(p);
}

/**
 *
 * @param {Pattern} pattern1
 * @param {Pattern} pattern2
 * @return {Pattern}
 */
ValidatorPatternBuilder.prototype.makeChoice = function(pattern1, pattern2) {
    if (pattern1 == pattern2)
        return pattern1;
    if (pattern1 == this.notAllowed)
        return pattern2;
    if (pattern2 == this.notAllowed)
        return pattern1;
    if (!(pattern1 instanceof ChoicePattern)) {
        if (pattern2.containsChoice(pattern1))
            return pattern2;
    }
    else if (!(pattern2 instanceof ChoicePattern)) {
        if (pattern1.containsChoice(pattern2))
            return pattern1;
    }
    else {
        pattern1.apply(this.noteChoicesFunction);
        pattern2 = pattern2.apply(this.removeChoicesFunction);
        if (this.choiceMap.length > 0)
            this.choiceMap.length = 0;
    }
    if (pattern1 instanceof AfterPattern && pattern2 instanceof AfterPattern) {
        if (pattern1.getOperand1() == pattern2.getOperand1())
            return this.makeAfter(pattern1.getOperand1(), this.makeChoice(pattern1.getOperand2(), pattern2.getOperand2()));
        if (pattern1.getOperand1() == this.notAllowed)
            return pattern2;
        if (pattern2.getOperand1() == this.notAllowed)
            return pattern1;
        if (pattern1.getOperand2() == pattern2.getOperand2())
            return this.makeAfter(this.makeChoice(pattern1.getOperand1(), pattern2.getOperand1()), pattern1.getOperand2());
    }
    return PatternBuilder.prototype.makeChoice.call(this, pattern1, pattern2);
}

exports.ValidatorPatternBuilder = ValidatorPatternBuilder;

},{"./AbstractPatternFunction":2,"./AfterPattern":3,"./ChoicePattern":18,"./DataDerivTypeFunction":24,"./EndAttributesFunction":31,"./EndTagDerivFunction":32,"./IgnoreMissingAttributesFunction":37,"./MixedTextDerivFunction":42,"./PatternBuilder":56,"./PatternMemo":61,"./PossibleAttributeNamesFunction":63,"./PossibleStartTagNamesFunction":65,"./RecoverAfterFunction":66,"./RequiredAttributesFunction":68,"./RequiredElementsFunction":69,"./TextOnlyFunction":87,"./VoidValue":95}],93:[function(require,module,exports){
var DataDerivType = require('./DataDerivType').DataDerivType;
var DatatypeValue = require('./DatatypeValue').DatatypeValue;

function ValueDataDerivType(dt, dtName) {
    DataDerivType.call(this);
    this.noValue = null;
    this.valueMap = null;
    this.dt = dt;
    this.dtName = dtName;
}

ValueDataDerivType.prototype = Object.create(DataDerivType.prototype, {
    constructor: {value: ValueDataDerivType}
});

ValueDataDerivType.prototype.copy = function() {
    return new ValueDataDerivType(this.dt, this.dtName);
}

ValueDataDerivType.prototype.dataDeriv = function(builder, p, str, vc, fail) {
    var value = this.dt.createValue(str, vc);
    if (value == null) {
        if (this.noValue == null)
            this.noValue = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        else if (fail != null && this.noValue.isNotAllowed()) {
            try {
                this.dt.checkValid(str, vc);
            }
            catch (e) {
                if (e instanceof DatatypeException)
                    fail.push(new DataDerivFailure(this.dt, this.dtName, e));
                else
                    throw e;
            }
        }
        return this.noValue;
    }
    else {
        var dtv = new DatatypeValue(value, this.dt);
        if (this.valueMap == null)
            this.valueMap = null;// todo new HashMap<DatatypeValue, PatternMemo>();
        var tem = null;//valueMap.get(dtv);
        if (tem == null) {
            tem = DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
            //this.valueMap.put(dtv, tem);
        }
        else if (tem.isNotAllowed() && fail != null)
            DataDerivType.prototype.dataDeriv.call(this, builder, p, str, vc, fail);
        return tem;
    }
}

ValueDataDerivType.prototype.combine = function(ddt) {
    if (ddt instanceof ValueDataDerivType) {
        if (ddt.dt == this.dt)
        return this;
    else
        return InconsistentDataDerivType.getInstance();
    }
    else
        return ddt.combine(this);
}

ValueDataDerivType.prototype.getDatatype = function() {
    return this.dt;
}

exports.ValueDataDerivType = ValueDataDerivType;
},{"./DataDerivType":23,"./DatatypeValue":27}],94:[function(require,module,exports){
var StringPattern = require('./StringPattern').StringPattern;
var RestrictionViolationException = require('./RestrictionViolationException').RestrictionViolationException;

function ValuePattern(dt, dtName, obj, stringValue) {
    StringPattern.call(this);
    this.dt = dt;
    this.dtName = dtName;
    this.obj = obj;
    this.stringValue = stringValue;
}

ValuePattern.prototype = Object.create(StringPattern.prototype, {
    constructor: {value: ValuePattern}
});

ValuePattern.prototype.samePattern = function(other) {
    if (this.constructor != other.constructor)
        return false;
    if (!(other instanceof ValuePattern))
        return false;
    return (this.dt.equals(other.dt)
    && this.dt.sameValue(this.obj, other.obj));
}

ValuePattern.prototype.apply = function(f) {
    return f.caseValue(this);
}

ValuePattern.prototype.checkRestrictions = function(context, dad, alpha) {
    switch (context) {
        case this.START_CONTEXTT:
            throw new RestrictionViolationException("start_contains_value");
    }
}

ValuePattern.prototype.getDatatype = function() {
    return this.dt;
}

ValuePattern.prototype.getDatatypeName = function() {
    return this.dtName;
}

ValuePattern.prototype.getValue = function() {
    return this.obj;
}

ValuePattern.prototype.getStringValue = function() {
    return this.stringValue;
}

exports.ValuePattern = ValuePattern;
},{"./RestrictionViolationException":71,"./StringPattern":86}],95:[function(require,module,exports){
/**
 *
 * @interface
 */
function VoidValue () {}

VoidValue.VOID = new VoidValue();

exports.VoidValue = VoidValue;
},{}],96:[function(require,module,exports){
var Datatype = require('./../relaxng/datatype/Datatype').Datatype;
/**
 *
 * @interface
 * @extends Datatype
 */
function Datatype2() {}

Datatype2.prototype = Object.create(Datatype.prototype, {
    constructor: {value: Datatype2}
});

Datatype2.prototype.alwaysValid = function() {};

exports.Datatype2 = Datatype2;
},{"./../relaxng/datatype/Datatype":167}],97:[function(require,module,exports){
var TokenDatatype = require('./TokenDatatype').TokenDatatype;

function CdataDatatype() {
    TokenDatatype.call(this, this.WHITE_SPACE_REPLACE);
}

CdataDatatype.prototype = Object.create(TokenDatatype.prototype, {
    constructor: {value: CdataDatatype}
});

exports.CdataDatatype = CdataDatatype;
},{"./TokenDatatype":107}],98:[function(require,module,exports){
var Datatype2 = require('../Datatype2').Datatype2;
var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;


function DatatypeBase(whiteSpace) {
    if (whiteSpace !== undefined)
        this.whiteSpace = whiteSpace;
    else
        this.whiteSpace = this.WHITE_SPACE_COLLAPSE;
}

DatatypeBase.prototype = Object.create(Datatype2.prototype, {
    constructor: {value: DatatypeBase}
});

DatatypeBase.WHITE_SPACE_PRESERVE = 0;
DatatypeBase.WHITE_SPACE_REPLACE = 1;
DatatypeBase.WHITE_SPACE_COLLAPSE = 2;

DatatypeBase.prototype.WHITE_SPACE_PRESERVE = DatatypeBase.WHITE_SPACE_PRESERVE;
DatatypeBase.prototype.WHITE_SPACE_REPLACE = DatatypeBase.WHITE_SPACE_REPLACE;
DatatypeBase.prototype.WHITE_SPACE_COLLAPSE = DatatypeBase.WHITE_SPACE_COLLAPSE;

DatatypeBase.prototype.isValid = function(str, vc) {
    str = this.normalizeWhiteSpace(str);
    return this.lexicallyAllows(str) && this.allowsValue(str, vc);
};

DatatypeBase.prototype.checkValid = function(str, vc) {
    str = this.normalizeWhiteSpace(str);
    this.checkLexicallyAllows(str);
    this.getValue(str, vc);
};

DatatypeBase.prototype.normalizeWhiteSpace = function (str) {
    switch (this.whiteSpace) {
        case this.WHITE_SPACE_COLLAPSE:
            return this.collapseWhiteSpace(str);
        case this.WHITE_SPACE_REPLACE:
            return this.replaceWhiteSpace(str);
    }
    return str;
};

DatatypeBase.prototype.checkLexicallyAllows = function(str) {
    if (!this.lexicallyAllows(str))
        throw this.createLexicallyInvalidException();
};

DatatypeBase.prototype.getDescriptionForRestriction = function() {
    return this.getLexicalSpaceDescription(this.getLexicalSpaceKey());
};

DatatypeBase.prototype.createLexicallyInvalidException = function () {
    return new DatatypeException(this.localizer().message("lexical_violation",
        this.getLexicalSpaceDescription(this.getLexicalSpaceKey())));
};

DatatypeBase.prototype.getLexicalSpaceDescription = function(key) {
    return this.localizer().message("lexical_space_" + key);
};

DatatypeBase.prototype.getLexicalSpaceKey = function() {};

DatatypeBase.prototype.allowsValue = function(str, vc) {
    try {
        this.getValue(str, vc);
        return true;
    }
    catch (e) {
        if (e instanceof DatatypeException)
            return false;
        else
            throw e;
    }
};

DatatypeBase.prototype.getValue = function() {};

DatatypeBase.prototype.collapseWhiteSpace = function(s) {
    return s.replace(/[ \r\n\t]+/, " ");
};

DatatypeBase.prototype.replaceWhiteSpace = function(s) {
    return s.replace(/[\r\n\t]/, " ");
};

DatatypeBase.prototype.getValue = function() {};


DatatypeBase.prototype.alwaysValid = function() {
    return false;
};

DatatypeBase.prototype.getIdType = function() {
    return this.ID_TYPE_NULL;
};

DatatypeBase.prototype.sameValue = function(value1, value2) {
    return value1 === value2;
};

DatatypeBase.prototype.createStreamingValidator = function(vc) {
    return new StreamingValidatorImpl(this, vc);
};

DatatypeBase.prototype.localizer = function() {
    var DatatypeBuilderImpl = require('./DatatypeBuilderImpl').DatatypeBuilderImpl;
    return DatatypeBuilderImpl.localizer;
}

exports.DatatypeBase = DatatypeBase;
},{"../../relaxng/datatype/DatatypeException":168,"../Datatype2":96,"./DatatypeBuilderImpl":99}],99:[function(require,module,exports){
var Localizer = require('../../Localizer').Localizer;
var DatatypeException  = require('../../relaxng/datatype/DatatypeException').DatatypeException;
var PatternRestrictDatatype = require('./PatternRestrictDatatype').PatternRestrictDatatype;

function DatatypeBuilderImpl(library, base) {
    this.library = library;
    this.base = base;
}

DatatypeBuilderImpl.localizer = new Localizer(DatatypeBuilderImpl.name);

DatatypeBuilderImpl.prototype.localizer = DatatypeBuilderImpl.localizer;

DatatypeBuilderImpl.prototype.addParameter = function(name, value, context) {
    // todo implement
    if (name === "pattern")
        this.addPatternParam(value);
    else if (name === "minInclusive")
        this.addMinInclusiveParam(value, context);
    else if (name === "maxInclusive")
        this.addMaxInclusiveParam(value, context);
    else if (name === "minExclusive")
        this.addMinExclusiveParam(value, context);
    else if (name === "maxExclusive")
        this.addMaxExclusiveParam(value, context);
    else if (name === "length")
        this.addLengthParam(value);
    else if (name === "minLength")
        this.addMinLengthParam(value);
    else if (name === "maxLength")
        this.addMaxLengthParam(value);
    else if (name === "fractionDigits")
        this.addScaleParam(value);
    else if (name === "totalDigits")
        this.addPrecisionParam(value);
    else if (name === "enumeration")
        this.error("enumeration_param");
    else if (name === "whiteSpace")
        this.error("whiteSpace_param");
    else
        this.error("unrecognized_param", name);
};

DatatypeBuilderImpl.prototype.addPatternParam = function(value) {
    try {
        this.base = new PatternRestrictDatatype(this.base, new RegExp(value), value);
    }
    catch (e) {
        if (e instanceof SyntaxError)
            this.error("invalid_regex", e.message);
        else
            throw e;
    }
};

DatatypeBuilderImpl.prototype.createDatatype = function() {
    return this.base;
};

DatatypeBuilderImpl.prototype.error = function(key, args, pos) {
    // todo pos
    throw new DatatypeException(this.localizer.message(key, args));
};

exports.DatatypeBuilderImpl = DatatypeBuilderImpl;
},{"../../Localizer":41,"../../relaxng/datatype/DatatypeException":168,"./PatternRestrictDatatype":104}],100:[function(require,module,exports){
var WellKnownNamespaces = require('../../xml/util/WellKnownNamespaces').WellKnownNamespaces;
var DatatypeLibraryImpl = require('./DatatypeLibraryImpl').DatatypeLibraryImpl;

function DatatypeLibraryFactoryImpl() {
    this.datatypeLibrary = null;
}

DatatypeLibraryFactoryImpl.prototype.createDatatypeLibrary = function(uri) {
    if (WellKnownNamespaces.XML_SCHEMA_DATATYPES === uri) {
        if (this.datatypeLibrary == null)
            this.datatypeLibrary = new DatatypeLibraryImpl();
        return this.datatypeLibrary;
    }
    return null;
};

exports.DatatypeLibraryFactoryImpl = DatatypeLibraryFactoryImpl;
},{"../../xml/util/WellKnownNamespaces":178,"./DatatypeLibraryImpl":101}],101:[function(require,module,exports){
var DatatypeBuilderImpl = require('./DatatypeBuilderImpl').DatatypeBuilderImpl;
var StringDatatype = require('./StringDatatype').StringDatatype;
var CdataDatatype = require('./CdataDatatype').CdataDatatype;
var TokenDatatype = require('./TokenDatatype').TokenDatatype;
var NCNameDatatype = require('./NCNameDatatype').NCNameDatatype;

var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;

function DatatypeLibraryImpl() {
    this.typeMap = {};

    this.typeMap["string"] = new StringDatatype();
    this.typeMap["normalizedString"] = new CdataDatatype();
    this.typeMap["token"] = new TokenDatatype();
    this.typeMap["NCName"] = new NCNameDatatype();
}

DatatypeLibraryImpl.prototype.createDatatypeBuilder = function(localName) {
    var base = this.typeMap[localName];
    if (base == null)
        throw new DatatypeException();
    return new DatatypeBuilderImpl(this, base);
};

DatatypeLibraryImpl.createDatatype = function(type) {
    return this.createDatatypeBuilder(type).createDatatype();
};

exports.DatatypeLibraryImpl = DatatypeLibraryImpl;
},{"../../relaxng/datatype/DatatypeException":168,"./CdataDatatype":97,"./DatatypeBuilderImpl":99,"./NCNameDatatype":102,"./StringDatatype":106,"./TokenDatatype":107}],102:[function(require,module,exports){
var NameDatatype = require('./NameDatatype').NameDatatype;
var Naming = require('../../xml/util/Naming').Naming;

function NCNameDatatype() {
    NameDatatype.call(this);
}

NCNameDatatype.prototype = Object.create(NameDatatype.prototype, {
    constructor: {value: NCNameDatatype}
});

NCNameDatatype.prototype.lexicallyAllows = function(str) {
    return Naming.isNcname(str);
};

NCNameDatatype.prototype.getLexicalSpaceKey = function() {
    return "ncname";
};

exports.NCNameDatatype = NCNameDatatype;
},{"../../xml/util/Naming":177,"./NameDatatype":103}],103:[function(require,module,exports){
var TokenDatatype = require('./TokenDatatype').TokenDatatype;

function NameDatatype() {
    TokenDatatype.call(this);
}

NameDatatype.prototype = Object.create(TokenDatatype.prototype, {
    constructor: {value: NameDatatype}
});

NameDatatype.prototype.getLength = function(obj) {
    // Surrogates are not possible in an Name.
    return obj.length;
};

NameDatatype.prototype.alwaysValid = function() {
    return false;
};

NameDatatype.prototype.getLexicalSpaceKey = function() {
    return "name";
};

exports.NameDatatype = NameDatatype;

},{"./TokenDatatype":107}],104:[function(require,module,exports){
var RestrictDatatype = require('./RestrictDatatype').RestrictDatatype;
var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;

function PatternRestrictDatatype(base, pattern, patternString) {
    RestrictDatatype.call(this, base);
    this.pattern = pattern;
    this.patternString = patternString;
}

PatternRestrictDatatype.prototype = Object.create(RestrictDatatype.prototype, {
    constructor: {value: RestrictDatatype}
});

PatternRestrictDatatype.prototype.lexicallyAllows = function(str) {
    return this.pattern.test(str) && RestrictDatatype.prototype.lexicallyAllows.call(this, str);
};

PatternRestrictDatatype.prototype.checkLexicallyAllows = function(str) {
    RestrictDatatype.prototype.checkLexicallyAllows.call(this, str);
    if (!this.pattern.test(str))
        throw new DatatypeException(this.localizer().message("pattern_violation",
            this.getDescriptionForRestriction(),
            this.patternString));
};

exports.PatternRestrictDatatype = PatternRestrictDatatype;
},{"../../relaxng/datatype/DatatypeException":168,"./RestrictDatatype":105}],105:[function(require,module,exports){
var DatatypeBase = require('./DatatypeBase').DatatypeBase;

function RestrictDatatype(base, whiteSpace) {
    if (whiteSpace !== undefined)
        DatatypeBase.call(this, whiteSpace);
    else
        DatatypeBase.call(this, this.whiteSpace);
    this.base = base;
}

RestrictDatatype.prototype = Object.create(DatatypeBase.prototype, {
    constructor: {value: DatatypeBase}
});

RestrictDatatype.prototype.lexicallyAllows = function(str) {
    return this.base.lexicallyAllows(str);
};

RestrictDatatype.prototype.checkLexicallyAllows = function(str) {
    this.base.checkLexicallyAllows(str);
};

RestrictDatatype.prototype.getLexicalSpaceKey = function() {
    return this.base.getLexicalSpaceKey();
};

RestrictDatatype.prototype.getOrderRelation = function() {
    return this.base.getOrderRelation();
};

RestrictDatatype.prototype.getMeasure = function() {
    return this.base.getMeasure();

};

RestrictDatatype.prototype.getIdType = function() {
    return this.base.getIdType();
};

RestrictDatatype.prototype.sameValue = function(value1, value2) {
    return this.base.sameValue(value1, value2);
};

RestrictDatatype.prototype.getValue = function(str, vc) {
    return this.base.getValue(str, vc);
};

exports.RestrictDatatype = RestrictDatatype;
},{"./DatatypeBase":98}],106:[function(require,module,exports){
var TokenDatatype = require('./TokenDatatype').TokenDatatype;

function StringDatatype() {
    TokenDatatype.call(this.WHITE_SPACE_PRESERVE);
}

StringDatatype.prototype = Object.create(TokenDatatype.prototype, {
    constructor: {value: StringDatatype}
});

exports.StringDatatype = StringDatatype;
},{"./TokenDatatype":107}],107:[function(require,module,exports){
var DatatypeBase = require('./DatatypeBase').DatatypeBase;

function TokenDatatype(whiteSpace) {
    DatatypeBase.call(this, whiteSpace);
}

TokenDatatype.prototype = Object.create(DatatypeBase.prototype, {
    constructor: {value: TokenDatatype}
});

TokenDatatype.prototype.lexicallyAllows = function(str) {
    return true;
};

TokenDatatype.prototype.getLexicalSpaceKey = function() {
    return "string";
};

TokenDatatype.prototype.alwaysValid = function() {
    return true;
};

TokenDatatype.prototype.getValue = function(str, vc) {
    return str;
};

TokenDatatype.prototype.getMeasure = function() {
    return this;
};

TokenDatatype.prototype.getLength = function(obj) {
    return obj.length;
    // todo Utf16.isSurrogate1;
};

exports.TokenDatatype = TokenDatatype;
},{"./DatatypeBase":98}],108:[function(require,module,exports){
var AbstractRel = require('./AbstractRel').AbstractRel;

function ARel() {

}

ARel.prototype = Object.create(AbstractRel.prototype, {
    constructor: {value: ARel}
});

ARel.THE_INSTANCE = new ARel();

ARel.REGISTERED_TOKENS = [
    "#voverlay", // extension
    "acquaintance", // extension (Formats table)
    "alternate",
    "appendix", // HTML4
    "author",
    "bookmark",
    "category", // extension
    "chapter", // HTML4
    "child", // extension (Formats table)
    "co-resident", // extension (Formats table)
    "co-worker", // extension (Formats table)
    "colleague", // extension (Formats table)
    "contact", // extension (Formats table)
    "contents", // HTML4
    "copyright", // HTML4
    "crush", // extension (Formats table)
    "date", // extension (Formats table)
    "disclosure", // extension
    "discussion", // extension
    "external", // extension
    "friend", // extension (Formats table)
    "glossary", // HTML4
    "help",
    "home", // extension
    "http://docs.oasis-open.org/ns/cmis/link/200908/acl", // extension
    "index", // extension
    "issues", // extension
    "kin", // extension (Formats table)
    "license",
    "me", // extension (Formats table)
    "met", // extension (Formats table)
    "muse", // extension (Formats table)
    "neighbor", // extension (Formats table)
    "next",
    "nofollow",
    "noreferrer",
    "parent", // extension (Formats table)
    "prefetch",
    "prev",
    "previous", // HTML4
    "profile", // extension
    "publisher", // extension (Google Plus)
    "search",
    "section", // HTML4
    "sibling", // extension (Formats table)
    "sidebar", // extension
    "spouse", // extension (Formats table)
    "start", // HTML4
    "subsection", // HTML4
    "sweetheart", // extension (Formats table)
    "syndication", // extension
    "tag",
    "toc", // HTML4
    "transformation", // extension (Formats table) maybe an error?
    "widget" // extension
];

ARel.prototype.REGISTERED_TOKENS = ARel.REGISTERED_TOKENS;

ARel.prototype.isRegistered = function(token) {
    return this.REGISTERED_TOKENS.indexOf(token) >= 0;
};

ARel.prototype.getName = function() {
    return "link type valid for <a> and <area>";
};

exports.ARel = ARel;
},{"./AbstractRel":112}],109:[function(require,module,exports){
var Datatype = require('../../relaxng/datatype/Datatype').Datatype;
var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;
var Html5DatatypeException = require('./Html5DatatypeException').Html5DatatypeException;
//var DatatypeStreamingValidator = require('./DatatypeStreamingValidator').DatatypeStreamingValidator;

function AbstractDatatype() {

}

AbstractDatatype.prototype = Object.create(Datatype.prototype, {
    constructor: {value: AbstractDatatype}
});

/**
 * Calls <code>checkValid(CharSequence literal)</code>.
 * @param literal the value
 * @param context the validation context (ignored by subclasses)
 * @return <code>true</code> if valid and <code>false</code> if not
 * @see org.relaxng.datatype.Datatype#isValid(java.lang.String, org.relaxng.datatype.ValidationContext)
 */
AbstractDatatype.prototype.isValid = function(literal, context) {
    try {
        this.checkValid(literal);
    } catch (e) {
        if (e instanceof DatatypeException)
            return false;
        else
            throw e;
    }
    return true;
};

AbstractDatatype.prototype.checkValid = function(literal) {};

/**
 * Merely returns a <code>DatatypeStreamingValidatorImpl</code>.
 * @param context the validation context (ignored by subclasses)
 * @return An unoptimized <code>DatatypeStreamingValidator</code>
 * @see org.relaxng.datatype.Datatype#createStreamingValidator(org.relaxng.datatype.ValidationContext)
 */
AbstractDatatype.prototype.createStreamingValidator = function(context) {
    return new DatatypeStreamingValidator(this);
};

/**
 * Implements strict string equality semantics by returning <code>literal</code> 
 * itself.
 * @param literal the value (get returned)
 * @param context ignored
 * @return the <code>literal</code> that was passed in
 * @see org.relaxng.datatype.Datatype#createValue(java.lang.String, org.relaxng.datatype.ValidationContext)
 */
AbstractDatatype.prototype.createValue = function(literal, context) {
    return literal;
};

/**
 * Implements strict string equality semantics by performing a standard 
 * <code>equals</code> check on the arguments.
 * @param value1 an object returned by <code>createValue</code>
 * @param value2 another object returned by <code>createValue</code>
 * @return <code>true</code> if the values are equal, <code>false</code> otherwise
 * @see org.relaxng.datatype.Datatype#sameValue(java.lang.Object, java.lang.Object)
 */
AbstractDatatype.prototype.sameValue = function(value1, value2) {
    return value1 == value2;
};

/**
 * Implements strict stirng equality semantics by returning the 
 * <code>java.lang.Object</code>-level <code>hashCode</code> of 
 * the object.
 * @param value an object returned by <code>createValue</code>
 * @return the hash code
 * @see org.relaxng.datatype.Datatype#valueHashCode(java.lang.Object)
 */
AbstractDatatype.prototype.valueHashCode = function(value) {
    throw 'Not implemented';
};

/**
 * Always returns <code>Datatype.ID_TYPE_NULL</code>.
 * @return <code>Datatype.ID_TYPE_NULL</code>
 * @see org.relaxng.datatype.Datatype#getIdType()
 */
AbstractDatatype.prototype.getIdType = function() {
    return Datatype.ID_TYPE_NULL;
};

/**
 * Returns <code>false</code>
 * @return <code>false</code>
 * @see org.relaxng.datatype.Datatype#isContextDependent()
 */
AbstractDatatype.prototype.isContextDependent = function() {
    return false;
};

/**
 * Checks if a UTF-16 code unit represents a whitespace character (U+0020, 
 * U+0009, U+000C, U+000D or U+000A).
 * @param c the code unit
 * @return <code>true</code> if whitespace, <code>false</code> otherwise
 */
AbstractDatatype.prototype.isWhitespace = function(c) {
    return c == ' ' || c == '\t' || c == '\f' || c == '\n' || c == '\r';
};

AbstractDatatype.prototype.isAsciiDigit = function(c) {
    return c >= '0' && c <= '9';
};

AbstractDatatype.prototype.toAsciiLowerCase = function(str) {
    // todo optimize
    if (str == null) {
        return null;
    }
    str = str.split('');
    for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (c >= 'A' && c <= 'Z') {
            c = String.fromCharCode(c.charCodeAt(0) + 0x20);
        }
        str[i] = c;
    }
    return str.join('');
};

AbstractDatatype.prototype.getName = function() {};

AbstractDatatype.prototype.newDatatypeException = function(position, message, warning) {
    // todo
    return new Html5DatatypeException(this.getName(), position, message, warning);
};

// todo split

exports.AbstractDatatype = AbstractDatatype;
},{"../../relaxng/datatype/Datatype":167,"../../relaxng/datatype/DatatypeException":168,"./Html5DatatypeException":130}],110:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;
// todo
function AbstractDatetime() {

}

AbstractDatetime.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: AbstractDatetime}
});

exports.AbstractDatetime = AbstractDatetime;
},{"./AbstractDatatype":109}],111:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function AbstractInt() {

}

AbstractInt.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: AbstractInt}
});

AbstractInt.prototype.checkInt = function(literal, offset) {
    if (literal.length == 0) {
        throw this.newDatatypeException("The empty string is not a valid integer.");
    }
    var c = literal.charAt(0);
    if (!(c == '-' || this.isAsciiDigit(c))) {
        throw this.newDatatypeException(0, "Expected a minus sign or a digit but saw ", c, " instead.");
    }
    for (var i = 1; i < literal.length; i++) {
        c = literal.charAt(i);
        if (!this.isAsciiDigit(c)) {
            throw this.newDatatypeException(offset + i, "Expected a digit but saw ", c, " instead.");
        }
    }
};

AbstractInt.prototype.checkIntNonNegative = function(literal, offset) {
    if (literal.length == 0) {
        throw this.newDatatypeException("The empty string is not a valid non-negative integer.");
    }
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (!this.isAsciiDigit(c)) {
            throw this.newDatatypeException(offset + i, "Expected a digit but saw ", c, " instead.");
        }
    }
};

AbstractInt.prototype.checkIntPositive = function(literal, offset) {
    if (literal.length == 0) {
        throw this.newDatatypeException("The empty string is not a valid positive integer.");
    }
    var zero = true;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (!this.isAsciiDigit(c)) {
            throw this.newDatatypeException(offset + i, "Expected a digit but saw ", c, " instead.");
        }
        if (c != '0') {
            zero = false;
        }
    }
    if (zero) {
        throw this.newDatatypeException("Zero is not a positive integer.");
    }
};

exports.AbstractInt = AbstractInt;
},{"./AbstractDatatype":109}],112:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;
var Html5DatatypeLibrary = require('./Html5DatatypeLibrary').Html5DatatypeLibrary;

function AbstractRel() {

}

AbstractRel.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: AbstractRel}
});

AbstractRel.prototype.checkValid = function(literal) {
    // There are currently no registered rel tokens with a colon in them
    // so don't bother supporting the colon case until there are 
    // registered tokens with a colon.
    var tokensSeen = [];
    var string = "";
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (this.isWhitespace(c) && string.length > 0) {
            this.checkToken(string, i, tokensSeen);
            string = "";
        } else {
            string += c.toLowerCase();
        }
    }
    if (string.length > 0) {
        this.checkToken(string, literal.length, tokensSeen);
    }
};

AbstractRel.prototype.checkToken = function(token, i, tokensSeen) {
    if (tokensSeen.indexOf(token) !== -1) {
        throw this.newDatatypeException(i - 1, "Duplicate keyword ", token, ".");
    }
    tokensSeen.push(token);
    if (!this.isRegistered(token)) {
        try {
            var dl = new Html5DatatypeLibrary();
            var iri = dl.createDatatype("iri");
            iri.checkValid(token);
        } catch (e) {
            if (e instanceof DatatypeException)
                throw this.newDatatypeException(i - 1, "The string " + token + " is not a registered keyword or absolute URL.");
            else
                throw e;
        }
    }
};

AbstractRel.prototype.isRegistered = function(token) {};

exports.AbstractRel = AbstractRel;
},{"./AbstractDatatype":109,"./Html5DatatypeLibrary":131}],113:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function BrowsingContext() {

}

BrowsingContext.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: BrowsingContext}
});

BrowsingContext.THE_INSTANCE = new BrowsingContext();

BrowsingContext.prototype.checkValid = function(literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("Browsing context name must be at least one character long.");
    } else if (literal.charAt(0) == '_') {
        throw this.newDatatypeException("Browsing context name started with the underscore.");
    }
};

BrowsingContext.prototype.getName = function() {
    return "browsing context name";
};

exports.BrowsingContext = BrowsingContext;
},{"./AbstractDatatype":109}],114:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function BrowsingContextOrKeyword() {

}

BrowsingContextOrKeyword.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: BrowsingContextOrKeyword}
});

BrowsingContextOrKeyword.THE_INSTANCE = new BrowsingContextOrKeyword();

BrowsingContextOrKeyword.prototype.checkValid = function(literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("Browsing context name must be at least one character long.");
    }
    if (literal.charAt(0) == '_') {
        var kw = this.toAsciiLowerCase(literal.substring(1));
        if (!("blank" == kw || "self" == kw || "top" == kw || "parent" == kw)) {
            throw this.newDatatypeException("Reserved keyword ", kw, " used.");
        }
    }
};

BrowsingContextOrKeyword.prototype.getName = function() {
    return "browsing context name or keyword";
};

exports.BrowsingContextOrKeyword = BrowsingContextOrKeyword;
},{"./AbstractDatatype":109}],115:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function CdoCdcPair() {

}

CdoCdcPair.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: CdoCdcPair}
});

CdoCdcPair.THE_INSTANCE = new CdoCdcPair();

CdoCdcPair.prototype.State = {
    DATA: 0, LESS_THAN_SIGN: 1, LESS_THAN_SIGN_BANG: 2, LESS_THAN_SIGN_BANG_HYPHEN: 3,
        HAS_CDO: 4, HAS_CDO_AND_HYPHEN: 5, HAS_CDO_AND_DOUBLE_HYPHEN: 6
};

CdoCdcPair.prototype.checkValid = function (literal) {
    var state = this.State.DATA;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.DATA:
                if ('<' == c) {
                    state = this.State.LESS_THAN_SIGN;
                    continue;
                }
                continue;
            case this.State.LESS_THAN_SIGN:
                if ('!' == c) {
                    state = this.State.LESS_THAN_SIGN_BANG;
                    continue;
                }
                state = this.State.DATA;
                continue;
            case this.State.LESS_THAN_SIGN_BANG:
                if ('-' == c) {
                    state = this.State.LESS_THAN_SIGN_BANG_HYPHEN;
                    continue;
                }
                state = this.State.DATA;
                continue;
            case this.State.LESS_THAN_SIGN_BANG_HYPHEN:
                if ('-' == c) {
                    state = this.State.HAS_CDO;
                    continue;
                }
                state = this.State.DATA;
                continue;
            case this.State.HAS_CDO:
                if ('-' == c) {
                    state = this.State.HAS_CDO_AND_HYPHEN;
                    continue;
                }
                continue;
            case this.State.HAS_CDO_AND_HYPHEN:
                if ('-' == c) {
                    state = this.State.HAS_CDO_AND_DOUBLE_HYPHEN;
                    continue;
                }
                state = this.State.HAS_CDO;
                continue;
            case this.State.HAS_CDO_AND_DOUBLE_HYPHEN:
                if ('>' == c) {
                    state = this.State.DATA;
                    continue;
                } else if ('-' == c) {
                    continue;
                }
                state = this.State.HAS_CDO;
                continue;
            default:
                //assert false : state;
        }
    }
    if (state == this.State.HAS_CDO) {
        throw this.newDatatypeException("Content contains the character sequence \u201c<!--\u201d without"
            + " a later occurrence of the character sequence \u201c-->\u201d.");
    }
};

CdoCdcPair.prototype.getName = function () {
    return "text content with CDO-CDC pair";
};

exports.CdoCdcPair = CdoCdcPair;
},{"./AbstractDatatype":109}],116:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Charset() {

}

Charset.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:Charset}
});

Charset.THE_INSTANCE = new Charset();

Charset.prototype.checkValid = function (literal) {
// todo
};

Charset.prototype.getName = function () {
    return "encoding name";
};

exports.Charset = Charset;
},{"./AbstractDatatype":109}],117:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function Circle() {

}

Circle.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: Circle}
});

Circle.THE_INSTANCE = new Circle();

Circle.prototype.checkValid = function(literal) {
    var list = this.split(literal, ',');
    if (list.length != 3) {
        throw this.newDatatypeException("A circle must have three comma-separated integers.");
    }
    var withOffset = list[0];
    this.checkInt(withOffset.getSequence(), withOffset.getOffset());
    withOffset = list[1];
    this.checkInt(withOffset.getSequence(), withOffset.getOffset());
    withOffset = list[2];
    this.checkIntNonNegative(withOffset.getSequence(), withOffset.getOffset());
};

Circle.prototype.getName = function() {
    return "circle";
};

exports.Circle = Circle;
},{"./AbstractInt":111}],118:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

/**
 * This datatype shall accept strings that conform to the format specified for
 * <a href='http://whatwg.org/specs/web-forms/current-work/#date'><code>date</code></a>
 * inputs in Web Forms 2.0.
 * <p>This datatype must not accept the empty string.
 *
 * @version $Id$
 * @author hsivonen
 */
function Date() {

}

Date.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: Date}
});

Date.THE_INSTANCE = new Date();

Date.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-([0-9]{2})-([0-9]{2})$");

Date.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

Date.prototype.getName = function () {
    return "date";
};

exports.Date = Date;
},{"./AbstractDatetime":110}],119:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

function DateOrTime() {

}

DateOrTime.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: DateOrTime}
});

DateOrTime.THE_INSTANCE = new DateOrTime();

DateOrTime.prototype.THE_PATTERN = new RegExp("^(?:(?:([0-9]{4,})-([0-9]{2})-([0-9]{2})(?:[T ]([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?(?:Z|(?:([+-][0-9]{2}):([0-9]{2})))?)?)|(?:([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?(?:Z|(?:([+-][0-9]{2}):([0-9]{2})))?))$");
// XXX this is not per spec. outstanding feedback in Hixie's microformats-dates folder

DateOrTime.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

DateOrTime.prototype.getName = function () {
    return "date or time";
};

exports.DateOrTime = DateOrTime;
},{"./AbstractDatetime":110}],120:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

/**
 * This datatype shall accept strings that conform to the format specified for
 * <a href='http://whatwg.org/specs/web-forms/current-work/#datetime'><code>datetime</code></a>
 * inputs in Web Forms 2.0.
 * <p>This datatype must not accept the empty string.
 *
 * @version $Id$
 * @author hsivonen
 */
function Datetime() {

}

Datetime.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: Datetime}
});

Datetime.THE_INSTANCE = new Datetime();

Datetime.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-([0-9]{2})-([0-9]{2})[T ]([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?Z$");

Datetime.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

Datetime.prototype.getName = function () {
    return "datetime";
};

exports.Datetime = Datetime;
},{"./AbstractDatetime":110}],121:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

/**
 * This datatype shall accept strings that conform to the format specified for
 * <a href='http://whatwg.org/specs/web-forms/current-work/#datetime-local'><code>datetime-local</code></a>
 * inputs in Web Forms 2.0.
 * <p>This datatype must not accept the empty string.
 *
 * @version $Id$
 * @author hsivonen
 */
function DatetimeLocal() {

}

DatetimeLocal.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: DatetimeLocal}
});

DatetimeLocal.THE_INSTANCE = new DatetimeLocal();

DatetimeLocal.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-([0-9]{2})-([0-9]{2})[T ]([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?$");

DatetimeLocal.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

DatetimeLocal.prototype.getName = function () {
    return "local datetime";
};

exports.DatetimeLocal = DatetimeLocal;
},{"./AbstractDatetime":110}],122:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

/**
 * This datatype shall accept strings that conform to the format specified for
 * <a href='http://whatwg.org/specs/web-apps/current-work/#datetime'><code>datetime</code></a>
 * attribute of the <code>ins</code> and <code>del</code> elements in Web Applications 1.0.
 * <p>If the time zone designator is not "<code>Z</code>", the absolute value of the time
 * zone designator must not exceed 12 hours.
 * <p>This datatype must not accept the empty string.
 * <p>Note that allowing a numeric time zone designator is not the only difference with
 * <a href='#datetime'><code>datetime</code></a>. This type requires seconds to be explicitly
 * present.
 *
 * @version $Id$
 * @author hsivonen
 */
function DatetimeTz() {

}

DatetimeTz.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: DatetimeTz}
});

DatetimeTz.THE_INSTANCE = new DatetimeTz();

DatetimeTz.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-([0-9]{2})-([0-9]{2})[T ]([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?(?:Z|(?:([+-][0-9]{2}):([0-9]{2})))$");

DatetimeTz.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

DatetimeTz.prototype.getName = function () {
    return "datetime with timezone";
};

exports.DatetimeTz = DatetimeTz;
},{"./AbstractDatetime":110}],123:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function EmailAddress() {

}

EmailAddress.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: EmailAddress}
});

EmailAddress.THE_INSTANCE = new EmailAddress();

EmailAddress.prototype.checkValid = function (literal) {
    // TODO Auto-generated method stub
};

EmailAddress.prototype.getName = function () {
    return "email address";
};

exports.EmailAddress = EmailAddress;
},{"./AbstractDatatype":109}],124:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function EmailAddressList() {

}

EmailAddressList.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:EmailAddressList}
});

EmailAddressList.THE_INSTANCE = new EmailAddressList();

EmailAddressList.prototype.checkValid = function (literal) {
    // TODO Auto-generated method stub
};

EmailAddressList.prototype.getName = function () {
    return "email address list";
};

exports.EmailAddressList = EmailAddressList;
},{"./AbstractDatatype":109}],125:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function FloatingPointExponent() {

}

FloatingPointExponent.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: FloatingPointExponent}
});

FloatingPointExponent.THE_INSTANCE = new FloatingPointExponent();

FloatingPointExponent.prototype.State = {
    AT_START: 0, AT_START_MINUS_SEEN: 1, IN_INTEGER_PART_DIGITS_SEEN: 2, DOT_SEEN: 3, E_SEEN: 4, IN_DECIMAL_PART_DIGITS_SEEN: 5, IN_EXPONENT_SIGN_SEEN: 6, IN_EXPONENT_DIGITS_SEEN: 7
};

FloatingPointExponent.prototype.checkValid = function(literal) {
    var state = this.State.AT_START;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.AT_START:
                //noinspection JSHint
                if (c == '-') {
                    state = this.State.AT_START_MINUS_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    state = this.State.IN_INTEGER_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a minus sign or a digit but saw " + c + " instead.");
                }
            case this.State.AT_START_MINUS_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_INTEGER_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " + c + " instead.");
                }
            case this.State.IN_INTEGER_PART_DIGITS_SEEN:
                if (c == '.') {
                    state = this.State.DOT_SEEN;
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a decimal point, \u201Ce\u201D, \u201CE\u201D or a digit but saw " + c + " instead.");
                }
            case this.State.DOT_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_DECIMAL_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit after the decimal point but saw " + c + " instead.");
                }
            case this.State.IN_DECIMAL_PART_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201Ce\u201D, \u201CE\u201D or a digit but saw " + c + " instead.");
                }
            case this.State.E_SEEN:
                if (c == '-' || c == '+') {
                    state = this.State.IN_EXPONENT_SIGN_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a minus sign, a plus sign or a digit but saw " + c + " instead.");
                }
            case this.State.IN_EXPONENT_SIGN_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " + c + " instead.");
                }
            case this.State.IN_EXPONENT_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " + c + " instead.");
                }
        }
    }
    switch (state) {
        case this.IN_INTEGER_PART_DIGITS_SEEN:
        case this.IN_DECIMAL_PART_DIGITS_SEEN:
        case this.IN_EXPONENT_DIGITS_SEEN:
            return;
        case this.AT_START:
            throw this.newDatatypeException("The empty string is not a valid floating point number.");
        case this.AT_START_MINUS_SEEN:
            throw this.newDatatypeException("The minus sign alone is not a valid floating point number.");
        case this.DOT_SEEN:
            throw this.newDatatypeException("A floating point number must not end with the decimal point.");
        case this.E_SEEN:
            throw this.newDatatypeException("A floating point number must not end with the exponent \u201Ce\u201D.");
        case this.IN_EXPONENT_SIGN_SEEN:
            throw this.newDatatypeException("A floating point number must not end with only a sign in the exponent.");
    }
};

FloatingPointExponent.prototype.getName = function() {
    return "floating point number";
};

exports.FloatingPointExponent = FloatingPointExponent;
},{"./AbstractDatatype":109}],126:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function FloatingPointExponentNonNegative() {

}

FloatingPointExponentNonNegative.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: FloatingPointExponentNonNegative}
});

FloatingPointExponentNonNegative.THE_INSTANCE = new FloatingPointExponentNonNegative();

FloatingPointExponentNonNegative.prototype.State = {
    AT_START: 0, AT_START_MINUS_SEEN: 1, IN_INTEGER_PART_DIGITS_SEEN: 2, IN_INTEGER_PART_DIGITS_SEEN_ZERO: 3, DOT_SEEN: 4, DOT_SEEN_ZERO: 5, E_SEEN: 6, IN_DECIMAL_PART_DIGITS_SEEN: 7, IN_DECIMAL_PART_DIGITS_SEEN_ZERO: 8, IN_EXPONENT_SIGN_SEEN: 9, IN_EXPONENT_DIGITS_SEEN: 10
};

FloatingPointExponentNonNegative.prototype.checkValid = function(literal) {
    var state = this.State.AT_START;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.AT_START:
                if (c == '-') {
                    state = this.State.AT_START_MINUS_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    state = this.State.IN_INTEGER_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a minus sign or a digit but saw ", c, " instead.");
                }
            case this.State.AT_START_MINUS_SEEN:
                if (c == '0') {
                    state = this.State.IN_INTEGER_PART_DIGITS_SEEN_ZERO;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a zero but saw ", c, " instead.");
                }
            case this.State.IN_INTEGER_PART_DIGITS_SEEN:
                if (c == '.') {
                    state = this.State.DOT_SEEN;
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a decimal point, \u201Ce\u201D, \u201CE\u201D or a digit but saw ", c, " instead.");
                }
            case this.State.IN_INTEGER_PART_DIGITS_SEEN_ZERO:
                if (c == '.') {
                    state = this.State.DOT_SEEN_ZERO;
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else if (c == '0') {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a decimal point, \u201Ce\u201D, \u201CE\u201D or a zero but saw ", c, " instead.");
                }
            case this.State.DOT_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_DECIMAL_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit after the decimal point but saw ", c, " instead.");
                }
            case this.State.DOT_SEEN_ZERO:
                if (c == '0') {
                    state = this.State.IN_DECIMAL_PART_DIGITS_SEEN_ZERO;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a zero after the decimal point but saw ", c, " instead.");
                }
            case this.State.IN_DECIMAL_PART_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201Ce\u201D, \u201CE\u201D or a digit but saw ", c, " instead.");
                }
            case this.State.IN_DECIMAL_PART_DIGITS_SEEN_ZERO:
                if (c == '0') {
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201Ce\u201D, \u201CE\u201D or a zero but saw ", c, " instead.");
                }
            case this.State.E_SEEN:
                if (c == '-' || c == '+') {
                    state = this.State.IN_EXPONENT_SIGN_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a minus sign, a plus sign or a digit but saw ", c, " instead.");
                }
            case this.State.IN_EXPONENT_SIGN_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw ", c, " instead.");
                }
            case this.State.IN_EXPONENT_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw ", c, " instead.");
                }
        }
    }
    switch (state) {
        case this.State.IN_INTEGER_PART_DIGITS_SEEN:
        case this.State.IN_DECIMAL_PART_DIGITS_SEEN:
        case this.State.IN_INTEGER_PART_DIGITS_SEEN_ZERO:
        case this.State.IN_DECIMAL_PART_DIGITS_SEEN_ZERO:
        case this.State.IN_EXPONENT_DIGITS_SEEN:
            return;
        case this.State.AT_START:
            throw this.newDatatypeException("The empty string is not a valid non-negative floating point number.");
        case this.State.AT_START_MINUS_SEEN:
            throw this.newDatatypeException("The minus sign alone is not a valid non-negative floating point number.");
        case this.State.DOT_SEEN:
        case this.State.DOT_SEEN_ZERO:
            throw this.newDatatypeException("A non-negative floating point number must not end with the decimal point.");
        case this.State.E_SEEN:
            throw this.newDatatypeException("A non-negative floating point number must not end with the exponent \u201Ce\u201D.");
        case this.State.IN_EXPONENT_SIGN_SEEN:
            throw this.newDatatypeException("A non-negative floating point number must not end with only a sign in the exponent.");
    }
};

FloatingPointExponentNonNegative.prototype.getName = function() {
    return "non-negative floating point number";
};

exports.FloatingPointExponentNonNegative = FloatingPointExponentNonNegative;
},{"./AbstractDatatype":109}],127:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function FloatingPointExponentPositive() {

}

FloatingPointExponentPositive.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: FloatingPointExponentPositive}
});

FloatingPointExponentPositive.THE_INSTANCE = new FloatingPointExponentPositive();

FloatingPointExponentPositive.prototype.State = {
    AT_START: 0, IN_INTEGER_PART_DIGITS_SEEN: 1, DOT_SEEN: 2, E_SEEN: 3, IN_DECIMAL_PART_DIGITS_SEEN: 4, IN_EXPONENT_SIGN_SEEN: 5, IN_EXPONENT_DIGITS_SEEN: 6
};

FloatingPointExponentPositive.prototype.checkValid = function(literal) {
    var state = this.State.AT_START;
    var zero = true;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.AT_START:
                if (c == '-') {
                    throw this.newDatatypeException(i, "A positive floating point number cannot start with the minus sign.");
                } else if (this.isAsciiDigit(c)) {
                    if (c != '0') {
                        zero = false;
                    }
                    state = this.State.IN_INTEGER_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " +  c + " instead.");
                }
            case this.State.IN_INTEGER_PART_DIGITS_SEEN:
                if (c == '.') {
                    state = this.State.DOT_SEEN;
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    if (c != '0') {
                        zero = false;
                    }
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a decimal point, \u201Ce\u201D, \u201CE\u201D or a digit but saw " + c + " instead.");
                }
            case this.State.DOT_SEEN:
                if (this.isAsciiDigit(c)) {
                    if (c != '0') {
                        zero = false;
                    }
                    state = this.State.IN_DECIMAL_PART_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit after the decimal point but saw " + c + " instead.");
                }
            case this.State.IN_DECIMAL_PART_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    if (c != '0') {
                        zero = false;
                    }
                    continue;
                } else if (c == 'e' || c == 'E') {
                    state = this.State.E_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201Ce\u201D, \u201CE\u201D or a digit but saw " + c + " instead.");
                }
            case this.State.E_SEEN:
                if (c == '-' || c == '+') {
                    state = this.State.IN_EXPONENT_SIGN_SEEN;
                    continue;
                } else if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a minus sign, a plus sign or a digit but saw " + c + " instead.");
                }
            case this.State.IN_EXPONENT_SIGN_SEEN:
                if (this.isAsciiDigit(c)) {
                    state = this.State.IN_EXPONENT_DIGITS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " + c + " instead.");
                }
            case this.State.IN_EXPONENT_DIGITS_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a digit but saw " + c + " instead.");
                }
        }
    }
    switch (state) {
        case this.State.IN_INTEGER_PART_DIGITS_SEEN:
        case this.State.IN_DECIMAL_PART_DIGITS_SEEN:
        case this.State.IN_EXPONENT_DIGITS_SEEN:
            if (zero) {
                throw this.newDatatypeException("Zero is not a valid positive floating point number.");
            }
            return;
        case this.State.AT_START:
            throw this.newDatatypeException("The empty string is not a valid positive floating point number.");
        case this.State.DOT_SEEN:
            throw this.newDatatypeException("A positive floating point number must not end with the decimal point.");
        case this.State.E_SEEN:
            throw this.newDatatypeException("A positive floating point number must not end with the exponent \u201Ce\u201D.");
        case this.State.IN_EXPONENT_SIGN_SEEN:
            throw this.newDatatypeException("A positive floating point number must not end with only a sign in the exponent.");
    }
};

FloatingPointExponentPositive.prototype.getName = function() {
    return "positive floating point number";
};

exports.FloatingPointExponentPositive = FloatingPointExponentPositive;
},{"./AbstractDatatype":109}],128:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function FunctionBody() {

}

FunctionBody.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: FunctionBody}
});

FunctionBody.THE_INSTANCE = new FunctionBody();

FunctionBody.prototype.checkValid = function (literal) {
    // TODO
//    try {
//        Reader reader = new BufferedReader((new StringReader(
//            "function(event){" + literal.toString() + "}")));
//        reader.mark(1);
//        try {
//            Context context = ContextFactory.getGlobal().enterContext();
//            context.setOptimizationLevel(0);
//            context.setLanguageVersion(Context.VERSION_1_6);
//            // -1 for lineno arg prevents Rhino from appending
//            // "(unnamed script#1)" to all error messages
//            context.compileReader(reader, null, -1, null);
//        } finally {
//            Context.exit();
//        }
//    } catch (IOException e) {
//        throw newDatatypeException(e.getMessage());
//    } catch (RhinoException e) {
//        throw newDatatypeException(e.getMessage());
//    }
};

FunctionBody.prototype.getName = function () {
    return "ECMAScript FunctionBody";
};

exports.FunctionBody = FunctionBody;
},{"./AbstractDatatype":109}],129:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function HashName() {

}

HashName.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: HashName}
});

HashName.THE_INSTANCE = new HashName();

HashName.prototype.checkValid = function(literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("The empty string is not a valid hash-name reference.");
    } else if (literal.charAt(0) != '#') {
        throw this.newDatatypeException("A hash-name reference must start with \u201C#\u201D.");
    } else if (literal.length == 1) {
        throw this.newDatatypeException("A hash-name reference must have at least one character after \u201C#\u201D.");
    }
    // Other cases 
};

HashName.prototype.getName = function() {
    return "hash-name reference";
};

exports.HashName = HashName;
},{"./AbstractDatatype":109}],130:[function(require,module,exports){
var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;

function Html5DatatypeException(datatypeName, index, message, warning) {
    DatatypeException.call(this, index, "Bad " + datatypeName + ": " + message);
    this.warning = warning;
}

Html5DatatypeException.prototype = Object.create(DatatypeException.prototype, {
    constructor: {value: Html5DatatypeException}
});

exports.Html5DatatypeException = Html5DatatypeException;
},{"../../relaxng/datatype/DatatypeException":168}],131:[function(require,module,exports){
var DatatypeException = require('../../relaxng/datatype/DatatypeException').DatatypeException;
var ParameterlessDatatypeBuilder = require('../../relaxng/datatype/helpers/ParameterlessDatatypeBuilder').ParameterlessDatatypeBuilder;

var Id = require('./Id').Id;
var Idref = require('./Idref').Idref;
var Idrefs = require('./Idrefs').Idrefs;
var Pattern = require('./Pattern').Pattern;
var Datetime = require('./Datetime').Datetime;
var DatetimeLocal = require('./DatetimeLocal').DatetimeLocal;
var DatetimeTz = require('./DatetimeTz').DatetimeTz;
var DateOrTime = require('./DateOrTime').DateOrTime;
var Date = require('./Date').Date;
var Month = require('./Month').Month;
var Week = require('./Week').Week;
var Time = require('./Time').Time;
var Iri = require('./Iri').Iri;
var IriRef = require('./IriRef').IriRef;
var AsciiCaseInsensitiveString = require('./AsciiCaseInsensitiveString').AsciiCaseInsensitiveString;
var Language = require('./Language').Language;
var MediaQuery = require('./MediaQuery').MediaQuery;
var MimeType = require('./MimeType').MimeType;
var BrowsingContext = require('./BrowsingContext').BrowsingContext;
var BrowsingContextOrKeyword = require('./BrowsingContextOrKeyword').BrowsingContextOrKeyword;
var HashName = require('./HashName').HashName;
var Int = require('./Int').Int;
var IntNonNegative = require('./IntNonNegative').IntNonNegative;
var IntPositive = require('./IntPositive').IntPositive;
var FloatingPointExponent = require('./FloatingPointExponent').FloatingPointExponent;
var FloatingPointExponentNonNegative = require('./FloatingPointExponentNonNegative').FloatingPointExponentNonNegative;
var FloatingPointExponentPositive = require('./FloatingPointExponentPositive').FloatingPointExponentPositive;
var MimeTypeList = require('./MimeTypeList').MimeTypeList;
var Circle = require('./Circle').Circle;
var Rectangle = require('./Rectangle').Rectangle;
var Polyline = require('./Polyline').Polyline;
var XmlName = require('./XmlName').XmlName;
var MetaCharset = require('./MetaCharset').MetaCharset;
var MicrodataProperty = require('./MicrodataProperty').MicrodataProperty;
var Charset = require('./Charset').Charset;
var Refresh = require('./Refresh').Refresh;
var ParenthesisStart = require('./ParenthesisStart').ParenthesisStart;
var ParenthesisEnd = require('./ParenthesisEnd').ParenthesisEnd;
var EmailAddress = require('./EmailAddress').EmailAddress;
var EmailAddressList = require('./EmailAddressList').EmailAddressList;
var KeyLabelList = require('./KeyLabelList').KeyLabelList;
var Zero = require('./Zero').Zero;
var CdoCdcPair = require('./CdoCdcPair').CdoCdcPair;
var Script = require('./Script').Script;
var ScriptDocumentation = require('./ScriptDocumentation').ScriptDocumentation;
var FunctionBody = require('./FunctionBody').FunctionBody;
var ARel = require('./ARel').ARel;
var LinkRel = require('./LinkRel').LinkRel;
var MetaName = require('./MetaName').MetaName;
var NonEmptyString = require('./NonEmptyString').NonEmptyString;
var StringWithoutLineBreaks = require('./StringWithoutLineBreaks').StringWithoutLineBreaks;
var SimpleColor = require('./SimpleColor').SimpleColor;
var TimeDatetime = require('./TimeDatetime').TimeDatetime;

/**
 * Factory for HTML5 datatypes.
 * @version $Id$
 * @author hsivonen
 * @implements DatatypeLibrary
 */
function Html5DatatypeLibrary() {
    //super();
}

    /**
     * Returns a <code>DatatypeBuilder</code> for a named datatype. This method is 
     * unnecessary for direct access. Just use <code>createDatatype</code>.
     * @param baseTypeLocalName the local name
     * @return a <code>ParameterlessDatatypeBuilder</code> for the local name
     * @see org.relaxng.datatype.DatatypeLibrary#createDatatypeBuilder(java.lang.String)
     */
Html5DatatypeLibrary.prototype.createDatatypeBuilder = function(baseTypeLocalName) {
    return new ParameterlessDatatypeBuilder(this.createDatatype(baseTypeLocalName));
}

    /**
     * The factory method for the datatypes of this library.
     * @param typeLocalName the local name
     * @return a <code>Datatype</code> instance for the local name
     * @see org.relaxng.datatype.DatatypeLibrary#createDatatype(java.lang.String)
     */
Html5DatatypeLibrary.prototype.createDatatype = function(typeLocalName) {
    if ("ID" === typeLocalName) {
        return new Id();
    } else if ("IDREF" === typeLocalName) {
        return Idref.THE_INSTANCE;
    } else if ("IDREFS" === typeLocalName) {
        return Idrefs.THE_INSTANCE;
    } else if ("pattern" === typeLocalName) {
        return Pattern.THE_INSTANCE;
    } else if ("datetime" === typeLocalName) {
        return Datetime.THE_INSTANCE;
    } else if ("datetime-local" === typeLocalName) {
        return DatetimeLocal.THE_INSTANCE;
    } else if ("datetime-tz" === typeLocalName) {
        return DatetimeTz.THE_INSTANCE;
    } else if ("date-or-time" === typeLocalName) {
        return DateOrTime.THE_INSTANCE;
    } else if ("date" === typeLocalName) {
        return Date.THE_INSTANCE;
    } else if ("month" === typeLocalName) {
        return Month.THE_INSTANCE;
    } else if ("week" === typeLocalName) {
        return Week.THE_INSTANCE;
    } else if ("time" === typeLocalName) {
        return Time.THE_INSTANCE;
    } else if ("iri" === typeLocalName) {
        return Iri.THE_INSTANCE;
    } else if ("iri-ref" === typeLocalName) {
        return IriRef.THE_INSTANCE;
    } else if ("string" === typeLocalName) {
        return AsciiCaseInsensitiveString.THE_INSTANCE;
    } else if ("language" === typeLocalName) {
        return Language.THE_INSTANCE;
    } else if ("media-query" === typeLocalName) {
        return MediaQuery.THE_INSTANCE;
    } else if ("mime-type" === typeLocalName) {
        return MimeType.THE_INSTANCE;
    } else if ("browsing-context" === typeLocalName) {
        return BrowsingContext.THE_INSTANCE;
    } else if ("browsing-context-or-keyword" === typeLocalName) {
        return BrowsingContextOrKeyword.THE_INSTANCE;
    } else if ("hash-name" === typeLocalName) {
        return HashName.THE_INSTANCE;
    } else if ("integer" === typeLocalName) {
        return Int.THE_INSTANCE;
    } else if ("integer-non-negative" === typeLocalName) {
        return IntNonNegative.THE_INSTANCE;
    } else if ("integer-positive" === typeLocalName) {
        return IntPositive.THE_INSTANCE;
    } else if ("float" === typeLocalName) {
        return FloatingPointExponent.THE_INSTANCE;
    } else if ("float-non-negative" === typeLocalName) {
        return FloatingPointExponentNonNegative.THE_INSTANCE;
    } else if ("float-positive" === typeLocalName) {
        return FloatingPointExponentPositive.THE_INSTANCE;
    } else if ("mime-type-list" === typeLocalName) {
        return MimeTypeList.THE_INSTANCE;
    } else if ("circle" === typeLocalName) {
        return Circle.THE_INSTANCE;
    } else if ("rectangle" === typeLocalName) {
        return Rectangle.THE_INSTANCE;
    } else if ("polyline" === typeLocalName) {
        return Polyline.THE_INSTANCE;
    } else if ("xml-name" === typeLocalName) {
        return XmlName.THE_INSTANCE;
    } else if ("meta-charset" === typeLocalName) {
        return MetaCharset.THE_INSTANCE;
    } else if ("microdata-property" === typeLocalName) {
        return MicrodataProperty.THE_INSTANCE;
    } else if ("charset" === typeLocalName) {
        return Charset.THE_INSTANCE;
    } else if ("refresh" === typeLocalName) {
        return Refresh.THE_INSTANCE;
    } else if ("paren-start" === typeLocalName) {
        return ParenthesisStart.THE_INSTANCE;
    } else if ("paren-end" === typeLocalName) {
        return ParenthesisEnd.THE_INSTANCE;
    } else if ("email-address" === typeLocalName) {
        return EmailAddress.THE_INSTANCE;
    } else if ("email-address-list" === typeLocalName) {
        return EmailAddressList.THE_INSTANCE;
    } else if ("keylabellist" === typeLocalName) {
        return KeyLabelList.THE_INSTANCE;
    } else if ("zero" === typeLocalName) {
        return Zero.THE_INSTANCE;
    } else if ("cdo-cdc-pair" === typeLocalName) {
        return CdoCdcPair.THE_INSTANCE;
    } else if ("script" === typeLocalName) {
        return Script.THE_INSTANCE;
    } else if ("script-documentation" === typeLocalName) {
        return ScriptDocumentation.THE_INSTANCE;
    } else if ("functionbody" === typeLocalName) {
        return FunctionBody.THE_INSTANCE;
    } else if ("a-rel" === typeLocalName) {
        return ARel.THE_INSTANCE;
    } else if ("link-rel" === typeLocalName) {
        return LinkRel.THE_INSTANCE;
    } else if ("meta-name" === typeLocalName) {
        return MetaName.THE_INSTANCE;
    } else if ("non-empty-string" === typeLocalName) {
        return NonEmptyString.THE_INSTANCE;
    } else if ("string-without-line-breaks" === typeLocalName) {
        return StringWithoutLineBreaks.THE_INSTANCE;
    } else if ("simple-color" === typeLocalName) {
        return SimpleColor.THE_INSTANCE;
    } else if ("time-datetime" === typeLocalName) {
        return TimeDatetime.THE_INSTANCE;
    } else if ("svg-pathdata".equals(typeLocalName)) {
        return new SvgPathData();
    }
    throw new DatatypeException("Unknown local name for datatype: " + typeLocalName);
};

exports.Html5DatatypeLibrary = Html5DatatypeLibrary;
},{"../../relaxng/datatype/DatatypeException":168,"../../relaxng/datatype/helpers/ParameterlessDatatypeBuilder":169,"./ARel":108,"./AsciiCaseInsensitiveString":59,"./BrowsingContext":113,"./BrowsingContextOrKeyword":114,"./CdoCdcPair":115,"./Charset":116,"./Circle":117,"./Date":118,"./DateOrTime":119,"./Datetime":120,"./DatetimeLocal":121,"./DatetimeTz":122,"./EmailAddress":123,"./EmailAddressList":124,"./FloatingPointExponent":125,"./FloatingPointExponentNonNegative":126,"./FloatingPointExponentPositive":127,"./FunctionBody":128,"./HashName":129,"./Id":133,"./Idref":134,"./Idrefs":135,"./Int":136,"./IntNonNegative":137,"./IntPositive":138,"./Iri":139,"./IriRef":140,"./KeyLabelList":141,"./Language":142,"./LinkRel":143,"./MediaQuery":144,"./MetaCharset":145,"./MetaName":146,"./MicrodataProperty":147,"./MimeType":148,"./MimeTypeList":149,"./Month":150,"./NonEmptyString":151,"./ParenthesisEnd":152,"./ParenthesisStart":153,"./Pattern":154,"./Polyline":155,"./Rectangle":156,"./Refresh":157,"./Script":158,"./ScriptDocumentation":159,"./SimpleColor":160,"./StringWithoutLineBreaks":161,"./Time":162,"./TimeDatetime":163,"./Week":164,"./XmlName":165,"./Zero":166}],132:[function(require,module,exports){
var Html5DatatypeLibrary = require('./Html5DatatypeLibrary').Html5DatatypeLibrary;
/**
 * The factory for datatype library autodiscovery.
 * 
 * @class
 * @implements DatatypeLibraryFactory
 */
function Html5DatatypeLibraryFactory() {
    //         super();
}

Html5DatatypeLibraryFactory.NAMESPACE = "http://whattf.org/datatype-draft";

Html5DatatypeLibraryFactory.prototype.NAMESPACE = Html5DatatypeLibraryFactory.NAMESPACE;

Html5DatatypeLibraryFactory.prototype.createDatatypeLibrary = function(namespaceURI) {
    if (this.NAMESPACE === namespaceURI) {
        return new Html5DatatypeLibrary();
    }
    return null;
};

exports.Html5DatatypeLibraryFactory = Html5DatatypeLibraryFactory;
},{"./Html5DatatypeLibrary":131}],133:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

/**
 * This datatype shall accept any string that consists of one or more characters 
 * and does not contain any whitespace characters.
 * <p>The ID-type of this datatype is ID.
 * @version $Id$
 * @author hsivonen
 */
function Id() {

}

Id.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: Id}
});

Id.THE_INSTANCE = new Id();


/**
 * Checks that the value is a proper HTML5 id.
 * @param literal the value
 * @param context ignored
 * @throws DatatypeException if the value isn't valid
 * @see org.relaxng.datatype.Datatype#checkValid(java.lang.String, org.relaxng.datatype.ValidationContext)
 */
Id.prototype.checkValid = function(literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("An ID must not be the empty string.");
    }
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (this.isWhitespace(c)) {
            throw this.newDatatypeException(i, "An ID must not contain whitespace.");
        }
    }
};

Id.prototype.getName = function() {
    return "id";
};

exports.Id = Id;
},{"./AbstractDatatype":109}],134:[function(require,module,exports){
var Id = require('./Id').Id;

/**
 * This datatype shall accept any string that consists of one or more characters
 * and does not contain any whitespace characters.
 * <p>The ID-type of this datatype is ID.
 * @version $Id$
 * @author hsivonen
 */
function Idref() {

}

Idref.prototype = Object.create(Id.prototype, {
    constructor: {value: Idref}
});

Idref.THE_INSTANCE = new Idref();

Idref.prototype.getName = function() {
    return "id reference";
};

exports.Idref = Idref;
},{"./Id":133}],135:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

/**
 * This datatype shall accept any string that consists of one or more characters
 * and does not contain any whitespace characters.
 * <p>The ID-type of this datatype is ID.
 * @version $Id$
 * @author hsivonen
 */
function Idrefs() {

}

Idrefs.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: Idrefs}
});

Idrefs.THE_INSTANCE = new Idrefs();


/**
 * Checks that the value is a proper HTML5 id.
 * @param literal the value
 * @param context ignored
 * @throws DatatypeException if the value isn't valid
 * @see org.relaxng.datatype.Datatype#checkValid(java.lang.String, org.relaxng.datatype.ValidationContext)
 */
Idrefs.prototype.checkValid = function(literal) {
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (!this.isWhitespace(c)) {
            return;
        }
    }
    throw this.newDatatypeException("An IDREFS value must contain at least one non-whitespace character.");
};

Idrefs.prototype.getName = function() {
    return "id references";
};

exports.Idrefs = Idrefs;
},{"./AbstractDatatype":109}],136:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function Int() {

}

Int.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: Int}
});

Int.THE_INSTANCE = new Int();

Int.prototype.checkValid = function(literal) {
    this.checkInt(literal, 0);
};

Int.prototype.getName = function() {
    return "integer";
};

exports.Int = Int;

},{"./AbstractInt":111}],137:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function IntNonNegative() {

}

IntNonNegative.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: IntNonNegative}
});

IntNonNegative.THE_INSTANCE = new IntNonNegative();

IntNonNegative.prototype.checkValid = function(literal) {
    this.checkIntNonNegative(literal, 0);
};

IntNonNegative.prototype.getName = function() {
    return "non-negative integer";
};

exports.IntNonNegative = IntNonNegative;

},{"./AbstractInt":111}],138:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function IntPositive() {

}

IntPositive.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: IntPositive}
});

IntPositive.THE_INSTANCE = new IntPositive();

IntPositive.prototype.checkValid = function(literal) {
    this.checkIntPositive(literal, 0);
};

IntPositive.prototype.getName = function() {
    return "positive integer";
};

exports.IntPositive = IntPositive;

},{"./AbstractInt":111}],139:[function(require,module,exports){
var IriRef = require('./IriRef').IriRef;

function Iri() {

}

Iri.prototype = Object.create(IriRef.prototype, {
    constructor: {value: Iri}
});

Iri.THE_INSTANCE = new Iri();

Iri.prototype.isAbsolute = function () {
    return true;
};

Iri.prototype.getName = function () {
    return "absolute IRI";
};

exports.Iri = Iri;
},{"./IriRef":140}],140:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function IriRef() {

}

IriRef.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: IriRef}
});

IriRef.THE_INSTANCE = new IriRef();

IriRef.prototype.checkValid = function (literal) {
    // todo
};

IriRef.prototype.getName = function () {
    return "IRI reference";
};

exports.IriRef = IriRef;
},{"./AbstractDatatype":109}],141:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function KeyLabelList() {

}

KeyLabelList.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: KeyLabelList}
});

KeyLabelList.THE_INSTANCE = new KeyLabelList();

KeyLabelList.prototype.checkValid = function (literal) {
    var keylabels = literal.split(/\s+/);
    keylabels.sort();
    for (var i = 0; i < keylabels.length; i++) {
        var label = keylabels[i];
        if (i > 0 && label.equals(keylabels[i-1])) {
            throw this.newDatatypeException(
                "Duplicate key label. Each key label must be unique.");
        }
        if (label.length == 2) {
            // todo
//            var chars = label.toCharArray();
//            if (!(UCharacter.isHighSurrogate(chars[0])
//                && UCharacter.isLowSurrogate(chars[1]))) {
//                throw this.newDatatypeException(
//                    "Key label has multiple characters. Each key label must be a single character.");
//            }
        }
        if (label.length > 2) {
            throw this.newDatatypeException(
                "Key label has multiple characters. Each key label must be a single character.");
        }
    }
};

KeyLabelList.prototype.getName = function () {
    return "key label list";
};

exports.KeyLabelList = KeyLabelList;
},{"./AbstractDatatype":109}],142:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Language() {

}

Language.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: Language}
});

Language.THE_INSTANCE = new Language();

Language.prototype.checkValid = function (literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("The empty string is not a valid language tag.");
    }
    // todo
};

Language.prototype.getName = function () {
    return "language tag";
};

exports.Language = Language;
},{"./AbstractDatatype":109}],143:[function(require,module,exports){
var AbstractRel = require('./AbstractRel').AbstractRel;

function LinkRel() {

}

LinkRel.prototype = Object.create(AbstractRel.prototype, {
    constructor: {value: LinkRel}
});

LinkRel.THE_INSTANCE = new LinkRel();

LinkRel.REGISTERED_TOKENS = [
    "alternate",
    "appendix", // HTML4
    "apple-touch-icon", // extension
    "apple-touch-icon-precomposed", // extension
    "apple-touch-startup-image", // extension
    "author",
    "canonical", // extension
    "category", // extension
    "chapter", // HTML4
    "contents", // HTML4
    "copyright", // HTML4
    "discussion", // extension
    "dns-prefetch", // extension
    "edituri", // extension
    "glossary", // HTML4
    "help",
    "home", // extension
    "http://docs.oasis-open.org/ns/cmis/link/200908/acl", // extension
    "icon",
    "image_src", // extension
    "index", // extension
    "issues", // extension
    "its-rules", // extension
    "license",
    "me", // extension (Formats table)
    "next",
    "openid.delegate", // extension
    "openid.server", // extension
    "openid2.local_id", // extension
    "openid2.provider", // extension
    "p3pv1", // extension
    "pgpkey", // extension
    "pingback", // extension
    "prefetch",
    "prerender", // extension
    "prev",
    "previous", // HTML4
    "profile", // extension
    "schema.dc", // extension
    "schema.dcterms", // extension
    "search",
    "section", // HTML4
    "service", // extension
    "shortcut", // extension
    "shortlink", // extension
    "sidebar", // extension
    "start", // HTML4
    "stylesheet",
    "stylesheet/less", // extension
    "subsection", // HTML4
    "syndication", // extension
    "timesheet", // extension
    "toc", // HTML4
    "transformation", // extension (Formats table)
    "widget", // extension
    "wlwmanifest" // extension
];

LinkRel.prototype.REGISTERED_TOKENS = LinkRel.REGISTERED_TOKENS;

LinkRel.prototype.isRegistered = function(token) {
    return this.REGISTERED_TOKENS.indexOf(token) >= 0;
};

LinkRel.prototype.getName = function() {
    return "link type valid for <link>";
};

exports.LinkRel = LinkRel;
},{"./AbstractRel":112}],144:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function MediaQuery() {

}

MediaQuery.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:MediaQuery}
});

MediaQuery.THE_INSTANCE = new MediaQuery();

MediaQuery.prototype.checkValid = function (literal) {
    // todo
};

MediaQuery.prototype.getName = function () {
    return "media query";
};

exports.MediaQuery = MediaQuery;
},{"./AbstractDatatype":109}],145:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function MetaCharset() {

}

MetaCharset.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:MetaCharset}
});

MetaCharset.THE_INSTANCE = new MetaCharset();

MetaCharset.prototype.checkValid = function (literal) {
    var lower = this.toAsciiLowerCase(literal);
    if (!(lower.indexOf("text/html;") === 0)) {
        throw this.newDatatypeException(
            "The legacy encoding declaration did not start with ",
            "text/html;", ".");
    }
    if (lower.length == 10) {
        throw this.newDatatypeException("The legacy encoding declaration ended prematurely.");
    }
};

MetaCharset.prototype.getName = function () {
    return "legacy character encoding declaration";
};

exports.MetaCharset = MetaCharset;
},{"./AbstractDatatype":109}],146:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function MetaName() {

}

MetaName.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: MetaName}
});

MetaName.THE_INSTANCE = new MetaName();

MetaName.VALID_NAMES = [
    "aglsterms.act", // extension
    "aglsterms.accessibility", // extension
    "aglsterms.accessmode", // extension
    "aglsterms.aggregationlevel", // extension
    "aglsterms.availability", // extension
    "aglsterms.case", // extension
    "aglsterms.category", // extension
    "aglsterms.datelicensed", // extension
    "aglsterms.documenttype", // extension
    "aglsterms.function", // extension
    "aglsterms.isbasisfor", // extension
    "aglsterms.isbasedon", // extension
    "aglsterms.jurisdiction", // extension
    "aglsterms.mandate", // extension
    "aglsterms.protectivemarking", // extension
    "aglsterms.regulation", // extension
    "aglsterms.servicetype", // extension
    "alexaverifyid", // extension
    "apple-mobile-web-app-capable", // extension
    "apple-mobile-web-app-status-bar-style", // extension
    "application-name",
    "author",
    "baiduspider", // extension
    "bug.component", // extension
    "bug.product", // extension
    "bug.short_desc", // extension
    "csrf-param", // extension
    "csrf-token", // extension
    "dc.date.issued", // extension
    "dc.language", // extension
    "dcterms.abstract", // extension
    "dcterms.accessrights", // extension
    "dcterms.accrualmethod", // extension
    "dcterms.accrualperiodicity", // extension
    "dcterms.accrualpolicy", // extension
    "dcterms.alternative", // extension
    "dcterms.audience", // extension
    "dcterms.available", // extension
    "dcterms.bibliographiccitation", // extension
    "dcterms.conformsto", // extension
    "dcterms.contributor", // extension
    "dcterms.coverage", // extension
    "dcterms.created", // extension
    "dcterms.creator", // extension
    "dcterms.date", // extension
    "dcterms.dateaccepted", // extension
    "dcterms.datecopyrighted", // extension
    "dcterms.datesubmitted", // extension
    "dcterms.description", // extension
    "dcterms.educationlevel", // extension
    "dcterms.extent", // extension
    "dcterms.format", // extension
    "dcterms.hasformat", // extension
    "dcterms.haspart", // extension
    "dcterms.hasversion", // extension
    "dcterms.identifier", // extension
    "dcterms.instructionalmethod", // extension
    "dcterms.isformatof", // extension
    "dcterms.ispartof", // extension
    "dcterms.isreferencedby", // extension
    "dcterms.isreplacedby", // extension
    "dcterms.isrequiredby", // extension
    "dcterms.issued", // extension
    "dcterms.isversionof", // extension
    "dcterms.language", // extension
    "dcterms.license", // extension
    "dcterms.mediator", // extension
    "dcterms.medium", // extension
    "dcterms.modified", // extension
    "dcterms.provenance", // extension
    "dcterms.publisher", // extension
    "dcterms.references", // extension
    "dcterms.relation", // extension
    "dcterms.replaces", // extension
    "dcterms.requires", // extension
    "dcterms.rights", // extension
    "dcterms.rightsholder", // extension
    "dcterms.source", // extension
    "dcterms.spatial", // extension
    "dcterms.subject", // extension
    "dcterms.tableofcontents", // extension
    "dcterms.temporal", // extension
    "dcterms.title", // extension
    "dcterms.type", // extension
    "dcterms.valid", // extension
    "description",
    "designer", // extension
    "essaydirectory", // extension
    "format-detection", // extension
    "fragment", // extension
    "generator",
    "geo.a1", // extension
    "geo.a2", // extension
    "geo.a3", // extension
    "geo.country", // extension
    "geo.lmk", // extension
    "geo.placename", // extension
    "geo.position", // extension
    "geo.region", // extension
    "globrix.bathrooms", // extension
    "globrix.bedrooms", // extension
    "globrix.condition", // extension
    "globrix.features", // extension
    "globrix.instruction", // extension
    "globrix.latitude", // extension
    "globrix.longitude ", // extension
    "globrix.outsidespace", // extension
    "globrix.parking", // extension
    "globrix.period", // extension
    "globrix.poa", // extension
    "globrix.postcode", // extension
    "globrix.price", // extension
    "globrix.priceproximity", // extension
    "globrix.tenure", // extension
    "globrix.type", // extension
    "globrix.underoffer", // extension
    "google-site-verification", // extension
    "googlebot", // extension
    "icbm", // extension        
    "itemsperpage", // extension
    "keywords",
    "meta_date", // extension
    "mobile-web-app-capable", // extension
    "msapplication-config", // extension
    "msapplication-navbutton-color", // extension
    "msapplication-starturl", // extension
    "msapplication-task", // extension
    "msapplication-tilecolor", // extension
    "msapplication-tileimage", // extension
    "msapplication-tooltip", // extension
    "msapplication-window", // extension
    "msvalidate.01", // extension
    "norton-safeweb-site-verification", // extension
    "rating", // extension
    "referrer", // extension
    "review_date", // extension
    "revisit-after", // extension
    "rights-standard", // extension
    "robots", // extension
    "skype_toolbar", // extension
    "slurp", // extension
    "startindex", // extension
    "startver", // extension
    "teoma", // extension
    "twitter:app:country ", // extension
    "twitter:app:id:googleplay", // extension
    "twitter:app:id:ipad ", // extension
    "twitter:app:id:iphone", // extension
    "twitter:app:url:googleplay", // extension
    "twitter:app:url:ipad", // extension
    "twitter:app:url:iphone", // extension
    "twitter:card", // extension
    "twitter:creator", // extension
    "twitter:creator:id", // extension
    "twitter:description", // extension
    "twitter:domain", // extension
    "twitter:image", // extension
    "twitter:image0", // extension
    "twitter:image1", // extension
    "twitter:image2", // extension
    "twitter:image3", // extension
    "twitter:image:height", // extension
    "twitter:image:src", // extension
    "twitter:image:width", // extension
    "twitter:site", // extension
    "twitter:site:id", // extension
    "twitter:title", // extension
    "twitter:url", // extension
    "verify-v1", // extension
    "viewport", // extension
    "wot-verification", // extension
    "wt.ac", // extension
    "wt.ad", // extension
    "wt.cg_n", // extension
    "wt.cg_s", // extension
    "wt.mc_id", // extension
    "wt.si_p", // extension
    "wt.sv", // extension
    "wt.ti", // extension
    "y_key", // extension
    "yandex-verification", // extension
    "zoomcategory", // extension
    "zoomimage", // extension
    "zoompageboost", // extension
    "zoomtitle", // extension
    "zoomwords" // extension
];

MetaName.prototype.VALID_NAMES = MetaName.VALID_NAMES;

MetaName.prototype.checkValid = function(literal) {
    var token = literal.toLowerCase();
    if (this.VALID_NAMES.indexOf(token) < 0) {
        throw this.newDatatypeException("Keyword ", token, " is not registered.");
    }
};

MetaName.prototype.getName = function() {
    return "metadata name";
};

exports.MetaName = MetaName;
},{"./AbstractDatatype":109}],147:[function(require,module,exports){
var Iri = require('./Iri').Iri;

function MicrodataProperty() {

}

MicrodataProperty.prototype = Object.create(Iri.prototype, {
    constructor: {value: MicrodataProperty}
});

MicrodataProperty.THE_INSTANCE = new MicrodataProperty();

MicrodataProperty.prototype.checkValid = function (literal) {
    if (literal.indexOf('.') > -1 || literal.indexOf(':') > -1)
        Iri.prototype.checkValid.call(this, literal);
};

MicrodataProperty.prototype.getName = function () {
    return "microdata property";
};

exports.MicrodataProperty = MicrodataProperty;
},{"./Iri":139}],148:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function MimeType() {

}

MimeType.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: MimeType}
});

MimeType.THE_INSTANCE = new MimeType();

MimeType.prototype.State = {
    AT_START: 0, IN_SUPERTYPE: 1, AT_SUBTYPE_START: 2, IN_SUBTYPE: 3, SEMICOLON_SEEN: 4, WS_BEFORE_SEMICOLON: 5, IN_PARAM_NAME: 6, EQUALS_SEEN: 7, IN_QUOTED_STRING: 8, IN_UNQUOTED_STRING: 9, IN_QUOTED_PAIR: 10, CLOSE_QUOTE_SEEN: 11
};

MimeType.prototype.checkValid = function (literal) {
    var state = this.State.AT_START;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.AT_START:
                if (this.isTokenChar(c)) {
                    state = this.State.IN_SUPERTYPE;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a token character but saw ",
                        c, " instead.");
                }
            case this.State.IN_SUPERTYPE:
                if (this.isTokenChar(c)) {
                    continue;
                } else if (c == '/') {
                    state = this.State.AT_SUBTYPE_START;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a token character or \u201C/\u201D but saw ",
                        c, " instead.");
                }
            case this.State.AT_SUBTYPE_START:
                if (this.isTokenChar(c)) {
                    state = this.State.IN_SUBTYPE;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a token character but saw ",
                        c, " instead.");
                }
            case this.State.IN_SUBTYPE:
                if (this.isTokenChar(c)) {
                    continue;
                } else if (c == ';') {
                    state = this.State.SEMICOLON_SEEN;
                    continue;
                } else if (this.isWhitespace(c)) {
                    state = this.State.WS_BEFORE_SEMICOLON;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a token character, whitespace or a semicolon but saw ",
                        c, " instead.");
                }
            case this.State.WS_BEFORE_SEMICOLON:
                if (this.isWhitespace(c)) {
                    continue;
                } else if (c == ';') {
                    state = this.State.SEMICOLON_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected whitespace or a semicolon but saw ",
                        c, " instead.");
                }
            case this.State.SEMICOLON_SEEN:
                if (this.isWhitespace(c)) {
                    continue;
                } else if (this.isTokenChar(c)) {
                    state = this.State.IN_PARAM_NAME;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected whitespace or a token character but saw ",
                        c, " instead.");
                }
            case this.State.IN_PARAM_NAME:
                if (this.isTokenChar(c)) {
                    continue;
                } else if (c == '=') {
                    state = this.State.EQUALS_SEEN;
                    continue;
                }
            case this.State.EQUALS_SEEN:
                if (c == '\"') {
                    state = this.State.IN_QUOTED_STRING;
                    continue;
                } else if (this.isTokenChar(c)) {
                    state = this.State.IN_UNQUOTED_STRING;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a double quote or a token character but saw ",
                        c, " instead.");
                }
            case this.State.IN_QUOTED_STRING:
                if (c == '\\') {
                    state = this.State.IN_QUOTED_PAIR;
                    continue;
                } else if (c == '\"') {
                    state = this.State.CLOSE_QUOTE_SEEN;
                    continue;
                } else if (this.isQDTextChar(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a non-control ASCII character but saw ",
                        c, " instead.");
                }
            case this.State.IN_QUOTED_PAIR:
                if (c <= 127) {
                    state = this.State.IN_QUOTED_STRING;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected an ASCII character but saw ",
                        c, " instead.");
                }
            case this.State.CLOSE_QUOTE_SEEN:
                if (c == ';') {
                    state = this.State.SEMICOLON_SEEN;
                    continue;
                } else if (this.isWhitespace(c)) {
                    state = this.State.WS_BEFORE_SEMICOLON;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected an ASCII character but saw ",
                        c, " instead.");
                }
            case this.State.IN_UNQUOTED_STRING:
                if (this.isTokenChar(c)) {
                    continue;
                } else if (c == ';') {
                    state = this.State.SEMICOLON_SEEN;
                    continue;
                } else if (this.isWhitespace(c)) {
                    state = this.State.WS_BEFORE_SEMICOLON;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a token character, whitespace or a semicolon but saw ",
                        c, " instead.");
                }
        }
    }
    switch (state) {
        case this.State.IN_SUBTYPE:
        case this.State.IN_UNQUOTED_STRING:
        case this.State.CLOSE_QUOTE_SEEN:
            return;
        case this.State.AT_START:
            throw this.newDatatypeException(
                "Expected a MIME type but saw the empty string.");
        case this.State.IN_SUPERTYPE:
        case this.State.AT_SUBTYPE_START:
            throw this.newDatatypeException(literal.length - 1,
                "Subtype missing.");
        case this.State.EQUALS_SEEN:
        case this.State.IN_PARAM_NAME:
            throw this.newDatatypeException(literal.length - 1,
                "Parameter value missing.");
        case this.State.IN_QUOTED_PAIR:
        case this.State.IN_QUOTED_STRING:
            throw this.newDatatypeException(literal.length - 1,
                "Unfinished quoted string.");
        case this.State.SEMICOLON_SEEN:
            throw this.newDatatypeException(literal.length - 1,
                "Semicolon seen but there was no parameter following it.");
        case this.State.WS_BEFORE_SEMICOLON:
            throw this.newDatatypeException(literal.length - 1,
                "Extraneous trailing whitespace.");
    }
};

MimeType.prototype.isQDTextChar = function(c) {
    return (c >= ' ' && c.charCodeAt(0) <= 126) || (c == '\n') || (c == '\r')
            || (c == '\t');
};

MimeType.prototype.isTokenChar = function(c) {
    return (c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126)
            && !(c == '(' || c == ')' || c == '<' || c == '>' || c == '@'
            || c == ',' || c == ';' || c == ':' || c == '\\'
            || c == '\"' || c == '/' || c == '[' || c == ']'
            || c == '?' || c == '=' || c == '{' || c == '}');
};

MimeType.prototype.getName = function () {
    return "MIME type";
};

exports.MimeType = MimeType;
},{"./AbstractDatatype":109}],149:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function MimeTypeList() {

}

MimeTypeList.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:MimeTypeList}
});

MimeTypeList.THE_INSTANCE = new MimeTypeList();

MimeTypeList.prototype.State = {
    WS_BEFORE_TYPE: 0, IN_TYPE: 1, ASTERISK_TYPE_SEEN: 2, ASTERISK_AND_SLASH_SEEN: 3, WS_BEFORE_COMMA: 4, SLASH_SEEN: 5, IN_SUBTYPE: 6
};

MimeTypeList.prototype.checkValid = function (literal) {
    var state = this.State.WS_BEFORE_TYPE;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.WS_BEFORE_TYPE:
                if (this.isWhitespace(c)) {
                    continue;
                } else if (c == '*') {
                    state = this.State.ASTERISK_TYPE_SEEN;
                } else if (this.isTokenChar(c)) {
                    state = this.State.IN_TYPE;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected whitespace, a token character or \u201C*\u201D but saw ", c , " instead.");
                }
            case this.State.ASTERISK_TYPE_SEEN:
                if (c == '/') {
                    state = this.State.ASTERISK_AND_SLASH_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201C/\u201D but saw ", c , " instead.");
                }
            case this.State.ASTERISK_AND_SLASH_SEEN:
                if (c == '*') {
                    state = this.State.WS_BEFORE_COMMA;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected \u201C*\u201D but saw ", c , " instead.");
                }
            case this.State.IN_TYPE:
                if (c == '/') {
                    state = this.State.SLASH_SEEN;
                    continue;
                } else if (this.isTokenChar(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a token character or \u201C/\u201D but saw ", c , " instead.");
                }
            case this.State.SLASH_SEEN:
                if (c == '*') {
                    state = this.State.WS_BEFORE_COMMA;
                    continue;
                } else if (this.isTokenChar(c)) {
                    state = this.State.IN_SUBTYPE;
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a token character or \u201C*\u201D but saw ", c , " instead.");
                }
            case this.State.IN_SUBTYPE:
                if (this.isWhitespace(c)) {
                    state = this.State.WS_BEFORE_COMMA;
                    continue;
                } else if (c == ',') {
                    state = this.State.WS_BEFORE_TYPE;
                    continue;
                } else if (this.isTokenChar(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected a token character, whitespace or a comma but saw ", c , " instead.");
                }
            case this.State.WS_BEFORE_COMMA:
                if (c == ',') {
                    state = this.State.WS_BEFORE_TYPE;
                    continue;
                } else if (this.isWhitespace(c)) {
                    continue;
                } else {
                    throw this.newDatatypeException(i, "Expected whitespace or a comma but saw ", c , " instead.");
                }
        }
    }
    switch (state) {
        case this.State.IN_SUBTYPE:
        case this.State.WS_BEFORE_COMMA:
            return;
        case this.State.ASTERISK_AND_SLASH_SEEN:
            throw this.newDatatypeException("Expected \u201C*\u201D but the literal ended.");
        case this.State.ASTERISK_TYPE_SEEN:
            throw this.newDatatypeException("Expected \u201C/\u201D but the literal ended.");
        case this.State.IN_TYPE:
            throw this.newDatatypeException("Expected \u201C/\u201D but the literal ended.");
        case this.State.SLASH_SEEN:
            throw this.newDatatypeException("Expected subtype but the literal ended.");
        case this.State.WS_BEFORE_TYPE:
            throw this.newDatatypeException("Expected a MIME type but the literal ended.");
    }
};

MimeTypeList.prototype.isTokenChar = function(c) {
    return (c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126)
        && !(c == '(' || c == ')' || c == '<' || c == '>' || c == '@'
        || c == ',' || c == ';' || c == ':' || c == '\\'
        || c == '\"' || c == '/' || c == '[' || c == ']'
        || c == '?' || c == '=' || c == '{' || c == '}');
};

MimeTypeList.prototype.getName = function () {
    return "MIME type list";
};

exports.MimeTypeList = MimeTypeList;
},{"./AbstractDatatype":109}],150:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Month() {

}

Month.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:Month}
});

Month.THE_INSTANCE = new Month();

Month.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-([0-9]{2})$");

Month.prototype.checkMonth = function(year, month) {
    if (year < 1) {
        throw this.newDatatypeException("Year cannot be less than 1.");
    }
    if (month < 1) {
        throw this.newDatatypeException("Month cannot be less than 1.");
    }
    if (month > 12) {
        throw this.newDatatypeException("Month cannot be greater than 12.");
    }
}

Month.prototype.checkValid = function (literal) {
    var m = this.THE_PATTERN.exec(literal);
    if (m) {
        this.checkMonth(m[1], m[2]);
    } else {
        throw this.newDatatypeException(
            "The literal did not satisfy the format for month.");
    }
};

Month.prototype.getName = function () {
    return "month";
};

exports.Month = Month;
},{"./AbstractDatatype":109}],151:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function NonEmptyString() {

}

NonEmptyString.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:NonEmptyString}
});

NonEmptyString.THE_INSTANCE = new NonEmptyString();

NonEmptyString.prototype.checkValid = function (literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("String was empty.");
    }
};

NonEmptyString.prototype.getName = function () {
    return "non-empty string";
};

exports.NonEmptyString = NonEmptyString;
},{"./AbstractDatatype":109}],152:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function ParenthesisEnd() {

}

ParenthesisEnd.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:ParenthesisEnd}
});

ParenthesisEnd.THE_INSTANCE = new ParenthesisEnd();

ParenthesisEnd.prototype.checkValid = function (literal) {
// todo
};

ParenthesisEnd.prototype.getName = function () {
    return "end parenthesis";
};

exports.ParenthesisEnd = ParenthesisEnd;
},{"./AbstractDatatype":109}],153:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function ParenthesisStart() {

}

ParenthesisStart.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:ParenthesisStart}
});

ParenthesisStart.THE_INSTANCE = new ParenthesisStart();

ParenthesisStart.prototype.checkValid = function (literal) {
// todo
};

ParenthesisStart.prototype.getName = function () {
    return "start parenthesis";
};

exports.ParenthesisStart = ParenthesisStart;
},{"./AbstractDatatype":109}],154:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Pattern() {

}

Pattern.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value: Pattern}
});

Pattern.THE_INSTANCE = new Pattern();

Pattern.prototype.checkValid = function (literal) {
    // TODO find out what kind of thread concurrency guarantees are made
//    ContextFactory cf = new ContextFactory();
//    Context cx = cf.enterContext();
//    RegExpImpl rei = new RegExpImpl();
//    String anchoredRegex = "^(?:" + literal + ")$";
//    try {
//        rei.compileRegExp(cx, anchoredRegex, "");
//    } catch (EcmaError ee) {
//        throw newDatatypeException(ee.getErrorMessage());
//    } finally {
//        Context.exit();
//    }
};

Pattern.prototype.getName = function () {
    return "pattern";
};

exports.Pattern = Pattern;
},{"./AbstractDatatype":109}],155:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function Polyline() {

}

Polyline.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: Polyline}
});

Polyline.THE_INSTANCE = new Polyline();

Polyline.prototype.checkValid = function(literal) {
    var list = this.split(literal, ',');
    if (list.length < 6) {
        throw this.newDatatypeException("A polyline must have at least six comma-separated integers.");
    }
    if (list.length % 2 != 0) {
        throw this.newDatatypeException("A polyline must have an even number of comma-separated integers.");
    }
    list.forEach(function(item){
        this.checkInt(item.getSequence(), item.getOffset());
    }, this);
};

Polyline.prototype.getName = function() {
    return "polyline";
};

exports.Polyline = Polyline;
},{"./AbstractInt":111}],156:[function(require,module,exports){
var AbstractInt = require('./AbstractInt').AbstractInt;

function Rectangle() {

}

Rectangle.prototype = Object.create(AbstractInt.prototype, {
    constructor: {value: Rectangle}
});

Rectangle.THE_INSTANCE = new Rectangle();

Rectangle.prototype.checkValid = function(literal) {
    var list = this.split(literal, ',');
    if (list.length != 4) {
        throw this.newDatatypeException("A rectangle must have four comma-separated integers.");
    }
    list.forEach(function(item){
        this.checkInt(item.getSequence(), item.getOffset());
    }, this);
    if (parseInt(list[0].getSequence()) >=
        parseInt(list[2].getSequence())) {
        throw this.newDatatypeException("The first integer must be less than the third.");
    }
    if (parseInt(list[1].getSequence()) >=
        parseInt(list[3].getSequence())) {
        throw this.newDatatypeException("The second integer must be less than the fourth.");
    }
};

Rectangle.prototype.getName = function() {
    return "rectangle";
};

exports.Rectangle = Rectangle;
},{"./AbstractInt":111}],157:[function(require,module,exports){
var IriRef = require('./IriRef').IriRef;

function Refresh() {

}

Refresh.prototype = Object.create(IriRef.prototype, {
    constructor: {value: Refresh}
});

Refresh.THE_INSTANCE = new Refresh();

Refresh.prototype.State = {
    AT_START: 0, DIGIT_SEEN: 1, SEMICOLON_SEEN: 2, SPACE_SEEN: 3, U_SEEN: 4, R_SEEN: 5, L_SEEN: 6, EQUALS_SEEN: 7
};

Refresh.prototype.checkValid = function (literal) {
    if (literal.length == 0) {
        throw this.newDatatypeException("Empty literal.");
    }
    var state = this.State.AT_START;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.AT_START:
                if (this.isAsciiDigit(c)) {
                    state = this.State.DIGIT_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a digit, but saw ", c, " instead.");
                }
            case this.State.DIGIT_SEEN:
                if (this.isAsciiDigit(c)) {
                    continue;
                } else if (c == ';') {
                    state = this.State.SEMICOLON_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a digit or a semicolon, but saw ", c,
                        " instead.");
                }
            case this.State.SEMICOLON_SEEN:
                if (this.isWhitespace(c)) {
                    state = this.State.SPACE_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected a space character, but saw ", c,
                        " instead.");
                }
            case this.State.SPACE_SEEN:
                if (this.isWhitespace(c)) {
                    continue;
                } else if (c == 'u' || c == 'U') {
                    state = this.State.U_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(
                        i,
                        "Expected a space character or the letter \u201Cu\u201D, but saw ",
                        c, " instead.");
                }
            case this.State.U_SEEN:
                if (c == 'r' || c == 'R') {
                    state = this.State.R_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected the letter \u201Cr\u201D, but saw ",
                        c, " instead.");
                }
            case this.State.R_SEEN:
                if (c == 'l' || c == 'L') {
                    state = this.State.L_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected the letter \u201Cl\u201D, but saw ",
                        c, " instead.");
                }
            case this.State.L_SEEN:
                if (c == '=') {
                    state = this.State.EQUALS_SEEN;
                    continue;
                } else {
                    throw this.newDatatypeException(i,
                        "Expected \u201C=\u201D, but saw ", c,
                        " instead.");
                }
            case this.State.EQUALS_SEEN:
                if (c == '"' || c == '\'') {
                    throw this.newDatatypeException(
                        "Expected an unquoted IRI reference, but saw ",
                        c, " instead.");
                }
                if (' ' == c || '\t' == c || '\n' == c || '\f' == c
                    || '\r' == c) {
                    throw this.newDatatypeException("Expected an IRI reference, but saw whitespace instead.");
                }
                var l = literal.charAt(literal.length - 1);
                if (' ' == l || '\t' == l || '\n' == l || '\f' == l
                    || '\r' == l) {
                    throw this.newDatatypeException("Trailing whitespace.");
                }
                IriRef.prototype.checkValid.call(this, literal.substring(i, literal.length));
                return;
        }
    }
    switch (state) {
        case this.State.AT_START:
            throw this.newDatatypeException("Expected a digit, but the literal ended.");
        case this.State.DIGIT_SEEN:
            return;
        case this.State.SEMICOLON_SEEN:
            throw this.newDatatypeException("Expected a space character, but the literal ended.");
        case this.State.SPACE_SEEN:
            throw this.newDatatypeException("Expected a space character or the letter \u201Cu\u201D, but the literal ended.");
        case this.State.U_SEEN:
            throw this.newDatatypeException("Expected the letter \u201Cr\u201D, but the literal ended.");
        case this.State.R_SEEN:
            throw this.newDatatypeException("Expected the letter \u201Cl\u201D, but the literal ended.");
        case this.State.L_SEEN:
            throw this.newDatatypeException("Expected \u201C=\u201D, but the literal ended.");
        case this.State.EQUALS_SEEN:
            throw this.newDatatypeException("Expected an IRI reference, but the literal ended.");
    }
};

Refresh.prototype.getName = function () {
    return "refresh";
};

exports.Refresh = Refresh;
},{"./IriRef":140}],158:[function(require,module,exports){
var CdoCdcPair = require('./CdoCdcPair').CdoCdcPair;

function Script() {

}

Script.prototype = Object.create(CdoCdcPair.prototype, {
    constructor: {value: Script}
});

Script.THE_INSTANCE = new Script();

Script.prototype.checkValid = function (literal) {
    // FIXME This does not yet check for script-start and script-end.
    CdoCdcPair.prototype.checkValid.call(this, literal);
};

Script.prototype.getName = function () {
    return "embedded script content";
};

exports.Script = Script;
},{"./CdoCdcPair":115}],159:[function(require,module,exports){
var Script = require('./Script').Script;

function ScriptDocumentation() {

}

ScriptDocumentation.prototype = Object.create(Script.prototype, {
    constructor: {value: ScriptDocumentation}
});

ScriptDocumentation.THE_INSTANCE = new ScriptDocumentation();

ScriptDocumentation.prototype.State  = {
    BEFORE_DOCUMENTATION: 0, SLASH: 1, IN_COMMENT: 2, IN_LINE_COMMENT: 3, STAR: 4
};

ScriptDocumentation.prototype.checkValid = function (literal) {
    var state = this.State.BEFORE_DOCUMENTATION;
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        switch (state) {
            case this.State.BEFORE_DOCUMENTATION:
                switch (c) {
                    case ' ':
                    case '\t':
                    case '\n':
                        continue;
                    case '/':
                        if (i == literal.length - 1) {
                            throw this.newDatatypeException("Expected asterisk or slash but content ended with a "
                                + "single slash instead.");
                        }
                        state = this.State.SLASH;
                        continue;
                    default:
                        throw this.newDatatypeException("Expected space, tab, newline, or slash but found \u201c"
                            + c + "\u201d instead.");
                }
            case this.State.SLASH:
                switch (c) {
                    case '*':
                        state = this.State.IN_COMMENT;
                        continue;
                    case '/':
                        state = this.State.IN_LINE_COMMENT;
                        continue;
                    default:
                        throw this.newDatatypeException("Expected asterisk or slash but found \u201c"
                            + c + "\u201d instead.");
                }
            case this.State.IN_COMMENT:
                switch (c) {
                    case '*':
                        state = this.State.STAR;
                        continue;
                    default:
                        continue;
                }
            case this.State.STAR:
                switch (c) {
                    case '/':
                        state = this.State.BEFORE_DOCUMENTATION;
                        continue;
                    default:
                        continue;
                }
            case this.State.IN_LINE_COMMENT:
                switch (c) {
                    case '\n':
                        state = this.State.BEFORE_DOCUMENTATION;
                        continue;
                    default:
                        continue;
                }
            default:
                throw this.newDatatypeException("Content ended prematurely.");
        }
    }
    if (state == this.State.IN_LINE_COMMENT) {
        throw this.newDatatypeException("Content contains a line starting with"
            + " the character sequence \u201c//\u201d but not ending"
            + " with a newline.");
    }
    if (state == this.State.IN_COMMENT || state == this.State.STAR) {
        throw this.newDatatypeException("Content contains the character"
            + " sequence \u201c/*\u201d without a later occurrence of"
            + " the character sequence \u201c*/\u201d.");
    }
    Script.prototype.checkValid.call(this, literal);
};

ScriptDocumentation.prototype.getName = function () {
    return "script documentation";
};

exports.ScriptDocumentation = ScriptDocumentation;
},{"./Script":158}],160:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function SimpleColor() {

}

SimpleColor.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: SimpleColor}
});

SimpleColor.THE_INSTANCE = new SimpleColor();

SimpleColor.prototype.checkValid = function (literal) {
    if (literal.length != 7) {
        throw this.newDatatypeException("Incorrect length for color string.");
    }
    var c = literal.charAt(0);
    if (c != '#') {
        throw this.newDatatypeException(0,
            "Color starts with incorrect character ", c,
            ". Expected the number sign.");
    }
    for (var i = 1; i < 7; i++) {
        c = literal.charAt(i);
        if (!((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f'))) {
            throw this.newDatatypeException(0, "", c,
                " is not a valid hexadecimal digit.");
        }
    }
};

SimpleColor.prototype.getName = function () {
    return "color";
};

exports.SimpleColor = SimpleColor;
},{"./AbstractDatatype":109}],161:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function StringWithoutLineBreaks() {

}

StringWithoutLineBreaks.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:StringWithoutLineBreaks}
});

StringWithoutLineBreaks.THE_INSTANCE = new StringWithoutLineBreaks();

StringWithoutLineBreaks.prototype.checkValid = function (literal) {
    for (var i = 0; i < literal.length; i++) {
        var c = literal.charAt(i);
        if (c == '\n') {
            throw this.newDatatypeException(i, "Line feed not allowed.");
        } else if (c == '\r') {
            throw this.newDatatypeException(i, "Carriage return not allowed.");
        }
    }
};

StringWithoutLineBreaks.prototype.getName = function () {
    return "string without line breaks";
};

exports.StringWithoutLineBreaks = StringWithoutLineBreaks;
},{"./AbstractDatatype":109}],162:[function(require,module,exports){
var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

function Time() {

}

Time.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: Time}
});

Time.THE_INSTANCE = new Time();

Time.prototype.THE_PATTERN = new RegExp("^([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.[0-9]{1,3})?)?$");

Time.prototype.checkValid = function(literal) {
    var m = this.getPattern().exec(literal);
    if (m) {
        this.checkHour(m[1]);
        this.checkMinute(m[2]);
        var seconds = m[3];
        if (seconds != null) {
            this.checkSecond(seconds);
        }
    } else {
        throw this.newDatatypeException(
            "The literal did not satisfy the format for time.");
    }
}

Time.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

Time.prototype.getName = function () {
    return "time";
};

exports.Time = Time;
},{"./AbstractDatetime":110}],163:[function(require,module,exports){
(function(){var AbstractDatetime = require('./AbstractDatetime').AbstractDatetime;

/**
 * This datatype shall accept strings that conform to the format specified for
 * <a href='http://whatwg.org/specs/web-forms/current-work/#date'><code>date</code></a>
 * inputs in Web Forms 2.0.
 * <p>This datatype must not accept the empty string.
 *
 * @version $Id$
 * @author hsivonen
 */
function TimeDatetime() {

}

TimeDatetime.prototype = Object.create(AbstractDatetime.prototype, {
    constructor: {value: TimeDatetime}
});

TimeDatetime.THE_INSTANCE = new TimeDatetime();

/**
 * The rexexp for this datatype.
 *
 * See also AbstractDatetime#checkValid, which references the capturing
 * groups in this regexp.
 *
 * Capturing groups:
 *
 *  valid month string
 *    1 = year
 *    2 = month
 *
 *  valid date string
 *    3 = year
 *    4 = month
 *    5 = day
 *
 *  valid yearless date string
 *    6 = month
 *    7 = day
 *
 *  valid time string
 *    8 = hours
 *    9 = minutes
 *   10 = seconds
 *   11 = milliseconds
 *
 *  valid local date and time string
 *   12 = year
 *   13 = month
 *   14 = day
 *   15 = hours
 *   16 = minutes
 *   17 = seconds
 *   18 = milliseconds
 *
 *  valid time-zone offset string
 *   19 = timezone hours
 *   20 = timezone minutes
 *
 *  valid global date and time string
 *   21 = year
 *   22 = month
 *   23 = day
 *   24 = hours
 *   25 = minutes
 *   26 = seconds
 *   27 = milliseconds
 *   28 = timezone hours
 *   29 = timezone minutes
 *
 *  valid week string
 *   30 = year
 *   31 = week
 *
 *  valid year (valid non-negative integer)
 *   32 = year
 *
 *  valid duration string
 *   33 = milliseconds
 *   34 = milliseconds
 *
 */
TimeDatetime.prototype.THE_PATTERN = new RegExp("^[ \\t\\r\\n\\f]*(?:(?:([0-9]{4,})-([0-9]{2}))|(?:([0-9]{4,})-([0-9]{2})-([0-9]{2}))|(?:([0-9]{2})-([0-9]{2}))|(?:([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.([0-9]+))?)?)|(?:([0-9]{4,})-([0-9]{2})-([0-9]{2})(?:T| )([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.([0-9]+))?)?)|(?:Z|(?:[+-]([0-9]{2}):?([0-9]{2})))|(?:([0-9]{4,})-([0-9]{2})-([0-9]{2})(?:T| )([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\\.([0-9]+))?)?(?:Z|(?:[+-]([0-9]{2}):?([0-9]{2}))))|(?:([0-9]{4,})-W([0-9]{2}))|(?:([0-9]{4,}))|(?:P(?:(?:[0-9]+D)|(?:(?:[0-9]+D)?T[0-9]+H)|(?:(?:[0-9]+D)?T(?:[0-9]+H)?[0-9]+M)|(?:(?:[0-9]+D)?T(?:(?:[0-9]+)H)?(?:(?:[0-9]+)M)?(?:[0-9]+(?:\\.([0-9]+))?S))))|(?:[ \\t\\r\\n\\f]*[0-9]+(?:(?:[ \\t\\r\\n\\f]*(?:[Ww]|[Dd]|[Hh]|[Mm]))|(?:(?:\\.([0-9]+))?[ \\t\\r\\n\\f]*[Ss])))+)[ \\t\\r\\n\\f]*$");

TimeDatetime.prototype.getPattern = function () {
    return this.THE_PATTERN;
};

TimeDatetime.prototype.getName = function () {
    return "time-datetime";
};

exports.TimeDatetime = TimeDatetime;
})()
},{"./AbstractDatetime":110}],164:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Week() {

}

Week.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:Week}
});

Week.THE_INSTANCE = new Week();

Week.prototype.SPECIAL_YEARS = [ 4, 9, 15, 20, 26, 32, 37, 43,
    48, 54, 60, 65, 71, 76, 82, 88, 93, 99, 105, 111, 116, 122, 128,
    133, 139, 144, 150, 156, 161, 167, 172, 178, 184, 189, 195, 201,
    207, 212, 218, 224, 229, 235, 240, 246, 252, 257, 263, 268, 274,
    280, 285, 291, 296, 303, 308, 314, 320, 325, 331, 336, 342, 348,
    353, 359, 364, 370, 376, 381, 387, 392, 398 ];

Week.prototype.THE_PATTERN = new RegExp("^([0-9]{4,})-W([0-9]{2})$");

Week.prototype.checkWeek = function(year, week) {
    year = parseInt(year);
    week = parseInt(week);
    if (year < 1) {
        throw this.newDatatypeException("Year cannot be less than 1.");
    }
    if (week < 1) {
        throw this.newDatatypeException("Week cannot be less than 1.");
    }
    if (week == 53) {
        if (this.SPECIAL_YEARS.indexOf(year % 400) < 0) {
            throw this.newDatatypeException("Week out of range.");
        }
    } else if (week > 53) {
        throw this.newDatatypeException("Week out of range.");
    }
};

Week.prototype.checkValid = function (literal) {
    var m = this.THE_PATTERN.exec(literal);
    if (m) {
        this.checkWeek(m[1], m[2]);
    } else {
        throw this.newDatatypeException(
            "The literal did not satisfy the format for week.");
    }
};

Week.prototype.getName = function () {
    return "week";
};

exports.Week = Week;
},{"./AbstractDatatype":109}],165:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function XmlName() {

}

XmlName.prototype = Object.create(AbstractDatatype.prototype, {
    constructor:{value:XmlName}
});

XmlName.THE_INSTANCE = new XmlName();

XmlName.prototype.checkValid = function (literal) {
// todo
};

XmlName.prototype.getName = function () {
    return "XML name";
};

exports.XmlName = XmlName;
},{"./AbstractDatatype":109}],166:[function(require,module,exports){
var AbstractDatatype = require('./AbstractDatatype').AbstractDatatype;

function Zero() {

}

Zero.prototype = Object.create(AbstractDatatype.prototype, {
    constructor: {value: Zero}
});

Zero.THE_INSTANCE = new Zero();

Zero.prototype.checkValid = function (literal) {
    if (literal.length != 1 || literal.charAt(0) != '0') {
        throw this.newDatatypeException(0, "Only \u201C0\u201D is a permitted zero literal.");
    }
};

Zero.prototype.getName = function () {
    return "zero";
};

exports.Zero = Zero;
},{"./AbstractDatatype":109}],167:[function(require,module,exports){
/**
 * Datatype object.
 *
 * This object has the following functionality:
 *
 * <ol>
 *  <li> functionality to identify a class of character sequences. This is
 *       done through the isValid method.
 *
 *  <li> functionality to produce a "value object" from a character sequence and
 *       context information.
 *
 *  <li> functionality to test the equality of two value objects.
 * </ol>
 *
 * This interface also defines the createStreamingValidator method,
 * which is intended to efficiently support the validation of
 * large character sequences.
 *
 * @interface
 */
function Datatype() {}

/**
 * Checks if the specified 'literal' matches this Datatype
 * with respect to the current context.
 *
 * @param {String} literal
 *		the lexical representation to be checked.
 * @param {ValidationContext} context
 *		If this datatype is context-dependent
 *		(i.e. the {@link #isContextDependent} method returns true),
 *		then the caller must provide a non-null valid context object.
 *		Otherwise, the caller can pass null.
 *
 * @return
 *		true if the 'literal' is a member of this Datatype;
 *		false if it's not a member of this Datatype.
 */
Datatype.isValid = function(literal, context) {};
/**
 * Similar to the isValid method but throws an exception with diagnosis
 * in case of errors.
 *
 * <p>
 * If the specified 'literal' is a valid lexical representation for this
 * datatype, then this method must return without throwing any exception.
 * If not, the callee must throw an exception (with diagnosis message,
 * if possible.)
 *
 * <p>
 * The application can use this method to provide detailed error message
 * to users. This method is kept separate from the isValid method to
 * achieve higher performance during normal validation.
 *
 * @param {String} literal
 * @param {ValidationContext} context
 * @exception DatatypeException
 *		If the given literal is invalid, then this exception is thrown.
 *		If the callee supports error diagnosis, then the exception should
 *		contain a diagnosis message.
 */
Datatype.checkValid = function(literal, context)  {};

/**
 * Creates an instance of a streaming validator for this type.
 *
 * <p>
 * By using streaming validators instead of the isValid method,
 * the caller can avoid keeping the entire string, which is
 * sometimes quite big, in memory.
 *
 * @param {ValidationContext} context
 *		If this datatype is context-dependent
 *		(i.e. the {@link #isContextDependent} method returns true),
 *		then the caller must provide a non-null valid context object.
 *		Otherwise, the caller can pass null.
 *		The callee may keep a reference to this context object
 *		only while the returned streaming validator is being used.
 * @return DatatypeStreamingValidator
 */
Datatype.createStreamingValidator = function(context) {};

/**
 * Converts lexcial value and the current context to the corresponding
 * value object.
 *
 * <p>
 * The caller cannot generally assume that the value object is
 * a meaningful Java object. For example, the caller cannot expect
 * this method to return <code>java.lang.Number</code> type for
 * the "integer" type of XML Schema Part 2.
 *
 * <p>
 * Also, the caller cannot assume that the equals method and
 * the hashCode method of the value object are consistent with
 * the semantics of the datatype. For that purpose, the sameValue
 * method and the valueHashCode method have to be used. Note that
 * this means you cannot use classes like
 * <code>java.util.Hashtable</code> to store the value objects.
 *
 * <p>
 * The returned value object should be used solely for the sameValue
 * and valueHashCode methods.
 *
 * @param {String} literal
 * @param {ValidationContext} context
 *		If this datatype is context-dependent
 *		(when the {@link #isContextDependent} method returns true),
 *		then the caller must provide a non-null valid context object.
 *		Otherwise, the caller can pass null.
 *
 * @return	null
 *		when the given lexical value is not a valid lexical
 *		value for this type.
 */
Datatype.createValue = function(literal, context) {};

/**
 * Tests the equality of two value objects which were originally
 * created by the createValue method of this object.
 *
 * The behavior is undefined if objects not created by this type
 * are passed. It is the caller's responsibility to ensure that
 * value objects belong to this type.
 *
 * @param {Object} value1
 * @param {Object} value2
 * @return
 *		true if two value objects are considered equal according to
 *		the definition of this datatype; false if otherwise.
 */
Datatype.sameValue = function(value1, value2) {};


/**
 * Computes the hash code for a value object,
 * which is consistent with the sameValue method.
 *
 * @param {Object} value
 * @return
 *		hash code for the specified value object.
 */
Datatype.valueHashCode = function(value) {};




/**
 * Indicates that the datatype doesn't have ID/IDREF semantics.
 *
 * This value is one of the possible return values of the
 * {@link #getIdType} method.
 */
Datatype.ID_TYPE_NULL = 0;

/**
 * Indicates that RELAX NG compatibility processors should
 * treat this datatype as having ID semantics.
 *
 * This value is one of the possible return values of the
 * {@link #getIdType} method.
 */
Datatype.ID_TYPE_ID = 1;

/**
 * Indicates that RELAX NG compatibility processors should
 * treat this datatype as having IDREF semantics.
 *
 * This value is one of the possible return values of the
 * {@link #getIdType} method.
 */
Datatype.ID_TYPE_IDREF = 2;

/**
 * Indicates that RELAX NG compatibility processors should
 * treat this datatype as having IDREFS semantics.
 *
 * This value is one of the possible return values of the
 * {@link #getIdType} method.
 */
Datatype.ID_TYPE_IDREFS = 3;

/**
 * Checks if the ID/IDREF semantics is associated with this
 * datatype.
 *
 * <p>
 * This method is introduced to support the RELAX NG DTD
 * compatibility spec. (Of course it's always free to use
 * this method for other purposes.)
 *
 * <p>
 * If you are implementing a datatype library and have no idea about
 * the "RELAX NG DTD compatibility" thing, just return
 * <code>ID_TYPE_NULL</code> is fine.
 *
 * @return
 *		If this datatype doesn't have any ID/IDREF semantics,
 *		it returns {@link #ID_TYPE_NULL}. If it has such a semantics
 *		(for example, XSD:ID, XSD:IDREF and comp:ID type), then
 *		it returns {@link #ID_TYPE_ID}, {@link #ID_TYPE_IDREF} or
 *		{@link #ID_TYPE_IDREFS}.
 */
Datatype.getIdType = function() {};


/**
 * Checks if this datatype may need a context object for
 * the validation.
 *
 * <p>
 * The callee must return true even when the context
 * is not always necessary. (For example, the "QName" type
 * doesn't need a context object when validating unprefixed
 * string. But nonetheless QName must return true.)
 *
 * <p>
 * XSD's <code>string</code> and <code>short</code> types
 * are examples of context-independent datatypes.
 * Its <code>QName</code> and <code>ENTITY</code> types
 * are examples of context-dependent datatypes.
 *
 * <p>
 * When a datatype is context-independent, then
 * the {@link #isValid} method, the {@link #checkValid} method,
 * the {@link #createStreamingValidator} method and
 * the {@link #createValue} method can be called without
 * providing a context object.
 *
 * @return
 *		<b>true</b> if this datatype is context-dependent
 *		(it needs a context object sometimes);
 *
 *		<b>false</b> if this datatype is context-<b>in</b>dependent
 *		(it never needs a context object).
 */
Datatype.isContextDependent = function() {};

exports.Datatype = Datatype;
},{}],168:[function(require,module,exports){
function DatatypeException(index, msg) {
    if (typeof index == "undefined") {
        index = this.UNKNOWN;
        msg = null;
    }
    else if (typeof index == "string") {
        msg = index;
        index = this.UNKNOWN;
    }
    else if (typeof msg == "undefined") {
        msg = null;
    }
    // todo Exceptions
    this.index = index;
    this.message = msg;
}

DatatypeException.UNKNOWN = -1;

DatatypeException.prototype.UNKNOWN = DatatypeException.UNKNOWN;

exports.DatatypeException = DatatypeException;
},{}],169:[function(require,module,exports){
var DatatypeException = require('../DatatypeException').DatatypeException;
/**
 *
 * @class
 * @implements DatatypeBuilder
 */
function ParameterlessDatatypeBuilder(baseType) {
    this.baseType = baseType;
}

ParameterlessDatatypeBuilder.prototype.addParameter = function() {
    throw new DatatypeException();
};

ParameterlessDatatypeBuilder.prototype.createDatatype = function() {
    return this.baseType;
};

exports.ParameterlessDatatypeBuilder = ParameterlessDatatypeBuilder;
},{"../DatatypeException":168}],170:[function(require,module,exports){
module.exports={
  "illegal_href_attribute": "illegal \"href\" attribute",
  "ns_attribute_ignored": "\"ns\" attribute ignored",
  "reference_to_undefined": "reference to undefined pattern \"{0}\"",
  "missing_start_element": "missing \"start\" element",
  "recursive_reference": "bad recursive reference to pattern \"{0}\"",
  "recursive_include": "recursive inclusion of URL \"{0}\"",
  "duplicate_define": "multiple definitions of \"{0}\" without \"combine\" attribute",
  "duplicate_start": "multiple definitions of start without \"combine\" attribute",
  "conflict_combine_define": "conflicting values of \"combine\" attribute for definition of \"{0}\"",
  "conflict_combine_start": "conflicting values of \"combine\" attribute for definition of start",
  "missing_start_replacement": "\"start\" in \"include\" does not override anything",
  "missing_define_replacement": "definition of \"{0}\" in \"include\" does not override anything",
  "interleave_string": "interleave of \"string\" or \"data\" element",
  "group_string": "group of \"string\" or \"data\" element",
  "one_or_more_string": "repeat of \"string\" or \"data\" element",
  "unrecognized_datatype": "datatype \"{1}\" from library \"{0}\" not recognized",
  "unsupported_datatype_detail": "datatype \"{1}\" from library \"{0}\" not supported: {2}",
  "unrecognized_datatype_library": "datatype library \"{0}\" not recognized",
  "unrecognized_builtin_datatype": "no such builtin datatype \"{0}\": must be \"string\" or \"token\"",
  "invalid_value": "\"{0}\" is not a valid value of the datatype",
  "parent_ref_outside_grammar": "reference to non-existent parent grammar",
  "ref_outside_grammar": "reference to non-existent grammar",
  "expected_one_name_class": "found \"{0}\" element but expected no further content",
  "builtin_param": "builtin datatypes do not have any parameters",
  "invalid_param_display": "invalid parameter:\n{0}",
  "invalid_param_detail_display": "invalid parameter: {0}:\n{1}",
  "display_param": "{0}>>>>{1}",
  "invalid_param_detail": "invalid parameter: {0}",
  "invalid_param": "invalid parameter",
  "invalid_params_detail": "invalid parameters: {0}",
  "invalid_params": "invalid parameters",
  "datatype_requires_parameter": "datatype cannot be used without parameters",
  "datatype_requires_parameter_detail": "datatype cannot be used without parameters: {0}",

  "attribute_contains_attribute": "an attribute pattern must not contain an attribute pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path attribute//attribute)",
  "attribute_contains_element": "an attribute pattern must not contain an element pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path attribute//ref)",
  "data_except_contains_attribute": "a data pattern must not exclude an attribute pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//attribute)",
  "data_except_contains_element": "a data pattern must not exclude an element pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//ref)",
  "data_except_contains_empty": "a data pattern must not exclude an empty pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//empty)",
  "data_except_contains_group": "a data pattern must not exclude a group (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//group)",
  "data_except_contains_interleave": "a data pattern must not exclude an interleaved group (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//interleave)",
  "data_except_contains_list": "a data pattern must not exclude a list pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//list)",
  "data_except_contains_one_or_more": "a data pattern must not exclude a repetition (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//oneOrMore)",
  "data_except_contains_text": "a data pattern must not exclude a text pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path data/except//text)",
  "list_contains_attribute": "a list pattern must not contain an attribute pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path list//attribute)",
  "list_contains_element": "a list pattern must not contain an element pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path list//ref)",
  "list_contains_list": "a list pattern must not contain a list pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path list//list)",
  "list_contains_text": "a list pattern must not contain a text pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path list//text)",
  "list_contains_interleave": "a list pattern must not contain an interleave pattern (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path list//interleave)",
  "one_or_more_contains_group_contains_attribute": "a group of attributes must not be repeatable (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path oneOrMore//group//attribute)",
  "one_or_more_contains_interleave_contains_attribute": "an interleaved group of attributes must not be repeatable (section 7.1 of the RELAX NG specification requires that the simplified XML form of the schema not contain any elements matching the path oneOrMore//interleave//attribute)",
  "start_contains_attribute": "found element matching the prohibited path start//attribute in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_data": "found element matching the prohibited path start//data in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_empty": "found element matching the prohibited path start//empty in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_group": "found element matching the prohibited path start//group in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_interleave": "found element matching the prohibited path start//interleave in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_list": "found element matching the prohibited path start//list in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_one_or_more": "found element matching the prohibited path start//oneOrMore in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_text": "found element matching the prohibited path start//text in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "start_contains_value": "found element matching the prohibited path start//value in the simplified XML form of the schema (see section 7.1 of the RELAX NG specification)",
  "duplicate_attribute": "duplicate attribute",
  "duplicate_attribute_name": "duplicate attribute {0}",
  "duplicate_attribute_ns": "attributes from namespace \"{0}\" can occur more than once",
  "interleave_element_overlap": "overlapping element names in operands of \"interleave\"",
  "interleave_element_overlap_name": "the element {0} can occur in more than one operand of \"interleave\"",
  "interleave_element_overlap_ns": "elements from namespace \"{0}\" can occur in more than one operand of \"interleave\"",
  "interleave_text_overlap": "both operands of \"interleave\" contain \"text\"",
  "open_name_class_not_repeated": "attribute using \"nsName\" or \"anyName\" must be in \"oneOrMore\"",
  "xmlns_uri_attribute": "attribute must not have namespace URI \"http://www.w3.org/2000/xmlns\"",
  "xmlns_attribute": "attribute must not be named \"xmlns\"",

  "unknown_element": "element {0} not allowed anywhere{1}",
  "unexpected_element_required_element_missing": "element {0} not allowed yet; missing required element {1}",
  "unexpected_element_required_elements_missing": "element {0} not allowed yet; missing required elements {1}",
  "element_not_allowed_yet": "element {0} not allowed yet{1}",
  "out_of_context_element": "element {0} not allowed here{1}",
  "no_attributes_allowed": "found attribute {0}, but no attributes allowed here",
  "invalid_attribute_name": "attribute {0} not allowed here{1}",
  "invalid_attribute_value": "value of attribute {0} is invalid{1}",
  "required_attributes_missing_expected": "element {0} missing one or more required attributes{1}",
  "required_attribute_missing": "element {0} missing required attribute {1}",
  "required_attributes_missing": "element {0} missing required attributes {1}",
  "incomplete_element_required_elements_missing_expected": "element {0} incomplete{1}",
  "incomplete_element_required_element_missing": "element {0} incomplete; missing required element {1}",
  "incomplete_element_required_elements_missing": "element {0} incomplete; missing required elements {1}",
  "text_not_allowed": "text not allowed here{0}",
  "document_incomplete": "document incompletely matched",
  "invalid_element_value": "character content of element {0} invalid{1}",
  "blank_not_allowed": "empty content for element {0} not allowed{1}",
  "schema_allows_nothing": "schema does not allow anything: it is equivalent to <notAllowed/>",

  "id_element_name_class": "an \"element\" pattern containing an \"attribute\" pattern with a non-null ID-type must have a name class that contains only \"choice\" and \"name\" elements",
  "id_attribute_name_class": "an \"attribute\" pattern with a non-null ID-type must have a name class that is a single name",
  "id_parent": "a \"data\" or \"value\" pattern with non-null ID-type must occur as the child of an \"attribute\" pattern",
  "id_type_conflict": "conflicting ID-types for attribute {1} of element {0}",

  "id_no_tokens": "value of attribute of type ID contained no tokens",
  "id_multiple_tokens": "value of attribute of type ID contained multiple tokens",
  "idref_no_tokens": "value of attribute of type IDREF contained no tokens",
  "idref_multiple_tokens": "value of attribute of type IDREF contained multiple tokens",
  "idrefs_no_tokens": "value of attribute of type IDREFS contained no tokens",
  "missing_id": "IDREF \"{0}\" without matching ID",
  "duplicate_id": "ID \"{0}\" has already been defined",
  "first_id": "first occurrence of ID \"{0}\"",

  "name_absent_namespace": "\"{0}\"",
  "name_with_namespace": "\"{1}\" from namespace \"{0}\"",
  "qname": "\"{0}\"",
  "qnames_nsdecls": "{0} (with {1})",
  "or_list_pair": "{0} or {1}",
  "or_list_many_first": "{0}",
  "or_list_many_middle": "{0}, {1}",
  "or_list_many_last": "{0} or {1}",
  "and_list_pair": "{0} and {1}",
  "and_list_many_first": "{0}",
  "and_list_many_middle": "{0}, {1}",
  "and_list_many_last": "{0} and {1}",

  "expected": "; expected {0}",
  "element_end_tag": "the element end-tag",
  "text": "text",
  "data": "data",
  "element_list": "element {0}",
  "element_other_ns": "an element from another namespace",
  "expected_attribute": "; expected attribute {0}",
  "expected_attribute_or_other_ns": "; expected attribute {0} or an attribute from another namespace",
  "data_failures": "; {0}",
  "token_failures": "; token {0} invalid; {1}",
  "missing_token": "; missing token; {0}",
  "expected_data": "; expected data",
  "require_values": "must be equal to {0}",
  "require_qnames": "must be a QName equal to {0}",
  "require_datatype": "must be a valid instance of datatype {0}"
}
},{}],171:[function(require,module,exports){
(function(){/*
Copyright or � or Copr. Nicolas Debeissat, Brett Zamir

nicolas.debeissat@gmail.com (http://debeissat.nicolas.free.fr/) brettz9@yahoo.com

This software is a computer program whose purpose is to parse XML
files respecting SAX2 specifications.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 

As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 

In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.

*/

// NOTE: We have at least a skeleton for all non-deprecated, non-adapter SAX2 classes/interfaces/exceptions,
// except for InputSource: http://www.saxproject.org/apidoc/org/xml/sax/InputSource.html which works largely
// with streams; we use our own parseString() instead of XMLReader's parse() which expects the InputSouce (or
// systemId); note that resolveEntity() on EntityResolver and also getExternalSubset() on EntityResolver2 return
// an InputSource; Locator and Locator2 also have notes on InputSource

var AttributesImpl = require('./AttributesImpl').AttributesImpl;

(function () { // Begin namespace

var that = this; // probably window object


/* Private static variables (constant) */

/* XML Name regular expressions */
var NAME_START_CHAR = ":A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u0200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\ud800-\udb7f\udc00-\udfff"; // The last two ranges are for surrogates that comprise #x10000-#xEFFFF
var NAME_END_CHAR = ".0-9\u00B7\u0300-\u036F\u203F-\u2040-"; // Don't need escaping since to be put in a character class
var NOT_START_OR_END_CHAR = new RegExp("[^" + NAME_START_CHAR + NAME_END_CHAR + "]");

var WS = /\s/; // Fix: verify \s is XML whitespace, and allowable in all places using this expression

/* Scanner states  */
var STATE_XML_DECL                  =  0;
var STATE_PROLOG                    =  1;
var STATE_PROLOG_DOCTYPE_DECLARED   =  2;
var STATE_ROOT_ELEMENT              =  3;
var STATE_CONTENT                   =  4;
var STATE_TRAILING_MISC             =  5;

/* Error values */
var WARNING = "W";
var ERROR = "E";
var FATAL = "F";



/* Supporting functions and exceptions */

// UNUSED and IMPLEMENTED
/*
FIELDS
static java.lang.String 	NSDECL
          The namespace declaration URI as a constant.
static java.lang.String 	XMLNS
          The XML Namespace URI as a constant.

Method Summary
 boolean 	declarePrefix(java.lang.String prefix, java.lang.String uri)
          Declare a Namespace prefix.
 java.util.Enumeration 	getDeclaredPrefixes()
          Return an enumeration of all prefixes declared in this context.
 java.lang.String 	getPrefix(java.lang.String uri)
          Return one of the prefixes mapped to a Namespace URI.
 java.util.Enumeration 	getPrefixes()
          Return an enumeration of all prefixes whose declarations are active in the current context.
 java.util.Enumeration 	getPrefixes(java.lang.String uri)
          Return an enumeration of all prefixes for a given URI whose declarations are active in the current context.
 java.lang.String 	getURI(java.lang.String prefix)
          Look up a prefix and get the currently-mapped Namespace URI.
 boolean 	isNamespaceDeclUris()
          Returns true if namespace declaration attributes are placed into a namespace.
 void 	popContext()
          Revert to the previous Namespace context.
 java.lang.String[] 	processName(java.lang.String qName, java.lang.String[] parts, boolean isAttribute)
          Process a raw XML qualified name, after all declarations in the current context have been handled by declarePrefix().
 void 	pushContext()
          Start a new Namespace context.
 void 	reset()
          Reset this Namespace support object for reuse.
 void 	setNamespaceDeclUris(boolean value)
          Controls whether namespace declaration attributes are placed into the NSDECL namespace by processName().
 **/
// Note: Try to adapt for internal use, as well as offer for external app
// http://www.saxproject.org/apidoc/org/xml/sax/helpers/NamespaceSupport.html
function NamespaceSupport () {
    //this.NSDECL;
    //this.XMLNS;
    throw 'NamespaceSupport is not presently implemented';
}
NamespaceSupport.prototype.declarePrefix = function (prefix, uri) {

};
NamespaceSupport.prototype.getDeclaredPrefixes = function () {

};
NamespaceSupport.prototype.getPrefix = function (uri) {

};
NamespaceSupport.prototype.getPrefixes = function () {

};
NamespaceSupport.prototype.getPrefixes = function (uri) {

};
NamespaceSupport.prototype.getURI = function (prefix) {

};
NamespaceSupport.prototype.isNamespaceDeclUris = function () {

};
NamespaceSupport.prototype.popContext = function () {

};
NamespaceSupport.prototype.processName = function (qName, parts, isAttribute) {

};
NamespaceSupport.prototype.pushContext = function () {

};
NamespaceSupport.prototype.reset = function () {

};
NamespaceSupport.prototype.setNamespaceDeclUris = function (value) {

};



// http://www.saxproject.org/apidoc/org/xml/sax/SAXException.html
function SAXException(message, exception) { // java.lang.Exception
    this.message = message;
    this.exception = exception;
}
SAXException.prototype = new Error(); // We try to make useful as a JavaScript error, though we could even implement java.lang.Exception
SAXException.constructor = SAXException;
SAXException.prototype.getMessage = function () {
    return this.message;
};
SAXException.prototype.getException = function () {
    return this.exception;
};

// Not fully implemented
// http://www.saxproject.org/apidoc/org/xml/sax/SAXNotSupportedException.html
function SAXNotSupportedException (msg) { // java.lang.Exception
    this.message = msg || '';
}
SAXNotSupportedException.prototype = new SAXException();
SAXNotSupportedException.constructor = SAXNotSupportedException;

// http://www.saxproject.org/apidoc/org/xml/sax/SAXNotRecognizedException.html
function SAXNotRecognizedException (msg) { // java.lang.Exception
    this.message = msg || '';
}
SAXNotRecognizedException.prototype = new SAXException();
SAXNotRecognizedException.constructor = SAXNotRecognizedException;

//This constructor is more complex and not presently implemented;
//  see Java API to implement additional arguments correctly
// http://www.saxproject.org/apidoc/org/xml/sax/SAXParseException.html
function SAXParseException (msg) { // java.lang.Exception //
    this.message = msg || '';
}
SAXParseException.prototype = new SAXException();
SAXParseException.constructor = SAXParseException;
SAXParseException.prototype.getColumnNumber = function () {};
SAXParseException.prototype.getLineNumber = function () {};
SAXParseException.prototype.getPublicId = function () {};
SAXParseException.prototype.getSystemId = function () {};


// Our own exception; should this perhaps extend SAXParseException?
function EndOfInputException() {}

/*
in case of attributes, empty prefix will be null because default namespace is null for attributes
in case of elements, empty prefix will be "".
*/
function Sax_QName(prefix, localName) {
    this.prefix = prefix;
    this.localName = localName;
    if (prefix) {
        this.qName = prefix + ":" + localName;
    } else {
        this.qName = localName;
    }
}
Sax_QName.prototype.equals = function(qName) {
    return this.qName === qName.qName;
};


// The official SAX2 parse() method is not implemented (that can either accept an InputSource object or systemId string;
//    for now the parseString() method can be used (and is more convenient than converting to an InputSource object).
// The feature/property defaults are incomplete, as they really depend on the implementation and how far we
//   implement them; however, we've added defaults, two of which (on namespaces) are required to be
//   supported (though they don't need to support both true and false options).
// FURTHER NOTES:
// 1) the only meaningful methods at the moment are: 
//  getProperty(), setProperty() (presently only for declarationHandler and lexicalHandler),
//  getContentHandler(), setContentHandler(),
//  getErrorHandler(), setErrorHandler(), and
//  our own parseString().
// 2) No property should be retrieved or set publicly.
// 3) The SAXParser constructor currently only works with these arguments: first (partially), second, and fourth (partially)

// Currently does not call the following (as does the DefaultHandler2 class)
// 1) on the contentHandler: ignorableWhitespace(), skippedEntity(), setDocumentLocator() (including with Locator2)
// 2) on the DeclHandler: attributeDecl(), elementDecl(), externalEntityDecl()
// 3) on EntityResolver: resolveEntity()
// 4) on EntityResolver2: resolveEntity() (additional args) or getExternalSubset()
// 5) on DTDHandler: notationDecl(), unparsedEntityDecl()
// lexicalHandler and errorHandler interface methods, however, are all supported
// Need to also implement Attributes2 in startElement (rename AttributesImpl to Attributes2Impl and add interface)

function SAXParser (contentHandler, lexicalHandler, errorHandler, declarationHandler, dtdHandler, domNode) {
    // Implements SAX2 XMLReader interface (except for parse() methods); also add http://www.saxproject.org/apidoc/org/xml/sax/helpers/XMLFilterImpl.html ?
    // Since SAX2 doesn't specify constructors, this class is able to define its own behavior to accept a contentHandler, etc.

    this.contentHandler = contentHandler;
    this.dtdHandler = dtdHandler;
    this.errorHandler = errorHandler;
    this.entityResolver = null;
    
    //check that an implementation of Attributes is provided
    try {
        new AttributesImpl();
    } catch(e) {
        throw new SAXException("you must import an implementation of Attributes, like AttributesImpl.js, in the html", e);
    }
    
    this.disallowedGetProperty = [];
    this.disallowedGetFeature = [];
    this.disallowedSetProperty = [];
    this.disallowedSetFeature = [];

    this.disallowedSetPropertyValues = {};
    this.disallowedSetFeatureValues = {};

    // For official features and properties, see http://www.saxproject.org/apidoc/org/xml/sax/package-summary.html#package_description
    // We can define our own as well
    this.features = {}; // Boolean values
    this.features['http://xml.org/sax/features/external-general-entities'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/external-parameter-entities'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/is-standalone'] = undefined; // Can only be set during parsing
    this.features['http://xml.org/sax/features/lexical-handler/parameter-entities'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/namespaces'] = true; // must support true
    this.features['http://xml.org/sax/features/namespace-prefixes'] = false; // must support false
    this.features['http://xml.org/sax/features/resolve-dtd-uris'] = true;
    this.features['http://xml.org/sax/features/string-interning'] = true; // Make safe to treat string literals as identical to String()
    this.features['http://xml.org/sax/features/unicode-normalization-checking'] = false;
    this.features['http://xml.org/sax/features/use-attributes2'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/use-locator2'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/use-entity-resolver2'] = true;
    this.features['http://xml.org/sax/features/validation'] = false; // Not supported yet
    this.features['http://xml.org/sax/features/xmlns-uris'] = false;
    this.features['http://xml.org/sax/features/xml-1.1'] = false; // Not supported yet

    this.properties = {}; // objects
    this.properties['http://xml.org/sax/properties/declaration-handler'] = this.declarationHandler = declarationHandler;
    this.properties['http://xml.org/sax/properties/document-xml-version'] = this.documentXmlVersion = null;
    this.properties['http://xml.org/sax/properties/dom-node'] = this.domNode = domNode;
    this.properties['http://xml.org/sax/properties/lexical-handler'] = this.lexicalHandler = lexicalHandler || null;
    this.properties['http://xml.org/sax/properties/xml-string'] = this.xmlString = null;
}

// BEGIN SAX2 XMLReader INTERFACE
SAXParser.prototype.getContentHandler = function () {
    // Return the current content handler (ContentHandler).
    return this.contentHandler;
};
SAXParser.prototype.getDTDHandler = function () {
    // Return the current DTD handler (DTDHandler).
    return this.dtdHandler;
};
SAXParser.prototype.getEntityResolver = function () {
    // Return the current entity resolver (EntityResolver).
    return this.entityResolver;
};
SAXParser.prototype.getErrorHandler = function () {
    // Return the current error handler (ErrorHandler).
    return this.errorHandler;
};
SAXParser.prototype.getFeature = function (name) { // (java.lang.String)
    // Look up the value of a feature flag (boolean).
    if (this.features[name] === undefined) {
      throw new SAXNotRecognizedException();
    }
    else if (this.disallowedGetFeature.indexOf(name) !== -1) {
      throw new SAXNotSupportedException();
    }
    return this.features[name];
};
SAXParser.prototype.getProperty = function (name) { // (java.lang.String)
    // Look up the value of a property (java.lang.Object).
    // It is possible for an XMLReader to recognize a property name but temporarily be unable to return its value. Some property values may be available only in specific contexts, such as before, during, or after a parse.
    if (this.properties[name] === undefined) {
      throw new SAXNotRecognizedException();
    }
    else if (this.disallowedGetProperty.indexOf(name) !== -1) {
      throw new SAXNotSupportedException();
    }
    return this.properties[name];
};
SAXParser.prototype.parse = function (inputOrSystemId) { // (InputSource input OR java.lang.String systemId)
    // Parse an XML document (void). OR
    // Parse an XML document from a system identifier (URI) (void).
    // may throw java.io.IOException or SAXException
    throw 'Not implemented: at present you must use our non-SAX parseString() method';
};
SAXParser.prototype.setContentHandler = function (handler) { // (ContentHandler)
    // Allow an application to register a content event handler (void).
    this.contentHandler = handler;
};
SAXParser.prototype.setDTDHandler = function (handler) { // (DTDHandler)
    // Allow an application to register a DTD event handler (void).
    this.dtdHandler = handler;
};
SAXParser.prototype.setEntityResolver = function (resolver) { // (EntityResolver)
    // Allow an application to register an entity resolver (void).
    this.entityResolver = resolver;
};
SAXParser.prototype.setErrorHandler = function (handler) { // (ErrorHandler)
    // Allow an application to register an error event handler (void).
    this.errorHandler = handler;
};
SAXParser.prototype.setFeature = function (name, value) { // (java.lang.String, boolean)
    // Set the value of a feature flag (void).
    if (this.features[name] === undefined) { // Should be defined already in some manner
        throw new SAXNotRecognizedException();
    }
    else if (
            (this.disallowedSetFeatureValues[name] !== undefined &&
                    this.disallowedSetFeatureValues[name] === value) ||
                (this.disallowedSetFeature.indexOf(name) !== -1)
            ){
        throw new SAXNotSupportedException();
    }
    this.features[name] = value;
};
SAXParser.prototype.setProperty = function (name, value) { // (java.lang.String, java.lang.Object)
    // Set the value of a property (void).
    // It is possible for an XMLReader to recognize a property name but to be unable to change the current value. Some property values may be immutable or mutable only in specific contexts, such as before, during, or after a parse.
    if (this.properties[name] === undefined) { // Should be defined already in some manner
        throw new SAXNotRecognizedException();
    }
    else if (
                (this.disallowedSetPropertyValues[name] !== undefined &&
                    this.disallowedSetPropertyValues[name] === value) ||
                (this.disallowedSetProperty.indexOf(name) !== -1)
            ){
        throw new SAXNotSupportedException();
    }
    this.properties[name] = value;
};
// END SAX2 XMLReader INTERFACE


// BEGIN CUSTOM API (could make all but parseString() private)
SAXParser.prototype.parseString = function(xml) { // We implement our own for now, but should probably call the standard parse() which requires an InputSource object (or systemId string)
    this.xml = xml;
    this.length = xml.length;
    this.index = 0;
    this.ch = this.xml.charAt(this.index);
    this.state = STATE_XML_DECL;
    this.elementsStack = [];
    /* for each depth, a map of namespaces */
    this.namespaces = [];
    /* map between entity names and values */
    this.entities = {};
    this.contentHandler.startDocument();
    try {
        while (this.index < this.length) {
            this.next();
        }
        throw new EndOfInputException();
    } catch(e) {
        if (e instanceof SAXParseException) {
            this.errorHandler.fatalError(e);
        } else if (e instanceof EndOfInputException) {
            if (this.elementsStack.length > 0) {
                this.fireError("the markup " + this.elementsStack.pop() + " has not been closed", FATAL);
            } else {
                try {
                    this.contentHandler.endDocument();
                } catch(e2) {}
            }
        } else {
            throw e;
        }
    }
};

SAXParser.prototype.next = function() {
    this.skipWhiteSpaces();
    if (this.ch === ">") {
        this.nextChar();
    } else if (this.ch === "<") {
        this.nextChar();
        this.scanLT();
    } else if (this.elementsStack.length > 0) {
        this.scanText();
    //if elementsStack is empty it is text misplaced
    } else {
        this.fireError("can not have text at root level of the XML", FATAL);
    }
};



// [1] document ::= prolog element Misc*
//
// [22] prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?
// [23] XMLDecl ::= '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
// [24] VersionInfo ::= S 'version' Eq (' VersionNum ' | " VersionNum ")
//
// The beginning of XMLDecl simplifies to:
//    '<?xml' S ...
//
// [27] Misc ::= Comment | PI |  S
// [15] Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
// [16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
// [17] PITarget ::= Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))
//
// [28] doctypedecl ::= '<!DOCTYPE' S Name (S ExternalID)? S?
//                      ('[' (markupdecl | PEReference | S)* ']' S?)? '>'
//
//White Space
// [3] S ::=(#x20 | #x9 | #xD | #xA)+
SAXParser.prototype.scanLT = function() {
    if (this.state === STATE_XML_DECL) {
        if (!this.scanXMLDeclOrTextDecl()) {
            this.state = STATE_PROLOG;
            this.scanLT();
        } else {
            //if it was a XMLDecl (only one XMLDecl is permitted)
            this.state = STATE_PROLOG;
        }
    } else if (this.state === STATE_PROLOG) {
        if (this.ch === "!") {
            this.nextChar(true);
            if (!this.scanComment()) {
                //there is no other choice but, in case exception is not FATAL,
                // and in order to have equivalent behaviours between scan()
                if (this.scanDoctypeDecl()) {
                    this.state = STATE_PROLOG_DOCTYPE_DECLARED;
                }
            }
        } else if (this.ch === "?") {
            this.nextChar(true);
            //in case it is not a valid processing instruction
            //scanPI will throw the exception itself, with a better message
            this.scanPI();
        } else {
            this.state = STATE_ROOT_ELEMENT;
            //does not go to next char exiting the method
            this.scanLT();
        }
    } else if (this.state === STATE_PROLOG_DOCTYPE_DECLARED) {
        if (this.ch === "!") {
            this.nextChar(true);
            if (!this.scanComment()) {
                if (this.isFollowedBy("DOCTYPE")) {
                    this.fireError("can not have two doctype declarations", FATAL);
                } else {
                    this.fireError("invalid declaration, only a comment is allowed here after &lt;!", FATAL);
                }
            }
        } else if (this.ch === "?") {
            this.nextChar(true);
            //in case it is not a valid processing instruction
            //scanPI will throw the exception itself, with a better message
            this.scanPI();
        } else {
            this.state = STATE_ROOT_ELEMENT;
            //does not go to next char exiting the method
            this.scanLT();
        }
    } else if (this.state === STATE_ROOT_ELEMENT) {
        if (this.scanMarkup()) {
            this.state = STATE_CONTENT;
        } else {
            this.fireError("document is empty, no root element detected", FATAL);
        }
    } else if (this.state === STATE_CONTENT) {
        if (this.ch === "!") {
            this.nextChar(true);
            if (!this.scanComment()) {
                if (!this.scanCData()) {
                    this.fireError("neither comment nor CDATA after &lt;!", FATAL);
                }
            }
        } else if (this.ch === "?") {
            this.nextChar();
            //in case it is not a valid processing instruction
            //scanPI will throw the exception itself, with a better message
            this.scanPI();
        } else if (this.ch === "/") {
            this.nextChar();
            if (this.scanEndingTag()) {
                if (this.elementsStack.length === 0) {
                    this.state = STATE_TRAILING_MISC;
                }
            }
        } else {
            if (!this.scanMarkup()) {
                this.fireError("not a valid markup", FATAL);
            }
        }
    } else if (this.state === STATE_TRAILING_MISC) {
        if (this.ch === "!") {
            this.nextChar(true);
            if (!this.scanComment()) {
                this.fireError("end of document, only comments or processing instructions are allowed", FATAL);
            }
        } else if (this.ch === "?") {
            this.nextChar();
            if (!this.scanPI()) {
                this.fireError("end of document, only comment or processing instruction are allowed", FATAL);
            }
        }
    }
};


// 14]   	CharData ::= [^<&]* - ([^<&]* ']]>' [^<&]*)
//  what I understand from there : http://www.w3.org/TR/REC-xml/#dt-chardata is that & is allowed
// in character data only if it is an entity reference
SAXParser.prototype.scanText = function() {
    var start = this.index;
    var content = this.nextRegExp(/[<&]/);
    
    //if found a "&"
    while (this.ch === "&") {
        this.nextChar(true);
        var ref = this.scanRef();
        content += ref;
        content += this.nextRegExp(/[<&]/);
    }
    var length = this.index - start;
    this.contentHandler.characters(content, 0, length);
};


//current char is after '&'
SAXParser.prototype.scanRef = function() {
    var ref;
    if (this.ch === "#") {
        this.nextChar(true);
        ref = this.scanCharRef();
    } else {
        ref = this.scanEntityRef();
    }
    //current char is ";"
    this.nextChar(true);
    return ref;
};


// [15] Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
SAXParser.prototype.scanComment = function() {
    if (this.ch === "-") {
        this.nextChar(true);
        if (this.ch === "-") {
            //do not skip white space at beginning of comment
            this.nextChar(true);
            var start = this.index;
            var comment = this.nextRegExp(/--/);
            var length = this.index - start;
            //goes to second '-'
            this.nextChar(true);
            this.nextChar(true);
            //must be '>'
            if (this.ch === ">") {
                if (this.lexicalHandler) {
                    this.lexicalHandler.comment(comment, start, length);// Brett (test for support and change start/length?)
                }
                this.nextChar(true);
                return true;
            } else {
                this.fireError("end of comment not valid, must be --&gt;", FATAL);
                return false;
            }
        } else {
            this.fireError("beginning comment markup is invalid, must be &lt;!--", FATAL);
            return false;
        }
    } else {
        // can be a doctype
        return false;
    }
};


// [23] XMLDecl ::= '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
// [24] VersionInfo ::= S 'version' Eq (' VersionNum ' | " VersionNum ")
// [80] EncodingDecl ::= S 'encoding' Eq ('"' EncName '"' |  "'" EncName "'" )
// [81] EncName ::= [A-Za-z] ([A-Za-z0-9._] | '-')*
// [32] SDDecl ::= S 'standalone' Eq (("'" ('yes' | 'no') "'")
//                 | ('"' ('yes' | 'no') '"'))
//
// [77] TextDecl ::= '<?xml' VersionInfo? EncodingDecl S? '?>'
SAXParser.prototype.scanXMLDeclOrTextDecl = function() {
    if (this.xml.substr(this.index, 5) === "?xml ") {
        // Fix: Check for standalone/version and and report as features; version and encoding can be given to Locator2
        this.nextGT();
        return true;
    } else {
        return false;
    }
};


// [16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
// [17] PITarget ::= Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))
SAXParser.prototype.scanPI = function() {
    this.contentHandler.processingInstruction(this.nextName(), this.nextEndPI());
    return true;
};


//[28]   	doctypedecl	   ::=   	'<!DOCTYPE' S  Name (S  ExternalID)? S? ('[' intSubset ']' S?)? '>'
//[28a]   	DeclSep	   ::=   	 PEReference | S
//[28b]   	intSubset	   ::=   	(markupdecl | DeclSep)*
//[29]   	markupdecl	   ::=   	elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment 
//[75]   	ExternalID	   ::=   	'SYSTEM' S  SystemLiteral
//			| 'PUBLIC' S PubidLiteral S SystemLiteral 
SAXParser.prototype.scanDoctypeDecl = function() {
    if (this.isFollowedBy("DOCTYPE")) {
        this.nextChar();
        var name = this.nextRegExp(/[ \[>]/);
        var systemLiteral;
        if (WS.test(this.ch)) {
            this.nextChar();
            //if there is an externalId
            if (this.isFollowedBy("SYSTEM")) {
                this.nextChar();
                systemLiteral = this.quoteContent();
            } else if (this.isFollowedBy("PUBLIC")) {
                this.nextChar();
                var pubidLiteral = this.quoteContent();
                this.nextChar();
                systemLiteral = this.quoteContent();
            }
            if (WS.test(this.ch)) {
                this.nextChar();
            }
        }
        if (this.lexicalHandler) {
            this.lexicalHandler.startDTD(name, pubidLiteral, systemLiteral);
        }
        if (this.ch === "[") {
            this.nextChar();
            this.scanDoctypeDeclIntSubset();
            this.nextChar();
        }
        if (this.ch !== ">") {
            this.fireError("invalid content in doctype declaration", FATAL);
            return false;
        }
        if (this.lexicalHandler) {
            this.lexicalHandler.endDTD();
        }
        return true;
    } else {
        this.fireError("invalid doctype declaration, must be &lt;!DOCTYPE", FATAL);
        return false;
    }
};

/*
actual char is non whitespace char after '['
[28a]   	DeclSep	   ::=   	 PEReference | S
[28b]   	intSubset	   ::=   	(markupdecl | DeclSep)*
[29]   	markupdecl	   ::=   	 elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment  
[70]   	EntityDecl	   ::=   	 GEDecl  | PEDecl  
[71]   	          GEDecl	   ::=   	'<!ENTITY' S  Name  S  EntityDef  S? '>'
[72]   	PEDecl	   ::=   	'<!ENTITY' S '%' S Name S PEDef S? '>'
[73]   	EntityDef	   ::=   	 EntityValue  | (ExternalID  NDataDecl?)
[74]   	PEDef	   ::=   	EntityValue | ExternalID 
[9]   	EntityValue	   ::=   	'"' ([^%&"] | PEReference | Reference)* '"'
			|  "'" ([^%&'] | PEReference | Reference)* "'"
[69]   	PEReference	   ::=   	'%' Name ';'
[67]   	Reference	   ::=   	 EntityRef | CharRef
[68]   	EntityRef	   ::=   	'&' Name ';'
[9]   	EntityValue	   ::=   	'"' ([^%&"] | PEReference | Reference)* '"'
			|  "'" ([^%&'] | PEReference | Reference)* "'"
*/
SAXParser.prototype.scanDoctypeDeclIntSubset = function() {
    if (this.ch === "<") {
        this.nextChar(true);
        if (this.ch === "?") {
            this.nextChar();
            if (!this.scanPI()) {
                this.fireError("invalid processing instruction inside doctype declaration", FATAL);
            }
        } else if (this.ch === "!") {
            this.nextChar(true);
            if (!this.scanComment()) {
                if (this.isFollowedBy("ENTITY")) {
                    this.nextChar();
                    if (this.ch === "%") {
                        //no support for PEDecl
                        this.nextGT();
                    } else {
                        var entityName = this.nextName();
                        this.nextChar();
                        if (this.ch === '"' || this.ch === "'") {
                            var entityValue = this.quoteContent();
                            this.entities[entityName] = entityValue;
                            if (this.declarationHandler) {
                                this.declarationHandler.internalEntityDecl(entityName, entityValue);
                            }
                        } else {
                            //no support for (ExternalID  NDataDecl?)
                            this.nextGT();
                        }
                    }
                } else {
                    //no present support for other declarations
                    this.nextGT();
                }
                if (WS.test(this.ch)) {
                    this.nextChar();
                }
                if (this.ch !== ">") {
                    this.fireError("invalid [29]markupdecl inside doctype declaration, must end with &gt;", FATAL);
                }
                this.nextChar();
            }
        }
    //PEReference
    } else if (this.ch === "%") {
        var name = this.nextRegExp(";");
    }
    if (this.ch !== "]") {
        this.scanDoctypeDeclIntSubset();
    }
};

/*
 [39] element ::= EmptyElemTag | STag content ETag
[44] EmptyElemTag ::= '<' Name (S Attribute)* S? '/>'
[40] STag ::= '<' Name (S Attribute)* S? '>'
[41] Attribute ::= Name Eq AttValue
[10] AttValue ::= '"' ([^<&"] | Reference)* '"' | "'" ([^<&'] | Reference)* "'"
[67] Reference ::= EntityRef | CharRef
[68] EntityRef ::= '&' Name ';'
[66] CharRef ::= '&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';'
[43] content ::= (element | CharData | Reference | CDSect | PI | Comment)*
[42] ETag ::= '</' Name S? '>'
[4]  NameChar ::= Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender
[5]  Name ::= Letter | '_' | ':') (NameChar)*
*/
SAXParser.prototype.scanMarkup = function() {
    var qName = this.getQName("");
    this.elementsStack.push(qName.qName);
    this.scanElement(qName);
    return true;
};

/*
if called from an element parsing defaultPrefix would be ""
if called from an attribute parsing defaultPrefix would be null
*/
SAXParser.prototype.getQName = function(defaultPrefix) {
    var name = this.nextName();
    var localName = name;
    if (name.indexOf(":") !== -1) {
        var splitResult = name.split(":");
        defaultPrefix = splitResult[0];
        localName = splitResult[1];
    }
    return new Sax_QName(defaultPrefix, localName);
};

SAXParser.prototype.scanElement = function(qName) {
    var atts = this.scanAttributes();
    var namespaceURI = this.getNamespaceURI(qName.prefix);
    this.contentHandler.startElement(namespaceURI, qName.localName, qName.qName, atts);
    this.skipWhiteSpaces();
    if (this.ch === "/") {
        this.nextChar(true);
        if (this.ch === ">") {
            this.elementsStack.pop();
            this.endMarkup(namespaceURI, qName);
        } else {
            this.fireError("invalid empty markup, must finish with /&gt;", FATAL);
        }
    }
};

SAXParser.prototype.getNamespaceURI = function(prefix) {
    // if attribute, prefix may be null, then namespaceURI is null
    if (prefix === null) {
        return "";
    }
    var i = this.namespaces.length;
    while (i--) {
        var namespaceURI = this.namespaces[i][prefix];
        if (namespaceURI) {
            return namespaceURI;
        }
    }
    //in case default namespace is not declared, prefix is "", namespaceURI is null
    if (!prefix) {
        return "";
    }
    this.fireError("prefix " + prefix + " not known in namespaces map", FATAL);
    return false;
};

SAXParser.prototype.scanAttributes = function() {
    var atts = new AttributesImpl();
    //namespaces declared at this step will be stored at one level of global this.namespaces
    var namespacesDeclared = {};
    this.scanAttribute(atts, namespacesDeclared);
    this.namespaces.push(namespacesDeclared);
    //as namespaces are defined only after parsing all the attributes, adds the namespaceURI here
    //loop optimization
    var i = atts.getLength();
    while (i--) {
        var prefix = atts.getPrefix(i);
        var namespaceURI = this.getNamespaceURI(prefix);
        atts.setURI(i, namespaceURI);
    }
    return atts;
};

SAXParser.prototype.scanAttribute = function(atts, namespacesDeclared) {
    this.skipWhiteSpaces();
    if (this.ch !== ">" && this.ch !== "/") {
        var attQName = this.getQName(null);
        this.skipWhiteSpaces();
        if (this.ch === "=") {
            this.nextChar();
            // xmlns:bch="http://benchmark"
            if (attQName.prefix === "xmlns") {
                namespacesDeclared[attQName.localName] = this.scanAttValue();
                this.contentHandler.startPrefixMapping(attQName.localName, namespacesDeclared[attQName.localName]);
            } else if (attQName.qName === "xmlns") {
                namespacesDeclared[""] = this.scanAttValue();
                this.contentHandler.startPrefixMapping("", namespacesDeclared[""]);
            } else {
                var value = this.scanAttValue();
                //we do not know yet the namespace URI
                atts.addAttribute(undefined, attQName.prefix, attQName.localName, attQName.qName, undefined, value);
            }
            this.scanAttribute(atts, namespacesDeclared);
        } else {
            this.fireError("invalid attribute, must contain = between name and value", FATAL);
        }
    }
};

// [10] AttValue ::= '"' ([^<&"] | Reference)* '"' | "'" ([^<&'] | Reference)* "'"
SAXParser.prototype.scanAttValue = function() {
    if (this.ch === '"' || this.ch === "'") {
        var quote = this.ch;
        try {
            this.nextChar(true);
            var attValue = this.nextRegExp("[" + quote + "<&]");
            //if found a "&"
            while (this.ch === "&") {
                this.nextChar(true);
                var ref = this.scanRef();
                attValue += ref;
                attValue += this.nextRegExp("[" + quote + "<&]");
            }
            if (this.ch === "<") {
                this.fireError("invalid attribute value, must not contain &lt;", FATAL);
            }
            //current char is ending quote
            this.nextChar();
        //adding a message in that case
        } catch(e) {
            if (e instanceof EndOfInputException) {
                this.fireError("document incomplete, attribute value declaration must end with a quote", FATAL);
            } else {
                throw e;
            }
        }
        return attValue;
    } else {
        this.fireError("invalid attribute value declaration, must begin with a quote", FATAL);
        return false;
    }
};

// [18]   	CDSect	   ::=   	 CDStart  CData  CDEnd
// [19]   	CDStart	   ::=   	'<![CDATA['
// [20]   	CData	   ::=   	(Char* - (Char* ']]>' Char*))
// [21]   	CDEnd	   ::=   	']]>'
SAXParser.prototype.scanCData = function() {
    if (this.isFollowedBy("[CDATA[")) {
        if (this.lexicalHandler) {
            this.lexicalHandler.startCDATA();
        }
        // Reports the same as for text
        var start = this.index;
        var cdata = this.nextRegExp(/\]\]>/);
        var length = this.index - start;
        this.contentHandler.characters(cdata, start, length);
        //goes after final '>'
        this.index += 3;
        this.ch = this.xml.charAt(this.index);
        if (this.lexicalHandler) {
            this.lexicalHandler.endCDATA();
        }
        return true;
    } else {
        return false;
    }
};

// [66] CharRef ::= '&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';'
// current ch is char after "&#",  returned current char is ";"
SAXParser.prototype.scanCharRef = function() {
    var oldIndex = this.index;
    if (this.ch === "x") {
        this.nextChar(true);
        while (this.ch !== ";") {
            if (!/[0-9a-fA-F]/.test(this.ch)) {
                this.fireError("invalid char reference beginning with x, must contain alphanumeric characters only", ERROR);
            }
            this.nextChar(true);
        }
    } else {
        while (this.ch !== ";") {
            if (!/\d/.test(this.ch)) {
                this.fireError("invalid char reference, must contain numeric characters only", ERROR);
            }
            this.nextChar(true);
        }
    }
    return this.xml.substring(oldIndex, this.index);
};

//[68]  EntityRef ::= '&' Name ';'
SAXParser.prototype.scanEntityRef = function() {
    try {
        var ref = this.nextRegExp(/;/);
        if (this.lexicalHandler) {
            this.lexicalHandler.startEntity(ref);
            this.lexicalHandler.endEntity(ref);
        }
        //tries to replace it by its value if declared internally in doctype declaration
        if (this.entities[ref]) {
            ref = this.entities[ref];
        }
        return ref;
    //adding a message in that case
    } catch(e) {
        if (e instanceof EndOfInputException) {
            this.fireError("document incomplete, entity reference must end with ;", FATAL);
            return false;
        } else {
            throw e;
        }
    }
};

// [42] ETag ::= '</' Name S? '>'
SAXParser.prototype.scanEndingTag = function() {
    var qName = this.getQName("");
    var namespaceURI = this.getNamespaceURI(qName.prefix);
    if (qName.qName === this.elementsStack.pop()) {
        this.skipWhiteSpaces();
        if (this.ch === ">") {
            this.endMarkup(namespaceURI, qName);
            this.nextChar(true);
            return true;
        } else {
            this.fireError("invalid ending markup, does not finish with &gt;", FATAL);
            return false;
        }
    } else {
        this.fireError("invalid ending markup, markup name does not match current one", FATAL);
        return false;
    }
};


SAXParser.prototype.endMarkup = function(namespaceURI, qName) {
    this.contentHandler.endElement(namespaceURI, qName.localName, qName.qName);
    var namespacesRemoved = this.namespaces.pop();
    for (var i in namespacesRemoved) {
        this.contentHandler.endPrefixMapping(i);
    }
};


/*
if dontSkipWhiteSpace is not passed, then it is false so skipWhiteSpaces is default
if end of document, char is  ''
*/
SAXParser.prototype.nextChar = function(dontSkipWhiteSpace) {
    this.index++;
    this.ch = this.xml.charAt(this.index);
    if (!dontSkipWhiteSpace) {
        this.skipWhiteSpaces();
    }
    if (this.index >= this.length) {
        throw new EndOfInputException();
    }
};

SAXParser.prototype.skipWhiteSpaces = function() {
    while (/[\t\n\r ]/.test(this.ch)) {
        this.index++;
        if (this.index >= this.length) {
            throw new EndOfInputException();
        }
        this.ch = this.xml.charAt(this.index);
    }
};


/*
goes to next reg exp and return content, from current char to the char before reg exp
*/
SAXParser.prototype.nextRegExp = function(regExp) {
    var oldIndex = this.index;
    var inc = this.xml.substr(this.index).search(regExp);
    if (inc === -1) {
        throw new EndOfInputException();
    } else {
        this.index += inc;
        this.ch = this.xml.charAt(this.index);
        return this.xml.substring(oldIndex, this.index);
    }
};

/*

*/
SAXParser.prototype.isFollowedBy = function(str) {
    var length = str.length;
    if (this.xml.substr(this.index, length) === str) {
        this.index += length;
        this.ch = this.xml.charAt(this.index);
        return true;
    }
    return false;
};

/*
[4]   	NameChar	   ::=   	 Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender
[5]   	Name	   ::=   	(Letter | '_' | ':') (NameChar)*
*/
SAXParser.prototype.nextName = function() {
    return this.nextRegExp(NOT_START_OR_END_CHAR);
};


SAXParser.prototype.nextGT = function() {
    var content = this.nextRegExp(/>/);
    this.index++;
    this.ch = this.xml.charAt(this.index);
    return content;
};

SAXParser.prototype.nextEndPI = function() {
    var content = this.nextRegExp(/\?>/);
    this.index += 2;
    this.ch = this.xml.charAt(this.index);
    return content;
};

/*
goes after ' or " and return content
current char is opening ' or "
*/
SAXParser.prototype.quoteContent = function() {
    this.index++;
    var content = this.nextRegExp(this.ch);
    this.index++;
    this.ch = this.xml.charAt(this.index);
    return content;
};

SAXParser.prototype.fireError = function(message, gravity) {
    var saxParseException = new SAXParseException(message);
    saxParseException.ch = this.ch;
    saxParseException.index = this.index;
    if (gravity === WARNING) {
        this.errorHandler.warning(saxParseException);
    } else if (gravity === ERROR) {
        this.errorHandler.error(saxParseException);
    } else if (gravity === FATAL) {
        throw(saxParseException);
    }
};


/*
static XMLReader 	createXMLReader()
          Attempt to create an XMLReader from system defaults.
static XMLReader 	createXMLReader(java.lang.String className)
          Attempt to create an XML reader from a class name.
*/
function XMLReaderFactory () {
    throw 'XMLReaderFactory is not meant to be instantiated';
}
XMLReaderFactory.createXMLReader = function (className) {
    if (className) {
        return new that[className]();
    }
    return new SAXParser(); // our system default XMLReader (parse() not implemented, however)
};

/*
 XMLReader 	getParent()
          Get the parent reader.
 void 	setParent(XMLReader parent)
          Set the parent reader.
*/
// http://www.saxproject.org/apidoc/org/xml/sax/helpers/XMLFilterImpl.html
// Allows subclasses to override methods to filter input before reaching the parent's methods
function XMLFilterImpl () {}
// INTERFACE: XMLFilter: http://www.saxproject.org/apidoc/org/xml/sax/XMLFilter.html
XMLFilterImpl.prototype.setParent = function (parent) { // e.g., SAXParser
    this.parent = parent;
};
XMLFilterImpl.prototype.getParent = function () {
    return this.parent;
};
// INTERFACE: XMLReader: http://www.saxproject.org/apidoc/org/xml/sax/XMLReader.html
XMLFilterImpl.prototype.getContentHandler = function () {
    return this.parent.getContentHandler();
};
XMLFilterImpl.prototype.getDTDHandler = function () {
    return this.parent.getDTDHandler();
};
XMLFilterImpl.prototype.getEntityResolver = function () {
    return this.parent.getEntityResolver();
};
XMLFilterImpl.prototype.getErrorHandler = function () {
    return this.parent.getErrorHandler();
};
XMLFilterImpl.prototype.getFeature = function (name) { // (java.lang.String)
    return this.parent.getFeature(name);
};
XMLFilterImpl.prototype.getProperty = function (name) { // (java.lang.String)
    return this.parent.getProperty(name);
};
XMLFilterImpl.prototype.parse = function (inputOrSystemId) { // (InputSource input OR java.lang.String systemId)
    return this.parent.parse();
};
XMLFilterImpl.prototype.setContentHandler = function (handler) { // (ContentHandler)
    return this.parent.setContentHandler(handler);
};
XMLFilterImpl.prototype.setDTDHandler = function (handler) { // (DTDHandler)
    return this.parent.setDTDHandler(handler);
};
XMLFilterImpl.prototype.setEntityResolver = function (resolver) { // (EntityResolver)
    return this.parent.setEntityResolver(resolver);
};
XMLFilterImpl.prototype.setErrorHandler = function (handler) { // (ErrorHandler)
    return this.parent.setErrorHandler(handler);
};
XMLFilterImpl.prototype.setFeature = function (name, value) { // (java.lang.String, boolean)
    return this.parent.setFeature(name, value);
};
XMLFilterImpl.prototype.setProperty = function (name, value) { // (java.lang.String, java.lang.Object)
    return this.parent.setProperty(name, value);
};
// END SAX2 XMLReader INTERFACE
// BEGIN CUSTOM API (could make all but parseString() private)

// The following is not really a part of XMLFilterImpl but we are effectively depending on it
XMLFilterImpl.prototype.parseString = function(xml) {
    return this.parent.parseString(xml);
};




// Add public API to global namespace (or other one, if we are in another)
this.SAXParser = SAXParser; // To avoid introducing any of our own to the namespace, this could be commented out, and require use of XMLReaderFactory.createXMLReader(); to get a parser

// Could put on org.xml.sax.
this.SAXException = SAXException;
this.SAXNotSupportedException = SAXNotSupportedException;
this.SAXNotRecognizedException = SAXNotRecognizedException;
this.SAXParseException = SAXParseException;

// Could put on org.xml.sax.helpers.
this.XMLReaderFactory = XMLReaderFactory;
this.XMLFilterImpl = XMLFilterImpl;

// Fix: could also add:
/*
// Could put on org.xml.sax.helpers.
this.NamespaceSupport = NamespaceSupport;
this.AttributesImpl = AttributesImpl;

// Could put on org.xml.sax.ext.
this.Attributes2Impl = Attributes2Impl;
*/

}.call(exports)); // end namespace

})()
},{"./AttributesImpl":11}],"o4MIuH":[function(require,module,exports){
var SAXParseable = require('./SAXParseable').SAXParseable;
var SchemaBuilder = require('./SchemaBuilderImpl').SchemaBuilderImpl;
var SchemaPatternBuilder = require('./SchemaPatternBuilder').SchemaPatternBuilder;
var RngValidator = require('./RngValidator').RngValidator;
var ValidatorPatternBuilder = require('./ValidatorPatternBuilder').ValidatorPatternBuilder;
var DataAttributeDroppingValidatorWrapper = require('./validator/DataAttributeDroppingValidatorWrapper').DataAttributeDroppingValidatorWrapper;


var Html5DatatypeLibraryFactory = require('./html5/datatype/Html5DatatypeLibraryFactory').Html5DatatypeLibraryFactory;
var XsdDatatypeLibraryFactory = require('./datatype/xsd/DatatypeLibraryFactoryImpl').DatatypeLibraryFactoryImpl;

var eh = {
    error: function(e){
        console.error(e);
    }
};

//var fs = require('fs');
//var schema = fs.readFileSync('schema.rng', 'utf-8');

var schema = '<?xml version="1.0" encoding="UTF-8"?><grammar ns="http://www.w3.org/1999/xhtml" xmlns:a="http://relaxng.org/ns/compatibility/annotations/1.0" xmlns="http://relaxng.org/ns/structure/1.0"><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><a:documentation> RELAX NG Schema for HTML 5                                       #</a:documentation><a:documentation>HTML flavor RELAX NG schemas can only be used after the         # document has been transformed to well-formed XML.               # - Insert closing slashes in all empty element tags            # - Insert all optional start and end tags                      # - Add xmlns "http://www.w3.org/1999/xhtml"                    # - Properly escape &lt;script&gt; and &lt;style&gt; CDATA                  # - Parse and transform all HTML-only entities to numeric       # character references                                        # Obviously, syntax-checking involving these features cannot be   # done by the RELAX NG schema and must be checked, along with the # &lt;!DOCTYPE&gt; requirement, by some other application.              #</a:documentation><a:documentation>Schema Framework &amp; Parameters</a:documentation><define name="XMLonly"><notAllowed/></define><define name="HTMLonly"><empty/></define><define name="v5only"><empty/></define><define name="nonHTMLizable"><notAllowed/></define><define name="nonRoundtrippable"><notAllowed/></define><define name="nonW3C"><a:documentation>features that are not part of the W3C HTML spec</a:documentation><empty/></define><define name="common.attr.anything"><a:documentation> Wildcards                                                         #</a:documentation><!-- ##################################################################### --><a:documentation>Any attribute from any namespace</a:documentation><zeroOrMore><attribute><anyName/></attribute></zeroOrMore></define><define name="common.elem.anything"><a:documentation>Any element from any namespace</a:documentation><element><anyName/><interleave><ref name="common.inner.anything"/><ref name="common.attr.anything"/></interleave></element></define><define name="common.inner.anything"><a:documentation>Any content from any namespace</a:documentation><interleave><text/><zeroOrMore><ref name="common.elem.anything"/></zeroOrMore></interleave></define><define name="common.elem.metadata"><a:documentation> Common Element Classes                                            #</a:documentation><!-- ##################################################################### --><a:documentation>Metadata Elements</a:documentation><notAllowed/></define><define name="common.elem.phrasing"><a:documentation>Phrase Elements</a:documentation><notAllowed/></define><define name="common.elem.flow"><a:documentation>Prose Elements</a:documentation><ref name="common.elem.phrasing"/></define><define name="common.inner.metadata"><a:documentation> Common Content Models                                             #</a:documentation><!-- ##################################################################### --><a:documentation>Metadata Content</a:documentation><zeroOrMore><ref name="common.elem.metadata"/></zeroOrMore></define><define name="common.inner.phrasing"><a:documentation>Phrase Content</a:documentation><interleave><text/><zeroOrMore><ref name="common.elem.phrasing"/></zeroOrMore></interleave></define><define name="common.inner.flow"><a:documentation>Prose Content</a:documentation><interleave><text/><zeroOrMore><ref name="common.elem.flow"/></zeroOrMore></interleave></define><define name="common.attrs"><a:documentation> Common Attributes                                                 #</a:documentation><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/></interleave></define><define name="common.attrs.basic"><interleave><optional><choice><ref name="common.attrs.id"/><ref name="common.attrs.xml-id"/></choice></optional><optional><!-- REVISIT assuming only either one is allowed --><ref name="common.attrs.class"/></optional><optional><ref name="common.attrs.title"/></optional><optional><ref name="common.attrs.base"/></optional><optional><ref name="common.attrs.space"/></optional></interleave></define><define name="common.attrs.id"><attribute name="id"><ref name="common.data.id"/></attribute></define><define name="common.attrs.xml-id"><interleave><attribute name="xml:id"><data type="NCName"/></attribute><ref name="XMLonly"/></interleave></define><define name="common.attrs.class"><attribute name="class"><ref name="common.data.tokens"/></attribute></define><define name="common.attrs.title"><attribute name="title"/></define><define name="common.attrs.base"><interleave><ref name="common.attrs.xmlbase"/><ref name="nonRoundtrippable"/></interleave></define><define name="common.attrs.xmlbase"><interleave><attribute name="xml:base"><ref name="common.data.uri"/></attribute><ref name="XMLonly"/></interleave></define><define name="common.attrs.space"><ref name="common.attrs.xmlspace"/></define><define name="common.attrs.xmlspace"><interleave><attribute name="xml:space"><choice><value type="string" datatypeLibrary="">preserve</value><value type="string" datatypeLibrary="">default</value></choice></attribute><ref name="XMLonly"/></interleave></define><define name="common.attrs.i18n"><interleave><optional><ref name="common.attrs.dir"/></optional><optional><ref name="common.attrs.language"/></optional><optional><ref name="common.attrs.translate"/></optional></interleave></define><define name="common.attrs.dir"><attribute name="dir"><choice><value type="string" datatypeLibrary="http://whattf.org/datatype-draft">ltr</value><value type="string" datatypeLibrary="http://whattf.org/datatype-draft">rtl</value><value type="string" datatypeLibrary="http://whattf.org/datatype-draft">auto</value></choice></attribute></define><define name="common.attrs.language"><interleave><optional><ref name="common.attrs.xmllang"/></optional><optional><ref name="common.attrs.lang"/></optional></interleave></define><define name="common.attrs.lang"><interleave><attribute name="lang"><ref name="common.data.langcode"/></attribute><ref name="XMLonly"/></interleave></define><define name="common.attrs.xmllang"><attribute name="xml:lang"><ref name="common.data.langcode"/></attribute></define><define name="common.attrs.translate"><attribute name="translate"><choice><value type="string" datatypeLibrary="http://whattf.org/datatype-draft">yes</value><value type="string" datatypeLibrary="http://whattf.org/datatype-draft">no</value></choice></attribute></define><define name="common.attrs.present"><interleave><optional><ref name="common.attrs.style"/></optional><optional><ref name="common.attrs.tabindex"/></optional><optional><ref name="common.attrs.accesskey"/></optional></interleave></define><define name="common.attrs.style"><attribute name="style"><data type="string" datatypeLibrary=""/></attribute></define><define name="common.attrs.tabindex"><attribute name="tabindex"><ref name="common.data.integer"/></attribute></define><define name="common.attrs.accesskey"><attribute name="accesskey"><ref name="common.data.keylabellist"/></attribute></define><define name="common.attrs.other"><empty/></define><define name="common.data.tokens"><a:documentation> Common Datatypes                                                  #</a:documentation><!-- ##################################################################### --><a:documentation>Names and Tokens</a:documentation><list><zeroOrMore><data type="token" datatypeLibrary=""/></zeroOrMore></list></define><define name="common.data.browsing-context"><data type="browsing-context" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.browsing-context-or-keyword"><data type="browsing-context-or-keyword" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.id"><a:documentation>IDs and IDREFs</a:documentation><data type="ID" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.idref"><data type="IDREF" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.idrefs"><data type="IDREFS" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.name"><data type="ID" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.hash-name"><data type="hash-name" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.integer"><a:documentation>Numerical</a:documentation><data type="integer" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.integer.positive"><data type="integer-positive" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.integer.non-negative"><data type="integer-non-negative" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.float"><data type="float" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.float.positive"><data type="float-positive" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.float.non-negative"><data type="float-non-negative" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.datetime"><a:documentation>Temporal</a:documentation><data type="datetime-tz" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.date-or-time"><data type="date-or-time" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.date"><data type="date" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.time-datetime"><data type="time-datetime" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.uri"><a:documentation>IRIs</a:documentation><!-- allow either a non-empty IRI ref or zero or more HTML space characters (which are: space, tab, LF, FF, CR) --><choice><data type="iri-ref" datatypeLibrary="http://whattf.org/datatype-draft"/><data type="string"><param name="pattern">[ -&#xD;]*</param></data></choice><!-- NOTE The range above incorrectly allows U+000B in addition to the HTML space characters; but that\'s not a problem in practice because HTML and XML parsers will both catch any U+000B and report an error for it before that pattern ever gets evaluated. --></define><define name="common.data.uri.non-empty"><data type="iri-ref" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.uris"><list><zeroOrMore><data type="iri-ref" datatypeLibrary="http://whattf.org/datatype-draft"/></zeroOrMore></list></define><define name="common.data.uri.absolute"><data type="iri" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.sizes"><a:documentation>&lt;link type=\'icon\'&gt; sizes</a:documentation><!-- 		list { w:sizes } --><list><oneOrMore><data type="string"><param name="pattern">[1-9][0-9]*x[1-9][0-9]*</param></data></oneOrMore></list></define><define name="common.data.mimetype"><a:documentation>MIME types</a:documentation><data type="mime-type" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.charset"><a:documentation>Encodings</a:documentation><data type="charset" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.meta-charset"><data type="meta-charset" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.refresh"><a:documentation>Refresh</a:documentation><data type="refresh" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.default-style"><a:documentation>Default style</a:documentation><data type="string" datatypeLibrary=""/></define><define name="common.data.mediaquery"><a:documentation>Media Queries</a:documentation><data type="media-query" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.langcode"><a:documentation>Language Codes</a:documentation><choice><value type="string" datatypeLibrary="http://whattf.org/datatype-draft"/><data type="language" datatypeLibrary="http://whattf.org/datatype-draft"/></choice></define><define name="common.data.keylabellist"><a:documentation>List of Key Labels</a:documentation><data type="keylabellist" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.microdata-properties"><a:documentation>Microdata Properties</a:documentation><list><oneOrMore><data type="microdata-property" datatypeLibrary="http://whattf.org/datatype-draft"/></oneOrMore></list></define><define name="common.data.zero"><a:documentation>Zero</a:documentation><data type="zero" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common.data.functionbody"><a:documentation>ECMAScript FunctionBody</a:documentation><data type="functionbody" datatypeLibrary="http://whattf.org/datatype-draft"/></define><define name="common-form.attrs.form"><a:documentation> WF2 Module Hook                                                   #</a:documentation><notAllowed/></define><define name="common.attrs.aria"><a:documentation> ARIA Module Hooks                                                 #</a:documentation><notAllowed/></define><define name="common.attrs.aria.implicit.button"><notAllowed/></define><define name="common.attrs.aria.implicit.input"><notAllowed/></define><define name="common.attrs.aria.implicit.region"><notAllowed/></define><define name="common.attrs.aria.implicit.group"><notAllowed/></define><define name="common.attrs.aria.implicit.th"><notAllowed/></define><define name="common.attrs.aria.implicit.structure"><notAllowed/></define><define name="common.attrs.aria.implicit.link"><notAllowed/></define><define name="common.attrs.aria.implicit.listitem"><notAllowed/></define><define name="common.attrs.aria.implicit.img"><notAllowed/></define><define name="common.attrs.aria.implicit.select"><notAllowed/></define><define name="common.attrs.aria.landmark.application"><notAllowed/></define><define name="common.attrs.aria.landmark.banner"><notAllowed/></define><define name="common.attrs.aria.landmark.complementary"><notAllowed/></define><define name="common.attrs.aria.landmark.contentinfo"><notAllowed/></define><define name="common.attrs.aria.landmark.main"><notAllowed/></define><define name="common.attrs.aria.landmark.navigation"><notAllowed/></define><define name="common.attrs.aria.landmark.search"><notAllowed/></define><define name="common.attrs.aria.landmark.article"><notAllowed/></define><define name="common.attrs.aria.landmark.document"><notAllowed/></define><define name="common.attrs.aria.landmark.note"><notAllowed/></define></rng:div><start><a:documentation>Language Definitions</a:documentation><ref name="html.elem"/></start><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="html.elem"><a:documentation> RELAX NG Schema for HTML 5: Global Structure &amp; Metadata          #</a:documentation><!-- ##################################################################### --><a:documentation>Root Element: &lt;html&gt;</a:documentation><element name="html"><interleave><ref name="html.inner"/><ref name="html.attrs"/></interleave></element></define><define name="html.attrs"><ref name="common.attrs"/></define><define name="html.inner"><ref name="head.elem"/><ref name="body.elem"/></define><define name="head.elem"><a:documentation>Metadata Container: &lt;head&gt;</a:documentation><element name="head"><interleave><ref name="head.inner"/><ref name="head.attrs"/></interleave></element></define><define name="head.attrs"><ref name="common.attrs"/><!-- 		&	head.attrs.profile? --></define><define name="head.inner"><interleave><ref name="title.elem"/><optional><ref name="base.elem"/></optional><!-- REVISIT need a non-schema checker or Schematron --><ref name="common.inner.metadata"/></interleave><!-- Limit encoding decl position in Schematron --></define><define name="body.elem"><a:documentation>Content Container: &lt;body&gt;</a:documentation><element name="body"><interleave><ref name="body.inner"/><ref name="body.attrs"/></interleave></element></define><define name="body.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.landmark.application"/><ref name="common.attrs.aria.landmark.document"/><ref name="common.attrs.aria.implicit.structure"/></choice></optional><optional><ref name="body.attrs.onafterprint"/></optional><optional><ref name="body.attrs.onbeforeprint"/></optional><optional><ref name="body.attrs.onbeforeunload"/></optional><optional><ref name="body.attrs.onhashchange"/></optional><optional><ref name="body.attrs.onmessage"/></optional><optional><ref name="body.attrs.onoffline"/></optional><optional><ref name="body.attrs.ononline"/></optional><optional><ref name="body.attrs.onpagehide"/></optional><optional><ref name="body.attrs.onpageshow"/></optional><optional><ref name="body.attrs.onpopstate"/></optional><optional><ref name="body.attrs.onresize"/></optional><optional><ref name="body.attrs.onstorage"/></optional><optional><ref name="body.attrs.onunload"/></optional></interleave></define><define name="body.inner"><ref name="common.inner.flow"/></define><define name="body.attrs.onafterprint"><attribute name="onafterprint"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onbeforeprint"><attribute name="onbeforeprint"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onbeforeunload"><attribute name="onbeforeunload"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onhashchange"><attribute name="onhashchange"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onmessage"><attribute name="onmessage"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onoffline"><attribute name="onoffline"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.ononline"><attribute name="ononline"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onpopstate"><attribute name="onpopstate"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onpagehide"><attribute name="onpagehide"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onpageshow"><attribute name="onpageshow"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onredo"><attribute name="onredo"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onresize"><attribute name="onresize"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onstorage"><attribute name="onstorage"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onundo"><attribute name="onundo"><ref name="common.data.functionbody"/></attribute></define><define name="body.attrs.onunload"><attribute name="onunload"><ref name="common.data.functionbody"/></attribute></define><define name="title.elem"><a:documentation>Document Title: &lt;title&gt;</a:documentation><element name="title"><interleave><ref name="title.inner"/><ref name="title.attrs"/></interleave></element></define><define name="title.attrs"><ref name="common.attrs"/></define><define name="title.inner"><text/></define><define name="base.elem"><a:documentation>Base URI: &lt;base&gt;</a:documentation><element name="base"><interleave><ref name="base.inner"/><ref name="base.attrs"/></interleave></element></define><define name="base.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><choice><interleave><ref name="base.attrs.href"/><optional><ref name="base.attrs.target"/></optional></interleave><ref name="base.attrs.target"/></choice></interleave></define><define name="base.attrs.href"><attribute name="href"><ref name="common.data.uri"/></attribute></define><define name="base.attrs.target"><attribute name="target"><ref name="common.data.browsing-context-or-keyword"/></attribute></define><define name="base.inner"><empty/></define><define name="link.elem"><a:documentation>Global Relationships: &lt;link&gt;</a:documentation><element name="link"><interleave><ref name="link.inner"/><ref name="link.attrs"/></interleave></element></define><define name="link.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="link.attrs.href"/><ref name="link.attrs.rel"/><optional><ref name="shared-hyperlink.attrs.hreflang"/></optional><optional><ref name="shared-hyperlink.attrs.media"/></optional><optional><ref name="shared-hyperlink.attrs.type"/></optional><optional><ref name="link.attrs.sizes"/></optional></interleave><!-- 	link.attrs.title included in common.attrs --></define><define name="link.attrs.href"><attribute name="href"><ref name="common.data.uri.non-empty"/></attribute></define><define name="link.attrs.rel"><attribute name="rel"><choice><data type="link-rel"/><ref name="common.data.uri.absolute"/></choice></attribute></define><define name="link.attrs.sizes"><attribute name="sizes"><choice><value type="string">any</value><ref name="common.data.sizes"/></choice></attribute></define><define name="link.inner"><empty/></define><define name="common.elem.metadata" combine="choice"><ref name="link.elem"/></define><define name="style.elem"><a:documentation>Global Style: &lt;style&gt;</a:documentation><element name="style"><interleave><ref name="style.inner"/><ref name="style.attrs"/></interleave></element></define><define name="style.attrs"><interleave><ref name="common.attrs"/><optional><ref name="style.attrs.type"/></optional><optional><ref name="style.attrs.media"/></optional></interleave><!-- 	style.attrs.title included in common.attrs --></define><define name="style.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/></attribute></define><define name="style.attrs.media"><attribute name="media"><ref name="common.data.mediaquery"/></attribute></define><define name="style.inner"><ref name="common.inner.anything"/></define><define name="common.elem.metadata" combine="choice"><ref name="style.elem"/></define><define name="style.elem.scoped"><a:documentation>Scoped Style: &lt;style scoped&gt;</a:documentation><element name="style"><interleave><ref name="style.inner"/><ref name="style.scoped.attrs"/></interleave></element></define><define name="style.scoped.attrs"><interleave><ref name="common.attrs"/><optional><ref name="style.attrs.type"/></optional><optional><ref name="style.attrs.media"/></optional><ref name="style.attrs.scoped"/></interleave><!-- 	style.attrs.title included in common.attrs --></define><define name="style.attrs.scoped"><attribute name="scoped"><choice><value type="string">scoped</value><value type="string"/></choice></attribute></define><define name="meta.name.elem"><a:documentation>Name-Value Metadata: &lt;meta name&gt;</a:documentation><element name="meta"><interleave><ref name="meta.inner"/><ref name="meta.name.attrs"/></interleave></element></define><define name="meta.name.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="meta.name.attrs.name"/><ref name="meta.name.attrs.content"/></interleave></define><define name="meta.name.attrs.name"><attribute name="name"><data type="meta-name"/></attribute></define><define name="meta.name.attrs.content"><attribute name="content"><data type="string" datatypeLibrary=""/></attribute></define><define name="meta.inner"><empty/></define><define name="common.elem.metadata" combine="choice"><ref name="meta.name.elem"/></define><define name="meta.http-equiv.refresh.elem"><a:documentation>"refresh" pragma directive: &lt;meta http-equiv=\'refresh\'&gt;</a:documentation><element name="meta"><interleave><ref name="meta.inner"/><ref name="meta.http-equiv.refresh.attrs"/></interleave></element></define><define name="meta.http-equiv.refresh.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="meta.http-equiv.attrs.http-equiv.refresh"/><ref name="meta.http-equiv.attrs.content.refresh"/></interleave></define><define name="meta.http-equiv.attrs.http-equiv.refresh"><attribute name="http-equiv"><value type="string">refresh</value></attribute></define><define name="meta.http-equiv.attrs.content.refresh"><attribute name="content"><ref name="common.data.refresh"/></attribute></define><define name="common.elem.metadata" combine="choice"><ref name="meta.http-equiv.refresh.elem"/></define><define name="meta.http-equiv.default-style.elem"><a:documentation>"default-style" pragma directive: &lt;meta http-equiv=\'default-style\'&gt;</a:documentation><element name="meta"><interleave><ref name="meta.inner"/><ref name="meta.http-equiv.default-style.attrs"/></interleave></element></define><define name="meta.http-equiv.default-style.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="meta.http-equiv.attrs.http-equiv.default-style"/><ref name="meta.http-equiv.attrs.content.default-style"/></interleave></define><define name="meta.http-equiv.attrs.http-equiv.default-style"><attribute name="http-equiv"><value type="string">default-style</value></attribute></define><define name="meta.http-equiv.attrs.content.default-style"><attribute name="content"><ref name="common.data.default-style"/></attribute></define><define name="common.elem.metadata" combine="choice"><ref name="meta.http-equiv.default-style.elem"/></define><define name="meta.charset.elem"><a:documentation>Inline Character Encoding Statement for HTML: &lt;meta charset&gt;</a:documentation><element name="meta"><interleave><ref name="meta.inner"/><ref name="meta.charset.attrs"/></interleave></element></define><define name="meta.charset.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="meta.charset.attrs.charset"/></interleave></define><define name="meta.charset.attrs.charset"><attribute name="charset"><choice><interleave><ref name="common.data.charset"/><ref name="HTMLonly"/></interleave><interleave><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">[uU][tT][fF]-8</param></data><ref name="XMLonly"/></interleave></choice></attribute></define><define name="meta.http-equiv.content-type.elem"><a:documentation>Inline Character Encoding Statement for HTML: &lt;meta http-equiv=\'content-type\'&gt;</a:documentation><interleave><element name="meta"><interleave><ref name="meta.inner"/><ref name="meta.http-equiv.content-type.attrs"/></interleave></element><ref name="HTMLonly"/></interleave></define><define name="meta.http-equiv.content-type.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><ref name="meta.http-equiv.attrs.http-equiv.content-type"/><ref name="meta.http-equiv.attrs.content.content-type"/></interleave></define><define name="meta.http-equiv.attrs.http-equiv.content-type"><attribute name="http-equiv"><value type="string">content-type</value></attribute></define><define name="meta.http-equiv.attrs.content.content-type"><attribute name="content"><ref name="common.data.meta-charset"/></attribute></define><define name="common.elem.metadata" combine="choice"><choice><ref name="meta.charset.elem"/><ref name="meta.http-equiv.content-type.elem"/></choice></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="a.elem.phrasing"><a:documentation> RELAX NG Schema for HTML 5: Phrase Markup                         #</a:documentation><!-- ##################################################################### --><a:documentation>Contextual Hyperlink: &lt;a&gt;</a:documentation><element name="a"><interleave><ref name="a.inner.phrasing"/><ref name="a.attrs"/></interleave></element></define><define name="a.elem.flow"><element name="a"><interleave><ref name="a.inner.flow"/><ref name="a.attrs"/></interleave></element></define><define name="a.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><optional><ref name="a.attrs.name"/></optional><optional><ref name="shared-hyperlink.attrs.href"/></optional><optional><ref name="shared-hyperlink.attrs.target"/></optional><optional><ref name="shared-hyperlink.attrs.rel"/></optional><optional><ref name="shared-hyperlink.attrs.hreflang"/></optional><optional><ref name="shared-hyperlink.attrs.media"/></optional><optional><ref name="shared-hyperlink.attrs.type"/></optional><optional><ref name="shared-hyperlink.attrs.ping"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.link"/></choice></optional></interleave></define><define name="a.attrs.name"><attribute name="name"><ref name="common.data.id"/><!-- XXX not what the spec says --></attribute></define><define name="a.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="a.inner.flow"><ref name="common.inner.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="a.elem.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="a.elem.flow"/></define><define name="shared-hyperlink.attrs.href"><a:documentation>Shared hyperlink attributes</a:documentation><attribute name="href"><ref name="common.data.uri"/></attribute></define><define name="shared-hyperlink.attrs.target"><attribute name="target"><ref name="common.data.browsing-context-or-keyword"/></attribute></define><define name="shared-hyperlink.attrs.rel"><attribute name="rel"><choice><data type="a-rel"/><ref name="common.data.uri.absolute"/></choice></attribute></define><define name="shared-hyperlink.attrs.hreflang"><attribute name="hreflang"><ref name="common.data.langcode"/></attribute></define><define name="shared-hyperlink.attrs.media"><attribute name="media"><ref name="common.data.mediaquery"/></attribute></define><define name="shared-hyperlink.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/></attribute></define><define name="shared-hyperlink.attrs.ping"><interleave><attribute name="ping"><ref name="common.data.uris"/></attribute><ref name="v5only"/><ref name="nonW3C"/></interleave></define><define name="em.elem"><a:documentation>Emphatic Stress: &lt;em&gt;</a:documentation><element name="em"><interleave><ref name="em.inner"/><ref name="em.attrs"/></interleave></element></define><define name="em.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="em.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="em.elem"/></define><define name="strong.elem"><a:documentation>Strong Importance: &lt;strong&gt;</a:documentation><element name="strong"><interleave><ref name="strong.inner"/><ref name="strong.attrs"/></interleave></element></define><define name="strong.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="strong.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="strong.elem"/></define><define name="small.elem"><a:documentation>Small Print and Side Comments: &lt;small&gt;</a:documentation><element name="small"><interleave><ref name="small.inner"/><ref name="small.attrs"/></interleave></element></define><define name="small.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="small.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="small.elem"/></define><define name="mark.elem"><a:documentation>Marked (Highlighted) Text: &lt;mark&gt;</a:documentation><interleave><element name="mark"><interleave><ref name="mark.inner"/><ref name="mark.attrs"/></interleave></element><ref name="v5only"/></interleave></define><define name="mark.attrs"><ref name="common.attrs"/></define><define name="mark.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="mark.elem"/></define><define name="abbr.elem"><a:documentation>Abbreviation: &lt;abbr&gt;</a:documentation><element name="abbr"><interleave><ref name="abbr.inner"/><ref name="abbr.attrs"/></interleave></element></define><define name="abbr.attrs"><interleave><ref name="common.attrs"/><optional><!-- 	abbr.attrs.title included in common.attrs --><ref name="common.attrs.aria"/></optional></interleave></define><define name="abbr.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="abbr.elem"/></define><define name="dfn.elem"><a:documentation>Defining Instance: &lt;dfn&gt;</a:documentation><element name="dfn"><interleave><ref name="dfn.inner"/><ref name="dfn.attrs"/></interleave></element></define><define name="dfn.attrs"><interleave><ref name="common.attrs"/><optional><!-- 	dfn.attrs.title included in common.attrs --><ref name="common.attrs.aria"/></optional></interleave></define><define name="dfn.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="dfn.elem"/></define><define name="i.elem"><a:documentation>Italic: &lt;i&gt;</a:documentation><element name="i"><interleave><ref name="i.inner"/><ref name="i.attrs"/></interleave></element></define><define name="i.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="i.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="i.elem"/></define><define name="b.elem"><a:documentation>Bold: &lt;b&gt;</a:documentation><element name="b"><interleave><ref name="b.inner"/><ref name="b.attrs"/></interleave></element></define><define name="b.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="b.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="b.elem"/></define><define name="s.elem"><a:documentation>Struck Text: &lt;s&gt;</a:documentation><element name="s"><interleave><ref name="s.inner"/><ref name="s.attrs"/></interleave></element></define><define name="s.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="s.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="s.elem"/></define><define name="u.elem"><a:documentation>Underline: &lt;u&gt;</a:documentation><element name="u"><interleave><ref name="u.inner"/><ref name="u.attrs"/></interleave></element></define><define name="u.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="u.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="u.elem"/></define><define name="code.elem"><a:documentation>Code Fragment: &lt;code&gt;</a:documentation><element name="code"><interleave><ref name="code.inner"/><ref name="code.attrs"/></interleave></element></define><define name="code.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="code.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="code.elem"/></define><define name="var.elem"><a:documentation>Variable or Placeholder: &lt;var&gt;</a:documentation><element name="var"><interleave><ref name="var.inner"/><ref name="var.attrs"/></interleave></element></define><define name="var.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="var.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="var.elem"/></define><define name="samp.elem"><a:documentation>(Sample) Output: &lt;samp&gt;</a:documentation><element name="samp"><interleave><ref name="samp.inner"/><ref name="samp.attrs"/></interleave></element></define><define name="samp.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="samp.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="samp.elem"/></define><define name="kbd.elem"><a:documentation>User Input: &lt;kbd&gt;</a:documentation><element name="kbd"><interleave><ref name="kbd.inner"/><ref name="kbd.attrs"/></interleave></element></define><define name="kbd.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="kbd.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="kbd.elem"/></define><define name="sup.elem"><a:documentation>Superscript: &lt;sup&gt;</a:documentation><element name="sup"><interleave><ref name="sup.inner"/><ref name="sup.attrs"/></interleave></element></define><define name="sup.attrs"><ref name="common.attrs"/></define><define name="sup.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="sup.elem"/></define><define name="sub.elem"><a:documentation>Subscript: &lt;sub&gt;</a:documentation><element name="sub"><interleave><ref name="sub.inner"/><ref name="sub.attrs"/></interleave></element></define><define name="sub.attrs"><ref name="common.attrs"/></define><define name="sub.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="sub.elem"/></define><define name="q.elem"><a:documentation>Quotation: &lt;q&gt;</a:documentation><element name="q"><interleave><ref name="q.inner"/><ref name="q.attrs"/></interleave></element></define><define name="q.attrs"><interleave><ref name="common.attrs"/><optional><ref name="q.attrs.cite"/></optional><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="q.attrs.cite"><attribute name="cite"><ref name="common.data.uri"/></attribute></define><define name="q.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="q.elem"/></define><define name="cite.elem"><a:documentation>Title of Work: &lt;cite&gt;</a:documentation><element name="cite"><interleave><ref name="cite.inner"/><ref name="cite.attrs"/></interleave></element></define><define name="cite.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="cite.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="cite.elem"/></define><define name="span.elem"><a:documentation>Generic Span: &lt;span&gt;</a:documentation><element name="span"><interleave><ref name="span.inner"/><ref name="span.attrs"/></interleave></element></define><define name="span.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="span.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="span.elem"/></define><define name="bdo.elem"><a:documentation>Bidirectional Override: &lt;bdo&gt;</a:documentation><element name="bdo"><interleave><ref name="bdo.inner"/><ref name="bdo.attrs"/></interleave></element></define><define name="bdo.attrs"><ref name="common.attrs"/></define><define name="bdo.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="bdo.elem"/></define><define name="bdi.elem"><a:documentation>Bidirectional Isolate: &lt;bdi&gt;</a:documentation><element name="bdi"><interleave><ref name="bdi.inner"/><ref name="bdi.attrs"/></interleave></element></define><define name="bdi.attrs"><ref name="common.attrs"/></define><define name="bdi.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="bdi.elem"/></define><define name="br.elem"><a:documentation>Line Break: &lt;br&gt;</a:documentation><element name="br"><interleave><ref name="br.inner"/><ref name="br.attrs"/></interleave></element></define><define name="br.attrs"><ref name="common.attrs"/></define><define name="br.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="br.elem"/></define><define name="wbr.elem"><a:documentation>Line-break opportunity: &lt;wbr&gt;</a:documentation><element name="wbr"><interleave><ref name="wbr.inner"/><ref name="wbr.attrs"/></interleave></element></define><define name="wbr.attrs"><ref name="common.attrs"/></define><define name="wbr.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="wbr.elem"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="p.elem"><a:documentation> RELAX NG Schema for HTML 5: Basic Prose Markup                    #</a:documentation><!-- ##################################################################### --><!-- ##################################################################### --><a:documentation>Paragraph-Level</a:documentation><a:documentation>Paragraph: &lt;p&gt;</a:documentation><element name="p"><interleave><ref name="p.inner"/><ref name="p.attrs"/></interleave></element></define><define name="p.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="p.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="p.elem"/></define><define name="hr.elem"><a:documentation>Hint Transition: &lt;hr&gt;</a:documentation><element name="hr"><interleave><ref name="hr.inner"/><ref name="hr.attrs"/></interleave></element></define><define name="hr.attrs"><ref name="common.attrs"/></define><define name="hr.inner"><empty/></define><define name="common.elem.flow" combine="choice"><ref name="hr.elem"/></define><define name="pre.elem"><a:documentation>Preformatting Blocks</a:documentation><a:documentation>Preformatted Text: &lt;pre&gt;</a:documentation><element name="pre"><interleave><ref name="pre.inner"/><ref name="pre.attrs"/></interleave></element></define><define name="pre.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="pre.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="pre.elem"/></define><define name="ul.elem"><a:documentation>Simple Lists</a:documentation><a:documentation>Unordered List: &lt;ul&gt;</a:documentation><element name="ul"><interleave><ref name="ul.inner"/><ref name="ul.attrs"/></interleave></element></define><define name="ul.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.region"/></choice></optional></interleave></define><define name="ul.inner"><zeroOrMore><ref name="li.elem"/></zeroOrMore></define><define name="common.elem.flow" combine="choice"><ref name="ul.elem"/></define><define name="li.elem"><a:documentation>Unordered List Item: &lt;li&gt;</a:documentation><element name="li"><interleave><ref name="li.inner"/><ref name="li.attrs"/></interleave></element></define><define name="li.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.listitem"/></choice></optional></interleave></define><define name="li.inner"><ref name="common.inner.flow"/></define><define name="ol.elem"><a:documentation>Ordered List: &lt;ol&gt;</a:documentation><element name="ol"><interleave><ref name="ol.inner"/><ref name="ol.attrs"/></interleave></element></define><define name="ol.attrs"><interleave><ref name="common.attrs"/><optional><ref name="ol.attrs.start"/></optional><optional><ref name="ol.attrs.reversed"/></optional><optional><ref name="ol.attrs.type"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.region"/></choice></optional></interleave></define><define name="ol.attrs.start"><attribute name="start"><ref name="common.data.integer"/></attribute></define><define name="ol.attrs.reversed"><attribute name="reversed"><choice><value type="string">reversed</value><value type="string"/></choice></attribute></define><define name="ol.attrs.type"><attribute name="type"><choice><value type="string">1</value><value type="string">a</value><value type="string">A</value><value type="string">i</value><value type="string">I</value></choice></attribute></define><define name="ol.inner"><zeroOrMore><ref name="oli.elem"/></zeroOrMore></define><define name="common.elem.flow" combine="choice"><ref name="ol.elem"/></define><define name="oli.elem"><a:documentation>Ordered List Item: &lt;li&gt;</a:documentation><element name="li"><interleave><ref name="oli.inner"/><ref name="oli.attrs"/></interleave></element></define><define name="oli.attrs"><interleave><ref name="common.attrs"/><optional><ref name="oli.attrs.value"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.listitem"/></choice></optional></interleave></define><define name="oli.attrs.value"><attribute name="value"><ref name="common.data.integer"/></attribute></define><define name="oli.inner"><ref name="common.inner.flow"/></define><define name="dl.elem"><a:documentation>Definition Lists</a:documentation><a:documentation>Definition List: &lt;dl&gt;</a:documentation><element name="dl"><interleave><ref name="dl.inner"/><ref name="dl.attrs"/></interleave></element></define><define name="dl.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="dl.inner"><zeroOrMore><oneOrMore><ref name="dt.elem"/></oneOrMore><oneOrMore><ref name="dd.elem"/></oneOrMore></zeroOrMore></define><define name="common.elem.flow" combine="choice"><ref name="dl.elem"/></define><define name="dt.elem"><a:documentation>Definition Term: &lt;dt&gt;</a:documentation><element name="dt"><interleave><ref name="dt.inner"/><ref name="dt.attrs"/></interleave></element></define><define name="dt.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="dt.inner"><ref name="common.inner.flow"/></define><define name="dd.elem"><a:documentation>Definition Description: &lt;dd&gt;</a:documentation><element name="dd"><interleave><ref name="dd.inner"/><ref name="dd.attrs"/></interleave></element></define><define name="dd.elem.phrasing"><element name="dd"><interleave><ref name="dd.inner.phrasing"/><ref name="dd.attrs"/></interleave></element></define><define name="dd.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="dd.inner"><ref name="common.inner.flow"/></define><define name="dd.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="div.elem"><a:documentation>Miscellaneous Elements</a:documentation><a:documentation>Generic Container: &lt;div&gt;</a:documentation><element name="div"><interleave><ref name="div.inner"/><ref name="div.attrs"/></interleave></element></define><define name="div.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="div.inner"><zeroOrMore><ref name="style.elem.scoped"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="div.elem"/></define><define name="legend.elem"><a:documentation>Title or Explanatory Caption: &lt;legend&gt;</a:documentation><element name="legend"><interleave><ref name="legend.inner"/><ref name="legend.attrs"/></interleave></element></define><define name="legend.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="legend.inner"><ref name="common.inner.phrasing"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary=""><define name="h1.elem"><a:documentation> RELAX NG Schema for HTML 5: Sectioning Markup                     #</a:documentation><!-- ##################################################################### --><!-- ##################################################################### --><a:documentation>Headings</a:documentation><a:documentation>Heading (Rank 1): &lt;h1&gt;</a:documentation><element name="h1"><interleave><ref name="h1.inner"/><ref name="h1.attrs"/></interleave></element></define><define name="h1.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h1.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h1.elem"/></define><define name="h2.elem"><a:documentation>Heading (Rank 2): &lt;h2&gt;</a:documentation><element name="h2"><interleave><ref name="h2.inner"/><ref name="h2.attrs"/></interleave></element></define><define name="h2.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h2.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h2.elem"/></define><define name="h3.elem"><a:documentation>Heading (Rank 3): &lt;h3&gt;</a:documentation><element name="h3"><interleave><ref name="h3.inner"/><ref name="h3.attrs"/></interleave></element></define><define name="h3.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h3.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h3.elem"/></define><define name="h4.elem"><a:documentation>Heading (Rank 4): &lt;h4&gt;</a:documentation><element name="h4"><interleave><ref name="h4.inner"/><ref name="h4.attrs"/></interleave></element></define><define name="h4.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h4.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h4.elem"/></define><define name="h5.elem"><a:documentation>Heading (Rank 5): &lt;h5&gt;</a:documentation><element name="h5"><interleave><ref name="h5.inner"/><ref name="h5.attrs"/></interleave></element></define><define name="h5.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h5.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h5.elem"/></define><define name="h6.elem"><a:documentation>Heading (Rank 6): &lt;h6&gt;</a:documentation><element name="h6"><interleave><ref name="h6.inner"/><ref name="h6.attrs"/></interleave></element></define><define name="h6.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="h6.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="h6.elem"/></define><define name="hgroup.elem"><a:documentation>Heading Group: &lt;hgroup&gt;</a:documentation><element name="hgroup"><interleave><ref name="hgroup.inner"/><ref name="hgroup.attrs"/></interleave></element></define><define name="hgroup.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.structure"/></optional></interleave></define><define name="hgroup.inner"><oneOrMore><choice><ref name="h1.elem"/><ref name="h2.elem"/><ref name="h3.elem"/><ref name="h4.elem"/><ref name="h5.elem"/><ref name="h6.elem"/></choice></oneOrMore></define><define name="common.elem.flow" combine="choice"><ref name="hgroup.elem"/></define><define name="address.elem"><a:documentation>Section Meta</a:documentation><a:documentation>Contact Info: &lt;address&gt;</a:documentation><element name="address"><interleave><ref name="address.inner"/><ref name="address.attrs"/></interleave></element></define><define name="address.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="address.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="address.elem"/></define><define name="blockquote.elem"><a:documentation>Quotations	</a:documentation><a:documentation>Block Quotes: &lt;blockquote&gt;</a:documentation><element name="blockquote"><interleave><ref name="blockquote.inner"/><ref name="blockquote.attrs"/></interleave></element></define><define name="blockquote.attrs"><interleave><ref name="common.attrs"/><optional><ref name="blockquote.attrs.cite"/></optional><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="blockquote.attrs.cite"><attribute name="cite"><ref name="common.data.uri"/></attribute></define><define name="blockquote.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="blockquote.elem"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary=""><define name="section.elem"><a:documentation> RELAX NG Schema for HTML 5: Block Markup Added in HTML5           #</a:documentation><!-- ##################################################################### --><a:documentation>Section: &lt;section&gt;</a:documentation><element name="section"><interleave><ref name="section.inner"/><ref name="section.attrs"/></interleave></element></define><define name="section.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.region"/></choice></optional></interleave></define><define name="section.inner"><zeroOrMore><ref name="style.elem.scoped"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="section.elem"/></define><define name="nav.elem"><a:documentation>Navigational Links: &lt;nav&gt;</a:documentation><element name="nav"><interleave><ref name="nav.inner"/><ref name="nav.attrs"/></interleave></element></define><define name="nav.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.implicit.region"/><ref name="common.attrs.aria.landmark.navigation"/></choice></optional></interleave></define><define name="nav.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="nav.elem"/></define><define name="article.elem"><a:documentation>Article: &lt;article&gt;</a:documentation><element name="article"><interleave><ref name="article.inner"/><ref name="article.attrs"/></interleave></element></define><define name="article.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.implicit.region"/><ref name="common.attrs.aria.landmark.article"/><ref name="common.attrs.aria.landmark.main"/><ref name="common.attrs.aria.landmark.document"/><ref name="common.attrs.aria.landmark.application"/></choice></optional></interleave></define><define name="article.inner"><zeroOrMore><ref name="style.elem"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="article.elem"/></define><define name="aside.elem"><a:documentation>Tangential Aside: &lt;aside&gt;</a:documentation><element name="aside"><interleave><ref name="aside.inner"/><ref name="aside.attrs"/></interleave></element></define><define name="aside.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.implicit.region"/><ref name="common.attrs.aria.landmark.complementary"/><ref name="common.attrs.aria.landmark.search"/><ref name="common.attrs.aria.landmark.note"/></choice></optional></interleave></define><define name="aside.inner"><zeroOrMore><ref name="style.elem"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="aside.elem"/></define><define name="header.elem"><a:documentation>Header: &lt;header&gt;</a:documentation><element name="header"><interleave><ref name="header.inner"/><ref name="header.attrs"/></interleave></element></define><define name="header.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.implicit.region"/><ref name="common.attrs.aria.landmark.banner"/></choice></optional></interleave></define><define name="header.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="header.elem"/></define><define name="footer.elem"><a:documentation>Footer: &lt;footer&gt;</a:documentation><element name="footer"><interleave><ref name="footer.inner"/><ref name="footer.attrs"/></interleave></element></define><define name="footer.attrs"><interleave><ref name="common.attrs"/><optional><choice><ref name="common.attrs.aria.implicit.region"/><ref name="common.attrs.aria.landmark.contentinfo"/></choice></optional></interleave></define><define name="footer.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="footer.elem"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary=""><define name="edit.attrs.cite"><a:documentation> RELAX NG Schema for HTML 5: Revision Annotations                  #</a:documentation><!-- ##################################################################### --><a:documentation>Common Attributes</a:documentation><attribute name="cite"><ref name="common.data.uri"/></attribute></define><define name="edit.attrs.datetime"><attribute name="datetime"><choice><ref name="common.data.datetime"/><ref name="common.data.date"/></choice></attribute></define><define name="ins.elem.flow"><a:documentation>Inserts: &lt;ins&gt;</a:documentation><element name="ins"><interleave><ref name="ins.inner.flow"/><ref name="ins.attrs"/></interleave></element></define><define name="ins.elem.phrasing"><element name="ins"><interleave><ref name="ins.inner.phrasing"/><ref name="ins.attrs"/></interleave></element></define><define name="ins.attrs"><interleave><ref name="common.attrs"/><optional><ref name="edit.attrs.cite"/></optional><optional><ref name="edit.attrs.datetime"/></optional></interleave></define><define name="ins.inner.flow"><ref name="common.inner.flow"/></define><define name="ins.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="ins.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="ins.elem.phrasing"/></define><define name="del.elem.flow"><a:documentation>Deletions: &lt;del&gt;</a:documentation><element name="del"><interleave><ref name="del.inner.flow"/><ref name="del.attrs"/></interleave></element></define><define name="del.elem.phrasing"><element name="del"><interleave><ref name="del.inner.phrasing"/><ref name="del.attrs"/></interleave></element></define><define name="del.attrs"><interleave><ref name="common.attrs"/><optional><ref name="edit.attrs.cite"/></optional><optional><ref name="edit.attrs.datetime"/></optional></interleave></define><define name="del.inner.flow"><ref name="common.inner.flow"/></define><define name="del.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="del.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="del.elem.phrasing"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="img.elem"><a:documentation> RELAX NG Schema for HTML 5: Embedded Content                      #</a:documentation><!-- ##################################################################### --><a:documentation>Replaced Content</a:documentation><a:documentation>Images: &lt;img&gt;</a:documentation><element name="img"><interleave><ref name="img.inner"/><ref name="img.attrs"/></interleave></element></define><define name="img.attrs"><interleave><ref name="common.attrs"/><ref name="img.attrs.src"/><optional><ref name="img.attrs.alt"/></optional><optional><ref name="img.attrs.height"/></optional><optional><ref name="img.attrs.width"/></optional><optional><ref name="img.attrs.usemap"/></optional><optional><ref name="img.attrs.ismap"/></optional><optional><ref name="img.attrs.border"/></optional><optional><!-- obsolete --><ref name="common.attrs.aria"/></optional></interleave></define><define name="img.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="img.attrs.alt"><attribute name="alt"/></define><define name="img.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="img.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="img.attrs.usemap"><attribute name="usemap"><ref name="common.data.hash-name"/></attribute></define><define name="img.attrs.ismap"><attribute name="ismap"><choice><value type="string">ismap</value><value type="string"/></choice></attribute></define><define name="img.attrs.border"><attribute name="border"><ref name="common.data.zero"/></attribute></define><define name="img.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="img.elem"/></define><define name="embed.elem"><a:documentation>Plug-ins: &lt;embed&gt;</a:documentation><element name="embed"><interleave><ref name="embed.inner"/><ref name="embed.attrs"/></interleave></element></define><define name="embed.attrs"><interleave><ref name="common.attrs"/><optional><ref name="embed.attrs.src"/></optional><optional><ref name="embed.attrs.type"/></optional><optional><ref name="embed.attrs.height"/></optional><optional><ref name="embed.attrs.width"/></optional><zeroOrMore><ref name="embed.attrs.other"/></zeroOrMore></interleave></define><define name="embed.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="embed.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/></attribute></define><define name="embed.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="embed.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="embed.attrs.other"><!-- REVISIT common.attrs --><attribute><nsName ns=""><except><name ns="">src</name><name ns="">type</name><name ns="">height</name><name ns="">width</name><name ns="">id</name><name ns="">class</name><name ns="">title</name><name ns="">dir</name><name ns="">lang</name><name ns="">translate</name><name ns="">style</name><name ns="">tabindex</name><name ns="">contextmenu</name><name ns="">contenteditable</name><name ns="">draggable</name><name ns="">dropzone</name><name ns="">hidden</name><name ns="">onabort</name><name ns="">onblur</name><name ns="">oncanplay</name><name ns="">oncanplaythrough</name><name ns="">onchange</name><name ns="">onclick</name><name ns="">oncontextmenu</name><name ns="">ondblclick</name><name ns="">ondrag</name><name ns="">ondragend</name><name ns="">ondragenter</name><name ns="">ondragleave</name><name ns="">ondragover</name><name ns="">ondragstart</name><name ns="">ondrop</name><name ns="">ondurationchange</name><name ns="">onemptied</name><name ns="">onended</name><name ns="">onerror</name><name ns="">onfocus</name><name ns="">oninput</name><name ns="">oninvalid</name><name ns="">onkeydown</name><name ns="">onkeypress</name><name ns="">onkeyup</name><name ns="">onload</name><name ns="">onloadeddata</name><name ns="">onloadedmetadata</name><name ns="">onloadstart</name><name ns="">onmousedown</name><name ns="">onmousemove</name><name ns="">onmouseout</name><name ns="">onmouseover</name><name ns="">onmouseup</name><name ns="">onmousewheel</name><name ns="">onpause</name><name ns="">onplay</name><name ns="">onplaying</name><name ns="">onprogress</name><name ns="">onratechange</name><name ns="">onreset</name><name ns="">onscroll</name><name ns="">onseeked</name><name ns="">onseeking</name><name ns="">onselect</name><name ns="">onshow</name><name ns="">onstalled</name><name ns="">onsubmit</name><name ns="">onsuspend</name><name ns="">ontimeupdate</name><name ns="">onvolumechange</name><name ns="">onwaiting</name><name ns="">onafterprint</name><name ns="">onbeforeprint</name><name ns="">onbeforeunload</name><name ns="">onhashchange</name><name ns="">onmessage</name><name ns="">onoffline</name><name ns="">ononline</name><name ns="">onpopstate</name><name ns="">onredo</name><name ns="">onresize</name><name ns="">onstorage</name><name ns="">onundo</name><name ns="">onunload</name><name ns="">role</name><name ns="">aria-atomic</name><name ns="">aria-busy</name><name ns="">aria-controls</name><name ns="">aria-describedby</name><name ns="">aria-disabled</name><name ns="">aria-dropeffect</name><name ns="">aria-flowto</name><name ns="">aria-grabbed</name><name ns="">aria-haspopup</name><name ns="">aria-hidden</name><name ns="">aria-invalid</name><name ns="">aria-label</name><name ns="">aria-labelledby</name><name ns="">aria-live</name><name ns="">aria-owns</name><name ns="">aria-relevant</name><name ns="">aria-required</name><name ns="">spellcheck</name><name ns="">accesskey</name><name ns="">itemref</name><name ns="">itemprop</name><name ns="">itemscope</name><name ns="">itemtype</name><name ns="">itemid</name><name ns="">name</name><name ns="">align</name><name ns="">about</name><name ns="">prefix</name><name ns="">property</name><name ns="">typeof</name><name ns="">vocab</name><name ns="">content</name><name ns="">datatype</name><name ns="">href</name><name ns="">rel</name><name ns="">resource</name><name ns="">rev</name><name ns="">inlist</name></except></nsName><data type="string" datatypeLibrary=""/></attribute></define><define name="embed.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="embed.elem"/></define><define name="object.elem.flow"><a:documentation>Generic Objects: &lt;object&gt;</a:documentation><element name="object"><interleave><ref name="object.inner.flow"/><ref name="object.attrs"/></interleave></element></define><define name="object.elem.phrasing"><element name="object"><interleave><ref name="object.inner.phrasing"/><ref name="object.attrs"/></interleave></element></define><define name="object.attrs"><interleave><ref name="common.attrs"/><choice><interleave><ref name="object.attrs.data"/><optional><ref name="object.attrs.type"/></optional></interleave><ref name="object.attrs.type"/></choice><optional><!--	&	object.attrs.classid?	&	object.attrs.codebase?	&	object.attrs.codetype? --><ref name="object.attrs.height"/></optional><optional><ref name="object.attrs.width"/></optional><optional><ref name="object.attrs.usemap"/></optional><optional><ref name="object.attrs.name"/></optional><optional><ref name="common-form.attrs.form"/></optional><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="object.attrs.data"><attribute name="data"><ref name="common.data.uri.non-empty"/></attribute></define><define name="object.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/></attribute></define><define name="object.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="object.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="object.attrs.usemap"><attribute name="usemap"><ref name="common.data.hash-name"/></attribute></define><define name="object.attrs.name"><attribute name="name"><ref name="common.data.browsing-context"/></attribute></define><define name="object.inner.flow"><zeroOrMore><ref name="param.elem"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="object.inner.phrasing"><zeroOrMore><ref name="param.elem"/></zeroOrMore><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="object.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="object.elem.phrasing"/></define><define name="param.elem"><a:documentation>Initialization Parameters: &lt;param&gt;</a:documentation><element name="param"><interleave><ref name="param.inner"/><ref name="param.attrs"/></interleave></element></define><define name="param.attrs"><interleave><ref name="common.attrs"/><ref name="param.attrs.name"/><ref name="param.attrs.value"/></interleave></define><define name="param.attrs.name"><attribute name="name"><data type="string" datatypeLibrary=""/></attribute></define><define name="param.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/></attribute></define><define name="param.inner"><empty/></define><define name="iframe.elem"><a:documentation>Inline Frame: &lt;iframe&gt;</a:documentation><element name="iframe"><interleave><ref name="iframe.inner"/><ref name="iframe.attrs"/></interleave></element></define><define name="iframe.attrs"><interleave><ref name="common.attrs"/><optional><ref name="iframe.attrs.src"/></optional><optional><ref name="iframe.attrs.srcdoc"/></optional><optional><ref name="iframe.attrs.name"/></optional><optional><ref name="iframe.attrs.width"/></optional><optional><ref name="iframe.attrs.height"/></optional><optional><ref name="iframe.attrs.sandbox"/></optional><optional><ref name="iframe.attrs.seamless"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.region"/></choice></optional></interleave></define><define name="iframe.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="iframe.attrs.srcdoc"><attribute name="srcdoc"><data type="string" datatypeLibrary=""/><!-- FIXME --></attribute></define><define name="iframe.attrs.name"><attribute name="name"><ref name="common.data.browsing-context"/></attribute></define><define name="iframe.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="iframe.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="iframe.attrs.seamless"><interleave><attribute name="seamless"><choice><value type="string">seamless</value><value type="string"/></choice></attribute><ref name="v5only"/></interleave></define><define name="iframe.attrs.sandbox"><interleave><attribute name="sandbox"><choice><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-scripts</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-forms</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional><optional><value type="string">allow-same-origin</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional></list><list><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-top-navigation</value></optional></list><list><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-top-navigation</value></optional></list><list><optional><value type="string">allow-scripts</value></optional><optional><value type="string">allow-forms</value></optional><optional><value type="string">allow-same-origin</value></optional><optional><value type="string">allow-top-navigation</value></optional></list></choice></attribute><ref name="v5only"/></interleave></define><define name="iframe.inner"><text/></define><define name="common.elem.phrasing" combine="choice"><ref name="iframe.elem"/></define><define name="map.elem.flow"><a:documentation>Image Maps</a:documentation><a:documentation>Map Definition: &lt;map&gt;</a:documentation><element name="map"><interleave><ref name="map.inner.flow"/><ref name="map.attrs"/></interleave></element></define><define name="map.elem.phrasing"><element name="map"><interleave><ref name="map.inner.phrasing"/><ref name="map.attrs"/></interleave></element></define><define name="map.attrs"><interleave><ref name="common.attrs"/><ref name="map.attrs.name"/></interleave></define><define name="map.attrs.name"><attribute name="name"><ref name="common.data.name"/></attribute></define><define name="map.inner.flow"><ref name="common.inner.flow"/></define><define name="map.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="map.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="map.elem.phrasing"/></define><define name="area.elem"><a:documentation>Map Area Definition: &lt;area&gt;</a:documentation><element name="area"><interleave><ref name="area.inner"/><ref name="area.attrs"/></interleave></element></define><define name="area.attrs"><interleave><ref name="common.attrs.basic"/><ref name="common.attrs.i18n"/><ref name="common.attrs.present"/><ref name="common.attrs.other"/><optional><interleave><ref name="area.attrs.alt"/><ref name="shared-hyperlink.attrs.href"/></interleave></optional><optional><ref name="shared-hyperlink.attrs.target"/></optional><optional><ref name="shared-hyperlink.attrs.ping"/></optional><optional><ref name="shared-hyperlink.attrs.rel"/></optional><optional><ref name="shared-hyperlink.attrs.media"/></optional><optional><ref name="shared-hyperlink.attrs.hreflang"/></optional><optional><ref name="shared-hyperlink.attrs.type"/></optional><optional><ref name="area.attrs.shape"/></optional></interleave></define><define name="area.attrs.alt"><attribute name="alt"/></define><define name="area.attrs.shape"><choice><interleave><optional><ref name="area.attrs.shape.rect"/></optional><ref name="area.attrs.coords.rect"/></interleave><interleave><ref name="area.attrs.shape.circle"/><ref name="area.attrs.coords.circle"/></interleave><interleave><ref name="area.attrs.shape.poly"/><ref name="area.attrs.coords.poly"/></interleave><ref name="area.attrs.shape.default"/></choice></define><define name="area.attrs.shape.rect"><attribute name="shape"><value type="string">rect</value></attribute></define><define name="area.attrs.coords.rect"><attribute name="coords"><data type="rectangle"/><!--	xsd:token {	pattern = "-?[0-9]+,-?[0-9]+,-?[0-9]+,-?[0-9]+"	} --></attribute></define><define name="area.attrs.shape.circle"><attribute name="shape"><value type="string">circle</value></attribute></define><define name="area.attrs.coords.circle"><attribute name="coords"><data type="circle"/><!--	xsd:token {	pattern = "-?[0-9]+,-?[0-9]+,[0-9]+"	} --></attribute></define><define name="area.attrs.shape.poly"><attribute name="shape"><value type="string">poly</value></attribute></define><define name="area.attrs.coords.poly"><attribute name="coords"><data type="polyline"/><!--	xsd:token {	pattern = "-?[0-9]+,-?[0-9]+,-?[0-9]+,-?[0-9]+,-?[0-9]+,-?[0-9]+(,-?[0-9]+,-?[0-9]+)*"	} --></attribute></define><define name="area.attrs.shape.default"><attribute name="shape"><value type="string">default</value></attribute></define><define name="area.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="area.elem"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary=""><define name="ruby.elem"><a:documentation> RELAX NG Schema for HTML 5: Ruby                                  #</a:documentation><!-- ##################################################################### --><a:documentation/><a:documentation>Ruby Annotation: &lt;ruby&gt;</a:documentation><element name="ruby"><interleave><ref name="ruby.inner"/><ref name="ruby.attrs"/></interleave></element></define><define name="ruby.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="ruby.inner"><oneOrMore><ref name="common.inner.phrasing"/><choice><ref name="rt.elem"/><group><ref name="rp.elem"/><ref name="rt.elem"/><ref name="rp.elem"/></group></choice></oneOrMore></define><define name="common.elem.phrasing" combine="choice"><ref name="ruby.elem"/></define><define name="rt.elem"><a:documentation>Ruby Text: &lt;rt&gt;</a:documentation><element name="rt"><interleave><ref name="rt.inner"/><ref name="rt.attrs"/></interleave></element></define><define name="rt.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="rt.inner"><ref name="common.inner.phrasing"/></define><define name="rp.elem"><a:documentation>Ruby Parenthesis: &lt;rp&gt;</a:documentation><element name="rp"><interleave><ref name="rp.inner"/><ref name="rp.attrs"/></interleave></element></define><define name="rp.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="rp.inner"><ref name="common.inner.phrasing"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="media.attrs"><a:documentation> RELAX NG Schema for HTML 5: Advanced Embedded Content             #</a:documentation><!-- ##################################################################### --><a:documentation>Attributes Common to Media Elements</a:documentation><interleave><optional><ref name="media.attrs.autoplay"/></optional><optional><ref name="media.attrs.preload"/></optional><optional><ref name="media.attrs.controls"/></optional><optional><ref name="media.attrs.loop"/></optional><optional><ref name="media.attrs.mediagroup"/></optional><optional><ref name="media.attrs.muted"/></optional></interleave></define><define name="media.attrs.autoplay"><attribute name="autoplay"><choice><value type="string">autoplay</value><value type="string"/></choice></attribute></define><define name="media.attrs.preload"><attribute name="preload"><choice><value type="string">none</value><value type="string">metadata</value><value type="string">auto</value><value type="string"/></choice></attribute></define><define name="media.attrs.controls"><attribute name="controls"><choice><value type="string">controls</value><value type="string"/></choice></attribute></define><define name="media.attrs.loop"><attribute name="loop"><choice><value type="string">loop</value><value type="string"/></choice></attribute></define><define name="media.attrs.mediagroup"><attribute name="mediagroup"><data type="string" datatypeLibrary=""/></attribute></define><define name="media.attrs.muted"><attribute name="muted"><choice><value type="string">muted</value><value type="string"/></choice></attribute></define><define name="source.elem"><a:documentation>Source: &lt;source&gt;</a:documentation><element name="source"><interleave><ref name="source.inner"/><ref name="source.attrs"/></interleave></element></define><define name="source.attrs"><interleave><ref name="common.attrs"/><ref name="source.attrs.src"/><optional><ref name="source.attrs.type"/></optional><optional><ref name="source.attrs.media"/></optional></interleave></define><define name="source.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="source.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/></attribute></define><define name="source.attrs.media"><attribute name="media"><ref name="common.data.mediaquery"/></attribute></define><define name="source.inner"><empty/></define><define name="media.source"><a:documentation>Media Source</a:documentation><choice><ref name="media.attrs.src"/><zeroOrMore><ref name="source.elem"/></zeroOrMore></choice></define><define name="media.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="video.elem.flow"><a:documentation>Video: &lt;video&gt;</a:documentation><element name="video"><interleave><ref name="video.inner.flow"/><ref name="video.attrs"/></interleave></element></define><define name="video.elem.phrasing"><element name="video"><interleave><ref name="video.inner.phrasing"/><ref name="video.attrs"/></interleave></element></define><define name="video.attrs"><interleave><ref name="common.attrs"/><ref name="media.attrs"/><optional><ref name="video.attrs.poster"/></optional><optional><ref name="video.attrs.height"/></optional><optional><ref name="video.attrs.width"/></optional></interleave></define><define name="video.attrs.poster"><attribute name="poster"><ref name="common.data.uri.non-empty"/></attribute></define><define name="video.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="video.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="video.inner.flow"><ref name="media.source"/><zeroOrMore><ref name="track.elem"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="video.inner.phrasing"><ref name="media.source"/><zeroOrMore><ref name="track.elem"/></zeroOrMore><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="video.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="video.elem.phrasing"/></define><define name="audio.elem.flow"><a:documentation>Audio: &lt;audio&gt;</a:documentation><element name="audio"><interleave><ref name="audio.inner.flow"/><ref name="audio.attrs"/></interleave></element></define><define name="audio.elem.phrasing"><element name="audio"><interleave><ref name="audio.inner.phrasing"/><ref name="audio.attrs"/></interleave></element></define><define name="audio.attrs"><interleave><ref name="common.attrs"/><ref name="media.attrs"/></interleave></define><define name="audio.inner.flow"><ref name="media.source"/><zeroOrMore><ref name="track.elem"/></zeroOrMore><ref name="common.inner.flow"/></define><define name="audio.inner.phrasing"><ref name="media.source"/><zeroOrMore><ref name="track.elem"/></zeroOrMore><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="audio.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="audio.elem.phrasing"/></define><define name="track.elem"><a:documentation>supplementary media track: &lt;track&gt;</a:documentation><element name="track"><interleave><ref name="track.inner"/><ref name="track.attrs"/></interleave></element></define><define name="track.attrs"><interleave><ref name="common.attrs"/><optional><ref name="track.attrs.kind"/></optional><ref name="track.attrs.src"/><optional><ref name="track.attrs.srclang"/></optional><optional><ref name="track.attrs.label"/></optional><optional><ref name="track.attrs.default"/></optional></interleave></define><define name="track.attrs.kind"><attribute name="kind"><choice><value type="string">subtitles</value><value type="string">captions</value><value type="string">descriptions</value><value type="string">chapters</value><value type="string">metadata</value></choice></attribute></define><define name="track.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="track.attrs.srclang"><attribute name="srclang"><ref name="common.data.langcode"/></attribute></define><define name="track.attrs.label"><attribute name="label"><data type="string" datatypeLibrary=""/><!-- must be non-empty value; check is in assertions code --></attribute></define><define name="track.attrs.default"><attribute name="default"><choice><value type="string">default</value><value type="string"/></choice></attribute></define><define name="track.inner"><empty/></define><define name="figure.elem"><a:documentation>Captioned Content: &lt;figure&gt;</a:documentation><element name="figure"><interleave><ref name="figure.inner"/><ref name="figure.attrs"/></interleave></element></define><define name="figure.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.img"/></optional></interleave></define><define name="figure.inner"><choice><group><ref name="figcaption.elem"/><ref name="common.inner.flow"/></group><group><ref name="common.inner.flow"/><optional><ref name="figcaption.elem"/></optional></group></choice></define><define name="common.elem.flow" combine="choice"><ref name="figure.elem"/></define><define name="figcaption.elem"><a:documentation>Figure caption: &lt;figcaption&gt;</a:documentation><element name="figcaption"><interleave><ref name="figcaption.inner"/><ref name="figcaption.attrs"/></interleave></element></define><define name="figcaption.attrs"><ref name="common.attrs"/></define><define name="figcaption.inner"><ref name="common.inner.flow"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="script.elem.embedded"><a:documentation> RELAX NG Schema for HTML 5: Core Scripting                        #</a:documentation><!-- ##################################################################### --><!-- ##################################################################### --><a:documentation>Scripting Elements</a:documentation><a:documentation>Inline Scripts: &lt;script&gt;</a:documentation><element name="script"><interleave><ref name="script.inner.embedded"/><ref name="script.attrs.embedded"/></interleave></element></define><define name="script.attrs.embedded"><interleave><ref name="common.attrs"/><optional><ref name="script.attrs.type"/></optional><optional><ref name="script.attrs.language"/></optional></interleave><!-- restricted in Schematron --></define><define name="script.elem.imported"><element name="script"><interleave><ref name="script.inner.imported"/><ref name="script.attrs.imported"/></interleave></element></define><define name="script.attrs.imported"><interleave><ref name="common.attrs"/><optional><ref name="script.attrs.src"/></optional><optional><ref name="script.attrs.defer"/></optional><optional><ref name="script.attrs.async"/></optional><optional><ref name="script.attrs.type"/></optional><optional><ref name="script.attrs.charset"/></optional><optional><ref name="script.attrs.language"/></optional></interleave><!-- restricted in Schematron --></define><define name="script.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="script.attrs.defer"><attribute name="defer"><choice><value type="string">defer</value><value type="string"/></choice></attribute></define><define name="script.attrs.async"><interleave><attribute name="async"><choice><value type="string">async</value><value type="string"/></choice></attribute><ref name="v5only"/></interleave></define><define name="script.attrs.type"><attribute name="type"><ref name="common.data.mimetype"/><!-- XXX without charset parameter! --></attribute></define><define name="script.attrs.charset"><attribute name="charset"><ref name="common.data.charset"/></attribute></define><define name="script.attrs.language"><attribute name="language"><data type="string" datatypeLibrary=""/></attribute></define><define name="script.inner.embedded"><ref name="common.inner.anything"/></define><define name="script.inner.imported"><ref name="common.inner.anything"/></define><define name="script.elem"><choice><ref name="script.elem.embedded"/><ref name="script.elem.imported"/></choice></define><define name="common.elem.metadata" combine="choice"><ref name="script.elem"/></define><define name="common.elem.phrasing" combine="choice"><ref name="script.elem"/></define><define name="noscript.elem.head"><a:documentation>Fallback Unscripted Content: &lt;noscript&gt;</a:documentation><interleave><element name="noscript"><interleave><ref name="noscript.inner.head"/><ref name="noscript.attrs"/></interleave></element><ref name="HTMLonly"/></interleave></define><define name="noscript.inner.head"><zeroOrMore><choice><ref name="link.elem"/><ref name="meta.http-equiv.default-style.elem"/><ref name="meta.http-equiv.refresh.elem"/><ref name="style.elem"/></choice></zeroOrMore></define><define name="noscript.elem.phrasing"><interleave><element name="noscript"><interleave><ref name="noscript.inner.phrasing"/><ref name="noscript.attrs"/></interleave></element><ref name="HTMLonly"/></interleave></define><define name="noscript.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="noscript.elem.flow"><interleave><element name="noscript"><interleave><ref name="noscript.inner.flow"/><ref name="noscript.attrs"/></interleave></element><ref name="HTMLonly"/></interleave></define><define name="noscript.inner.flow"><ref name="common.inner.flow"/></define><define name="noscript.attrs"><ref name="common.attrs"/></define><define name="common.elem.metadata" combine="choice"><ref name="noscript.elem.head"/></define><define name="common.elem.phrasing" combine="choice"><ref name="noscript.elem.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="noscript.elem.flow"/></define><define name="common.attrs.scripting" combine="interleave"><a:documentation>Event Handler Attribute Definitions</a:documentation><interleave><optional><ref name="scripting.attr.onabort"/></optional><optional><ref name="scripting.attr.onblur"/></optional><optional><ref name="scripting.attr.oncanplay"/></optional><optional><ref name="scripting.attr.oncanplaythrough"/></optional><optional><ref name="scripting.attr.onchange"/></optional><optional><ref name="scripting.attr.onclick"/></optional><optional><ref name="scripting.attr.oncontextmenu"/></optional><optional><ref name="scripting.attr.ondblclick"/></optional><optional><ref name="scripting.attr.ondrag"/></optional><optional><ref name="scripting.attr.ondragend"/></optional><optional><ref name="scripting.attr.ondragenter"/></optional><optional><ref name="scripting.attr.ondragleave"/></optional><optional><ref name="scripting.attr.ondragover"/></optional><optional><ref name="scripting.attr.ondragstart"/></optional><optional><ref name="scripting.attr.ondrop"/></optional><optional><ref name="scripting.attr.ondurationchange"/></optional><optional><ref name="scripting.attr.onemptied"/></optional><optional><ref name="scripting.attr.onended"/></optional><optional><ref name="scripting.attr.onerror"/></optional><optional><ref name="scripting.attr.onfocus"/></optional><optional><ref name="scripting.attr.oninput"/></optional><optional><ref name="scripting.attr.oninvalid"/></optional><optional><ref name="scripting.attr.onkeydown"/></optional><optional><ref name="scripting.attr.onkeypress"/></optional><optional><ref name="scripting.attr.onkeyup"/></optional><optional><ref name="scripting.attr.onload"/></optional><optional><ref name="scripting.attr.onloadeddata"/></optional><optional><ref name="scripting.attr.onloadedmetadata"/></optional><optional><ref name="scripting.attr.onloadstart"/></optional><optional><ref name="scripting.attr.onmousedown"/></optional><optional><ref name="scripting.attr.onmousemove"/></optional><optional><ref name="scripting.attr.onmouseout"/></optional><optional><ref name="scripting.attr.onmouseover"/></optional><optional><ref name="scripting.attr.onmouseup"/></optional><optional><ref name="scripting.attr.onmousewheel"/></optional><optional><ref name="scripting.attr.onpause"/></optional><optional><ref name="scripting.attr.onplay"/></optional><optional><ref name="scripting.attr.onplaying"/></optional><optional><ref name="scripting.attr.onprogress"/></optional><optional><ref name="scripting.attr.onratechange"/></optional><optional><ref name="scripting.attr.onreset"/></optional><optional><ref name="scripting.attr.onscroll"/></optional><optional><ref name="scripting.attr.onseeked"/></optional><optional><ref name="scripting.attr.onseeking"/></optional><optional><ref name="scripting.attr.onselect"/></optional><optional><ref name="scripting.attr.onshow"/></optional><optional><ref name="scripting.attr.onstalled"/></optional><optional><ref name="scripting.attr.onsubmit"/></optional><optional><ref name="scripting.attr.onsuspend"/></optional><optional><ref name="scripting.attr.ontimeupdate"/></optional><optional><ref name="scripting.attr.onvolumechange"/></optional><optional><ref name="scripting.attr.onwaiting"/></optional></interleave></define><define name="common.attrs.other" combine="interleave"><ref name="common.attrs.scripting"/></define><define name="scripting.attr.onabort"><attribute name="onabort"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onblur"><attribute name="onblur"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.oncanplay"><attribute name="oncanplay"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.oncanplaythrough"><attribute name="oncanplaythrough"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onchange"><attribute name="onchange"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onclick"><attribute name="onclick"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.oncontextmenu"><attribute name="oncontextmenu"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondblclick"><attribute name="ondblclick"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondrag"><attribute name="ondrag"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondragend"><attribute name="ondragend"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondragenter"><attribute name="ondragenter"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondragleave"><attribute name="ondragleave"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondragover"><attribute name="ondragover"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondragstart"><attribute name="ondragstart"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondrop"><attribute name="ondrop"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ondurationchange"><attribute name="ondurationchange"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onemptied"><attribute name="onemptied"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onended"><attribute name="onended"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onerror"><attribute name="onerror"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onfocus"><attribute name="onfocus"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onformchange"><attribute name="onformchange"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onforminput"><attribute name="onforminput"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.oninput"><attribute name="oninput"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.oninvalid"><attribute name="oninvalid"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onkeydown"><attribute name="onkeydown"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onkeypress"><attribute name="onkeypress"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onkeyup"><attribute name="onkeyup"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onload"><attribute name="onload"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onloadeddata"><attribute name="onloadeddata"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onloadedmetadata"><attribute name="onloadedmetadata"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onloadstart"><attribute name="onloadstart"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmousedown"><attribute name="onmousedown"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmousemove"><attribute name="onmousemove"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmouseout"><attribute name="onmouseout"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmouseover"><attribute name="onmouseover"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmouseup"><attribute name="onmouseup"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onmousewheel"><attribute name="onmousewheel"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onpause"><attribute name="onpause"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onplay"><attribute name="onplay"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onplaying"><attribute name="onplaying"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onprogress"><attribute name="onprogress"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onratechange"><attribute name="onratechange"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onreset"><attribute name="onreset"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onscroll"><attribute name="onscroll"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onseeked"><attribute name="onseeked"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onseeking"><attribute name="onseeking"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onselect"><attribute name="onselect"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onshow"><attribute name="onshow"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onstalled"><attribute name="onstalled"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onsubmit"><attribute name="onsubmit"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onsuspend"><attribute name="onsuspend"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.ontimeupdate"><attribute name="ontimeupdate"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onvolumechange"><attribute name="onvolumechange"><ref name="common.data.functionbody"/></attribute></define><define name="scripting.attr.onwaiting"><attribute name="onwaiting"><ref name="common.data.functionbody"/></attribute></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="tables.attrs.alignment"><a:documentation> RELAX NG Schema for HTML 5: Tables                                #</a:documentation><!-- ##################################################################### --><!-- ##################################################################### --><a:documentation>Table Envelope</a:documentation><a:documentation>Table Datatypes</a:documentation><!--	tables.data.multilen =	(	common.data.integer.positive	|	common.data.percent	|	xsd:token { pattern = "[0-9]+\*" } #REVISIT should this one be string?	) --><a:documentation>Table Alignment Attributes</a:documentation><interleave><optional><ref name="tables.attrs.align"/></optional><optional><ref name="tables.attrs.char"/></optional><optional><ref name="tables.attrs.valign"/></optional></interleave></define><define name="tables.attrs.align"><attribute name="align"><choice><value type="string">left</value><value type="string">center</value><value type="string">right</value><value type="string">justify</value><value type="string">char</value></choice></attribute></define><define name="tables.attrs.char"><attribute name="char"><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">.</param></data></attribute></define><define name="tables.attrs.valign"><attribute name="valign"><choice><value type="string">top</value><value type="string">middle</value><value type="string">bottom</value><value type="string">baseline</value></choice></attribute></define><define name="table.elem"><a:documentation>Data Table: &lt;table&gt;</a:documentation><element name="table"><interleave><ref name="table.inner"/><ref name="table.attrs"/></interleave></element></define><define name="table.attrs"><interleave><ref name="common.attrs"/><optional><ref name="table.attrs.border"/></optional><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="table.attrs.border"><attribute name="border"><data type="string" datatypeLibrary=""/></attribute></define><define name="table.inner"><optional><ref name="caption.elem"/></optional><zeroOrMore><ref name="colgroup.elem"/></zeroOrMore><optional><ref name="thead.elem"/></optional><choice><group><ref name="tfoot.elem"/><choice><zeroOrMore><ref name="tbody.elem"/></zeroOrMore><oneOrMore><ref name="tr.elem"/></oneOrMore></choice></group><group><choice><zeroOrMore><ref name="tbody.elem"/></zeroOrMore><oneOrMore><ref name="tr.elem"/></oneOrMore></choice><optional><ref name="tfoot.elem"/></optional></group></choice></define><define name="common.elem.flow" combine="choice"><ref name="table.elem"/></define><define name="caption.elem"><a:documentation>Table Caption: &lt;caption&gt;</a:documentation><element name="caption"><interleave><ref name="caption.inner"/><ref name="caption.attrs"/></interleave></element></define><define name="caption.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="caption.inner"><ref name="common.inner.flow"/></define><define name="colgroup.elem"><a:documentation>Table Super Structure</a:documentation><a:documentation>Table Column Group: &lt;colgroup&gt;</a:documentation><element name="colgroup"><interleave><ref name="colgroup.inner"/><ref name="colgroup.attrs"/></interleave></element></define><define name="colgroup.attrs"><ref name="common.attrs"/></define><define name="colgroup.attrs.span"><attribute name="span"><ref name="common.data.integer.positive"/></attribute></define><define name="colgroup.inner"><choice><zeroOrMore><ref name="col.elem"/></zeroOrMore><optional><ref name="colgroup.attrs.span"/></optional></choice></define><define name="col.elem"><a:documentation>Table Column: &lt;col&gt;</a:documentation><element name="col"><interleave><ref name="col.inner"/><ref name="col.attrs"/></interleave></element></define><define name="col.attrs"><interleave><ref name="common.attrs"/><optional><ref name="col.attrs.span"/></optional></interleave></define><define name="col.attrs.span"><attribute name="span"><ref name="common.data.integer.positive"/></attribute></define><define name="col.inner"><empty/></define><define name="thead.elem"><a:documentation>Table Header Row Group</a:documentation><element name="thead"><interleave><ref name="thead.inner"/><ref name="thead.attrs"/></interleave></element></define><define name="thead.attrs"><ref name="common.attrs"/></define><define name="thead.inner"><zeroOrMore><ref name="tr.elem"/></zeroOrMore></define><define name="tfoot.elem"><a:documentation>Table Footer Row Group</a:documentation><element name="tfoot"><interleave><ref name="tfoot.inner"/><ref name="tfoot.attrs"/></interleave></element></define><define name="tfoot.attrs"><ref name="common.attrs"/></define><define name="tfoot.inner"><zeroOrMore><ref name="tr.elem"/></zeroOrMore></define><define name="tbody.elem"><a:documentation>Table Row Group</a:documentation><element name="tbody"><interleave><ref name="tbody.inner"/><ref name="tbody.attrs"/></interleave></element></define><define name="tbody.attrs"><ref name="common.attrs"/></define><define name="tbody.inner"><zeroOrMore><ref name="tr.elem"/></zeroOrMore></define><define name="tr.elem"><a:documentation>Cell Structure</a:documentation><a:documentation>Table Row</a:documentation><element name="tr"><interleave><ref name="tr.inner"/><ref name="tr.attrs"/></interleave></element></define><define name="tr.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="tr.inner"><zeroOrMore><choice><ref name="td.elem"/><ref name="th.elem"/></choice></zeroOrMore></define><define name="tables.attrs.cell-structure"><a:documentation>Common Table Cell Attributes</a:documentation><interleave><optional><ref name="tables.attrs.colspan"/></optional><optional><ref name="tables.attrs.rowspan"/></optional></interleave></define><define name="tables.attrs.colspan"><attribute name="colspan"><ref name="common.data.integer.positive"/></attribute></define><define name="tables.attrs.rowspan"><attribute name="rowspan"><ref name="common.data.integer.non-negative"/></attribute></define><define name="tables.attrs.access-headers"><optional><ref name="tables.attrs.headers"/></optional></define><define name="tables.attrs.headers"><attribute name="headers"><ref name="common.data.idrefs"/></attribute></define><define name="tables.attrs.define-headers"><optional><ref name="tables.attrs.scope"/></optional></define><define name="tables.attrs.scope"><attribute name="scope"><choice><value type="string">row</value><value type="string">col</value><value type="string">rowgroup</value><value type="string">colgroup</value></choice></attribute></define><define name="tables.attrs.abbr"><attribute name="abbr"/></define><define name="td.elem"><a:documentation>Table Data Cell: &lt;td&gt;</a:documentation><element name="td"><interleave><ref name="td.inner"/><ref name="td.attrs"/></interleave></element></define><define name="td.attrs"><interleave><ref name="common.attrs"/><ref name="tables.attrs.cell-structure"/><optional><ref name="tables.attrs.headers"/></optional><optional><!-- 		&	tables.attrs.alignment --><ref name="common.attrs.aria"/></optional></interleave></define><define name="td.inner"><ref name="common.inner.flow"/></define><define name="th.elem"><a:documentation>Table Header Cells: &lt;th&gt;</a:documentation><element name="th"><interleave><ref name="th.inner"/><ref name="th.attrs"/></interleave></element></define><define name="th.attrs"><interleave><ref name="common.attrs"/><ref name="tables.attrs.cell-structure"/><optional><ref name="tables.attrs.scope"/></optional><optional><ref name="tables.attrs.headers"/></optional><optional><!-- 		&	tables.attrs.alignment --><ref name="common.attrs.aria.implicit.th"/></optional></interleave></define><define name="th.inner"><ref name="common.inner.flow"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="form.data.mimetypelist"><a:documentation> RELAX NG Schema for HTML 5: Datatypes related to forms            #</a:documentation><!-- ##################################################################### --><a:documentation>MIME types</a:documentation><data type="mime-type-list"/></define><define name="form.data.charsetlist"><data type="string" datatypeLibrary=""/></define><define name="form.data.pattern"><a:documentation>ECMAScript Regular Expression</a:documentation><data type="pattern"/></define><define name="form.data.datetime-local"><a:documentation>Temporal</a:documentation><data type="datetime-local"/></define><define name="form.data.date"><data type="date"/></define><define name="form.data.month"><data type="month"/></define><define name="form.data.week"><data type="week"/></define><define name="form.data.time"><data type="time"/></define><define name="form.data.emailaddress"><a:documentation>Email</a:documentation><data type="email-address"/></define><define name="form.data.emailaddresslist"><data type="email-address-list"/></define><define name="form.data.color"><a:documentation>Color</a:documentation><data type="simple-color"/></define><define name="form.data.stringwithoutlinebreaks"><a:documentation>Text without line breaks</a:documentation><data type="string-without-line-breaks"/></define><define name="form.data.nonemptystring"><a:documentation>Non-empty string</a:documentation><data type="non-empty-string"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="common-form.attrs"><a:documentation> RELAX NG Schema for HTML 5: Web Forms 1.0 markup                  #</a:documentation><!-- ##################################################################### --><a:documentation>Shared attributes for form controls</a:documentation><interleave><optional><ref name="common-form.attrs.name"/></optional><optional><ref name="common-form.attrs.disabled"/></optional></interleave></define><define name="common-form.attrs.name"><attribute name="name"><data type="string" datatypeLibrary=""/><!-- REVISIT should this be restricted somehow? No & and = perhaps? --></attribute></define><define name="common-form.attrs.disabled"><attribute name="disabled"><choice><value type="string">disabled</value><value type="string"/></choice></attribute></define><define name="shared-form.attrs.readonly"><attribute name="readonly"><choice><value type="string">readonly</value><value type="string"/></choice></attribute></define><define name="shared-form.attrs.maxlength"><attribute name="maxlength"><ref name="common.data.integer.non-negative"/></attribute></define><define name="shared-form.attrs.size"><attribute name="size"><ref name="common.data.integer.positive"/></attribute></define><define name="input.attrs.checked"><a:documentation>Shared attributes for &lt;input&gt;</a:documentation><attribute name="checked"><choice><value type="string">checked</value><value type="string"/></choice></attribute></define><define name="input.text.elem"><a:documentation>Text Field: &lt;input type=\'text\'&gt;</a:documentation><element name="input"><ref name="input.text.attrs"/></element></define><define name="input.text.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><optional><ref name="input.text.attrs.type"/></optional><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="input.text.attrs.value"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.input"/></choice></optional></interleave></define><define name="input.text.attrs.type"><attribute name="type"><value type="string">text</value></attribute></define><define name="input.text.attrs.value"><attribute name="value"><ref name="form.data.stringwithoutlinebreaks"/></attribute></define><define name="input.elem"><ref name="input.text.elem"/></define><define name="input.password.elem"><a:documentation>Password Field: &lt;input type=\'password\'&gt;</a:documentation><element name="input"><ref name="input.password.attrs"/></element></define><define name="input.password.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.password.attrs.type"/><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="input.password.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.password.attrs.type"><attribute name="type"><value type="string">password</value></attribute></define><define name="input.password.attrs.value"><attribute name="value"><ref name="form.data.stringwithoutlinebreaks"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.password.elem"/></define><define name="input.checkbox.elem"><a:documentation>Checkbox: &lt;input type=\'checkbox\'&gt;</a:documentation><element name="input"><ref name="input.checkbox.attrs"/></element></define><define name="input.checkbox.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.checkbox.attrs.type"/><optional><ref name="input.attrs.checked"/></optional><optional><ref name="input.checkbox.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.checkbox.attrs.type"><attribute name="type"><value type="string">checkbox</value></attribute></define><define name="input.checkbox.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/><!-- REVISIT require non-empty value? --></attribute></define><define name="input.elem" combine="choice"><ref name="input.checkbox.elem"/></define><define name="input.radio.elem"><a:documentation>Radiobutton: &lt;input type=\'radio\'&gt;</a:documentation><element name="input"><ref name="input.radio.attrs"/></element></define><define name="input.radio.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.radio.attrs.type"/><optional><ref name="input.attrs.checked"/></optional><optional><ref name="input.radio.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.radio.attrs.type"><attribute name="type"><value type="string">radio</value></attribute></define><define name="input.radio.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/><!-- REVISIT require non-empty value? --></attribute></define><define name="input.elem" combine="choice"><ref name="input.radio.elem"/></define><define name="input.button.elem"><a:documentation>Scripting Hook Button: &lt;input type=\'button\'&gt;</a:documentation><element name="input"><ref name="input.button.attrs"/></element></define><define name="input.button.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.button.attrs.type"/><optional><ref name="input.button.attrs.value"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.button"/></choice></optional></interleave></define><define name="input.button.attrs.type"><attribute name="type"><value type="string">button</value></attribute></define><define name="input.button.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/><!-- REVISIT require non-empty value? --></attribute></define><define name="input.elem" combine="choice"><ref name="input.button.elem"/></define><define name="input.submit.elem"><a:documentation>Submit Button: &lt;input type=\'submit\'&gt;</a:documentation><element name="input"><ref name="input.submit.attrs"/></element></define><define name="input.submit.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.submit.attrs.type"/><optional><ref name="input.submit.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.button"/></optional></interleave></define><define name="input.submit.attrs.type"><attribute name="type"><value type="string">submit</value></attribute></define><define name="input.submit.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/><!-- REVISIT require non-empty value? --></attribute></define><define name="input.elem" combine="choice"><ref name="input.submit.elem"/></define><define name="input.reset.elem"><a:documentation>Reset Button: &lt;input type=\'reset\'&gt;</a:documentation><element name="input"><ref name="input.reset.attrs"/></element></define><define name="input.reset.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.reset.attrs.type"/><optional><ref name="input.reset.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.button"/></optional></interleave></define><define name="input.reset.attrs.type"><attribute name="type"><value type="string">reset</value></attribute></define><define name="input.reset.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/><!-- REVISIT require non-empty value? --></attribute></define><define name="input.elem" combine="choice"><ref name="input.reset.elem"/></define><define name="input.file.elem"><a:documentation>File Upload: &lt;input type=\'file\'&gt;</a:documentation><element name="input"><ref name="input.file.attrs"/></element></define><define name="input.file.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.file.attrs.type"/><optional><ref name="input.file.attrs.accept"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.file.attrs.type"><attribute name="type"><value type="string">file</value></attribute></define><define name="input.file.attrs.accept"><attribute name="accept"><ref name="form.data.mimetypelist"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.file.elem"/></define><define name="input.hidden.elem"><a:documentation>Hidden String: &lt;input type=\'hidden\'&gt;</a:documentation><element name="input"><ref name="input.hidden.attrs"/></element></define><define name="input.hidden.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.hidden.attrs.type"/><optional><ref name="input.hidden.attrs.value"/></optional></interleave></define><define name="input.hidden.attrs.type"><attribute name="type"><value type="string">hidden</value></attribute></define><define name="input.hidden.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/></attribute></define><define name="input.elem" combine="choice"><ref name="input.hidden.elem"/></define><define name="input.image.elem"><a:documentation>Image Submit Button: &lt;input type=\'image\'&gt;</a:documentation><element name="input"><ref name="input.image.attrs"/></element></define><define name="input.image.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.image.attrs.type"/><ref name="input.image.attrs.alt"/><optional><ref name="input.image.attrs.src"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.button"/></choice></optional></interleave></define><define name="input.image.attrs.type"><attribute name="type"><value type="string">image</value></attribute></define><define name="input.image.attrs.alt"><attribute name="alt"><ref name="form.data.nonemptystring"/></attribute></define><define name="input.image.attrs.src"><attribute name="src"><ref name="common.data.uri.non-empty"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.image.elem"/></define><define name="common.elem.phrasing" combine="choice"><ref name="input.elem"/></define><define name="textarea.elem"><a:documentation>Text Area: &lt;textarea&gt;</a:documentation><element name="textarea"><interleave><ref name="textarea.inner"/><ref name="textarea.attrs"/></interleave></element></define><define name="textarea.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><optional><ref name="shared-form.attrs.readonly"/></optional><ref name="textarea.attrs.rows-and-cols-wf1"/><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave><!-- FIXME onfocus, onblur, onselect,onchange --></define><define name="textarea.attrs.rows-and-cols-wf1"><ref name="textarea.attrs.rows-and-cols-wf1.inner"/></define><define name="textarea.attrs.rows-and-cols-wf1.inner"><interleave><ref name="textarea.attrs.cols"/><ref name="textarea.attrs.rows"/></interleave></define><define name="textarea.attrs.cols"><attribute name="cols"><ref name="common.data.integer.positive"/></attribute></define><define name="textarea.attrs.rows"><attribute name="rows"><ref name="common.data.integer.positive"/></attribute></define><define name="textarea.inner"><text/></define><define name="common.elem.phrasing" combine="choice"><ref name="textarea.elem"/></define><define name="option.elem"><a:documentation>Select menu option: &lt;option selected&gt;</a:documentation><element name="option"><interleave><ref name="option.inner"/><ref name="option.attrs"/></interleave></element></define><define name="option.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common-form.attrs.disabled"/></optional><optional><ref name="option.attrs.selected"/></optional><optional><ref name="option.attrs.label"/></optional><optional><ref name="option.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="option.attrs.selected"><attribute name="selected"><choice><value type="string">selected</value><value type="string"/></choice></attribute></define><define name="option.attrs.label"><attribute name="label"><data type="string" datatypeLibrary=""/></attribute></define><define name="option.attrs.value"><attribute name="value"><data type="string" datatypeLibrary=""/></attribute></define><define name="option.inner"><text/></define><define name="optgroup.elem"><a:documentation>Option Group: &lt;optgroup&gt;</a:documentation><element name="optgroup"><interleave><ref name="optgroup.inner"/><ref name="optgroup.attrs"/></interleave></element></define><define name="optgroup.attrs"><interleave><ref name="common.attrs"/><ref name="optgroup.attrs.label"/><optional><ref name="common-form.attrs.disabled"/></optional></interleave></define><define name="optgroup.attrs.label"><attribute name="label"><data type="string" datatypeLibrary=""/></attribute></define><define name="optgroup.inner"><zeroOrMore><ref name="option.elem"/></zeroOrMore></define><define name="select.elem"><a:documentation>Selection Menu: &lt;select&gt;</a:documentation><element name="select"><interleave><ref name="select.inner"/><ref name="select.attrs"/></interleave></element></define><define name="select.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><optional><ref name="select.attrs.size"/></optional><optional><ref name="select.attrs.multiple"/></optional></interleave><!-- FIXME onfocus, onblur, onchange --></define><define name="select.attrs.size"><attribute name="size"><ref name="common.data.integer.positive"/></attribute></define><define name="select.attrs.multiple"><attribute name="multiple"><choice><value type="string">multiple</value><value type="string"/></choice></attribute></define><define name="select.inner"><interleave><zeroOrMore><ref name="optgroup.elem"/></zeroOrMore><zeroOrMore><ref name="option.elem"/></zeroOrMore></interleave></define><define name="common.elem.phrasing" combine="choice"><ref name="select.elem"/></define><define name="button.attrs.value"><a:documentation>Shared Definitions for Complex Button</a:documentation><attribute name="value"><data type="string" datatypeLibrary=""/></attribute></define><define name="button.inner"><ref name="common.inner.phrasing"/></define><define name="button.submit.elem"><a:documentation>Complex Submit Button: &lt;button type=\'submit\'&gt;</a:documentation><element name="button"><interleave><ref name="button.inner"/><ref name="button.submit.attrs"/></interleave></element></define><define name="button.submit.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><optional><ref name="button.submit.attrs.type"/></optional><optional><ref name="button.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.button"/></optional></interleave></define><define name="button.submit.attrs.type"><attribute name="type"><value type="string">submit</value></attribute></define><define name="button.elem"><ref name="button.submit.elem"/></define><define name="button.reset.elem"><a:documentation>Complex Reset Button: &lt;button type=\'reset\'&gt;</a:documentation><element name="button"><interleave><ref name="button.inner"/><ref name="button.reset.attrs"/></interleave></element></define><define name="button.reset.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="button.reset.attrs.type"/><optional><ref name="button.attrs.value"/></optional><optional><!-- REVISIT I guess this still affects the DOM --><ref name="common.attrs.aria.implicit.button"/></optional></interleave></define><define name="button.reset.attrs.type"><attribute name="type"><value type="string">reset</value></attribute></define><define name="button.elem" combine="choice"><ref name="button.reset.elem"/></define><define name="button.button.elem"><a:documentation>Complex Push Button: &lt;button type=\'button\'&gt;</a:documentation><element name="button"><interleave><ref name="button.inner"/><ref name="button.button.attrs"/></interleave></element></define><define name="button.button.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="button.button.attrs.type"/><optional><ref name="button.attrs.value"/></optional><optional><!-- REVISIT I guess this still affects the DOM --><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.button"/></choice></optional></interleave></define><define name="button.button.attrs.type"><attribute name="type"><value type="string">button</value></attribute></define><define name="button.elem" combine="choice"><ref name="button.button.elem"/></define><define name="common.elem.phrasing" combine="choice"><ref name="button.elem"/></define><define name="form.elem"><a:documentation>Form: &lt;form&gt;</a:documentation><element name="form"><interleave><ref name="form.inner"/><ref name="form.attrs"/></interleave></element></define><define name="form.attrs"><interleave><ref name="common.attrs"/><optional><ref name="form.attrs.action"/></optional><optional><!-- REVISIT Should this be required anyway? --><ref name="form.attrs.method"/></optional><optional><ref name="form.attrs.enctype"/></optional><optional><ref name="common-form.attrs.name"/></optional><optional><ref name="form.attrs.accept-charset"/></optional><optional><choice><ref name="common.attrs.aria"/><ref name="common.attrs.aria.implicit.region"/></choice></optional></interleave></define><define name="form.attrs.action"><attribute name="action"><ref name="common.data.uri.non-empty"/></attribute></define><define name="form.attrs.method"><attribute name="method"><ref name="form.attrs.method.data"/></attribute></define><define name="form.attrs.method.data"><choice><value type="string">get</value><value type="string">post</value></choice></define><define name="form.attrs.enctype"><attribute name="enctype"><ref name="form.attrs.enctype.data"/></attribute></define><define name="form.attrs.enctype.data"><choice><value type="string">application/x-www-form-urlencoded</value><value type="string">multipart/form-data</value></choice></define><define name="form.attrs.accept-charset"><attribute name="accept-charset"><ref name="form.data.charsetlist"/></attribute></define><define name="form.inner"><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="form.elem"/></define><define name="fieldset.elem"><a:documentation>Fieldset: &lt;fieldset&gt;</a:documentation><element name="fieldset"><interleave><ref name="fieldset.inner"/><ref name="fieldset.attrs"/></interleave></element></define><define name="fieldset.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common.attrs.aria.implicit.group"/></optional></interleave></define><define name="fieldset.inner"><optional><ref name="legend.elem"/></optional><!-- REVISIT should this be required? --><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="fieldset.elem"/></define><define name="label.elem"><a:documentation>Label: &lt;label&gt;</a:documentation><element name="label"><interleave><ref name="label.inner"/><ref name="label.attrs"/></interleave></element></define><define name="label.attrs"><interleave><ref name="common.attrs"/><optional><ref name="label.attrs.for"/></optional><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="label.attrs.for"><attribute name="for"><ref name="common.data.idref"/></attribute></define><define name="label.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="label.elem"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="common-form.attrs" combine="interleave"><a:documentation> RELAX NG Schema for HTML 5: Web Forms 2.0 markup                  #</a:documentation><!-- ##################################################################### --><a:documentation>Shared attributes for form controls</a:documentation><optional><ref name="common-form.attrs.form"/></optional></define><define name="common-form.attrs.form" combine="choice"><attribute name="form"><ref name="common.data.idref"/></attribute></define><define name="shared-form.attrs.formaction"><attribute name="formaction"><ref name="common.data.uri.non-empty"/></attribute></define><define name="shared-form.attrs.formenctype"><attribute name="formenctype"><ref name="shared-form.attrs.formenctype.data"/></attribute></define><define name="shared-form.attrs.formenctype.data"><choice><value type="string">application/x-www-form-urlencoded</value><value type="string">multipart/form-data</value><value type="string">text/plain</value></choice></define><define name="shared-form.attrs.formmethod"><attribute name="formmethod"><ref name="shared-form.attrs.formmethod.data"/></attribute></define><define name="shared-form.attrs.formmethod.data"><choice><value type="string">get</value><value type="string">post</value></choice></define><define name="shared-form.attrs.formtarget"><attribute name="formtarget"><ref name="common.data.browsing-context-or-keyword"/></attribute></define><define name="shared-form.attrs.formnovalidate"><attribute name="formnovalidate"><choice><value type="string">formnovalidate</value><value type="string"/></choice></attribute></define><define name="shared-form.attrs.autofocus"><attribute name="autofocus"><choice><value type="string">autofocus</value><value type="string"/></choice></attribute></define><define name="shared-form.attrs.pattern"><attribute name="pattern"><ref name="form.data.pattern"/></attribute></define><define name="shared-form.attrs.template"><attribute name="template"><ref name="common.data.idref"/></attribute></define><define name="shared-form.attrs.required"><attribute name="required"><choice><value type="string">required</value><value type="string"/></choice></attribute></define><define name="shared-form.attrs.placeholder"><attribute name="placeholder"><ref name="form.data.stringwithoutlinebreaks"/></attribute></define><define name="shared-form.attrs.dirname"><attribute name="dirname"><ref name="form.data.nonemptystring"/></attribute></define><define name="input.attrs.autocomplete"><a:documentation>Shared attributes for &lt;input&gt;</a:documentation><attribute name="autocomplete"><choice><value type="string">on</value><value type="string">off</value></choice></attribute></define><define name="input.attrs.list"><attribute name="list"><ref name="common.data.idref"/></attribute></define><define name="input.attrs.step.float"><attribute name="step"><choice><value type="string">any</value><ref name="common.data.float.positive"/></choice></attribute></define><define name="input.attrs.step.integer"><attribute name="step"><choice><value type="string">any</value><ref name="common.data.integer.positive"/></choice></attribute></define><define name="input.attrs.multiple"><attribute name="multiple"><choice><value type="string">multiple</value><value type="string"/></choice></attribute></define><define name="input.text.attrs" combine="interleave"><a:documentation>Text Field: &lt;input type=\'text\'&gt;, Extensions</a:documentation><interleave><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="shared-form.attrs.dirname"/></optional></interleave></define><define name="input.password.attrs" combine="interleave"><a:documentation>Password Field: &lt;input type=\'password\'&gt;, Extensions</a:documentation><interleave><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional></interleave></define><define name="input.checkbox.attrs" combine="interleave"><a:documentation>Checkbox &lt;input type=\'checkbox\'&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.required"/></optional></interleave></define><define name="input.radio.attrs" combine="interleave"><a:documentation>Radiobutton: &lt;input type=\'radio\'&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.required"/></optional></interleave></define><define name="input.button.attrs" combine="interleave"><a:documentation>Scripting Hook Button: &lt;input type=\'button\'&gt;, Extensions</a:documentation><optional><ref name="shared-form.attrs.autofocus"/></optional></define><define name="input.submit.attrs" combine="interleave"><a:documentation>Submit Button: &lt;input type=\'submit\'&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.formaction"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.formenctype"/></optional><optional><ref name="shared-form.attrs.formmethod"/></optional><optional><ref name="shared-form.attrs.formtarget"/></optional><optional><ref name="shared-form.attrs.formnovalidate"/></optional></interleave></define><define name="input.reset.attrs" combine="interleave"><a:documentation>Reset Button: &lt;input type=\'reset\'&gt;, Extensions</a:documentation><optional><ref name="shared-form.attrs.autofocus"/></optional></define><define name="input.file.attrs" combine="interleave"><a:documentation>File Upload: &lt;input type=\'file\'&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.attrs.multiple"/></optional></interleave></define><define name="input.image.attrs" combine="interleave"><a:documentation>Image Submit Button: &lt;input type=\'image\'&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.formaction"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.formenctype"/></optional><optional><ref name="shared-form.attrs.formmethod"/></optional><optional><ref name="shared-form.attrs.formtarget"/></optional><optional><ref name="shared-form.attrs.formnovalidate"/></optional><optional><ref name="input.image.attrs.height"/></optional><optional><ref name="input.image.attrs.width"/></optional></interleave></define><define name="input.image.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="input.image.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="input.datetime.elem"><a:documentation>Global Date and Time: &lt;input type=\'datetime\'&gt;</a:documentation><element name="input"><ref name="input.datetime.attrs"/></element></define><define name="input.datetime.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.datetime.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.datetime.attrs.min"/></optional><optional><ref name="input.datetime.attrs.max"/></optional><optional><ref name="input.attrs.step.float"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.datetime.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.datetime.attrs.type"><attribute name="type"><value type="string">datetime</value></attribute></define><define name="input.datetime.attrs.min"><attribute name="min"><ref name="common.data.datetime"/></attribute></define><define name="input.datetime.attrs.max"><attribute name="max"><ref name="common.data.datetime"/></attribute></define><define name="input.datetime.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="common.data.datetime"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.datetime.elem"/></define><define name="input.datetime-local.elem"><a:documentation>Date and Time with No Time Zone Information: &lt;input type=\'datetime-local\'&gt;</a:documentation><element name="input"><ref name="input.datetime-local.attrs"/></element></define><define name="input.datetime-local.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.datetime-local.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.datetime-local.attrs.min"/></optional><optional><ref name="input.datetime-local.attrs.max"/></optional><optional><ref name="input.attrs.step.float"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.datetime-local.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.datetime-local.attrs.type"><attribute name="type"><value type="string">datetime-local</value></attribute></define><define name="input.datetime-local.attrs.min"><attribute name="min"><ref name="form.data.datetime-local"/></attribute></define><define name="input.datetime-local.attrs.max"><attribute name="max"><ref name="form.data.datetime-local"/></attribute></define><define name="input.datetime-local.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.datetime-local"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.datetime-local.elem"/></define><define name="input.date.elem"><a:documentation>Date: &lt;input type=\'date\'&gt;</a:documentation><element name="input"><ref name="input.date.attrs"/></element></define><define name="input.date.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.date.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.date.attrs.min"/></optional><optional><ref name="input.date.attrs.max"/></optional><optional><ref name="input.attrs.step.integer"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.date.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.date.attrs.type"><attribute name="type"><value type="string">date</value></attribute></define><define name="input.date.attrs.min"><attribute name="min"><ref name="form.data.date"/></attribute></define><define name="input.date.attrs.max"><attribute name="max"><ref name="form.data.date"/></attribute></define><define name="input.date.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.date"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.date.elem"/></define><define name="input.month.elem"><a:documentation>Year and Month: &lt;input type=\'month\'&gt;</a:documentation><element name="input"><ref name="input.month.attrs"/></element></define><define name="input.month.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.month.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.month.attrs.min"/></optional><optional><ref name="input.month.attrs.max"/></optional><optional><ref name="input.attrs.step.integer"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.month.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.month.attrs.type"><attribute name="type"><value type="string">month</value></attribute></define><define name="input.month.attrs.min"><attribute name="min"><ref name="form.data.month"/></attribute></define><define name="input.month.attrs.max"><attribute name="max"><ref name="form.data.month"/></attribute></define><define name="input.month.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.month"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.month.elem"/></define><define name="input.time.elem"><a:documentation>Time without Time Zone Information: &lt;input type=\'time\'&gt;</a:documentation><element name="input"><ref name="input.time.attrs"/></element></define><define name="input.time.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.time.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.time.attrs.min"/></optional><optional><ref name="input.time.attrs.max"/></optional><optional><ref name="input.attrs.step.float"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.time.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.time.attrs.type"><attribute name="type"><value type="string">time</value></attribute></define><define name="input.time.attrs.min"><attribute name="min"><ref name="form.data.time"/></attribute></define><define name="input.time.attrs.max"><attribute name="max"><ref name="form.data.time"/></attribute></define><define name="input.time.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.time"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.time.elem"/></define><define name="input.week.elem"><a:documentation>Year and Week: &lt;input type=\'week\'&gt;</a:documentation><element name="input"><ref name="input.week.attrs"/></element></define><define name="input.week.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.week.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.week.attrs.min"/></optional><optional><ref name="input.week.attrs.max"/></optional><optional><ref name="input.attrs.step.integer"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="input.week.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.week.attrs.type"><attribute name="type"><value type="string">week</value></attribute></define><define name="input.week.attrs.min"><attribute name="min"><ref name="form.data.week"/></attribute></define><define name="input.week.attrs.max"><attribute name="max"><ref name="form.data.week"/></attribute></define><define name="input.week.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.week"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.week.elem"/></define><define name="input.number.elem"><a:documentation>Number: &lt;input type=\'number\'&gt;</a:documentation><element name="input"><ref name="input.number.attrs"/></element></define><define name="input.number.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.number.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.number.attrs.min"/></optional><optional><ref name="input.number.attrs.max"/></optional><optional><ref name="input.attrs.step.float"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="input.number.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.number.attrs.type"><attribute name="type"><value type="string">number</value></attribute></define><define name="input.number.attrs.min"><attribute name="min"><ref name="common.data.float"/></attribute></define><define name="input.number.attrs.max"><attribute name="max"><ref name="common.data.float"/></attribute></define><define name="input.number.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="common.data.float"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.number.elem"/></define><define name="input.range.elem"><a:documentation>Imprecise Number: &lt;input type=\'range\'&gt;</a:documentation><element name="input"><ref name="input.range.attrs"/></element></define><define name="input.range.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.range.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.range.attrs.min"/></optional><optional><ref name="input.range.attrs.max"/></optional><optional><ref name="input.attrs.step.float"/></optional><optional><ref name="input.range.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.range.attrs.type"><attribute name="type"><value type="string">range</value></attribute></define><define name="input.range.attrs.min"><attribute name="min"><ref name="common.data.float"/></attribute></define><define name="input.range.attrs.max"><attribute name="max"><ref name="common.data.float"/></attribute></define><define name="input.range.attrs.value"><attribute name="value"><ref name="common.data.float"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.range.elem"/></define><define name="input.email.elem"><a:documentation>Email Address: &lt;input type=\'email\'&gt;</a:documentation><element name="input"><ref name="input.email.attrs"/></element></define><define name="input.email.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.email.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><choice><interleave><ref name="input.attrs.multiple"/><optional><ref name="input.email.attrs.value.multiple"/></optional></interleave><optional><ref name="input.email.attrs.value.single"/></optional></choice></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.email.attrs.type"><attribute name="type"><value type="string">email</value></attribute></define><define name="input.email.attrs.value.single"><attribute name="value"><ref name="form.data.emailaddress"/></attribute></define><define name="input.email.attrs.value.multiple"><attribute name="value"><ref name="form.data.emailaddresslist"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.email.elem"/></define><define name="input.url.elem"><a:documentation>IRI: &lt;input type=\'url\'&gt;</a:documentation><element name="input"><ref name="input.url.attrs"/></element></define><define name="input.url.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.url.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="input.url.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.url.attrs.type"><attribute name="type"><value type="string">url</value></attribute></define><define name="input.url.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="common.data.uri.absolute"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.url.elem"/></define><define name="input.search.elem"><a:documentation>Search: &lt;input type=\'search\'&gt;</a:documentation><element name="input"><ref name="input.search.attrs"/></element></define><define name="input.search.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.search.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="shared-form.attrs.dirname"/></optional><optional><ref name="input.search.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.search.attrs.type"><attribute name="type"><value type="string">search</value></attribute></define><define name="input.search.attrs.value"><attribute name="value"><ref name="form.data.stringwithoutlinebreaks"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.search.elem"/></define><define name="input.tel.elem"><a:documentation>Telephone Number: &lt;input type=\'tel\'&gt;</a:documentation><element name="input"><ref name="input.tel.attrs"/></element></define><define name="input.tel.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.tel.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.pattern"/></optional><optional><ref name="shared-form.attrs.readonly"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.size"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="input.tel.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.tel.attrs.type"><attribute name="type"><value type="string">tel</value></attribute></define><define name="input.tel.attrs.value"><attribute name="value"><ref name="form.data.stringwithoutlinebreaks"/></attribute></define><define name="input.elem" combine="choice"><ref name="input.tel.elem"/></define><define name="input.color.elem"><a:documentation>Color: &lt;input type=\'color\'&gt;</a:documentation><element name="input"><ref name="input.color.attrs"/></element></define><define name="input.color.attrs"><interleave><ref name="common.attrs"/><ref name="common-form.attrs"/><ref name="input.color.attrs.type"/><optional><ref name="input.attrs.autocomplete"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="input.attrs.list"/></optional><optional><ref name="input.color.attrs.value"/></optional><optional><ref name="common.attrs.aria.implicit.input"/></optional></interleave></define><define name="input.color.attrs.type"><attribute name="type"><value type="string">color</value></attribute></define><define name="input.color.attrs.value"><attribute name="value"><choice><value type="string"/><ref name="form.data.color"/></choice></attribute></define><define name="input.elem" combine="choice"><ref name="input.color.elem"/></define><define name="output.elem"><a:documentation>Form Output: &lt;output&gt;</a:documentation><element name="output"><interleave><ref name="output.inner"/><ref name="output.attrs"/></interleave></element></define><define name="output.attrs"><interleave><ref name="common.attrs"/><optional><ref name="common-form.attrs.name"/></optional><optional><ref name="common-form.attrs.form"/></optional><optional><ref name="output.attrs.for"/></optional><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="output.attrs.for"><attribute name="for"><ref name="common.data.idrefs"/><!-- REVISIT spec says space- -not whitespace --></attribute></define><define name="output.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="output.elem"/></define><define name="textarea.attrs.rows-and-cols-wf1.inner" combine="interleave"><a:documentation>Text Area: &lt;textarea&gt;, extensions</a:documentation><notAllowed/></define><define name="textarea.attrs.rows-and-cols-wf1" combine="choice"><empty/></define><define name="textarea.attrs" combine="interleave"><interleave><optional><ref name="shared-form.attrs.maxlength"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.required"/></optional><optional><ref name="shared-form.attrs.placeholder"/></optional><optional><ref name="shared-form.attrs.dirname"/></optional><optional><ref name="textarea.attrs.rows"/></optional><choice><interleave><ref name="textarea.attrs.wrap.hard"/><ref name="textarea.attrs.cols"/></interleave><interleave><optional><ref name="textarea.attrs.wrap.soft"/></optional><optional><ref name="textarea.attrs.cols"/></optional></interleave></choice></interleave></define><define name="textarea.attrs.wrap.hard"><attribute name="wrap"><value type="string">hard</value></attribute></define><define name="textarea.attrs.wrap.soft"><attribute name="wrap"><value type="string">soft</value></attribute></define><define name="datalist.elem"><a:documentation>List of Prefill Data: &lt;datalist&gt;</a:documentation><element name="datalist"><interleave><ref name="datalist.inner"/><ref name="datalist.attrs"/></interleave></element></define><define name="datalist.inner"><interleave><zeroOrMore><ref name="option.elem"/></zeroOrMore><ref name="common.inner.phrasing"/></interleave></define><define name="datalist.attrs"><ref name="common.attrs"/></define><define name="common.elem.phrasing" combine="choice"><ref name="datalist.elem"/></define><define name="button.submit.attrs" combine="interleave"><a:documentation>Complex Submit Button: &lt;button type=\'submit\'&gt;, extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.formaction"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.formenctype"/></optional><optional><ref name="shared-form.attrs.formmethod"/></optional><optional><ref name="shared-form.attrs.formtarget"/></optional><optional><ref name="shared-form.attrs.formnovalidate"/></optional></interleave></define><define name="button.reset.attrs" combine="interleave"><a:documentation>Complex Reset Button: &lt;button type=\'reset\'&gt;, extensions</a:documentation><optional><ref name="shared-form.attrs.autofocus"/></optional></define><define name="button.button.attrs" combine="interleave"><a:documentation>Complex Push Button: &lt;button type=\'button\'&gt;, extensions</a:documentation><optional><ref name="shared-form.attrs.autofocus"/></optional></define><define name="form.attrs" combine="interleave"><a:documentation>Form: &lt;form&gt;, extensions</a:documentation><interleave><optional><ref name="form.attrs.novalidate"/></optional><optional><ref name="form.attrs.target"/></optional><optional><ref name="form.attrs.autocomplete"/></optional></interleave></define><define name="form.attrs.novalidate"><attribute name="novalidate"><choice><value type="string">novalidate</value><value type="string"/></choice></attribute></define><define name="form.attrs.target"><attribute name="target"><ref name="common.data.browsing-context-or-keyword"/></attribute></define><define name="form.attrs.autocomplete"><attribute name="autocomplete"><choice><value type="string">on</value><value type="string">off</value></choice></attribute></define><define name="form.attrs.enctype.data" combine="choice"><value type="string">text/plain</value></define><define name="fieldset.attrs" combine="interleave"><a:documentation>Fieldset: &lt;fieldset&gt;, extensions</a:documentation><ref name="common-form.attrs"/></define><define name="label.attrs" combine="interleave"><a:documentation>Label: &lt;label&gt;, extensions</a:documentation><optional><ref name="common-form.attrs.form"/></optional></define><define name="keygen.elem"><a:documentation>Key-pair generator/input control: &lt;keygen&gt;</a:documentation><element name="keygen"><interleave><ref name="keygen.inner"/><ref name="keygen.attrs"/></interleave></element></define><define name="keygen.attrs"><interleave><ref name="common.attrs"/><optional><ref name="keygen.attrs.challenge"/></optional><optional><ref name="keygen.attrs.keytype"/></optional><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="common-form.attrs"/></optional></interleave><!-- REVISIT which ARIA attributes needed here --></define><define name="keygen.attrs.challenge"><attribute name="challenge"><data type="string" datatypeLibrary=""/></attribute></define><define name="keygen.attrs.keytype"><attribute name="keytype"><value type="string">rsa</value></attribute></define><define name="keygen.inner"><empty/></define><define name="common.elem.phrasing" combine="choice"><ref name="keygen.elem"/></define><define name="select.attrs" combine="interleave"><a:documentation>Selection Menu: &lt;select&gt;, Extensions</a:documentation><interleave><optional><ref name="shared-form.attrs.autofocus"/></optional><optional><ref name="shared-form.attrs.required"/></optional></interleave></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://whattf.org/datatype-draft"><define name="common.attrs.interact" combine="interleave"><a:documentation> RELAX NG Schema for HTML 5: Web Application Features              #</a:documentation><!-- ##################################################################### --><a:documentation>Additions to Common Attributes</a:documentation><interleave><optional><ref name="common.attrs.contextmenu"/></optional><optional><ref name="common.attrs.contenteditable"/></optional><optional><ref name="common.attrs.draggable"/></optional><optional><ref name="common.attrs.dropzone"/></optional><optional><ref name="common.attrs.hidden"/></optional><optional><ref name="common.attrs.spellcheck"/></optional></interleave></define><define name="common.attrs.other" combine="interleave"><ref name="common.attrs.interact"/></define><define name="common.attrs.contextmenu"><a:documentation>Context Menu: contextmenu</a:documentation><attribute name="contextmenu"><ref name="common.data.idref"/></attribute></define><define name="common.attrs.contenteditable"><a:documentation>Editable Content: contenteditable</a:documentation><attribute name="contenteditable"><choice><value type="string">true</value><value type="string">false</value><value type="string"/></choice></attribute></define><define name="common.attrs.draggable"><a:documentation>Draggable Element: draggable</a:documentation><attribute name="draggable"><choice><value type="string">true</value><value type="string">false</value></choice></attribute></define><define name="common.attrs.dropzone"><a:documentation>Dropzone: dropzone</a:documentation><attribute name="dropzone"><list><zeroOrMore><choice><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">[sS][tT][rR][iI][nN][gG]:.+</param></data><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">[fF][iI][lL][eE]:.+</param></data></choice></zeroOrMore><optional><choice><value type="string">copy</value><value type="string">move</value><value type="string">link</value></choice></optional><zeroOrMore><choice><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">[sS][tT][rR][iI][nN][gG]:.+</param></data><data type="string" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"><param name="pattern">[fF][iI][lL][eE]:.+</param></data></choice></zeroOrMore></list></attribute></define><define name="common.attrs.hidden"><a:documentation>Hidden Element: hidden</a:documentation><attribute name="hidden"><choice><value type="string">hidden</value><value type="string"/></choice></attribute></define><define name="common.attrs.spellcheck"><a:documentation>Spellchecking and grammar checking: spellcheck</a:documentation><attribute name="spellcheck"><choice><value type="string">true</value><value type="string">false</value><value type="string"/></choice></attribute></define><define name="html.attrs.manifest"><a:documentation>Application Cache: manifest</a:documentation><attribute name="manifest"><ref name="common.data.uri.non-empty"/></attribute></define><define name="html.attrs" combine="interleave"><optional><ref name="html.attrs.manifest"/></optional></define><define name="progress.elem"><a:documentation>Progess Indicator: &lt;progress&gt;</a:documentation><element name="progress"><interleave><ref name="progress.inner"/><ref name="progress.attrs"/></interleave></element></define><define name="progress.attrs"><interleave><ref name="common.attrs"/><optional><ref name="progress.attrs.value"/></optional><optional><ref name="progress.attrs.max"/></optional></interleave></define><define name="progress.attrs.value"><attribute name="value"><ref name="common.data.float.non-negative"/></attribute></define><define name="progress.attrs.max"><attribute name="max"><ref name="common.data.float.positive"/></attribute></define><define name="progress.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="progress.elem"/></define><define name="command.command.elem"><a:documentation>Command with an associated action: &lt;command type=\'command\'&gt;</a:documentation><element name="command"><interleave><ref name="command.inner"/><ref name="command.command.attrs"/></interleave></element></define><define name="command.command.attrs"><interleave><ref name="common.attrs"/><optional><ref name="command.command.attrs.type"/></optional><ref name="common-command.attrs"/></interleave></define><define name="command.command.attrs.type"><attribute name="type"><value type="string">command</value></attribute></define><define name="command.elem"><ref name="command.command.elem"/></define><define name="command.radio.elem"><a:documentation>Selection of one item from a list of items: &lt;command type=\'radio\'&gt;</a:documentation><element name="command"><interleave><ref name="command.inner"/><ref name="command.radio.attrs"/></interleave></element></define><define name="command.radio.attrs"><interleave><ref name="common.attrs"/><interleave><ref name="command.radio.attrs.type"/><ref name="command.radio.attrs.radiogroup"/><optional><!-- REVISIT taking liberties here --><ref name="command.radio.attrs.checked"/></optional></interleave><ref name="common-command.attrs"/></interleave></define><define name="command.radio.attrs.type"><attribute name="type"><value type="string">radio</value></attribute></define><define name="command.radio.attrs.radiogroup"><attribute name="radiogroup"><data type="string" datatypeLibrary=""/><!-- REVISIT need special format here? --></attribute></define><define name="command.radio.attrs.checked"><attribute name="checked"><choice><value type="string">checked</value><value type="string"/></choice></attribute></define><define name="command.elem" combine="choice"><ref name="command.radio.elem"/></define><define name="command.checkbox.elem"><a:documentation>State or option that can be toggled: &lt;command type=\'checkbox\'&gt;</a:documentation><element name="command"><interleave><ref name="command.inner"/><ref name="command.checkbox.attrs"/></interleave></element></define><define name="command.checkbox.attrs"><interleave><ref name="common.attrs"/><interleave><ref name="command.checkbox.attrs.type"/><optional><ref name="command.checkbox.attrs.checked"/></optional></interleave><ref name="common-command.attrs"/></interleave></define><define name="command.checkbox.attrs.type"><attribute name="type"><value type="string">checkbox</value></attribute></define><define name="command.checkbox.attrs.checked"><attribute name="checked"><choice><value type="string">checked</value><value type="string"/></choice></attribute></define><define name="command.elem" combine="choice"><ref name="command.checkbox.elem"/></define><define name="common-command.attrs"><interleave><optional><ref name="command.attrs.label"/></optional><optional><ref name="command.attrs.icon"/></optional><optional><ref name="command.attrs.disabled"/></optional></interleave></define><define name="command.attrs.label"><attribute name="label"><data type="string" datatypeLibrary=""/></attribute></define><define name="command.attrs.icon"><attribute name="icon"><ref name="common.data.uri.non-empty"/></attribute></define><define name="command.attrs.disabled"><attribute name="disabled"><choice><value type="string">disabled</value><value type="string"/></choice></attribute></define><define name="command.inner"><empty/></define><define name="common.elem.metadata" combine="choice"><interleave><ref name="command.elem"/><ref name="nonHTMLizable"/></interleave></define><define name="common.elem.phrasing" combine="choice"><ref name="command.elem"/></define><define name="menu.elem"><a:documentation>Menu: &lt;menu&gt;</a:documentation><element name="menu"><interleave><ref name="menu.inner"/><ref name="menu.attrs"/></interleave></element></define><define name="menu.attrs"><interleave><ref name="common.attrs"/><optional><ref name="menu.attrs.type"/></optional><optional><ref name="menu.attrs.label"/></optional></interleave></define><define name="menu.attrs.type"><attribute name="type"><choice><value type="string">toolbar</value><value type="string">context</value></choice></attribute></define><define name="menu.attrs.label"><attribute name="label"><data type="string" datatypeLibrary=""/></attribute></define><define name="menu.inner"><choice><zeroOrMore><ref name="mli.elem"/></zeroOrMore><ref name="common.inner.flow"/></choice></define><define name="common.elem.flow" combine="choice"><ref name="menu.elem"/></define><define name="mli.elem"><a:documentation>Menu Item: &lt;li&gt;</a:documentation><element name="li"><interleave><ref name="mli.inner"/><ref name="mli.attrs"/></interleave></element></define><define name="mli.attrs"><ref name="common.attrs"/></define><define name="mli.inner"><ref name="common.inner.flow"/></define><define name="canvas.elem.flow"><a:documentation>Canvas for Dynamic Graphics: &lt;canvas&gt;</a:documentation><element name="canvas"><interleave><ref name="canvas.inner.flow"/><ref name="canvas.attrs"/></interleave></element></define><define name="canvas.elem.phrasing"><element name="canvas"><interleave><ref name="canvas.inner.phrasing"/><ref name="canvas.attrs"/></interleave></element></define><define name="canvas.attrs"><interleave><ref name="common.attrs"/><optional><ref name="canvas.attrs.height"/></optional><optional><ref name="canvas.attrs.width"/></optional><optional><ref name="common.attrs.aria"/></optional></interleave></define><define name="canvas.attrs.height"><attribute name="height"><ref name="common.data.integer.non-negative"/></attribute></define><define name="canvas.attrs.width"><attribute name="width"><ref name="common.data.integer.non-negative"/></attribute></define><define name="canvas.inner.flow"><ref name="common.inner.flow"/></define><define name="canvas.inner.phrasing"><ref name="common.inner.phrasing"/></define><define name="common.elem.flow" combine="choice"><ref name="canvas.elem.flow"/></define><define name="common.elem.phrasing" combine="choice"><ref name="canvas.elem.phrasing"/></define><define name="details.elem"><a:documentation>Additional On-Demand Information: &lt;details&gt;</a:documentation><element name="details"><interleave><ref name="details.inner"/><ref name="details.attrs"/></interleave></element></define><define name="details.attrs"><interleave><ref name="common.attrs"/><optional><ref name="details.attrs.open"/></optional><optional><ref name="common.attrs.aria.implicit.region"/></optional></interleave></define><define name="details.attrs.open"><attribute name="open"><choice><value type="string">open</value><value type="string"/></choice></attribute></define><define name="details.inner"><ref name="summary.elem"/><ref name="common.inner.flow"/></define><define name="common.elem.flow" combine="choice"><ref name="details.elem"/></define><define name="summary.elem"><a:documentation>Caption/summary for details element: &lt;summary&gt;</a:documentation><element name="summary"><interleave><ref name="summary.inner"/><ref name="summary.attrs"/></interleave></element></define><define name="summary.attrs"><ref name="common.attrs"/></define><define name="summary.inner"><ref name="common.inner.phrasing"/></define></rng:div><rng:div xmlns:rng="http://relaxng.org/ns/structure/1.0" datatypeLibrary=""><define name="time.elem"><a:documentation> RELAX NG Schema for HTML 5: Static Data Markup                    #</a:documentation><!-- ##################################################################### --><a:documentation>Time: &lt;time&gt;</a:documentation><element name="time"><interleave><ref name="time.inner"/><ref name="time.attrs"/></interleave></element></define><define name="time.attrs"><interleave><ref name="common.attrs"/><optional><ref name="time.attrs.datetime"/></optional></interleave></define><define name="time.attrs.datetime"><attribute name="datetime"><ref name="common.data.time-datetime"/></attribute></define><define name="time.attrs.datetime.dateonly"><attribute name="datetime"><ref name="common.data.date"/></attribute></define><define name="time.attrs.datetime.tz"><attribute name="datetime"><ref name="common.data.datetime"/></attribute></define><define name="time.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="time.elem"/></define><define name="meter.elem"><a:documentation>Scalar Gauge: &lt;meter&gt;</a:documentation><element name="meter"><interleave><ref name="meter.inner"/><ref name="meter.attrs"/></interleave></element></define><define name="meter.attrs"><interleave><ref name="common.attrs"/><ref name="meter.attrs.value"/><optional><ref name="meter.attrs.min"/></optional><optional><ref name="meter.attrs.low"/></optional><optional><ref name="meter.attrs.high"/></optional><optional><ref name="meter.attrs.max"/></optional><optional><ref name="meter.attrs.optimum"/></optional></interleave></define><define name="meter.attrs.value"><attribute name="value"><ref name="common.data.float"/></attribute></define><define name="meter.attrs.min"><attribute name="min"><ref name="common.data.float"/></attribute></define><define name="meter.attrs.low"><attribute name="low"><ref name="common.data.float"/></attribute></define><define name="meter.attrs.high"><attribute name="high"><ref name="common.data.float"/></attribute></define><define name="meter.attrs.max"><attribute name="max"><ref name="common.data.float"/></attribute></define><define name="meter.attrs.optimum"><attribute name="optimum"><ref name="common.data.float"/></attribute></define><define name="meter.inner"><ref name="common.inner.phrasing"/></define><define name="common.elem.phrasing" combine="choice"><ref name="meter.elem"/></define></rng:div></grammar>';

var parseable = new SAXParseable(schema);

var spb = new SchemaPatternBuilder();

var html5dtlf = new Html5DatatypeLibraryFactory();
var xsddtlf = new XsdDatatypeLibraryFactory();

var datatypeLibs = [html5dtlf, xsddtlf];

var dtll = {
    createDatatypeLibrary: function(uri) {
        for (var i = 0; i < datatypeLibs.length; i++) {
            var library = datatypeLibs[i].createDatatypeLibrary(uri);
            if (library != null)
                return library;
        }
        return null;
    }
};

var start = SchemaBuilder.parse(parseable, eh, dtll, spb, false);
var vpb = new ValidatorPatternBuilder(spb);


function HTMLValidator(properties) {
    var rngValidator = new RngValidator(start, vpb, properties.errorHandler);
    DataAttributeDroppingValidatorWrapper.call(this, rngValidator, properties);
}

HTMLValidator.prototype = Object.create(DataAttributeDroppingValidatorWrapper.prototype, {
    constructor: {value: HTMLValidator}
});

exports.HTMLValidator = HTMLValidator;
},{"./RngValidator":72,"./SAXParseable":75,"./SchemaBuilderImpl":76,"./SchemaPatternBuilder":78,"./ValidatorPatternBuilder":92,"./datatype/xsd/DatatypeLibraryFactoryImpl":100,"./html5/datatype/Html5DatatypeLibraryFactory":132,"./validator/DataAttributeDroppingValidatorWrapper":174}],173:[function(require,module,exports){
var NCName = require('./NCName').NCName;
var SAXParseException = require('../SAXParseException').SAXParseException;
/**
 * This wrapper removes <code>data-*</code> attributes from the pipeline and emits errors if the 
 * <code>data-*</code> attributes contain prohibited characters.
 * 
 * @version $Id$
 * @implements ContentHandler
 * @author hsivonen
 */
function DataAttributeDroppingContentHandlerWrapper(delegate, errorHandler) {
    this._documentLocator;
    this.delegate = delegate;
    this.errorHandler = errorHandler;
}

DataAttributeDroppingContentHandlerWrapper.prototype.characters = function() {
    this.delegate.characters.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.endDocument = function() {
    this.delegate.endDocument.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.endElement = function() {
    this.delegate.endElement.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.endPrefixMapping = function() {
    this.delegate.endPrefixMapping.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.ignorableWhitespace = function() {
    this.delegate.ignorableWhitespace.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.processingInstruction = function() {
    this.delegate.processingInstruction.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.skippedEntity = function() {
    this.delegate.skippedEntity.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.startElement = function(namespaceURI, localName, qName, attributes) {
    if ("http://www.w3.org/1999/xhtml" == namespaceURI) {
        this.delegate.startElement(namespaceURI, localName, qName, this.filterAttributes(attributes));
    } else {
        this.delegate.startElement(namespaceURI, localName, qName, attributes);
    }
};

DataAttributeDroppingContentHandlerWrapper.prototype.filterAttributes = function(attributes) {
    for (var i = 0; i < attributes.length; i++) {
        // FIXME rename nodeName to localName
        var local = attributes[i].nodeName;
        if (local.length > 5 && local.indexOf("data-") === 0 && !attributes[i].namespaceURI) {
            if (this.errorHandler) {
                this.checkDataName(local);
            }
            var filteredAttributes = [];
            for (var j = 0; j < i; j++) {
                filteredAttributes.push({
                    namespaceURI: attributes[j].namespaceURI,
                    nodeName: attributes[j].nodeName,
                    prefix: attributes[j].prefix,
                    nodeValue: attributes[j].nodeValue
                });
            }
            for (var k = i + 1; k < attributes.length; k++) {
                var uri = attributes[k].namespaceURI;
                local = attributes[k].nodeName;
                if (local.length > 5 && local.indexOf("data-") === 0 && !uri) {
                    this.checkDataName(local);
                } else {
                    filteredAttributes.push({
                        namespaceURI: uri,
                        nodeName: local,
                        prefix: attributes[k].prefix,
                        nodeValue: attributes[k].nodeValue
                    });
                }
            }
            return filteredAttributes;
        }
    }
    return attributes;
};

DataAttributeDroppingContentHandlerWrapper.prototype.checkDataName = function(local) {
    for (var i = 5; i < local.length; i++) {
        var c = local.charAt(i);
        if (c >= 'A' && c <= 'Z') {
            this.errorHandler.error(new SAXParseException("\u201Cdata-*\u201D attributes must not have characters from the range \u201CA\u201D\u2026\u201CZ\u201D in the name.", this._documentLocator));
        } else if (!NCName.isNCNameTrail(c)) {
            this.errorHandler.error(new SAXParseException("\u201Cdata-*\u201D attribute names must be XML 1.0 4th ed. plus Namespaces NCNames.", this._documentLocator));
        }
    }
};

DataAttributeDroppingContentHandlerWrapper.prototype.startDocument = function() {
    this.delegate.startDocument.apply(this.delegate, arguments);
};

DataAttributeDroppingContentHandlerWrapper.prototype.startPrefixMapping = function() {
    this.delegate.startPrefixMapping.apply(this.delegate, arguments);
};

Object.defineProperty(DataAttributeDroppingContentHandlerWrapper.prototype, 'documentLocator', {
    set: function(documentLocator) {
        this._documentLocator = documentLocator;
        this.delegate.documentLocator = documentLocator;
    }
});

exports.DataAttributeDroppingContentHandlerWrapper = DataAttributeDroppingContentHandlerWrapper;
},{"../SAXParseException":74,"./NCName":175}],174:[function(require,module,exports){
var DataAttributeDroppingContentHandlerWrapper = require('./DataAttributeDroppingContentHandlerWrapper').DataAttributeDroppingContentHandlerWrapper;

function DataAttributeDroppingValidatorWrapper(delegate, properties) {
	this.delegate = delegate;
	this.properties = properties;
}

DataAttributeDroppingValidatorWrapper.prototype.reset = function() {
	this.delegate.reset();
};

Object.defineProperty(DataAttributeDroppingValidatorWrapper.prototype, 'contentHandler', {
	get: function() {
		return new DataAttributeDroppingContentHandlerWrapper(this.delegate.contentHandler, this.properties.errorHandler);
	}
});

exports.DataAttributeDroppingValidatorWrapper = DataAttributeDroppingValidatorWrapper;
},{"./DataAttributeDroppingContentHandlerWrapper":173}],175:[function(require,module,exports){
function NCName() { }

NCName.prototype.SURROGATE_OFFSET = 0x10000 - (0xD800 << 10) - 0xDC00;

NCName.prototype.HEX_TABLE = "0123456789ABCDEF";

NCName.isNCNameStart = function(c) {
    return ((c >= '\u0041' && c <= '\u005A')
            || (c >= '\u0061' && c <= '\u007A')
            || (c >= '\u00C0' && c <= '\u00D6')
            || (c >= '\u00D8' && c <= '\u00F6')
            || (c >= '\u00F8' && c <= '\u00FF')
            || (c >= '\u0100' && c <= '\u0131')
            || (c >= '\u0134' && c <= '\u013E')
            || (c >= '\u0141' && c <= '\u0148')
            || (c >= '\u014A' && c <= '\u017E')
            || (c >= '\u0180' && c <= '\u01C3')
            || (c >= '\u01CD' && c <= '\u01F0')
            || (c >= '\u01F4' && c <= '\u01F5')
            || (c >= '\u01FA' && c <= '\u0217')
            || (c >= '\u0250' && c <= '\u02A8')
            || (c >= '\u02BB' && c <= '\u02C1') || (c == '\u0386')
            || (c >= '\u0388' && c <= '\u038A') || (c == '\u038C')
            || (c >= '\u038E' && c <= '\u03A1')
            || (c >= '\u03A3' && c <= '\u03CE')
            || (c >= '\u03D0' && c <= '\u03D6') || (c == '\u03DA')
            || (c == '\u03DC') || (c == '\u03DE') || (c == '\u03E0')
            || (c >= '\u03E2' && c <= '\u03F3')
            || (c >= '\u0401' && c <= '\u040C')
            || (c >= '\u040E' && c <= '\u044F')
            || (c >= '\u0451' && c <= '\u045C')
            || (c >= '\u045E' && c <= '\u0481')
            || (c >= '\u0490' && c <= '\u04C4')
            || (c >= '\u04C7' && c <= '\u04C8')
            || (c >= '\u04CB' && c <= '\u04CC')
            || (c >= '\u04D0' && c <= '\u04EB')
            || (c >= '\u04EE' && c <= '\u04F5')
            || (c >= '\u04F8' && c <= '\u04F9')
            || (c >= '\u0531' && c <= '\u0556') || (c == '\u0559')
            || (c >= '\u0561' && c <= '\u0586')
            || (c >= '\u05D0' && c <= '\u05EA')
            || (c >= '\u05F0' && c <= '\u05F2')
            || (c >= '\u0621' && c <= '\u063A')
            || (c >= '\u0641' && c <= '\u064A')
            || (c >= '\u0671' && c <= '\u06B7')
            || (c >= '\u06BA' && c <= '\u06BE')
            || (c >= '\u06C0' && c <= '\u06CE')
            || (c >= '\u06D0' && c <= '\u06D3') || (c == '\u06D5')
            || (c >= '\u06E5' && c <= '\u06E6')
            || (c >= '\u0905' && c <= '\u0939') || (c == '\u093D')
            || (c >= '\u0958' && c <= '\u0961')
            || (c >= '\u0985' && c <= '\u098C')
            || (c >= '\u098F' && c <= '\u0990')
            || (c >= '\u0993' && c <= '\u09A8')
            || (c >= '\u09AA' && c <= '\u09B0') || (c == '\u09B2')
            || (c >= '\u09B6' && c <= '\u09B9')
            || (c >= '\u09DC' && c <= '\u09DD')
            || (c >= '\u09DF' && c <= '\u09E1')
            || (c >= '\u09F0' && c <= '\u09F1')
            || (c >= '\u0A05' && c <= '\u0A0A')
            || (c >= '\u0A0F' && c <= '\u0A10')
            || (c >= '\u0A13' && c <= '\u0A28')
            || (c >= '\u0A2A' && c <= '\u0A30')
            || (c >= '\u0A32' && c <= '\u0A33')
            || (c >= '\u0A35' && c <= '\u0A36')
            || (c >= '\u0A38' && c <= '\u0A39')
            || (c >= '\u0A59' && c <= '\u0A5C') || (c == '\u0A5E')
            || (c >= '\u0A72' && c <= '\u0A74')
            || (c >= '\u0A85' && c <= '\u0A8B') || (c == '\u0A8D')
            || (c >= '\u0A8F' && c <= '\u0A91')
            || (c >= '\u0A93' && c <= '\u0AA8')
            || (c >= '\u0AAA' && c <= '\u0AB0')
            || (c >= '\u0AB2' && c <= '\u0AB3')
            || (c >= '\u0AB5' && c <= '\u0AB9') || (c == '\u0ABD')
            || (c == '\u0AE0') || (c >= '\u0B05' && c <= '\u0B0C')
            || (c >= '\u0B0F' && c <= '\u0B10')
            || (c >= '\u0B13' && c <= '\u0B28')
            || (c >= '\u0B2A' && c <= '\u0B30')
            || (c >= '\u0B32' && c <= '\u0B33')
            || (c >= '\u0B36' && c <= '\u0B39') || (c == '\u0B3D')
            || (c >= '\u0B5C' && c <= '\u0B5D')
            || (c >= '\u0B5F' && c <= '\u0B61')
            || (c >= '\u0B85' && c <= '\u0B8A')
            || (c >= '\u0B8E' && c <= '\u0B90')
            || (c >= '\u0B92' && c <= '\u0B95')
            || (c >= '\u0B99' && c <= '\u0B9A') || (c == '\u0B9C')
            || (c >= '\u0B9E' && c <= '\u0B9F')
            || (c >= '\u0BA3' && c <= '\u0BA4')
            || (c >= '\u0BA8' && c <= '\u0BAA')
            || (c >= '\u0BAE' && c <= '\u0BB5')
            || (c >= '\u0BB7' && c <= '\u0BB9')
            || (c >= '\u0C05' && c <= '\u0C0C')
            || (c >= '\u0C0E' && c <= '\u0C10')
            || (c >= '\u0C12' && c <= '\u0C28')
            || (c >= '\u0C2A' && c <= '\u0C33')
            || (c >= '\u0C35' && c <= '\u0C39')
            || (c >= '\u0C60' && c <= '\u0C61')
            || (c >= '\u0C85' && c <= '\u0C8C')
            || (c >= '\u0C8E' && c <= '\u0C90')
            || (c >= '\u0C92' && c <= '\u0CA8')
            || (c >= '\u0CAA' && c <= '\u0CB3')
            || (c >= '\u0CB5' && c <= '\u0CB9') || (c == '\u0CDE')
            || (c >= '\u0CE0' && c <= '\u0CE1')
            || (c >= '\u0D05' && c <= '\u0D0C')
            || (c >= '\u0D0E' && c <= '\u0D10')
            || (c >= '\u0D12' && c <= '\u0D28')
            || (c >= '\u0D2A' && c <= '\u0D39')
            || (c >= '\u0D60' && c <= '\u0D61')
            || (c >= '\u0E01' && c <= '\u0E2E') || (c == '\u0E30')
            || (c >= '\u0E32' && c <= '\u0E33')
            || (c >= '\u0E40' && c <= '\u0E45')
            || (c >= '\u0E81' && c <= '\u0E82') || (c == '\u0E84')
            || (c >= '\u0E87' && c <= '\u0E88') || (c == '\u0E8A')
            || (c == '\u0E8D') || (c >= '\u0E94' && c <= '\u0E97')
            || (c >= '\u0E99' && c <= '\u0E9F')
            || (c >= '\u0EA1' && c <= '\u0EA3') || (c == '\u0EA5')
            || (c == '\u0EA7') || (c >= '\u0EAA' && c <= '\u0EAB')
            || (c >= '\u0EAD' && c <= '\u0EAE') || (c == '\u0EB0')
            || (c >= '\u0EB2' && c <= '\u0EB3') || (c == '\u0EBD')
            || (c >= '\u0EC0' && c <= '\u0EC4')
            || (c >= '\u0F40' && c <= '\u0F47')
            || (c >= '\u0F49' && c <= '\u0F69')
            || (c >= '\u10A0' && c <= '\u10C5')
            || (c >= '\u10D0' && c <= '\u10F6') || (c == '\u1100')
            || (c >= '\u1102' && c <= '\u1103')
            || (c >= '\u1105' && c <= '\u1107') || (c == '\u1109')
            || (c >= '\u110B' && c <= '\u110C')
            || (c >= '\u110E' && c <= '\u1112') || (c == '\u113C')
            || (c == '\u113E') || (c == '\u1140') || (c == '\u114C')
            || (c == '\u114E') || (c == '\u1150')
            || (c >= '\u1154' && c <= '\u1155') || (c == '\u1159')
            || (c >= '\u115F' && c <= '\u1161') || (c == '\u1163')
            || (c == '\u1165') || (c == '\u1167') || (c == '\u1169')
            || (c >= '\u116D' && c <= '\u116E')
            || (c >= '\u1172' && c <= '\u1173') || (c == '\u1175')
            || (c == '\u119E') || (c == '\u11A8') || (c == '\u11AB')
            || (c >= '\u11AE' && c <= '\u11AF')
            || (c >= '\u11B7' && c <= '\u11B8') || (c == '\u11BA')
            || (c >= '\u11BC' && c <= '\u11C2') || (c == '\u11EB')
            || (c == '\u11F0') || (c == '\u11F9')
            || (c >= '\u1E00' && c <= '\u1E9B')
            || (c >= '\u1EA0' && c <= '\u1EF9')
            || (c >= '\u1F00' && c <= '\u1F15')
            || (c >= '\u1F18' && c <= '\u1F1D')
            || (c >= '\u1F20' && c <= '\u1F45')
            || (c >= '\u1F48' && c <= '\u1F4D')
            || (c >= '\u1F50' && c <= '\u1F57') || (c == '\u1F59')
            || (c == '\u1F5B') || (c == '\u1F5D')
            || (c >= '\u1F5F' && c <= '\u1F7D')
            || (c >= '\u1F80' && c <= '\u1FB4')
            || (c >= '\u1FB6' && c <= '\u1FBC') || (c == '\u1FBE')
            || (c >= '\u1FC2' && c <= '\u1FC4')
            || (c >= '\u1FC6' && c <= '\u1FCC')
            || (c >= '\u1FD0' && c <= '\u1FD3')
            || (c >= '\u1FD6' && c <= '\u1FDB')
            || (c >= '\u1FE0' && c <= '\u1FEC')
            || (c >= '\u1FF2' && c <= '\u1FF4')
            || (c >= '\u1FF6' && c <= '\u1FFC') || (c == '\u2126')
            || (c >= '\u212A' && c <= '\u212B') || (c == '\u212E')
            || (c >= '\u2180' && c <= '\u2182')
            || (c >= '\u3041' && c <= '\u3094')
            || (c >= '\u30A1' && c <= '\u30FA')
            || (c >= '\u3105' && c <= '\u312C')
            || (c >= '\uAC00' && c <= '\uD7A3')
            || (c >= '\u4E00' && c <= '\u9FA5') || (c == '\u3007')
            || (c >= '\u3021' && c <= '\u3029') || (c == '_'));
};

NCName.isNCNameTrail = function(c) {
    return ((c >= '\u0030' && c <= '\u0039')
            || (c >= '\u0660' && c <= '\u0669')
            || (c >= '\u06F0' && c <= '\u06F9')
            || (c >= '\u0966' && c <= '\u096F')
            || (c >= '\u09E6' && c <= '\u09EF')
            || (c >= '\u0A66' && c <= '\u0A6F')
            || (c >= '\u0AE6' && c <= '\u0AEF')
            || (c >= '\u0B66' && c <= '\u0B6F')
            || (c >= '\u0BE7' && c <= '\u0BEF')
            || (c >= '\u0C66' && c <= '\u0C6F')
            || (c >= '\u0CE6' && c <= '\u0CEF')
            || (c >= '\u0D66' && c <= '\u0D6F')
            || (c >= '\u0E50' && c <= '\u0E59')
            || (c >= '\u0ED0' && c <= '\u0ED9')
            || (c >= '\u0F20' && c <= '\u0F29')
            || (c >= '\u0041' && c <= '\u005A')
            || (c >= '\u0061' && c <= '\u007A')
            || (c >= '\u00C0' && c <= '\u00D6')
            || (c >= '\u00D8' && c <= '\u00F6')
            || (c >= '\u00F8' && c <= '\u00FF')
            || (c >= '\u0100' && c <= '\u0131')
            || (c >= '\u0134' && c <= '\u013E')
            || (c >= '\u0141' && c <= '\u0148')
            || (c >= '\u014A' && c <= '\u017E')
            || (c >= '\u0180' && c <= '\u01C3')
            || (c >= '\u01CD' && c <= '\u01F0')
            || (c >= '\u01F4' && c <= '\u01F5')
            || (c >= '\u01FA' && c <= '\u0217')
            || (c >= '\u0250' && c <= '\u02A8')
            || (c >= '\u02BB' && c <= '\u02C1') || (c == '\u0386')
            || (c >= '\u0388' && c <= '\u038A') || (c == '\u038C')
            || (c >= '\u038E' && c <= '\u03A1')
            || (c >= '\u03A3' && c <= '\u03CE')
            || (c >= '\u03D0' && c <= '\u03D6') || (c == '\u03DA')
            || (c == '\u03DC') || (c == '\u03DE') || (c == '\u03E0')
            || (c >= '\u03E2' && c <= '\u03F3')
            || (c >= '\u0401' && c <= '\u040C')
            || (c >= '\u040E' && c <= '\u044F')
            || (c >= '\u0451' && c <= '\u045C')
            || (c >= '\u045E' && c <= '\u0481')
            || (c >= '\u0490' && c <= '\u04C4')
            || (c >= '\u04C7' && c <= '\u04C8')
            || (c >= '\u04CB' && c <= '\u04CC')
            || (c >= '\u04D0' && c <= '\u04EB')
            || (c >= '\u04EE' && c <= '\u04F5')
            || (c >= '\u04F8' && c <= '\u04F9')
            || (c >= '\u0531' && c <= '\u0556') || (c == '\u0559')
            || (c >= '\u0561' && c <= '\u0586')
            || (c >= '\u05D0' && c <= '\u05EA')
            || (c >= '\u05F0' && c <= '\u05F2')
            || (c >= '\u0621' && c <= '\u063A')
            || (c >= '\u0641' && c <= '\u064A')
            || (c >= '\u0671' && c <= '\u06B7')
            || (c >= '\u06BA' && c <= '\u06BE')
            || (c >= '\u06C0' && c <= '\u06CE')
            || (c >= '\u06D0' && c <= '\u06D3') || (c == '\u06D5')
            || (c >= '\u06E5' && c <= '\u06E6')
            || (c >= '\u0905' && c <= '\u0939') || (c == '\u093D')
            || (c >= '\u0958' && c <= '\u0961')
            || (c >= '\u0985' && c <= '\u098C')
            || (c >= '\u098F' && c <= '\u0990')
            || (c >= '\u0993' && c <= '\u09A8')
            || (c >= '\u09AA' && c <= '\u09B0') || (c == '\u09B2')
            || (c >= '\u09B6' && c <= '\u09B9')
            || (c >= '\u09DC' && c <= '\u09DD')
            || (c >= '\u09DF' && c <= '\u09E1')
            || (c >= '\u09F0' && c <= '\u09F1')
            || (c >= '\u0A05' && c <= '\u0A0A')
            || (c >= '\u0A0F' && c <= '\u0A10')
            || (c >= '\u0A13' && c <= '\u0A28')
            || (c >= '\u0A2A' && c <= '\u0A30')
            || (c >= '\u0A32' && c <= '\u0A33')
            || (c >= '\u0A35' && c <= '\u0A36')
            || (c >= '\u0A38' && c <= '\u0A39')
            || (c >= '\u0A59' && c <= '\u0A5C') || (c == '\u0A5E')
            || (c >= '\u0A72' && c <= '\u0A74')
            || (c >= '\u0A85' && c <= '\u0A8B') || (c == '\u0A8D')
            || (c >= '\u0A8F' && c <= '\u0A91')
            || (c >= '\u0A93' && c <= '\u0AA8')
            || (c >= '\u0AAA' && c <= '\u0AB0')
            || (c >= '\u0AB2' && c <= '\u0AB3')
            || (c >= '\u0AB5' && c <= '\u0AB9') || (c == '\u0ABD')
            || (c == '\u0AE0') || (c >= '\u0B05' && c <= '\u0B0C')
            || (c >= '\u0B0F' && c <= '\u0B10')
            || (c >= '\u0B13' && c <= '\u0B28')
            || (c >= '\u0B2A' && c <= '\u0B30')
            || (c >= '\u0B32' && c <= '\u0B33')
            || (c >= '\u0B36' && c <= '\u0B39') || (c == '\u0B3D')
            || (c >= '\u0B5C' && c <= '\u0B5D')
            || (c >= '\u0B5F' && c <= '\u0B61')
            || (c >= '\u0B85' && c <= '\u0B8A')
            || (c >= '\u0B8E' && c <= '\u0B90')
            || (c >= '\u0B92' && c <= '\u0B95')
            || (c >= '\u0B99' && c <= '\u0B9A') || (c == '\u0B9C')
            || (c >= '\u0B9E' && c <= '\u0B9F')
            || (c >= '\u0BA3' && c <= '\u0BA4')
            || (c >= '\u0BA8' && c <= '\u0BAA')
            || (c >= '\u0BAE' && c <= '\u0BB5')
            || (c >= '\u0BB7' && c <= '\u0BB9')
            || (c >= '\u0C05' && c <= '\u0C0C')
            || (c >= '\u0C0E' && c <= '\u0C10')
            || (c >= '\u0C12' && c <= '\u0C28')
            || (c >= '\u0C2A' && c <= '\u0C33')
            || (c >= '\u0C35' && c <= '\u0C39')
            || (c >= '\u0C60' && c <= '\u0C61')
            || (c >= '\u0C85' && c <= '\u0C8C')
            || (c >= '\u0C8E' && c <= '\u0C90')
            || (c >= '\u0C92' && c <= '\u0CA8')
            || (c >= '\u0CAA' && c <= '\u0CB3')
            || (c >= '\u0CB5' && c <= '\u0CB9') || (c == '\u0CDE')
            || (c >= '\u0CE0' && c <= '\u0CE1')
            || (c >= '\u0D05' && c <= '\u0D0C')
            || (c >= '\u0D0E' && c <= '\u0D10')
            || (c >= '\u0D12' && c <= '\u0D28')
            || (c >= '\u0D2A' && c <= '\u0D39')
            || (c >= '\u0D60' && c <= '\u0D61')
            || (c >= '\u0E01' && c <= '\u0E2E') || (c == '\u0E30')
            || (c >= '\u0E32' && c <= '\u0E33')
            || (c >= '\u0E40' && c <= '\u0E45')
            || (c >= '\u0E81' && c <= '\u0E82') || (c == '\u0E84')
            || (c >= '\u0E87' && c <= '\u0E88') || (c == '\u0E8A')
            || (c == '\u0E8D') || (c >= '\u0E94' && c <= '\u0E97')
            || (c >= '\u0E99' && c <= '\u0E9F')
            || (c >= '\u0EA1' && c <= '\u0EA3') || (c == '\u0EA5')
            || (c == '\u0EA7') || (c >= '\u0EAA' && c <= '\u0EAB')
            || (c >= '\u0EAD' && c <= '\u0EAE') || (c == '\u0EB0')
            || (c >= '\u0EB2' && c <= '\u0EB3') || (c == '\u0EBD')
            || (c >= '\u0EC0' && c <= '\u0EC4')
            || (c >= '\u0F40' && c <= '\u0F47')
            || (c >= '\u0F49' && c <= '\u0F69')
            || (c >= '\u10A0' && c <= '\u10C5')
            || (c >= '\u10D0' && c <= '\u10F6') || (c == '\u1100')
            || (c >= '\u1102' && c <= '\u1103')
            || (c >= '\u1105' && c <= '\u1107') || (c == '\u1109')
            || (c >= '\u110B' && c <= '\u110C')
            || (c >= '\u110E' && c <= '\u1112') || (c == '\u113C')
            || (c == '\u113E') || (c == '\u1140') || (c == '\u114C')
            || (c == '\u114E') || (c == '\u1150')
            || (c >= '\u1154' && c <= '\u1155') || (c == '\u1159')
            || (c >= '\u115F' && c <= '\u1161') || (c == '\u1163')
            || (c == '\u1165') || (c == '\u1167') || (c == '\u1169')
            || (c >= '\u116D' && c <= '\u116E')
            || (c >= '\u1172' && c <= '\u1173') || (c == '\u1175')
            || (c == '\u119E') || (c == '\u11A8') || (c == '\u11AB')
            || (c >= '\u11AE' && c <= '\u11AF')
            || (c >= '\u11B7' && c <= '\u11B8') || (c == '\u11BA')
            || (c >= '\u11BC' && c <= '\u11C2') || (c == '\u11EB')
            || (c == '\u11F0') || (c == '\u11F9')
            || (c >= '\u1E00' && c <= '\u1E9B')
            || (c >= '\u1EA0' && c <= '\u1EF9')
            || (c >= '\u1F00' && c <= '\u1F15')
            || (c >= '\u1F18' && c <= '\u1F1D')
            || (c >= '\u1F20' && c <= '\u1F45')
            || (c >= '\u1F48' && c <= '\u1F4D')
            || (c >= '\u1F50' && c <= '\u1F57') || (c == '\u1F59')
            || (c == '\u1F5B') || (c == '\u1F5D')
            || (c >= '\u1F5F' && c <= '\u1F7D')
            || (c >= '\u1F80' && c <= '\u1FB4')
            || (c >= '\u1FB6' && c <= '\u1FBC') || (c == '\u1FBE')
            || (c >= '\u1FC2' && c <= '\u1FC4')
            || (c >= '\u1FC6' && c <= '\u1FCC')
            || (c >= '\u1FD0' && c <= '\u1FD3')
            || (c >= '\u1FD6' && c <= '\u1FDB')
            || (c >= '\u1FE0' && c <= '\u1FEC')
            || (c >= '\u1FF2' && c <= '\u1FF4')
            || (c >= '\u1FF6' && c <= '\u1FFC') || (c == '\u2126')
            || (c >= '\u212A' && c <= '\u212B') || (c == '\u212E')
            || (c >= '\u2180' && c <= '\u2182')
            || (c >= '\u3041' && c <= '\u3094')
            || (c >= '\u30A1' && c <= '\u30FA')
            || (c >= '\u3105' && c <= '\u312C')
            || (c >= '\uAC00' && c <= '\uD7A3')
            || (c >= '\u4E00' && c <= '\u9FA5') || (c == '\u3007')
            || (c >= '\u3021' && c <= '\u3029') || (c == '_') || (c == '.')
            || (c == '-') || (c >= '\u0300' && c <= '\u0345')
            || (c >= '\u0360' && c <= '\u0361')
            || (c >= '\u0483' && c <= '\u0486')
            || (c >= '\u0591' && c <= '\u05A1')
            || (c >= '\u05A3' && c <= '\u05B9')
            || (c >= '\u05BB' && c <= '\u05BD') || (c == '\u05BF')
            || (c >= '\u05C1' && c <= '\u05C2') || (c == '\u05C4')
            || (c >= '\u064B' && c <= '\u0652') || (c == '\u0670')
            || (c >= '\u06D6' && c <= '\u06DC')
            || (c >= '\u06DD' && c <= '\u06DF')
            || (c >= '\u06E0' && c <= '\u06E4')
            || (c >= '\u06E7' && c <= '\u06E8')
            || (c >= '\u06EA' && c <= '\u06ED')
            || (c >= '\u0901' && c <= '\u0903') || (c == '\u093C')
            || (c >= '\u093E' && c <= '\u094C') || (c == '\u094D')
            || (c >= '\u0951' && c <= '\u0954')
            || (c >= '\u0962' && c <= '\u0963')
            || (c >= '\u0981' && c <= '\u0983') || (c == '\u09BC')
            || (c == '\u09BE') || (c == '\u09BF')
            || (c >= '\u09C0' && c <= '\u09C4')
            || (c >= '\u09C7' && c <= '\u09C8')
            || (c >= '\u09CB' && c <= '\u09CD') || (c == '\u09D7')
            || (c >= '\u09E2' && c <= '\u09E3') || (c == '\u0A02')
            || (c == '\u0A3C') || (c == '\u0A3E') || (c == '\u0A3F')
            || (c >= '\u0A40' && c <= '\u0A42')
            || (c >= '\u0A47' && c <= '\u0A48')
            || (c >= '\u0A4B' && c <= '\u0A4D')
            || (c >= '\u0A70' && c <= '\u0A71')
            || (c >= '\u0A81' && c <= '\u0A83') || (c == '\u0ABC')
            || (c >= '\u0ABE' && c <= '\u0AC5')
            || (c >= '\u0AC7' && c <= '\u0AC9')
            || (c >= '\u0ACB' && c <= '\u0ACD')
            || (c >= '\u0B01' && c <= '\u0B03') || (c == '\u0B3C')
            || (c >= '\u0B3E' && c <= '\u0B43')
            || (c >= '\u0B47' && c <= '\u0B48')
            || (c >= '\u0B4B' && c <= '\u0B4D')
            || (c >= '\u0B56' && c <= '\u0B57')
            || (c >= '\u0B82' && c <= '\u0B83')
            || (c >= '\u0BBE' && c <= '\u0BC2')
            || (c >= '\u0BC6' && c <= '\u0BC8')
            || (c >= '\u0BCA' && c <= '\u0BCD') || (c == '\u0BD7')
            || (c >= '\u0C01' && c <= '\u0C03')
            || (c >= '\u0C3E' && c <= '\u0C44')
            || (c >= '\u0C46' && c <= '\u0C48')
            || (c >= '\u0C4A' && c <= '\u0C4D')
            || (c >= '\u0C55' && c <= '\u0C56')
            || (c >= '\u0C82' && c <= '\u0C83')
            || (c >= '\u0CBE' && c <= '\u0CC4')
            || (c >= '\u0CC6' && c <= '\u0CC8')
            || (c >= '\u0CCA' && c <= '\u0CCD')
            || (c >= '\u0CD5' && c <= '\u0CD6')
            || (c >= '\u0D02' && c <= '\u0D03')
            || (c >= '\u0D3E' && c <= '\u0D43')
            || (c >= '\u0D46' && c <= '\u0D48')
            || (c >= '\u0D4A' && c <= '\u0D4D') || (c == '\u0D57')
            || (c == '\u0E31') || (c >= '\u0E34' && c <= '\u0E3A')
            || (c >= '\u0E47' && c <= '\u0E4E') || (c == '\u0EB1')
            || (c >= '\u0EB4' && c <= '\u0EB9')
            || (c >= '\u0EBB' && c <= '\u0EBC')
            || (c >= '\u0EC8' && c <= '\u0ECD')
            || (c >= '\u0F18' && c <= '\u0F19') || (c == '\u0F35')
            || (c == '\u0F37') || (c == '\u0F39') || (c == '\u0F3E')
            || (c == '\u0F3F') || (c >= '\u0F71' && c <= '\u0F84')
            || (c >= '\u0F86' && c <= '\u0F8B')
            || (c >= '\u0F90' && c <= '\u0F95') || (c == '\u0F97')
            || (c >= '\u0F99' && c <= '\u0FAD')
            || (c >= '\u0FB1' && c <= '\u0FB7') || (c == '\u0FB9')
            || (c >= '\u20D0' && c <= '\u20DC') || (c == '\u20E1')
            || (c >= '\u302A' && c <= '\u302F') || (c == '\u3099')
            || (c == '\u309A') || (c == '\u00B7') || (c == '\u02D0')
            || (c == '\u02D1') || (c == '\u0387') || (c == '\u0640')
            || (c == '\u0E46') || (c == '\u0EC6') || (c == '\u3005')
            || (c >= '\u3031' && c <= '\u3035')
            || (c >= '\u309D' && c <= '\u309E') || (c >= '\u30FC' && c <= '\u30FE'));
};

NCName.isNCName = function(str) {
    if (str == null) {
        return false;
    } else {
        switch (str.length) {
            case 0:
                return false;
            case 1:
                return NCName.isNCNameStart(str.charAt(0));
            default:
                if (!NCName.isNCNameStart(str.charAt(0))) {
                    return false;
                }
                for (var i = 1; i < str.length; i++) {
                    if (!NCName.isNCNameTrail(str.charAt(i))) {
                        return false;
                    }
                }
        }
        return true;
    }
};

NCName.appendUHexTo = function(sb, c) {
    sb.push('U');
    for (var i = 0; i < 6; i++) {
        sb.push(NCName.HEX_TABLE[(c & 0xF00000) >> 20]);
        c <<= 4;
    }
};

NCName.escapeName = function(str) {
    var sb = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if ((c & 0xFC00) == 0xD800) {
            var next = str.charAt(++i);
            NCName.appendUHexTo(sb, (c << 10) + next + NCName.SURROGATE_OFFSET);
        } else if (i == 0 && !NCName.isNCNameStart(c)) {
            NCName.appendUHexTo(sb, c);
        } else if (i != 0 && !NCName.isNCNameTrail(c)) {
            NCName.appendUHexTo(sb, c);                
        } else {
            sb.push(c);
        }
    }
    return sb.join('');
};

exports.NCName = NCName;
},{}],176:[function(require,module,exports){
function Name(namespaceUri, localName) {
    this.namespaceUri = namespaceUri;
    this.localName = localName;
}

Name.prototype.getNamespaceUri = function() {
    return this.namespaceUri;
};

Name.prototype.getLocalName = function() {
    return this.localName;
};

Name.prototype.equals = function(object) {
    if (!(object instanceof Name))
        return false;
    return (this.namespaceUri == object.namespaceUri
            && this.localName == object.localName);
};

exports.Name = Name;
},{}],177:[function(require,module,exports){
function Naming() { }
// todo implement
Naming.CT_NAME = 1;
Naming.CT_NMSTRT = 2;

Naming.isName = function(s) {
    return true;
};

Naming.isNmtoken = function(s) {
    return true;
};

Naming.isNcname = function(s) {
    return true;
};

Naming.isQname = function(s) {
    return true;
};

exports.Naming = Naming;
},{}],178:[function(require,module,exports){
function WellKnownNamespaces() {}

WellKnownNamespaces.XML = "http://www.w3.org/XML/1998/namespace";
WellKnownNamespaces.XMLNS = "http://www.w3.org/2000/xmlns";
WellKnownNamespaces.XML_SCHEMA_DATATYPES = "http://www.w3.org/2001/XMLSchema-datatypes";
WellKnownNamespaces.XML_SCHEMA = "http://www.w3.org/2001/XMLSchema";
WellKnownNamespaces.RELAX_NG_COMPATIBILITY_DATATYPES = "http://relaxng.org/ns/compatibility/datatypes/1.0";
WellKnownNamespaces.RELAX_NG = "http://relaxng.org/ns/structure/1.0";
WellKnownNamespaces.RELAX_NG_0_9 = "http://relaxng.org/ns/structure/0.9";
WellKnownNamespaces.RELAX_NG_COMPATIBILITY_ANNOTATIONS = "http://relaxng.org/ns/compatibility/annotations/1.0";


exports.WellKnownNamespaces = WellKnownNamespaces;
},{}]},{},["o4MIuH"])
;
exports.HTMLValidator = require('./validator').HTMLValidator;
});
