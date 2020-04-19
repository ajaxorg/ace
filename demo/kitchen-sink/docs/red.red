Red []
info: func ['fn  /name /intro /args /refinements /locals /return /spec 
	/arg-num /arg-names /arg-types /ref-names /ref-types /ref-num /type
	/local intr ars refs locs ret arg ref typ
][
	intr: copy "" ars: make map! copy [] refs: make map! copy [] locs: copy [] ret: copy [] typ: ref-arg: ref-arg-type: none
	if lit-word? fn [fn: to-word fn]
	unless find [op! native! function! action!] type?/word get fn [
		cause-error 'user 'message ["Only function types accepted!"]
	]
	out: make map! copy []
	specs: spec-of get fn 
	parse specs [
		opt [set intr string!]
		any [set arg [word! | lit-word!] opt [set typ block!] opt string! (put ars arg either typ [typ][[any-type!]])]
		any [set ref refinement! [
			if (ref <> /local) (put refs to-lit-word ref make map! copy []) 
				opt string! 
				any [set ref-arg word! opt [set ref-arg-type block!] 
					(put refs/(to-word ref) to-lit-word ref-arg either ref-arg-type [ref-arg-type][[any-type!]])
				]
			|	any [set loc word! (append locs loc) opt string!] 
				opt [set-word! set ret block!]
		]]
		
		(
		out: case [
			name		[to-word fn]
			intro 		[intr] 
			args		[ars]
			arg-num		[length? ars]
			arg-names 	[copy keys-of ars] 
			arg-types	[copy values-of ars]
			refinements [refs] 
			ref-names	[copy keys-of refs]
			ref-types	[copy values-of refs]
			ref-num		[length? refs]
			locals 		[locs] 
			return 		[ret]
			spec		[specs]
			true 		[
				make object!  [
					name: 		to-word fn 
					intro: 		intr 
					args: 		ars 
					refinements: refs 
					locals: 	locs 
					return: 	ret 
					spec: 		specs 
					type: 		type? get fn
					arg-num: 	length? args
					arg-names: 	copy keys-of args
					arg-types: 	copy values-of args
					ref-names: 	copy keys-of refinements
					ref-types: 	copy values-of refinements
					ref-num:	length? refinements
				]
			]
		])
	]
	out
]
