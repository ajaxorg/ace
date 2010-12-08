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
var EventEmitter = require('pilot/event_emitter').EventEmitter;

//var keyboard = require('keyboard/keyboard');
var types = require('pilot/types');
var Status = require('pilot/types').Status;
var Conversion = require('pilot/types').Conversion;
var canon = require('pilot/canon');


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
    this.setText(text);
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
    },

    setText: function(text) {
        if (text == null) {
            throw new Error('Illegal text for Argument: ' + text);
        }
        this.text = text;
    }
};
/**
 * Merge an array of arguments into a single argument.
 */
Argument.merge = function(argArray, start, end) {
    start = (start === undefined) ? 0 : start;
    end = (end === undefined) ? argArray.length : end;

    var joined;
    for (var i = start; i < end; i++) {
        var arg = argArray[i];
        if (!joined) {
            joined = arg;
        }
        else {
            joined = joined.merge(arg);
        }
    }
    return joined;
};


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
     * Use setValue() to mutate
     */
    value: undefined,
    setValue: function(value) {
        if (this.value === value) {
            return;
        }
        if (value === undefined) {
            value = this.param.defaultValue;
        }
        this.value = value;

        var text = (value == null) ? '' : this.param.type.stringify(value);
        if (this.arg) {
            this.arg.setText(text);
        }

        this.conversion = undefined;
        //this._dispatchEvent('change', { assignment: this });
    },

    /**
     * The textual representation of the current value
     * Use setValue() to mutate
     */
    arg: undefined,
    setArgument: function(arg) {
        if (this.arg === arg) {
            return;
        }
        this.arg = arg;
        this.conversion = this.param.type.parse(arg.text);
        this.value = this.conversion.value;
        //this._dispatchEvent('change', { assignment: this });
    },

    /**
     * Create a list of this hints associated with this parameter assignment
     */
    getHints: function() {
        var hints = [];
        if (this.conversion != null &&
              (this.conversion.status !== Status.VALID ||
              this.conversion.message)) {
            hints.push(new ConversionHint(this.conversion, this.arg));
        }

        var argProvided = this.arg != null && this.arg.text !== '';
        var dataProvided = this.value !== undefined || argProvided;

        if (this.param.defaultValue === undefined && !dataProvided) {
            // If the there is no data provided, we have no start/end. Use -1
            hints.push(new Hint(Status.INVALID,
                    'Argument for ' + param.name + ' is required'
                    -1, -1));
        }
        return hints;
    },

    /**
     * Report on the status of the last parse() conversion.
     * @see types.Conversion
     */
    conversion: undefined
};
oop.implement(Assignment, EventEmitter);
exports.Assignment = Assignment;


