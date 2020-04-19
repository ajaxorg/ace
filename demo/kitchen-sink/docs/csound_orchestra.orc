/*
 * comment
 */
; comment
// comment

instr/**/1,/**/N_a_M_e_,/**/+Name/**///
  iDuration = p3
  outc:a(aSignal)
endin

opcode/**/aUDO,/**/i[],/**/aik//
  aUDO
endop

123 0123456789
0xabcdef0123456789 0XABCDEF
1e2 3e+4 5e-6 7E8 9E+0 1E-2 3. 4.56 .789

"characters$MACRO."
"\\\a\b\n\r\t\012\345\67\""

{{
characters$MACRO.
}}
{{\\\a\b\n\r\t\"\012\345\67}}

+ - ~ ¬ ! * / ^ % << >> < > <= >= == != & # | && || ? : += -= *= /=

0dbfs A4 kr ksmps nchnls nchnls_i sr

do else elseif endif enduntil fi if ithen kthen od then until while
return rireturn

aLabel:
 label2:

goto aLabel
reinit aLabel
cggoto 1==0, aLabel
timout 0, 0, aLabel
loop_ge 0, 0, 0, aLabel

readscore {{
i 1 0 0
}}
pyrun {{
# Python
}}
lua_exec {{
-- Lua
}}

#include/**/"file.udo"
#include/**/|file.udo|

#ifdef MACRO
#else
#ifndef MACRO
#endif
#undef MACRO

#   define MACRO#macro_body#
#define/**/
MACRO/**/
#\#macro
body\##

#define MACRO(ARG1#ARG2) #macro_body#
#define/**/
MACRO(ARG1'ARG2'ARG3)/**/
#\#macro
body\##

$MACRO $MACRO.
$MACRO(x)
@0
@@ 1
$MACRO.(((x#y\)))' "(#'x)\)x\))"# {{x\))x)\)(#'}});
