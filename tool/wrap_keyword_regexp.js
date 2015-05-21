// a little script to turn giant keyword regexps into
// something that ace can use; for example: 
//
// \b(NS(Rect(ToCGRect|FromCGRect)|MakeCollectable|S(tringFromProtocol))\b
// 
// into
//
// (?:\\b)(NS(?:Rect(?:ToCGRect|FromCGRect)|MakeCollectable|S(?:tringFromProtocol))(?:\b)

var inputString = process.argv.splice(2)[0];

// solve word boundaries
var outputString = inputString.replace(/\\b/g, "(?:\\\\b)");

// I apparently need to do this, instead of something clever, because the regexp
// lastIndex is screwing up my positional
outputString = outputString.split("b)(");

outputString = outputString[0] + "b)(" + outputString[1].replace(/\(([^\?])/g, "(?:$1");

console.log("\n\n" + outputString + "\n\n");