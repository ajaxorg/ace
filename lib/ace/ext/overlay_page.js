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
    var div = document.createElement('div');
    var contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'margin: 0px; padding: 0px; border: 0px;' +
        'overflow: auto;';
    contentElement.style.cssText = contentElement.style.cssText + 'overflow: auto;';
    contentContainer.appendChild(contentElement);

    var cl = document.createElement('img');
    if (top) {
        top = 'top: ' + top + ';';
    } else {
        top = '';
    }
    if (right) {
        right = 'right: ' + right + ';';
    } else {
        right = '';
    }
    if (bottom) {
        bottom = 'bottom: ' + bottom + ';';
    } else {
        bottom = '';
    }
    if (left) {
        left = 'left: ' + left + ';';
    } else {
        left = '';
    }

    cl.src = '/BigRedX.png';
    cl.style.cssText = 'margin: 5px 5px 0 0; padding: 0; ' +
        'float: right; width: 25px; height: 25px; border: 1px solid black;';
    div.style.cssText = 'margin:0; padding:0; position: absolute;' +
        top + right + bottom + left +
        'z-index:9999; background-color:white; color:black; overflow: auto;';

    div.appendChild(cl);
    div.appendChild(contentContainer);
    document.body.appendChild(div);

    cl.addEventListener('click', function () {
        div.parentNode.removeChild(div);
        div = null;
    });
};

});