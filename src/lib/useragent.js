"use strict";

/*
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: "LINUX",
    MAC: "MAC",
    WINDOWS: "WINDOWS"
};

/*
 * Return an exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS.MAC;
    } else if (exports.isLinux) {
        return exports.OS.LINUX;
    } else {
        return exports.OS.WINDOWS;
    }
};

// this can be called in non browser environments (e.g. from ace/requirejs/text)
var _navigator = typeof navigator == "object" ? navigator : {};

var os = (/mac|win|linux/i.exec(_navigator.platform) || ["other"])[0].toLowerCase();
var ua = _navigator.userAgent || "";
var appName = _navigator.appName || "";

// Is the user using a browser that identifies itself as Windows
exports.isWin = (os == "win");

// Is the user using a browser that identifies itself as Mac OS
exports.isMac = (os == "mac");

// Is the user using a browser that identifies itself as Linux
exports.isLinux = (os == "linux");

// Windows Store JavaScript apps (aka Metro apps written in HTML5 and JavaScript) do not use the "Microsoft Internet Explorer" string in their user agent, but "MSAppHost" instead.
exports.isIE = 
    (appName == "Microsoft Internet Explorer" || appName.indexOf("MSAppHost") >= 0)
    ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1])
    : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]); // for ie
    
exports.isOldIE = exports.isIE && exports.isIE < 9;

// Is this Firefox or related?
exports.isGecko = exports.isMozilla = ua.match(/ Gecko\/\d+/);

// Is this Opera 
// @ts-expect-error
exports.isOpera = typeof opera == "object" && Object.prototype.toString.call(window["opera"]) == "[object Opera]";

// Is the user using a browser that identifies itself as WebKit 
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

exports.isSafari = parseFloat(ua.split(" Safari/")[1]) && !exports.isChrome || undefined;

exports.isEdge = parseFloat(ua.split(" Edge/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isAndroid = ua.indexOf("Android") >= 0;

exports.isChromeOS = ua.indexOf(" CrOS ") >= 0;

exports.isIOS = /iPad|iPhone|iPod/.test(ua) && !window["MSStream"];

if (exports.isIOS) exports.isMac = true;

exports.isMobile = exports.isIOS || exports.isAndroid;
