/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
define(function(require, exports, module) {

var Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);

    this.$breakpoints = [];
    this.$decorations = [];
};

(function() {

    this.addGutterDecoration = function(row, className){
        if (!this.$decorations[row]) 
            this.$decorations[row] = "";
        this.$decorations[row] += " ace_" + className;
    }
    
    this.removeGutterDecoration = function(row, className){
        this.$decorations[row] = 
            this.$decorations[row].replace(" ace_" + className, "");
    }

    this.setBreakpoints = function(rows) {
        this.$breakpoints = rows.concat();
    };

    this.update = function(config) {
        this.$config = config;

        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            html.push("<div class='ace_gutter-cell",
                this.$decorations[i] || "",
                this.$breakpoints[i] ? " ace_breakpoint" : "",
                "' style='height:", config.lineHeight, "px;'>", (i+1), "</div>");
            html.push("</div>");
        }

        this.element.innerHTML = html.join("");
        this.element.style.height = config.minHeight + "px";
    };

}).call(Gutter.prototype);

return Gutter;
});
