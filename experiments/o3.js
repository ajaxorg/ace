/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

// #ifdef __WITH_O3
/**
 * Helper class that aids in creating and controlling Ajax O3 instances
 *
 * @author      Mike de Boer
 * @version     %I%, %G%
 * @since       2.1
 * @namespace   o3
 * @private
 */

 
(function(global) {
var sId         = "Ajax.org",
    sDefProduct = "O3Stem",
    bAvailable  = null,
    iVersion    = null,
    embedded    = false,
    oO3Count    = 0;
    bEmbed      = false,
    sPlatform   = null,
    oInstMap    = {};

function detect(o) {
    var version;
    var name = o && o.fullname ? o.fullname : "Ajax.org O3";    
    
    if (window.external && window.external.o3) {    
        version = window.external.o3.versionInfo.match(/v([\d]+\.[\d]+)/)[1];        
        embedded = true;
    }
    
    if (!version && navigator.plugins) {
        if (navigator.plugins[name]) 
            version = navigator.plugins[name].description.match(/v([\d]+\.[\d]+)/)[1];
        
        if (!version) {
            for (var i = 0, l1 = navigator.plugins.length; i < l1; ++i) {
                var plugin = navigator.plugins[i];
                for (var j = 0, l2 = plugin.length; j < l2; j++) {
                    if (plugin[j].type.toLowerCase() == "application/" + name.toLowerCase())
                        version = "0.9";
                        break;
                }
                if (version)
                    break;
            }
        }
    }
        
    if (!version && navigator.mimeTypes) {
        // try sniffing the mimeTypes
        for (var i = 0, l = navigator.mimeTypes.length; i < l; ++i) {
            if (navigator.mimeTypes[i].type.toLowerCase() == "application/" + name.toLowerCase())
                version = "0.9";
                break;
        }
    }
    
    if (!version) {
        try {
            var axo = new ActiveXObject(name);
            version = axo.versionInfo.match(/v([\d]+\.[\d]+)/)[1];
        }
        catch (e) {}
    }

    if (version) {
        iVersion   = parseFloat(version);
        bAvailable = true;
    }
    else {
        iVersion   = 0;
        bAvailable = false;
    }
}

function sniff() {
    var sAgent = navigator.userAgent.toLowerCase();
    var is_opera     = sAgent.indexOf("opera") !== -1;
    var is_konqueror = sAgent.indexOf("konqueror") != -1;
    var is_safari    = !is_opera && ((navigator.vendor
            && navigator.vendor.match(/Apple/) ? true : false)
            || sAgent.indexOf("safari") != -1 || is_konqueror);
    var is_ie        = (document.all && !is_opera && !is_safari);
    bEmbed           = !(is_ie && !is_opera);
    
    // OS sniffing:

    // windows...
    if (sAgent.indexOf("win") != -1 || sAgent.indexOf("16bit") != -1) {
        sPlatform = "win";
        if (sAgent.indexOf("win16") != -1
          || sAgent.indexOf("16bit") != -1
          || sAgent.indexOf("windows 3.1") != -1
          || sAgent.indexOf("windows 16-bit") != -1)
            sPlatform += "16";
        else if (sAgent.indexOf("win32") != -1
          || sAgent.indexOf("32bit") != -1)
            sPlatform += "32";
        else if (sAgent.indexOf("win32") != -1
          || sAgent.indexOf("32bit") != -1)
            sPlatform += "64";
    }
    // mac...
    if (sAgent.indexOf("mac") != -1) {
        sPlatform = "mac";
        if (sAgent.indexOf("ppc") != -1 || sAgent.indexOf("powerpc") != -1)
            sPlatform += "ppc";
        else if (sAgent.indexOf("os x") != -1)
            sPlatform += "osx";
    }
    // linux...
    if (sAgent.indexOf("inux") != -1) {
        sPlatform = "linux";
        if (sAgent.indexOf("i686") > -1 || sAgent.indexOf("i386") > -1)
            sPlatform += "32";
        else if (sAgent.indexOf("86_64"))
            sPlatform += "64";
        else if (sAgent.indexOf("arm"))
            sPlatform += "arm";
    }
}

function installerUrl(o) {
    return "http://www.ajax.org/o3/installer" 
        + (sPlatform ? "/platform/" + sPlatform : "")
        + (o.guid    ? "/guid/"     + encodeURIComponent(o.guid) : "");
}

function escapeHtml(s) {
    var c, ret = "";

    if (s == null) return null;

    for (var i = 0, j = s.length; i < j; i++) {
        c = s.charCodeAt(i);
        if (((c > 96) && (c < 123)) || (( c > 64) && (c < 91))
          || ((c > 43) && (c < 58) && (c != 47)) || (c == 95))
            ret = ret + String.fromCharCode(c);
        else
            ret = ret + "&#" + c + ";";
    }
    return ret;
}

function createHtml(options) {
    var out = [];
    if (typeof options.width == "undefined")
        options.width = 0;
    if (typeof options.height == "undefined")
        options.height = 0;

    out.push(bEmbed
        ? '<embed id="' + options.id + '" width="' + options.width 
            + '" height="' + options.height + '" '
        : '<object id="' + options.id + '" width="' + options.width 
            + '" height="' + options.height + '"' + (options.guid 
                ? ' classid="CLSID:' + options.guid + '"' 
                : '') + '>');
    if (options.params) {
        var i, n, v;
        for (i in options.params) {
            if (!options.params[i]) continue;
            n = escapeHtml(i);
            v = escapeHtml(options.params[i]);
            out.push(bEmbed
                ? n + '="' + v + '" '
                : '<param name="' + n + '" value="' + v + '" /> ');
        }
    }
    out.push(bEmbed ? '> </embed>' : '</object>');
        
    return out.join("");
}

function register(o, options) {
    // do some funky registering stuff...
    var key = (options.guid ? options.guid : "ajax.o3")
        + (options.name ? "." + options.name : "");

    if (!oInstMap[key])
        oInstMap[key] = [];
    oInstMap[key].push(o);
}

function get(guid) {
    for (var i in oInstMap) {
        if (i.indexOf(guid) > -1)
            return oInstMap[i][0];
    }

    return null;
}

function destroy(o) {
    if (typeof o == "string") //guid provided
        o = get(o);
    if (!o) return;
    // destroy references and domNode of this/ each plugin instance...
    var i, j, k, inst;
    for (i in oInstMap) {
        inst = oInstMap[i];
        if (!inst.length) continue;
        for (j = inst.length -1; j >= 0; j--) {
            // if we're searching for 'o', check for a match first
            if (o && inst[j] != o) continue;
            for (k in o) {
                if (typeof o[k] == "function")
                    o[k] = null;
            }
            inst[j].parentNode.removeChild(inst[j]);
            inst.splice(j, 1);
        }
    }

    if (!o)
        oInstMap = {};
}

// global API:
global.o3 = {
    isAvailable: function(o) {     
        if (bAvailable === null)
            detect(o);

        return bAvailable && ((o && o.version) ? iVersion === o.version : true);
    },

    getVersion: function() {
        if (iVersion === null)
            detect();

        return iVersion;
    },

    create: function(guid, options) {
        if (!options && typeof guid == "object") {
            options      = guid;
            options.guid = false;
        }
        else {
            options      = options || {};
            options.guid = guid || false;
        }
        if (!options["fullname"]) {
            options.fullname = (options.product || sDefProduct) 
                + (options.guid ? "-" + options.guid : "")
        }
                    
        // mini-browser sniffing:
        sniff();                        
        
        if (!this.isAvailable(options)) {
            var sUrl = installerUrl(options);
            return typeof options["oninstallprompt"] == "function"
                ? options.oninstallprompt(sUrl)
                : window.open(sUrl, "_blank");
        }                
        
        if (typeof options["params"] == "undefined")
            options.params = {};
        if (typeof options.params["type"] == "undefined")
            options.params.type = "application/" + (options.fullname || "o3-XXXXXXXX");

        options.id = sId + (options.name ? options.name : "");

        var oO3;
        if (!embedded) {
            (options["parent"] || document.body).appendChild(
              document.createElement("div")).innerHTML = createHtml(options);        
              
            oO3 = document.getElementById(options.id);
        } else {
            oO3 = window.external.o3;            
        }
       
            if (oO3) {
                register(oO3, options);
                if (typeof options["onready"] == "function")
                    options.onready(oO3);
                
                return oO3;            
            }
        
        
        return false;
    },

    destroy: destroy,

    get: get
};

})(this);

// #endif