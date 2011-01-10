define(function(i, h) {
  var c = {success:function(a) {
    console.log(a)
  }, fail:function() {
    c._recordThrow("fail", arguments)
  }, assertTrue:function(a) {
    a || c._recordThrow("assertTrue", arguments)
  }, verifyTrue:function(a) {
    a || c._recordTrace("verifyTrue", arguments)
  }, assertFalse:function(a) {
    a && c._recordThrow("assertFalse", arguments)
  }, verifyFalse:function(a) {
    a && c._recordTrace("verifyFalse", arguments)
  }, assertNull:function(a) {
    a !== null && c._recordThrow("assertNull", arguments)
  }, verifyNull:function(a) {
    a !== null && c._recordTrace("verifyNull", arguments)
  }, assertNotNull:function(a) {
    a === null && c._recordThrow("assertNotNull", arguments)
  }, verifyNotNull:function(a) {
    a === null && c._recordTrace("verifyNotNull", arguments)
  }, assertUndefined:function(a) {
    a !== undefined && c._recordThrow("assertUndefined", arguments)
  }, verifyUndefined:function(a) {
    a !== undefined && c._recordTrace("verifyUndefined", arguments)
  }, assertNotUndefined:function(a) {
    a === undefined && c._recordThrow("assertNotUndefined", arguments)
  }, verifyNotUndefined:function(a) {
    a === undefined && c._recordTrace("verifyNotUndefined", arguments)
  }, assertNaN:function(a) {
    isNaN(a) || c._recordThrow("assertNaN", arguments)
  }, verifyNaN:function(a) {
    isNaN(a) || c._recordTrace("verifyNaN", arguments)
  }, assertNotNaN:function(a) {
    isNaN(a) && c._recordThrow("assertNotNaN", arguments)
  }, verifyNotNaN:function(a) {
    isNaN(a) && c._recordTrace("verifyNotNaN", arguments)
  }, assertEqual:function(a, b) {
    c._isEqual(a, b) || c._recordThrow("assertEqual", arguments)
  }, verifyEqual:function(a, b) {
    c._isEqual(a, b) || c._recordTrace("verifyEqual", arguments)
  }, assertNotEqual:function(a, b) {
    c._isEqual(a, b) && c._recordThrow("assertNotEqual", arguments)
  }, verifyNotEqual:function(a, b) {
    c._isEqual(a, b) && c._recordTrace("verifyNotEqual", arguments)
  }, assertSame:function(a, b) {
    a !== b && c._recordThrow("assertSame", arguments)
  }, verifySame:function(a, b) {
    a !== b && c._recordTrace("verifySame", arguments)
  }, assertNotSame:function(a, b) {
    a !== b && c._recordThrow("assertNotSame", arguments)
  }, verifyNotSame:function(a, b) {
    a !== b && c._recordTrace("verifyNotSame", arguments)
  }, _recordTrace:function() {
    c._record.apply(this, arguments);
    console.trace()
  }, _recordThrow:function() {
    c._record.apply(this, arguments);
    throw new Error;
  }, _record:function() {
    console.error(arguments);
    var a = arguments[0] + "(", b = arguments[1];
    if(typeof b == "string") {
      a += b
    }else {
      for(var d = 0;d < b.length;d++) {
        if(d != 0) {
          a += ", "
        }a += b[d]
      }
    }a += ")";
    console.log(a)
  }, _isEqual:function(a, b, d) {
    d || (d = 0);
    if(d > 10) {
      return true
    }if(a == null) {
      if(b != null) {
        console.log("expected: null, actual non-null: ", b);
        return false
      }return true
    }if(typeof a == "number" && isNaN(a)) {
      if(!(typeof b == "number" && isNaN(b))) {
        console.log("expected: NaN, actual non-NaN: ", b);
        return false
      }return true
    }if(b == null) {
      if(a != null) {
        console.log("actual: null, expected non-null: ", a);
        return false
      }return true
    }if(typeof a == "object") {
      if(typeof b != "object") {
        console.log("expected object, actual not an object");
        return false
      }var f = 0;
      for(var e in b) {
        if(typeof b[e] != "function" || typeof a[e] != "function") {
          var g = c._isEqual(b[e], a[e], d + 1);
          if(typeof g != "boolean" || !g) {
            console.log("element '" + e + "' does not match: " + g);
            return false
          }
        }f++
      }b = 0;
      for(e in a) {
        b++
      }if(f != b) {
        console.log("expected object size = " + b + ", actual object size = " + f);
        return false
      }return true
    }if(b != a) {
      console.log("expected = " + a + " (type=" + typeof a + "), actual = " + b + " (type=" + typeof b + ")");
      return false
    }if(a instanceof Array) {
      if(!(b instanceof Array)) {
        console.log("expected array, actual not an array");
        return false
      }if(b.length != a.length) {
        console.log("expected array length = " + a.length + ", actual array length = " + b.length);
        return false
      }for(f = 0;f < b.length;f++) {
        e = c._isEqual(b[f], a[f], d + 1);
        if(typeof e != "boolean" || !e) {
          console.log("element " + f + " does not match: " + e);
          return false
        }
      }return true
    }return true
  }};
  h.test = c
});