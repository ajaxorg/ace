/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {


var console = require('pilot/console');
var util = require('pilot/util');
var oop = require('pilot/oop').oop;

//var keyboard = require('keyboard/keyboard');
var Status = require('pilot/types').Status;
var canon = require('pilot/canon');
var types = require('pilot/types');

var commandType;
exports.startup = function(data, reason) {
    commandType = types.getType('command');
};

/**
 * The information required to tell the user there is a problem with their
 * input.
 */
function Hint(status, message, start, end) {
    this.status = status;
    this.message = message;

    if (typeof start === 'number') {
        this.start = start;
        this.end = end;
    }
    else {
        var arg = start;
        this.start = arg.start;
        this.end = arg.end;
    }
}
Hint.prototype = {
};
exports.Hint = Hint;

/**
 * A Hint that arose as a result of a Conversion
 */
function ConversionHint(conversion, arg) {
    this.status = conversion.status;
    this.message = conversion.message;
    if (arg) {
        this.start = arg.start;
        this.end = arg.end;
    }
    else {
        this.start = 0;
        this.end = 0;
    }
    this.predictions = conversion.predictions;
};
oop.inherits(ConversionHint, Hint);


/**
 * We record where in the input string an argument comes so we can report errors
 * against those string positions.
 * @constructor
 */
function Argument(text, start, end, priorSpace) {
    this.text = text;
    this.start = start;
    this.end = end;
    this.priorSpace = priorSpace;
}
Argument.prototype = {
    /**
     * Return the result of merging these arguments
     */
    merge: function(following) {
        return new Argument(
            this.text + following.priorSpace + following.text,
            this.start, following.end,
            this.priorSpace);
    }
};
/**
 * Merge an array of arguments into a single argument.
 */
Argument.mergeAll = function(argArray) {
    var joined;
    argArray.forEach(function(arg) {
        if (!joined) {
            joined = arg;
        }
        else {
            joined = joined.merge(arg);
        }
    });
    return joined;
};


/**
 * An object used during command line parsing to hold the various intermediate
 * data steps.
 * <p>The 'output' of the parse is held in 2 objects: input.hints which is an
 * array of hints to display to the user. In the future this will become a
 * single value.
 * <p>The other output value is input.requisition which gives access to an
 * args object for use in executing the final command.
 *
 * The majority of the functions in this class are called in sequence by the
 * constructor. Their task is to add to <tt>hints</tt> fill out the requisition.
 * <p>The general sequence is:<ul>
 * <li>_tokenize(): convert _typed into _parts
 * <li>_split(): convert _parts into _command and _unparsedArgs
 * <li>_assign(): convert _unparsedArgs into requisition
 * </ul>
 *
 * @param typed {string} The instruction as typed by the user so far
 * @param options {object} A list of optional named parameters. Can be any of:
 * <b>flags</b>: Flags for us to check against the predicates specified with the
 * commands. Defaulted to <tt>keyboard.buildFlags({ });</tt>
 * if not specified.
 * @constructor
 */
function Input(options) {
    if (options) {
        if (options.flags) {
            this.flags = options.flags;
        }
        if (options.input) {
            // TODO: implement
            this.useAsInput(options.input);
        }
    }
    this.requisition = new Requisition();
}
Input.prototype = {
    /**
     * TODO: We were using a default of keyboard.buildFlags({ });
     * I think this allowed us to have commands that only existed in certain
     * contexts - i.e. Javascript specific commands.
     */
    flags: {},

    /**
     *
     */
    parse: function(typed) {
        if (util.none(typed)) {
            this.requisition.setCommand(null);
            return;
        }

        this.typed = typed;
        this.hints = [];

        var args = _tokenize(this.typed);
        if (args.length === 0) {
            // We would like to put some initial help here, but for anyone but
            // a complete novice a 'type help' message is very annoying, so we
            // need to find a way to only display this message once, or for
            // until the user click a 'close' button or similar
            this._addHint(Status.INCOMPLETE, '', 0, 0);
            this.requisition.setCommand(null);
            return;
        }

        var command = _split(args);

        if (!command) {
            // No command found - bail helpfully.
            var conversion = commandType.parse(typed);
            var arg = Argument.mergeAll(args);
            this._addHint(new ConversionHint(conversion, arg));

            this.requisition.setCommand(null);
        }
        else {
            // The user hasn't started to type any arguments
            if (args.length === 0) {
                var message = documentCommand(command);
                this._addHint(Status.VALID, message, 0, typed.length);
            }

            this.requisition.setCommand(command);
            this._assign(args);
            this.addHints(this.requisition.getHints());
        }
    },

    /**
     * Some sugar around: 'this.hints.push(new Hint(...));'
     */
    _addHint: function(status, message, start, end) {
        if (status instanceof Hint) {
            this.hints.push(status);
        }
        else if (Array.isArray(status)) {
            this.hints.push.apply(this.hints, status);
        }
        else {
            this.hints.push(new Hint(status, message, start, end));
        }
    },

    /**
     * Work out which arguments are applicable to which parameters.
     * <p>This takes #_command.params and #_unparsedArgs and creates a map of
     * param names to 'assignment' objects, which have the following properties:
     * <ul>
     * <li>param - The matching parameter.
     * <li>index - Zero based index into where the match came from on the input
     * <li>value - The matching input
     * </ul>
     */
    _assign: function(args) {
        if (args.length === 0) {
            this.requisition.setDefaultValues();
            return;
        }

        // Create an error if the command does not take parameters, but we have
        // been given them ...
        if (this.requisition.assignmentCount === 0) {
            // TODO: previously we were doing some extra work to avoid this if
            // we determined that we had args that were all whitespace, but
            // probably given our tighter tokenize() this won't be an issue?
            this._addHint(Status.INVALID,
                this.requisition.command.name + ' does not take any parameters',
                Argument.mergeAll(args));
            return;
        }

        // Special case: if there is only 1 parameter, and that's of type
        // text we put all the params into the first param
        if (this.requisition.assignmentCount == 1) {
            var assignment = this.requisition.getAssignment(0);
            if (assignment.param.type.name === 'text') {
                assignment.setText(Argument.mergeAll(args).text);
                return;
            }
        }

        var assignments = this.requisition.cloneAssignments();
        var names = this.requisition.getParameterNames();

        // Extract all the named parameters
        var used = [];
        assignments.forEach(function(assignment) {
            var namedArgText = '--' + assignment.name;

            var i = 0;
            while (true) {
                var arg = args[i];
                if (namedArgText !== arg.text) {
                    i++;
                    if (i >= args.length) {
                        break;
                    }
                    continue;
                }

                // boolean parameters don't have values, default to false
                if (assignment.param.type.name === 'boolean') {
                    assignment.setValue(true);
                } else {
                    if (i + 1 < args.length) {
                        // Missing value for this param
                        this._addHint(Status.INCOMPLETE,
                            'Missing value for: ' + namedArgText,
                            args[i]);
                    } else {
                        args.splice(i + 1, 1);
                        assignment.setText(args[i + 1].text);
                    }
                }

                util.arrayRemove(names, assignment.name);
                args.splice(i, 1);
                // We don't need to i++ if we splice
            }
        }, this);

        // What's left are positional parameters assign in order
        var i = 0;
        names.forEach(function(name) {
            var assignment = this.requisition.getAssignment(name);
            if (i >= args.length) {
                // No more values
                assignment.setValue(undefined); // i.e. default
            }
            else {
                var arg = args[i];
                args.splice(i, 1);
                assignment.setText(arg.text);
            }

            i++;
        }, this);

        if (args.length > 0) {
            var remaining = Argument.mergeAll(args);
            this._addHint(Status.INVALID,
                'Input \'' + remaining.text + '\' makes no sense.',
                remaining);
        }
    }
};
exports.Input = Input;

/**
 * Split up the input taking into account ' and "
 */
function _tokenize(typed) {
    var OUTSIDE = 1;     // The last character was whitespace
    var IN_SIMPLE = 2;   // The last character was part of a parameter
    var IN_SINGLE_Q = 3; // We're inside a single quote: '
    var IN_DOUBLE_Q = 4; // We're inside double quotes: "

    var mode = OUTSIDE;

    // First we un-escape. This list was taken from:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Unicode
    // We are generally converting to their real values except for \', \"
    // and '\ ' which we are converting to unicode private characters so we
    // can distinguish them from ', " and ' ', which have special meaning.
    // They need swapping back post-split.
    typed = typed
            .replace(/\\\\/g, '\\')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\v/g, '\v')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\ /g, '\uF000')
            .replace(/\\'/g, '\uF001')
            .replace(/\\"/g, '\uF002');

    var i = 0;
    var start = 0; // Where did this section start?
    var priorSpace = '';
    var args = [];

    while (true) {
        if (i >= typed.length) {
            // There is no more - tidy up
            if (mode !== OUTSIDE) {
                var str = typed.substring(start, i);
                args.push(new Argument(str, start, i, priorSpace));
            }
            break;
        }

        var c = typed[i];
        switch (mode) {
        case OUTSIDE:
            if (c === '\'') {
                priorSpace = typed.substring(start, i);
                mode = IN_SINGLE_Q;
                start = i + 1;
            }
            else if (c === '"') {
                priorSpace = typed.substring(start, i);
                mode = IN_DOUBLE_Q;
                start = i + 1;
            }
            else if (/ /.test(c)) {
                // Still whitespace, do nothing
            }
            else {
                priorSpace = typed.substring(start, i);
                mode = IN_SIMPLE;
                start = i;
            }
            break;

        case IN_SIMPLE:
            // There is an edge case of xx'xx which we are assuming to be
            // a single parameter (and same with ")
            if (c === ' ') {
                var str = typed.substring(start, i);
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i;
                priorSpace = '';
            }
            break;

        case IN_SINGLE_Q:
            if (c === '\'') {
                var str = typed.substring(start, i);
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i + 1;
                priorSpace = '';
            }
            break;

        case IN_DOUBLE_Q:
            if (c === '"') {
                var str = typed.substring(start, i);
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i + 1;
                priorSpace = '';
            }
            break;
        }

        i++;
    }

    args.forEach(function(arg) {
        arg.text = arg.text
            .replace(/\uF000/g, ' ')
            .replace(/\uF001/g, '\'')
            .replace(/\uF002/g, '"');
    });

    return args;
}
exports._tokenize = _tokenize;

/**
 * Looks in the canon for a command extension that matches what has been
 * typed at the command line.
 */
function _split(args) {
    if (args.length === 0) {
        return undefined;
    }

    var argsUsed = 0;
    var lookup = '';
    var command;

    while (true) {
        argsUsed++;
        lookup += args.map(function(arg) {
            return arg.text;
        }).slice(0, argsUsed).join(' ');
        command = canon.getCommand(lookup);

        if (!command) {
            // Not found. break with command == null
            return undefined;
        }

        /*
        // Previously we needed a way to hide commands depending context.
        // We have not resurrected that feature yet.
        if (!keyboard.flagsMatch(command.predicates, this.flags)) {
            // If the predicates say 'no match' then go LA LA LA
            command = null;
            break;
        }
        */

        if (command.exec) {
            // Valid command, break with command valid
            break;
        }

        // command, but no exec - this must be a sub-command
        lookup += ' ';
    }

    // Remove the used args
    for (var i = 0; i < argsUsed; i++) {
        args.shift();
    }

    return command;
}
exports._split = _split;


/**
 * Provide some documentation for a command.
 * TODO: this should return a hint
 */
function documentCommand(command) {
    var docs = [];
    docs.push('<h1>' + command.name + '</h1>');
    docs.push('<h2>Summary</h2>');
    docs.push('<p>' + command.description + '</p>');

    if (command.manual) {
        docs.push('<h2>Description</h2>');
        docs.push('<p>' + command.description + '</p>');
    }

    if (command.params && command.params.length > 0) {
        docs.push('<h2>Synopsis</h2>');
        docs.push('<pre>');
        docs.push(command.name);
        var optionalParamCount = 0;
        command.params.forEach(function(param) {
            if (param.defaultValue === undefined) {
                docs.push(' <i>');
                docs.push(param.name);
                docs.push('</i>');
            } else if (param.defaultValue === null) {
                docs.push(' <i>[');
                docs.push(param.name);
                docs.push(']</i>');
            } else {
                optionalParamCount++;
            }
        });
        if (optionalParamCount > 3) {
            docs.push(' [options]');
        } else if (optionalParamCount > 0) {
            command.params.forEach(function(param) {
                if (param.defaultValue) {
                    docs.push(' [--<i>');
                    docs.push(param.name);
                    if (param.type.name === 'boolean') {
                        docs.push('</i>');
                    } else {
                        docs.push('</i> ' + param.type.name);
                    }
                    docs.push(']');
                }
            });
        }
        docs.push('</pre>');

        docs.push('<h2>Parameters</h2>');
        command.params.forEach(function(param) {
            docs.push('<h3 class="cmd_body"><i>' + param.name + '</i></h3>');
            docs.push('<p>' + param.description + '</p>');
            if (param.type.defaultValue) {
                docs.push('<p>Default: ' + param.type.defaultValue + '</p>');
            }
        });
    }

    return docs.join('');
};
exports.documentCommand = documentCommand;


/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 * @constructor
 */
function Requisition() {
}
Requisition.prototype = {
    /**
     * The command that we are about to execute.
     * @readonly
     */
    command: undefined,

    /**
     * The count of assignments
     * @readonly
     */
    assignmentCount: undefined,

    /**
     * Set a new command. We make no attempt to convert the args in the old
     * command to args in the new command. The assignments need to be
     * re-entered.
     */
    setCommand: function(command) {
        if (this.command === command) {
            return;
        }

        this.command = command;
        this._assignments = {};

        if (command) {
            command.params.forEach(function(param) {
                this._assignments[param.name] = new Assignment(param);
            }, this);
        }

        this.assignmentCount = Object.keys(this._assignments);
    },

    /**
     * Assignments have an order, so we need to store them in an array.
     * But we also need named access ...
     */
    getAssignment: function(nameOrNumber) {
        var name = (typeof nameOrNumber === 'string') ?
            nameOrNumber :
            Object.keys(this._assignments)[nameOrNumber];
        return this._assignments[name];
    },

    /**
     * Where parameter name == assignment names - they are the same.
     */
    getParameterNames: function() {
      return Object.keys(this._assignments);
    },

    /**
     * A *shallow* clone of the assignments.
     * This is useful for systems that wish to go over all the assignments
     * finding values one way or another and wish to trim an array as they go.
     */
    cloneAssignments: function() {
        return Object.keys(this._assignments).map(function(name) {
            return this._assignments[name];
        }, this);
    },

    /**
     * Collect the statuses from the Assignments
     */
    getHints: function() {

    },

    /**
     * Extract the names and values of all the assignments, and return as
     * an object.
     */
    getArgs: function() {
        var args = {};
        Object.keys(this._assignments).forEach(function(name) {
            args[name] = getCommand(name);
        }, this);
        return args;
    },

    /**
     * Reset all the assignments to their default values
     */
    setDefaultValues: function() {
        Object.keys(this._assignments).forEach(function(name) {
            this._assignments[name].setValue(undefined);
        }, this);
    },

    /**
     * Helper to call canon.exec
     */
    exec: function() {
        exports.exec(this.command, this.getArgs());
    }
};
exports.Requisition = Requisition;


/**
 * A link between a parameter and the data for that parameter.
 * The data for the parameter is available as in the preferred type and as
 * an Argument for the CLI.
 * <p>We also record validity information where applicable.
 * <p>For values, null and undefined have distinct definitions. null means
 * that a value has been provided, undefined means that it has not.
 * Thus, null is a valid default value, and common because it identifies an
 * parameter that is optional. undefined means there is no value from
 * the command line.
 * @constructor
 */
function Assignment(param) {
    this.param = param;
    this.setValue(param.defaultValue);
};
Assignment.prototype = {
    /**
     * The parameter that we are assigning to
     * @readonly
     */
    param: undefined,

    /**
     * The current value (i.e. not the string representation)
     * @readonly - use setValue() to mutate
     */
    value: undefined,
    setValue: function(value) {
        if (this.value === value) {
            return;
        }
        if (value === undefined) {
            value = this.param.defaultValue;
        }
        this.text = (value === null) ? '' : this.param.type.stringify(value);
        this.value = value;
        this.status = Status.VALID;
        this.message = '';
        //this._dispatchEvent('change', { assignment: this });
    },

    /**
     * The textual representation of the current value
     * @readonly - use setValue() to mutate
     */
    text: undefined,
    setText: function(text) {
        if (this.text === text) {
            return;
        }
        var conversion = this.param.type.parse(text);
        this.text = text;
        this.value = conversion.value;
        this.status = conversion.status;
        this.message = conversion.message;
        //this._dispatchEvent('change', { assignment: this });
    },

    /**
     * Report on the status of the last parse() conversion.
     * @see types.Conversion
     */
    status: undefined,
    message: undefined
};
oop.implement(Assignment, EventEmitter);
exports.Assignment = Assignment;


});
