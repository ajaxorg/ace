#!/usr/bin/env node
/* ***** BEGIN LICENSE BLOCK *****
 * Ace is distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *    This product includes software developed by the Ajax.org B.V.
 * 4. Neither the name of the Ajax.org B.V. nor the
 *    names of its contributors may be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY AJAX.ORG B.V. ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
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

var buildAce = require("./Makefile.dryice").buildAce;
var fs = require("fs");

var ACE_HOME = __dirname;

function getVersion(path) {
    if (fs.existsSync(path + "/.git-ref"))
        return fs.readFileSync(path + "/.git-ref", "utf8");
    if (fs.existsSync(path + "/.git/ORIG_HEAD"))
        return fs.readFileSync(path + "/.git/ORIG_HEAD", "utf8");
    if (fs.existsSync(path + "/.sourcemint/source.json")) {
        var json = fs.readFileSync(path + "/.sourcemint/source.json", "utf8");
        return JSON.parse(json).url.split("/").pop();
    }
}

if (process.argv.indexOf("-c") > 0) try {
    var version = getVersion(ACE_HOME);
    var oldVersion = getVersion(ACE_HOME + "/build");
    if (version && oldVersion == version) {
        console.log("ace build is up to date");
        process.exit(0);
    }
    fs.writeFileSync(ACE_HOME + "/build/.git-ref", version, "utf8");
} catch (e) {}

try {
    buildAce({
        compress: false,
        noconflict: false,
        suffix: "",
        name: "ace"
    });

} catch (err) {
	console.error("--- Ace Build error ---");
	console.error(err.stack);
	process.exit(1);
}