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
