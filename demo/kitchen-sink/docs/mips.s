# Original source from https://eng.libretexts.org
# Kann, Charles W., "Introduction To MIPS Assembly Language Programming" (2015). Open Textbooks. 2.
# https://cupola.gettysburg.edu/oer/2

# Program File: Program2-1.asm
# Author: Charles Kann
# Purpose: First program, Hello World
.text                   # Define the program instructions.
main:                   # Label to define the main program.
    li $v0,4            # Load 4 into $v0 to indicate a print string.
    la $a0, greeting    # Load the address of the greeting into $a0.
    syscall             # Print greeting. The print is indicated by
                        # $v0 having a value of 4, and the string to
                        # print is stored at the address in $a0.
    li $v0, 10          # Load a 10 (halt) into $v0.
    syscall             # The program ends.
.data                   # Define the program data.
greeting: .asciiz "Hello World" #The string to print.
