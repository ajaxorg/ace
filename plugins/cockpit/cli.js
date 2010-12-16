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
var lang = require('pilot/lang');
var oop = require('pilot/oop');
var EventEmitter = require('pilot/event_emitter').EventEmitter;

//var keyboard = require('keyboard/keyboard');
var types = require('pilot/types');
var Status = require('pilot/types').Status;
var Conversion = require('pilot/types').Conversion;
var canon = require('pilot/canon');

/**
 * Normally type upgrade is done when the owning command is registered, but
 * out commandParam isn't part of a command, so it misses out.
 */
exports.startup = function(data, reason) {
    canon.upgradeType(commandParam);
};

/**
 * The information required to tell the user there is a problem with their
 * input.
 * TODO: There a several places where {start,end} crop up. Perhaps we should
 * have a Cursor object.
 */
function Hint(status, message, start, end, predictions) {
    this.status = status;
    this.message = message;

    if (typeof start === 'number') {
        this.start = start;
        this.end = end;
        this.predictions = predictions;
    }
    else {
        var arg = start;
        this.start = arg.start;
        this.end = arg.end;
        this.predictions = arg.predictions;
    }
}
Hint.prototype = {
};
/**
 * Loop over the array of hints finding the one we should display.
 * @param hints array of hints
 */
Hint.sort = function(hints, cursor) {
    // Calculate 'distance from cursor'
    if (cursor !== undefined) {
        hints.forEach(function(hint) {
            if (hint.start === Argument.AT_CURSOR) {
                hint.distance = 0;
            }
            else if (cursor < hint.start) {
                hint.distance = hint.start - cursor;
            }
            else if (cursor > hint.end) {
                hint.distance = cursor - hint.end;
            }
            else {
                hint.distance = 0;
            }
        }, this);
    }
    // Sort
    hints.sort(function(hint1, hint2) {
        // Compare first based on distance from cursor
        if (cursor !== undefined) {
            var diff = hint1.distance - hint2.distance;
            if (diff != 0) {
                return diff;
            }
        }
        // otherwise go with hint severity
        return hint2.status - hint1.status;
    });
    // tidy-up
    if (cursor !== undefined) {
        hints.forEach(function(hint) {
            delete hint.distance;
        }, this);
    }
    return hints;
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
 * We publish a 'change' event when-ever the text changes
 * @param emitter Arguments use something else to pass on change events.
 * Currently this will be the creating Requisition. This prevents dependency
 * loops and prevents us from needing to merge listener lists.
 * @param text The string (trimmed) that contains the argument
 * @param start The position of the text in the original input string
 * @param end See start
 * @param priorSpace Knowledge of the whitespace used prior to this argument in
 * the input string allows us to re-generate the original input from the
 * arguments.
 * @constructor
 */
function Argument(emitter, text, start, end, priorSpace) {
    this.emitter = emitter;
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
        if (following.emitter != this.emitter) {
            throw new Error('Can\'t merge Arguments from different EventEmitters');
        }
        return new Argument(
            this.emitter,
            this.text + following.priorSpace + following.text,
            this.start, following.end,
            this.priorSpace);
    },

    /**
     * See notes on events in Assignment. We might need to hook changes here
     * into a CliRequisition so they appear of the command line.
     */
    setText: function(text) {
        if (text == null) {
            throw new Error('Illegal text for Argument: ' + text);
        }
        var ev = { argument: this, oldText: this.text, text: text };
        this.text = text;
        this.emitter._dispatchEvent('argumentChange', ev);
    },

    /**
     * Helper when we're putting arguments back together
     */
    toString: function() {
        return this.priorSpace + this.text;
    }
};
/**
 * Merge an array of arguments into a single argument.
 * All Arguments in the array are expected to have the same emitter
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
 * We sometimes need a way to say 'this error occurs where ever the cursor is'
 */
