// fLAB.js (file:// protocol adapter for LABjs 1.0+)
// v0.2 (c) Kyle Simpson
// MIT License

(function(global){
	var orig_$LAB = global.$LAB,
		oDOC = global.document,
		oDOCLOC = oDOC.location,
		local_filesystem = (oDOCLOC.protocol === "file:")
	;
	if (!orig_$LAB || !local_filesystem) return; // only adapt LABjs with fLABjs wrapper if LABjs exists and we're currently in local filesystem
	
	var sUNDEF = "undefined",				// constants used for compression optimization
		sSTRING = "string",
		sHEAD = "head",
		sBODY = "body",
		sFUNCTION = "function",
		sSCRIPT = "script",
		sSRCURI = "srcuri",
		sDONE = "done",
		sWHICH = "which",
		bTRUE = true,
		bFALSE = false,
		fSETTIMEOUT = global.setTimeout,
		fGETELEMENTSBYTAGNAME = function(tn){return oDOC.getElementsByTagName(tn);},
		fOBJTOSTRING = Object.prototype.toString,
		fNOOP = function(){},
		append_to = {},
		all_scripts = {},
		PAGEROOT = /^[^?#]*\//.exec(oDOCLOC.href)[0],
		DOCROOT = /^file:\/\/(localhost)?(\/[a-z]:)?/i.exec(PAGEROOT)[0],
		docScripts = fGETELEMENTSBYTAGNAME(sSCRIPT),
		
		is_ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
		sync_script_loading = is_ie, // only IE is currently known to do synchronous loading of file:// scripts, others require core LABjs async functionality

		global_defs = {
			dupe:bFALSE, // allow duplicate scripts?
			preserve:bFALSE, // preserve execution order of all loaded scripts (regardless of preloading)
			base:"", // base path to prepend to all non-absolute-path scripts
			which:sHEAD // which DOM object ("head" or "body") to append scripts to
		}
	;
	
	append_to[sHEAD] = fGETELEMENTSBYTAGNAME(sHEAD);
	append_to[sBODY] = fGETELEMENTSBYTAGNAME(sBODY);
	
	function canonicalScriptURI(src,base_path) {
		if (typeof src !== sSTRING) src = "";
		if (typeof base_path !== sSTRING) base_path = "";
		var ret = (/^file\:\/\//.test(src) ? "" : base_path) + src;
		return ((/^file\:\/\//.test(ret) ? "" : (ret.charAt(0) === "/" ? DOCROOT : PAGEROOT)) + ret);
	}
	function scriptTagExists(uri) { // checks if a script uri has ever been loaded into this page's DOM
		var i = 0, script;
		while (script = docScripts[i++]) {
			if (typeof script.src === sSTRING && uri === canonicalScriptURI(script.src)) return bTRUE;
		}
		return bFALSE;
	}
	function engine(opts) {
		if (typeof opts === sUNDEF) opts = global_defs;
		
		var ready = bFALSE,
			_which = opts.which,
			_base_path = opts.base,
			waitFunc = fNOOP,
			scripts_loading = bFALSE,
			publicAPI,
			scripts = {},
			orig_engine = null
		;
		
		function createScriptTag(scriptentry,src,type,charset) {
			if (append_to[scriptentry[sWHICH]][0] === null) { // append_to object not yet ready
				fSETTIMEOUT(arguments.callee,25); 
				return;
			}
			var scriptElem = oDOC.createElement(sSCRIPT), fSETATTRIBUTE = function(attr,val){scriptElem.setAttribute(attr,val);};
			fSETATTRIBUTE("type",type);
			if (typeof charset === sSTRING) fSETATTRIBUTE("charset",charset);
			fSETATTRIBUTE("src",src);
			append_to[scriptentry[sWHICH]][0].appendChild(scriptElem);
		}
		function loadScript(o) {
			if (typeof o.allowDup === sUNDEF) o.allowDup = opts.dupe;
			var src = o.src, type = o.type, charset = o.charset, allowDup = o.allowDup, 
				src_uri = canonicalScriptURI(src,_base_path), scriptentry;
			if (typeof type !== sSTRING) type = "text/javascript";
			if (typeof charset !== sSTRING) charset = null;
			allowDup = !(!allowDup);
						
			if (!allowDup && 
				(
					(typeof all_scripts[src_uri] !== sUNDEF && all_scripts[src_uri] !== null) || 
					scriptTagExists(src_uri)
				)
			) {
				return;
			}
			if (typeof scripts[src_uri] === sUNDEF) scripts[src_uri] = {};
			scriptentry = scripts[src_uri];
			if (typeof scriptentry[sWHICH] === sUNDEF) scriptentry[sWHICH] = _which;
			scriptentry[sDONE] = bFALSE;
			scriptentry[sSRCURI] = src_uri;
			scripts_loading = bTRUE;
			
			all_scripts[scriptentry[sSRCURI]] = bTRUE;
			createScriptTag(scriptentry,src_uri,type,charset);
		}
		function serializeArgs(args) {
			var sargs = [], i;
			for (i=0; i<args.length; i++) {
				if (fOBJTOSTRING.call(args[i]) === "[object Array]") sargs = sargs.concat(serializeArgs(args[i]));
				else sargs[sargs.length] = args[i];
			}
			return sargs;
		}
				
		publicAPI = {
			script:function() {
				var args = serializeArgs(arguments), use_engine, i;
				for (i=0; i<args.length; i++) {
					if (typeof args[i] === sSTRING) args[i] = {src:canonicalScriptURI(args[i])};
					else if (typeof args[i].src !== sUNDEF) args[i].src = canonicalScriptURI(args[i].src);
				}
				
				if (sync_script_loading) { // handle without core LABjs since we're sync loading
					use_engine = publicAPI;
					for (i=0; i<args.length; i++) loadScript(args[i]);
				}
				else { // pass off to core LABjs to handle async loading
					if (orig_engine === null) orig_engine = orig_$LAB.setOptions(opts.pubMap);
					use_engine = orig_engine = orig_engine.script.apply(null,args);
				}
				return use_engine;
			},
			wait:function(func) {
				var use_engine;
				if (typeof func !== sFUNCTION) func = fNOOP;
				if (sync_script_loading) { // execute immediately since we're sync loading
					use_engine = publicAPI;
					fSETTIMEOUT(func,0);
				}
				else { // pass off to core LABjs to handle since we're async loading
					if (orig_engine === null) orig_engine = orig_$LAB.setOptions(opts.pubMap);
					use_engine = orig_engine = orig_engine.wait(func);
				}
				return use_engine;
			}
		};
		publicAPI.block = publicAPI.wait;	// alias "block" to "wait" -- "block" is now deprecated
		return publicAPI;
	}
	function processOpts(opts) {
		var k, newOpts = {}, 
			boolOpts = {"AlwaysPreserveOrder":"preserve","AllowDuplicates":"dupe"},
			allOpts = {"AppendTo":"which","BasePath":"base"}
		;
		for (k in boolOpts) allOpts[k] = boolOpts[k];
		for (k in allOpts) {
			if (allOpts.hasOwnProperty(k) && typeof global_defs[allOpts[k]] !== sUNDEF) newOpts[allOpts[k]] = (typeof opts[k] !== sUNDEF) ? opts[k] : global_defs[allOpts[k]];
		}
		for (k in boolOpts) { // normalize bool props to actual boolean values if not already
			if (boolOpts.hasOwnProperty(k)) newOpts[boolOpts[k]] = !(!newOpts[boolOpts[k]]);
		}
		newOpts.preload = newOpts.cache = newOpts.order = newOpts.xhr = bFALSE; // don't use any preloading techniques if working in file:///
		newOpts.which = (newOpts.which === sHEAD || newOpts.which === sBODY) ? newOpts.which : sHEAD;
		newOpts.pubMap = {};
		for (k in allOpts) {
			if (allOpts.hasOwnProperty(k)) newOpts.pubMap[k] = newOpts[allOpts[k]]; // create a hash of reverse mappings back to the public names, suitable to pass along to orig_$LAB.setOptions()
		}
		return newOpts;
	}
	
	global.$LAB = {
		setGlobalDefaults:function(gdefs) { // intentionally does not return an "engine" instance -- must call as stand-alone function call on $LAB
			global_defs = processOpts(gdefs);
		},
		setOptions:function(opts){ // set options per chain
			return engine(processOpts(opts));
		},
		script:function(){ // will load one or more scripts
			return engine().script.apply(null,arguments);
		},
		wait:function(){ // will ensure that the chain's previous scripts are executed before execution of scripts in subsequent chain links
			return engine().wait.apply(null,arguments);
		}
	};
	global.$LAB.block = global.$LAB.wait;	// alias "block" to "wait" -- "block" is now deprecated
})(window);