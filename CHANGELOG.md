# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.39.1](https://github.com/ajaxorg/ace/compare/v1.39.0...v1.39.1) (2025-03-20)


### Features

* Editing is disabled tooltip in readonly mode ([#5771](https://github.com/ajaxorg/ace/issues/5771)) ([1098e53](https://github.com/ajaxorg/ace/commit/1098e5306fdc02e873cdadc85d2e13228abfe80c))


### Bug Fixes

* Fix is check in xml FoldMode ([#5752](https://github.com/ajaxorg/ace/issues/5752)) ([810c465](https://github.com/ajaxorg/ace/commit/810c4650288d32b119239f7731a3b3be0c25376c))
* replace NodeList.foreach with for loop ([#5769](https://github.com/ajaxorg/ace/issues/5769)) ([b3de3c1](https://github.com/ajaxorg/ace/commit/b3de3c1d99540bd94df122cedb7c5e3a792986a7))
* updateDocTooltip with undefined this.completions ([#5754](https://github.com/ajaxorg/ace/issues/5754)) ([adde072](https://github.com/ajaxorg/ace/commit/adde072dd4810aa8f99bb1e16a6ab7dfc81a6e9d))
* wrong java keywords ([#5759](https://github.com/ajaxorg/ace/issues/5759)) ([6b4c7a0](https://github.com/ajaxorg/ace/commit/6b4c7a09d844a2e16d664d3e9fbb384b543bcfcb))

## [1.39.0](https://github.com/ajaxorg/ace/compare/v1.38.0...v1.39.0) (2025-02-21)


### Features

* Multiline Search Support: line breaks `\n` ([#5675](https://github.com/ajaxorg/ace/issues/5675)) ([06d51b9](https://github.com/ajaxorg/ace/commit/06d51b9164dc9dc39fbd6df26b7132f4b9580a4c))


### Bug Fixes

* check if row is present when setting aria label of popup elements ([#5750](https://github.com/ajaxorg/ace/issues/5750)) ([ff16482](https://github.com/ajaxorg/ace/commit/ff16482101965fc4fce488a61a3cd0f9454d8e87))
* gutter hover tooltip a11y improvements ([#5747](https://github.com/ajaxorg/ace/issues/5747)) ([fbe3ddc](https://github.com/ajaxorg/ace/commit/fbe3ddccb1248c9f8f4a6524d2ded7235d225b41))
* narrowing platform to be either win or mac ([#5707](https://github.com/ajaxorg/ace/issues/5707)) ([18cc336](https://github.com/ajaxorg/ace/commit/18cc336187519107f47bb15e989008f48f0b1563))
* set score completion item when skipfilter true ([#5749](https://github.com/ajaxorg/ace/issues/5749)) ([a27e1e8](https://github.com/ajaxorg/ace/commit/a27e1e8a5d3d912b3b554cd2b5916b58750e8e71))

## [1.38.0](https://github.com/ajaxorg/ace/compare/v1.37.5...v1.38.0) (2025-02-12)


### Features

* **popup:** add supporting skipFilter flag for popup item ([#5740](https://github.com/ajaxorg/ace/issues/5740)) ([0db7585](https://github.com/ajaxorg/ace/commit/0db7585ae0ccbd353091426f60ac3d9e53e182c4))


### Bug Fixes

* **AcePopup:** fix aria-posinset issue on google chrome ([#5719](https://github.com/ajaxorg/ace/issues/5719)) ([09a0c5a](https://github.com/ajaxorg/ace/commit/09a0c5a11106754916a4fc324a35e8daf84055ba))
* calling setMode just before destroy causes error reading getLength ([#5727](https://github.com/ajaxorg/ace/issues/5727)) ([62b973e](https://github.com/ajaxorg/ace/commit/62b973ef2247debdd51cf6a41a3b24b97277efdb))
* highlight indent guides with wrapped lines ([#5621](https://github.com/ajaxorg/ace/issues/5621)) ([77b9fe1](https://github.com/ajaxorg/ace/commit/77b9fe1bc0b10b4c3fb2780d65f9d256d60634ce))
* improve aria attributes of popup elements ([#5739](https://github.com/ajaxorg/ace/issues/5739)) ([09fba2e](https://github.com/ajaxorg/ace/commit/09fba2e7347cd499c979e53ec7a8d8ee1fd48918))
* types for setTimeout/setInterval calls ([#5726](https://github.com/ajaxorg/ace/issues/5726)) ([9a76656](https://github.com/ajaxorg/ace/commit/9a76656acc9528a4a2e92a3b72c4d6598d3a0a8c))
* **VirtualRenderer:** fix scrollbar overlap on autocompletion ([#5713](https://github.com/ajaxorg/ace/issues/5713)) ([5acea6d](https://github.com/ajaxorg/ace/commit/5acea6d9200f4ca0c8495350cda6e41e8351913f))
* wrong type of paste event and missing types for themelist extension ([#5725](https://github.com/ajaxorg/ace/issues/5725)) ([a4b9d2d](https://github.com/ajaxorg/ace/commit/a4b9d2d91a2be841320030d93afde46ae723c8c3))

### [1.37.5](https://github.com/ajaxorg/ace/compare/v1.37.4...v1.37.5) (2025-01-16)


### Bug Fixes

* update aria-roledescription gutter ([#5718](https://github.com/ajaxorg/ace/issues/5718)) ([7ae3a4c](https://github.com/ajaxorg/ace/commit/7ae3a4c5f6f6e9bd31ae491f1fcef71fc5ae62fa))

### [1.37.4](https://github.com/ajaxorg/ace/compare/v1.37.3...v1.37.4) (2025-01-09)


### Bug Fixes

* Remove unnecesary `typeof` from type imports in declarations ([#5715](https://github.com/ajaxorg/ace/issues/5715)) ([2c8bf91](https://github.com/ajaxorg/ace/commit/2c8bf916d75b086b958c205896bc2adc1747d241))

### [1.37.3](https://github.com/ajaxorg/ace/compare/v1.37.2...v1.37.3) (2025-01-07)

### [1.37.2](https://github.com/ajaxorg/ace/compare/v1.37.1...v1.37.2) (2025-01-06)


### Bug Fixes

* fix return type of supportsFile modelist ([#5705](https://github.com/ajaxorg/ace/issues/5705)) ([de21d50](https://github.com/ajaxorg/ace/commit/de21d50656bd874e1626265b8853923cb8da7c8b))

### [1.37.1](https://github.com/ajaxorg/ace/compare/v1.37.0...v1.37.1) (2024-12-20)


### Bug Fixes

* hide gutter tooltip event missing from editor signal ([#5701](https://github.com/ajaxorg/ace/issues/5701)) ([66a6736](https://github.com/ajaxorg/ace/commit/66a673643d5d128eaf59d4fb6e5907fa6fa68773))

### [1.36.6](https://github.com/ajaxorg/ace/compare/v1.36.5...v1.36.6) (2024-12-17)


### Bug Fixes

* update contribuition guide to mandate test cases ([#5694](https://github.com/ajaxorg/ace/issues/5694)) ([e6533b3](https://github.com/ajaxorg/ace/commit/e6533b3972d5adbf5995646c44894466b3b7f40f))
* wrong behaviour rules in modes ([#5682](https://github.com/ajaxorg/ace/issues/5682)) ([442680c](https://github.com/ajaxorg/ace/commit/442680c68e66531c2d5ac80d80444ed600262ec1))

### [1.36.5](https://github.com/ajaxorg/ace/compare/v1.36.4...v1.36.5) (2024-11-14)


### Features

* exposing getter setter for widget manager created using line widgets ([#5673](https://github.com/ajaxorg/ace/issues/5673)) ([f5d0c19](https://github.com/ajaxorg/ace/commit/f5d0c196c69d06a9dda1bdeb379fa20ecbf75590))


### Bug Fixes

* vue-directives regex bug ([#5671](https://github.com/ajaxorg/ace/issues/5671)) ([5e1e524](https://github.com/ajaxorg/ace/commit/5e1e524d7ef04e13291b5a979fb4166e973e61f0))

### [1.36.4](https://github.com/ajaxorg/ace/compare/v1.36.3...v1.36.4) (2024-11-04)


### Bug Fixes

* **a11y:** update aria-label of textinput on cursor move ([#5665](https://github.com/ajaxorg/ace/issues/5665)) ([6ff93a8](https://github.com/ajaxorg/ace/commit/6ff93a86fe8c4855789ee7e7c156f7b376c0f935))

### [1.36.3](https://github.com/ajaxorg/ace/compare/v1.36.2...v1.36.3) (2024-10-21)


### Bug Fixes

* `readdirSync` options `recursive: true` was added only in NodeJs v20.1.0 ([#5645](https://github.com/ajaxorg/ace/issues/5645)) ([2953f72](https://github.com/ajaxorg/ace/commit/2953f72877a90691432373cfe9182e60ea9b2d8f))

### [1.36.2](https://github.com/ajaxorg/ace/compare/v1.36.1...v1.36.2) (2024-08-30)


### Bug Fixes

* apply padding to right side multi-line markers ([#5636](https://github.com/ajaxorg/ace/issues/5636)) ([c7549aa](https://github.com/ajaxorg/ace/commit/c7549aa5d53fb62f134b31a44d09029ceee3c800))

### [1.36.1](https://github.com/ajaxorg/ace/compare/v1.36.0...v1.36.1) (2024-08-29)


### Bug Fixes

* improve type getMarkerAtPosition markergroup ([#5631](https://github.com/ajaxorg/ace/issues/5631)) ([89bd40a](https://github.com/ajaxorg/ace/commit/89bd40a66a2f06fb8806f174e5559021540a5b1e))
* update cloudeditor light colours ([#5633](https://github.com/ajaxorg/ace/issues/5633)) ([0e2813e](https://github.com/ajaxorg/ace/commit/0e2813ed9e858d9359c2a79f2a9255d675308ad1))

## [1.36.0](https://github.com/ajaxorg/ace/compare/v1.35.5...v1.36.0) (2024-08-21)


### Features

* allow setting marker type for MarkerGroups ([#5630](https://github.com/ajaxorg/ace/issues/5630)) ([214df9c](https://github.com/ajaxorg/ace/commit/214df9cea8d729f3071f9c02889cba2b2e7051b3))
* **forced-color:** do not adjust the forced colors for the editor ([#5624](https://github.com/ajaxorg/ace/issues/5624)) ([c8f9df8](https://github.com/ajaxorg/ace/commit/c8f9df84e70ee29e8e989966985bcea95a9bef9b))

### [1.35.5](https://github.com/ajaxorg/ace/compare/v1.35.4...v1.35.5) (2024-08-20)

### [1.35.4](https://github.com/ajaxorg/ace/compare/v1.35.3...v1.35.4) (2024-07-22)


### Bug Fixes

* move right of cursor tokens to end of ghost text. ([#5616](https://github.com/ajaxorg/ace/issues/5616)) ([063ef9b](https://github.com/ajaxorg/ace/commit/063ef9bbe0934dfe75d9b447e8a92b69bfa41a3a))

### [1.35.3](https://github.com/ajaxorg/ace/compare/v1.35.2...v1.35.3) (2024-07-18)


### Bug Fixes

* ghost text rendering of empty lines ([#5615](https://github.com/ajaxorg/ace/issues/5615)) ([1ae0bdc](https://github.com/ajaxorg/ace/commit/1ae0bdcfb9da4078713d116e93a9c9a935a1258d))

### [1.35.2](https://github.com/ajaxorg/ace/compare/v1.35.1...v1.35.2) (2024-07-01)

### [1.35.1](https://github.com/ajaxorg/ace/compare/v1.35.0...v1.35.1) (2024-06-27)


### Bug Fixes

* explicitly construct Number from window zoom attribute ([#5600](https://github.com/ajaxorg/ace/issues/5600)) ([2591c36](https://github.com/ajaxorg/ace/commit/2591c36b9e768305a9f837bf74c828c2d8d76e05))
* use dom builder for gutter tooltip and inline widget ([#5601](https://github.com/ajaxorg/ace/issues/5601)) ([e81a299](https://github.com/ajaxorg/ace/commit/e81a299a8be39a7245a334ebc844eaeac6864bb3))
* workaround for safari rendering bug ([#5573](https://github.com/ajaxorg/ace/issues/5573)) ([f9a152f](https://github.com/ajaxorg/ace/commit/f9a152fd925a8a16b10c65c909201100486c71e8))
* wrong doc comment * insert behaviour ([#5571](https://github.com/ajaxorg/ace/issues/5571)) ([16c95b3](https://github.com/ajaxorg/ace/commit/16c95b32197c0ec952e52be85d21269005875940))

## [1.35.0](https://github.com/ajaxorg/ace/compare/v1.34.2...v1.35.0) (2024-06-11)


### Features

* allow '{n}' as placeholder for translated strings ([#5581](https://github.com/ajaxorg/ace/issues/5581)) ([2206024](https://github.com/ajaxorg/ace/commit/220602488b95748c74141d647e13114c7a4569fb))


### Bug Fixes

* allow setting the placeholder type for nls ([#5584](https://github.com/ajaxorg/ace/issues/5584)) ([3e2d50f](https://github.com/ajaxorg/ace/commit/3e2d50f5307e201c20825311585e1f612f1ff23c))
* not closed generic state in case of left-shift operator ([#5572](https://github.com/ajaxorg/ace/issues/5572)) ([e5bea6f](https://github.com/ajaxorg/ace/commit/e5bea6f63290003ff3270d56dbf9610e8a3091a8))
* wrong vue-directives regexp ([#5586](https://github.com/ajaxorg/ace/issues/5586)) ([5f89a33](https://github.com/ajaxorg/ace/commit/5f89a334e69640bb395e74ae86530217d08f141c))

### [1.34.2](https://github.com/ajaxorg/ace/compare/v1.34.1...v1.34.2) (2024-05-27)

### [1.34.1](https://github.com/ajaxorg/ace/compare/v1.34.0...v1.34.1) (2024-05-24)


### Bug Fixes

* always set aria-label to text input in a11y mode ([#5563](https://github.com/ajaxorg/ace/issues/5563)) ([00346fd](https://github.com/ajaxorg/ace/commit/00346fde824beabb69f677631ad52815665eaef4))
* Folding for comments and different modes ([#5533](https://github.com/ajaxorg/ace/issues/5533)) ([f4d0e33](https://github.com/ajaxorg/ace/commit/f4d0e33dac270ce21df09a96a39f50e16d6354db))

## [1.34.0](https://github.com/ajaxorg/ace/compare/v1.33.3...v1.34.0) (2024-05-22)


### Features

* allow users to add arialabel to text input ([#5560](https://github.com/ajaxorg/ace/issues/5560)) ([8d7dfb6](https://github.com/ajaxorg/ace/commit/8d7dfb69392960aba61def982f4bea8f3a5caa70))

### [1.33.3](https://github.com/ajaxorg/ace/compare/v1.33.2...v1.33.3) (2024-05-21)


### Bug Fixes

* contrast completion meta contrast cloud editor themes ([#5558](https://github.com/ajaxorg/ace/issues/5558)) ([b8877f0](https://github.com/ajaxorg/ace/commit/b8877f0f725b3973961cb639127402c9f56609de))

### [1.33.2](https://github.com/ajaxorg/ace/compare/v1.33.1...v1.33.2) (2024-05-13)


### Bug Fixes

* Add soft wrap for ghost text ([#5540](https://github.com/ajaxorg/ace/issues/5540)) ([6a26b27](https://github.com/ajaxorg/ace/commit/6a26b277d0050b38cd766e00f93be4b9f3170f68))
* generator function's determination; wrong parameter highlighting ([#5538](https://github.com/ajaxorg/ace/issues/5538)) ([ceca6f7](https://github.com/ajaxorg/ace/commit/ceca6f7b38f6b3347988f17579ae6a2e758137dd))
* incorrect spans style ([#5539](https://github.com/ajaxorg/ace/issues/5539)) ([65a7f38](https://github.com/ajaxorg/ace/commit/65a7f38713cffb729dab530711351c0a17c5801f))
* not determined folding widgets for html tags ([#5548](https://github.com/ajaxorg/ace/issues/5548)) ([7a51992](https://github.com/ajaxorg/ace/commit/7a5199292f55dfa1a8ea8830ea1a9d98be097161))
* wrong token type ([#5535](https://github.com/ajaxorg/ace/issues/5535)) ([4041489](https://github.com/ajaxorg/ace/commit/4041489bb38ffe609d5f9b43b4a7637e47fc4739))

### [1.33.1](https://github.com/ajaxorg/ace/compare/v1.33.0...v1.33.1) (2024-04-23)


### Bug Fixes

* account for `this.popup` being potentially undefined in completion mousewheel listener ([#5537](https://github.com/ajaxorg/ace/issues/5537)) ([6c3a9a6](https://github.com/ajaxorg/ace/commit/6c3a9a66a7a0ab0dd493ad2c281c9dd343d5301f))

## [1.33.0](https://github.com/ajaxorg/ace/compare/v1.32.9...v1.33.0) (2024-04-12)


### Features

* Make translation system key based and add annotation type to gutter icon aria labels ([#5524](https://github.com/ajaxorg/ace/issues/5524)) ([bb8256d](https://github.com/ajaxorg/ace/commit/bb8256d5a5b5e989e3fb1bb80f326b8564fbbc20))


### Bug Fixes

* Contrast is too low for searched items ([#5523](https://github.com/ajaxorg/ace/issues/5523)) ([507ae2f](https://github.com/ajaxorg/ace/commit/507ae2f872a2b2f1a14fdffbf6530f4046df44c0))

### [1.32.9](https://github.com/ajaxorg/ace/compare/v1.32.8...v1.32.9) (2024-03-29)


### Bug Fixes

* apply class to autocomplete popup for no suggestions state ([#5522](https://github.com/ajaxorg/ace/issues/5522)) ([a66f861](https://github.com/ajaxorg/ace/commit/a66f8619953eecd85833d97715e479d3b211c4cd))

### [1.32.8](https://github.com/ajaxorg/ace/compare/v1.32.7...v1.32.8) (2024-03-22)


### Bug Fixes

* allow completers to trigger on newline characters ([#5519](https://github.com/ajaxorg/ace/issues/5519)) ([6e870fd](https://github.com/ajaxorg/ace/commit/6e870fd08e06be47f9da971743d13b25c41f99c2))
* don't detach completion popup while typing when prefix is empty ([#5517](https://github.com/ajaxorg/ace/issues/5517)) ([7937e53](https://github.com/ajaxorg/ace/commit/7937e53babb9b327902e9dab4b18c04a907883be))
* scroll cursor line to top editor for long inline preview ([#5514](https://github.com/ajaxorg/ace/issues/5514)) ([529473b](https://github.com/ajaxorg/ace/commit/529473b6959d5f7a70ada1d20feb0c87b432f766))
* SwiftHighlightRules exports ([#5516](https://github.com/ajaxorg/ace/issues/5516)) ([f493ab0](https://github.com/ajaxorg/ace/commit/f493ab03bb50fe089c927b7a50a4a327c8dcec4c))

### [1.32.7](https://github.com/ajaxorg/ace/compare/v1.32.6...v1.32.7) (2024-03-01)


### Bug Fixes

* swap blue/red in cloudeditor themes to reduces usage of red ([#5492](https://github.com/ajaxorg/ace/issues/5492)) ([0e8f549](https://github.com/ajaxorg/ace/commit/0e8f549a16481f8bb7573ac9edaae377cb9e3972))

### [1.32.6](https://github.com/ajaxorg/ace/compare/v1.32.5...v1.32.6) (2024-02-07)

### [1.32.5](https://github.com/ajaxorg/ace/compare/v1.32.4...v1.32.5) (2024-01-30)

### [1.32.4](https://github.com/ajaxorg/ace/compare/v1.32.3...v1.32.4) (2024-01-29)


### Bug Fixes

* Improve contrast of completion popup in CloudEditor theme ([#5473](https://github.com/ajaxorg/ace/issues/5473)) ([273c7f1](https://github.com/ajaxorg/ace/commit/273c7f159ded7dc9403266c6501e16a35e4101c6))
* update JSX mode to reflect React JSX ([#5451](https://github.com/ajaxorg/ace/issues/5451)) ([66789a7](https://github.com/ajaxorg/ace/commit/66789a79ce1b7791c65886d8aecddd7efc0415e8))

### [1.32.3](https://github.com/ajaxorg/ace/compare/v1.32.2...v1.32.3) (2023-12-29)


### Bug Fixes

* improve prefixing for inline preview ([#5439](https://github.com/ajaxorg/ace/issues/5439)) ([51006bb](https://github.com/ajaxorg/ace/commit/51006bba9c60b97251ddb04ed74f68ba4e7f6b54))
* update ghost text if on same line popup ([12f4664](https://github.com/ajaxorg/ace/commit/12f466460d7187cfe37593dab1fbe275403fedd3))
* updated red color in cloud-editor dark theme ([#5432](https://github.com/ajaxorg/ace/issues/5432)) ([142b607](https://github.com/ajaxorg/ace/commit/142b607578f5d071a5026691ff6662c11e9f186b))

### [1.32.2](https://github.com/ajaxorg/ace/compare/v1.32.1...v1.32.2) (2023-12-14)


### Bug Fixes

* **themes:** changed the solarized theme primary color from `[#93](https://github.com/ajaxorg/ace/issues/93)A1A1` to `[#839496](https://github.com/ajaxorg/ace/issues/839496)`. ([#5422](https://github.com/ajaxorg/ace/issues/5422)) ([114a5c1](https://github.com/ajaxorg/ace/commit/114a5c163fd875b4fab332dadfadeeae41e4097a)), closes [#93A1A1](https://github.com/ajaxorg/ace/issues/93A1A1)

### [1.32.1](https://github.com/ajaxorg/ace/compare/v1.32.0...v1.32.1) (2023-12-11)


### Bug Fixes

* don't show loading state when empty completer array is provided ([7a8a929](https://github.com/ajaxorg/ace/commit/7a8a92933b3fde75907612d106643d28efa2d776))
* prevent browser scroll while scrolling over the tooltip ([#5414](https://github.com/ajaxorg/ace/issues/5414)) ([c6475c0](https://github.com/ajaxorg/ace/commit/c6475c00bcfa49dde37ef9de06ebba82ba5ba15d))
* switch aria-selected to aria-current for webkit ([#5416](https://github.com/ajaxorg/ace/issues/5416)) ([bf1a4ea](https://github.com/ajaxorg/ace/commit/bf1a4ea607ed09b5a299390dd2daa5c1d0019e00)), closes [#5403](https://github.com/ajaxorg/ace/issues/5403)
* yaml worker errors at undefined row/column ([06cc12a](https://github.com/ajaxorg/ace/commit/06cc12aad98176d931a1c1cf9a701f4ac0c33de5))

## [1.32.0](https://github.com/ajaxorg/ace/compare/v1.31.2...v1.32.0) (2023-11-30)


### Features

* adding CloudEditor theme ([#5404](https://github.com/ajaxorg/ace/issues/5404)) ([b0ee067](https://github.com/ajaxorg/ace/commit/b0ee067fadaf9593ed2207f363a402eb9ab8d57a))


### Bug Fixes

* autocomplete tests ([#5407](https://github.com/ajaxorg/ace/issues/5407)) ([cf6999d](https://github.com/ajaxorg/ace/commit/cf6999d9cb4103df16dc38a8cbfd40ab2a999e6d))
* set completion popup role to 'menu' for safari ([6845905](https://github.com/ajaxorg/ace/commit/684590546746fa2ef090c10c140e01e43974d8f4))
* stop rendering the completion popup disconnected from the editor for long ghost text ([#5401](https://github.com/ajaxorg/ace/issues/5401)) ([94d68a7](https://github.com/ajaxorg/ace/commit/94d68a73042c61a786d253fd0838e62cc5770a31))
* try to scroll inline preview into view ([#5400](https://github.com/ajaxorg/ace/issues/5400)) ([95af560](https://github.com/ajaxorg/ace/commit/95af5608b655259d12cdbc4ca28cf450f9e649c7))

### [1.31.2](https://github.com/ajaxorg/ace/compare/v1.31.1...v1.31.2) (2023-11-15)


### Bug Fixes

* inline preview with loading state ([05db94f](https://github.com/ajaxorg/ace/commit/05db94f53774f64318de757347f7217043744fe6))

### [1.31.1](https://github.com/ajaxorg/ace/compare/v1.31.0...v1.31.1) (2023-10-30)


### Bug Fixes

* improve yaml folding ([5c80e3c](https://github.com/ajaxorg/ace/commit/5c80e3cdd716b4ad26ee6958c9137278530b7816))

## [1.31.0](https://github.com/ajaxorg/ace/compare/v1.30.0...v1.31.0) (2023-10-23)


### Features

* add nasal language ([#5342](https://github.com/ajaxorg/ace/issues/5342)) ([4fff99e](https://github.com/ajaxorg/ace/commit/4fff99e320539a1472ce0512cd1fd3e5fc7f2ca6))


### Bug Fixes

* doc tooltip not filtering properly ([e5034c7](https://github.com/ajaxorg/ace/commit/e5034c7b58fb47fe57b28dbb001e72a567ef9abe))

## [1.30.0](https://github.com/ajaxorg/ace/compare/v1.29.0...v1.30.0) (2023-10-13)


### Features

* Add support for time units in PRQL ([#5324](https://github.com/ajaxorg/ace/issues/5324)) ([8b9175b](https://github.com/ajaxorg/ace/commit/8b9175bc780fade64bed1570fa1cd34d022b337b))

## [1.29.0](https://github.com/ajaxorg/ace/compare/v1.28.0...v1.29.0) (2023-10-09)


### Features

* allow setting completion.ignoreCaption ([5618046](https://github.com/ajaxorg/ace/commit/56180467e12c300850da89cc13c1c8648fb5e342))

## [1.28.0](https://github.com/ajaxorg/ace/compare/v1.27.0...v1.28.0) (2023-09-22)


### Features

* Keep focus on same item in completion popup when slow completer delivers results. ([#5322](https://github.com/ajaxorg/ace/issues/5322)) ([0983134](https://github.com/ajaxorg/ace/commit/09831343ccd450326cffb4b0f26ce3a8b830c7fb))

## [1.27.0](https://github.com/ajaxorg/ace/compare/v1.26.0...v1.27.0) (2023-09-19)


### Features

* Allow not showing inline preview for completers when `inlineEnabled` is set to `true`. ([#5315](https://github.com/ajaxorg/ace/issues/5315)) ([f3e3330](https://github.com/ajaxorg/ace/commit/f3e333041fc1a687b3ce35a44f1bf00bcc15a236))

## [1.26.0](https://github.com/ajaxorg/ace/compare/v1.25.1...v1.26.0) (2023-09-15)


### Features

* Allow to set setSelectOnHover for Autocomplete ([#5317](https://github.com/ajaxorg/ace/issues/5317)) ([dccbcc2](https://github.com/ajaxorg/ace/commit/dccbcc20288a48403f10aa29b6b9b6181dc8a66f))


### Bug Fixes

* Improve PRQL syntax highlightning ([#5313](https://github.com/ajaxorg/ace/issues/5313)) ([7d677f1](https://github.com/ajaxorg/ace/commit/7d677f1019ea5c81f3d9ae36ed1e71ac7a08fb30))

### [1.25.1](https://github.com/ajaxorg/ace/compare/v1.25.0...v1.25.1) (2023-09-14)

## [1.25.0](https://github.com/ajaxorg/ace/compare/v1.24.2...v1.25.0) (2023-09-14)


### Features

* Add syntax highlighting for PRQL ([#5307](https://github.com/ajaxorg/ace/issues/5307)) ([24862cd](https://github.com/ajaxorg/ace/commit/24862cdc83694bbe541c6f8be6fbaaff80d44bf7))

### [1.24.2](https://github.com/ajaxorg/ace/compare/v1.24.1...v1.24.2) (2023-09-08)


### Bug Fixes

* Added project details in index.html file ([#5300](https://github.com/ajaxorg/ace/issues/5300)) ([6e83505](https://github.com/ajaxorg/ace/commit/6e835059dd13e95178b15ce9b06a2f2444c2e731))
* autocompletion threshold doesn't apply to trigger characters ([84bbc88](https://github.com/ajaxorg/ace/commit/84bbc888e1c0304c0160bb19fc46cf5539d079cf))
* Update php_highlight_rules.js ([#5288](https://github.com/ajaxorg/ace/issues/5288)) ([caedd0c](https://github.com/ajaxorg/ace/commit/caedd0cf22d5a7644ceb418562ebcab801011c88))

### [1.24.1](https://github.com/ajaxorg/ace/compare/v1.24.0...v1.24.1) (2023-08-15)

## [1.24.0](https://github.com/ajaxorg/ace/compare/v1.23.4...v1.24.0) (2023-08-09)


### Features

* Add support for Unicode boundaries ([#5265](https://github.com/ajaxorg/ace/issues/5265)) ([1e6fcf3](https://github.com/ajaxorg/ace/commit/1e6fcf349d222715429ddc9fe6a38ec1f6d72ab1))
* Allow more lines in hidden textarea to improve screen reader experience on Windows ([#5225](https://github.com/ajaxorg/ace/issues/5225)) ([bccff5a](https://github.com/ajaxorg/ace/commit/bccff5ae21b86004c2a4ab4a86a989c61e728ebf))
* Cuttlefish mode ([#5278](https://github.com/ajaxorg/ace/issues/5278)) ([9cddf64](https://github.com/ajaxorg/ace/commit/9cddf64ac51fc5e7c5474e7aeaa2ef8f069220db))


### Bug Fixes

* add missing SQL keywords: IS and IN ([#5263](https://github.com/ajaxorg/ace/issues/5263)) ([c731164](https://github.com/ajaxorg/ace/commit/c731164315a757a5e0380f82eeef105a17b24b03))
* bug in lua.lua example file kitchen-sink ([#5258](https://github.com/ajaxorg/ace/issues/5258)) ([6549570](https://github.com/ajaxorg/ace/commit/6549570310983999a1fd3ce52bc5bf8b4004402f))
* support more environments ([#5266](https://github.com/ajaxorg/ace/issues/5266)) ([b196806](https://github.com/ajaxorg/ace/commit/b196806eb2937e7ee56e42b482b7b3bd5e3c9d79))

### [1.23.4](https://github.com/ajaxorg/ace/compare/v1.23.3...v1.23.4) (2023-07-12)


### Bug Fixes

* filterText triggered selection range removal when completions range was present ([#5249](https://github.com/ajaxorg/ace/issues/5249)) ([b586e4d](https://github.com/ajaxorg/ace/commit/b586e4d574bf780fc38f1ac0d034276272b36ad3))

### [1.23.3](https://github.com/ajaxorg/ace/compare/v1.23.2...v1.23.3) (2023-07-10)


### Bug Fixes

* android bug when deleting multiple lines ([#5248](https://github.com/ajaxorg/ace/issues/5248)) ([bd066ff](https://github.com/ajaxorg/ace/commit/bd066ffef88ca74f5ac32349d3e868cfa875a47b)), closes [#5087](https://github.com/ajaxorg/ace/issues/5087)
* update jshint version to 2.13.6; change esversion to target ECMAScript 11 ([#5243](https://github.com/ajaxorg/ace/issues/5243)) ([301aee9](https://github.com/ajaxorg/ace/commit/301aee91b5974d9fb31d646466ed301c5c3b8249))

### [1.23.2](https://github.com/ajaxorg/ace/compare/v1.23.1...v1.23.2) (2023-07-07)


### Bug Fixes

* **autocomplete:** fix a11y violations ([#5241](https://github.com/ajaxorg/ace/issues/5241)) ([decb615](https://github.com/ajaxorg/ace/commit/decb6154198105289170303b7434c524eaf9fda8))
* bug in guttertooltip when `tooltipsFollowsMouse` set to false ([#5217](https://github.com/ajaxorg/ace/issues/5217)) ([67d318e](https://github.com/ajaxorg/ace/commit/67d318ed25d5b45789462850e6b96aac2931591f))
* typo in function name ([#5229](https://github.com/ajaxorg/ace/issues/5229)) ([6e99055](https://github.com/ajaxorg/ace/commit/6e99055c46f443271161e40fe15372d1d8ae9f42))

### [1.23.1](https://github.com/ajaxorg/ace/compare/v1.23.0...v1.23.1) (2023-06-27)

## [1.23.0](https://github.com/ajaxorg/ace/compare/v1.22.1...v1.23.0) (2023-06-21)


### Features

* **autocomplete:** ellipsis is shown when suggestions is longer than popover width ([#5204](https://github.com/ajaxorg/ace/issues/5204)) ([de4234b](https://github.com/ajaxorg/ace/commit/de4234be62be264b78bd4dd19b09cf20fb4d0f28))
* signal gutterkeydown in keyboard accessibility mode ([#5202](https://github.com/ajaxorg/ace/issues/5202)) ([538b18c](https://github.com/ajaxorg/ace/commit/538b18cf86e21c810910d286c820bac399927cd7))


### Bug Fixes

* Fix vite build and webpack warning ([#5192](https://github.com/ajaxorg/ace/issues/5192)) ([e14902e](https://github.com/ajaxorg/ace/commit/e14902e0c2b281346d062d6a5c84d05bd3590fe3))
* gutter tooltip class fix ([#5211](https://github.com/ajaxorg/ace/issues/5211)) ([5bdb944](https://github.com/ajaxorg/ace/commit/5bdb944714e7787632914aeef521e3e5024a1d1f))
* Improve ARIA labelling fold controls ([#5205](https://github.com/ajaxorg/ace/issues/5205)) ([dad5e6f](https://github.com/ajaxorg/ace/commit/dad5e6f6e445b805f7b470ef7892442a83d342e5))
* regression in setting breakpoints on folded lines ([51326eb](https://github.com/ajaxorg/ace/commit/51326ebfe9b3e97925ab1be05246e0f2646c8687))

### [1.22.1](https://github.com/ajaxorg/ace/compare/v1.22.0...v1.22.1) (2023-06-11)


### Bug Fixes

* don't throw unhandled errors in TabstopManager when EditSession becomes `undefined` ([#5193](https://github.com/ajaxorg/ace/issues/5193)) ([cd55932](https://github.com/ajaxorg/ace/commit/cd55932ac7161fcd45e2ee4f1ea8e22b5ff8c3c4))
* include ace-modes to the npm package ([a074fa4](https://github.com/ajaxorg/ace/commit/a074fa41334314169075b66cd77dd2d9a191c73f))
* jsdoc comment foldings ([#5197](https://github.com/ajaxorg/ace/issues/5197)) ([065af41](https://github.com/ajaxorg/ace/commit/065af4175f7c7426c9e8f798a0ec64c390a03259))

## [1.22.0](https://github.com/ajaxorg/ace/compare/v1.21.1...v1.22.0) (2023-05-22)


### Features

* add odin mode ([#5169](https://github.com/ajaxorg/ace/issues/5169)) ([d455e9b](https://github.com/ajaxorg/ace/commit/d455e9b16efb6030a8b0b6c1189b72516b205b40))

### [1.21.1](https://github.com/ajaxorg/ace/compare/v1.21.0...v1.21.1) (2023-05-16)


### Bug Fixes

* console error when hovering over empty gutter cell with tooltipFollowsMouse set to false ([#5173](https://github.com/ajaxorg/ace/issues/5173)) ([5ff8d4c](https://github.com/ajaxorg/ace/commit/5ff8d4cc064ac647a2f40bf977f88b2972ae17ef))

## [1.21.0](https://github.com/ajaxorg/ace/compare/v1.20.0...v1.21.0) (2023-05-15)


### Features

* Custom empty message when no completion found ([#5158](https://github.com/ajaxorg/ace/issues/5158)) ([204aafa](https://github.com/ajaxorg/ace/commit/204aafa04c268e98655fb83b4877302a0f82fa4d))
* Special trigger characters to start autocomplete ([#5147](https://github.com/ajaxorg/ace/issues/5147)) ([c2cfc5a](https://github.com/ajaxorg/ace/commit/c2cfc5a9f1448f64e62f7652c995a48c4ea31ab3))


### Bug Fixes

* command bar command type ([#5168](https://github.com/ajaxorg/ace/issues/5168)) ([64c8253](https://github.com/ajaxorg/ace/commit/64c8253e3cd4348b7ecd3684dae057c8fd5f79b9))

## [1.20.0](https://github.com/ajaxorg/ace/compare/v1.19.0...v1.20.0) (2023-05-10)


### Features

* Add gutter controls to keyboard accessibility mode ([#5146](https://github.com/ajaxorg/ace/issues/5146)) ([5f2face](https://github.com/ajaxorg/ace/commit/5f2face8febe7c260a42bc30c67195f6a5a46085))
* Inline autocomplete tooltip UX redesign ([#5149](https://github.com/ajaxorg/ace/issues/5149)) ([8d56c84](https://github.com/ajaxorg/ace/commit/8d56c841ef980527a1ebe4cf73442766f5f97208))

## [1.19.0](https://github.com/ajaxorg/ace/compare/v1.18.1...v1.19.0) (2023-05-03)


### Features

* publishing generated styling files to ace-code package ([1fa223e](https://github.com/ajaxorg/ace/commit/1fa223e4ca0df16c9a0e0a6df2996fa010189666))

### [1.18.1](https://github.com/ajaxorg/ace/compare/v1.18.0...v1.18.1) (2023-05-03)


### Bug Fixes

* add mode types, improve type definitions ([e22bd5c](https://github.com/ajaxorg/ace/commit/e22bd5c860451c000187941991c0047db4e701a2))
* hide `$getindent` from the SyntaxMode ([2b1c65b](https://github.com/ajaxorg/ace/commit/2b1c65bceb290db74f26a5c59158f93830bc6111))
* remove '$' fields for types that don't require exposing them ([2db9d4e](https://github.com/ajaxorg/ace/commit/2db9d4e88441f2932ce6c6f91e7f5ed36c590d2f))
* remove or update badly formatted declarations ([1e7b022](https://github.com/ajaxorg/ace/commit/1e7b022908cdf6fef0a28419c464874ce6433e6e))
* replaceRange could now be implemented as an instance of the Range interface, rather than being an instance of the Range class ([e1bdccc](https://github.com/ajaxorg/ace/commit/e1bdcccb4ed3179734aa534b37a9dade2e207f07))
* wrong next state in regex state ([c5ed709](https://github.com/ajaxorg/ace/commit/c5ed7092f0151d4aa00c7060ecf0111fc37bfebb))

## [1.18.0](https://github.com/ajaxorg/ace/compare/v1.17.0...v1.18.0) (2023-04-21)


### Features

* marker groups ([#5113](https://github.com/ajaxorg/ace/issues/5113)) ([01d4605](https://github.com/ajaxorg/ace/commit/01d4605c0dcf7bcbb4f1a09a243f7ef6d16d7d43))
* summary of annotations in folded lines ([#5117](https://github.com/ajaxorg/ace/issues/5117)) ([dc63ba9](https://github.com/ajaxorg/ace/commit/dc63ba900d3641284d7d11cbb5ccad7c3039f3a4))

## [1.17.0](https://github.com/ajaxorg/ace/compare/v1.16.0...v1.17.0) (2023-04-12)


### Features

* Add annotation level information to gutter tooltip ([#5101](https://github.com/ajaxorg/ace/issues/5101)) ([3cd28b8](https://github.com/ajaxorg/ace/commit/3cd28b88a51176c791e045f405cdf842916697ab))
* Add option to prevent keyboard focus trapping ([#5114](https://github.com/ajaxorg/ace/issues/5114)) ([fe5d1bf](https://github.com/ajaxorg/ace/commit/fe5d1bfbf0a3432b78a5e503d1db680181ef48b8))
* Add option to use SVG gutter icons ([#5107](https://github.com/ajaxorg/ace/issues/5107)) ([82eb439](https://github.com/ajaxorg/ace/commit/82eb439709773a71515fbe97c4e89890ea77e752))
* add ResizeObserver to make calling editor.resize optional ([51d5e4d](https://github.com/ajaxorg/ace/commit/51d5e4d4308ba98921b1d6ea8cf946d0e17d0a7a))


### Bug Fixes

* adds missing 'on' method for 'guttermousedown' ([7212042](https://github.com/ajaxorg/ace/commit/721204292907549fd4fd02d6672afd2b63d1e168))
* Fix bracket highlighting for brackets in open/close tags ([#5108](https://github.com/ajaxorg/ace/issues/5108)) ([3c149a9](https://github.com/ajaxorg/ace/commit/3c149a97acedd9c9ad52daebaf944aa26534d37f))
* Improves Liquid Support ([#5098](https://github.com/ajaxorg/ace/issues/5098)) ([0ae8dbb](https://github.com/ajaxorg/ace/commit/0ae8dbb0fe017cfb8321307e5bfe5959eb121754))

## [1.16.0](https://github.com/ajaxorg/ace/compare/v1.14.0...v1.16.0) (2023-03-17)


### Features

* Added Editor API to set the ghost text ([#5036](https://github.com/ajaxorg/ace/issues/5036)) ([958d573](https://github.com/ajaxorg/ace/commit/958d57383c4ebfacd414eb817aecc2e0982d1b36))
* Inline autocompletion ([#5084](https://github.com/ajaxorg/ace/issues/5084)) ([eb834a1](https://github.com/ajaxorg/ace/commit/eb834a1f1ca7f922437a90f2f14d935d75f31ac8))


### Bug Fixes

* add updated monospace font for Windows ([#5091](https://github.com/ajaxorg/ace/issues/5091)) ([a981972](https://github.com/ajaxorg/ace/commit/a9819722cec6ff60b028deaa7b70d7fefabac531))
* Added highlighting for TIES keyword introduced in PostgreSQL 13 ([#5033](https://github.com/ajaxorg/ace/issues/5033)) ([9588086](https://github.com/ajaxorg/ace/commit/95880868c2a9912f7c6a2c3942d67fc2a980094e))
* Added lateral keyword introduced in MySQL 8.0.14 ([#5053](https://github.com/ajaxorg/ace/issues/5053)) ([3250956](https://github.com/ajaxorg/ace/commit/32509568010d8b881cc9f1a6d6bd76e6f69360ea))
* editor shadow appears under the selected line background when horizontal scroll is active ([#5020](https://github.com/ajaxorg/ace/issues/5020)) ([ab4f788](https://github.com/ajaxorg/ace/commit/ab4f788455ae182ae133fa202d737efa5461ff79))
* Fix bug with missing token in latex folding ([#5093](https://github.com/ajaxorg/ace/issues/5093)) ([44b3a3e](https://github.com/ajaxorg/ace/commit/44b3a3ef2de40f5cc71c3dedc1ed8d596cfadeec)), closes [#5090](https://github.com/ajaxorg/ace/issues/5090)
* Implement highlight mode for PL/SQL (Oracle) dialect ([#5037](https://github.com/ajaxorg/ace/issues/5037)) ([159aa70](https://github.com/ajaxorg/ace/commit/159aa70d551530f2866fb0006fad37bd75e60dda))
* Improve MySQL highlighting mode ([#5050](https://github.com/ajaxorg/ace/issues/5050)) ([00f6089](https://github.com/ajaxorg/ace/commit/00f60890a36121d7c705445514dcf79a81055f55))
* Option to determine specific prefixes for quote insertion ([#5067](https://github.com/ajaxorg/ace/issues/5067)) ([34e769c](https://github.com/ajaxorg/ace/commit/34e769c5b29a68a3c4201fecc75d1287c99f9d51)), closes [#5063](https://github.com/ajaxorg/ace/issues/5063)
* Remove broken keybinding from vscode mode ([#5032](https://github.com/ajaxorg/ace/issues/5032)) ([68ff964](https://github.com/ajaxorg/ace/commit/68ff964a214cc2da66e4a35b313ff66dd4490e34))

### [1.15.3](https://github.com/ajaxorg/ace/compare/v1.15.2...v1.15.3) (2023-03-02)

### [1.15.2](https://github.com/ajaxorg/ace/compare/v1.15.1...v1.15.2) (2023-02-16)

### [1.15.1](https://github.com/ajaxorg/ace/compare/v1.15.0...v1.15.1) (2023-02-13)


### Bug Fixes

* Added lateral keyword introduced in MySQL 8.0.14 ([#5053](https://github.com/ajaxorg/ace/issues/5053)) ([3250956](https://github.com/ajaxorg/ace/commit/32509568010d8b881cc9f1a6d6bd76e6f69360ea))
* Implement highlight mode for PL/SQL (Oracle) dialect ([#5037](https://github.com/ajaxorg/ace/issues/5037)) ([159aa70](https://github.com/ajaxorg/ace/commit/159aa70d551530f2866fb0006fad37bd75e60dda))
* Improve MySQL highlighting mode ([#5050](https://github.com/ajaxorg/ace/issues/5050)) ([00f6089](https://github.com/ajaxorg/ace/commit/00f60890a36121d7c705445514dcf79a81055f55))

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
