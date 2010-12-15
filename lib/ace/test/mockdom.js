var dom     = require('jsdom/level2/html').dom.level2.html;
var browser = require('jsdom/browser/index').windowAugmentation(dom);

global.document     = browser.document;
global.window       = browser.window;
global.self         = browser.self;
global.navigator    = browser.navigator;
global.location     = browser.location;