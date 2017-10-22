"use strict";

var jsdom = require('jsdom/').jsdom;
var doc = jsdom("<html><head></head><body></body></html>");

global.document     = doc;
global.window       = doc.defaultView;
global.self         = doc.self;
global.navigator    = doc.navigator;
global.location     = doc.location;
