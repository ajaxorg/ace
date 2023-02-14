# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.15.0](https://github.com/ajaxorg/ace/compare/v1.14.0...v1.15.0) (2023-01-25)


### Features

* Added Editor API to set the ghost text ([#5036](https://github.com/ajaxorg/ace/issues/5036)) ([958d573](https://github.com/ajaxorg/ace/commit/958d57383c4ebfacd414eb817aecc2e0982d1b36))


### Bug Fixes

* Added highlighting for TIES keyword introduced in PostgreSQL 13 ([#5033](https://github.com/ajaxorg/ace/issues/5033)) ([9588086](https://github.com/ajaxorg/ace/commit/95880868c2a9912f7c6a2c3942d67fc2a980094e))
* editor shadow appears under the selected line background when horizontal scroll is active ([#5020](https://github.com/ajaxorg/ace/issues/5020)) ([ab4f788](https://github.com/ajaxorg/ace/commit/ab4f788455ae182ae133fa202d737efa5461ff79))
* Remove broken keybinding from vscode mode ([#5032](https://github.com/ajaxorg/ace/issues/5032)) ([68ff964](https://github.com/ajaxorg/ace/commit/68ff964a214cc2da66e4a35b313ff66dd4490e34))

## [1.14.0](https://github.com/ajaxorg/ace/compare/v1.13.1...v1.14.0) (2022-12-12)


### Features

* Autocomplete accessibility features ([#5008](https://github.com/ajaxorg/ace/issues/5008)) ([3b7bb5e](https://github.com/ajaxorg/ace/commit/3b7bb5e4afbad0f2bdbc7f8487442a5cb78b8284))


### Bug Fixes

* Add missing options to `EditorOptions` ([#5003](https://github.com/ajaxorg/ace/issues/5003)) ([451b63f](https://github.com/ajaxorg/ace/commit/451b63f2243762d6de2fc5b9ee8c580c348b933c))
* added GREATEST|LEAST logical functions added in SQL Server 2022 ([#5009](https://github.com/ajaxorg/ace/issues/5009)) ([e3f3e7a](https://github.com/ajaxorg/ace/commit/e3f3e7ab3efe540ac345325f06278a8ab1871371))
* Better ES6 support for JavaScript Mode ([6fb39e3](https://github.com/ajaxorg/ace/commit/6fb39e38c79dd966233e48ed06be800c59c4c101))
* Fix vim keybindings scroll to the selected line ([#4980](https://github.com/ajaxorg/ace/issues/4980)) ([8562f94](https://github.com/ajaxorg/ace/commit/8562f9493e0ebef865064992f0526fdc6df8535a))
* show 2 context characters of a line when moving to it ([#4998](https://github.com/ajaxorg/ace/issues/4998)) ([743190e](https://github.com/ajaxorg/ace/commit/743190ea71841c0186b2f513b3d1e1a9e30d3de3))
* Update ace.d.ts typings for navigate ([#5011](https://github.com/ajaxorg/ace/issues/5011)) ([a302709](https://github.com/ajaxorg/ace/commit/a30270990cc0041edb6985059915f96524ebb154))

### [1.13.2](https://github.com/ajaxorg/ace/compare/v1.13.1...v1.13.2) (2022-12-07)


### Bug Fixes

* Add missing options to `EditorOptions` ([#5003](https://github.com/ajaxorg/ace/issues/5003)) ([451b63f](https://github.com/ajaxorg/ace/commit/451b63f2243762d6de2fc5b9ee8c580c348b933c))
* Better ES6 support for JavaScript Mode ([6fb39e3](https://github.com/ajaxorg/ace/commit/6fb39e38c79dd966233e48ed06be800c59c4c101))
* Fix vim keybindings scroll to the selected line ([#4980](https://github.com/ajaxorg/ace/issues/4980)) ([8562f94](https://github.com/ajaxorg/ace/commit/8562f9493e0ebef865064992f0526fdc6df8535a))
* show 2 context characters of a line when moving to it ([#4998](https://github.com/ajaxorg/ace/issues/4998)) ([743190e](https://github.com/ajaxorg/ace/commit/743190ea71841c0186b2f513b3d1e1a9e30d3de3))

### [1.13.1](https://github.com/ajaxorg/ace/compare/v1.13.0...v1.13.1) (2022-11-16)


### Bug Fixes

* Change curly braces insertion behavior for Markdown to act the same as for other braces ([#4994](https://github.com/ajaxorg/ace/issues/4994)) ([2760234](https://github.com/ajaxorg/ace/commit/2760234d3d8d1acba72a42df7763482655af5ebc))
* incorrect cursor position for very long lines ([#4996](https://github.com/ajaxorg/ace/issues/4996)) ([e57a9d9](https://github.com/ajaxorg/ace/commit/e57a9d9eef0c056cd38a07c77c460bea39cc9551))

## [1.13.0](https://github.com/ajaxorg/ace/compare/v1.12.5...v1.13.0) (2022-11-11)


### Features

* add highlight mode for Apache JEXL ([#4979](https://github.com/ajaxorg/ace/issues/4979)) ([4e8926e](https://github.com/ajaxorg/ace/commit/4e8926ef9f9207e57529e07cdbe2305b09e712e2))


### Bug Fixes

* Add missing options to `VirtualRendererOptions` and `EditorOptions` ([#4983](https://github.com/ajaxorg/ace/issues/4983)) ([19dd2ec](https://github.com/ajaxorg/ace/commit/19dd2ecc178bef2fedd6a53900f2db58ea7a3c23))
* Fix of scroll while interrupting animation ([#4993](https://github.com/ajaxorg/ace/issues/4993)) ([0092f3f](https://github.com/ajaxorg/ace/commit/0092f3f8c1f0d9c8a0b8bebe58cc3517931697b7))
* rare case when document passed to `dom.scrollbarWidth` doesn't have `documentElement` ([#4981](https://github.com/ajaxorg/ace/issues/4981)) ([df44158](https://github.com/ajaxorg/ace/commit/df441585ef44e17a027141e3ceed648e104e9cf9))

### [1.12.5](https://github.com/ajaxorg/ace/compare/v1.12.4...v1.12.5) (2022-11-01)


### Bug Fixes

* enableLiveAutocompletion documentation ([#4976](https://github.com/ajaxorg/ace/issues/4976)) ([987ab76](https://github.com/ajaxorg/ace/commit/987ab7602e06acc9b08c75914f5c1335d5cdc8cc))
* vim "normal" mode brackets highlighting ([0fbc54c](https://github.com/ajaxorg/ace/commit/0fbc54cc5130b0271928995660413ba0fab678cb))

### [1.12.4](https://github.com/ajaxorg/ace/compare/v1.12.3...v1.12.4) (2022-10-31)


### Bug Fixes

* Open valid url under cursor ([#4970](https://github.com/ajaxorg/ace/issues/4970)) ([bf2913a](https://github.com/ajaxorg/ace/commit/bf2913a71624e94d13727115b2aa0ef0c279c89f))
* Update for Csound 6.18.0 ([#4974](https://github.com/ajaxorg/ace/issues/4974)) ([6886b02](https://github.com/ajaxorg/ace/commit/6886b0233e9e1d8d6cce5d3ade7b27fe4527c940))
* update/add missing demo samples ([#4975](https://github.com/ajaxorg/ace/issues/4975)) ([2b8236e](https://github.com/ajaxorg/ace/commit/2b8236eaf1df10caa9ff45a06902df14947cd968))

### [1.12.3](https://github.com/ajaxorg/ace/compare/v1.12.2...v1.12.3) (2022-10-18)


### Bug Fixes

* Fix syntax error in the custom scroll CSS ([#4968](https://github.com/ajaxorg/ace/issues/4968)) ([f2a424a](https://github.com/ajaxorg/ace/commit/f2a424a649f655b9511b1bb6047097634edb0e3f))

### [1.12.2](https://github.com/ajaxorg/ace/compare/v1.12.1...v1.12.2) (2022-10-18)


### Bug Fixes

* custom scrollbar breaks csp mode ([#4967](https://github.com/ajaxorg/ace/issues/4967)) ([be8eb12](https://github.com/ajaxorg/ace/commit/be8eb1236fb7e1d27cedf033d301f094ec6764e5))
* find all in range bug ([13bd553](https://github.com/ajaxorg/ace/commit/13bd55348dc8de5c547c74ec0e48c52b6db96a26))
* Namespace-relative names for php ([#4963](https://github.com/ajaxorg/ace/issues/4963)) ([96e4066](https://github.com/ajaxorg/ace/commit/96e4066341fb7b82d02ad8272929711073d3bfc4))

### [1.12.1](https://github.com/ajaxorg/ace/compare/v1.12.0...v1.12.1) (2022-10-17)


### Bug Fixes

* php worker rules for T_NAME_FULLY_QUALIFIED ([#4960](https://github.com/ajaxorg/ace/issues/4960)) ([52dbb05](https://github.com/ajaxorg/ace/commit/52dbb0577693e29f124a1f16008b4e11e2ce7c02))
* recognisition of uppercase hex numbers for stylus mode ([#4962](https://github.com/ajaxorg/ace/issues/4962)) ([87e0dc7](https://github.com/ajaxorg/ace/commit/87e0dc7b868798300e874e39304aeda18d3d1a76))

## [1.12.0](https://github.com/ajaxorg/ace/compare/v1.11.2...v1.12.0) (2022-10-15)


### Features

* implement BibTeX mode highlighting ([ab9e191](https://github.com/ajaxorg/ace/commit/ab9e1916cb3363260de58b808bdc21fd6bc01618))


### Bug Fixes

* `MockDom's` `ClassList` `toggle` and `contains` methods return `boolean` instead of `void` ([e8c0a1f](https://github.com/ajaxorg/ace/commit/e8c0a1f35d302966626896aaf84b056e76a8e66e))
* change lua version to 5.3 ([#4954](https://github.com/ajaxorg/ace/issues/4954)) ([fc56af5](https://github.com/ajaxorg/ace/commit/fc56af5936a2ebfdfa0871ca6a68ccf7ecc7dbf0))
* documentation for TokenIterator methods ([#4955](https://github.com/ajaxorg/ace/issues/4955)) ([6bff7b4](https://github.com/ajaxorg/ace/commit/6bff7b43c7ad34dd5fafc81c5de773e9d709026d))
* Fixed comment folding bugs for html (xml like languages) ([#4910](https://github.com/ajaxorg/ace/issues/4910)) ([5279a8a](https://github.com/ajaxorg/ace/commit/5279a8a71719bf5c7099db1774a3d9669d9e5694))
* mode change for vim tests ([236a31e](https://github.com/ajaxorg/ace/commit/236a31e5d69fd4fd874b667b38dd1bf0685f75c5))
* php worker rules for `T_NAME_FULLY_QUALIFIED`, `T_NAME_QUALIFIED`, `T_NAME_RELATIVE` namespaced names tokens ([#4948](https://github.com/ajaxorg/ace/issues/4948)) ([059ff71](https://github.com/ajaxorg/ace/commit/059ff7186ac95d38fa11821488c847d3786d3486))
* tools to work with new ace project structure ([7894c4b](https://github.com/ajaxorg/ace/commit/7894c4bbc6da5eb3521efb3b89b1a189202c2497))

### [1.11.2](https://github.com/ajaxorg/ace/compare/v1.11.1...v1.11.2) (2022-09-26)


### Bug Fixes

* Fixed handling surrogare characters in insert, replace, delete mode in Vim ([72fd4b7](https://github.com/ajaxorg/ace/commit/72fd4b7b616f070be198dc8fc437d48a74637a53))
* Fixed handling surrogate characters in insert-after mode in Vim ([38f893a](https://github.com/ajaxorg/ace/commit/38f893a13b1f1dedea4407a8f3ef1d6098873269))

### [1.11.1](https://github.com/ajaxorg/ace/compare/v1.11.0...v1.11.1) (2022-09-23)


### Bug Fixes

* Discrepancy between keywords used by mode-aql.js in the current version and the version used by arangodb ([1503dd0](https://github.com/ajaxorg/ace/commit/1503dd06f2d651d16af964978fb8c62e0304b6d6))
* The editor can be crashed by passing in undefined into the setValue method ([56e6e56](https://github.com/ajaxorg/ace/commit/56e6e56137ea5717009e3687019f64dae7f88da2))
* Update vim mode ([#4933](https://github.com/ajaxorg/ace/issues/4933)) ([3b89ed0](https://github.com/ajaxorg/ace/commit/3b89ed06069cb45edb59b7442b5cc6c15b33cfa4))

## [1.11.0](https://github.com/ajaxorg/ace/compare/v1.10.1...v1.11.0) (2022-09-20)


### Features

* add gutter indicators for annotations; add custom scrollbar to display gutter indicators ([62fb0d8](https://github.com/ajaxorg/ace/commit/62fb0d8fba813241d01356962ed20ac868a29ede))


### Bug Fixes

* change scroll behaviour for `onmousedown` to immediate scroll to point ([392b224](https://github.com/ajaxorg/ace/commit/392b224ceb4e82b4d906c36aef2ea4953e3d440e))
* Do not try apply highlight indent guide if the file is empty ([#4928](https://github.com/ajaxorg/ace/issues/4928)) ([a90ef27](https://github.com/ajaxorg/ace/commit/a90ef275298b524c493076e47aae13036f6e6271))
* restrict annotation mark max height and optimise marks coords on canvas ([a6e2259](https://github.com/ajaxorg/ace/commit/a6e2259eb0a282c62fd9e6fde31d86b6c14ec06d))

### [1.10.1](https://github.com/ajaxorg/ace/compare/v1.10.0...v1.10.1) (2022-09-06)


### Bug Fixes

* prevent javascript snippets file confusing old packagers ([#4917](https://github.com/ajaxorg/ace/issues/4917)) ([5d7b65c](https://github.com/ajaxorg/ace/commit/5d7b65c30aff0106a7001f68ecdf13a23893eaad))

## [1.10.0](https://github.com/ajaxorg/ace/compare/v1.9.6...v1.10.0) (2022-08-31)


### Features

* editor option for indent guide highlighting ([f1f6517](https://github.com/ajaxorg/ace/commit/f1f6517a30d6819d1c8ca045744cdeb2925ccf0a))


### Bug Fixes

* add mock `getHighlightIndentGuides` and `setHighlightIndentGuides` for old tests to work ([4067512](https://github.com/ajaxorg/ace/commit/4067512a72934b23a0866eca33812425c37a7363))
* added "flex-start" and "flex-end" ([#4912](https://github.com/ajaxorg/ace/issues/4912)) ([3e14988](https://github.com/ajaxorg/ace/commit/3e14988209354f94483307f168705690e15adaf5))
* Fix problematic semicolon in CSS media queries ([#4849](https://github.com/ajaxorg/ace/issues/4849)) ([18a459a](https://github.com/ajaxorg/ace/commit/18a459a26430bfa58e0f798c4bacce6a799c77bd))
* more optimal way to accessing an element's list of classes; mark `highlightIndentGuide` as internal property ([855a874](https://github.com/ajaxorg/ace/commit/855a874ffde4824bb8de6e56cb44fad64d49725b))
* strictly equal instead of loosely ([d4c1ab8](https://github.com/ajaxorg/ace/commit/d4c1ab8ef6ee608e2570b7ca6d1d941c5a6628a9))
* Updated Jshint to 2.13.5 ([#4911](https://github.com/ajaxorg/ace/issues/4911)) ([2401fbd](https://github.com/ajaxorg/ace/commit/2401fbd93f0d61cc01150c1071145e974dd6693f))

### [1.9.6](https://github.com/ajaxorg/ace/compare/v1.9.5...v1.9.6) (2022-08-17)


### Bug Fixes

* better way to extract css for csp environments ([1b0612b](https://github.com/ajaxorg/ace/commit/1b0612b5a5ed33a2f1931e4aa08cb2d54ec8585c))

### [1.9.5](https://github.com/ajaxorg/ace/compare/v1.9.4...v1.9.5) (2022-08-10)


### Bug Fixes

* reverted fix build script CSS extract with `options.compress` ([#4894](https://github.com/ajaxorg/ace/issues/4894)) ([8fa4500](https://github.com/ajaxorg/ace/commit/8fa45008887c957bc9c78c65e805e73240f2b33f))

### [1.9.4](https://github.com/ajaxorg/ace/compare/v1.9.2...v1.9.4) (2022-08-09)

### [1.9.3](https://github.com/ajaxorg/ace/compare/v1.9.2...v1.9.3) (2022-08-08)

### [1.9.2](https://github.com/ajaxorg/ace/compare/v1.9.1...v1.9.2) (2022-08-08)

### [1.9.1](https://github.com/ajaxorg/ace/compare/v1.9.0...v1.9.1) (2022-08-08)

## [1.9.0](https://github.com/ajaxorg/ace/compare/v1.8.1...v1.9.0) (2022-08-08)


### Features

* added ability to limit amount of undos/redos ([#4872](https://github.com/ajaxorg/ace/issues/4872)) ([897ee0a](https://github.com/ajaxorg/ace/commit/897ee0a071ef4341338a285a1d9d8781fe5689de))
* publish Ace source code to ace-code NPM package ([#4881](https://github.com/ajaxorg/ace/issues/4881)) ([66cf041](https://github.com/ajaxorg/ace/commit/66cf0418bedf221a507d9a173583538c97885410))


### Bug Fixes

* Fix determination of anonymous code blocks in Postgres Mode (fixes [#4790](https://github.com/ajaxorg/ace/issues/4790)) ([06f7e22](https://github.com/ajaxorg/ace/commit/06f7e2290543ca6566aab56228a8fc8daddfcf55))
* Fixed Ace typings ([23208f2](https://github.com/ajaxorg/ace/commit/23208f2f19020d1f69b90bc3b02460bda8422072))
* Fixed jsDoc annotations ([e15abb4](https://github.com/ajaxorg/ace/commit/e15abb443abfad2de59c620ce49fc5498ce6d33e)), closes [#4879](https://github.com/ajaxorg/ace/issues/4879)
* refactor of kotlin mode to simplify states and resolve incorrect highlights ([a30a99d](https://github.com/ajaxorg/ace/commit/a30a99df731c2f10c2006181ca58a96e7fc21155))
* returned precise highlight for functions params, generics and types ([967aa6b](https://github.com/ajaxorg/ace/commit/967aa6b05c4a69a5deac1b20c297648444ade7d6))
* Rust identifiers normally recognised now; generics highlight support; doc comments support ([#4868](https://github.com/ajaxorg/ace/issues/4868)) ([bbb5800](https://github.com/ajaxorg/ace/commit/bbb5800b4cf56d2996691edc63edc2783e19f427))

### [1.8.1](https://github.com/ajaxorg/ace/compare/v1.8.0...v1.8.1) (2022-07-21)


### Bug Fixes

* prevent race condition when creating css files in build ([1777bfb](https://github.com/ajaxorg/ace/commit/1777bfb7dca4dcaf575293ac9cacbc284f692351))

## [1.8.0](https://github.com/ajaxorg/ace/compare/v1.7.1...v1.8.0) (2022-07-20)


### Features

* Use mini require ([#4845](https://github.com/ajaxorg/ace/issues/4845)) ([b9fabd4](https://github.com/ajaxorg/ace/commit/b9fabd47c0765d40117809cd3978b95d593370fb))


### Bug Fixes

* add undocumented Target command ([62e8e9e](https://github.com/ajaxorg/ace/commit/62e8e9e4d3b21552dd83d454b7fd55d4981d096a)), closes [#4839](https://github.com/ajaxorg/ace/issues/4839)
* added NSIS 3.08 commands ([acad68c](https://github.com/ajaxorg/ace/commit/acad68cf92f5372257b061e300e31f71df9c62e9)), closes [#4838](https://github.com/ajaxorg/ace/issues/4838)
* **bidihandler:** check for undefined before access length property on `splits` variable ([457b657](https://github.com/ajaxorg/ace/commit/457b65748f331740ded529fd7bbd06b86819fa4e))
* correct highlight of php heredoc strings with one word on line ([ae4564c](https://github.com/ajaxorg/ace/commit/ae4564c2961b006ca849625a0dee1093061eba5a))
* Fixed typo in Nord Dark theme. ([#4843](https://github.com/ajaxorg/ace/issues/4843)) ([38bf666](https://github.com/ajaxorg/ace/commit/38bf6663f43be1c45bfba3dc68c4a4820fb2661d))
* Move session.onChange and placeholder.onChange handlers to be first in the change event handler queue ([bcb51f2](https://github.com/ajaxorg/ace/commit/bcb51f2b2a2ba2e1f30ebf543d97e7450574763f))
* reuse `getTargetDir` function ([b89c4db](https://github.com/ajaxorg/ace/commit/b89c4db3424687856ff9c9e732435c35438b0cb9))
* type declarations ([a8830fc](https://github.com/ajaxorg/ace/commit/a8830fc83708a7e51053038f1c6d7fde23e82e9d))

### [1.7.1](https://github.com/ajaxorg/ace/compare/v1.7.0...v1.7.1) (2022-06-29)


### Bug Fixes

* Fixed accessing properties when err is null in onerror handler ([3b62a07](https://github.com/ajaxorg/ace/commit/3b62a0713e68fd76bfa9c52fa2112b56888d2349))
* Uncaught TypeError: Cannot read properties of undefined in worker code ([ce068ac](https://github.com/ajaxorg/ace/commit/ce068ac29f0056f6a10d0fc99181b8ba3e274cfe))

## [1.7.0](https://github.com/ajaxorg/ace/compare/v1.6.1...v1.7.0) (2022-06-28)


### Features

* Add Robot Framework syntax highlighting ([773c0c5](https://github.com/ajaxorg/ace/commit/773c0c5d8b87fabb643d8c1e2053f536c53318e8)), closes [#4614](https://github.com/ajaxorg/ace/issues/4614)
* Added YAML language linter ([451f915](https://github.com/ajaxorg/ace/commit/451f915e645f8a172098316196ae2e029fc26aed)), closes [#3979](https://github.com/ajaxorg/ace/issues/3979)


### Bug Fixes

* Added two tmthemes gruvbox dark (hard) and light (hard) ([6b1e67f](https://github.com/ajaxorg/ace/commit/6b1e67f844056fd238a35094e8f4e4b197e0a9a4)), closes [#3673](https://github.com/ajaxorg/ace/issues/3673)
* adds ignore browserified dir to eslintignore ([56b591b](https://github.com/ajaxorg/ace/commit/56b591b49673fcd062fd53325f74629d4cf45e3f))
* Allow setAnnotations to use custom className ([f505879](https://github.com/ajaxorg/ace/commit/f505879d0463a8b2781e0e7caaaa857444d51f85)), closes [#4362](https://github.com/ajaxorg/ace/issues/4362)
* Avoid substitutions when Webpack was introduced ([a540323](https://github.com/ajaxorg/ace/commit/a540323e933c6bad164bdc9f103d8de744ee1546)), closes [#4476](https://github.com/ajaxorg/ace/issues/4476)
* Highlighting DISTINCT keyword in SQL ([fb3820a](https://github.com/ajaxorg/ace/commit/fb3820a9c1624c49a149d388bf26aa3d504704bb)), closes [#4399](https://github.com/ajaxorg/ace/issues/4399)
* Make sure completions aren't null or undefined ([a78e127](https://github.com/ajaxorg/ace/commit/a78e127e8fd7d724b96208447caa384783616323)), closes [#4608](https://github.com/ajaxorg/ace/issues/4608)

### [1.6.1](https://github.com/ajaxorg/ace/compare/v1.6.0...v1.6.1) (2022-06-24)


### Bug Fixes

* Highlight unicode characters in Python function and class names ([be6f2d1](https://github.com/ajaxorg/ace/commit/be6f2d125a8ffe70ceb336051da6a161ce9cf1bc))
* Incorrect YAML syntax highlighting for version numbers with multiple periods ([049d761](https://github.com/ajaxorg/ace/commit/049d76131e6122f7397fb30cc341db34baaf2813))
* Incorrect YAML syntax highlighting for version numbers with multiple periods [#4827](https://github.com/ajaxorg/ace/issues/4827) ([915fcaf](https://github.com/ajaxorg/ace/commit/915fcaf542469a7dc0e3e7235f23a66a3abaadb9))

## [1.6.0](https://github.com/ajaxorg/ace/compare/v1.5.3...v1.6.0) (2022-06-10)


### Bug Fixes

* Add class to tooltip DOM element distinguish errors from warnings ([#4810](https://github.com/ajaxorg/ace/issues/4810)) ([d2446d6](https://github.com/ajaxorg/ace/commit/d2446d68e7ace4d1a860de6a5a3e5031f074161b))
* Autocomplete stopped working after upgrade to v1.5.2 ([48e6b60](https://github.com/ajaxorg/ace/commit/48e6b601ad5ae03a99a341843194c3854d2376c2))
* Fix css EOF duplicate errors [#4816](https://github.com/ajaxorg/ace/issues/4816) ([48176f6](https://github.com/ajaxorg/ace/commit/48176f66c8ca0dd239968329b471f55b548ee467))
* Fix overflow button for long lines with one token ([#4818](https://github.com/ajaxorg/ace/issues/4818)) ([3f93451](https://github.com/ajaxorg/ace/commit/3f934510514a25c53edf64bb80911a96b7133908))

### [1.5.3](https://github.com/ajaxorg/ace/compare/v1.5.2...v1.5.3) (2022-05-31)


### Bug Fixes

* Colors for variable, function and constant should be different ([#4802](https://github.com/ajaxorg/ace/issues/4802)) ([9e81bda](https://github.com/ajaxorg/ace/commit/9e81bdafc3d563421cae458259d4c4e1b449a237))

### [1.5.2](https://github.com/ajaxorg/ace/compare/v1.5.1...v1.5.2) (2022-05-30)


### Bug Fixes

* Added es6-shim library to fix old browsers ([#4720](https://github.com/ajaxorg/ace/issues/4720)) ([5ba71a0](https://github.com/ajaxorg/ace/commit/5ba71a0b8b0804d8cb385f7b2ee6b63e9bd1c3b8))
* Added mockdom.before method ([#4724](https://github.com/ajaxorg/ace/issues/4724)) ([ffedba3](https://github.com/ajaxorg/ace/commit/ffedba3e18138d7739285d1a9b945d01d384948e))
* Added support for cjs, mjs and log modes ([#4718](https://github.com/ajaxorg/ace/issues/4718)) ([375498a](https://github.com/ajaxorg/ace/commit/375498a12ff28cf955224baf60d242421817220d))
* Adds missed functions into `php_completions.js` ([#4726](https://github.com/ajaxorg/ace/issues/4726)) ([7d5f4b8](https://github.com/ajaxorg/ace/commit/7d5f4b83f3ecc854e70f1508e9247e39ca9de30a))
* Cannot read property of null for bgTokenizer after session is destroyed ([#4713](https://github.com/ajaxorg/ace/issues/4713)) ([d604f52](https://github.com/ajaxorg/ace/commit/d604f52d60e3ec2dced126337ad46a2cf71bf294))
* Do not render selected word markers for the same range multiple times ([#4727](https://github.com/ajaxorg/ace/issues/4727)) ([cd30f59](https://github.com/ajaxorg/ace/commit/cd30f591e40d5286fdabaa9f688f3c6066fbffff))
* Fixed popup CSS styling ([#4728](https://github.com/ajaxorg/ace/issues/4728)) ([045a3e6](https://github.com/ajaxorg/ace/commit/045a3e652ec37b1ab3b716cdf2bc24967a75eb77))
* Fixed scrolling code lenses into view ([#4717](https://github.com/ajaxorg/ace/issues/4717)) ([710b14a](https://github.com/ajaxorg/ace/commit/710b14a7709d7499a4d182ad707b3cbbb6e73a64))
* Multiple improvements for Ace themes ([#4715](https://github.com/ajaxorg/ace/issues/4715)) ([87ad55d](https://github.com/ajaxorg/ace/commit/87ad55daf243bdc619e15fbf220dc5ded235ed4c))
* Only send postMessage through worker if it's defined ([#4722](https://github.com/ajaxorg/ace/issues/4722)) ([2afa4bf](https://github.com/ajaxorg/ace/commit/2afa4bf91bbc99f29bd0a7c1f0adc600af2ceeae))
* Pass additional arguments for command.exec ([#4723](https://github.com/ajaxorg/ace/issues/4723)) ([3b36762](https://github.com/ajaxorg/ace/commit/3b36762c045246efbc2e11eaa08d20a90142d26f))
* Removed focussing after timeout in text input ([#4716](https://github.com/ajaxorg/ace/issues/4716)) ([f8ea48f](https://github.com/ajaxorg/ace/commit/f8ea48f1fe6362696ed30e01030e75c117ce4323))
* Throw invalid delta error if change is out of range and added V2 for worker and worker client ([#4721](https://github.com/ajaxorg/ace/issues/4721)) ([f269889](https://github.com/ajaxorg/ace/commit/f2698895d6617f1c7ebeed14b7ecbb1c5d71bb51))
* Updated ace typings ([#4714](https://github.com/ajaxorg/ace/issues/4714)) ([d5d6f9a](https://github.com/ajaxorg/ace/commit/d5d6f9a32ad443d02aa89d9f140917637f5f52ab))

### [1.5.1](https://github.com/ajaxorg/ace/compare/v1.5.0...v1.5.1) (2022-05-23)


### Bug Fixes

* Correctly tokenize YAML meta tags with non alphabetical characters after multiline string ([#4706](https://github.com/ajaxorg/ace/issues/4706)) ([0164811](https://github.com/ajaxorg/ace/commit/0164811fd95ecae9a46ce6fd7278e9c8b0b48eed))
* Made commas be tokenized as punctuation operator instead of text in JSON ([#4703](https://github.com/ajaxorg/ace/issues/4703)) ([4c4883a](https://github.com/ajaxorg/ace/commit/4c4883a854836b652dbb798b78f207ae4b1924b8))
* Multiple Partiql and Amazon Ion textual notation fixes ([#4686](https://github.com/ajaxorg/ace/issues/4686)) ([bffba8d](https://github.com/ajaxorg/ace/commit/bffba8d934773bc9236d741f1a1ce2237a971b3e))
* PHP syntax fix for AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG ([#4705](https://github.com/ajaxorg/ace/issues/4705)) ([d59c22b](https://github.com/ajaxorg/ace/commit/d59c22b603eaa9d688249a3cc11812e641f25426))
* Python functions should be highlighted as functions ([#4708](https://github.com/ajaxorg/ace/issues/4708)) ([b2aaf1f](https://github.com/ajaxorg/ace/commit/b2aaf1f5644397959bd8c94e9e705da176242edd))
* Updated PHP mode to support PHP8.1 syntax ([#4696](https://github.com/ajaxorg/ace/issues/4696)) ([33cf1c6](https://github.com/ajaxorg/ace/commit/33cf1c66af970edaf7eb0a468276fca249b8a5c8))

## [1.5.0](https://github.com/ajaxorg/ace/compare/v1.4.14...v1.5.0) (2022-05-12)


### Features

* Added ability to configure certain format options for beautify extension ([20275de](https://github.com/ajaxorg/ace/commit/20275de79c40636d27d5ce293cf528c915338fbd))


### Bug Fixes

* Modify syntax ([b78d772](https://github.com/ajaxorg/ace/commit/b78d77240e1909b9d91fcd2ac35a4c17af05f56b))
* Render bidirectional unicode characters as control characters ([#4693](https://github.com/ajaxorg/ace/issues/4693)) ([4d2ecf0](https://github.com/ajaxorg/ace/commit/4d2ecf08afeb1556f2511a1423729c2549802da8))

2022.01.26 Version 1.4.14

- update vim mode
- remove slow regex in beautify extension

  2021.09.30 Version 1.4.13

- added useStrictCSP global option to use in environments where dynamic style creation is disabled
  see demo/csp.html for an example of a page which loads external css files instead of generating styles with javascript
- updated vim mode, added support for gqq command

  2020.07.06 Version 1.4.12

- removed unused es5-shim
- imporved ruby and vbscript highlighting and folding
- workaround for double space being converted to dot on mobile keyboards

  2020.04.15 Version 1.4.10

- added workaround for chrome bug causing memory leak after calling editor.destroy
- added code folding support for vbscript mode

  2020.04.01 Version 1.4.9

- added option to disable autoindent
- added new language modes
- fixed backspace not working with some mobile keyboards

  2020.01.14 Version 1.4.8

- highlight both matched braces, and highlight unmatched brace in red
- improve snippet manager
- compatibility with webpack file-loader v5
- improve vim mode

  2019.10.17 Version 1.4.7

- add placeholder option

  2019.09.08 Version 1.4.6

- restore native behavior of ctrl-p on mac (jumptomatching command is moved to cmd-\)
- improve snippet manager
- fix backspace handling on mobile

  2019.06.17 Version 1.4.5

- improve scrolling and selection on mobile
- improve type definitions

  2019.04.24 Version 1.4.4

- add experimental command prompt
- add chrystal, nim and nginx highlight rules
- fix regression in vim mode on ios

  2019.02.21 Version 1.4.3

- add sublime keybindings
- add rtl option
- implement ` and < textobjects in vim mode

  2018.11.21 Version 1.4.2

- fix regression in vim mode
- improve keyboard input handling on ipad and IE
- add new syntax highlighters

  2018.08.07 Version 1.4.1

- fix regression in autocomplete

  2018.08.06 Version 1.4.0

- remove usage of innerHTML
- improved handling of textinput for IME and mobile
- add support for relative line numbers
- improve autocompletion popup

  2018.03.26 Version 1.3.3

- fix regession in static-highlight extension
- use css animation for cursor blinking

  2018.03.21 Version 1.3.2

- add experimental support for using ace-builds with webpack

  2018.02.11 Version 1.3.1

- fixed regression with selectionChange event not firing some times
- improved handling of non-ascii characters in vim normal mode

  2018.01.31 Version 1.3.0

- added copy copyWithEmptySelection option
- improved undoManager
- improved settings_menu plugin
- improved handling of files with very long lines
- fixed bug with scrolling editor out of view in transformed elements

  2017.10.17 Version 1.2.9

- added support for bidirectional text, with monospace font (Alex Shensis)
- added support for emoji 😊

- new language modes

  - Red (Toomas Vooglaid)
  - CSound (Nathan Whetsell)
  - JSSM (John Haugeland)

- New Themes

  - Dracula (Austin Schwartz)

    2017.07.02 Version 1.2.8

- Fixed small bugs in searchbox and autocompleter

  2017.06.18 Version 1.2.7

- Added Support for arrow keys on external IPad keyboard (Emanuele Tamponi)
- added match counter to searchbox extension

* implemented higlighting of multiline strings in yaml mode (Maxim Trushin)
* improved haml syntax highlighter (Andrés Álvarez)

  2016.12.03 Version 1.2.6

- Fixed IME handling on new Chrome
- Support for php 7 in the syntax checker

  2016.08.16 Version 1.2.5

- Fixed regression in noconflict mode

  2016.07.27 Version 1.2.4

- Maintenance release with several new modes and small bugfixes

  2016.01.17 Version 1.2.3

- Bugfixes
  - fix memory leak in setSession (Tyler Stalder)
  - double click not working on linux/mac
- new language modes

  - reStructuredText (Robin Jarry)
  - NSIS (Jan T. Sott)

    2015.10.28 Version 1.2.1

- new language modes

  - Swift
  - JSX

    2015.07.11 Version 1.2.0

- New Features

  - Indented soft wrap (danyaPostfactum)
  - Rounded borders on selections

- API Changes

  - unified delta types `{start, end, action, lines}` (Alden Daniels https://github.com/ajaxorg/ace/pull/1745)
  - "change" event listeners on session and editor get delta objects directly

- new language modes

  - SQLServer (Morgan Yarbrough)

    2015.04.03 Version 1.1.9

  - Small Enhancements and Bugfixes

    2014.11.08 Version 1.1.8

- API Changes
  - `editor.commands.commandKeyBinding` now contains direct map from keys to commands instead of grouping them by hashid
- New Features
  - Improved autoindent for html and php modes (Adam Jimenez)
  - Find All from searchbox (Colton Voege)
- new language modes

  - Elixir, Elm
    2014.09.21 Version 1.1.7

- Bugfixes

  - fix several bugs in autocompletion
  - workaround for inaccurate getBoundingClientRect on chrome 37

    2014.08.17 Version 1.1.6

- Bugfixes
  - fix regression in double tap to highlight
  - Improved Latex Mode (Daniel Felder)
- API Changes

  - editor.destroy destroys editor.session too (call editor.setSession(null) to prevent that)

- new language modes

* Praat (José Joaquín Atria)
* Eiffel (Victorien Elvinger)
* G-code (Adam Joseph Cook)
  2014.07.09 Version 1.1.5

- Bugfixes

  - fix regression in autocomplete popup

- new language modes

* gitignore (Devon Carew)
  2014.07.01 Version 1.1.4

- New Features

  - Highlight matching tags (Adam Jimenez)
  - Improved jump to matching command (Adam Jimenez)

- new language modes

* AppleScript (Yaogang Lian)
* Vala

  2014.03.08 Version 1.1.3

- New Features

  - Allow syntax checkers to be loaded from CDN (Derk-Jan Hartman)
  - Add ColdFusion behavior (Abram Adams)
  - add showLineNumbers option
  - Add html syntax checker (danyaPostfactum)

- new language modes

  - Gherkin (Patrick Nevels)
  - Smarty

    2013.12.02 Version 1.1.2

- New Features
  - Accessibility Theme for Ace (Peter Xiao)
  - use snipetManager for expanding emmet snippets
  - update jshint to 2.1.4
  - improve php syntax checker (jdalegonzalez)
  - add option for autoresizing
  - add option for autohiding vertical scrollbar
  - improvements to highlighting of xml like languages (danyaPostfactum)
  - add support for autocompletion and snippets (gjtorikyan danyaPostfactum and others)
  - add option to merge similar changes in undo history
  - add scrollPastEnd option
  - use html5 dragndrop for text dragging (danyaPostfactum)
- API Changes

  - fixed typo in HashHandler commmandManager

- new language modes

  - Nix (Zef Hemel)
  - Protobuf (Zef Hemel)
  - Soy
  - Handlebars

    2013.06.04 Version 1.1.1

  - Improved emacs keybindings (Robert Krahn)
  - Added markClean, isClean methods to UndoManager (Joonsoo Jeon)
  - Do not allow `Toggle comments` command to remove spaces from indentation
  - Softer colors for indent guides in dark themes

- new language modes

  - Ada
  - Assembly_x86
  - Cobol
  - D
  - ejs
  - MATLAB
  - MySQL
  - Twig
  - Verilog

    2013.05.01, Version 1.1.0

- API Changes

  - Default position of the editor container is changed to relative. Add `.ace_editor {position: absolute}` css rule to restore old behavior
  - Changed default line-height to `normal` to not conflict with bootstrap. Use `line-height: inherit` for old behavior.
  - Changed marker types accepted by session.addMarker. It now accepts "text"|"line"|"fullLine"|"screenLine"
  - Internal classnames used by editor were made more consistent
  - Introduced `editor.setOption/getOption/setOptions/getOptions` methods
  - Introduced positionToIndex, indexToPosition methods

- New Features

  - Improved emacs mode (chetstone)
    with Incremental search and Occur modes (Robert Krahn)

  - Improved ime handling
  - Searchbox (Vlad Zinculescu)

  - Added elastic tabstops lite extension (Garen Torikian)
  - Added extension for whitespace manipulation
  - Added extension for enabling spellchecking from contextmenu
  - Added extension for displaying available keyboard shortcuts (Matthew Christopher Kastor-Inare III)
  - Added extension for displaying options panel (Matthew Christopher Kastor-Inare III)
  - Added modelist extension (Matthew Christopher Kastor-Inare III)

  - Improved toggleCommentLines and added ToggleCommentBlock command
  - `:;` pairing in CSS mode (danyaPostfactum)

  - Added suppoert for Delete and SelectAll from context menu (danyaPostfactum)

  - Make wrapping behavior optional
  - Selective bracket insertion/skipping
  - Added commands for increase/decrease numbers, sort lines (Vlad Zinculescu)
  - Folding for Markdown, Lua, LaTeX
  - Selective bracket insertion/skipping for C-like languages

- Many new languages

  - Scheme (Mu Lei)
  - Dot (edwardsp)
  - FreeMarker (nguillaumin)
  - Tiny Mushcode (h3rb)
  - Velocity (Ryan Griffith)
  - TOML (Garen Torikian)
  - LSL (Nemurimasu Neiro, Builders Brewery)
  - Curly (Libo Cannici)
  - vbScript (Jan Jongboom)
  - R (RStudio)
  - ABAP
  - Lucene (Graham Scott)
  - Haml (Garen Torikian)
  - Objective-C (Garen Torikian)
  - Makefile (Garen Torikian)
  - TypeScript (Garen Torikian)
  - Lisp (Garen Torikian)
  - Stylus (Garen Torikian)
  - Dart (Garen Torikian)

- Live syntax checks

  - PHP (danyaPostfactum)
  - Lua

- New Themes

  - Chaos
  - Terminal
    2012.09.17, Version 1.0.0

- New Features

  - Multiple cursors and selections (https://c9.io/site/blog/2012/08/be-an-armenian-warrior-with-block-selection-on-steroids/)
  - Fold buttons displayed in the gutter
  - Indent Guides
  - Completely reworked vim mode (Sergi Mansilla)
  - Improved emacs keybindings
  - Autoclosing of html tags (danyaPostfactum)

- 20 New language modes

  - Coldfusion (Russ)
  - Diff
  - GLSL (Ed Mackey)
  - Go (Davide Saurino)
  - Haxe (Jason O'Neil)
  - Jade (Garen Torikian)
  - jsx (Syu Kato)
  - LaTeX (James Allen)
  - Less (John Roepke)
  - Liquid (Bernie Telles)
  - Lua (Lee Gao)
  - LuaPage (Choonster)
  - Markdown (Chris Spencer)
  - PostgreSQL (John DeSoi)
  - Powershell (John Kane)
  - Sh (Richo Healey)
  - SQL (Jonathan Camile)
  - Tcl (Cristoph Hochreiner)
  - XQuery (William Candillion)
  - Yaml (Meg Sharkey)

  * Live syntax checks

  - for XQuery and JSON

- New Themes

  - Ambiance (Irakli Gozalishvili)
  - Dreamweaver (Adam Jimenez)
  - Github (bootstraponline)
  - Tommorrow themes (https://github.com/chriskempson/tomorrow-theme)
  - XCode

- Many Small Enhancements and Bugfixes

  2011.08.02, Version 0.2.0

- Split view (Julian Viereck)

  - split editor area horizontally or vertivally to show two files at the same
    time

- Code Folding (Julian Viereck)

  - Unstructured code folding
  - Will be the basis for language aware folding

- Mode behaviours (Chris Spencer)

  - Adds mode specific hooks which allow transformations of entered text
  - Autoclosing of braces, paranthesis and quotation marks in C style modes
  - Autoclosing of angular brackets in XML style modes

- New language modes
  - Clojure (Carin Meier)
  - C# (Rob Conery)
  - Groovy (Ben Tilford)
  - Scala (Ben Tilford)
  - JSON
  - OCaml (Sergi Mansilla)
  - Perl (Panagiotis Astithas)
  - SCSS/SASS (Andreas Madsen)
  - SVG
  - Textile (Kelley van Evert)
  - SCAD (Jacob Hansson)
- Live syntax checks

  - Lint for CSS using CSS Lint <http://csslint.net/>
  - CoffeeScript

- New Themes

  - Crimson Editor (iebuggy)
  - Merbivore (Michael Schwartz)
  - Merbivore soft (Michael Schwartz)
  - Solarized dark/light <http://ethanschoonover.com/solarized> (David Alan Hjelle)
  - Vibrant Ink (Michael Schwartz)

- Small Features/Enhancements

  - Lots of render performance optimizations (Harutyun Amirjanyan)
  - Improved Ruby highlighting (Chris Wanstrath, Trent Ogren)
  - Improved PHP highlighting (Thomas Hruska)
  - Improved CSS highlighting (Sean Kellogg)
  - Clicks which cause the editor to be focused don't reset the selection
  - Make padding text layer specific so that print margin and active line
    highlight are not affected (Irakli Gozalishvili)
  - Added setFontSize method
  - Improved vi keybindings (Trent Ogren)
  - When unfocused make cursor transparent instead of removing it (Harutyun Amirjanyan)
  - Support for matching groups in tokenizer with arrays of tokens (Chris Spencer)

- Bug fixes

  - Add support for the new OSX scroll bars
  - Properly highlight JavaScript regexp literals
  - Proper handling of unicode characters in JavaScript identifiers
  - Fix remove lines command on last line (Harutyun Amirjanyan)
  - Fix scroll wheel sluggishness in Safari
  - Make keyboard infrastructure route keys like []^$ the right way (Julian Viereck)

    2011.02.14, Version 0.1.6

- Floating Anchors
  - An Anchor is a floating pointer in the document.
  - Whenever text is inserted or deleted before the cursor, the position of
    the cursor is updated
  - Usesd for the cursor and selection
  - Basis for bookmarks, multiple cursors and snippets in the future
- Extensive support for Cocoa style keybindings on the Mac <https://github.com/ajaxorg/ace/issues/closed#issue/116/comment/767803>
- New commands:
  - center selection in viewport
  - remove to end/start of line
  - split line
  - transpose letters
- Refator markers
  - Custom code can be used to render markers
  - Markers can be in front or behind the text
  - Markers are now stored in the session (was in the renderer)
- Lots of IE8 fixes including copy, cut and selections
- Unit tests can also be run in the browser
  <https://github.com/ajaxorg/ace/blob/master/lib/ace/test/tests.html>
- Soft wrap can adapt to the width of the editor (Mike Ratcliffe, Joe Cheng)
- Add minimal node server server.js to run the Ace demo in Chrome
- The top level editor.html demo has been renamed to index.html
- Bug fixes

  - Fixed gotoLine to consider wrapped lines when calculating where to scroll to (James Allen)
  - Fixed isues when the editor was scrolled in the web page (Eric Allam)
  - Highlighting of Python string literals
  - Syntax rule for PHP comments

    2011.02.08, Version 0.1.5

- Add Coffeescript Mode (Satoshi Murakami)
- Fix word wrap bug (Julian Viereck)
- Fix packaged version of the Eclipse mode
- Loading of workers is more robust
- Fix "click selection"
- Allow tokizing empty lines (Daniel Krech)
- Make PageUp/Down behavior more consistent with native OS (Joe Cheng)

  2011.02.04, Version 0.1.4

- Add C/C++ mode contributed by Gastón Kleiman
- Fix exception in key input

  2011.02.04, Version 0.1.3

- Let the packaged version play nice with requireJS
- Add Ruby mode contributed by Shlomo Zalman Heigh
- Add Java mode contributed by Tom Tasche
- Fix annotation bug
- Changing a document added a new empty line at the end