/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 * CliRequisition adds functions for parsing input from a command line to this
 * class
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
        var hints = [];
        Object.keys(this._assignments).map(function(name) {
            // Append the assignments hints to our list
            hints.push.apply(hints, this._assignments[name].getHints());
        }, this);
        return hints;
    },

    /**
     * Extract the names and values of all the assignments, and return as
     * an object.
     */
    getArgs: function() {
        var args = {};
        Object.keys(this._assignments).forEach(function(name) {
            args[name] = this.getAssignment(name).value;
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
        canon.exec(this.command, this.getArgs());
    }
};
exports.Requisition = Requisition;


/**
 * An object used during command line parsing to hold the various intermediate
 * data steps.
 * <p>The 'output' of the update is held in 2 objects: input.hints which is an
 * array of hints to display to the user. In the future this will become a
 * single value.
 * <p>The other output value is input.requisition which gives access to an
 * args object for use in executing the final command.
 *
 * <p>The majority of the functions in this class are called in sequence by the
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
function CliRequisition(options) {
    if (options && options.flags) {
        /**
         * TODO: We were using a default of keyboard.buildFlags({ });
         * This allowed us to have commands that only existed in certain contexts
         * - i.e. Javascript specific commands.
         */
        this.flags = options.flags;
    }
}
oop.inherits(CliRequisition, Requisition);
(function() {
    /**
     *
     */
    CliRequisition.prototype.update = function(input) {
        this.hints = [];

        if (util.none(input.typed)) {
            this.setCommand(null);
            return;
        }

        var args = _tokenize(input.typed);
        if (args.length === 0) {
            // We would like to put some initial help here, but for anyone but
            // a complete novice a 'type help' message is very annoying, so we
            // need to find a way to only display this message once, or for
            // until the user click a 'close' button or similar
            this._addHint(Status.INCOMPLETE, '', 0, 0);
            this.setCommand(null);
            return;
        }

        var command = _split(args);
        if (!command) {
            // No command found - bail helpfully.
            var commandType = types.getType('command');
            var conversion = commandType.parse(input.typed);
            var arg = Argument.merge(args);
            this._addHint(new ConversionHint(conversion, arg));

            this.setCommand(null);
        }
        else {
            // The user hasn't started to type any arguments
            if (args.length === 0) {
                var message = documentCommand(command);
                this._addHint(Status.VALID, message, 0, input.typed.length);
            }

            this.setCommand(command);
            this._assign(args);
            this._addHint(CliRequisition.super_.getHints.call(this));
        }

        // Not knowing about cursor positioning, the requisition and assignments
        // can't know this, but anything they mark as INCOMPLETE is actually
        // INVALID unless the cursor is actually inside that argument.
        var c = input.cursor;
        this.hints.forEach(function(hint) {
            var startInHint = c.start >= hint.start && c.start <= hint.end;
            var endInHint = c.end >= hint.start && c.end <= hint.end;
            var inHint = startInHint || endInHint;
            if (!inHint && hint.status === Status.INCOMPLETE) {
                 hint.status = Status.INVALID;
            }
        }, this);

        return;
    };

    CliRequisition.prototype.getHints = function() {
        return this.hints;
    };

    /**
     * Some sugar around: 'this.hints.push(new Hint(...));', but you can also
     * pass in an array of Hints or the parameters to create a hint
     */
    CliRequisition.prototype._addHint = function(status, message, start, end) {
        if (status == null) {
            return;
        }
        if (status instanceof Hint) {
            this.hints.push(status);
        }
        else if (Array.isArray(status)) {
            this.hints.push.apply(this.hints, status);
        }
        else {
            this.hints.push(new Hint(status, message, start, end));
        }
    };

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
    CliRequisition.prototype._assign = function(args) {
        if (args.length === 0) {
            this.setDefaultValues();
            return;
        }

        // Create an error if the command does not take parameters, but we have
        // been given them ...
        if (this.assignmentCount === 0) {
            // TODO: previously we were doing some extra work to avoid this if
            // we determined that we had args that were all whitespace, but
            // probably given our tighter tokenize() this won't be an issue?
            this._addHint(Status.INVALID,
                this.command.name + ' does not take any parameters',
                Argument.merge(args));
            return;
        }

        // Special case: if there is only 1 parameter, and that's of type
        // text we put all the params into the first param
        if (this.assignmentCount == 1) {
            var assignment = this.getAssignment(0);
            if (assignment.param.type.name === 'text') {
                assignment.setArgument(Argument.merge(args));
                return;
            }
        }

        var assignments = this.cloneAssignments();
        var names = this.getParameterNames();

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
                }
                else {
                    if (i + 1 < args.length) {
                        // Missing value portion of this named param
                        this._addHint(Status.INCOMPLETE,
                            'Missing value for: ' + namedArgText,
                            args[i]);
                    }
                    else {
                        args.splice(i + 1, 1);
                        assignment.setArgument(args[i + 1]);
                    }
                }

                util.arrayRemove(names, assignment.name);
                args.splice(i, 1);
                // We don't need to i++ if we splice
            }
        }, this);

        // What's left are positional parameters assign in order
        names.forEach(function(name) {
            var assignment = this.getAssignment(name);
            if (args.length === 0) {
                // No more values
                assignment.setValue(undefined); // i.e. default
            }
            else {
                var arg = args[0];
                args.splice(0, 1);
                assignment.setArgument(arg);
            }
        }, this);

        if (args.length > 0) {
            var remaining = Argument.merge(args);
            this._addHint(Status.INVALID,
                'Input \'' + remaining.text + '\' makes no sense.',
                remaining);
        }
    };

})();
exports.CliRequisition = CliRequisition;

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
    // They need swapping back post-split - see unescape()
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

    function unescape(str) {
        return str
            .replace(/\uF000/g, ' ')
            .replace(/\uF001/g, '\'')
            .replace(/\uF002/g, '"');
    }

    var i = 0;
    var start = 0; // Where did this section start?
    var priorSpace = '';
    var args = [];

    while (true) {
        if (i >= typed.length) {
            // There is no more - tidy up
            if (mode !== OUTSIDE) {
                var str = unescape(typed.substring(start, i));
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
                var str = unescape(typed.substring(start, i));
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i;
                priorSpace = '';
            }
            break;

        case IN_SINGLE_Q:
            if (c === '\'') {
                var str = unescape(typed.substring(start, i));
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i + 1;
                priorSpace = '';
            }
            break;

        case IN_DOUBLE_Q:
            if (c === '"') {
                var str = unescape(typed.substring(start, i));
                args.push(new Argument(str, start, i, priorSpace));
                mode = OUTSIDE;
                start = i + 1;
                priorSpace = '';
            }
            break;
        }

        i++;
    }

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
            }
            else if (param.defaultValue === null) {
                docs.push(' <i>[');
                docs.push(param.name);
                docs.push(']</i>');
            }
            else {
                optionalParamCount++;
            }
        }, this);
        if (optionalParamCount > 3) {
            docs.push(' [options]');
        } else if (optionalParamCount > 0) {
            command.params.forEach(function(param) {
                if (param.defaultValue) {
                    docs.push(' [--<i>');
                    docs.push(param.name);
                    if (param.type.name === 'boolean') {
                        docs.push('</i>');
                    }
                    else {
                        docs.push('</i> ' + param.type.name);
                    }
                    docs.push(']');
                }
            }, this);
        }
        docs.push('</pre>');

        docs.push('<h2>Parameters</h2>');
        command.params.forEach(function(param) {
            docs.push('<h3 class="cmd_body"><i>' + param.name + '</i></h3>');
            docs.push('<p>' + param.description + '</p>');
            if (param.type.defaultValue) {
                docs.push('<p>Default: ' + param.type.defaultValue + '</p>');
            }
        }, this);
    }

    return docs.join('');
};
exports.documentCommand = documentCommand;




});
