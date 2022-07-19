##
## Basic Java packages and import
snippet im
	import
snippet w.l
	wollok.lang
snippet w.i
	wollok.lib

## Class and object
snippet cl
	class ${1:`Filename("", "untitled")`} ${2}
snippet obj
	object ${1:`Filename("", "untitled")`} ${2:inherits Parent}${3}
snippet te
	test ${1:`Filename("", "untitled")`}

##
## Enhancements
snippet inh
	inherits

##
## Comments
snippet /*
	/*
	 * ${1}
	 */

##
## Control Statements
snippet el
	else
snippet if
	if (${1}) ${2}

##
## Create a Method
snippet m
	method ${1:method}(${2}) ${5}

##  
## Tests
snippet as
	assert.equals(${1:expected}, ${2:actual})

##
## Exceptions
snippet ca
	catch ${1:e} : (${2:Exception} ) ${3}
snippet thr
	throw
snippet try
	try {
		${3}
	} catch ${1:e} : ${2:Exception} {
	}

##
## Javadocs
snippet /**
	/**
	 * ${1}
	 */

##
## Print Methods
snippet print
	console.println("${1:Message}")

##
## Setter and Getter Methods
snippet set
	method set${1:}(${2:}) {
		$1 = $2
	}
snippet get
	method get${1:}() {
		return ${1:};
	}

##
## Terminate Methods or Loops
snippet re
	return