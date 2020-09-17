GNU    >>SOURCE FORMAT IS FIXED
Cobol *> ***************************************************************
      *> Purpose:   Say hello to GNU Cobol
Hello *> Tectonics: cobc -x bigworld.cob
money *> ***************************************************************
       identification division.
       program-id. bigworld.

DATA   data division.
       working-storage section.
       01 hello                pic $$$$,$$$,$$$,$$$,$$$,$$$.99.
       01 world                pic s9(18)v99 value zero.

       01 people               pic ZZZ,ZZZ,ZZZ,ZZ9.
       01 persons              pic 9(18) value 7182044470.

       01 each                 pic 9(5)v99 value 26202.42.

      *> ***************************************************************
CODE   procedure division.

       multiply persons by each giving world
           on size error
             display "We did it.  We broke the world bank" end-display
       end-multiply

       move world to hello
       move persons to people

       display "Hello, world" end-display
       display " " end-display
       display
           "On " function locale-date(20130927)
           " at " function locale-time(120000)
           ", according to UN estimates:" 
       end-display
       display
           "You were home to some " people  " people,"
           " with an estimated worth of " hello
       end-display

       goback.
       end program bigworld.
