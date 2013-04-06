! sum.f90
! Performs summations using in a loop using EXIT statement
! Saves input information and the summation in a data file
 
program summation
implicit none
integer :: sum, a
 
print*, "This program performs summations. Enter 0 to stop."
open(unit=10, file="SumData.DAT")
 
sum = 0
 
do
 print*, "Add:"
 read*, a
 if (a == 0) then
  exit
 else
  sum = sum + a
 end if
 write(10,*) a
end do
 
print*, "Summation =", sum
write(10,*) "Summation =", sum
close(10)
 