Argument.AT_CURSOR = -1;


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
function Assignment(param, requisition) {
    this.param = param;
    this.requisition = requisition;
    this.setValue(param.defaultValue);
};
Assignment.prototype = {
    /**
     * The parameter that we are assigning to
     * @readonly
     */
    param: undefined,

    /**
     * Report on the status of the last parse() conversion.
     * @see types.Conversion
     */
    conversion: undefined,

    /**
     * The current value in a type as specified by param.type
     */
    value: undefined,

    /**
     * The string version of the current value
     */
    arg: undefined,

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
            this.arg = undefined;
        }
        this.value = value;

        var text = (value == null) ? '' : this.param.type.stringify(value);
        if (this.arg) {
            this.arg.setText(text);
        }

        this.conversion = undefined;
        this.requisition._assignmentChanged(this);
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
        this.conversion.arg = arg; // TODO: make this automatic?
        this.value = this.conversion.value;
        this.requisition._assignmentChanged(this);
    },

    /**
     * Create a list of the hints associated with this parameter assignment.
     * Generally there will be only one hint generated because we're currently
     * only displaying one hint at a time, ordering by distance from cursor
     * and severity. Since distance from cursor will be the same for all hints
     * from this assignment all but the most severe will ever be used. It might
     * make sense with more experience to alter this to function to be getHint()
     */
    getHint: function() {
        // Allow the parameter to provide documentation
        if (this.param.getCustomHint && this.value && this.arg) {
            var hint = this.param.getCustomHint(this.value, this.arg);
            if (hint) {
                return hint;
            }
        }

        // If there is no argument, use the cursor position
        var message = '<strong>' + this.param.name + '</strong>: ';
        if (this.param.description) {
            // TODO: This should be a short description - do we need to trim?
            message += this.param.description.trim();

            // Ensure the help text ends with '. '
            if (message.charAt(message.length - 1) !== '.') {
                message += '.';
            }
            if (message.charAt(message.length - 1) !== ' ') {
                message += ' ';
            }
        }
        var status = Status.VALID;
        var start = this.arg ? this.arg.start : Argument.AT_CURSOR;
        var end = this.arg ? this.arg.end : Argument.AT_CURSOR;
        var predictions;

        // Non-valid conversions will have useful information to pass on
        if (this.conversion) {
            status = this.conversion.status;
            if (this.conversion.message) {
                message += this.conversion.message;
            }
            predictions = this.conversion.predictions;
        }

        // Hint if the param is required, but not provided
        var argProvided = this.arg && this.arg.text !== '';
        var dataProvided = this.value !== undefined || argProvided;
        if (this.param.defaultValue === undefined && !dataProvided) {
            status = Status.INVALID;
            message += '<strong>Required<\strong>';
        }

        return new Hint(status, message, start, end, predictions);
    },

    /**
     * Basically <tt>setValue(conversion.predictions[0])</tt> done in a safe
     * way.
     */
    complete: function() {
        if (this.conversion && this.conversion.predictions &&
                this.conversion.predictions.length > 0) {
            this.setValue(this.conversion.predictions[0]);
        }
    },

    /**
     * Replace the current value with the lower value if such a concept
     * exists.
     */
    decrement: function() {
        var replacement = this.param.type.decrement(this.value);
        if (replacement != null) {
            this.setValue(replacement);
        }
    },

    /**
     * Replace the current value with the higher value if such a concept
     * exists.
     */
    increment: function() {
        var replacement = this.param.type.increment(this.value);
        if (replacement != null) {
            this.setValue(replacement);
        }
    },

    /**
     * Helper when we're rebuilding command lines.
     */
    toString: function() {
        return this.arg ? this.arg.toString() : '';
    }
};
exports.Assignment = Assignment;


/**
 * This is a special parameter to reflect the command itself.
 */
