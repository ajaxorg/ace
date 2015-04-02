/*
The MIT License (MIT)

Copyright (c) 2014-2015 Cucumber Ltd, Gaspar Nagy, TechTalk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
define(function(require,exports,module){

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Compiler() {
  EventEmitter.call(this);

  var self = this;

  this.compile = function (feature) {
    var backgroundSteps = feature.background ? feature.background.steps : [];

    feature.scenarioDefinitions.forEach(function (scenarioDefinition) {
      if(scenarioDefinition.type === 'Scenario') {
        compileScenario(backgroundSteps, scenarioDefinition);
      } else {
        compileScenarioOutline(backgroundSteps, scenarioDefinition);
      }
    });
  };

  function compileScenario(backgroundSteps, scenario) {
    var testCase = {
      name: scenario.keyword + ": " + scenario.name,
      location: scenario.location
    };
    self.emit('test-case', testCase);

    var steps = [].concat(backgroundSteps).concat(scenario.steps);
    steps.forEach(function (step) {
      var testStep = {
        name: step.keyword + step.name,
        location: step.location
      };
      self.emit('test-step', testStep);
    });
  }

  function compileScenarioOutline(backgroundSteps, scenarioOutline) {
    scenarioOutline.examples.forEach(function (example) {
      example.rows.forEach(function (row) {
        var i = 0;
        row.cells.forEach(function (cell) {

        });
      });
    });
  }
}

util.inherits(Compiler, EventEmitter);
module.exports = Compiler;

return module.exports;

});
