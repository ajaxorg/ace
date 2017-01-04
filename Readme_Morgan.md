# To update with latest ace changes:

* pull changes; use github GUI on windows app, select 'Update from ajaxorg/master'. This will result in some merge errors

* update the following files manually by getting latest version from ajaxorg/master and overriding local file, then put my changes back into the file:

   * lib/ace/ext/language_tools.js: line 115 - fix for loadSnippetsForMode

   * demo/kitchen-sink/docs/html.html: updated documentation (minor) https://github.com/sevin7676/ace/commit/447a22348ff3f22bd1817e3a558e384284ea3b64#diff-907e7ab8b42a588fcc66d6da9d37cb06

   * Makefile.dryice.js: added function to build tern files https://github.com/sevin7676/ace/commit/753c36a8d4be239401e3f8f0dee4cbf54872b095

   * lib/ace/autocomplete/popup.js: add showing of icon in popup

   * NOTE: snippets.js had a change but it was just a spacing thing; no real change was made

# files that this repo adds (in adddition to master)

* demo/tern.js
* demo/tern.html
* lib/ace/tern/tern.js
* lib/ace/tern/tern_server.js
* lib/ace/tern/worker-tern.js
* Readme_Morgan.md