var commandParam = {
    name: 'command',
    type: 'command',
    description: 'The command to execute',

    /**
     * Provide some documentation for a command.
     */
    getCustomHint: function(command, arg) {
        var docs = [];
        docs.push('<strong><tt> &gt; ');
        docs.push(command.name);
        if (command.params && command.params.length > 0) {
            command.params.forEach(function(param) {
                if (param.defaultValue === undefined) {
                    docs.push(' [' + param.name + ']');
                }
                else {
                    docs.push(' <em>[' + param.name + ']</em>');
                }
            }, this);
        }
        docs.push('</tt></strong><br/>');

        docs.push(command.description ? command.description : '(No description)');
        docs.push('<br/>');

        if (command.params && command.params.length > 0) {
            docs.push('<ul>');
            command.params.forEach(function(param) {
                docs.push('<li>');
                docs.push('<strong><tt>' + param.name + '</tt></strong>: ');
                docs.push(param.description ? param.description : '(No description)');
                if (param.defaultValue === undefined) {
                    docs.push(' <em>[Required]</em>');
                }
                else if (param.defaultValue === null) {
                    docs.push(' <em>[Optional]</em>');
                }
                else {
                    docs.push(' <em>[Default: ' + param.defaultValue + ']</em>');
                }
                docs.push('</li>');
            }, this);
            docs.push('</ul>');
        }

        return new Hint(Status.VALID, docs.join(''), arg);
    }
};

/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 * CliRequisition adds functions for parsing input from a command line to this
 * class.
 * <h2>Events<h2>
 * We publish the following events:<ul>
 * <li>argumentChange: The text of some argument has changed. It is likely that
 * any UI component displaying this argument will need to be updated. (Note that
 * this event is actually published by the Argument itself - see the docs for
 * Argument for more details)
 * The event object looks like: { argument: A, oldText: B, text: B }
 * <li>commandChange: The command has changed. It is likely that a UI
 * structure will need updating to match the parameters of the new command.
 * The event object looks like { command: A }
 * @constructor
 */
function Requisition(env) {
    this.env = env;
    this.commandAssignment = new Assignment(commandParam, this);
}

