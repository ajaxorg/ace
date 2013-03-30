/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    getComputedStyle
*/
define(function(require, exports, module) {
    "use strict";
    // this function makes an ugly div to display the contentElement
    var overlayPage = function (contentElement, top, right, bottom, left) {
        "use strict";
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

        cl.addEventListener('click', function (e) {
            div.parentNode.removeChild(div);
            div = null;
        });
    };

    // this function grabs all of the editor commands that have keyboard shortcuts
    function aceGetKeybordShortcuts (editor) {
        "use strict";
        var commands = editor.commands.byName;
        var commandName;
        var key;
        var platform = editor.commands.platform;
        var kb = [];
        for (commandName in commands) {
            try {
                key = commands[commandName].bindKey[platform];
                if (key) {
                   kb.push({
                        'command' : commandName,
                        'key' : key
                   });
                }
            } catch (e) {
                // errors on properties without bindKey we don't want them
                // so the errors don't need handling.
            }
        }
        return kb;
    }

    // this function takes the keyboard shortcuts array and 
    // runs it through some template.
    module.exports = function (editor) {
        var kb = aceGetKeybordShortcuts(editor);
        var el = document.createElement('div');
        // untested. something like this could . . . 
        // var template = '<h1>Keyboard Shortcuts</h1><div>' +
        //     {{#kb}}
        //         {{{command}}} : {{{key}}}
        //     {{/kb}}
        //     '</div>';
        // mustache.render({'kb' : kb}, template);

        el.innerHTML = '<h1>Keyboard Shortcuts</h1><div>' +
            JSON.stringify(kb, null, '    ') +
            '</div>';
        el.style.cssText = 'margin:0; padding:0; ' +
            'background-color:white; color:black; ' +
            'white-space: pre-wrap;';
        overlayPage(el, '0', '0', '0', null);
    }
});