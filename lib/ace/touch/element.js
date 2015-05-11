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
'use strict';

//<!-- 是标准注释吗？-->
//var t = a / 10 /img;

var util = require('./util');
var event = require('./event');
var sync_refresh = require('./sync_refresh');
var dom_event = require('./dom_event');

//using type
var DOMEvent            = dom_event.DOMEvent; 
var SyncRefresh_delay   = sync_refresh.delay;
var SyncRefresh_clear   = sync_refresh.clear;

var QUERY_REG_EXP     = /^((#)|(\.)|(\*))?(\w+)?(\[(\w+)(((\=)|(\!))(\w+))?\])?$/;
var doc               = document;
var html              = doc.documentElement;
var body              = doc.body;
var getComputedStyle  = global.getComputedStyle;

if(!body){
  doc.write('<div></div>');
  body = doc.body;
}

if(!getComputedStyle){
	global.getComputedStyle = getComputedStyle = body.currentStyle ?
	function(dom){ return dom.currentStyle; }:
	function(){ return { }; }
}

var HTML_STYLES = getComputedStyle(body, null);
var CSS_PREFIX_ITEM = [];
var CSS_PREFIX = dom_event.CSS_PREFIX;

var CSS_ITEMS = [
  'appearance',
  'appearance',
  'text-?size-?adjust',
  'textSizeAdjust',
  'tap-?highlight',
  'tapHighlightColor',
  'radius',
  'borderRadius',
  'transform',
  'transform',
  'box-?shadow',
  'boxShadow',
  'text-?shadow',
  'textShadow',
  'column',
  'columnCount',
  'box-?sizing',
  'boxSizing',
  'user-?select',
  'userSelect',
  'animation',
  'animationDuration',
  'transition',
  'transitionDuration',
  'keyframes',
  'animationDuration',
  'background-?size',
  'backgroundSize',
  'background-?clip',
  'backgroundClip',
  'mask',//-?[a-zA-Z]
  'maskImage',
	'marquee-?[a-zA-Z]',
	'marquee',
  'backface-?visibility',
  'backfaceVisibility',
  'perspective',
  'perspective',
  //
  'box-align',
  'boxAlign',
	'box-flex',
	'boxFlex'
];

var ALL_TAG_NAME = 
'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,\
blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,datalist,\
dd,del,details,dfn,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,\
frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,hrhtml,i,iframe,img,input,ins,keygen,\
kbd,label,legend,li,link,map,mark,menu,meta,meter,nav,noframes,noscript,object,ol,\
optgroup,option,output,p,param,pre,progress,q,rp,rt,ruby,s,samp,script,select,small,\
source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,\
time,title,tr,track,tt,u,ul,var,video,wbr'.split(',');

var ELEMENT_DISPLAYS = {};

for(var i = 0; i < ALL_TAG_NAME.length; i++){
  var tagName = ALL_TAG_NAME[i];
  var dom = doc.createElement(tagName);
  body.appendChild(dom);
  ELEMENT_DISPLAYS[tagName.toUpperCase()] =
  ELEMENT_DISPLAYS[tagName] = getComputedStyle(dom, null).display;
  body.removeChild(dom);
}

// css float 属性 名称
var CSS_FLOAT = 
    HTML_STYLES.cssFloat ? 'cssFloat' : 
    HTML_STYLES.styleFloat ? 'styleFloat': 'float';
var CSS_NAME = { 'float': CSS_FLOAT };

/*
 * 解析css属性名称
 */
var parseCssName = function(name) {
  if(name == 'float')
    return CSS_FLOAT;
  return name;
};

if(CSS_PREFIX){

  var CSS_PREFIX_ = '';
  var len = CSS_ITEMS.length;

  for (var i = 0; i < len; i += 2) {
    var name = CSS_ITEMS[i + 1];

    if (!(name in HTML_STYLES)) {

      if(!CSS_PREFIX_){
        name = CSS_PREFIX + name.substr(0, 1).toUpperCase() + name.substr(1);
        CSS_PREFIX_ = (HTML_STYLES[name] ? '': '-') + CSS_PREFIX + '-';
      }
      CSS_PREFIX_ITEM.push(CSS_ITEMS[i]);
    }
  }

  var REGEXP =
    new RegExp('^(-ms-|-o-|-webkit-|-moz-)?(.*)(' +
    CSS_PREFIX_ITEM.join('|') + ')(.*)$', 'i');

  parseCssName = function(name){

    var rest = CSS_NAME[name];
    if(rest)
      return rest;

    rest = name;

    var mat = REGEXP.exec(rest);
    if (mat)
      rest = CSS_PREFIX_ + mat[2] + mat[3] + mat[4];

    rest = rest.replace(/-([a-z])/ig, function(all, i) { return i.toUpperCase() });

    CSS_NAME[name] = rest;
    return rest;
  };
}

/*
 * 解析css属性值（转换为数字）
 */
function parseCssValue(value) {
  return parseFloat(value.replace(/[^0-9]/g, ''));
}

function getCss(_this, name){
  return getComputedStyle(_this.dom, null)[parseCssName(name)];
}

function getCssByDom(dom, name){
  return getComputedStyle(dom, null)[parseCssName(name)];
}

function getByDom(el){
  var entity = el.entity;
  if (entity){
    return entity;
  }
  return new Element(el);
}

function createEl(o){
  
  var el = new Element(document.createElement(o.tag || 'div'));
  for(var i in o){
    var value = o[i];
    
    if(i == 'children'){
      for(var j = 0; j < value.length; j++){
        el.append(createEl(value[j]));
      }
    }
    else if (i in el){
      el[i] = value;
    }
    else {
      el.dom.setAttribute(i, value);
    }
  }
  return el;
}

//获取 Element
function getEl(o){
  
  if (o.constructor === Element){ //Element
    return o;
  }
  if (o.nodeType == 1) { //HTMLElement
    return getByDom(o);
  }
  if(o.constructor === Object){
    return createEl(o);
  }
  return null;
}

//static private:
//查询元素集合
function query(elements, exp) {

  var results = elements;
  if (exp) {
    var match = QUERY_REG_EXP.exec(exp);
    var results = [];

    if (match && elements[0]) {

      if (match[2]) {//id
        for (var i = 0, e; (e = elements[i]); i++) {
          if (e.id == match[5]) {
            results.push(e);
            break;
          }
        }
      }

      else if (match[3]) { //class
        for (var i = 0, e; (e = elements[i]); i++){
          if(e.className == match[5])
            results.push(e);
        }
      }

      else if (match[4]){
        results = elements; //all
      }

      else if (match[5]) {    //label

        var reg = new RegExp('^' + match[5] + '$', 'i');

        for (var i = 0, e; (e = elements[i]); i++){
          if(reg.test(e.tagName))
            results.push(e);
        }
      }

      var attrName = match[7];
      var value = match[12];

      if (attrName) {//过滤属性
        elements = results;
        results = [];
        for (var i = 0, e; (e = elements[i]); i++) {
          var attr = e.getAttribute(attrName);

          if (match[8]) { //需要对比属性值
            //需要相等的值或不相等的值
            if (match[10] ? attr == value : attr != value)
              results.push(e);
          }
          else if (attr)
            results.push(e); //只要有值就可以
        }
      }

    }
  }

  var len = results.length;

  for (var i = 0; i < len; i++) {

    var item = results[i];
    var entity = item.entity;

    if (!entity) {
      entity = new Element(item);
    }
    results[i] = entity;
  }
  return results;
}

//获取子节点
function find(elem, out) {

  var ns = elem.childNodes;
  var len = ns.length;

  for (var i = 0; i < len; i++) {

    var n = ns[i];

    if (n.nodeType == 1) {
      out.push(n);

      //当前如果为控件不在往下查询
      if (!n.entity || n.entity.te == 2) {
        find(n, out);
      }
    }
  }
  return out;
}

//获取元素节点
function getElement(dom, name){

  if(dom) {
    if(dom.nodeType == 1){
      return getByDom(dom);
    }
    else{
      return getElement(dom[name], name);
    }
  }
  return null;
}

//清空子节点
function empty(dom) {

  var ns = dom.childNodes;
  var len = ns.length;

  for (var i = 0; i < len; i++) {

    var n = ns[i];

    if (n.nodeType == 1) {
      var entity = n.entity;
      if (entity)
        remove(entity);
    }
  }
}

function remove(_this) {

  empty(_this.dom);

	if(_this.events){

		var events = _this.events;
		_this.events = null;

		for(var i = 0; i < events.length; i++){
			var item = events[i];
			event.removeListener(_this.dom, item[0], item[1]);
		}
	}

  if(_this.onunload)
     _this.onunload.emit();

  var top = _this.top;
  if (top) {
    _this.top = null;
    var id = _this.dom.id;
    if (id)
      delete top[id];
  }
}

//获取text
function text(el) {

  var ns = el.childNodes;
  var len = ns.length;
  var value = [];

  for (var i = 0; i < len; i++) {
    var n = ns[i];
    if (n.nodeType != 8)
      value.push(n.nodeType == 1 ? text(n): n.nodeValue);
  }
  return value.join('');
}

//添加子控件
var addChild = /*tesla.DEBUG ? */function (top, el) {

  if (top) {
    var id = el.dom.id;

    if(id){
      var sourceTop = el.top;
      if(sourceTop) {
        delete sourceTop[id];
      }

      if (id in top)
        throw new Error('不能使用id:"' + id + '",已被占用');
      else
        top[id] = el;
    }
    el.top = top;
  }
}
/*: function(top, el){

  if (top) {
    var id = el.dom.id;

    if(id){
      var sourceTop = el.top;
      if(sourceTop) {
        delete sourceTop[id];
      }
      top[id] = el;
    }
    el.top = top;
  }
}*/;

function dequeue(cthis, st){

	var queue = cthis.queue;
	if(queue.length){

		var item = queue.shift();

		item.cb.call(cthis);

		if(queue.length){
			var option = queue[0];
			option.time + st;
			play(cthis, option);
		}
	}
}

var TRANSITION_DELAY            = parseCssName('transition-delay');
var TRANSITION_TIMING_FUNCTION	= parseCssName('transition-timing-function');
var TRANSITION_DURATION			= parseCssName('transition-duration');

function play(cthis, option){

	var time = option.time;
	var style = cthis.dom.style;

	cthis.style = option.style;

  style[TRANSITION_DELAY]             = option.delay + 'ms';
  style[TRANSITION_TIMING_FUNCTION]   = option.curve;
  style[TRANSITION_DURATION]          = (time < 0 ? 0: time) + 'ms';

	SyncRefresh_delay(dequeue, cthis, time);
}

var Element = util.class(DOMEvent, {

  //private:
  //get __c(){},
  set __c(val){},

  //public:
	/**
	 * 动画队列
	 * @type {Array}
	 */
	queue: null,

  /**
   * type 0 = NodeText, 1 = tesla.html.Control, 2 = tesla.html.Element
   * @type {Number}
   */
  te: 2,

  /**
   * tag name
   * @type {String}
   */
  tagName: '',

  /**
   * 元素ID
   * @type {String}
   */
  get id(){
    return this.dom.id;
  },

  set id(value){
    this.dom.id = value;
  },
  
  /*
   * 内部文档元素
   * @type {HTMLElement}
   */
  idom: null,

  /**
   * 顶层控件
   * @type {tesla.html.Control}
   */
  top: null,

  /**
   * 构造函数
   * @constructor
   * @param {HTMLElement} dom HTML元素
   */
  constructor: function(dom) {
    dom.entity = this;
    this.dom = dom;
    this.idom = dom;
    this.tagName = dom.tagName;
  },

  /**
   * 元素是否在显示状态
   * @type {Boolean}
   */
  get visible(){
    var display = getCss(this, 'display');
    return !(display == 'none' || display === '');
  },

  /**
   * 显示控件
   */
  show: function() {
    this.dom.style.display = ELEMENT_DISPLAYS[this.tagName] || 'block';
    return this;
  },

  /**
   * 隐藏控件
   */
  hide: function() {
    this.dom.style.display = 'none';
    return this;
  },

  /**
   * 显示与隐藏切换
   */
  toggle: function() {
    this.visible ? this.hide() : this.show();
    return this;
  },

	/**
	 * 创建动画,追加到动画队列
	 * @param {Object} 		style
	 * @param {Object} 		time
	 * @param {Object} 		delay	(Optional)
	 * @param {Object} 		curve	(Optional)
	 * @param {Function} 	cb		(Optional)
	 */
	animate: function(style, time, delay, curve, cb){

		var queue = this.queue;
		if(!queue){
			this.queue = queue = [];
		}

		var option = {
			style: style,
			time: time,
			delay: 0,
			curve: 'ease',
			cb: util.noop
		};

		var len = arguments.length;

		if(len == 3 || len == 4){

			var type = typeof delay;

			if(type == 'number'){
				option.delay = delay;
			}
			else if(type == 'string'){
				option.curve = delay;
			}
			else if(type == 'function'){
				option.cb = delay;
			}

			if(len == 4){
				type = typeof curve;

				if(type == 'string'){
					option.curve = curve;
				}
				else if(type == 'function'){
					option.cb = curve;
				}
			}
		}

		queue.push(option);

		if(queue.length == 1){
			nextTick(play, this, option);
		}
		return this;
	},

	/**
	 * 立即结束动画队列
	 */
	stop: function(){
		var item = this.queue.desc(0);

		if(item){
			this.queue.splice(0, this.queue.length);
			this.style = item.style;
			this.dom.style[TRANSITION_DURATION] = 0;
			SyncRefresh_clear(this);
		}
		return this;
	},

  /**
   * 获取或设置CSS样式,重载,一个参数为获取样式
   * @param {String} name 样式名称
   * @param {Object} value (Optional) 样式值
   * @return {Object}
   */
  css: function(name, value) {

    if(arguments.length == 2){ //设置样式
      this.dom.style[parseCssName(name)] = value;
    }
    else{
      return getCss(this, name);
    }
  },

  /**
   * 当前元素的所有样式
   * @type {Object}
   */
  get style(){
    return getComputedStyle(this.dom, null);
  },

  set style(css){
    var dom = this.dom;
    for (var i in css)
      dom.style[parseCssName(i)] = css[i];
  },

  /**
   * 获取或设置属性,重载,一个参数为获取属性,
   * @param {String}  name 属性名称
   * @param {String}  value (Optional) 属性值
   * @return {String}
   */
  attr: function(name, value) {

    if(arguments.length == 2){
      this.dom.setAttribute(name, value);
    }
    else{
      return this.dom.getAttribute(name);
    }
  },

  /**
   * 删除属性
   * @param  {String} name 要删除的属性名称
   */
  removeAttr: function(name) {
    this.dom.removeAttribute(name);
  },

  /**
   * 添加class样式
   * @param {String} name 样式类名
   */
  addClass: function(name) {
    var dom = this.dom;
    var cls = dom.className;
    var names = name.split(/ +/);

    for (var i = 0; (name = names[i]); i++) {
      var reg = new RegExp('(^| +){0}( +|$)'.format(name), 'g');
      if (!reg.test(cls))
        cls = cls + ' ' + name;
    }
    cls = cls.trim();
    if (cls != dom.className)
      dom.className = cls;
    return this;
  },

  /**
   * 删除class样式
   * @param {String} name 要删除的样式名称
   */
  removeClass: function(name) {
    var dom = this.dom;
    var cls = dom.className;
    var names = name.split(/ +/);

    for (var i = 0; (name = names[i]); i++)
      cls = cls.replace(new RegExp('(^| +){0}( +|$)'.format(name), 'g'), ' ');
    cls = cls.trim();
    if (cls != dom.className)
      dom.className = cls;
    return this;
  },

  /**
   * 在两个class中切换
   */
  toggleClass: function(name) {
    var dom = this.dom;
    var cls = dom.className;
    var names = name.split(/ +/);

    for (var i = 0; (name = names[i]); i++) {
      var reg = new RegExp('(^| +){0}( +|$)'.format(name), 'g');
      if (reg.test(cls))
        cls = cls.replace(reg, ' ');
      else
        cls = cls + ' ' + name;
    }
    dom.className = cls.trim();
    return this;
  },

  /**
   * 元素距离当前绝对定义的位置
   * @type {Object}
   */
	get position(){
	  var dom = this.dom;
    var offsetParent = dom.offsetParent || body;
    var offset = this.offset;
    var parentOffset = { top: 0, left: 0 };

    offset.top -= parseCssValue(getCssByDom(dom, 'margin-top'));
    offset.left -= parseCssValue(getCssByDom(dom, 'margin-left'));
  
  	while(true){
  		if(offsetParent === body || offsetParent === html){
  			break;
  		}
  		if(getCssByDom(offsetParent, 'position') == 'static'){
        offsetParent = offsetParent.offsetParent;
  		}
  		else{
  			parentOffset = exports.$(offsetParent).offset;
		    parentOffset.top +=
				parseCssValue(getCssByDom(offsetParent, 'border-top-width'));
		    parentOffset.left +=
				parseCssValue(getCssByDom(offsetParent, 'border-left-width'));
  			break;
  		}
  	}

    return {
      top: offset.top - parentOffset.top,
      left: offset.left - parentOffset.left
    };
	},

  /**
   * 元素距离当前网页的位置
   * @type {Object}
   */
  get offset() {
    var box = this.dom.getBoundingClientRect();
    var top = box.top + pageYOffset;
    var left = box.left + pageXOffset;

    return { top: top, left: left, width: box.width, height: box.height };
  },

  /**
   * 返回父级元素
   * @type {tesla.html.Element} 返回结果
   */
  get parent() {
    var parent = this.dom.parentNode;
    return parent ? getByDom(parent): null;
  },

  /**
   * 查询父级元素，直到匹配相应的元素
   * @param {String} exp 查询表达式
   * @return {tesla.html.Element} 返回结果
   */
  closest: function(exp) {
    var dom = this.dom;
    var ls = [];
    while (dom = dom.parentNode) {
      ls = query([dom], exp);
      if (ls.length)
        return ls[0];
    }
    return null;
  },

  /**
   * 在当前作用域内（当前所属控件管理的范围）,
   * 查询后代元素，慎用，频繁使用会导致效率问题
   * @param  {String}            exp 查询表达式
   * @return {tesla.html.Element[]}
   */
  find: function(exp) {
    return query(find(this.idom, []), exp);
  },

  /**
   * 查询子元素
   * @param {String} exp 查询表达式
   * @return {tesla.html.Element[]} 返回结果
   */
  children: function(exp) {
    var ns = this.idom.childNodes;
    var len = ns.length;
    var ls = [];

    for (var i = 0; i < len; i++) {
      var n = ns[i];
      if (n.nodeType == 1)
        ls.push(n);
    }
    return query(ls, exp);
  },

  /**
   * 上一个兄弟元素
   * @type {tesla.html.Element}
   */
  get prev() {
    return getElement(this.dom.previousSibling, 'previousSibling');
  },

  /**
   * 下一个兄弟元素
   * @type {tesla.html.Element}
   */
  get next() {
    return getElement(this.dom.nextSibling, 'nextSibling');
  },

  /**
   * 第一个子元素
   * @type {tesla.html.Element}
   */
  get first() {
    return getElement(this.idom.firstChild, 'nextSibling');
  },

  /**
   * 最后一个子元素
   * @type {tesla.html.Element}
   */
  get last() {
    return getElement(this.idom.lastChild, 'previousSibling');
  },

  /**
   * 元素 html 内容,慎用,会覆盖子控件
   * @type {String}
   */
  get html() {
    return this.idom.innerHTML;
  },

  set html(val){
    empty(this.idom);
    this.idom.innerHTML = val;
  },

  /**
   * 元素 text 内容
   * @type {String}
   */
  get text(){
    return text(this.idom);
  },

  set text(val){
    empty(this.idom);
    this.idom.textContent = val;
  },

  /**
   * 元素 value 值
   * @type {String}
   */
  get value(){
    return this.dom.value;
  },

  set value(val){
    this.dom.value = val;
  },

  /**
   * 追加元素至结尾
   * @param {tesla.html.Element} el 要追加的元素
   */
  append: function(el) {
    addChild(this.te == 1 ? this : this.top, el);
    this.idom.appendChild(el.dom);
    return this;
  },
  
  /**
   * 追加自身至父元素结尾
   * @param {tesla.html.Element} parent 父元素
   * @param {String} id (Optional) 当前元素id
   */
	appendTo: function(parent, id){
		if(id)
      this.dom.id = id;
		addChild(parent.te == 1 ? parent: parent.top, this);
		parent.idom.appendChild(this.dom);
		return this;
	},
  
  /**
   * 前置元素
   * @param {tesla.html.Element} el 要前置的元素
   */
  prepend: function(el) {
    var dom = this.idom;
    addChild(this.te == 1 ? this : this.top, el);
    dom.firstChild ?
      dom.insertBefore(el.dom, dom.firstChild) : dom.appendChild(el.dom);
    return this;
  },

  /**
   * 插入前
   * @param {tesla.html.Element} el 要插入的元素
   */
  before: function(el) {

    var dom = this.dom;
    var parent = dom.parentNode;
    if (parent) {
      addChild(this.top, el);
      parent.insertBefore(el.dom, dom);
    }
    return this;
  },

  /**
   * 插入后
   * @param {tesla.html.Element} el 要插入的元素
   */
  after: function(el) {

    var dom = this.dom;
    var parent = dom.parentNode;
    if (parent) {
      addChild(this.top, el);
      dom.nextSibling ? 
        parent.insertBefore(el.dom, dom.nextSibling) : parent.appendChild(el.dom);
    }
    return this;
  },

  /**
   * 删除当前元素
   */
  remove: function() {
    remove(this);
    var dom = this.dom;
    if (dom.parentNode)
      dom.parentNode.removeChild(dom);
    return this;
  },

  /**
   * 删除元素中所有的子节点
   */
  empty: function() {
    empty(this.idom);
    this.idom.textContent = '';
    return this;
  }
});

exports.Element = Element;

util.extend(exports, {

  CSS_PREFIX: CSS_PREFIX,                     //CSS前缀
  CSS_PREFIX_ITEM: CSS_PREFIX_ITEM,           //要修复的css

  /**
   * 解析css属性名称
   * @method parseCssName
   * @param {String} name 要解析的名称
   * @return {String} 返回解析后的名称
   * @static
   */
  parseCssName: parseCssName,

  /**
   * 创建Element对像
   * @param  {Object}          o 可为 html、tag、
   * HTMLElement、tesla.html.Element、中的任意一个
   * @return {tesla.html.Element}        返回结果
   * @static
   */
  create: function(o) {
    
    if(typeof o != 'string'){
      return getEl(o);
    }
    
    if(!/^( *<[^>]+>.*?< *\/[^>]+>| *<.+?\/ *> *)/.test(o)) {//Html
      return query(find(html, [html]), o)[0] || null;
    }

    //create html element

    var tags = o.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag) {
      return tag.match(
        /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
        all : front + '></' + tag + '>';
    });

    var wrap =
        !tags.indexOf('<opt') &&
        [1, '<select multiple="multiple">', '</select>'] ||
        !tags.indexOf('<leg') &&
        [1, '<fieldset>', '</fieldset>'] ||
        tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
        [1, '<table>', '</table>'] ||
        !tags.indexOf('<tr') &&
        [2, '<table><tbody>', '</tbody></table>'] ||
        (!tags.indexOf('<td') || !tags.indexOf('<th')) &&
        [3, '<table><tbody><tr>', '</tr></tbody></table>'] ||
        !tags.indexOf('<col') &&
        [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'] ||
        [0, '', ''];

    var div = doc.createElement('div');
    div.innerHTML = wrap[1] + tags + wrap[2];

    while (wrap[0]--)
      div = div.lastChild;
    var first = div.firstChild;
    return new Element(first.nodeType == 1 ? first : first.nextSibling);
  }
});

exports.htmlTag = function(tag){
  return doc.createElement(tag || 'div');
};

exports.$ = exports.create;
global.$$ = exports.create;

//修复IOS 与 Android 固定定位的触控失灵 BUG
if(util.env.android || util.env.ios){
	exports.$(html).on('click', util.noop);
}

Object.defineProperty(exports, 'body', {
  get: function(){
    return exports.$(document.body);
  }
});

});
