build:
	mkdir -p build/src
	./Makefile.dryice.js

clean:
	rm -rf build
	rm -rf ace

ace.tgz: build
	mv build ace-`./version.js`
	cp Readme.md ace
	cp LICENSE ace
	tar cvfz ace-`./version.js`.tgz ace

dist: clean build ace.tgz
