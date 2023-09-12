"use strict";
const config = require("./config");

const TokenizerInternal = require("./tokenizer_internal").TokenizerInternal;
TokenizerInternal.prototype.reportError = config.reportError;
exports.Tokenizer = TokenizerInternal;
