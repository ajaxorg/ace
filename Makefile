build:
	mkdir -p build/src
	mkdir -p build/demo
	mkdir -p build/textarea/src
	
	cp demo/styles.css build/demo/styles.css
	cp demo/logo.png build/demo/logo.png
	
	./Makefile.dryice.js normal
	./Makefile.dryice.js bm

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
