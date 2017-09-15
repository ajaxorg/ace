Red [
	Author: "Toomas Vooglaid"
	Date: 7-9-2017
]
context [
	mtx: object [
		rows: cols: data: none
		get-col: func [col][extract at data col cols]
		get-row: func [row][copy/part at data row - 1 * cols + 1 cols]
		get-idx: func [row col][pick data row - 1 * cols + col]
		to-float: does [forall data [data/1: system/words/to-float data/1]]
		swap-dim: does [c: cols cols: rows rows: c]
		transpose: has [d i j r c][
			d: copy []
			repeat i cols [repeat j rows [append d get-idx j i]]
			swap-dim
			data: d
			self
		]
		rotate: func [n [integer!] /local d i][
			d: copy []
			switch n [
				1 [repeat i cols [append d copy reverse get-col i] swap-dim]
				2 [repeat i rows [append d reverse copy get-row rows + 1 - i]]
				3 [repeat i cols [append d copy get-col cols + 1 - i] swap-dim]
			]
			data: d 
			self
		]
		show: does [new-line/skip copy data true]
		pretty: function [/bar][;[/local d i col-lengths][
			col-lengths: copy []
			repeat i cols [
				c: copy get-col i
				c: sort/compare c func [a b][(length? form a) > (length? form b)]
				append col-lengths length? form first c
			]
			cols2: copy []
			templ: copy []
			letters: "abcdefghijklmnopqrstuvwyz" 
			repeat n cols [
				append cols2 to-word pick letters n
				append templ compose [
					pad/left (to-word pick letters n) (pick col-lengths n) (either bar and (n < cols) ["|"][""])
				]
			]
			print "^/"
			foreach (cols2) data [
				print compose templ
			]
			print "^/"
		]
	]
	add: func [op m1 m2][
		either all [m1/cols = m2/cols m1/rows = m2/rows][;length? m1/data length? m2/data [ 
			repeat i length? m1/data [m1/data/:i: m1/data/:i op m2/data/:i]
		][
			cause-error 'user 'message ["Matrices of unequal dimensions!"]
		]
		m1
	]
	multi: func [m1 m2 /local m3 val i j k l][
		either equal? l: m1/cols m2/rows [
			m3: make mtx [rows: m1/rows cols: m2/cols data: make block! (m1/rows * m2/cols)]
			repeat i m1/rows [
				repeat j m2/cols [
					val: 0
					repeat k l [val: (m1/get-idx i k) * (m2/get-idx k j) + val]
					append m3/data val
				]
			]
		][
			cause-error 'user 'message ["Dimensions don't match in multiplication!"]
		]
		m3
	]
	kronecker: func [m1 m2 /local m3 i j k l][
		m3: make mtx [rows: m1/rows * m2/rows cols: m1/cols * m2/cols data: make block! rows * cols]
		repeat i m1/rows [
			repeat j m2/rows [
				repeat k m1/cols [
					repeat l m2/cols [
						append m3/data (m1/get-idx i k) * (m2/get-idx j l)
		]]]]
		m3
	]
	transpose: func [m /local d i j r c][
		d: copy []
		repeat i c: m/cols [repeat j r: m/rows [append d m/get-idx j i]]
		m/cols: r m/rows: c	m/data: d
		m
	]
	rotate: func [n [integer!] m /local data i][
		data: copy []
		switch n [
			1 [repeat i m/cols [append data copy reverse m/get-col i] m/swap-dim]
			2 [repeat i m/rows [append data reverse copy m/get-row m/rows + 1 - i]]
			3 [repeat i m/cols [append data copy m/get-col m/cols + 1 - i] m/swap-dim]
		]
		m/data: data 
		m
	]
	ops-rule: ['+ | '- | '* | '/ | '% | '** | '>> | '<< | '>>> | 'and | 'or | 'xor | 'div | 'x]
	set 'matrix func [spec /local rule result m w m1 m2 op op' var vars ops unary matrices][
		vars: copy [] ops: copy [] matrices: copy []
		matrix-rule: [[
			set dim pair! [set mdata block! | set w word! if (block? get/any w)(mdata: get w)] 
			(either (dim/1 * dim/2) = length? mdata: reduce mdata [
				m: make mtx [rows: dim/1 cols: dim/2 data: mdata]
			][
				cause-error 'user 'message ["Data length does not match dimensions!"]
			]
			)
		|	set w word! if (object? get/any w)(set w m: make mtx get w)
		| 	set m number!
		]	(insert matrices m)]
		
		parse spec rule: [(m: none)[some [
			ahead paren! into rule
		|	set var set-word! (insert vars var) rule (var: take vars set var copy matrices/1)
		|	set unary ['transpose | 'rotate set n integer! | 'invert] rule (
				switch/default unary [
					rotate [self/rotate n matrices/1]
				][
					self/:unary matrices/1
				]
			)
		|	set op' ops-rule (insert ops op') [matrix-rule | ahead paren! into rule] (
				op': take ops set [m2 m1] take/part matrices 2
				case [
					op' = 'div [op: :/ either number? m1 [m1: to-float m1][m1/to-float]]
					op' = 'x []
					true [op: get op']
				]
				case [
					all [number? reduce m1 number? reduce m2] [m1: (reduce m1) op reduce m2]
					number? reduce m1 [data: m2/data forall data [data/1: (reduce m1) op data/1] m1: m2]
					number? reduce m2 [data: m1/data forall data [data/1: data/1 op reduce m2]]
					true [case [
						find exclude ops-rule ['x] op' [m1: self/add :op m1 m2]
						(same? op' 'x) or same? op' '× [m1: self/multi m1 m2]
						same? op' 'X [m1: self/kronecker m1 m2]
					]]
				]
				insert matrices m1
			)
		|	matrix-rule
		|	s: print ["No rule applied at: " :s]
		]]]
		either number? m1: take matrices [m1][new-line/skip copy m1/data true m1/cols]
	]
]