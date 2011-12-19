build:
	git rev-parse HEAD > .git-ref
	mkdir -p build/src
	mkdir -p build/demo/kitchen-sink
	mkdir -p build/textarea/src
	
	cp -r demo/kitchen-sink/styles.css build/demo/kitchen-sink/styles.css
	cp demo/kitchen-sink/logo.png build/demo/kitchen-sink/logo.png
	cp -r doc/site/images build/textarea
	
	./Makefile.dryice.js normal
	./Makefile.dryice.js demo
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
