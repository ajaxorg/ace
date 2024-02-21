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
