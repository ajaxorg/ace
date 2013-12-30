define(function(require, exports, module) {
"use strict";

    
exports.Modules = {
  "http://expath.org/ns/error" : {
    "functions" : {

    }
  }, 
  "http://expath.org/ns/file" : {
    "functions" : {
      "append-binary" : [ {
        "params" : [ "$file", "$content" ]
      } ], 
      "append-text" : [ {
        "params" : [ "$file", "$content", "$encoding" ]
      }, {
        "params" : [ "$file", "$content" ]
      } ], 
      "append-text-lines" : [ {
        "params" : [ "$file", "$content", "$encoding" ]
      }, {
        "params" : [ "$file", "$content" ]
      } ], 
      "base-name" : [ {
        "params" : [ "$path" ]
      }, {
        "params" : [ "$path", "$suffix" ]
      } ], 
      "copy" : [ {
        "params" : [ "$source", "$destination" ]
      } ], 
      "create-directory" : [ {
        "params" : [ "$dir" ]
      } ], 
      "delete" : [ {
        "params" : [ "$path" ]
      } ], 
      "directory-separator" : [ {
        "params" : [  ]
      } ], 
      "dir-name" : [ {
        "params" : [ "$path" ]
      } ], 
      "exists" : [ {
        "params" : [ "$path", "$follow-symlinks" ]
      }, {
        "params" : [ "$path" ]
      } ], 
      "glob-to-regex" : [ {
        "params" : [ "$pattern" ]
      } ], 
      "is-directory" : [ {
        "params" : [ "$path" ]
      } ], 
      "is-file" : [ {
        "params" : [ "$path" ]
      } ], 
      "is-symlink" : [ {
        "params" : [ "$path" ]
      } ], 
      "last-modified" : [ {
        "params" : [ "$path" ]
      } ], 
      "list" : [ {
        "params" : [ "$dir" ]
      }, {
        "params" : [ "$path", "$recursive" ]
      }, {
        "params" : [ "$path", "$recursive", "$pattern" ]
      } ], 
      "move" : [ {
        "params" : [ "$source", "$destination" ]
      } ], 
      "path-separator" : [ {
        "params" : [  ]
      } ], 
      "path-to-native" : [ {
        "params" : [ "$path" ]
      } ], 
      "path-to-uri" : [ {
        "params" : [ "$path" ]
      } ], 
      "read-binary" : [ {
        "params" : [ "$file" ]
      } ], 
      "read-text" : [ {
        "params" : [ "$file", "$encoding" ]
      }, {
        "params" : [ "$file" ]
      } ], 
      "read-text-lines" : [ {
        "params" : [ "$file" ]
      }, {
        "params" : [ "$file", "$encoding" ]
      } ], 
      "resolve-path" : [ {
        "params" : [ "$path" ]
      } ], 
      "size" : [ {
        "params" : [ "$file" ]
      } ], 
      "write-binary" : [ {
        "params" : [ "$file", "$content" ]
      } ], 
      "write-text" : [ {
        "params" : [ "$file", "$content", "$encoding" ]
      }, {
        "params" : [ "$file", "$content" ]
      } ], 
      "write-text-lines" : [ {
        "params" : [ "$file", "$content", "$encoding" ]
      }, {
        "params" : [ "$file", "$content" ]
      } ], 
      "copy-file-impl" : [ {
        "params" : [ "$sourceFile", "$destination" ]
      } ], 
      "copy-directory-impl" : [ {
        "params" : [ "$sourceDir", "$destination" ]
      } ], 
      "copy-directory" : [ {
        "params" : [ "$sourceDir", "$destinationDir" ]
      } ], 
      "copy-directory-content" : [ {
        "params" : [ "$sourceDir", "$destination" ]
      } ], 
      "delete-file-impl" : [ {
        "params" : [ "$file" ]
      } ], 
      "delete-directory-impl" : [ {
        "params" : [ "$dir" ]
      } ]
    }
  }, 
  "http://expath.org/ns/geo" : {
    "functions" : {
      "dimension" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "coordinate-dimension" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "geometry-type" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "srid" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "num-geometries" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "geometry-n" : [ {
        "params" : [ "$geometry", "$n" ]
      } ], 
      "envelope" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "as-text" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "as-binary" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "is-empty" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "is-simple" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "is-3d" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "is-measured" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "boundary" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "equals" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "covers" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "disjoint" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "intersects" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "touches" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "crosses" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "within" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "contains" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "overlaps" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "relate" : [ {
        "params" : [ "$geometry1", "$geometry2", "$intersection_matrix" ]
      } ], 
      "distance" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "buffer" : [ {
        "params" : [ "$geometry", "$distance" ]
      } ], 
      "convex-hull" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "intersection" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "union" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "difference" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "sym-difference" : [ {
        "params" : [ "$geometry1", "$geometry2" ]
      } ], 
      "area" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "length" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "is-within-distance" : [ {
        "params" : [ "$geometry1", "$geometry2", "$distance" ]
      } ], 
      "centroid" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "point-on-surface" : [ {
        "params" : [ "$geometry" ]
      } ], 
      "x" : [ {
        "params" : [ "$point" ]
      } ], 
      "y" : [ {
        "params" : [ "$point" ]
      } ], 
      "z" : [ {
        "params" : [ "$point" ]
      } ], 
      "m" : [ {
        "params" : [ "$point" ]
      } ], 
      "start-point" : [ {
        "params" : [ "$line" ]
      } ], 
      "end-point" : [ {
        "params" : [ "$line" ]
      } ], 
      "is-closed" : [ {
        "params" : [ "$geom" ]
      } ], 
      "is-ring" : [ {
        "params" : [ "$line" ]
      } ], 
      "num-points" : [ {
        "params" : [ "$line" ]
      } ], 
      "point-n" : [ {
        "params" : [ "$line", "$n" ]
      } ], 
      "exterior-ring" : [ {
        "params" : [ "$polygon" ]
      } ], 
      "num-interior-ring" : [ {
        "params" : [ "$polygon" ]
      } ], 
      "interior-ring-n" : [ {
        "params" : [ "$polygon", "$n" ]
      } ], 
      "num-patches" : [ {
        "params" : [ "$polyhedral-surface" ]
      } ], 
      "patch-n" : [ {
        "params" : [ "$polyhedral-surface", "$n" ]
      } ], 
      "bounding-polygons" : [ {
        "params" : [ "$polyhedral-surface", "$polygon" ]
      } ]
    }
  }, 
  "http://expath.org/ns/http-client" : {
    "functions" : {
      "send-request" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      }, {
        "params" : [ "$request" ]
      }, {
        "params" : [ "$request", "$href" ]
      } ], 
      "tidy-result" : [ {
        "params" : [ "$result", "$override-media-type" ]
      } ]
    }
  }, 
  "http://jsoniq.org/errors" : {
    "functions" : {

    }
  }, 
  "http://jsoniq.org/function-library" : {
    "functions" : {
      "accumulate" : [ {
        "params" : [ "$items" ]
      } ], 
      "descendant-arrays" : [ {
        "params" : [ "$items" ]
      } ], 
      "descendant-arrays-priv" : [ {
        "params" : [ "$i" ]
      } ], 
      "descendant-objects" : [ {
        "params" : [ "$items" ]
      } ], 
      "descendant-objects-priv" : [ {
        "params" : [ "$i" ]
      } ], 
      "descendant-pairs" : [ {
        "params" : [ "$items" ]
      } ], 
      "descendant-pairs-priv" : [ {
        "params" : [ "$i" ]
      } ], 
      "intersect" : [ {
        "params" : [ "$items" ]
      } ], 
      "values" : [ {
        "params" : [ "$items" ]
      } ]
    }
  }, 
  "http://jsoniq.org/functions" : {
    "functions" : {
      "decode-from-roundtrip" : [ {
        "params" : [ "$items" ]
      }, {
        "params" : [ "$items", "$options" ]
      } ], 
      "encode-for-roundtrip" : [ {
        "params" : [ "$items" ]
      }, {
        "params" : [ "$items", "$options" ]
      } ], 
      "parse-json" : [ {
        "params" : [ "$j" ]
      }, {
        "params" : [ "$j", "$o" ]
      } ], 
      "keys" : [ {
        "params" : [ "$o" ]
      } ], 
      "project" : [ {
        "params" : [ "$items", "$keys" ]
      } ], 
      "trim" : [ {
        "params" : [ "$items", "$keys" ]
      } ], 
      "size" : [ {
        "params" : [ "$a" ]
      } ], 
      "members" : [ {
        "params" : [ "$a" ]
      } ], 
      "flatten" : [ {
        "params" : [ "$items" ]
      } ], 
      "null" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://jsound.io/modules/validate" : {
    "functions" : {
      "jsd-valid" : [ {
        "params" : [ "$ns", "$name", "$instance" ]
      }, {
        "params" : [ "$jsd", "$name", "$ns", "$instance" ]
      } ], 
      "check-types" : [ {
        "params" : [ "$jstypes", "$types" ]
      } ], 
      "check-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "check-atomic-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "check-object-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "check-array-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "check-union-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "check-ref-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "save-type" : [ {
        "params" : [ "$jstypes", "$type" ]
      } ], 
      "validate-instance" : [ {
        "params" : [ "$jstypes", "$name", "$instance" ]
      } ], 
      "validate-type" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-type-ref" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-atomic-type" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-enumeration" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-object-type" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-array-type" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "validate-union-type" : [ {
        "params" : [ "$jstypes", "$type", "$instance" ]
      } ], 
      "get-type-name" : [ {
        "params" : [ "$type" ]
      } ], 
      "value-except" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ]
    }
  }, 
  "http://jsound.io/modules/validate/map" : {
    "functions" : {
      "set" : [ {
        "params" : [ "$map", "$key", "$value" ]
      } ], 
      "set-if-empty" : [ {
        "params" : [ "$map", "$key", "$value" ]
      } ], 
      "get" : [ {
        "params" : [ "$map", "$key" ]
      } ], 
      "has-key" : [ {
        "params" : [ "$map", "$key" ]
      } ]
    }
  }, 
  "http://www.functx.com" : {
    "functions" : {
      "add-attributes" : [ {
        "params" : [ "$elements", "$attrNames", "$attrValues" ]
      } ], 
      "add-months" : [ {
        "params" : [ "$date", "$months" ]
      } ], 
      "add-or-update-attributes" : [ {
        "params" : [ "$elements", "$attrNames", "$attrValues" ]
      } ], 
      "all-whitespace" : [ {
        "params" : [ "$arg" ]
      } ], 
      "are-distinct-values" : [ {
        "params" : [ "$seq" ]
      } ], 
      "atomic-type" : [ {
        "params" : [ "$values" ]
      } ], 
      "avg-empty-is-zero" : [ {
        "params" : [ "$values", "$allNodes" ]
      } ], 
      "between-exclusive" : [ {
        "params" : [ "$value", "$minValue", "$maxValue" ]
      } ], 
      "between-inclusive" : [ {
        "params" : [ "$value", "$minValue", "$maxValue" ]
      } ], 
      "camel-case-to-words" : [ {
        "params" : [ "$arg", "$delim" ]
      } ], 
      "capitalize-first" : [ {
        "params" : [ "$arg" ]
      } ], 
      "change-element-names-deep" : [ {
        "params" : [ "$nodes", "$oldNames", "$newNames" ]
      } ], 
      "change-element-ns-deep" : [ {
        "params" : [ "$nodes", "$newns", "$prefix" ]
      } ], 
      "change-element-ns" : [ {
        "params" : [ "$elements", "$newns", "$prefix" ]
      } ], 
      "chars" : [ {
        "params" : [ "$arg" ]
      } ], 
      "contains-any-of" : [ {
        "params" : [ "$arg", "$searchStrings" ]
      } ], 
      "contains-case-insensitive" : [ {
        "params" : [ "$arg", "$substring" ]
      } ], 
      "contains-word" : [ {
        "params" : [ "$arg", "$word" ]
      } ], 
      "copy-attributes" : [ {
        "params" : [ "$copyTo", "$copyFrom" ]
      } ], 
      "date" : [ {
        "params" : [ "$year", "$month", "$day" ]
      } ], 
      "dateTime" : [ {
        "params" : [ "$year", "$month", "$day", "$hour", "$minute", "$second" ]
      } ], 
      "day-in-year" : [ {
        "params" : [ "$date" ]
      } ], 
      "day-of-week-abbrev-en" : [ {
        "params" : [ "$date" ]
      } ], 
      "day-of-week-name-en" : [ {
        "params" : [ "$date" ]
      } ], 
      "day-of-week" : [ {
        "params" : [ "$date" ]
      } ], 
      "dayTimeDuration" : [ {
        "params" : [ "$days", "$hours", "$minutes", "$seconds" ]
      } ], 
      "days-in-month" : [ {
        "params" : [ "$date" ]
      } ], 
      "depth-of-node" : [ {
        "params" : [ "$node" ]
      } ], 
      "distinct-attribute-names" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "distinct-deep" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "distinct-element-names" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "distinct-element-paths" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "distinct-nodes" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "duration-from-timezone" : [ {
        "params" : [ "$timezone" ]
      } ], 
      "dynamic-path" : [ {
        "params" : [ "$parent", "$path" ]
      } ], 
      "escape-for-regex" : [ {
        "params" : [ "$arg" ]
      } ], 
      "exclusive-or" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "first-day-of-month" : [ {
        "params" : [ "$date" ]
      } ], 
      "first-day-of-year" : [ {
        "params" : [ "$date" ]
      } ], 
      "first-node" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "follows-not-descendant" : [ {
        "params" : [ "$a", "$b" ]
      } ], 
      "format-as-title-en" : [ {
        "params" : [ "$titles" ]
      } ], 
      "fragment-from-uri" : [ {
        "params" : [ "$uri" ]
      } ], 
      "get-matches-and-non-matches" : [ {
        "params" : [ "$string", "$regex" ]
      } ], 
      "get-matches" : [ {
        "params" : [ "$string", "$regex" ]
      } ], 
      "has-element-only-content" : [ {
        "params" : [ "$element" ]
      } ], 
      "has-empty-content" : [ {
        "params" : [ "$element" ]
      } ], 
      "has-mixed-content" : [ {
        "params" : [ "$element" ]
      } ], 
      "has-simple-content" : [ {
        "params" : [ "$element" ]
      } ], 
      "id-from-element" : [ {
        "params" : [ "$element" ]
      } ], 
      "id-untyped" : [ {
        "params" : [ "$node", "$id" ]
      } ], 
      "if-absent" : [ {
        "params" : [ "$arg", "$value" ]
      } ], 
      "if-empty" : [ {
        "params" : [ "$arg", "$value" ]
      } ], 
      "index-of-deep-equal-node" : [ {
        "params" : [ "$nodes", "$nodeToFind" ]
      } ], 
      "index-of-match-first" : [ {
        "params" : [ "$arg", "$pattern" ]
      } ], 
      "index-of-node" : [ {
        "params" : [ "$nodes", "$nodeToFind" ]
      } ], 
      "index-of-string-first" : [ {
        "params" : [ "$arg", "$substring" ]
      } ], 
      "index-of-string-last" : [ {
        "params" : [ "$arg", "$substring" ]
      } ], 
      "index-of-string" : [ {
        "params" : [ "$arg", "$substring" ]
      } ], 
      "insert-string" : [ {
        "params" : [ "$originalString", "$stringToInsert", "$pos" ]
      } ], 
      "is-a-number" : [ {
        "params" : [ "$value" ]
      } ], 
      "is-absolute-uri" : [ {
        "params" : [ "$uri" ]
      } ], 
      "is-ancestor" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "is-descendant" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "is-leap-year" : [ {
        "params" : [ "$date" ]
      } ], 
      "is-node-among-descendants-deep-equal" : [ {
        "params" : [ "$node", "$seq" ]
      } ], 
      "is-node-among-descendants" : [ {
        "params" : [ "$node", "$seq" ]
      } ], 
      "is-node-in-sequence-deep-equal" : [ {
        "params" : [ "$node", "$seq" ]
      } ], 
      "is-node-in-sequence" : [ {
        "params" : [ "$node", "$seq" ]
      } ], 
      "is-value-in-sequence" : [ {
        "params" : [ "$value", "$seq" ]
      } ], 
      "last-day-of-month" : [ {
        "params" : [ "$date" ]
      } ], 
      "last-day-of-year" : [ {
        "params" : [ "$date" ]
      } ], 
      "last-node" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "leaf-elements" : [ {
        "params" : [ "$root" ]
      } ], 
      "left-trim" : [ {
        "params" : [ "$arg" ]
      } ], 
      "line-count" : [ {
        "params" : [ "$arg" ]
      } ], 
      "lines" : [ {
        "params" : [ "$arg" ]
      } ], 
      "max-depth" : [ {
        "params" : [ "$root" ]
      } ], 
      "max-determine-type" : [ {
        "params" : [ "$seq" ]
      } ], 
      "max-line-length" : [ {
        "params" : [ "$arg" ]
      } ], 
      "max-node" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "max-string" : [ {
        "params" : [ "$strings" ]
      } ], 
      "min-determine-type" : [ {
        "params" : [ "$seq" ]
      } ], 
      "min-node" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "min-non-empty-string" : [ {
        "params" : [ "$strings" ]
      } ], 
      "min-string" : [ {
        "params" : [ "$strings" ]
      } ], 
      "mmddyyyy-to-date" : [ {
        "params" : [ "$dateString" ]
      } ], 
      "month-abbrev-en" : [ {
        "params" : [ "$date" ]
      } ], 
      "month-name-en" : [ {
        "params" : [ "$date" ]
      } ], 
      "name-test" : [ {
        "params" : [ "$testname", "$names" ]
      } ], 
      "namespaces-in-use" : [ {
        "params" : [ "$root" ]
      } ], 
      "next-day" : [ {
        "params" : [ "$date" ]
      } ], 
      "node-kind" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "non-distinct-values" : [ {
        "params" : [ "$seq" ]
      } ], 
      "number-of-matches" : [ {
        "params" : [ "$arg", "$pattern" ]
      } ], 
      "open-ref-document" : [ {
        "params" : [ "$refNode" ]
      } ], 
      "ordinal-number-en" : [ {
        "params" : [ "$num" ]
      } ], 
      "pad-integer-to-length" : [ {
        "params" : [ "$integerToPad", "$length" ]
      } ], 
      "pad-string-to-length" : [ {
        "params" : [ "$stringToPad", "$padChar", "$length" ]
      } ], 
      "path-to-node-with-pos" : [ {
        "params" : [ "$node" ]
      } ], 
      "path-to-node" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "precedes-not-ancestor" : [ {
        "params" : [ "$a", "$b" ]
      } ], 
      "previous-day" : [ {
        "params" : [ "$date" ]
      } ], 
      "remove-attributes-deep" : [ {
        "params" : [ "$nodes", "$names" ]
      } ], 
      "remove-attributes" : [ {
        "params" : [ "$elements", "$names" ]
      } ], 
      "remove-elements-deep" : [ {
        "params" : [ "$nodes", "$names" ]
      } ], 
      "remove-elements-not-contents" : [ {
        "params" : [ "$nodes", "$names" ]
      } ], 
      "remove-elements" : [ {
        "params" : [ "$elements", "$names" ]
      } ], 
      "repeat-string" : [ {
        "params" : [ "$stringToRepeat", "$count" ]
      } ], 
      "replace-beginning" : [ {
        "params" : [ "$arg", "$pattern", "$replacement" ]
      } ], 
      "replace-element-values" : [ {
        "params" : [ "$elements", "$values" ]
      } ], 
      "replace-first" : [ {
        "params" : [ "$arg", "$pattern", "$replacement" ]
      } ], 
      "replace-multi" : [ {
        "params" : [ "$arg", "$changeFrom", "$changeTo" ]
      } ], 
      "reverse-string" : [ {
        "params" : [ "$arg" ]
      } ], 
      "right-trim" : [ {
        "params" : [ "$arg" ]
      } ], 
      "scheme-from-uri" : [ {
        "params" : [ "$uri" ]
      } ], 
      "sequence-deep-equal" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ], 
      "sequence-node-equal-any-order" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ], 
      "sequence-node-equal" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ], 
      "sequence-type" : [ {
        "params" : [ "$items" ]
      } ], 
      "siblings-same-name" : [ {
        "params" : [ "$element" ]
      } ], 
      "siblings" : [ {
        "params" : [ "$node" ]
      } ], 
      "sort-as-numeric" : [ {
        "params" : [ "$seq" ]
      } ], 
      "sort-case-insensitive" : [ {
        "params" : [ "$seq" ]
      } ], 
      "sort-document-order" : [ {
        "params" : [ "$seq" ]
      } ], 
      "sort" : [ {
        "params" : [ "$seq" ]
      } ], 
      "substring-after-if-contains" : [ {
        "params" : [ "$arg", "$delim" ]
      } ], 
      "substring-after-last-match" : [ {
        "params" : [ "$arg", "$regex" ]
      } ], 
      "substring-after-last" : [ {
        "params" : [ "$arg", "$delim" ]
      } ], 
      "substring-after-match" : [ {
        "params" : [ "$arg", "$regex" ]
      } ], 
      "substring-before-if-contains" : [ {
        "params" : [ "$arg", "$delim" ]
      } ], 
      "substring-before-last-match" : [ {
        "params" : [ "$arg", "$regex" ]
      } ], 
      "substring-before-last" : [ {
        "params" : [ "$arg", "$delim" ]
      } ], 
      "substring-before-match" : [ {
        "params" : [ "$arg", "$regex" ]
      } ], 
      "time" : [ {
        "params" : [ "$hour", "$minute", "$second" ]
      } ], 
      "timezone-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-days-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-hours-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-minutes-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-months-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-seconds-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "total-years-from-duration" : [ {
        "params" : [ "$duration" ]
      } ], 
      "trim" : [ {
        "params" : [ "$arg" ]
      } ], 
      "update-attributes" : [ {
        "params" : [ "$elements", "$attrNames", "$attrValues" ]
      } ], 
      "value-except" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "value-intersect" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "value-union" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "word-count" : [ {
        "params" : [ "$arg" ]
      } ], 
      "words-to-camel-case" : [ {
        "params" : [ "$arg" ]
      } ], 
      "wrap-values-in-elements" : [ {
        "params" : [ "$values", "$elementName" ]
      } ], 
      "yearMonthDuration" : [ {
        "params" : [ "$years", "$months" ]
      } ]
    }
  }, 
  "http://www.w3.org/2005/xpath-functions" : {
    "functions" : {
      "QName" : [ {
        "params" : [ "$paramURI", "$paramQName" ]
      } ], 
      "abs" : [ {
        "params" : [ "$arg" ]
      } ], 
      "adjust-date-to-timezone" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$timezone" ]
      } ], 
      "adjust-dateTime-to-timezone" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$timezone" ]
      } ], 
      "adjust-time-to-timezone" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$timezone" ]
      } ], 
      "analyze-string" : [ {
        "params" : [ "$input", "$pattern" ]
      }, {
        "params" : [ "$input", "$pattern", "$flags" ]
      } ], 
      "available-environment-variables" : [ {
        "params" : [  ]
      }, {
        "params" : [  ]
      } ], 
      "avg" : [ {
        "params" : [ "$arg" ]
      } ], 
      "boolean" : [ {
        "params" : [ "$arg" ]
      } ], 
      "ceiling" : [ {
        "params" : [ "$arg" ]
      } ], 
      "codepoint-equal" : [ {
        "params" : [ "$comparand1", "$comparand2" ]
      } ], 
      "codepoints-to-string" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "collection" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "compare" : [ {
        "params" : [ "$comparand1", "$comparand2" ]
      }, {
        "params" : [ "$comparand1", "$comparand2", "$collation" ]
      } ], 
      "concat" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "contains" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$arg1", "$arg2", "$collation" ]
      } ], 
      "count" : [ {
        "params" : [ "$arg" ]
      } ], 
      "dateTime" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "day-from-date" : [ {
        "params" : [ "$arg" ]
      } ], 
      "days-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "deep-equal" : [ {
        "params" : [ "$parameter1", "$parameter2" ]
      }, {
        "params" : [ "$parameter1", "$parameter2", "$collation" ]
      } ], 
      "distinct-values" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$collation" ]
      } ], 
      "doc" : [ {
        "params" : [ "$uri" ]
      } ], 
      "doc-available" : [ {
        "params" : [ "$uri" ]
      } ], 
      "element-with-id" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$node" ]
      } ], 
      "empty" : [ {
        "params" : [ "$arg" ]
      } ], 
      "ends-with" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$arg1", "$arg2", "$collation" ]
      } ], 
      "environment-variable" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "error" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$code" ]
      }, {
        "params" : [ "$code", "$description" ]
      }, {
        "params" : [ "$code", "$description", "$error-object" ]
      } ], 
      "exactly-one" : [ {
        "params" : [ "$arg" ]
      } ], 
      "exists" : [ {
        "params" : [ "$arg" ]
      } ], 
      "false" : [ {
        "params" : [  ]
      } ], 
      "filter" : [ {
        "params" : [ "$seq", "$f" ]
      } ], 
      "floor" : [ {
        "params" : [ "$arg" ]
      } ], 
      "fold-left" : [ {
        "params" : [ "$seq", "$zero", "$f" ]
      } ], 
      "fold-right" : [ {
        "params" : [ "$seq", "$zero", "$f" ]
      } ], 
      "format-date" : [ {
        "params" : [ "$value", "$picture", "$language", "$calendar", "$place" ]
      }, {
        "params" : [ "$value", "$picture" ]
      } ], 
      "format-dateTime" : [ {
        "params" : [ "$value", "$picture", "$language", "$calendar", "$place" ]
      }, {
        "params" : [ "$value", "$picture" ]
      } ], 
      "format-integer" : [ {
        "params" : [ "$value", "$picture" ]
      }, {
        "params" : [ "$value", "$picture", "$language" ]
      } ], 
      "format-number" : [ {
        "params" : [ "$value", "$picture" ]
      }, {
        "params" : [ "$value", "$picture", "$decimal-format-name" ]
      } ], 
      "format-time" : [ {
        "params" : [ "$value", "$picture", "$language", "$calendar", "$place" ]
      }, {
        "params" : [ "$value", "$picture" ]
      } ], 
      "function-arity" : [ {
        "params" : [ "$func" ]
      } ], 
      "generate-id" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "head" : [ {
        "params" : [ "$arg" ]
      } ], 
      "hours-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "hours-from-time" : [ {
        "params" : [ "$arg" ]
      } ], 
      "id" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$node" ]
      } ], 
      "idref" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$node" ]
      } ], 
      "in-scope-prefixes" : [ {
        "params" : [ "$element" ]
      } ], 
      "index-of" : [ {
        "params" : [ "$seq", "$search" ]
      }, {
        "params" : [ "$seq", "$search", "$collation" ]
      } ], 
      "insert-before" : [ {
        "params" : [ "$target", "$position", "$inserts" ]
      } ], 
      "local-name-from-QName" : [ {
        "params" : [ "$arg" ]
      } ], 
      "lower-case" : [ {
        "params" : [ "$arg" ]
      } ], 
      "for-each" : [ {
        "params" : [ "$seq", "$f" ]
      } ], 
      "for-each-pair" : [ {
        "params" : [ "$seq1", "$seq2", "$f" ]
      } ], 
      "matches" : [ {
        "params" : [ "$input", "$pattern" ]
      }, {
        "params" : [ "$input", "$pattern", "$flags" ]
      } ], 
      "max" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$collation" ]
      } ], 
      "min" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$collation" ]
      } ], 
      "minutes-from-dateTime" : [ {
        "params" : [ "$arg" ]
      } ], 
      "minutes-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "minutes-from-time" : [ {
        "params" : [ "$arg" ]
      } ], 
      "month-from-date" : [ {
        "params" : [ "$arg" ]
      } ], 
      "months-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "namespace-uri-for-prefix" : [ {
        "params" : [ "$prefix", "$element" ]
      } ], 
      "namespace-uri-from-QName" : [ {
        "params" : [ "$arg" ]
      } ], 
      "normalize-space" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "normalize-unicode" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$normalizationForm" ]
      } ], 
      "not" : [ {
        "params" : [ "$arg" ]
      } ], 
      "one-or-more" : [ {
        "params" : [ "$arg" ]
      } ], 
      "parse-xml" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$baseURI" ]
      } ], 
      "parse-xml-fragment" : [ {
        "params" : [ "$arg" ]
      } ], 
      "prefix-from-QName" : [ {
        "params" : [ "$arg" ]
      } ], 
      "remove" : [ {
        "params" : [ "$target", "$position" ]
      } ], 
      "replace" : [ {
        "params" : [ "$input", "$pattern", "$replacement" ]
      }, {
        "params" : [ "$input", "$pattern", "$replacement", "$flags" ]
      } ], 
      "resolve-QName" : [ {
        "params" : [ "$qname", "$element" ]
      } ], 
      "reverse" : [ {
        "params" : [ "$arg" ]
      } ], 
      "round" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$precision" ]
      } ], 
      "round-half-to-even" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$precision" ]
      } ], 
      "seconds-from-dateTime" : [ {
        "params" : [ "$arg" ]
      } ], 
      "seconds-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "seconds-from-time" : [ {
        "params" : [ "$arg" ]
      } ], 
      "serialize" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$params" ]
      } ], 
      "starts-with" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$arg1", "$arg2", "$collation" ]
      } ], 
      "string-join" : [ {
        "params" : [ "$arg1" ]
      }, {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "string-length" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "string-to-codepoints" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "subsequence" : [ {
        "params" : [ "$sourceSeq", "$startingLoc" ]
      }, {
        "params" : [ "$sourceSeq", "$startingLoc", "$length" ]
      } ], 
      "substring" : [ {
        "params" : [ "$sourceString", "$start" ]
      }, {
        "params" : [ "$sourceString", "$start", "$length" ]
      } ], 
      "substring-after" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$arg1", "$arg2", "$collation" ]
      } ], 
      "substring-before" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$arg1", "$arg2", "$collation" ]
      } ], 
      "sum" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$zero" ]
      } ], 
      "tail" : [ {
        "params" : [ "$arg" ]
      } ], 
      "timezone-from-date" : [ {
        "params" : [ "$arg" ]
      } ], 
      "timezone-from-dateTime" : [ {
        "params" : [ "$arg" ]
      } ], 
      "timezone-from-time" : [ {
        "params" : [ "$arg" ]
      } ], 
      "tokenize" : [ {
        "params" : [ "$input", "$pattern" ]
      }, {
        "params" : [ "$input", "$pattern", "$flags" ]
      } ], 
      "trace" : [ {
        "params" : [ "$value", "$label" ]
      } ], 
      "translate" : [ {
        "params" : [ "$arg", "$mapString", "$transString" ]
      } ], 
      "true" : [ {
        "params" : [  ]
      } ], 
      "unordered" : [ {
        "params" : [ "$sourceSeq" ]
      } ], 
      "unparsed-text" : [ {
        "params" : [ "$href" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      }, {
        "params" : [ "$href" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      } ], 
      "unparsed-text-available" : [ {
        "params" : [ "$href" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      }, {
        "params" : [ "$href" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      } ], 
      "unparsed-text-lines" : [ {
        "params" : [ "$href" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      }, {
        "params" : [ "$href", "$encoding" ]
      } ], 
      "upper-case" : [ {
        "params" : [ "$arg" ]
      } ], 
      "uri-collection" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      }, {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "year-from-date" : [ {
        "params" : [ "$arg" ]
      } ], 
      "years-from-duration" : [ {
        "params" : [ "$arg" ]
      } ], 
      "zero-or-one" : [ {
        "params" : [ "$arg" ]
      } ], 
      "base-uri" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "current-date" : [ {
        "params" : [  ]
      } ], 
      "current-dateTime" : [ {
        "params" : [  ]
      } ], 
      "current-time" : [ {
        "params" : [  ]
      } ], 
      "data" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "default-collation" : [ {
        "params" : [  ]
      } ], 
      "document-uri" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "encode-for-uri" : [ {
        "params" : [ "$uri-part" ]
      } ], 
      "escape-html-uri" : [ {
        "params" : [ "$uri" ]
      } ], 
      "has-children" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$node" ]
      } ], 
      "implicit-timezone" : [ {
        "params" : [  ]
      } ], 
      "innermost" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "iri-to-uri" : [ {
        "params" : [ "$iri" ]
      } ], 
      "lang" : [ {
        "params" : [ "$testlang" ]
      }, {
        "params" : [ "$testlang", "$node" ]
      } ], 
      "last" : [ {
        "params" : [  ]
      } ], 
      "local-name" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "name" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "namespace-uri" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "nilled" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "node-name" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "number" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "outermost" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "position" : [ {
        "params" : [  ]
      } ], 
      "resolve-uri" : [ {
        "params" : [ "$relative" ]
      }, {
        "params" : [ "$relative", "$base" ]
      } ], 
      "root" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ], 
      "static-base-uri" : [ {
        "params" : [  ]
      } ], 
      "string" : [ {
        "params" : [  ]
      }, {
        "params" : [ "$arg" ]
      } ]
    }
  }, 
  "http://www.w3.org/2005/xpath-functions/math" : {
    "functions" : {
      "pi" : [ {
        "params" : [  ]
      } ], 
      "exp" : [ {
        "params" : [ "$arg" ]
      } ], 
      "exp10" : [ {
        "params" : [ "$arg" ]
      } ], 
      "log" : [ {
        "params" : [ "$arg" ]
      } ], 
      "log10" : [ {
        "params" : [ "$arg" ]
      } ], 
      "pow" : [ {
        "params" : [ "$x", "$y" ]
      } ], 
      "sqrt" : [ {
        "params" : [ "$arg" ]
      } ], 
      "sin" : [ {
        "params" : [ "$theta" ]
      } ], 
      "cos" : [ {
        "params" : [ "$theta" ]
      } ], 
      "tan" : [ {
        "params" : [ "$theta" ]
      } ], 
      "asin" : [ {
        "params" : [ "$arg" ]
      } ], 
      "acos" : [ {
        "params" : [ "$arg" ]
      } ], 
      "atan" : [ {
        "params" : [ "$arg" ]
      } ], 
      "atan2" : [ {
        "params" : [ "$y", "$x" ]
      } ]
    }
  }, 
  "http://www.w3.org/2005/xqt-errors" : {
    "functions" : {

    }
  }, 
  "http://www.zorba-xquery.com/modules/converters/html" : {
    "functions" : {
      "parse" : [ {
        "params" : [ "$html" ]
      }, {
        "params" : [ "$html", "$options" ]
      } ], 
      "parse-internal" : [ {
        "params" : [ "$html", "$options" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/email/imap" : {
    "functions" : {
      "status" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "status-impl" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "create" : [ {
        "params" : [ "$host-info", "$mailbox-name" ]
      } ], 
      "create-impl" : [ {
        "params" : [ "$host-info", "$mailbox-name" ]
      } ], 
      "delete" : [ {
        "params" : [ "$host-info", "$mailbox-name" ]
      } ], 
      "delete-impl" : [ {
        "params" : [ "$host-info", "$mailbox-name" ]
      } ], 
      "rename" : [ {
        "params" : [ "$host-info", "$mailbox-old", "$mailbox-new" ]
      } ], 
      "rename-impl" : [ {
        "params" : [ "$host-info", "$mailbox-old", "$mailbox-new" ]
      } ], 
      "list" : [ {
        "params" : [ "$host-info", "$mailbox-ref", "$pattern", "$only-subscribed" ]
      } ], 
      "list-impl" : [ {
        "params" : [ "$host-info", "$mailbox-ref", "$pattern", "$only-subscribed" ]
      } ], 
      "subscribe" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "subscribe-impl" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "unsubscribe" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "unsubscribe-impl" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "expunge" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "expunge-impl" : [ {
        "params" : [ "$host-info", "$mailbox" ]
      } ], 
      "search" : [ {
        "params" : [ "$host-info", "$mailbox", "$criteria", "$uid" ]
      } ], 
      "search-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$criteria", "$uid" ]
      } ], 
      "copy" : [ {
        "params" : [ "$host-info", "$mailbox-from", "$mailbox-to", "$messages", "$uid" ]
      } ], 
      "copy-impl" : [ {
        "params" : [ "$host-info", "$mailbox-from", "$mailbox-to", "$messages", "$uid", "$copy" ]
      } ], 
      "move" : [ {
        "params" : [ "$host-info", "$mailbox-from", "$mailbox-to", "$messages", "$uid" ]
      } ], 
      "fetch-envelope" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "fetch-envelope-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "fetch-message" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "fetch-message-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "fetch-subject" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-subject-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-from" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-from-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-uid" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-uid-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-message-sequence-number" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-message-sequence-number-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number" ]
      } ], 
      "fetch-flags" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "fetch-flags-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$uid" ]
      } ], 
      "set-flags" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$flags", "$uid" ]
      } ], 
      "set-flags-impl" : [ {
        "params" : [ "$host-info", "$mailbox", "$message-number", "$flags", "$uid" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/email/smtp" : {
    "functions" : {
      "send" : [ {
        "params" : [ "$host-info", "$message" ]
      } ], 
      "send-impl" : [ {
        "params" : [ "$host-info", "$message" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/http-client" : {
    "functions" : {
      "send-request" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      } ], 
      "get" : [ {
        "params" : [ "$href" ]
      } ], 
      "get-node" : [ {
        "params" : [ "$href" ]
      } ], 
      "get-text" : [ {
        "params" : [ "$href" ]
      } ], 
      "get-binary" : [ {
        "params" : [ "$href" ]
      } ], 
      "head" : [ {
        "params" : [ "$href" ]
      } ], 
      "options" : [ {
        "params" : [ "$href" ]
      } ], 
      "put" : [ {
        "params" : [ "$href", "$body" ]
      }, {
        "params" : [ "$href", "$body", "$content-type" ]
      } ], 
      "delete" : [ {
        "params" : [ "$href" ]
      } ], 
      "post" : [ {
        "params" : [ "$href", "$body" ]
      }, {
        "params" : [ "$href", "$body", "$content-type" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/image/graphviz" : {
    "functions" : {
      "dot" : [ {
        "params" : [ "$dot", "$params" ]
      } ], 
      "gxl" : [ {
        "params" : [ "$gxl", "$params" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/languages/xslt" : {
    "functions" : {
      "transform" : [ {
        "params" : [ "$source", "$stylesheet" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/oauth/client" : {
    "functions" : {
      "service-provider" : [ {
        "params" : [ "$consumer-key", "$consumer-secret", "$signature-method", "$realm", "$authorize-url", "$request-token-method", "$request-token-url", "$request-token-callback-url", "$access-token-method", "$access-token-url" ]
      } ], 
      "parameters" : [ {
        "params" : [ "$name", "$value" ]
      } ], 
      "add-parameter" : [ {
        "params" : [ "$parameters", "$name", "$value" ]
      } ], 
      "parameter" : [ {
        "params" : [ "$params", "$string" ]
      } ], 
      "request-token" : [ {
        "params" : [ "$service-provider" ]
      }, {
        "params" : [ "$service-provider", "$parameters" ]
      }, {
        "params" : [ "$consumer-key", "$consumer-secret", "$signature-method", "$method", "$realm", "$temporary-credential-request", "$callback-url", "$additional-parameters" ]
      } ], 
      "access-token" : [ {
        "params" : [ "$service-provider", "$parameters" ]
      }, {
        "params" : [ "$consumer-key", "$consumer-secret", "$signature-method", "$realm", "$oauth-token", "$oauth-token-secret", "$method", "$token-request-uri", "$additional-parameters" ]
      } ], 
      "protected-resource" : [ {
        "params" : [ "$protected-resource", "$service-provider", "$parameters" ]
      }, {
        "params" : [ "$consumer-key", "$consumer-secret", "$signature-method", "$oauth-token", "$oauth-token-secret", "$realm", "$protected-resource", "$additional-parameters" ]
      } ], 
      "timestamp" : [ {
        "params" : [  ]
      } ], 
      "key" : [ {
        "params" : [ "$oauth-consumer-secret", "$oauth-token-secret" ]
      } ], 
      "nonce" : [ {
        "params" : [  ]
      } ], 
      "normalization" : [ {
        "params" : [ "$params", "$divide", "$option", "$comma" ]
      } ], 
      "authorization-header" : [ {
        "params" : [ "$params", "$realm", "$signature" ]
      } ], 
      "signature-base-string" : [ {
        "params" : [ "$http-method", "$base-uri", "$params" ]
      } ], 
      "signature" : [ {
        "params" : [ "$base-string", "$oauth-signature-method", "$key" ]
      } ], 
      "parse-parameters" : [ {
        "params" : [ "$input" ]
      } ], 
      "http-request" : [ {
        "params" : [ "$consumer-secret", "$protected-resource", "$oauth-token-secret", "$params", "$realm", "$signature-method" ]
      } ], 
      "format-request" : [ {
        "params" : [ "$consumer-key", "$consumer-secret", "$protected-resource", "$oauth-token", "$oauth-token-secret", "$realm", "$signature-method", "$additional-parameters", "$format-params" ]
      }, {
        "params" : [ "$consumer-key", "$consumer-secret", "$protected-resource", "$oauth-token", "$oauth-token-secret", "$realm", "$signature-method", "$additional-parameters" ]
      } ], 
      "additional-parameters" : [ {
        "params" : [ "$parameters" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/oauth/error" : {
    "functions" : {

    }
  }, 
  "http://www.zorba-xquery.com/modules/process" : {
    "functions" : {
      "exec" : [ {
        "params" : [ "$cmd" ]
      }, {
        "params" : [ "$cmd", "$args" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/read-pdf" : {
    "functions" : {
      "extract-text" : [ {
        "params" : [ "$pdf", "$options" ]
      } ], 
      "extract-text-internal" : [ {
        "params" : [ "$pdf", "$options" ]
      } ], 
      "render-to-images" : [ {
        "params" : [ "$pdf", "$options" ]
      } ], 
      "render-to-images-internal" : [ {
        "params" : [ "$pdf", "$options" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/schema-tools" : {
    "functions" : {
      "inst2xsd" : [ {
        "params" : [ "$instances", "$options" ]
      } ], 
      "inst2xsd-internal" : [ {
        "params" : [ "$instances", "$options" ]
      } ], 
      "xsd2inst" : [ {
        "params" : [ "$schemas", "$rootElementName", "$options" ]
      } ], 
      "xsd2inst-internal" : [ {
        "params" : [ "$schemas", "$rootElementName", "$options" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/util-jvm" : {
    "functions" : {

    }
  }, 
  "http://www.zorba-xquery.com/modules/xqdoc/batch" : {
    "functions" : {
      "build-xqdoc" : [ {
        "params" : [ "$output-folder", "$static-folders", "$template", "$modules" ]
      } ], 
      "create-xml-folder" : [ {
        "params" : [ "$folder" ]
      } ], 
      "save-xml" : [ {
        "params" : [ "$output-file", "$page" ]
      } ], 
      "page" : [ {
        "params" : [ "$template", "$menu", "$section" ]
      } ], 
      "create-page" : [ {
        "params" : [ "$output-folder", "$page-name", "$page" ]
      } ], 
      "copy-static-folders" : [ {
        "params" : [ "$output-folder", "$static-folders" ]
      } ], 
      "section" : [ {
        "params" : [ "$sections" ]
      }, {
        "params" : [ "$sections", "$level" ]
      } ], 
      "xqdoc" : [ {
        "params" : [ "$module" ]
      } ], 
      "add-predeclared-namespaces" : [ {
        "params" : [ "$xqdoc", "$namespaces" ]
      } ], 
      "add-trailing-slash" : [ {
        "params" : [ "$path" ]
      } ], 
      "process-variable" : [ {
        "params" : [ "$source", "$varname", "$value" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/xqdoc/html" : {
    "functions" : {
      "convert" : [ {
        "params" : [ "$xqdoc" ]
      } ], 
      "normalize-pre" : [ {
        "params" : [ "$pre" ]
      } ], 
      "normalize" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "text" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "description-summary" : [ {
        "params" : [ "$description" ]
      } ], 
      "serialize-params" : [ {
        "params" : [ "$params" ]
      } ], 
      "serialize-annotations" : [ {
        "params" : [ "$annotations" ]
      } ], 
      "function-properties" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-updating" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-private" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-nondeterministic" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-streamable" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-variadic" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-sequential" : [ {
        "params" : [ "$function" ]
      } ], 
      "is-function-external" : [ {
        "params" : [ "$function" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/xqdoc/menu" : {
    "functions" : {
      "categories-as-js" : [ {
        "params" : [ "$url-prefix", "$cats" ]
      } ], 
      "categories" : [ {
        "params" : [ "$top" ]
      } ], 
      "item" : [ {
        "params" : [ "$ctx", "$path" ]
      } ], 
      "item-uri" : [ {
        "params" : [ "$item" ]
      }, {
        "params" : [ "$item", "$result" ]
      } ], 
      "closed-tabs" : [ {
        "params" : [ "$item", "$url-prefix" ]
      }, {
        "params" : [ "$item", "$result", "$url-prefix" ]
      } ], 
      "menu" : [ {
        "params" : [ "$item", "$url-prefix" ]
      } ]
    }
  }, 
  "http://zorba.io/errors" : {
    "functions" : {

    }
  }, 
  "http://zorba.io/modules/archive" : {
    "functions" : {
      "create" : [ {
        "params" : [ "$entries", "$contents" ]
      }, {
        "params" : [ "$entries", "$contents", "$options" ]
      } ], 
      "entries" : [ {
        "params" : [ "$archive" ]
      } ], 
      "extract-text" : [ {
        "params" : [ "$archive" ]
      }, {
        "params" : [ "$archive", "$entry-names" ]
      }, {
        "params" : [ "$archive", "$entry-names", "$encoding" ]
      } ], 
      "extract-binary" : [ {
        "params" : [ "$archive" ]
      }, {
        "params" : [ "$archive", "$entry-names" ]
      } ], 
      "update" : [ {
        "params" : [ "$archive", "$entries", "$contents" ]
      } ], 
      "delete" : [ {
        "params" : [ "$archive", "$entry-names" ]
      } ], 
      "options" : [ {
        "params" : [ "$archive" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/base64" : {
    "functions" : {
      "decode" : [ {
        "params" : [ "$base64" ]
      }, {
        "params" : [ "$base64", "$encoding" ]
      } ], 
      "encode" : [ {
        "params" : [ "$string" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/couchbase" : {
    "functions" : {
      "connect" : [ {
        "params" : [ "$host", "$username", "$password", "$bucket" ]
      }, {
        "params" : [ "$options" ]
      } ], 
      "get-text" : [ {
        "params" : [ "$db", "$key" ]
      }, {
        "params" : [ "$db", "$key", "$options" ]
      } ], 
      "get-binary" : [ {
        "params" : [ "$db", "$key" ]
      }, {
        "params" : [ "$db", "$key", "$options" ]
      } ], 
      "remove" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "put-text" : [ {
        "params" : [ "$db", "$key", "$value" ]
      }, {
        "params" : [ "$db", "$key", "$value", "$options" ]
      } ], 
      "put-binary" : [ {
        "params" : [ "$db", "$key", "$value" ]
      }, {
        "params" : [ "$db", "$key", "$value", "$options" ]
      } ], 
      "flush" : [ {
        "params" : [ "$db" ]
      } ], 
      "touch" : [ {
        "params" : [ "$db", "$key", "$exp-time" ]
      } ], 
      "view" : [ {
        "params" : [ "$db", "$path" ]
      }, {
        "params" : [ "$db", "$path", "$options" ]
      } ], 
      "view-text" : [ {
        "params" : [ "$db", "$path" ]
      }, {
        "params" : [ "$db", "$path", "$options" ]
      } ], 
      "create-view" : [ {
        "params" : [ "$db", "$doc-name", "$view-names" ]
      }, {
        "params" : [ "$db", "$doc-name", "$view-names", "$options" ]
      } ], 
      "delete-view" : [ {
        "params" : [ "$db", "$doc" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/csv" : {
    "functions" : {
      "parse" : [ {
        "params" : [ "$csv", "$options" ]
      } ], 
      "parse-internal" : [ {
        "params" : [ "$csv", "$options" ]
      } ], 
      "serialize" : [ {
        "params" : [ "$xml", "$options" ]
      } ], 
      "serialize-internal" : [ {
        "params" : [ "$xml", "$options" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/character-based-string-similarity" : {
    "functions" : {
      "edit-distance" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "jaro" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "jaro-winkler" : [ {
        "params" : [ "$s1", "$s2", "$prefix", "$fact" ]
      } ], 
      "needleman-wunsch" : [ {
        "params" : [ "$s1", "$s2", "$score", "$penalty" ]
      } ], 
      "smith-waterman" : [ {
        "params" : [ "$s1", "$s2", "$score", "$penalty" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/consolidation" : {
    "functions" : {
      "most-frequent" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-frequent" : [ {
        "params" : [ "$s" ]
      } ], 
      "longest" : [ {
        "params" : [ "$s" ]
      } ], 
      "shortest" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-tokens" : [ {
        "params" : [ "$s", "$r" ]
      } ], 
      "least-tokens" : [ {
        "params" : [ "$s", "$r" ]
      } ], 
      "matching" : [ {
        "params" : [ "$s", "$r" ]
      } ], 
      "superstring" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-similar-edit-distance" : [ {
        "params" : [ "$s", "$m" ]
      } ], 
      "least-similar-edit-distance" : [ {
        "params" : [ "$s", "$m" ]
      } ], 
      "most-elements" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-attributes" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-nodes" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-elements" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-attributes" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-nodes" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-distinct-elements" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-distinct-attributes" : [ {
        "params" : [ "$s" ]
      } ], 
      "most-distinct-nodes" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-distinct-elements" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-distinct-attributes" : [ {
        "params" : [ "$s" ]
      } ], 
      "least-distinct-nodes" : [ {
        "params" : [ "$s" ]
      } ], 
      "all-xpaths" : [ {
        "params" : [ "$s", "$paths" ]
      } ], 
      "some-xpaths" : [ {
        "params" : [ "$s", "$paths" ]
      } ], 
      "most-xpaths" : [ {
        "params" : [ "$s", "$paths" ]
      } ], 
      "least-xpaths" : [ {
        "params" : [ "$s", "$paths" ]
      } ], 
      "validating-schema" : [ {
        "params" : [ "$s", "$schema" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/conversion" : {
    "functions" : {
      "phone-from-user" : [ {
        "params" : [ "$name" ]
      } ], 
      "address-from-user" : [ {
        "params" : [ "$name" ]
      } ], 
      "user-from-phone" : [ {
        "params" : [ "$phone-number" ]
      } ], 
      "address-from-phone" : [ {
        "params" : [ "$phone-number" ]
      } ], 
      "user-from-address" : [ {
        "params" : [ "$address" ]
      } ], 
      "phone-from-address" : [ {
        "params" : [ "$address" ]
      } ], 
      "unit-convert" : [ {
        "params" : [ "$v", "$t", "$m1", "$m2" ]
      } ], 
      "geocode-from-address" : [ {
        "params" : [ "$q" ]
      } ], 
      "address-from-geocode" : [ {
        "params" : [ "$lat", "$lon" ]
      } ], 
      "currency-convert" : [ {
        "params" : [ "$v", "$m1", "$m2", "$date" ]
      } ], 
      "phone-from-domain" : [ {
        "params" : [ "$domain" ]
      } ], 
      "address-from-domain" : [ {
        "params" : [ "$domain" ]
      } ], 
      "name-from-domain" : [ {
        "params" : [ "$domain" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/hybrid-string-similarity" : {
    "functions" : {
      "soft-cosine-tokens-soundex" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ], 
      "soft-cosine-tokens-metaphone" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ], 
      "soft-cosine-tokens-edit-distance" : [ {
        "params" : [ "$s1", "$s2", "$r", "$t" ]
      } ], 
      "soft-cosine-tokens-jaro" : [ {
        "params" : [ "$s1", "$s2", "$r", "$t" ]
      } ], 
      "soft-cosine-tokens-jaro-winkler" : [ {
        "params" : [ "$s1", "$s2", "$r", "$t", "$prefix", "$fact" ]
      } ], 
      "monge-elkan-jaro-winkler" : [ {
        "params" : [ "$s1", "$s2", "$prefix", "$fact" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/normalization" : {
    "functions" : {
      "to-date" : [ {
        "params" : [ "$sd", "$format" ]
      } ], 
      "to-time" : [ {
        "params" : [ "$sd", "$format" ]
      } ], 
      "to-dateTime" : [ {
        "params" : [ "$sd", "$format" ]
      } ], 
      "normalize-address" : [ {
        "params" : [ "$addr" ]
      } ], 
      "normalize-phone" : [ {
        "params" : [ "$addr" ]
      } ], 
      "timeZone-dictionary" : [ {
        "params" : [  ]
      } ], 
      "month-dictionary" : [ {
        "params" : [  ]
      } ], 
      "check-dateTime" : [ {
        "params" : [ "$dateTime" ]
      } ], 
      "check-date" : [ {
        "params" : [ "$date" ]
      } ], 
      "check-time" : [ {
        "params" : [ "$Time" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/phonetic-string-similarity" : {
    "functions" : {
      "soundex-key" : [ {
        "params" : [ "$s1" ]
      } ], 
      "soundex" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "metaphone-key" : [ {
        "params" : [ "$s1" ]
      } ], 
      "metaphone" : [ {
        "params" : [ "$s1", "$s2" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/set-similarity" : {
    "functions" : {
      "deep-union" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "deep-intersect" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "distinct" : [ {
        "params" : [ "$s" ]
      } ], 
      "overlap" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "dice" : [ {
        "params" : [ "$s1", "$s2" ]
      } ], 
      "jaccard" : [ {
        "params" : [ "$s1", "$s2" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/data-cleaning/token-based-string-similarity" : {
    "functions" : {
      "ngrams" : [ {
        "params" : [ "$s", "$n" ]
      } ], 
      "cosine" : [ {
        "params" : [ "$desc1", "$desc2" ]
      } ], 
      "dice-ngrams" : [ {
        "params" : [ "$s1", "$s2", "$n" ]
      } ], 
      "overlap-ngrams" : [ {
        "params" : [ "$s1", "$s2", "$n" ]
      } ], 
      "jaccard-ngrams" : [ {
        "params" : [ "$s1", "$s2", "$n" ]
      } ], 
      "cosine-ngrams" : [ {
        "params" : [ "$s1", "$s2", "$n" ]
      } ], 
      "dice-tokens" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ], 
      "overlap-tokens" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ], 
      "jaccard-tokens" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ], 
      "cosine-tokens" : [ {
        "params" : [ "$s1", "$s2", "$r" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/datetime" : {
    "functions" : {
      "current-date" : [ {
        "params" : [  ]
      } ], 
      "current-dateTime" : [ {
        "params" : [  ]
      } ], 
      "current-time" : [ {
        "params" : [  ]
      } ], 
      "parse-date" : [ {
        "params" : [ "$input", "$format" ]
      }, {
        "params" : [ "$input", "$format", "$locale" ]
      } ], 
      "parse-dateTime" : [ {
        "params" : [ "$input", "$format" ]
      }, {
        "params" : [ "$input", "$format", "$locale" ]
      } ], 
      "parse-time" : [ {
        "params" : [ "$input", "$format" ]
      }, {
        "params" : [ "$input", "$format", "$locale" ]
      } ], 
      "millis-to-dateTime" : [ {
        "params" : [ "$millis" ]
      } ], 
      "timestamp" : [ {
        "params" : [  ]
      } ], 
      "utc-offset" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/dbgp-message-handler" : {
    "functions" : {
      "status" : [ {
        "params" : [ "$resp" ]
      } ], 
      "source" : [ {
        "params" : [ "$resp" ]
      } ], 
      "breakpoint-set" : [ {
        "params" : [ "$resp" ]
      } ], 
      "breakpoint-get" : [ {
        "params" : [ "$resp" ]
      } ], 
      "breakpoint-list" : [ {
        "params" : [ "$resp" ]
      } ], 
      "lpottl" : [ {
        "params" : [ "$value", "$length", "$padChar" ]
      } ], 
      "breakpoint-remove" : [ {
        "params" : [ "$resp" ]
      } ], 
      "stack-depth" : [ {
        "params" : [ "$resp" ]
      } ], 
      "stack-get" : [ {
        "params" : [ "$resp" ]
      } ], 
      "context-names" : [ {
        "params" : [ "$resp" ]
      } ], 
      "context-get" : [ {
        "params" : [ "$resp" ]
      } ], 
      "eval" : [ {
        "params" : [ "$resp" ]
      } ], 
      "report-error" : [ {
        "params" : [ "$message" ]
      }, {
        "params" : [ "$message", "$debugMessage" ]
      } ], 
      "process-response" : [ {
        "params" : [ "$resp" ]
      } ], 
      "process-init" : [ {
        "params" : [ "$init" ]
      } ], 
      "process" : [ {
        "params" : [ "$message" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/datetime" : {
    "functions" : {
      "day-of-week" : [ {
        "params" : [ "$date" ]
      } ], 
      "is-leap-year" : [ {
        "params" : [ "$date" ]
      } ], 
      "days360" : [ {
        "params" : [ "$start_date", "$end_date" ]
      }, {
        "params" : [ "$start_date", "$end_date", "$method" ]
      } ], 
      "hour" : [ {
        "params" : [ "$time" ]
      } ], 
      "minute" : [ {
        "params" : [ "$time" ]
      } ], 
      "month" : [ {
        "params" : [ "$date" ]
      } ], 
      "second" : [ {
        "params" : [ "$time" ]
      } ], 
      "day" : [ {
        "params" : [ "$date" ]
      } ], 
      "year" : [ {
        "params" : [ "$date" ]
      } ], 
      "today" : [ {
        "params" : [  ]
      } ], 
      "now" : [ {
        "params" : [  ]
      } ], 
      "date" : [ {
        "params" : [ "$year", "$month", "$day" ]
      } ], 
      "time" : [ {
        "params" : [ "$hour", "$minute", "$second" ]
      } ], 
      "weekday" : [ {
        "params" : [ "$date" ]
      }, {
        "params" : [ "$date", "$return_type" ]
      } ], 
      "networkdays" : [ {
        "params" : [ "$start_date", "$end_date" ]
      }, {
        "params" : [ "$start_date", "$end_date", "$holidays" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/engineering" : {
    "functions" : {
      "is-hex" : [ {
        "params" : [ "$arg" ]
      } ], 
      "is-oct" : [ {
        "params" : [ "$arg" ]
      } ], 
      "is-bin" : [ {
        "params" : [ "$arg" ]
      } ], 
      "dec2hexUtil" : [ {
        "params" : [ "$number" ]
      } ], 
      "dec2octUtil" : [ {
        "params" : [ "$number" ]
      } ], 
      "dec2binUtil" : [ {
        "params" : [ "$arg" ]
      } ], 
      "hex2decUtil" : [ {
        "params" : [ "$arg" ]
      } ], 
      "oct2decUtil" : [ {
        "params" : [ "$arg" ]
      } ], 
      "bin2decUtil" : [ {
        "params" : [ "$arg" ]
      } ], 
      "dec2hex" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "dec2oct" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "dec2bin" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "oct2bin" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "oct2dec" : [ {
        "params" : [ "$arg" ]
      } ], 
      "bin2dec" : [ {
        "params" : [ "$arg" ]
      } ], 
      "oct2hex" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "hex2bin" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "hex2oct" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "hex2dec" : [ {
        "params" : [ "$arg" ]
      } ], 
      "bin2oct" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ], 
      "bin2hex" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$arg", "$places" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/information" : {
    "functions" : {
      "is-blank" : [ {
        "params" : [ "$value" ]
      } ], 
      "is-even" : [ {
        "params" : [ "$value" ]
      } ], 
      "is-odd" : [ {
        "params" : [ "$value" ]
      } ], 
      "islogical" : [ {
        "params" : [ "$value" ]
      } ], 
      "isnumber" : [ {
        "params" : [ "$value" ]
      } ], 
      "istext" : [ {
        "params" : [ "$value" ]
      } ], 
      "n" : [ {
        "params" : [ "$value" ]
      } ], 
      "na" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/logical" : {
    "functions" : {
      "and" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$values" ]
      } ], 
      "if" : [ {
        "params" : [ "$logical_test", "$value_if_true", "$value_if_false" ]
      } ], 
      "or" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$values" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/lookup" : {
    "functions" : {
      "choose" : [ {
        "params" : [ "$index_num", "$values" ]
      }, {
        "params" : [ "$index_num", "$value_sequence1", "$value_sequence2", "$value_sequence3", "$value_sequence4", "$value_sequence5", "$value_sequence6", "$value_sequence7", "$value_sequence8", "$value_sequence9", "$value_sequence10", "$value_sequence11", "$value_sequence12", "$value_sequence13", "$value_sequence14", "$value_sequence15", "$value_sequence16", "$value_sequence17", "$value_sequence18", "$value_sequence19", "$value_sequence20", "$value_sequence21", "$value_sequence22", "$value_sequence23", "$value_sequence24", "$value_sequence25", "$value_sequence26", "$value_sequence27", "$value_sequence28", "$value_sequence29" ]
      } ], 
      "lookup-column" : [ {
        "params" : [ "$lookup_value", "$table_header", "$range_lookup", "$pos", "$last_comparable_pos" ]
      } ], 
      "hlookup" : [ {
        "params" : [ "$lookup_value", "$table_array", "$table_width", "$table_height", "$row_index_num", "$range_lookup" ]
      }, {
        "params" : [ "$lookup_value", "$table_array", "$table_width", "$table_height", "$row_index_num" ]
      } ], 
      "index" : [ {
        "params" : [ "$array", "$array_height", "$array_width", "$row_num", "$column_num" ]
      } ], 
      "lookup" : [ {
        "params" : [ "$lookup_value", "$lookup_vector", "$result_vector" ]
      }, {
        "params" : [ "$lookup_value", "$array", "$array_width", "$array_height" ]
      } ], 
      "match" : [ {
        "params" : [ "$lookup_value", "$sequence", "$match_type" ]
      }, {
        "params" : [ "$lookup_value", "$sequence" ]
      } ], 
      "offset" : [ {
        "params" : [ "$reference", "$reference_height", "$reference_width", "$rows", "$cols", "$height", "$width" ]
      }, {
        "params" : [ "$reference", "$reference_height", "$reference_width", "$rows", "$cols" ]
      } ], 
      "transpose" : [ {
        "params" : [ "$array", "$array_width", "$array_height" ]
      } ], 
      "vlookup" : [ {
        "params" : [ "$lookup_value", "$table_array", "$table_width", "$table_height", "$col_index_num", "$range_lookup" ]
      }, {
        "params" : [ "$lookup_value", "$table_array", "$table_width", "$table_height", "$col_index_num" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/math-sumproduct" : {
    "functions" : {
      "sumproduct" : [ {
        "params" : [ "$array1" ]
      }, {
        "params" : [ "$array1", "$array2" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25", "$array26" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25", "$array26", "$array27" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25", "$array26", "$array27", "$array28" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25", "$array26", "$array27", "$array28", "$array29" ]
      }, {
        "params" : [ "$array1", "$array2", "$array3", "$array4", "$array5", "$array6", "$array7", "$array8", "$array9", "$array10", "$array11", "$array12", "$array13", "$array14", "$array15", "$array16", "$array17", "$array18", "$array19", "$array20", "$array21", "$array22", "$array23", "$array24", "$array25", "$array26", "$array27", "$array28", "$array29", "$array30" ]
      } ], 
      "sumsq" : [ {
        "params" : [ "$numbers" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/math" : {
    "functions" : {
      "is-a-number" : [ {
        "params" : [ "$value" ]
      } ], 
      "cast-as-numeric" : [ {
        "params" : [ "$number" ]
      } ], 
      "abs" : [ {
        "params" : [ "$arg" ]
      } ], 
      "ceiling" : [ {
        "params" : [ "$number", "$significance" ]
      } ], 
      "even" : [ {
        "params" : [ "$number" ]
      } ], 
      "fact-integer" : [ {
        "params" : [ "$intnum" ]
      } ], 
      "fact" : [ {
        "params" : [ "$number" ]
      } ], 
      "floor" : [ {
        "params" : [ "$number", "$significance" ]
      } ], 
      "int" : [ {
        "params" : [ "$number" ]
      } ], 
      "mod" : [ {
        "params" : [ "$number", "$divisor" ]
      } ], 
      "odd" : [ {
        "params" : [ "$number" ]
      } ], 
      "pi" : [ {
        "params" : [  ]
      } ], 
      "power" : [ {
        "params" : [ "$number", "$power" ]
      } ], 
      "product-internal" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "product" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "quotient" : [ {
        "params" : [ "$numerator", "$denominator" ]
      } ], 
      "round" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "rounddown" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "roundup" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "sign" : [ {
        "params" : [ "$number" ]
      } ], 
      "sum" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "trunc" : [ {
        "params" : [ "$number" ]
      }, {
        "params" : [ "$number", "$precision" ]
      } ], 
      "sort-numbers" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "degrees" : [ {
        "params" : [ "$radian" ]
      } ], 
      "factdouble" : [ {
        "params" : [ "$number" ]
      } ], 
      "min-without-zero" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "try-exact-divide" : [ {
        "params" : [ "$numbers", "$divident" ]
      } ], 
      "iterate-all-gcd" : [ {
        "params" : [ "$numbers", "$min-nonzero", "$iteration" ]
      } ], 
      "gcd" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "lcm" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "mround" : [ {
        "params" : [ "$number", "$multiple" ]
      } ], 
      "radians" : [ {
        "params" : [ "$degree" ]
      } ], 
      "roman" : [ {
        "params" : [ "$number" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/statistical-zorba" : {
    "functions" : {
      "stdev" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdeva" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdevp" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdevpa" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "subtotal" : [ {
        "params" : [ "$function_num", "$numbers" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/statistical" : {
    "functions" : {
      "count-non-empty" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "average" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "count" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "countblank" : [ {
        "params" : [ "$cells" ]
      } ], 
      "max" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "min" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "median" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "mode" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "percentile" : [ {
        "params" : [ "$numbers", "$k_at" ]
      } ], 
      "sum-deviations" : [ {
        "params" : [ "$numbers", "$average" ]
      } ], 
      "avedev" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "add-all-cells" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "averagea" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "counta" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "large" : [ {
        "params" : [ "$numbers", "$k" ]
      } ], 
      "maxa" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "mina" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "rank" : [ {
        "params" : [ "$x", "$numbers", "$order_ascending" ]
      }, {
        "params" : [ "$x", "$numbers" ]
      } ], 
      "percentrank" : [ {
        "params" : [ "$numbers", "$x" ]
      } ], 
      "quartile" : [ {
        "params" : [ "$numbers", "$quart" ]
      } ], 
      "small" : [ {
        "params" : [ "$numbers", "$k" ]
      } ], 
      "sumsq-deviations" : [ {
        "params" : [ "$numbers", "$average" ]
      } ], 
      "var" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "vara" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "varp" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "varpa" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "sum-prob" : [ {
        "params" : [ "$prob_range" ]
      } ], 
      "sum-prob-x" : [ {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit", "$upper_limit" ]
      } ], 
      "prob" : [ {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit", "$upper_limit" ]
      }, {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit" ]
      } ], 
      "sum-x-y-deviations" : [ {
        "params" : [ "$x_numbers", "$x_average", "$y_numbers", "$y_average" ]
      } ], 
      "slope" : [ {
        "params" : [ "$known_y", "$known_x" ]
      } ], 
      "standardize" : [ {
        "params" : [ "$x", "$mean", "$standard_dev" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/excel/text" : {
    "functions" : {
      "value-union" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "value-intersect" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "value-except" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "reverse-string" : [ {
        "params" : [ "$arg" ]
      } ], 
      "pad-string-to-length" : [ {
        "params" : [ "$string", "$padChar", "$length" ]
      } ], 
      "pad-integer-to-length" : [ {
        "params" : [ "$toPad", "$padChar", "$length" ]
      } ], 
      "index-of-match-first" : [ {
        "params" : [ "$arg", "$pattern" ]
      }, {
        "params" : [ "$arg", "$pattern", "$flags" ]
      } ], 
      "index-of-match" : [ {
        "params" : [ "$arg", "$pattern", "$pos", "$instance_num" ]
      } ], 
      "tokenize-length" : [ {
        "params" : [ "$text", "$length" ]
      } ], 
      "asc" : [ {
        "params" : [ "$text" ]
      } ], 
      "char" : [ {
        "params" : [ "$number" ]
      } ], 
      "code" : [ {
        "params" : [ "$arg" ]
      } ], 
      "concatenate" : [ {
        "params" : [ "$arg1", "$arg2" ]
      }, {
        "params" : [ "$args" ]
      } ], 
      "clean" : [ {
        "params" : [ "$arg" ]
      } ], 
      "fixed" : [ {
        "params" : [ "$number", "$decimals" ]
      }, {
        "params" : [ "$number", "$decimals", "$no_commas" ]
      } ], 
      "dollar" : [ {
        "params" : [ "$number" ]
      }, {
        "params" : [ "$number", "$decimals" ]
      } ], 
      "exact" : [ {
        "params" : [ "$arg1", "$arg2" ]
      } ], 
      "left" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$text", "$num_chars" ]
      } ], 
      "len" : [ {
        "params" : [ "$arg" ]
      } ], 
      "lower" : [ {
        "params" : [ "$arg" ]
      } ], 
      "mid" : [ {
        "params" : [ "$text", "$start_num", "$num_chars" ]
      } ], 
      "replace" : [ {
        "params" : [ "$old_text", "$start_num", "$num_chars", "$new_text" ]
      } ], 
      "right" : [ {
        "params" : [ "$arg" ]
      }, {
        "params" : [ "$text", "$num_chars" ]
      } ], 
      "search" : [ {
        "params" : [ "$find_text", "$within_text" ]
      }, {
        "params" : [ "$find_text", "$within_text", "$start_num" ]
      } ], 
      "find" : [ {
        "params" : [ "$find_text", "$within_text" ]
      }, {
        "params" : [ "$find_text", "$within_text", "$start_num" ]
      } ], 
      "substitute" : [ {
        "params" : [ "$text", "$old_text", "$new_text", "$instance_num" ]
      }, {
        "params" : [ "$text", "$old_text", "$new_text" ]
      } ], 
      "trim" : [ {
        "params" : [ "$text" ]
      } ], 
      "upper" : [ {
        "params" : [ "$text" ]
      } ], 
      "t" : [ {
        "params" : [ "$value" ]
      } ], 
      "value" : [ {
        "params" : [ "$arg" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/fetch" : {
    "functions" : {
      "content" : [ {
        "params" : [ "$uri" ]
      }, {
        "params" : [ "$uri", "$entity-kind" ]
      }, {
        "params" : [ "$uri", "$entity-kind", "$encoding" ]
      } ], 
      "content-binary" : [ {
        "params" : [ "$uri" ]
      }, {
        "params" : [ "$uri", "$entity-kind" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/full-text" : {
    "functions" : {
      "current-compare-options" : [ {
        "params" : [  ]
      } ], 
      "current-lang" : [ {
        "params" : [  ]
      } ], 
      "host-lang" : [ {
        "params" : [  ]
      } ], 
      "is-stem-lang-supported" : [ {
        "params" : [ "$lang" ]
      } ], 
      "is-stop-word" : [ {
        "params" : [ "$word", "$lang" ]
      }, {
        "params" : [ "$word" ]
      } ], 
      "is-stop-word-lang-supported" : [ {
        "params" : [ "$lang" ]
      } ], 
      "is-thesaurus-lang-supported" : [ {
        "params" : [ "$lang" ]
      }, {
        "params" : [ "$uri", "$lang" ]
      } ], 
      "is-tokenizer-lang-supported" : [ {
        "params" : [ "$lang" ]
      } ], 
      "stem" : [ {
        "params" : [ "$word", "$lang" ]
      }, {
        "params" : [ "$word" ]
      } ], 
      "strip-diacritics" : [ {
        "params" : [ "$string" ]
      } ], 
      "thesaurus-lookup" : [ {
        "params" : [ "$phrase" ]
      }, {
        "params" : [ "$uri", "$phrase", "$lang" ]
      }, {
        "params" : [ "$uri", "$phrase" ]
      }, {
        "params" : [ "$uri", "$phrase", "$lang", "$relationship" ]
      }, {
        "params" : [ "$uri", "$phrase", "$lang", "$relationship", "$level-least", "$level-most" ]
      } ], 
      "tokenize-node" : [ {
        "params" : [ "$node", "$lang" ]
      }, {
        "params" : [ "$node" ]
      } ], 
      "tokenize-nodes" : [ {
        "params" : [ "$includes", "$excludes" ]
      }, {
        "params" : [ "$includes", "$excludes", "$lang" ]
      } ], 
      "tokenize-string" : [ {
        "params" : [ "$string", "$lang" ]
      }, {
        "params" : [ "$string" ]
      } ], 
      "tokenizer-properties" : [ {
        "params" : [ "$lang" ]
      }, {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/geoproj" : {
    "functions" : {
      "deg-to-rad" : [ {
        "params" : [ "$deg" ]
      } ], 
      "rad-to-deg" : [ {
        "params" : [ "$rad" ]
      } ], 
      "proj-tsfn" : [ {
        "params" : [ "$phi" ]
      } ], 
      "wgs84-to-omerc-validated" : [ {
        "params" : [ "$lat_0", "$long_c", "$k0", "$lat_long_degrees" ]
      } ], 
      "wgs84-to-omerc" : [ {
        "params" : [ "$lat-0", "$long-c", "$k0", "$lat-long-degrees" ]
      } ], 
      "wgs84-to-omerc-gmlpos" : [ {
        "params" : [ "$lat-0", "$long-c", "$k0", "$lat-long-degrees" ]
      } ], 
      "wgs84-to-omerc-gmlpos-validated" : [ {
        "params" : [ "$lat_0", "$long_c", "$k0", "$lat_long_degrees" ]
      } ], 
      "proj-phi2-helper" : [ {
        "params" : [ "$i", "$ts", "$e", "$prev_phi" ]
      } ], 
      "proj-phi2" : [ {
        "params" : [ "$ts", "$e" ]
      } ], 
      "omerc-to-wgs84" : [ {
        "params" : [ "$lat-0", "$long-c", "$k0", "$coords" ]
      } ], 
      "omerc-to-wgs84-validated" : [ {
        "params" : [ "$lat_0", "$long_c", "$k0", "$coords" ]
      } ], 
      "omerc-gmlpos-to-wgs84" : [ {
        "params" : [ "$lat_0", "$long_c", "$k0", "$gmlposs" ]
      } ], 
      "dms-to-deg" : [ {
        "params" : [ "$dms" ]
      } ], 
      "deg-to-dms" : [ {
        "params" : [ "$deg" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/hash" : {
    "functions" : {
      "md5" : [ {
        "params" : [ "$value" ]
      } ], 
      "sha1" : [ {
        "params" : [ "$value" ]
      } ], 
      "md5-binary" : [ {
        "params" : [ "$value" ]
      } ], 
      "sha1-binary" : [ {
        "params" : [ "$value" ]
      } ], 
      "hash" : [ {
        "params" : [ "$value", "$alg" ]
      } ], 
      "hash-binary" : [ {
        "params" : [ "$value", "$alg" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/hmac" : {
    "functions" : {
      "md5" : [ {
        "params" : [ "$message", "$secret-key" ]
      } ], 
      "sha1" : [ {
        "params" : [ "$message", "$secret-key" ]
      } ], 
      "md5-binary" : [ {
        "params" : [ "$message", "$secret-key" ]
      } ], 
      "sha1-binary" : [ {
        "params" : [ "$message", "$secret-key" ]
      } ], 
      "compute" : [ {
        "params" : [ "$message", "$secret-key", "$alg" ]
      } ], 
      "compute-binary" : [ {
        "params" : [ "$message", "$secret-key", "$hash-algo" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/http-client-wrapper" : {
    "functions" : {
      "http-sequential-request" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      } ], 
      "http-nondeterministic-request" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      } ], 
      "xml-response" : [ {
        "params" : [ "$response", "$override-media-type" ]
      } ], 
      "get-bodies" : [ {
        "params" : [ "$bodies", "$override-media-type" ]
      } ], 
      "xml-headers" : [ {
        "params" : [ "$headers" ]
      } ], 
      "xml-body" : [ {
        "params" : [ "$body" ]
      } ], 
      "xml-multipart" : [ {
        "params" : [ "$multipart" ]
      } ], 
      "json-request" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      } ], 
      "json-authentication" : [ {
        "params" : [ "$request" ]
      } ], 
      "json-options" : [ {
        "params" : [ "$request" ]
      } ], 
      "json-headers" : [ {
        "params" : [ "$headers" ]
      } ], 
      "json-body" : [ {
        "params" : [ "$body", "$content" ]
      } ], 
      "produce-content" : [ {
        "params" : [ "$body", "$content" ]
      } ], 
      "serialization-parameters" : [ {
        "params" : [ "$body" ]
      } ], 
      "default-serialization-parameters" : [ {
        "params" : [ "$body" ]
      } ], 
      "json-multipart" : [ {
        "params" : [ "$multipart", "$bodies" ]
      } ], 
      "json-part" : [ {
        "params" : [ "$headers", "$body", "$content" ]
      } ], 
      "check-params" : [ {
        "params" : [ "$request", "$href", "$bodies" ]
      } ], 
      "set-content-type" : [ {
        "params" : [ "$request" ]
      } ], 
      "create-body" : [ {
        "params" : [ "$body" ]
      } ], 
      "create-multipart" : [ {
        "params" : [ "$multipart" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/http-client" : {
    "functions" : {
      "send-request" : [ {
        "params" : [ "$request" ]
      } ], 
      "send-nondeterministic-request" : [ {
        "params" : [ "$request" ]
      } ], 
      "get" : [ {
        "params" : [ "$href" ]
      } ], 
      "get-text" : [ {
        "params" : [ "$href" ]
      } ], 
      "get-binary" : [ {
        "params" : [ "$href" ]
      } ], 
      "head" : [ {
        "params" : [ "$href" ]
      } ], 
      "options" : [ {
        "params" : [ "$href" ]
      } ], 
      "put" : [ {
        "params" : [ "$href", "$body" ]
      }, {
        "params" : [ "$href", "$body", "$content-type" ]
      } ], 
      "delete" : [ {
        "params" : [ "$href" ]
      } ], 
      "post" : [ {
        "params" : [ "$href", "$body" ]
      }, {
        "params" : [ "$href", "$body", "$content-type" ]
      } ], 
      "check-request" : [ {
        "params" : [ "$request" ]
      } ], 
      "http-sequential-impl" : [ {
        "params" : [ "$request" ]
      } ], 
      "http-nondeterministic-impl" : [ {
        "params" : [ "$request" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/image/animation" : {
    "functions" : {
      "create-animated-gif" : [ {
        "params" : [ "$images", "$delay", "$iterations" ]
      } ], 
      "create-morphed-gif" : [ {
        "params" : [ "$images", "$delay", "$iterations", "$nr-of-morph-images" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/image/basic" : {
    "functions" : {
      "width" : [ {
        "params" : [ "$image" ]
      } ], 
      "height" : [ {
        "params" : [ "$image" ]
      } ], 
      "compress" : [ {
        "params" : [ "$image", "$quality" ]
      } ], 
      "convert" : [ {
        "params" : [ "$image", "$format" ]
      } ], 
      "convert-impl" : [ {
        "params" : [ "$image", "$format" ]
      } ], 
      "format" : [ {
        "params" : [ "$image" ]
      } ], 
      "create" : [ {
        "params" : [ "$width", "$height", "$format" ]
      } ], 
      "create-impl" : [ {
        "params" : [ "$width", "$height", "$format" ]
      } ], 
      "exif" : [ {
        "params" : [ "$image", "$tag" ]
      } ], 
      "equals" : [ {
        "params" : [ "$image1", "$image2" ]
      } ], 
      "convert-svg" : [ {
        "params" : [ "$svg", "$format" ]
      } ], 
      "convert-svg-string" : [ {
        "params" : [ "$svg", "$format" ]
      } ], 
      "convert-svg-impl" : [ {
        "params" : [ "$svg", "$format" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/image/manipulation" : {
    "functions" : {
      "resize" : [ {
        "params" : [ "$image", "$width", "$height" ]
      } ], 
      "zoom" : [ {
        "params" : [ "$image", "$ratio" ]
      } ], 
      "zoom-by-width" : [ {
        "params" : [ "$image", "$width" ]
      } ], 
      "zoom-by-height" : [ {
        "params" : [ "$image", "$height" ]
      } ], 
      "sub-image" : [ {
        "params" : [ "$image", "$left-upper-x", "$left-upper-y", "$width", "$height" ]
      } ], 
      "overlay" : [ {
        "params" : [ "$image", "$overlay-image", "$overlay-upper-left-x", "$overlay-upper-left-y", "$operator" ]
      } ], 
      "overlay-impl" : [ {
        "params" : [ "$image", "$overlay-image", "$overlay-upper-left-x", "$overlay-upper-left-y", "$operator" ]
      } ], 
      "chop" : [ {
        "params" : [ "$image", "$upper-left-x", "$upper-left-y" ]
      } ], 
      "crop" : [ {
        "params" : [ "$image", "$lower-right-x", "$lower-right-y" ]
      } ], 
      "rotate" : [ {
        "params" : [ "$image", "$angle" ]
      } ], 
      "erase" : [ {
        "params" : [ "$image" ]
      } ], 
      "flop" : [ {
        "params" : [ "$image" ]
      } ], 
      "flip" : [ {
        "params" : [ "$image" ]
      } ], 
      "trim" : [ {
        "params" : [ "$image" ]
      } ], 
      "add-noise" : [ {
        "params" : [ "$image", "$noise-type" ]
      } ], 
      "add-noise-impl" : [ {
        "params" : [ "$image", "$noise-type" ]
      } ], 
      "blur" : [ {
        "params" : [ "$image", "$radius", "$sigma" ]
      } ], 
      "despeckle" : [ {
        "params" : [ "$image" ]
      } ], 
      "enhance" : [ {
        "params" : [ "$image" ]
      } ], 
      "equalize" : [ {
        "params" : [ "$image" ]
      } ], 
      "edge" : [ {
        "params" : [ "$image", "$radius" ]
      } ], 
      "charcoal" : [ {
        "params" : [ "$image", "$radius", "$sigma" ]
      } ], 
      "emboss" : [ {
        "params" : [ "$image", "$radius", "$sigma" ]
      } ], 
      "solarize" : [ {
        "params" : [ "$image", "$factor" ]
      } ], 
      "stereo" : [ {
        "params" : [ "$left-image", "$right-image" ]
      } ], 
      "transparent" : [ {
        "params" : [ "$image", "$color" ]
      } ], 
      "transparent-impl" : [ {
        "params" : [ "$image", "$color" ]
      } ], 
      "swirl" : [ {
        "params" : [ "$image", "$degree" ]
      } ], 
      "reduce-noise" : [ {
        "params" : [ "$image", "$order" ]
      } ], 
      "contrast" : [ {
        "params" : [ "$image", "$sharpen" ]
      } ], 
      "gamma" : [ {
        "params" : [ "$image", "$gamma-value" ]
      }, {
        "params" : [ "$image", "$gamma-red", "$gamma-green", "$gamma-blue" ]
      } ], 
      "implode" : [ {
        "params" : [ "$image", "$factor" ]
      } ], 
      "oil-paint" : [ {
        "params" : [ "$image", "$radius" ]
      } ], 
      "watermark" : [ {
        "params" : [ "$image", "$watermark" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/image/paint" : {
    "functions" : {
      "paint" : [ {
        "params" : [ "$image", "$shapes" ]
      } ], 
      "paint-impl" : [ {
        "params" : [ "$image", "$shapes" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/info-extraction" : {
    "functions" : {
      "entities" : [ {
        "params" : [ "$text" ]
      } ], 
      "categories" : [ {
        "params" : [ "$text" ]
      } ], 
      "relations" : [ {
        "params" : [ "$text" ]
      } ], 
      "concepts" : [ {
        "params" : [ "$text" ]
      } ], 
      "entities-inline" : [ {
        "params" : [ "$text" ]
      } ], 
      "concepts-inline" : [ {
        "params" : [ "$text" ]
      } ], 
      "entity-inline-annotation" : [ {
        "params" : [ "$text", "$entities", "$size" ]
      } ], 
      "concept-inline-annotation" : [ {
        "params" : [ "$text", "$concepts", "$size" ]
      } ], 
      "server-connection" : [ {
        "params" : [ "$text" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/item" : {
    "functions" : {
      "size" : [ {
        "params" : [ "$item" ]
      } ]
    }
  }, 
  "http://www.zorba-xquery.com/modules/jdbc" : {
    "functions" : {
      "connect" : [ {
        "params" : [ "$connection-config" ]
      }, {
        "params" : [ "$connection-config", "$options" ]
      } ], 
      "is-connected" : [ {
        "params" : [ "$connection-id" ]
      } ], 
      "connection-options" : [ {
        "params" : [ "$connection-id" ]
      } ], 
      "commit" : [ {
        "params" : [ "$connection-id" ]
      } ], 
      "rollback" : [ {
        "params" : [ "$connection-id" ]
      } ], 
      "execute" : [ {
        "params" : [ "$connection-id", "$sql" ]
      } ], 
      "execute-query" : [ {
        "params" : [ "$connection-id", "$sql" ]
      } ], 
      "execute-update" : [ {
        "params" : [ "$connection-id", "$sql" ]
      } ], 
      "prepare-statement" : [ {
        "params" : [ "$connection-id", "$sql" ]
      } ], 
      "set-numeric" : [ {
        "params" : [ "$prepared-statement", "$parameter-index", "$value" ]
      } ], 
      "set-string" : [ {
        "params" : [ "$prepared-statement", "$parameter-index", "$value" ]
      } ], 
      "set-boolean" : [ {
        "params" : [ "$prepared-statement", "$parameter-index", "$value" ]
      } ], 
      "set-null" : [ {
        "params" : [ "$prepared-statement", "$parameter-index" ]
      } ], 
      "set-value" : [ {
        "params" : [ "$prepared-statement", "$parameter-index", "$value" ]
      } ], 
      "clear-params" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "parameter-metadata" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "execute-prepared" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "execute-query-prepared" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "execute-update-prepared" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "close-prepared" : [ {
        "params" : [ "$prepared-statement" ]
      } ], 
      "result-set" : [ {
        "params" : [ "$dataset-id" ]
      } ], 
      "metadata" : [ {
        "params" : [ "$dataset-id" ]
      } ], 
      "affected-rows" : [ {
        "params" : [ "$dataset-id" ]
      } ], 
      "close-dataset" : [ {
        "params" : [ "$dataset-id" ]
      } ], 
      "tables" : [ {
        "params" : [ "$connection-id", "$catalog", "$schema", "$table" ]
      }, {
        "params" : [ "$connection-id" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/json-csv" : {
    "functions" : {
      "parse" : [ {
        "params" : [ "$csv", "$options" ]
      }, {
        "params" : [ "$csv" ]
      } ], 
      "serialize" : [ {
        "params" : [ "$obj", "$options" ]
      }, {
        "params" : [ "$obj" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/json-xml" : {
    "functions" : {
      "json-to-xml" : [ {
        "params" : [ "$json", "$options" ]
      }, {
        "params" : [ "$json" ]
      } ], 
      "xml-to-json" : [ {
        "params" : [ "$xml", "$options" ]
      }, {
        "params" : [ "$xml" ]
      } ], 
      "json-to-xml-internal" : [ {
        "params" : [ "$json", "$options" ]
      } ], 
      "xml-to-json-internal" : [ {
        "params" : [ "$xml", "$options" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/math" : {
    "functions" : {
      "cosh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "acosh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "fmod" : [ {
        "params" : [ "$x", "$y" ]
      } ], 
      "frexp" : [ {
        "params" : [ "$arg" ]
      } ], 
      "ldexp" : [ {
        "params" : [ "$x", "$i" ]
      } ], 
      "modf" : [ {
        "params" : [ "$arg" ]
      } ], 
      "sinh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "asinh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "tanh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "atanh" : [ {
        "params" : [ "$arg" ]
      } ], 
      "deg-to-rad" : [ {
        "params" : [ "$deg" ]
      } ], 
      "rad-to-deg" : [ {
        "params" : [ "$rad" ]
      } ], 
      "is_inf" : [ {
        "params" : [ "$arg" ]
      } ], 
      "is_nan" : [ {
        "params" : [ "$arg" ]
      } ], 
      "is-a-number" : [ {
        "params" : [ "$value" ]
      } ], 
      "cast-as-numeric" : [ {
        "params" : [ "$number" ]
      } ], 
      "ceiling" : [ {
        "params" : [ "$number", "$significance" ]
      } ], 
      "even" : [ {
        "params" : [ "$number" ]
      } ], 
      "fact-integer" : [ {
        "params" : [ "$intnum" ]
      } ], 
      "fact" : [ {
        "params" : [ "$number" ]
      } ], 
      "floor" : [ {
        "params" : [ "$number", "$significance" ]
      } ], 
      "int" : [ {
        "params" : [ "$number" ]
      } ], 
      "mod" : [ {
        "params" : [ "$number", "$divisor" ]
      } ], 
      "odd" : [ {
        "params" : [ "$number" ]
      } ], 
      "product-internal" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "product" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "quotient" : [ {
        "params" : [ "$numerator", "$denominator" ]
      } ], 
      "round" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "rounddown" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "roundup" : [ {
        "params" : [ "$number", "$precision" ]
      } ], 
      "sign" : [ {
        "params" : [ "$number" ]
      } ], 
      "trunc" : [ {
        "params" : [ "$number" ]
      }, {
        "params" : [ "$number", "$precision" ]
      } ], 
      "sort-numbers" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "factdouble" : [ {
        "params" : [ "$number" ]
      } ], 
      "min-without-zero" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "try-exact-divide" : [ {
        "params" : [ "$numbers", "$divider" ]
      } ], 
      "iterate-all-gcd" : [ {
        "params" : [ "$numbers", "$min-nonzero", "$iteration" ]
      } ], 
      "gcd" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "lcm" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "mround" : [ {
        "params" : [ "$number", "$multiple" ]
      } ], 
      "roman" : [ {
        "params" : [ "$number" ]
      } ], 
      "sumproduct" : [ {
        "params" : [ "$array1", "$array2" ]
      } ], 
      "sumsq" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "median" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "mode" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "percentile" : [ {
        "params" : [ "$numbers", "$k_at" ]
      } ], 
      "sum-deviations" : [ {
        "params" : [ "$numbers", "$average" ]
      } ], 
      "avedev" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "large" : [ {
        "params" : [ "$numbers", "$k" ]
      } ], 
      "rank" : [ {
        "params" : [ "$x", "$numbers", "$order_ascending" ]
      }, {
        "params" : [ "$x", "$numbers" ]
      } ], 
      "percentrank" : [ {
        "params" : [ "$numbers", "$x" ]
      } ], 
      "quartile" : [ {
        "params" : [ "$numbers", "$quart" ]
      } ], 
      "small" : [ {
        "params" : [ "$numbers", "$k" ]
      } ], 
      "sumsq-deviations" : [ {
        "params" : [ "$numbers", "$average" ]
      } ], 
      "var" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "vara" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "varp" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "varpa" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "sum-prob" : [ {
        "params" : [ "$prob_range" ]
      } ], 
      "sum-prob-x" : [ {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit", "$upper_limit" ]
      } ], 
      "prob" : [ {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit", "$upper_limit" ]
      }, {
        "params" : [ "$x_range", "$prob_range", "$range_lower_limit" ]
      } ], 
      "sum-x-y-deviations" : [ {
        "params" : [ "$x_numbers", "$x_average", "$y_numbers", "$y_average" ]
      } ], 
      "slope" : [ {
        "params" : [ "$known_y", "$known_x" ]
      } ], 
      "standardize" : [ {
        "params" : [ "$x", "$mean", "$standard_dev" ]
      } ], 
      "stdev" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdeva" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdevp" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "stdevpa" : [ {
        "params" : [ "$numbers" ]
      } ], 
      "subtotal" : [ {
        "params" : [ "$function_num", "$numbers" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/node-position" : {
    "functions" : {
      "node-position" : [ {
        "params" : [ "$arg" ]
      } ], 
      "ancestor-of" : [ {
        "params" : [ "$pos1", "$pos2" ]
      } ], 
      "descendant-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "in-subtree-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "parent-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "child-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "attribute-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "following-sibling-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "preceding-sibling-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "sibling-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "following-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "following-in-document-order-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "preceding-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "preceding-in-document-order-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "level" : [ {
        "params" : [ "$n-pos" ]
      } ], 
      "is-attribute" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "is-comment" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "is-document" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "is-element" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "is-processing-instruction" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "is-text" : [ {
        "params" : [ "$n-pos1" ]
      } ], 
      "in-same-tree-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ], 
      "in-collection" : [ {
        "params" : [ "$n-pos" ]
      } ], 
      "in-same-collection-of" : [ {
        "params" : [ "$n-pos1", "$n-pos2" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/node" : {
    "functions" : {
      "ancestor-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "descendant-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "parent-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "child-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "following-sibling-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "preceding-sibling-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "following-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "preceding-of" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "level" : [ {
        "params" : [ "$node" ]
      } ], 
      "least-common-ancestor" : [ {
        "params" : [ "$node1", "$node2" ]
      } ], 
      "copy" : [ {
        "params" : [ "$input" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/oracle-nosqldb" : {
    "functions" : {
      "connect" : [ {
        "params" : [ "$options" ]
      } ], 
      "connect-internal" : [ {
        "params" : [ "$store-name", "$helper-host-ports" ]
      } ], 
      "get" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "put" : [ {
        "params" : [ "$db", "$key", "$value" ]
      } ], 
      "delete" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "put-binary" : [ {
        "params" : [ "$db", "$key", "$value" ]
      } ], 
      "put-text" : [ {
        "params" : [ "$db", "$key", "$string-value" ]
      } ], 
      "get-binary" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "get-text" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "remove" : [ {
        "params" : [ "$db", "$key" ]
      } ], 
      "multi-get-binary" : [ {
        "params" : [ "$db", "$parent-key", "$sub-range", "$depth", "$direction" ]
      } ], 
      "multi-get-text" : [ {
        "params" : [ "$db", "$parent-key", "$sub-range", "$depth", "$direction" ]
      } ], 
      "multi-remove" : [ {
        "params" : [ "$db", "$parent-key", "$sub-range", "$depth" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/process" : {
    "functions" : {
      "exec" : [ {
        "params" : [ "$filename" ]
      }, {
        "params" : [ "$filename", "$args" ]
      }, {
        "params" : [ "$filename", "$args", "$env" ]
      } ], 
      "exec-command" : [ {
        "params" : [ "$cmd" ]
      }, {
        "params" : [ "$cmd", "$args" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/queue" : {
    "functions" : {
      "create" : [ {
        "params" : [ "$name" ]
      } ], 
      "front" : [ {
        "params" : [ "$name" ]
      } ], 
      "back" : [ {
        "params" : [ "$name" ]
      } ], 
      "pop" : [ {
        "params" : [ "$name" ]
      } ], 
      "push" : [ {
        "params" : [ "$name", "$value" ]
      } ], 
      "empty" : [ {
        "params" : [ "$name" ]
      } ], 
      "size" : [ {
        "params" : [ "$name" ]
      } ], 
      "copy" : [ {
        "params" : [ "$destName", "$sourceName" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/random" : {
    "functions" : {
      "seeded-random" : [ {
        "params" : [ "$seed", "$num" ]
      } ], 
      "random" : [ {
        "params" : [ "$num" ]
      }, {
        "params" : [  ]
      } ], 
      "seeded-random-between" : [ {
        "params" : [ "$seed", "$lower", "$upper", "$num" ]
      } ], 
      "random-between" : [ {
        "params" : [ "$lower", "$upper", "$num" ]
      }, {
        "params" : [ "$lower", "$upper" ]
      } ], 
      "uuid" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/reference" : {
    "functions" : {
      "reference" : [ {
        "params" : [ "$arg" ]
      } ], 
      "dereference" : [ {
        "params" : [ "$arg" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/reflection" : {
    "functions" : {
      "invoke" : [ {
        "params" : [ "$name" ]
      } ], 
      "invoke-n" : [ {
        "params" : [ "$name" ]
      } ], 
      "invoke-u" : [ {
        "params" : [ "$name" ]
      } ], 
      "invoke-s" : [ {
        "params" : [ "$name" ]
      } ], 
      "eval" : [ {
        "params" : [ "$query" ]
      } ], 
      "eval-n" : [ {
        "params" : [ "$query" ]
      } ], 
      "eval-u" : [ {
        "params" : [ "$query" ]
      } ], 
      "eval-s" : [ {
        "params" : [ "$query" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/schema" : {
    "functions" : {
      "schema-type" : [ {
        "params" : [ "$item" ]
      } ], 
      "is-validated" : [ {
        "params" : [ "$node" ]
      } ], 
      "validate-in-place" : [ {
        "params" : [ "$node" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/sctx" : {
    "functions" : {
      "base-uri" : [ {
        "params" : [  ]
      } ], 
      "boundary-space-policy" : [ {
        "params" : [  ]
      } ], 
      "construction-mode" : [ {
        "params" : [  ]
      } ], 
      "copy-namespaces-mode" : [ {
        "params" : [  ]
      } ], 
      "default-collation" : [ {
        "params" : [  ]
      } ], 
      "default-collection-type" : [ {
        "params" : [  ]
      } ], 
      "default-function-namespace" : [ {
        "params" : [  ]
      } ], 
      "default-order" : [ {
        "params" : [  ]
      } ], 
      "function-annotations" : [ {
        "params" : [ "$name", "$arity" ]
      } ], 
      "function-arguments-count" : [ {
        "params" : [ "$function" ]
      } ], 
      "function-names" : [ {
        "params" : [  ]
      } ], 
      "functions" : [ {
        "params" : [  ]
      } ], 
      "in-scope-attribute-declarations" : [ {
        "params" : [  ]
      } ], 
      "in-scope-attribute-groups" : [ {
        "params" : [  ]
      } ], 
      "in-scope-element-declarations" : [ {
        "params" : [  ]
      } ], 
      "in-scope-element-groups" : [ {
        "params" : [  ]
      } ], 
      "in-scope-schema-types" : [ {
        "params" : [  ]
      } ], 
      "in-scope-variables" : [ {
        "params" : [  ]
      } ], 
      "option" : [ {
        "params" : [ "$name" ]
      } ], 
      "ordering-mode" : [ {
        "params" : [  ]
      } ], 
      "statically-known-collations" : [ {
        "params" : [  ]
      } ], 
      "statically-known-documents" : [ {
        "params" : [  ]
      } ], 
      "statically-known-document-type" : [ {
        "params" : [ "$document" ]
      } ], 
      "statically-known-namespace-binding" : [ {
        "params" : [ "$prefix" ]
      } ], 
      "statically-known-namespaces" : [ {
        "params" : [  ]
      } ], 
      "xpath10-compatibility-mode" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/sequence" : {
    "functions" : {
      "value-intersect" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ], 
      "value-union" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ], 
      "value-except" : [ {
        "params" : [ "$seq1", "$seq2" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/sqlite" : {
    "functions" : {
      "connect" : [ {
        "params" : [ "$db-name" ]
      }, {
        "params" : [ "$db-name", "$options" ]
      } ], 
      "is-connected" : [ {
        "params" : [ "$conn" ]
      } ], 
      "commit" : [ {
        "params" : [ "$conn" ]
      } ], 
      "rollback" : [ {
        "params" : [ "$conn" ]
      } ], 
      "execute-query" : [ {
        "params" : [ "$conn", "$sqlstr" ]
      } ], 
      "execute-update" : [ {
        "params" : [ "$conn", "$sqlstr" ]
      } ], 
      "metadata" : [ {
        "params" : [ "$pstmnt" ]
      } ], 
      "prepare-statement" : [ {
        "params" : [ "$conn", "$stmnt" ]
      } ], 
      "set-value" : [ {
        "params" : [ "$pstmnt", "$param-num", "$val" ]
      } ], 
      "set-boolean" : [ {
        "params" : [ "$pstmnt", "$param-num", "$val" ]
      } ], 
      "set-numeric" : [ {
        "params" : [ "$pstmnt", "$param-num", "$val" ]
      } ], 
      "set-string" : [ {
        "params" : [ "$pstmnt", "$param-num", "$val" ]
      } ], 
      "set-null" : [ {
        "params" : [ "$pstmnt", "$param-num" ]
      } ], 
      "clear-params" : [ {
        "params" : [ "$pstmnt" ]
      } ], 
      "close-prepared" : [ {
        "params" : [ "$pstmnt" ]
      } ], 
      "execute-query-prepared" : [ {
        "params" : [ "$pstmnt" ]
      } ], 
      "execute-update-prepared" : [ {
        "params" : [ "$pstmnt" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/stack" : {
    "functions" : {
      "create" : [ {
        "params" : [ "$name" ]
      } ], 
      "top" : [ {
        "params" : [ "$name" ]
      } ], 
      "pop" : [ {
        "params" : [ "$name" ]
      } ], 
      "push" : [ {
        "params" : [ "$name", "$value" ]
      } ], 
      "empty" : [ {
        "params" : [ "$name" ]
      } ], 
      "size" : [ {
        "params" : [ "$name" ]
      } ], 
      "copy" : [ {
        "params" : [ "$destName", "$sourceName" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/documents" : {
    "functions" : {
      "available-documents" : [ {
        "params" : [  ]
      } ], 
      "document" : [ {
        "params" : [ "$uri" ]
      } ], 
      "is-available-document" : [ {
        "params" : [ "$uri" ]
      } ], 
      "put" : [ {
        "params" : [ "$uri", "$doc" ]
      } ], 
      "remove" : [ {
        "params" : [ "$uri" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/dynamic/collections/ddl" : {
    "functions" : {
      "available-collections" : [ {
        "params" : [  ]
      } ], 
      "create" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$content" ]
      } ], 
      "delete" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-available-collection" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/dynamic/collections/dml" : {
    "functions" : {
      "insert-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "insert-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-after" : [ {
        "params" : [ "$name", "$pos", "$content" ]
      } ], 
      "apply-insert-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "apply-insert-after" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "collection" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$skip" ]
      }, {
        "params" : [ "$name", "$start", "$skip" ]
      } ], 
      "collection-name" : [ {
        "params" : [ "$item" ]
      } ], 
      "delete" : [ {
        "params" : [ "$items" ]
      } ], 
      "delete-first" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$number" ]
      } ], 
      "delete-last" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$number" ]
      } ], 
      "edit" : [ {
        "params" : [ "$target", "$content" ]
      } ], 
      "index-of" : [ {
        "params" : [ "$item" ]
      } ], 
      "truncate" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/dynamic/collections/w3c/ddl" : {
    "functions" : {
      "to-qname" : [ {
        "params" : [ "$uri" ]
      } ], 
      "from-qname" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-available-collection" : [ {
        "params" : [ "$uri" ]
      } ], 
      "available-collections" : [ {
        "params" : [  ]
      } ], 
      "create" : [ {
        "params" : [ "$uri" ]
      }, {
        "params" : [ "$uri", "$content" ]
      } ], 
      "delete" : [ {
        "params" : [ "$uri" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/dynamic/collections/w3c/dml" : {
    "functions" : {
      "insert-nodes-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-nodes-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-nodes-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "insert-nodes-after" : [ {
        "params" : [ "$name", "$pos", "$content" ]
      } ], 
      "apply-insert-nodes-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-nodes-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-nodes-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "apply-insert-nodes-after" : [ {
        "params" : [ "$name", "$pos", "$content" ]
      } ], 
      "collection" : [ {
        "params" : [ "$name" ]
      } ], 
      "collection-name" : [ {
        "params" : [ "$node" ]
      } ], 
      "delete-nodes" : [ {
        "params" : [ "$nodes" ]
      } ], 
      "delete-node-first" : [ {
        "params" : [ "$name" ]
      } ], 
      "delete-nodes-first" : [ {
        "params" : [ "$name", "$number" ]
      } ], 
      "delete-node-last" : [ {
        "params" : [ "$name" ]
      } ], 
      "delete-nodes-last" : [ {
        "params" : [ "$name", "$number" ]
      } ], 
      "index-of" : [ {
        "params" : [ "$node" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/collections/ddl" : {
    "functions" : {
      "available-collections" : [ {
        "params" : [  ]
      } ], 
      "create" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$content" ]
      } ], 
      "declared-collections" : [ {
        "params" : [  ]
      } ], 
      "delete" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-available-collection" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-declared-collection" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/collections/dml" : {
    "functions" : {
      "collection" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$skip" ]
      }, {
        "params" : [ "$name", "$start", "$skip" ]
      } ], 
      "insert" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-after" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "insert-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "insert-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "insert-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-first" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-last" : [ {
        "params" : [ "$name", "$content" ]
      } ], 
      "apply-insert-before" : [ {
        "params" : [ "$name", "$target", "$content" ]
      } ], 
      "apply-insert-after" : [ {
        "params" : [ "$name", "$pos", "$content" ]
      } ], 
      "delete" : [ {
        "params" : [ "$items" ]
      } ], 
      "delete-first" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$number" ]
      } ], 
      "delete-last" : [ {
        "params" : [ "$name" ]
      }, {
        "params" : [ "$name", "$number" ]
      } ], 
      "edit" : [ {
        "params" : [ "$target", "$content" ]
      } ], 
      "truncate" : [ {
        "params" : [ "$name" ]
      } ], 
      "collection-name" : [ {
        "params" : [ "$item" ]
      } ], 
      "index-of" : [ {
        "params" : [ "$item" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/indexes/ddl" : {
    "functions" : {
      "available-indexes" : [ {
        "params" : [  ]
      } ], 
      "create" : [ {
        "params" : [ "$name" ]
      } ], 
      "declared-indexes" : [ {
        "params" : [  ]
      } ], 
      "delete" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-available-index" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-declared-index" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/indexes/dml" : {
    "functions" : {
      "probe-index-point-value" : [ {
        "params" : [ "$name", "$key_i" ]
      } ], 
      "probe-index-point-value-skip" : [ {
        "params" : [ "$name", "$skip", "$key_i" ]
      } ], 
      "probe-index-point-general" : [ {
        "params" : [ "$name", "$key" ]
      } ], 
      "probe-index-range-value" : [ {
        "params" : [ "$name", "$lowerBound-i", "$upperBound-i", "$haveLowerBound-i", "$haveUpperBound-i", "$lowerBoundIncluded-i", "$upperBoundIncluded-i" ]
      } ], 
      "probe-index-range-value-skip" : [ {
        "params" : [ "$name", "$skip", "$lowerBound-i", "$upperBound-i", "$haveLowerBound-i", "$haveUpperBound-i", "$lowerBoundIncluded-i", "$upperBoundIncluded-i" ]
      } ], 
      "probe-index-range-general" : [ {
        "params" : [ "$name", "$lowerBound", "$upperBound", "$haveLowerBound", "$haveUpperBound", "$lowerBoundIncluded", "$upperBoundIncluded" ]
      } ], 
      "refresh-index" : [ {
        "params" : [ "$name" ]
      } ], 
      "keys" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/integrity-constraints/ddl" : {
    "functions" : {
      "activate" : [ {
        "params" : [ "$name" ]
      } ], 
      "activated-integrity-constraints" : [ {
        "params" : [  ]
      } ], 
      "deactivate" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-activated-integrity-constraint" : [ {
        "params" : [ "$name" ]
      } ], 
      "is-declared-integrity-constraint" : [ {
        "params" : [ "$name" ]
      } ], 
      "declared-integrity-constraints" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/store/static/integrity-constraints/dml" : {
    "functions" : {
      "check-integrity-constraint" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/string" : {
    "functions" : {
      "analyze-string" : [ {
        "params" : [ "$input", "$pattern", "$flags" ]
      }, {
        "params" : [ "$input", "$pattern" ]
      } ], 
      "materialize" : [ {
        "params" : [ "$s" ]
      } ], 
      "is-streamable" : [ {
        "params" : [ "$s" ]
      } ], 
      "is-seekable" : [ {
        "params" : [ "$s" ]
      } ], 
      "split" : [ {
        "params" : [ "$s", "$separator" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/system" : {
    "functions" : {
      "property" : [ {
        "params" : [ "$key" ]
      } ], 
      "properties" : [ {
        "params" : [  ]
      } ], 
      "all-properties" : [ {
        "params" : [  ]
      } ]
    }
  }, 
  "http://zorba.io/modules/unordered-maps" : {
    "functions" : {
      "create" : [ {
        "params" : [ "$name", "$key-types" ]
      }, {
        "params" : [ "$name", "$key-types", "$options" ]
      } ], 
      "drop" : [ {
        "params" : [ "$name" ]
      } ], 
      "insert" : [ {
        "params" : [ "$name", "$key", "$value" ]
      } ], 
      "get" : [ {
        "params" : [ "$name", "$key" ]
      } ], 
      "delete" : [ {
        "params" : [ "$name", "$key" ]
      } ], 
      "keys" : [ {
        "params" : [ "$name" ]
      } ], 
      "size" : [ {
        "params" : [ "$name" ]
      } ], 
      "available-maps" : [ {
        "params" : [  ]
      } ], 
      "options" : [ {
        "params" : [ "$name" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/uri" : {
    "functions" : {
      "decode" : [ {
        "params" : [ "$u" ]
      }, {
        "params" : [ "$u", "$decode-plus" ]
      }, {
        "params" : [ "$s", "$decode-plus", "$charset" ]
      } ], 
      "parse" : [ {
        "params" : [ "$uri" ]
      } ], 
      "serialize" : [ {
        "params" : [ "$uri" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/xml" : {
    "functions" : {
      "parse" : [ {
        "params" : [ "$xml-string", "$options" ]
      } ], 
      "canonicalize" : [ {
        "params" : [ "$xml-string" ]
      }, {
        "params" : [ "$xml-string", "$options" ]
      } ], 
      "canonicalize-impl" : [ {
        "params" : [ "$xml-string", "$options" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/xqdoc" : {
    "functions" : {
      "xqdoc" : [ {
        "params" : [ "$module-uri" ]
      }, {
        "params" : [ "$module-uri", "$options" ]
      } ], 
      "xqdoc-content-impl" : [ {
        "params" : [ "$module", "$filename" ]
      } ], 
      "xqdoc-content" : [ {
        "params" : [ "$module" ]
      }, {
        "params" : [ "$module", "$options" ]
      } ], 
      "xqdoc-content-options-impl" : [ {
        "params" : [ "$module", "$filename", "$options" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/xsl-fo" : {
    "functions" : {
      "generator" : [ {
        "params" : [ "$output-format", "$xsl-fo-document" ]
      } ], 
      "generator-impl" : [ {
        "params" : [ "$output-format", "$xsl-fo-document" ]
      } ]
    }
  }, 
  "http://zorba.io/modules/zorba-query" : {
    "functions" : {
      "prepare-main-module" : [ {
        "params" : [ "$main-module-text" ]
      }, {
        "params" : [ "$main-module-text", "$resolver", "$mapper" ]
      } ], 
      "prepare-library-module" : [ {
        "params" : [ "$library-module-text" ]
      } ], 
      "is-bound-context-item" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "is-bound-variable" : [ {
        "params" : [ "$query-key", "$var-name" ]
      } ], 
      "external-variables" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "is-updating" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "is-sequential" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "bind-context-item" : [ {
        "params" : [ "$query-key", "$dot" ]
      } ], 
      "bind-variable" : [ {
        "params" : [ "$query-key", "$var", "$value" ]
      } ], 
      "evaluate" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "evaluate-updating" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "evaluate-sequential" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "delete-query" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "variable-value" : [ {
        "params" : [ "$query-key", "$var-name" ]
      } ], 
      "query-plan" : [ {
        "params" : [ "$query-key" ]
      } ], 
      "load-from-query-plan" : [ {
        "params" : [ "$plan" ]
      }, {
        "params" : [ "$plan", "$resolver", "$mapper" ]
      } ]
    }
  }, 
  "http://zorba.io/warnings" : {
    "functions" : {

    }
  }
};
});