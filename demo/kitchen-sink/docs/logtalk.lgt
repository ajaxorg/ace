:- object(bottles).

	:- initialization(sing(99)).

	sing(0) :-
		write('No more bottles of beer on the wall, no more bottles of beer.'), nl,
		write('Go to the store and buy some more, 99 bottles of beer on the wall.'), nl, nl.
	sing(N) :-
		N > 0,
		N2 is N - 1,
		beers(N), write(' of beer on the wall, '), beers(N), write(' of beer.'), nl,
		write('Take one down and pass it around, '), beers(N2), write(' of beer on the wall.'), nl, nl,
		sing(N2).

	beers(0) :-
		write('no more bottles').
	beers(1) :-
		write('1 bottle').
	beers(N) :-
		N > 1,
		write(N), write(' bottles').

:- end_object.
