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

var oop = require('../lib/oop');
var Range = require('ace/range').Range;
var Menu = require('./overlay_panel').Menu;
var screen = require('./screen');
var event = require('./event');
var element = require('./element');

function DefaultHandlers(touchHandler) {
  touchHandler.clickSelection = null;

  var editor = touchHandler.editor;
  editor.setDefaultHandler("touchstart", this.onTouchStart.bind(touchHandler));
  editor.setDefaultHandler("touchmove", this.onTouchMove.bind(touchHandler));
  editor.setDefaultHandler("touchend", this.onTouchEnd.bind(touchHandler));
  editor.setDefaultHandler("click", this.onClick.bind(touchHandler));
  editor.setDefaultHandler("dblclick", this.onDoubleClick.bind(touchHandler));
  editor.setDefaultHandler("tripleclick", this.onTripleClick.bind(touchHandler));
  editor.setDefaultHandler("quadclick", this.onQuadClick.bind(touchHandler));
  editor.setDefaultHandler("longpress", this.onLongPress.bind(touchHandler));
  
  editor.on("touchdragselectstart", this.onTouchDragSelectStart.bind(touchHandler));
  editor.on("touchdragselectend", this.onTouchDragSelectEnd.bind(touchHandler));
  editor.on("touchdragselect", this.onTouchDragSelect.bind(touchHandler));
  editor.on("touchscroll", this.onTouchScroll.bind(touchHandler));
  editor.on('change', this.onTextChange.bind(touchHandler));
  
  event.on(document.body, 'touchstart', this.removeMenu.bind(touchHandler));
  
  oop.mixin(touchHandler, this);
}

