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


define(function(require, exports, module) {
"use strict";

var util = require('./util');
var element = require('./element');
var Range = require('ace/range').Range;
var Delegate = require('./delegate').Delegate;

function initTail(self){
  
  self.hide();
  
  self.on('touchstart', function(evt){
    if(evt.data.touches.length == 1 && !self.isDrag){
      self.mIsDrag = true;
      var point = evt.data.touches[0];
      self.ondragstart.emit({ x: point.pageX, y: point.pageY });
    }
  });
  
  self.on('touchmove', function(evt){
    if(self.isDrag){
      var point = evt.data.touches[0];
      self.ondrag.emit({ x: point.pageX, y: point.pageY });
    }
  });
  
  self.on('touchend', function(evt){
    if(self.isDrag){
      util.nextTick(function(){
        self.mIsDrag = false;
        self.ondragend.emit();
      });
    }
  });
}

var Tail = util.class(element.Element, {
  
  mType: '', // start | end
  mIsDrag: false,
  mPosition: null,
  
  ondragstart: null,
  ondrag: null,
  ondragend: null,
  
  constructor: function(){
    element.Element.call(this, element.htmlTag());
    this.ondragstart = new Delegate(this, 'dragstart');
    this.ondrag = new Delegate(this, 'drag');
    this.ondragend = new Delegate(this, 'dragend');
    $$({ class: 'head' }).appendTo(this);
    $$({ class: 'helper' }).appendTo(this);
    initTail(this);
  },
  
  setType: function(value){
    value = (value == 'start' ? 'start' : value == 'end' ? 'end': 'start');
    if(value != this.mType){
      this.attr('class', 'ace_tail ' + value);
    }
    return this;
  },
  
  setPosition: function(pos){
    this.mPosition = pos;
  },
  
  get position(){
    return this.mPosition;
  },
  
  get type(){
    return this.mType;
  },
  
  get isDrag(){
    return this.mIsDrag;
  }
  
});

function activation(self){
  if(!self.mActivation){
    self.mActivation = true;
    self.mAnchor.show();
    self.mLead.show();
  }  
}

function unActivation(self){
  if(self.mActivation){
    self.mActivation = false;
    self.mAnchor.hide();
    self.mLead.hide();    
  }
}

function changeEditorHandle(self, evt){
  if(evt.editor){
    self.mHost = evt.editor;
  }
}

function changeSelectionHandle(self, evt){
  update(self);
}

function initLayer(self){
  
  self.on([ 'touchstart', 'touchmove', 'touchend' ], function(evt){
    if(self.isDrag) evt.returnValue = false;
  });
  
  self.mAnchor.ondragstart.on(function(evt){
    self.host._signal('touchdragselectstart', evt.data);
  });
  self.mLead.ondragstart.on(function(evt){
    self.host._signal('touchdragselectstart', evt.data);
  });
  
  self.mAnchor.ondragend.on(function(){
    update(self);
    self.host._signal('touchdragselectend');
  });
  
  self.mLead.ondragend.on(function(){
    update(self);
    self.host._signal('touchdragselectend');
  });
  
  self.mAnchor.ondrag.on(function(evt){
    var x = evt.data.x;
    var y = evt.data.y;
    var new_anchor = self.host.renderer.screenToTextCoordinates(x, y);
    self.mSession.selection.setSelectionAnchor(new_anchor.row, new_anchor.column);
    self.host._signal('touchdragselect', evt.data);
  });
  
  self.mLead.ondrag.on(function(evt){
    var x = evt.data.x;
    var y = evt.data.y;
    var pos = self.host.renderer.screenToTextCoordinates(x, y);
    self.mSession.selection.selectToPosition(pos);
    self.host._signal('touchdragselect', evt.data);
  });
  
}

function getStyle(self, pos){
  
// characterWidth: 8.4015625
// firstRow: 0
// firstRowScreen: 0
// gutterOffset: 0
// height: 322
// lastRow: 17
// lineHeight: 19
// maxHeight: 16358
// minHeight: 360
// offset: 0
// padding: 4
// width: 844
  
  var screen_pos = self.mSession.documentToScreenPosition(pos.row, pos.column);
  var config = self.mConfig;
  var left = config.padding + Math.round(screen_pos.column * config.characterWidth);
  var top = (screen_pos.row - config.firstRowScreen) * config.lineHeight;
  return { 
    left: left + 'px', 
    top: top + 'px', 
    height: config.lineHeight + 'px' 
  };
}

function update(self){

  var selection = self.mSession.selection;
  
  if(selection.isEmpty()){
    if(!self.isDrag){ // 冷静一下吧
      return unActivation(self);
    }
  }
  
  activation(self); // 激活
  
  var anchor = selection.getSelectionAnchor();
  var lead = selection.getSelectionLead();
  
  self.mAnchor.setPosition(anchor);
  self.mLead.setPosition(lead);
  
  if(selection.isBackwards()){ // 锚点在后边
    self.mAnchor.setType('end');
    self.mLead.setType('start');
  }
  else{
    self.mAnchor.setType('start');
    self.mLead.setType('end');
  }
  
  // 设置尾巴的实际位置
  self.mAnchor.style = getStyle(self, anchor);
  self.mLead.style = getStyle(self, lead);
}

var TouchDragSelectionLayer = util.class(element.Element, {
  
  mActivation: false,
  mSession: null,
  mConfig: null,
  mAnchor: null,
  mLead: null,
  mHost: null,
  
  constructor: function(panel){
    element.Element.call(this, element.htmlTag());
    this.appendTo($$(panel));
    this.addClass('ace_layer ace_selection_tail');
    this.style = { 'z-index': 10, 'pointer-events': 'auto' };
    this.mChangeSelectionHandle = changeSelectionHandle.bind(null, this);
    this.mChangeEditorHandle = changeEditorHandle.bind(null, this);
    this.mAnchor = new Tail().appendTo(this);
    this.mLead = new Tail().appendTo(this);
    initLayer(this);
  },
  
  setPadding: function(value) { 
    // 
  },
  
  setSession: function(session) {
    
    if(this.mSession === session){
      return;
    }
    
    if(this.mSession){
      this.mSession.off('changeEditor', this.mChangeEditorHandle);
      this.mSession.selection.off('changeSelection', this.mChangeSelectionHandle);
    }
    
    this.mSession = session;
    
    if(this.mSession){
      this.mSession.on('changeEditor', this.mChangeEditorHandle);
      this.mSession.selection.on('changeSelection', this.mChangeSelectionHandle);
    }
  },
  
  get isDrag(){
    return this.mAnchor.isDrag || this.mLead.isDrag;
  },
  
  get activation(){
    return this.mActivation;
  },
  
  update: function(config) {
    this.mConfig = config;
    update(this);
  },
  
  get host(){
    return this.mHost;
  }
  
});

exports.TouchDragSelectionLayer = TouchDragSelectionLayer;

});