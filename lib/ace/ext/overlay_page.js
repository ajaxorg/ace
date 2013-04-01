/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    require
*/

/**
 * Overlay Page
 * @fileOverview Overlay Page <br />
 * Generates an overlay for displaying menus. The overlay is an absolutely
 *  positioned div.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */

define(function(require, exports, module) {
'use strict';

/**
 * Generates an overlay for displaying menus. The overlay is an absolutely
 *  positioned div.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {DOMElement} contentElement Any element which may be presented inside
 *  a div.
 * @param {string|number} top absolute position value.
 * @param {string|number} right absolute position value.
 * @param {string|number} bottom absolute position value.
 * @param {string|number} left absolute position value.
 */
module.exports.overlayPage = function overlayPage (contentElement, top, right, bottom, left) {
    top = (top) ? 'top: ' + top + ';' : '';
    bottom = (bottom) ? 'bottom: ' + bottom + ';' : '';
    right = (right) ? 'right: ' + right + ';' : '';
    left = (left) ? 'left: ' + left + ';' : '';
    
    var closer = document.createElement('div');
    var contentContainer = document.createElement('div');
    
    closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; ' +
        'background-color: rgba(0, 0, 0, 0.2);';
    closer.addEventListener('click', function () {
        closer.parentNode.removeChild(closer);
        closer = null;
    });
    
    contentContainer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: absolute;' +
        top + right + bottom + left +
        'z-index: 9991; ' +
        'box-shadow: rgba(126, 126, 126, 0.25) -20px 10px 25px; ' +
        'background-color: rgba(255, 255, 255, 0.6);' +
        'color: black; overflow: auto;';
    contentContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });
    
    contentContainer.appendChild(contentElement);
    closer.appendChild(contentContainer);
    document.body.appendChild(closer);
};

});