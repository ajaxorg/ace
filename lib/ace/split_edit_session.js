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
    var sharedSession = this.$sharedSession = new SharedEditSession(text, mode);
    this.$sessions = [];
    this.$lastCreatedSession = null;
    this.$focusIdx = null;

    this.$useWrapMode = false;
    this.$wrapLimitMin = 0;
    this.$wrapLimitMax = 0;

    cloneFunctions(this.$sharedSession, this);

    // Listen to "focus" event for this splitSession. This is send by the Split
    // whenever an editor with a session of this splitSession becomes currentEditor.
    this.on("focus", function(e) {
        var idx = this.$focusIdx = e.idx;
        var session = this.$sessions[idx];
        // To get undo/redo working, the selection object has to be set on the
        // sharedSession. This way, calling undo/redoChanges do the right thing.
        sharedSession.selection = session.selection;
    }.bind(this));

    // Listen to the "deactivate" event from the Split. Set the selection to
    // null in case the current focused session was deactivated.
    this.on("deactivate", function(e) {
        var idx = e.idx;
        if (idx == this.$focusIdx) {
            sharedSession.selection = null;
        }
    }.bind(this));
};

(function(){

    oop.implement(this, EventEmitter);

    this.$create = function() {
        var sharedSession = this.$sharedSession;
        var session = {};

        cloneFunctions(sharedSession, session);
        // The foldDat and doc are shared as well but they are no functions, we
        // need to copy it by "hand".
        session.$foldData = sharedSession.$foldData;
        session.doc = sharedSession.doc;

        // Add in the "ego" part of the edit session.
        EgoEditSession.call(session);

        var lastCreatedSession = this.$lastCreatedSession;
        if (lastCreatedSession) {
            session.setUseWrapMode(lastCreatedSession.getUseWrapMode());
            session.setWrapLimitRange(lastCreatedSession.$wrapLimitRange.min,
                                lastCreatedSession.$wrapLimitRange.max);
        } else {
            session.setUseWrapMode(this.$useWrapMode);
            session.setWrapLimitRange(this.$wrapLimitMin, this.$wrapLimitMax);
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

    this.setWrapLimitRange = function(min, max) {
        this.$wrapLimitMin = min;
        this.$wrapLimitMax = max;
    }

    this.setWrapLimit = function(limit) {
        this.setWrapLimitRange(limit, limit)
    }

    this.setUseWrapMode = function(useWrapMode) {
        this.$useWrapMode = useWrapMode
    }
}).call(SplitEditSession.prototype);

exports.SplitEditSession = SplitEditSession;

});
