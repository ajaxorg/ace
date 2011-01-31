build:
	mkdir -p build/theme
	./Makefile.dryice.js

clean:
	rm -rf build
	rm -rf ace

ace.tgz: build
	mkdir ace
	cp -r build ace/src
	cp Readme.md ace
	cp LICENSE ace
	tar cvfz ace-`./version.js`.tgz ace

dist: clean build ace.tgz
