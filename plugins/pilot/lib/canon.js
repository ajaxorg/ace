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
 * The Original Code is Mozilla Skywriter.
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
var Trace = require('pilot/stacktrace').Trace;
var oop = require("pilot/oop").oop;
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var catalog = require("pilot/catalog");

/*
// TODO: this doesn't belong here - or maybe anywhere?
var dimensionsChangedExtensionSpec = {
    name: "dimensionsChanged",
    description: "A dimensionsChanged is a way to be notified of " +
            "changes to the dimension of Skywriter"
};
exports.startup = function(data, reason) {
    catalog.addExtensionSpec(commandExtensionSpec);
};
exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};
*/

var commandExtensionSpec = {
    name: "command",
    description: "A command is a bit of functionality with optional " +
            "typed arguments which can do something small like moving " +
            "the cursor around the screen, or large like cloning a " +
            "project from VCS.",
    indexOn: "name"
};

var env;

exports.startup = function(data, reason) {
    // TODO: this is probably all kinds of evil, but we need something working
    env = data.env;
    catalog.addExtensionSpec(commandExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};

/**
 * Manage a list of commands in the current canon
 */

/**
 * A Command is a discrete action optionally with a set of ways to customize
 * how it happens. This is here for documentation purposes.
 * TODO: Document better
 */
var Command = {
    name: "thing",
    description: "thing is an example command",
    params: [{
        name: "param1",
        description: "an example parameter",
        type: "text",
        defaultValue: null
    }],
    exec: function(env, args, request) { }
};

var commands = {};

exports.addCommand = function(command) {
    if (!command.name) {
        throw new Error("All registered commands must have a name");
    }
    commands[command.name] = command;
};

exports.removeCommand = function(command) {
    if (typeof command === "string") {
        delete commands[command];
    }
    else {
        delete commands[command.name];
    }
};

exports.getCommand = function(name) {
    return commands[name];
};

exports.getCommandNames = function() {
    return Object.keys(commands);
};

/**
 * Entry point for keyboard accelerators or anything else that knows
 * everything it needs to about the command params
 */
exports.exec = function(name, args) {
    var command = commands[name];
    if (command) {
        // TODO: Ugg. really?
        env.selection = env.editor.getSelection();
        var request = new Request();
        command.exec(env, args || {}, request);
        return true;
    }
    return false;
};

/**
 * Entry point for users that need to collect parameters from textual input
 */
exports.execRequisition = function(requisition) {
    var request = new Request();
    requisition.command.exec(env, requisition.getArgs(), request);
};

/**
 * We publish a 'addedRequestOutput' event whenever new command begins output
 * TODO: make this more obvious
 */
oop.implement(exports, EventEmitter);

/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 * @constructor
 */
function Requisition(command) {
    this.command = command;
    this.assignments = {};
    command.params.forEach(function(param) {
        this.assignment[param.name] = new Assignment(param);
    });
}
Requisition.prototype = {
    /**
     * The command that we are about to execute.
     * @readonly
     */
    command: undefined,

    /**
     * The set of values that we are assigning to parameters in the command
     * @readonly
     */
    assignments: undefined,

    /**
     *
     */
    getArgs: function() {
        var args = {};
        Object.keys(assignments).forEach(function(name) {
            args[name] = getCommand(name);
        });
        return args;
    }
};
exports.Requisition = Requisition;


/**
 * A link between a parameter and the data for that parameter.
 * The data for the parameter is available as in the preferred type and in
 * the string representation of that type.
 * <p>We also record validity information and cli offset data where applicable.
 * <p>For values, null and undefined have distinct definitions. null means
 * that a value has been provided, undefined means that it has not.
 * Thus, null is a valid default value, and common because it identifies an
 * parameter that is optional. undefined means there is no value from
 * the command line.
 * TODO: think about this distinction some more, particularly this line:
 * ass.setValue(undefined); ass.value -> param.defaultValue?;
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
        this.text = this.param.type.toString(value);
        this.value = value;
        this.status = Status.VALID;
        this.message = "";
        this._dispatchEvent('change', { assignment: this });
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
        var conversion = this.param.type.fromString(text);
        this.text = text;
        this.value = conversion.value;
        this.status = conversion.status;
        this.message = conversion.message;
        this._dispatchEvent('change', { assignment: this });
    },

    /**
     * Report on the status of the last fromString() conversion.
     * @see types.Conversion
     */
    status: undefined,
    message: undefined,

    /**
     * Read-write value which records the offset of this text into a command
     * line. This is a convenience provided to the command line, but which
     * probably won't be used elsewhere.
     */
    offset: undefined
};
oop.implement(Assignment, EventEmitter);
exports.Assignment = Assignment;

