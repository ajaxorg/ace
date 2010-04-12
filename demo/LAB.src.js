// LAB.js (LABjs :: Loading And Blocking JavaScript)
// v1.0.2rc1 (c) Kyle Simpson
// MIT License

(function(global){
	var sSTRING = "string",				// constants used for compression optimization
		sHEAD = "head",
		sBODY = "body",
		sSCRIPT = "script",
		sREADYSTATE = "readyState",
		sPRELOADDONE = "preloaddone",
		sLOADTRIGGER = "loadtrigger",
		sSRCURI = "srcuri",
		sPRELOAD = "preload",
		sCOMPLETE = "complete",
		sDONE = "done",
		sWHICH = "which",
		sPRESERVE = "preserve",
		sONREADYSTATECHANGE = "onreadystatechange",
		sONLOAD = "onload",
		sHASOWNPROPERTY = "hasOwnProperty",
		sSCRIPTCACHE = "script/cache",
		sTYPEOBJ = "[object ",
		sTYPEFUNC = sTYPEOBJ+"Function]",
		sTYPEARRAY = sTYPEOBJ+"Array]",
		nNULL = null,
		bTRUE = true,
		bFALSE = false,
		oDOC = global.document,
		oWINLOC = global.location,
		oACTIVEX = global.ActiveXObject,
		fSETTIMEOUT = global.setTimeout,
		fCLEARTIMEOUT = global.clearTimeout,
		fGETELEMENTSBYTAGNAME = function(tn){return oDOC.getElementsByTagName(tn);},
		fOBJTOSTRING = Object.prototype.toString,
		fNOOP = function(){},
		append_to = {},
		all_scripts = {},
		PAGEROOT = /^[^?#]*\//.exec(oWINLOC.href)[0], // these ROOTs do not support file:/// usage, only http:// type usage
		DOCROOT = /^\w+\:\/\/\/?[^\/]+/.exec(PAGEROOT)[0], // optional third / in the protocol portion of this regex so that LABjs doesn't blow up when used in file:/// usage
		docScripts = fGETELEMENTSBYTAGNAME(sSCRIPT),

		// Ah-ha hush that fuss, feature inference is used to detect specific browsers
		// because the techniques used in LABjs have no known feature detection. If
		// you know of a feature test please contact me ASAP. Feature inference is used
		// instead of user agent sniffing because the UA string can be easily
		// spoofed and is not adequate for such a mission critical part of the code.
		is_opera = global.opera && fOBJTOSTRING.call(global.opera) == sTYPEOBJ+"Opera]",
		is_gecko = (function(o) { o[o] = o+""; return o[o] != o+""; })(new String("__count__")),

		global_defs = {
			cache:!(is_gecko||is_opera), // browsers like IE/Safari/Chrome can use the "cache" trick to preload
			order:is_gecko||is_opera, // FF/Opera preserve execution order with script tags automatically, so just add all scripts as fast as possible
			xhr:bTRUE, // use XHR trick to preload local scripts
			dupe:bTRUE, // allow duplicate scripts? defaults to true now 'cause is slightly more performant that way (less checks)
			base:"", // base path to prepend to all non-absolute-path scripts
			which:sHEAD // which DOM object ("head" or "body") to append scripts to
		}
	;
	global_defs[sPRESERVE] = bFALSE; // force preserve execution order of all loaded scripts (regardless of preloading)
	global_defs[sPRELOAD] = bTRUE; // use various tricks for "preloading" scripts
	
	append_to[sHEAD] = fGETELEMENTSBYTAGNAME(sHEAD);
	append_to[sBODY] = fGETELEMENTSBYTAGNAME(sBODY);
	
	function isFunc(func) { return fOBJTOSTRING.call(func) === sTYPEFUNC; }
	function canonicalScriptURI(src,base_path) {
		var regex = /^\w+\:\/\//, ret; 
		if (typeof src !== sSTRING) src = "";
		if (typeof base_path !== sSTRING) base_path = "";
		ret = (regex.test(src) ? "" : base_path) + src;
		return ((regex.test(ret) ? "" : (ret.charAt(0) === "/" ? DOCROOT : PAGEROOT)) + ret);
	}
	function sameDomain(src) { return (canonicalScriptURI(src).indexOf(DOCROOT) === 0); }
	function scriptTagExists(uri) { // checks if a script uri has ever been loaded into this page's DOM
		var script, idx=-1;
		while (script = docScripts[++idx]) {
			if (typeof script.src === sSTRING && uri === canonicalScriptURI(script.src) && script.type !== sSCRIPTCACHE) return bTRUE;
		}
		return bFALSE;
	}
	function engine(queueExec,opts) {
		queueExec = !(!queueExec);
		if (opts == nNULL) opts = global_defs;
		
		var ready = bFALSE,
			_use_preload = queueExec && opts[sPRELOAD],
			_use_cache_preload = _use_preload && opts.cache,
			_use_script_order = _use_preload && opts.order,
			_use_xhr_preload = _use_preload && opts.xhr,
			_auto_wait = opts[sPRESERVE],
			_which = opts.which,
			_base_path = opts.base,
			waitFunc = fNOOP,
			scripts_loading = bFALSE,
			publicAPI,

			first_pass = bTRUE,
			scripts = {},
			exec = [],
			end_of_chain_check_interval = nNULL
		;
		
		_use_preload = _use_cache_preload || _use_xhr_preload || _use_script_order; // if all flags are turned off, preload is moot so disable it
		
		function isScriptLoaded(elem,scriptentry) {
			if ((elem[sREADYSTATE] && elem[sREADYSTATE]!==sCOMPLETE && elem[sREADYSTATE]!=="loaded") || scriptentry[sDONE]) { return bFALSE; }
			elem[sONLOAD] = elem[sONREADYSTATECHANGE] = nNULL; // prevent memory leak
			return bTRUE;
		}
		function handleScriptLoad(elem,scriptentry,skipReadyCheck) {
			skipReadyCheck = !(!skipReadyCheck); // used to override ready check when script text was injected from XHR preload
			if (!skipReadyCheck && !(isScriptLoaded(elem,scriptentry))) return;
			scriptentry[sDONE] = bTRUE;

			for (var key in scripts) {
				if (scripts[sHASOWNPROPERTY](key) && !(scripts[key][sDONE])) return;
			}
			ready = bTRUE;
			waitFunc();
		}
		function loadTriggerExecute(scriptentry) {
			if (isFunc(scriptentry[sLOADTRIGGER])) {
				scriptentry[sLOADTRIGGER]();
				scriptentry[sLOADTRIGGER] = nNULL; // prevent memory leak
			}
		}
		function handleScriptPreload(elem,scriptentry) {
			if (!isScriptLoaded(elem,scriptentry)) return;
			scriptentry[sPRELOADDONE] = bTRUE;
			fSETTIMEOUT(function(){
				append_to[scriptentry[sWHICH]].removeChild(elem); // remove preload script node
				loadTriggerExecute(scriptentry);
			},0);
		}
		function handleXHRPreload(xhr,scriptentry) {
			if (xhr[sREADYSTATE] === 4) {
				xhr[sONREADYSTATECHANGE] = fNOOP; // fix a memory leak in IE
				scriptentry[sPRELOADDONE] = bTRUE;
				fSETTIMEOUT(function(){ loadTriggerExecute(scriptentry); },0);
			}
		}
		function createScriptTag(scriptentry,src,type,charset,onload,scriptText) {
			var _script_which = scriptentry[sWHICH];
			fSETTIMEOUT(function() { // this setTimeout waiting "hack" prevents a nasty race condition browser hang (IE) when the document.write("<script defer=true>") type dom-ready hack is present in the page
				if ("item" in append_to[_script_which]) { // check if ref is still a live node list
					if (!append_to[_script_which][0]) { // append_to node not yet ready
						fSETTIMEOUT(arguments.callee,25); // try again in a little bit -- note, will recall the anonymous functoin in the outer setTimeout, not the parent createScriptTag()
						return;
					}
					append_to[_script_which] = append_to[_script_which][0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
				}
				var scriptElem = oDOC.createElement(sSCRIPT);
				scriptElem.type = type;
				if (typeof charset === sSTRING) scriptElem.charset = charset;
				if (isFunc(onload)) { // load script via 'src' attribute, set onload/onreadystatechange listeners
					scriptElem[sONLOAD] = scriptElem[sONREADYSTATECHANGE] = function(){onload(scriptElem,scriptentry);};
					scriptElem.src = src;
				}
				// only for appending to <head>, fix a bug in IE6 if <base> tag is present -- otherwise, insertBefore(...,null) acts just like appendChild()
				append_to[_script_which].insertBefore(scriptElem,(_script_which===sHEAD?append_to[_script_which].firstChild:nNULL));
				if (typeof scriptText === sSTRING) { // script text already avaiable from XHR preload, so just inject it
					scriptElem.text = scriptText;
					handleScriptLoad(scriptElem,scriptentry,bTRUE); // manually call 'load' callback function, skipReadyCheck=true
				}
			},0);
		}
		function loadScriptElem(scriptentry,src,type,charset) {
			all_scripts[scriptentry[sSRCURI]] = bTRUE;
			createScriptTag(scriptentry,src,type,charset,handleScriptLoad);
		}
		function loadScriptCache(scriptentry,src,type,charset) {
			var args = arguments;
			if (first_pass && scriptentry[sPRELOADDONE] == nNULL) { // need to preload into cache
				scriptentry[sPRELOADDONE] = bFALSE;
				createScriptTag(scriptentry,src,sSCRIPTCACHE,charset,handleScriptPreload); // fake mimetype causes a fetch into cache, but no execution
			}
			else if (!first_pass && scriptentry[sPRELOADDONE] != nNULL && !scriptentry[sPRELOADDONE]) { // preload still in progress, make sure trigger is set for execution later
				scriptentry[sLOADTRIGGER] = function(){loadScriptCache.apply(nNULL,args);};
			}
			else if (!first_pass) { // preload done, so reload (from cache, hopefully!) as regular script element
				loadScriptElem.apply(nNULL,args);
			}
		}
		function loadScriptXHR(scriptentry,src,type,charset) {
			var args = arguments, xhr;
			if (first_pass && scriptentry[sPRELOADDONE] == nNULL) { // need to preload
				scriptentry[sPRELOADDONE] = bFALSE;
				xhr = scriptentry.xhr = (oACTIVEX ? new oACTIVEX("Microsoft.XMLHTTP") : new global.XMLHttpRequest());
				xhr[sONREADYSTATECHANGE] = function(){handleXHRPreload(xhr,scriptentry);};
				xhr.open("GET",src);
				xhr.send("");
			}
			else if (!first_pass && scriptentry[sPRELOADDONE] != nNULL && !scriptentry[sPRELOADDONE]) {	// preload XHR still in progress, make sure trigger is set for execution later
				scriptentry[sLOADTRIGGER] = function(){loadScriptXHR.apply(nNULL,args);};
			}
			else if (!first_pass) { // preload done, so "execute" script via injection
				all_scripts[scriptentry[sSRCURI]] = bTRUE;
				createScriptTag(scriptentry,src,type,charset,nNULL,scriptentry.xhr.responseText);
				scriptentry.xhr = nNULL;
			}
		}
		function loadScript(o) {
			if (o.allowDup == nNULL) o.allowDup = opts.dupe;
			var src = o.src, type = o.type, charset = o.charset, allowDup = o.allowDup, 
				src_uri = canonicalScriptURI(src,_base_path), scriptentry, same_domain = sameDomain(src_uri);
			if (typeof type !== sSTRING) type = "text/javascript";
			if (typeof charset !== sSTRING) charset = nNULL;
			allowDup = !(!allowDup);
			if (!allowDup && 
				(
					(all_scripts[src_uri] != nNULL) || (first_pass && scripts[src_uri]) || scriptTagExists(src_uri)
				)
			) {
				if (scripts[src_uri] != nNULL && scripts[src_uri][sPRELOADDONE] && !scripts[src_uri][sDONE] && same_domain) {
					// this script was preloaded via XHR, but is a duplicate, and dupes are not allowed
					handleScriptLoad(nNULL,scripts[src_uri],bTRUE); // mark the entry as done and check if chain group is done
				}
				return;
			}
			if (scripts[src_uri] == nNULL) scripts[src_uri] = {};
			scriptentry = scripts[src_uri];
			if (scriptentry[sWHICH] == nNULL) scriptentry[sWHICH] = _which;
			scriptentry[sDONE] = bFALSE;
			scriptentry[sSRCURI] = src_uri;
			scripts_loading = bTRUE;
			
			if (!_use_script_order && _use_xhr_preload && same_domain) loadScriptXHR(scriptentry,src_uri,type,charset);
			else if (!_use_script_order && _use_cache_preload) loadScriptCache(scriptentry,src_uri,type,charset);
			else loadScriptElem(scriptentry,src_uri,type,charset);
		}
		function onlyQueue(execBody) {
			exec.push(execBody);
		}
		function queueAndExecute(execBody) { // helper for publicAPI functions below
			if (queueExec && !_use_script_order) onlyQueue(execBody);
			if (!queueExec || _use_preload) execBody(); // if engine is either not queueing, or is queuing in preload mode, go ahead and execute
		}
		function serializeArgs(args) {
			var sargs = [], idx;
			for (idx=-1; ++idx<args.length;) {
				if (fOBJTOSTRING.call(args[idx]) === sTYPEARRAY) sargs = sargs.concat(serializeArgs(args[idx]));
				else sargs[sargs.length] = args[idx];
			}
			return sargs;
		}
				
		publicAPI = {
			script:function() {
				fCLEARTIMEOUT(end_of_chain_check_interval);
				var args = serializeArgs(arguments), use_engine = publicAPI, idx;
				if (_auto_wait) {
					for (idx=-1; ++idx<args.length;) {
						if (idx===0) {
							queueAndExecute(function(){
								loadScript((typeof args[0] === sSTRING) ? {src:args[0]} : args[0]);
							});
						}
						else use_engine = use_engine.script(args[idx]);
						use_engine = use_engine.wait();
					}
				}
				else {
					queueAndExecute(function(){
						for (idx=-1; ++idx<args.length;) {
							loadScript((typeof args[idx] === sSTRING) ? {src:args[idx]} : args[idx]);
						}
					});
				}
				end_of_chain_check_interval = fSETTIMEOUT(function(){first_pass = bFALSE;},5); // hack to "detect" the end of the chain if a wait() is not the last call
				return use_engine;
			},
			wait:function(func) {
				fCLEARTIMEOUT(end_of_chain_check_interval);
				first_pass = bFALSE;
				if (!isFunc(func)) func = fNOOP;
				// On this current chain's waitFunc function, tack on call to trigger the queue for the *next* engine 
				// in the chain, which will be executed when the current chain finishes loading
				var e = engine(bTRUE,opts),	// 'bTRUE' tells the engine to be in queueing mode
					triggerNextChain = e.trigger, // store ref to e's trigger function for use by 'wfunc'
					wfunc = function(){ try { func(); } catch(err) {} triggerNextChain(); };
				delete e.trigger; // remove the 'trigger' property from e's public API, since only used internally
				var fn = function(){
					if (scripts_loading && !ready) waitFunc = wfunc;
					else wfunc();
				};

				if (queueExec && !scripts_loading) onlyQueue(fn);
				else queueAndExecute(fn);
				return e;
			}
		};
		publicAPI.block = publicAPI.wait;	// alias "block" to "wait" -- "block" is now deprecated
		if (queueExec) {
			// if queueing, return a function that the previous chain's waitFunc function can use to trigger this 
			// engine's queue. NOTE: this trigger function is captured and removed from the public chain API before return
			publicAPI.trigger = function() {
				var fn, idx=-1;
				while (fn = exec[++idx]) fn();
				exec = []; 
			};
		}
		return publicAPI;
	}
	function processOpts(opts) {
		var k, newOpts = {}, 
			boolOpts = {"UseCachePreload":"cache","UseLocalXHR":"xhr","UsePreloading":sPRELOAD,"AlwaysPreserveOrder":sPRESERVE,"AllowDuplicates":"dupe"},
			allOpts = {"AppendTo":sWHICH,"BasePath":"base"}
		;
		for (k in boolOpts) allOpts[k] = boolOpts[k];
		newOpts.order = !(!global_defs.order);
		for (k in allOpts) {
			if (allOpts[sHASOWNPROPERTY](k) && global_defs[allOpts[k]] != nNULL) newOpts[allOpts[k]] = (opts[k] != nNULL) ? opts[k] : global_defs[allOpts[k]];
		}
		for (k in boolOpts) { // normalize bool props to actual boolean values if not already
			if (boolOpts[sHASOWNPROPERTY](k)) newOpts[boolOpts[k]] = !(!newOpts[boolOpts[k]]);
		}
		if (!newOpts[sPRELOAD]) newOpts.cache = newOpts.order = newOpts.xhr = bFALSE; // turn off all flags if preloading is disabled
		newOpts.which = (newOpts.which === sHEAD || newOpts.which === sBODY) ? newOpts.which : sHEAD;
		return newOpts;
	}
	
	global.$LAB = {
		setGlobalDefaults:function(gdefs) { // intentionally does not return an "engine" instance -- must call as stand-alone function call on $LAB
			global_defs = processOpts(gdefs);
		},
		setOptions:function(opts){ // set options per chain
			return engine(bFALSE,processOpts(opts));
		},
		script:function(){ // will load one or more scripts
			return engine().script.apply(nNULL,arguments);
		},
		wait:function(){ // will ensure that the chain's previous scripts are executed before execution of scripts in subsequent chain links
			return engine().wait.apply(nNULL,arguments);
		}
	};
	global.$LAB.block = global.$LAB.wait;	// alias "block" to "wait" -- "block" is now deprecated
	
	/* The following "hack" was suggested by Andrea Giammarchi and adapted from: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
	   NOTE: this hack only operates in FF and then only in versions where document.readyState is not present (FF < 3.6?).
	   
	   The hack essentially "patches" the **page** that LABjs is loaded onto so that it has a proper conforming document.readyState, so that if a script which does 
	   proper and safe dom-ready detection is loaded onto a page, after dom-ready has passed, it will still be able to detect this state, by inspecting the now hacked 
	   document.readyState property. The loaded script in question can then immediately trigger any queued code executions that were waiting for the DOM to be ready. 
	   For instance, jQuery > 1.3.2 has been patched to take advantage of document.readyState, which is enabled by this hack. But 1.3.2 and before are **not** safe or 
	   affected by this hack, and should therefore **not** be lazy-loaded by script loader tools such as LABjs.
	*/ 
	(function(addEvent,domLoaded,handler){
		if (oDOC[sREADYSTATE] == nNULL && oDOC[addEvent]){
			oDOC[sREADYSTATE] = "loading";
			oDOC[addEvent](domLoaded,handler = function(){
				oDOC.removeEventListener(domLoaded,handler,bFALSE);
				oDOC[sREADYSTATE] = sCOMPLETE;
			},bFALSE);
		}
	})("addEventListener","DOMContentLoaded");
	
})(window);