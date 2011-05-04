build:
	mkdir -p build/src
	mkdir -p build/textarea/src
	./Makefile.dryice.js
	./Makefile.dryice.textarea.js

clean:
	rm -rf build
	rm -rf ace-*
	rm -f ace-*.tgz

ace.tgz: build
	mv build ace-`./version.js`/
	cp Readme.md ace-`./version.js`/
	cp LICENSE ace-`./version.js`/
	tar cvfz ace-`./version.js`.tgz ace-`./version.js`/

dist: clean build ace.tgz
