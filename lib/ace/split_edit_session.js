/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 *  Julian Viereck <julian.viereck@gmail.com>
 *
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var typecheck = require("pilot/typecheck");

var EventEmitter = require("pilot/event_emitter").EventEmitter;
var SharedEditSession = require("ace/edit_session/shared_edit_session").SharedEditSession;
var EgoEditSession = require("ace/edit_session/ego_edit_session").EgoEditSession;

 // Clone all functions over to the session object and bind them.
function cloneFunctions(from, to) {
    for (var name in from) {
        if (typecheck.isFunction(from[name])) {
            to[name] = from[name].bind(from);
        }
    }
}

var SplitEditSession = function(text, mode) {
    this.$sharedSession = new SharedEditSession(text, mode);
    this.$sessions = [];
    this.$lastCreatedSession = null;

    cloneFunctions(this.$sharedSession, this);
};

(function(){

    this.$create = function() {
        var sharedSession = this.$sharedSession;
        var session = {};

        cloneFunctions(sharedSession, session);
        session.$foldData = sharedSession.$foldData;
        session.doc = sharedSession.doc;

        // Add in the "ego" part of the edit session.
        EgoEditSession.call(session);

//        var undoManager = mSession.getUndoManager();
//        if (undoManager) {
//            var undoManagerProxy = new UndoManagerProxy(undoManager, s);
//            s.setUndoManager(undoManagerProxy);
//        }
//
//        // Overwrite the default $informUndoManager function such that new delas
//        // aren't added to the undo manager from the new and the old session.
//        s.$informUndoManager = lang.deferredCall(function() { s.$deltas = []; });

        // Copy over 'settings' from the session.

        var lastCreatedSession = this.$lastCreatedSession;
        if (lastCreatedSession) {
            session.setUseWrapMode(lastCreatedSession.getUseWrapMode());
            session.setWrapLimitRange(lastCreatedSession.$wrapLimitRange.min,
                                lastCreatedSession.$wrapLimitRange.max);
        }
        lastCreatedSession = session;

        return session;
    },

    /**
     * Returns the editSession associated to a splitIdx. If there is no
     * editSession for this splitIdx yet, then create a new one.
     */
    this.getEditSession = function(splitIdx) {
        var editSession = this.$sessions[splitIdx];
        if (!editSession) {
            return this.$sessions[splitIdx] = this.$create();
        } else {
            return editSession;
        }
    }

    this.setUndoManager = function(undoManager) {

    };

    this.setWrapLimitRange = function() {

    }

    this.setWrapLimit = function() {

    }

    this.setUseWrapMode = function() {

    }

//    this.call = function(funcName, valueA, valueB, valueC) {
//        var sessions = this.$sessions;
//        for (var i = 0; i < sessions.length; i++) {
//            sessions[i][funcName](valueA, valueB, valueC);
//        }
//        return this.$masterSession[funcName](valueA, valueB, valueC);
//    }
//
//    this.get = function(funcName) {
//        return this.$masterSession[funcName]();
//    }
//
//    /**
//     * API
//     */
//    this.setMode = function(mode) {
//        this.$mode = mode;
//        this.call("setMode", mode);
//    }
//
//    this.setUndoManager = function(undoManager) {
//        var mSession = this.$masterSession;
//        mSession.setUndoManager(undoManager);
//
//        if (undoManager) {
//            var sessions = this.$sessions;
//            for (var i = 0; i < sessions.length; i++) {
//                sessions[i].getUndoManager().setUndoManager(undoManager);
//            }
//        }
//    }
}).call(SplitEditSession.prototype);
//
//var events = [
//    "_dispatchEvent",
//    "_emit",
//    "addEventListener",
//    "on",
//    "removeEventListener",
//    "removeListener",
//    "removeAllListeners",
//];
//
//var ignore = [
//    // Mapping between document and screen doesn't make sense here.
//    "getRowLength",
//    "getRowHeight",
//    "getScreenLastRowColumn",
//    "getDocumentLastRowColumn",
//    "getDocumentLastRowColumnPosition",
//    "getRowSplitData",
//    "getScreenTabSize",
//    "screenToDocumentRow",
//    "screenToDocumentColumn",
//    "screenToDocumentPosition",
//    "documentToScreenPosition",
//    "documentToScreenColumn",
//    "documentToScreenRow",
//    "getScreenLength",
//    "getScreenWidth",
//
//    // All the events need to get added on the master session directly.
//    "onChangeStart",
//    "onChangeEnd",
//    "onChangeFold",
//    "onChange",
//
//    // The selection and marker stuff is individual to each editSession.
//    "getSelection",
//    "setSelection",
//    "getMarkers",
//    "removeMarker",
//    "addMarker",
//
//    // The setUndoManager and setMode function is implemented special.
//    "setUndoManager",
//    "setMode"
//];
//
//var props = [];
//for (var name in EditSession.prototype) {
//    if (name.indexOf("$") == 0
//        || ignore.indexOf(name) != -1
//        || events.indexOf(name) != -1) {
//        continue;
//    }
//
//    props.push(name);
//}
//
//var getters = props.filter(function(name) {
//    return name.indexOf("get") == 0;
//});
//getters.push(
//    "isRowFolded"
//);
//
//getters.forEach(function(getter) {
//    var func = function(valueA, valueB, valueC) {
//        return SplitEditSession.prototype.get.call(
//                    this, getter, valueA, valueB, valueC);
//    }
//    SplitEditSession.prototype[getter] = func;
//});
//
//// Add caller functions. These are "set" functions mostly.
//var callers = props.filter(function(name) {
//    return getters.indexOf(name) == -1;
//});
//
//callers.forEach(function(callName) {
//    var func = function(valueA, valueB, valueC) {
//        SplitEditSession.prototype.call.call(this, callName, valueA, valueB, valueC);
//    }
//    SplitEditSession.prototype[callName] = func;
//});
//
//// Forward the event handling
//events.forEach(function(eventFunc) {
//    var func = function(valueA, valueB, valueC) {
//        return this.$masterSession[eventFunc](valueA, valueB, valueC);
//    }
//    SplitEditSession.prototype[eventFunc] = func;
//})

// ------------------------------------------------------------------------------
// Implementing a UndoManagerProxy to do some nasty undo/redoStackHacking
// ------------------------------------------------------------------------------

function UndoManagerProxy(undoManager, session) {
    this.$u = undoManager;
    this.$doc = session;
}

(function() {
    this.setUndoManager = function(undoManager) {
        this.$u = undoManager;
    }

    this.execute = function(options) {
        this.$u.execute(options);
    }

    this.undo = function() {
        var selectionRange = this.$u.undo(true);
        if (selectionRange) {
            this.$doc.selection.setSelectionRange(selectionRange);
        }
    }

    this.redo = function() {
        var selectionRange = this.$u.redo(true);
        if (selectionRange) {
            this.$doc.selection.setSelectionRange(selectionRange);
        }
    }

    this.reset = function() {
        this.$u.reset();
    }

    this.hasUndo = function() {
        return this.$u.hasUndo();
    }

    this.hasRedo = function() {
        return this.$u.hasRedo();
    }
}).call(UndoManagerProxy.prototype);

exports.SplitEditSession = SplitEditSession;
});
