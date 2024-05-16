
exports.reportError = function reportError(msg, data) {
    var e = new Error(msg);
    e["data"] = data;
    if (typeof console == "object" && console.error)
        console.error(e);
    setTimeout(function() { throw e; });
};