Requisition.prototype = {
    /**
     * The command that we are about to execute.
     * @see setCommandConversion()
     * @readonly
     */
    commandAssignment: undefined,

    /**
     * The count of assignments. Excludes the commandAssignment
     * @readonly
     */
    assignmentCount: undefined,

    /**
     * The object that stores of Assignment objects that we are filling out.
     * The Assignment objects are stored under their param.name for named
     * lookup. Note: We make use of the property of Javascript objects that
     * they are not just hashmaps, but linked-list hashmaps which iterate in
     * insertion order.
     * Excludes the commandAssignment.
     */
    _assignments: undefined,

    /**
     * The store of hints generated by the assignments. We are trying to prevent
     * the UI from needing to access this in broad form, but instead use
     * methods that query part of this structure.
     */
    _hints: undefined,

    /**
     * When the command changes, we need to keep a bunch of stuff in sync
     */
    _assignmentChanged: function(assignment) {
        // This is all about re-creating Assignments
        if (assignment.param.name !== 'command') {
            return;
        }

        this._assignments = {};

        if (assignment.value) {
            assignment.value.params.forEach(function(param) {
                this._assignments[param.name] = new Assignment(param, this);
            }, this);
        }

        this.assignmentCount = Object.keys(this._assignments).length;
        this._dispatchEvent('commandChange', { command: assignment.value });
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
     * Collect the statuses from the Assignments.
     * The hints returned are sorted by severity
     */
    _updateHints: function() {
        // TODO: work out when to clear this out for the plain Requisition case
        // this._hints = [];
        this._hints.push(this.commandAssignment.getHint());
        Object.keys(this._assignments).map(function(name) {
            // Only use assignments with an argument
            var assignment = this._assignments[name];
            if (assignment.arg) {
                this._hints.push(assignment.getHint());
            }
        }, this);
        Hint.sort(this._hints);

        // We would like to put some initial help here, but for anyone but
        // a complete novice a 'type help' message is very annoying, so we
        // need to find a way to only display this message once, or for
        // until the user click a 'close' button or similar
        // TODO: Add special case for '' input
    },

    /**
     * Returns the most severe status
     */
    getWorstHint: function() {
        return this._hints[0];
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
        var command = this.commandAssignment.value;
        canon.exec(command, this.env, this.getArgs(), this.toCanonicalString());
    },

    /**
     * Extract a canonical version of the input
     */
    toCanonicalString: function() {
        var line = [];
        line.push(this.commandAssignment.value.name);
        Object.keys(this._assignments).forEach(function(name) {
            var assignment = this._assignments[name];
            var type = assignment.param.type;
            // TODO: This will cause problems if there is a non-default value
            // after a default value. Also we need to decide when to use
            // named parameters in place of positional params. Both can wait.
            if (assignment.value !== assignment.param.defaultValue) {
                line.push(' ');
                line.push(type.stringify(assignment.value));
            }
        }, this);
        return line.join('');
    }
};
oop.implement(Requisition.prototype, EventEmitter);
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
function CliRequisition(env, options) {
    Requisition.call(this, env);

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
     * Called by the UI when ever the user interacts with a command line input
     * @param input A structure that details the state of the input field.
     * It should look something like: { typed:a, cursor: { start:b, end:c } }
     * Where a is the contents of the input field, and b and c are the start
     * and end of the cursor/selection respectively.
     */
    CliRequisition.prototype.update = function(input) {
        this.input = input;
        this._hints = [];

        var args = this._tokenize(input.typed);
        this._split(args);

        if (this.commandAssignment.value) {
            this._assign(args);
        }

        this._updateHints();
    };

    /**
     * Return an array of Status scores so we can create a marked up
     * version of the command line input.
     */
    CliRequisition.prototype.getInputStatusMarkup = function() {
        // 'scores' is an array which tells us what chars are errors
        // Initialize with everything VALID
        var scores = this.toString().split('').map(function(char) {
            return Status.VALID;
        });
        // For all chars in all hints, check and upgrade the score
        this._hints.forEach(function(hint) {
            for (var i = hint.start; i <= hint.end; i++) {
                if (hint.status > scores[i]) {
                    scores[i] = hint.status;
                }
            }
        }, this);
        return scores;
    };

    /**
     * Reconstitute the input from the args
     */
    CliRequisition.prototype.toString = function() {
        // All the params
        var parts = Object.keys(this._assignments).map(function(name) {
            return this._assignments[name].toString();
        }, this);
        // Prefix with the command
        parts.unshift(this.commandAssignment.toString());
        return parts.join('');
    };

    var superUpdateHints = CliRequisition.prototype._updateHints;
    /**
     * Marks up hints in a number of ways:
     * - Makes INCOMPLETE hints that are not near the cursor INVALID since
     *   they can't be completed by typing
     * - Finds the most severe hint, and annotates the array with it
     * - Finds the hint to display, and also annotates the array with it
     * TODO: I'm wondering if array annotation is evil and we should replace
     * this with an object. Need to find out more.
     */
    CliRequisition.prototype._updateHints = function() {
        superUpdateHints.call(this);

        // Not knowing about cursor positioning, the requisition and assignments
        // can't know this, but anything they mark as INCOMPLETE is actually
        // INVALID unless the cursor is actually inside that argument.
        var c = this.input.cursor;
        this._hints.forEach(function(hint) {
            var startInHint = c.start >= hint.start && c.start <= hint.end;
            var endInHint = c.end >= hint.start && c.end <= hint.end;
            var inHint = startInHint || endInHint;
            if (!inHint && hint.status === Status.INCOMPLETE) {
                 hint.status = Status.INVALID;
            }
        }, this);

        Hint.sort(this._hints);
    };

    /**
     * Accessor for the hints array.
     * While we could just use the hints property, using getHints() is
     * preferred for symmetry with Requisition where it needs a function due to
     * lack of an atomic update system.
     */
    CliRequisition.prototype.getHints = function() {
        return this._hints;
    };

    /**
     * Look through the arguments attached to our assignments for the assignment
     * at the given position.
     */
    CliRequisition.prototype.getAssignmentAt = function(position) {
        var arg = this.commandAssignment.arg;
        if (arg && position <= arg.end) {
            return this.commandAssignment;
        }

        var names = Object.keys(this._assignments);
        for (var i = 0; i < names.length; i++) {
            var assignment = this._assignments[names[i]];
            if (assignment.arg && position <= assignment.arg.end) {
                return assignment;
            }
        }

        // We can only have got here if
        throw new Error('position (' + position +
                ') is off end of requisition (' + this.toString() + ')');
    };

    /**
     * Split up the input taking into account ' and "
     */
    CliRequisition.prototype._tokenize = function(typed) {
        // For blank input, place a dummy empty argument into the list
        if (typed == null || typed.length === 0) {
            return [ new Argument(this, '', 0, 0, '') ];
        }

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
                    args.push(new Argument(this, str, start, i, priorSpace));
                }
                else {
                    if (i !== start) {
                        // There's a bunch of whitespace at the end of the
                        // command treat it as another arg without any content
                        priorSpace = typed.substring(start, i);
                        args.push(new Argument(this, '', i, i, priorSpace));
                    }
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
                    // There is an edge case of xx'xx which we are assuming to
                    // be a single parameter (and same with ")
                    if (c === ' ') {
                        var str = unescape(typed.substring(start, i));
                        args.push(new Argument(this, str, start, i, priorSpace));
                        mode = OUTSIDE;
                        start = i;
                        priorSpace = '';
                    }
                    break;

                case IN_SINGLE_Q:
                    if (c === '\'') {
                        var str = unescape(typed.substring(start, i));
                        args.push(new Argument(this, str, start, i, priorSpace));
                        mode = OUTSIDE;
                        start = i + 1;
                        priorSpace = '';
                    }
                    break;

                case IN_DOUBLE_Q:
                    if (c === '"') {
                        var str = unescape(typed.substring(start, i));
                        args.push(new Argument(this, str, start, i, priorSpace));
                        mode = OUTSIDE;
                        start = i + 1;
                        priorSpace = '';
                    }
                    break;
            }

            i++;
        }

        return args;
    };

    /**
     * Looks in the canon for a command extension that matches what has been
     * typed at the command line.
     */
    CliRequisition.prototype._split = function(args) {
        var argsUsed = 1;
        var arg;

        while (argsUsed <= args.length) {
            var arg = Argument.merge(args, 0, argsUsed);
            this.commandAssignment.setArgument(arg);

            if (!this.commandAssignment.value) {
                // Not found. break with value == null
                break;
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

            if (this.commandAssignment.value.exec) {
                // Valid command, break with command valid
                for (var i = 0; i < argsUsed; i++) {
                    args.shift();
                }
                break;
            }

            argsUsed++;
        }

        return;
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
            this._hints.push(new Hint(Status.INVALID,
                    this.commandAssignment.value.name + ' does not take any parameters',
                    Argument.merge(args)));
            return;
        }

        // Special case: if there is only 1 parameter, and that's of type
        // text we put all the params into the first param
        if (this.assignmentCount === 1) {
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
                        this._hints.push(new Hint(Status.INCOMPLETE,
                                'Missing value for: ' + namedArgText,
                                args[i]));
                    }
                    else {
                        args.splice(i + 1, 1);
                        assignment.setArgument(args[i + 1]);
                    }
                }

                lang.arrayRemove(names, assignment.name);
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
            this._hints.push(new Hint(Status.INVALID,
                    'Input \'' + remaining.text + '\' makes no sense.',
                    remaining));
        }
    };

})();
exports.CliRequisition = CliRequisition;


});
