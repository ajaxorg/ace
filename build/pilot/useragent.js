define(function(b, a) {
  b = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  var c = navigator.userAgent;
  a.isWin = b == "win";
  a.isMac = b == "mac";
  a.isLinux = b == "linux";
  a.isIE = !+"\u000b1";
  a.isGecko = a.isMozilla = window.controllers && window.navigator.product === "Gecko";
  a.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";
  a.isWebKit = parseFloat(c.split("WebKit/")[1]) || undefined;
  a.isAIR = c.indexOf("AdobeAIR") >= 0;
  a.OS = {LINUX:"LINUX", MAC:"MAC", WINDOWS:"WINDOWS"};
  a.getOS = function() {
    return a.isMac ? a.OS.MAC : a.isLinux ? a.OS.LINUX : a.OS.WINDOWS
  }
});