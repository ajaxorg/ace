#[  #[ Multiline comment in already
   commented out code. ]#
proc p[T](x: T) = discard
]#
echo "This is code"
var
    p = 0B0_10001110100_0000101001000111101011101111111011000101001101001001'f64

proc getAlphabet(): string =
  var accm = ""
  for letter in 'a'..'z':  # see iterators
    accm.add(letter)
  return accm

assert("a" * 10 == "aaaaaaaaaa")
