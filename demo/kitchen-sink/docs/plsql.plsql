create or replace package prime#
is
  invalid_argument_error                          exception;

  function nth (
    i_num                                         pls_integer
  ) return number;
end prime#;
/
 
create or replace package body prime#
is
  type t_primes is table of number index by pls_integer;
  b_primes                                       t_primes;

  function is_prime(
    i_candidate                                   number
  ) return boolean
  is
    l_num                           number := 1;
    l_prime                         number;
    l_result                        number;
  begin
  	if i_candidate < 2 then
  	  return false;
  	end if;

    loop
      l_prime := nth(l_num);
      if l_prime = i_candidate then
        return true;
      end if;

      l_result := i_candidate / l_prime;
    	if l_result = ceil(l_result) then
    	  return false;
    	end if;

    	l_num := l_num + 1;
    	exit when l_result <= l_prime;
    end loop;

    return true;
  end is_prime;

  function next (
    i_prime                                       pls_integer
  ) return number
  is
    l_next                          number;
  begin
    l_next := i_prime + case mod(i_prime, 2) when 0 then 1 else 2 end;

    while not is_prime(l_next) loop
      l_next := l_next + 2;
    end loop;
    return l_next;
  end next;
	
  function nth (
    i_num                                         pls_integer
  ) return number
  is
    l_index                         number := 2;
    l_prime                         number := 3;
  begin
    if   i_num < 1
      or ceil(i_num) != i_num
    then
      raise invalid_argument_error;
    end if;

    case i_num
      when 1 then return 2;
      else
        if b_primes.exists(i_num) then
          return b_primes(i_num);
        end if;
        while l_index < i_num loop
          l_index := l_index + 1;
          if b_primes.exists(l_index) then
            l_prime := b_primes(l_index);
          else
            l_prime := next(l_prime);
            b_primes(l_index) := l_prime;
          end if;
        end loop;
        return l_prime;
    end case;
  end nth;

end prime#;
/