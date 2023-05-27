
var tokenize = require("./regexp_tokenizer").tokenize;

function parse(str) {
    var tokens = tokenize(str);
    var node = addChild();
    var root = node;
    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        switch (t.type) {
            case "group.start": 
                node = addChild(node);
                break;
            case "group.end": 
                if (node.alternation) {
                    addChild(node, node.children, node.alternation);
                    node.children = node.alternation;
                    node.alternation = true;
                }
                node = node.parent;
                break;
            case "alternation":
                if (!node.alternation) {
                    node.alternation = [];
                }
                addChild(node, node.children, node.alternation);
                node.children = [];
                break; 
            case "text": 
                node.children.push(t.value);
                break; 
            case "anchor": 
                node.children.push(t);
                break;
            case "quantifier":
                var last = node.children[node.children.length - 1];
                if (last.type == "string" || t.value != "?") {
                    console.error(node);
                    throw new Error("Unsupported " + t.type);
                }
                last.optional = true;
                break;
            default:
                console.error(t, node)
                throw new Error("Unsupported " + t.type)
        
        }
    }
    if (root != node) {
        throw new Error("Expected groups to match");
    }
    return root

    function addChild(parent, children, targetArray) {
        var newNode = {children: children || [], parent: parent};
        children && children.forEach(element => {
            element.parent = newNode;
        });
        if (parent) {
            (targetArray || parent.children).push(newNode);
        }
        return newNode;
    }
}

var HighlightRules = require("../src/mode/objectivec_highlight_rules").ObjectiveCHighlightRules;


var rules = new HighlightRules().$rules.start
    .filter(x => /support.function.C99.c/.test(x.token))


var words = {};
rules.forEach(function(rule) {
    var tree = parse(rule.regex)

    var flattened = flatten(tree);

    words[rule.token] = flattened.join("|");

    function flatten(node) {
        if (typeof node == "string") {
            return node;
        } else if (node.children) {
            var flatNode = node.children.map(flatten);
            var result;
            if (node.alternation) {
                result = flatNode.flat();
            } else {
                var result = [""]
                for (var i = 0; i < flatNode.length; i++) {
                    var toAdd = flatNode[i]
                    var base = result;
                    var result = [];
                    if (typeof toAdd == "string") {
                        for (var j = 0; j < base.length; j++) {
                            result.push(base[j] + toAdd)
                        }
                    } else {
                        for (var j = 0; j < base.length; j++) {
                            for (var k = 0; k < toAdd.length; k++) {
                                result.push(base[j] + toAdd[k])
                            }
                        }
                        if (toAdd.optional)
                            result = base.concat(result)

                    }
                }
            }
            if (node.optional) {
                result.optional = true;
            }
            return result;
        }
        return [""]
    }
});


require("fs").writeFileSync(__dirname + "/_flattened.js", JSON.stringify(words, null, 4), "utf8")