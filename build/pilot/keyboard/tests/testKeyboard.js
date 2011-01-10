require.def(["require", "exports", "module", "keyboard/keyboard", "keyboard/tests/plugindev"], function(f, d, g, e, b) {
  d.testKeyMatching = function() {
    var c = e.keyboardManager, a = {};
    b.equal(c._commandMatches(a, "meta_z", {}), false, "no keymapping means false");
    a = {key:"meta_z"};
    b.equal(c._commandMatches(a, "meta_z", {}), true, "matching keys, simple string");
    b.equal(c._commandMatches(a, "meta_a", {}), false, "not matching key, simple string");
    a = {key:{key:"meta_z", predicates:{isGreen:true}}};
    b.equal(c._commandMatches(a, "meta_z", {}), false, "object with not matching predicate");
    b.equal(c._commandMatches(a, "meta_z", {isGreen:true}), true, "object with matching key and predicate");
    b.equal(c._commandMatches(a, "meta_a", {isGreen:true}), false, "object with not matching key");
    b.equal(c._commandMatches(a, "meta_a", {isGreen:false}), false, "object with neither matching");
    b.equal(c._commandMatches(a, "meta_z", {isGreen:false}), false, "object with matching key and but different predicate");
    a = {key:["meta_b", {key:"meta_z", predicates:{isGreen:true}}, {key:"meta_c"}]};
    b.equal(c._commandMatches(a, "meta_z", {}), false, "list: object with not matching predicate");
    b.equal(c._commandMatches(a, "meta_z", {isGreen:true}), true, "list: object with matching key and predicate");
    b.equal(c._commandMatches(a, "meta_a", {isGreen:true}), false, "list: object with not matching key");
    b.equal(c._commandMatches(a, "meta_a", {isGreen:false}), false, "list: object with neither matching");
    b.equal(c._commandMatches(a, "meta_z", {isGreen:false}), false, "list: object with matching key and but different predicate");
    b.equal(c._commandMatches(a, "meta_b"), true, "list: simple key match");
    b.equal(c._commandMatches(a, "meta_c"), true, "list: object without predicate match");
    b.equal(c._commandMatches(a, "meta_c", {isGreen:false}), true, "list: flags don't matter without predicates")
  }
});