#!/usr/bin/perl
=begin
 perl example code for Ace
=cut

use v5.10;
use strict;
use warnings;

use List::Util qw(first);
my @primes;

# Put 2 as the first prime so we won't have an empty array
push @primes, 2;

for my $number_to_check (3 .. 200) {
    # Check if the current number is divisible by any previous prime
    # if it is, skip to the next number.  Use first to bail out as soon
    # as we find a prime that divides it.
    next if (first {$number_to_check % $_ == 0} @primes);

    # If we reached this point it means $number_to_check is not
    # divisable by any prime number that came before it.
    push @primes, $number_to_check;
}

# List out all of the primes
say join(', ', @primes);
