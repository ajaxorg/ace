/**
 * @returns {boolean} true if it's a Node.js environment, false otherwise
 */
function isNodeEnvironment() {
    return typeof process !== "undefined";
}

module.exports = {
    isNodeEnvironment
};