main() {
  print('Hello World!');
}


int fib(int n) => (n > 1) ? (fib(n - 1) + fib(n - 2)) : n;
main() {
  print('fib(20) = ${fib(20)}');
}
/*asd
asdad
*/
0.67
77
.86

#import("http://dartwatch.com/myOtherLibrary.dart");
#import("myOtherLibrary.dart", prefix:"lib1");

"""asdasdads
asdadsadsasd
asdasdasdad"""
 
'23424'

0x234

foo is bar

int x = 4 << 10 
// Create a class for Point.
class Point {
 
  // Final variables cannot be changed once they are assigned.
  // Create two instance variables.
  final num x, y;
 
  // A constructor, with syntactic sugar for setting instance variables.
  Point(this.x, this.y);
 
  // A named constructor with an initializer list.
  Point.origin() : x = 0, y = 0;
 
  // A method.
  num distanceTo(Point other) {
    var dx = x - other.x;
    var dy = y - other.y;
    return sqrt(dx * dx + dy * dy);
  }
}
 
 // Check for null.
var unicorn;
assert(unicorn == null);

// Check for NaN.
var iMeantToDoThis = 0/0;
assert(iMeantToDoThis.isNaN());
