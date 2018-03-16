/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

var stopPropagation = function(this: any) { 
    this.propagationStopped = true; 
};
var preventDefault = function(this: any) {
    this.defaultPrevented = true; 
};

type EventListener<T> = (e: any, target: T) => any;

export class EventEmitter {
    
    _eventRegistry: any;
    _defaultHandlers: any;
    
    _emit(eventName: string, e?: any) {
        this._eventRegistry || (this._eventRegistry = {});
        this._defaultHandlers || (this._defaultHandlers = {});
    
        var listeners = this._eventRegistry[eventName] || [];
        var defaultHandler = this._defaultHandlers[eventName];
        if (!listeners.length && !defaultHandler)
            return;
    
        if (typeof e != "object" || !e)
            e = {};
    
        if (!e.type)
            e.type = eventName;
        if (!e.stopPropagation)
            e.stopPropagation = stopPropagation;
        if (!e.preventDefault)
            e.preventDefault = preventDefault;
    
        listeners = listeners.slice();
        for (var i=0; i<listeners.length; i++) {
            listeners[i](e, this);
            if (e.propagationStopped)
                break;
        }
        
        if (defaultHandler && !e.defaultPrevented)
            return defaultHandler(e, this);
    }

    _signal(eventName: string, e?: any) {
        var listeners = (this._eventRegistry || {})[eventName];
        if (!listeners)
            return;
        listeners = listeners.slice();
        for (var i=0; i<listeners.length; i++)
            listeners[i](e, this);
    }
    
    once(eventName: string, callback: EventListener<this>) {
        var _self = this;
        callback && this.on(eventName, function newCallback() {
            _self.off(eventName, newCallback);
            callback.apply(null, arguments);
        });
    }
    
    setDefaultHandler(eventName: string, callback: EventListener<this>) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            handlers = this._defaultHandlers = {_disabled_: {}};
        
        if (handlers[eventName]) {
            var old = handlers[eventName];
            var disabled = handlers._disabled_[eventName];
            if (!disabled)
                handlers._disabled_[eventName] = disabled = [];
            disabled.push(old);
            var i = disabled.indexOf(callback);
            if (i != -1) 
                disabled.splice(i, 1);
        }
        handlers[eventName] = callback;
    }
    
    removeDefaultHandler(eventName: string, callback: EventListener<this>) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            return;
        var disabled = handlers._disabled_[eventName];
        
        if (handlers[eventName] == callback) {
            var old = handlers[eventName];
            if (disabled)
                this.setDefaultHandler(eventName, disabled.pop());
        } else if (disabled) {
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
    }
    
    on(eventName: string, callback: EventListener<this>, capturing=false) {
        this._eventRegistry = this._eventRegistry || {};
    
        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            listeners = this._eventRegistry[eventName] = [];
    
        if (listeners.indexOf(callback) == -1)
            listeners[capturing ? "unshift" : "push"](callback);
        return callback;
    }
    
    // TODO remove
    addEventListener(eventName: string, callback: EventListener<this>, capturing=false) {
        return this.on(eventName, callback, capturing=false);
    }
    
    off(eventName: string, callback: EventListener<this>) {
        this._eventRegistry = this._eventRegistry || {};
    
        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;
    
        var index = listeners.indexOf(callback);
        if (index !== -1)
            listeners.splice(index, 1);
    }
    
    // TODO remove
    removeEventListener(eventName: string, callback: EventListener<this>) {
        return this.off(eventName, callback);
    }
    
    // TODO remove
    removeListener(eventName: string, callback: EventListener<this>) {
        return this.off(eventName, callback);
    }
    
    removeAllListeners(eventName: string) {
        if (this._eventRegistry) this._eventRegistry[eventName] = [];
    }
}