(function() {

  // 长按会激活光标移动
  this.activate_longpress_cursor_move = false;
  this.activate_3_touch_point_select = false;
  this.multiClickTimer = 0;
  this.long_press_pos = { x: 0, y: 0 };
  this.clickSelection = null;
  this.long_press_selection = null;
  this.isScrollMove = 0;
  
  this.menu = null;
  this.menu_timer = 0;
  
  function focusEditor(self) {
    if(self.$immediateFocus){
      if(self.editor.getReadOnly()){
        return;
      }
      // because we have to call event.preventDefault() any window on ie and iframes 
      // on other browsers do not get focus, so we have to call window.focus() here
      if (!document.hasFocus || !document.hasFocus())
          window.focus();
      self.editor.focus();
    }
  }
  
  function menu_touchstart(self, evt){
    evt.returnValue = false;
  }
  
  function copy(self){
    self.$clipboardData = self.editor.getCopyText();
    self.editor.onCopy();
    self.editor.clearSelection();
    self.removeMenu();
  }
  
  function cut(self){
    var editor = self.editor;
    var range = editor.getSelectionRange();
    if(!range.isEmpty()){
      self.$clipboardData = editor.getCopyText();
      self.editor.onCut();
      self.editor.clearSelection();
    }
    self.removeMenu();
  }
  
  function paste(self){
    if(self.$clipboardData){
      self.editor.onPaste(self.$clipboardData, { });
    }
    self.removeMenu();
  }
  
  function getSelectWordRange(self){
    
    var editor = self.editor;
    var session = editor.session;
    var pos = editor.getSelectionRange().end;
    
    var range = session.getBracketRange(pos);
    if (range) {
      if (range.isEmpty()) {
        range.start.column--;
        range.end.column++;
      }
    } else {
      range = editor.selection.getWordRange(pos.row, pos.column);
    }
    return range;
  }
  
  function select(self){
    var range = getSelectWordRange(self);
    self.editor.session.selection.setRange(range);
    self.showMenu();
  }
  
  function selectLine(self){
    var editor = self.editor;
    var session = editor.session;
    var pos = editor.getSelectionRange().start;
    var range = editor.selection.getLineRange(pos.row);
    editor.session.selection.setRange(range);
    self.showMenu();
  }
  
  function selectAll(self){
    self.editor.selectAll();
    self.showMenu();
  }
  
  function findWord(self){
    // 
  }
  
  // 打开url
  function openUrl(self){
    self.editor._signal('open_url', self.editor.getSelectedText().trim());
    self.removeMenu();
  }
  
  function more(self){
    // 
  }

  function bindMenuEvent(self){
    self.menu.$on('touchstart', menu_touchstart, self);
    self.menu.$on('menu_copy', copy, self);
    self.menu.$on('menu_cut', cut, self);
    self.menu.$on('menu_paste', paste, self);
    self.menu.$on('menu_select', select, self);
    self.menu.$on('menu_selectLine', selectLine, self);
    self.menu.$on('menu_selectAll', selectAll, self);
    self.menu.$on('menu_findWord', findWord, self);
    self.menu.$on('menu_open', openUrl, self);
    self.menu.$on('menu_more', more, self);
  }
  
  function isEmptyLine(self, row){
    var line = self.editor.session.getDocument().getLine(row);
    return line.length === 0;
  }
  
  function isAllLine(self, range){
    if(range.start.row === 0 && range.start.column === 0){
      var doc = self.editor.session.getDocument();
      var pos = range.end;
      var row_len = doc.getLength();
      if(pos.row + 1 >= row_len){
        var column_len = doc.getLine(pos.row).length;
        if(pos.column + 1 >= column_len){
          return true;
        }
      }
    }
    return false;
  }
  
  // show menu start
  
  function showMenu(self){
    
    self.menu_timer = 0;
    
    var editor = self.editor;
    var session = editor.session;
    var selection = session.selection;
    var ace_document = session.getDocument();
    var range = editor.getSelectionRange();
    var pos = range.start;
    var values = [];
    
    if(!editor.getReadOnly()){ // 是否为只读文件
      // TODO ? 检测剪贴板是否有数据
      if(self.$clipboardData){
        values.push('paste');
      }
    }
    
    if(range.isEmpty()){
      if(!isEmptyLine(self, pos.row)){ // 不为空行
        values.push('select');
        values.push('selectLine');
      }
    }
    else {
      
      var text = editor.getSelectedText();
      
      if(/^\s*https?:\/\/?[a-z0-9_\-\$]+\.[a-z0-9_\-\$]+.*$/i.test(text)){
        values.push('open');
      }
      
      values.push('copy');
      if(!editor.getReadOnly()){ // 是否为只读文件
        values.push('cut');
      }
      
      if(values.length < 4){
        if(!range.isMultiLine()){ 
          var range2 = getSelectWordRange(self);
          if(!range.isEqual(range2)){ // 还没有选择一个词语
            values.push('select'); 
          }
          else{
            values.push('selectLine');
          }
        }
      }
    }
    
    if(values.length < 3 && !isAllLine(self, range)){ // 还没有选择全部
      values.push('selectAll');
    }
    
    if(!values.length){
      return;
    }
    
    var size = screen.size;
    var x = -1, y, offset_x = 0, offset_y = 0;
    var lineHeight = editor.renderer.lineHeight;
    var offset = $$(self.editor.renderer.scroller).offset;
    
    if(range.isMultiLine()){
      
      for(var i = range.start.row; i <= range.end.row; i++){
        
        var column = (range.start.row == i ?  range.start.column: 0);
        var pix = editor.renderer.textToScreenCoordinates(i, column);
        if(pix.pageY > offset.top && pix.pageY < size.height){
          
          column = (i == range.end.row ? 
              range.end.column : ace_document.getLine(range.start.row).length);
          var pix2 = editor.renderer.textToScreenCoordinates(range.start.row, column);
          
          x = (Math.max(pix.pageX, 0) + Math.min(pix2.pageX, size.width)) / 2;
          
          if(x > 0 && x < size.width){
            y = pix.pageY - 10;
            break;
          }
        }
      }
    }
    else{
      var pix = editor.renderer.textToScreenCoordinates(range.start.row, range.start.column);
      var pix2 = editor.renderer.textToScreenCoordinates(range.end.row, range.end.column);
      x = (Math.max(pix.pageX, 0) + Math.min(pix2.pageX, size.width)) / 2;
      y = pix.pageY - 10;
    }
    
    offset_y = lineHeight + 20;
    
    // 超出范围不显示
    if(x < 0 || x > size.width || y < -10 || y > size.height){
      return self.removeMenu();
    }
    
    if(!self.menu){
      self.menu = new Menu();
      bindMenuEvent(self);
    }
    
    self.menu.setMenu(values);
    self.menu.activateByPosition(x, y, offset_x, offset_y);
  }
  
  // show menu end
  
  this.showMenu = function(delay){
    if(this.menu_timer){
      Function.undelay(this.menu_timer);
      this.menu_timer = 0;
    }
    if(delay === 0){
      showMenu(this);
    }
    else{
      this.menu_timer = showMenu.delay(delay || 20, this);
    }
  };
  
  this.removeMenu = function(){
    if(this.menu_timer){
      Function.undelay(this.menu_timer);
      this.menu_timer = 0;
    }
    if(this.menu){
      // 如果有菜单才删除
      this.menu.remove();
      this.menu = null;
    }
  };
  
  this.clearMultiClickTimer = function(){
    if(this.multiClickTimer){
      Function.undelay(this.multiClickTimer);
      this.multiClickTimer = 0;
    }
  };
  
  this.startMultiClickTimer = function(){
    var self = this;
    this.clearMultiClickTimer();
    this.multiClickTimer = (function(){
      var range = self.clickSelection;
      if(range && !range.isEmpty()){
        // 有选中的文本,显示菜单
        self.showMenu(0);
      }
      self.multiClickTimer = 0;
    }).delay2(400);
  };
  
  this.onTouchScroll = function(){
    var self = this;
    if(this.isScrollMove){
      Function.undelay(this.isScrollMove);
    }
    this.isScrollMove = function(){
      self.isScrollMove = 0;
      var range = self.editor.getSelectionRange();
      if(!range.isEmpty()){ // 不为空时,显示编辑菜单
        self.showMenu();
      }
    }.delay(200);
  };

  this.onTextChange = function(){
    this.removeMenu();
  };
  
  this.onTouchDragSelectStart = function(evt){
    // 激活touch放大镜
    // 这个事件可由native程序处理
    this.editor._signal('activateTouchMagnifier', evt);
    this.removeMenu();
  };
  
  this.onTouchDragSelectEnd = function(evt){
    // 停止touch放大镜
    this.editor._signal('stopTouchMagnifier');
    this.showMenu();
  };

  this.onTouchDragSelect = function(evt){
    // touch放大镜移动
    this.editor._signal('touchMagnifierMove', evt);
  };
  
  this.onTouchStart = function(evt) {
    
    focusEditor(this); // 捕获焦点
    
    if(this.activate_longpress_cursor_move){
      this.activate_longpress_cursor_move = false;
      this.editor._signal('stopTouchMagnifier', { x: evt.x0, y: evt.y0 });
    }
    
    var editor = this.editor;
    var touches = evt.domEvent.touches;
    var x, y;
    
    // this.removeMenu(); // 删除菜单
    
    if(touches.length == 1){
      x = evt.x0;
      y = evt.y0;
    }
    else if(touches.length == 2){
      x = (touches[0].clientX + touches[1].clientX) / 2;
      y = (touches[0].clientY + touches[1].clientY) / 2;
    }
    else if(touches.length > 2){
      // 开始
      return;
    }
    
    var range = editor.getSelectionRange();
    
    if(range.isEmpty()){
      
      var offset = $$(editor.renderer.scroller).offset;
      var pos = editor.renderer.screenToTextCoordinates(x, y);
      var pix2 = editor.renderer.textToScreenCoordinates(pos.row, pos.column);
      
      if(pix2.pageX >= offset.left){ // 如果光标在显示范围外边,不选择
      
        range = new Range(pos.row, pos.column, pos.row, pos.column);
        editor.session.selection.setRange(range);
      }
    }
  };
  
  this.onTouchMove = function(evt){
    
    var editor = this.editor;
    var touches = evt.domEvent.touches;
    var x, y, pos;

    if(!this.activate_3_touch_point_select && 
      (touches.length == 2 || this.activate_longpress_cursor_move)){ // 两指移动光标
      
      if(touches.length == 2){
        x = (touches[0].clientX + touches[1].clientX) / 2;
        y = (touches[0].clientY + touches[1].clientY) / 2;
      }
      else{
        x = evt.x;
        y = evt.y;
        editor._signal('touchMagnifierMove', { x: x, y: y }); //
      }
      
      pos = editor.renderer.screenToTextCoordinates(x, y);
      var range = new Range(pos.row, pos.column, pos.row, pos.column);
      editor.session.selection.setRange(range);
    }
    else if(touches.length > 2){ // 移动光标选择,三指选择
      this.activate_3_touch_point_select = true;
      x = (touches[0].clientX + touches[1].clientX) / 2;
      y = (touches[0].clientY + touches[1].clientY) / 2;
      pos = editor.renderer.screenToTextCoordinates(x, y);
      editor.session.selection.selectToPosition(pos);
    }
  };
  
  this.onTouchEnd = function(evt){

    focusEditor(this); // 捕获焦点
    
    // if(this.activate_3_touch_point_select){ // 已激活三指选择
    //   if(evt.domEvent.touches.length < 3){
    //     this.activate_3_touch_point_select = false; // 取消三指选择
    //   }
    // }

    if(!evt.domEvent.touches.length &&       // 已没有任何触点
        this.activate_3_touch_point_select){ // 已激活三指选择
      this.activate_3_touch_point_select = false; // 取消三指选择
    }

    
    if(this.activate_longpress_cursor_move){
      
      this.activate_longpress_cursor_move = false;
      
      this.editor._signal('stopTouchMagnifier');
      
      var long_press_selection = this.long_press_selection;
      if(long_press_selection){
        
        // var editor = this.editor;
        // var pos = editor.renderer.screenToTextCoordinates(evt.x, evt.y);
        // var range = new Range(pos.row, pos.column, pos.row, pos.column);
        // var pix = editor.renderer.textToScreenCoordinates(range.start.row, range.start.column);
        // var pix2 = editor.renderer.textToScreenCoordinates(
        //             long_press_selection.start.row, long_press_selection.start.column);
        
        // var w = Math.abs(pix.pageX - pix2.pageX);
        // var h = Math.abs(pix.pageY - pix2.pageY);
        // var s = Math.sqrt(w * w + h * h);
        
        // 触发长按事件后松开后
        // 移动不超过50px显示编辑菜单
        //if(s <= 50){ 
        // 显示菜单
        this.showMenu();
        return;
        //}
      }
    }
    
    if(!evt.domEvent.touches.length && !this.multiClickTimer && !this.isScrollMove){
    
      var range = this.editor.getSelectionRange();
      
      if(!range.isEmpty()){ // 不为空时,显示编辑菜单
        this.showMenu();
      }
    }
  };
  
  this.onLongPress = function(evt){
    this.activate_longpress_cursor_move = true;
    var pos = this.editor.renderer.screenToTextCoordinates(evt.x, evt.y);
    this.long_press_selection = new Range(pos.row, pos.column, pos.row, pos.column);
    this.editor._signal('activateTouchMagnifier', { x: evt.x, y: evt.y });
  };
  
  this.onClick = function(evt){
    
    if(!this.multiClickTimer){
      var editor = this.editor;
      var pos = evt.getDocumentPosition();
      var range = this.clickSelection;
      var range2 = new Range(pos.row, pos.column, pos.row, pos.column);
      
      if(range && range.start.row == range2.start.row && 
          Math.abs(range.start.column - range2.start.column) < 3){
        // 如果您的大手指能够在同一个地方重复点击!那就显示出菜单.
        this.showMenu();
      }
      else{
        this.removeMenu();
      }
      
      editor.session.selection.setRange(range2);
      this.clickSelection = range2;
    }

    // focusEditor(this); // 捕获焦点

  };
  
  this.onDoubleClick = function(evt) {
    var editor = this.editor;
    var session = editor.session;
    var pos = evt.getDocumentPosition();

    var range = session.getBracketRange(pos);
    if (range) {
      if (range.isEmpty()) {
        range.start.column--;
        range.end.column++;
      }
      session.selection.setRange(range);
    } else {
      range = editor.selection.getWordRange(pos.row, pos.column);
      session.selection.setRange(range);
    }
    
    this.clickSelection = range;
    this.startMultiClickTimer();
  };

  this.onTripleClick = function(evt) {
    var editor = this.editor;
    var pos = evt.getDocumentPosition();
    var range = this.clickSelection;
    
    if (range && range.isMultiLine() && range.contains(pos.row, pos.column)) {
      var selection = editor.selection.getLineRange(range.start.row);
      selection.end = editor.selection.getLineRange(range.end.row).end;
      editor.session.selection.setRange(selection);
    } else {
      range = editor.selection.getLineRange(pos.row);
      editor.session.selection.setRange(range);
    }
    
    this.clickSelection = range;
    this.startMultiClickTimer();
  };

  this.onQuadClick = function(ev) {
    this.editor.selectAll();
    this.clickSelection = this.editor.getSelectionRange();
    this.startMultiClickTimer();
  };

}).call(DefaultHandlers.prototype);

exports.DefaultHandlers = DefaultHandlers;

});
