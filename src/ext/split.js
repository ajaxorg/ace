/**
 * ## Split editor container extension for multiple editor instances
 *
 * Provides functionality to create and manage multiple editor instances within a single container,
 * arranged either horizontally (beside) or vertically (below). Enables synchronized editing sessions
 * with shared configurations while maintaining independent cursor positions and selections.
 *
 * **Usage:**
 * ```javascript
 * var Split = require("ace/ext/split").Split;
 * var split = new Split(container, theme, numberOfSplits);
 * split.setOrientation(split.BESIDE); // or split.BELOW
 * ```
 *
 * @experimental
 * @module
 */

"use strict";

/**
 * this is experimental, and subject to change, use at your own risk!
 */
module.exports = require("../split");
