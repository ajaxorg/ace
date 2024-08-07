.section .text
.global _start
.global msg

_start:
    bl _asmtest
    mov r1, r0 // move return value into r1 for syscall write

/* syscall write(int fd, const void *buf, size_t count) */
    mov r0, #1 
    //ldr r1, =msg // done by above call to _asmtest
    ldr r2, =len 
    mov r7, #4 
    svc #0

/* syscall exit(int status) */
    mov r0, #0 
    mov r7, #1 
    svc #0

_asmtest:                           // Start of the function
    ldr r0, =msg                    ; loads pointer for msg into r0
    bx lr                           // Returns from the function


msg:
.ascii "Hello, ARM32!\n"
len = . - msg

// All of these should match as instructions

addhs
adceqs
qaddne
qdaddcs
subcc
sbclo
rsbmi
rscpl
qsubvs
qdsubvc
mulhi
mlals
umullge
umlallt
umaalgt
smullle
smlalal
smulbb
smulwb
smlabt
smlawt
smlaltb
smuad
smladx
smlald
smusdx
smlsd
smlsldx
smmul
smmlar
smmls
mia
miaph
miatt
clz
sadd16
qsub16
shadd8
usub8
uqaddsubx
uhsubaddx
usad8
usada8
mov
movt
movw
mvn
mrs
msr
mra
mar
cpy
tst
teq
and
eor
orr
bic
cmp
cmn
ssat
ssat16
usat
usat16
pkhbt
pkhtb
sxth
sxtb16
sxtb
uxth
uxtb16
uxtb
sxtah
sxtab16
sxtab
uxtah
uxtab16
uxtab
rev
rev16
revsh
sel
b
bl
bx
blx
blx
bxj
cpsid
cpsie
cps
setend
srsia
rfeib
srsda
rfedb
srsfd
rfeed
srsfa
rfeea
bkpt
swi
svc
nop
ldr
ldrt
ldrb
ldrbt
ldrsb
ldrh
ldrsh
ldrd
ldmia
ldmfa
pld
ldrex
str
strt
strb
strbt
strh
strd
stmia
stmfd
strex
swp
swpb
cdp
cdp2
mrc
mrc2
mrrc
mrrc2
mcr
mcr2
mcrr
mcrr2
ldc
ldc2
stc
stc2

// End instruction matching test
