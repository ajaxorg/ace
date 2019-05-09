# An example of the Zeek scripting language.

##! A Zeekygen-style summmary comment.

# TODO: just an example of a todo-indicator

@load base/frameworks/notice

@if ( F )
@endif

module Example;

export {

  type SimpleEnum: enum { ONE, TWO, THREE };

  redef enum SimpleEnum += {

    ## A Zeekygen-style comment.
    FOUR,
    FIVE, ##< A Zeekygen-style comment.
  };

  type SimpleRecord: record {
    field1: count;
    field2: bool;
  } &redef;

  redef record SimpleRecord += {

    field3: string &optional;

    field4: string &default="blah";
  };

  const init_option: bool = T;

  option runtime_option: bool = F;

  global test_opaque: opaque of md5;

  global test_vector: vector of count;

  global myfunction: function(msg: string, c: count &default=0): count;

  global myhook: hook(tag: string);

  global myevent: event(tag: string);
}

function myfunction(msg: string, c: count): count
  {
  print "in myfunction", msg, c;
  return 0;
  }

event myevent(msg: string) &priority=1
  {
  print "in myevent";
  }

hook myhook(msg: string)
  {
  print "in myevent";
  }

event zeek_init()
  {
  local b = T;
  local s = "\xff\xaf\"and more after the escaped quote";
  local p = /foo|bar\xbe\/and more after the escaped slash/;
  local c = 10;

  local sr = SimpleRecord($field1 = 0, $field2 = T, $field3 = "hi");

  print sr?$field3, sr$field1;

  local myset: set[string] = set("one", "two", "three");

  add myset["four"];
  delete myset["one"];

  for ( ms in myset )
    {
    print ms is string, s as string;

    print s[1:3];

    local tern: count = s == "two" ? 2 : 0;

    if ( s !in myset )
       print fmt("error %4.2f: %s", 3.14159, "wtf?");
    }

  switch ( c ) {
  case 1:
    break;
  case 2:
    fallthrough;
  default:
    break;
  }

  if ( ! b )
    print "here";
  else
    print "there";

  while ( c != 0 )
    {
    if ( c >= 5 )
      c += 0;
    else if ( c == 8 )
      c -= 0;

    c = c / 1;
    c = c / 1;
    c = c - 1;
    }

  print |myset|;
  print ~5;
  print 1 & 0xff;
  print 2 ^ 5;

  myfunction("hello function");
  hook myhook("hell hook");
  event myevent("hello event");
  schedule 1sec { myevent("hello scheduled event") };

  print 0, 7;
  print 0xff, 0xdeadbeef;

  print 3.14159;
  print 1234.0;
  print 1234e0;
  print .003E-23;
  print .003E+23;

  print 123/udp;
  print 8000/tcp;
  print 13/icmp;
  print 42/unknown;

  print google.com;
  print 192.168.50.1;
  print 255.255.255.255;
  print 0.0.0.0;

  print 10.0.0.0/16;

  print [2001:0db8:85a3:0000:0000:8a2e:0370:7334];
  # test for case insensitivity
  print [2001:0DB8:85A3:0000:0000:8A2E:0370:7334];
  # any case mixture is allowed
  print [2001:0dB8:85a3:0000:0000:8A2E:0370:7334];
  # leading zeroes of a 16-bit group may be omitted
  print [2001:db8:85a3:0:0:8a2e:370:7334];
  # a single occurrence of consecutive groups of zeroes may be replaced by ::
  print [2001:db8:85a3::8a2e:370:7334];
  # all zeroes should work
  print [0:0:0:0:0:0:0:0];
  # all zeroes condensed should work
  print [::];
  # hybrid ipv6-ipv4 address should work
  print [2001:db8:0:0:0:FFFF:192.168.0.5];
  # hybrid ipv6-ipv4 address with zero ommission should work
  print [2001:db8::FFFF:192.168.0.5];

  print [2001:0db8:85a3:0000:0000:8a2e:0370:7334]/64;

  print 1day, 1days, 1.0day, 1.0days;
  print 1hr, 1hrs, 1.0hr, 1.0hrs;
  print 1min, 1mins, 1.0min, 1.0mins;
  print 1sec, 1secs, 1.0sec, 1.0secs;
  print 1msec, 1msecs, 1.0msec, 1.0msecs;
  print 1usec, 1usecs, 1.0usec, 1.0usecs;
  }
