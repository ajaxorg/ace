"use strict";
const config = require("./config");

const Tokenizer = require("./tokenizer_internal").Tokenizer;
Tokenizer.prototype.reportError = config.reportError;
exports.Tokenizer = Tokenizer;