/**
 * Current requirements are around displaying the command line, and provision
 * of a 'history' command and cursor up|down navigation of history.
 * <p>Future requirements could include:
 * <ul>
 * <li>Multiple command lines
 * <li>The ability to recall key presses (i.e. requests with no output) which
 * will likely be needed for macro recording or similar
 * <li>The ability to store the command history either on the server or in the
 * browser local storage.
 * </ul>
 * <p>The execute() command doesn't really live here, except as part of that
 * last future requirement, and because it doesn't really have anywhere else to
 * live.
 */

/**
 * The array of requests that wish to announce their presence
 */
exports.requests = [];

/**
 * How many requests do we store?
 */
var maxRequestLength = 100;

/**
 * Called by Request instances when some output (or a cell to async() happens)
 */
exports.addRequestOutput = function(request) {
    exports.requests.push(request);
    // This could probably be optimized with some maths, but 99.99% of the
    // time we will only be off by one, and I'm feeling lazy.
    while (exports.requests.length > maxRequestLength) {
        exports.requests.shiftObject();
    }

    exports._dispatchEvent('addedRequestOutput', { request: request });
};

/**
 * Execute a new command.
 * This is basically an error trapping wrapper around request.command(...)
 */
exports.execute = function(args, request) {
    // Check the function pointed to in the meta-data exists
    if (!request.command) {
        request.doneWithError('Command not found.');
        return;
    }

    try {
        request.command(args, request);
    } catch (ex) {
        var trace = new Trace(ex, true);
        console.group('Error executing command \'' + request.typed + '\'');
        console.log('command=', request.commandExt);
        console.log('args=', args);
        console.error(ex);
        trace.log(3);
        console.groupEnd();

        request.doneWithError(ex);
    }
};

/**
 * To create an invocation, you need to do something like this (all the ctor
 * args are optional):
 * <pre>
 * var request = new Request({
 *     command: command,
 *     commandExt: commandExt,
 *     args: args,
 *     typed: typed
 * });
 * </pre>
 * @constructor
 */
function Request(options) {
    options = options || {};

    // Will be used in the keyboard case and the cli case
    this.command = options.command;
    this.commandExt = options.commandExt;

    // Will be used only in the cli case
    this.args = options.args;
    this.typed = options.typed;

    // Have we been initialized?
    this._begunOutput = false;

    this.start = new Date();
    this.end = null;
    this.completed = false;
    this.error = false;
};

oop.implement(Request.prototype, EventEmitter);

/**
 * Lazy init to register with the history should only be done on output.
 * init() is expensive, and won't be used in the majority of cases
 */
Request.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];

    exports.addRequestOutput(this);
};

/**
 * Sugar for:
 * <pre>request.error = true; request.done(output);</pre>
 */
Request.prototype.doneWithError = function(content) {
    this.error = true;
    this.done(content);
};

/**
 * Declares that this function will not be automatically done when
 * the command exits
 */
Request.prototype.async = function() {
    if (!this._begunOutput) {
        this._beginOutput();
    }
};

/**
 * Complete the currently executing command with successful output.
 * @param output Either DOM node, an SproutCore element or something that
 * can be used in the content of a DIV to create a DOM node.
 */
Request.prototype.output = function(content) {
    if (!this._begunOutput) {
        this._beginOutput();
    }

    if (typeof content !== 'string' && !(content instanceof Node)) {
        content = content.toString();
    }

    this.outputs.push(content);
    this._dispatchEvent('changed', {});

    return this;
};

/**
 * All commands that do output must call this to indicate that the command
 * has finished execution.
 */
Request.prototype.done = function(content) {
    this.completed = true;
    this.end = new Date();
    this.duration = this.end.getTime() - this.start.getTime();

    if (content) {
        this.output(content);
    }

    this._dispatchEvent('changed', {});
};
exports.Request = Request;


});
