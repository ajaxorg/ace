/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    require,
    getComputedStyle
*/

/**
 * Show Settings Menu
 * @fileOverview Show Settings Menu <br />
 * Displays an interactive settings menu mostly generated on the fly based on
 *  the current state of the editor.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */

define(function(require, exports, module) {
    "use strict";
    var overlayPage = require('./overlay_page').overlayPage;
    var addEditorMenuOptions = require('./add_editor_menu_options').addEditorMenuOptions;
    
    /**
     * These functions are necessary for the settings menu
     * to provide a couple really useful settings.
     * @author <a href="mailto:matthewkastor@gmail.com">
     *  Matthew Christopher Kastor-Inare III </a><br />
     *  ☭ Hial Atropa!! ☭
     * @param {ace.Editor} editor An instance of the ace editor.
     */
    function addFunctionsForSettingsMenu (editor) {
        // when building the settings menu matching get and set functions
        // must be found or the function will be ignored

        editor.getFontSize = function () {
            return getComputedStyle(
                editor.container).getPropertyValue('font-size');
        };

        // this allows the settings menu to supply a wrap limit
        // using a text input field easily
        editor.session.setWrapLimit = function (limit) {
            editor.session.setWrapLimitRange(limit, limit);
        };
    }
    /**
     * Generates a list of set functions for the settings menu.
     * @author <a href="mailto:matthewkastor@gmail.com">
     *  Matthew Christopher Kastor-Inare III </a><br />
     *  ☭ Hial Atropa!! ☭
     * @param {object} editor The editor instance
     * @return {array} Returns an array of objects. Each object contains the 
     *  following properties: functionName, parentObj, and parentName. The
     *  function name will be the name of a method beginning with the string
     *  `set` which was found. The parent object will be a reference to the
     *  object having the method matching the function name. The parent name
     *  will be a string representing the identifier of the parent object e.g.
     *  `editor`, `session`, or `renderer`.
     */
    function getSetFunctions (editor) {
        /**
         * Output array. Will hold the objects described above.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        var out = [];
        /**
         * This object provides a map between the objects which will be
         *  traversed and the parent name which will appear in the output.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        var my = {
            'editor' : editor,
            'session' : editor.session,
            'renderer' : editor.renderer
        };
        /**
         * This array will hold the set function names which have already been
         *  found so that they are not added to the output multiple times.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        var opts = [];
        /**
         * This is a list of set functions which will not appear in the settings
         *  menu. I don't know what to do with setKeyboardHandler. When I tried
         *  to use it, it didn't appear to be working. Someone who knows better
         *  could remove it from this list and add it's options to
         *  add_editor_menu_options.js
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        var skip = [
            'setOption',
            'setUndoManager',
            'setDocument',
            'setValue',
            'setBreakpoints',
            'setScrollTop',
            'setScrollLeft',
            'setSelectionStyle',
            'setWrapLimitRange',
            'setKeyboardHandler'
        ];
        
        
        /**
         * This will search the objects mapped to the `my` variable above. When
         *  it finds a set function in the object that is not listed in the
         *  `skip` list or the `opts` list it will push a new object to the
         *  output array.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        [
            'renderer',
            'session',
            'editor'
        ].forEach(function (esra) {
            var fn;
            var esr = my[esra];
            var clss = esra;
            for(fn in esr) {
                if(skip.indexOf(fn) === -1) {
                    if(/^set/.test(fn) && opts.indexOf(fn) === -1) {
                        // found set function
                        opts.push(fn);
                        out.push({
                            'functionName' : fn,
                            'parentObj' : esr,
                            'parentName' : clss
                        });
                    }
                }
            }
        });
        return out;
    }
    /**
     * Generates an interactive menu with settings useful to end users.
     * @author <a href="mailto:matthewkastor@gmail.com">
     *  Matthew Christopher Kastor-Inare III </a><br />
     *  ☭ Hial Atropa!! ☭
     * @param {ace.Editor} editor An instance of the ace editor.
     */
    function generateMenu (editor) {
        /**
         * container for dom elements that will go in the menu.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        var elements = [];
        /**
         * Sorts the menu entries (elements var) so they'll appear in alphabetical order
         *  the sort is performed based on the value of the contains property
         *  of each element. Since this is an `array.sort` the array is sorted
         *  in place.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        function cleanupElementsList() {
            elements.sort(function (a, b) {
                var x = a.getAttribute('contains');
                var y = b.getAttribute('contains');
                return x.localeCompare(y);
            });
        }
        /**
         * Wraps all dom elements contained in the elements var with a single
         *  div.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         */
        function wrapElements() {
            var topmenu = document.createElement('div');
            elements.forEach(function (element) {
                topmenu.appendChild(element);
            });
            return topmenu;
        }
        
        /**
         * Creates a new menu entry.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         * @param {object} obj This is a reference to the object containing the
         *  set function. It is used to set up event listeners for when the
         *  menu options change.
         * @param {string} clss Maps to the class of the dom element. This is
         *  the name of the object containing the set function e.g. `editor`,
         *  `session`, `renderer`.
         * @param {string} item Maps to the id of the dom element. This is the
         *  set function name.
         * @param {mixed} val This is the value of the setting. It is mapped to
         *  the dom element's value, checked, or selected option accordingly.
         */
        function createNewEntry(obj, clss, item, val) {
            var egen = require('./element_generator');
            var el;
            var div = document.createElement('div');
            div.setAttribute('contains', item);
            div.setAttribute('class', 'menuEntry');

            div.appendChild(egen.createLabel(item, item));

            if(Array.isArray(val)) {
                el = egen.createSelection(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        editor.menuOptions[e.target.id].forEach(function (x) {
                            if(x.textContent !== e.target.textContent) {
                                delete x.selected;
                            }
                        });
                        // editor.session['setMode']('ace/mode/javascript')
                        obj[e.target.id](e.target.value);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else if(typeof val === 'boolean') {
                el = egen.createCheckbox(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        // renderer['setHighlightGutterLine'](true);
                        obj[e.target.id](!!e.target.checked);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else {
                // this aids in giving the ability to specify settings through
                // post and get requests.
                // /ace_editor.html?setMode=ace/mode/html&setOverwrite=true
                el = egen.createInput(item, val, clss);
                el.addEventListener('blur', function (e) {
                    try{
                        if(e.target.value === 'true') {
                            obj[e.target.id](true);
                        } else if(e.target.value === 'false') {
                            obj[e.target.id](false);
                        } else {
                            obj[e.target.id](e.target.value);
                        }
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            }
            div.appendChild(el);
            return div;
        }
        /**
         * Generates selection fields for the menu and populates their options
         *  using information from `editor.menuOptions`
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         * @param {string} item The set function name.
         * @param {object} esr A reference to the object having the set function.
         * @param {string} clss The name of the object containing the set function.
         * @param {string} fn The matching get function's function name.
         * @returns {DOMElement} Returns a dom element containing a selection
         *  element populated with options. The option whose value matches that
         *  returned from `esr[fn]()` will be selected.
         */
        function makeDropdown(item, esr, clss, fn) {
            var val = editor.menuOptions[item];
            val = val.map(function (valuex) {
                if(valuex.value === esr[fn]()) {
                    valuex.selected = 'selected';
                } else if(valuex.value === esr.$modeId) {
                    // is mode
                    valuex.selected = 'selected';
                }
                return valuex;
            });
            return createNewEntry(esr, clss, item, val);
        }

        /**
         * Processes the set functions returned from `getSetFunctions`. First it
         *  checks for menu options defined in `editor.menuOptons`. If no
         *  options are specified then it checks whether there is a get function
         *  (replace set with get) for the setting. When either of those
         *  conditions are met it will attempt to create a new entry for the
         *  settings menu and push it into the elements array defined above.
         *  It can only do so for get functions which return
         *  strings, numbers, and booleans. A special case is written in for
         *  `getMode` where it looks at the returned objects `$id` property and
         *  forwards that through instead. Other special cases could be written
         *  in but that would get a bit ridiculous.
         * @author <a href="mailto:matthewkastor@gmail.com">
         *  Matthew Christopher Kastor-Inare III </a><br />
         *  ☭ Hial Atropa!! ☭
         * @param {object} setObj An item from the array returned by
         *  `getSetFunctions`.
         */
        function handleSet (setObj) {
            var item = setObj.functionName;
            var esr = setObj.parentObj;
            var clss = setObj.parentName;
            var val;
            var fn = item.replace(/^set/, 'get');
            if(editor.menuOptions[item] !== undefined) {
                // has options for select element
                elements.push(makeDropdown(item, esr, clss, fn));
            } else if(typeof esr[fn] === 'function') {
                // has get function
                try {
                    val = esr[fn]();
                    if(typeof val === 'object') {
                        // setMode takes a string, getMode returns an object
                        // the $id property of that object is the string
                        // which may be given to setMode...
                        val = val.$id;
                    }
                    // the rest of the get functions return strings,
                    // booleans, or numbers.
                    elements.push(
                        createNewEntry(esr, clss, item, val)
                    );
                } catch (e) {
                    // if there are errors it is because the element
                    // does not belong in the settings menu
                }
            }
        }
        
        // gather the set functions
        getSetFunctions(editor).forEach(function (setObj) {
            // populate the elements array with good stuff.
            handleSet(setObj);
        });
        // sort the menu entries in the elements list so people can find
        // the settings in alphabetical order.
        cleanupElementsList();
        // dump the entries from the elements list and wrap them up in a div
        // then put the div into the generic menu and show it.
        overlayPage(wrapElements(), '0', '0', '0', null);
    }
    /**
     * This builds the settings menu and selects
     *  all the options currently in effect.
     * @author <a href="mailto:matthewkastor@gmail.com">
     *  Matthew Christopher Kastor-Inare III </a><br />
     *  ☭ Hial Atropa!! ☭
     * @param {ace.Editor} editor An instance of the ace editor.
     */
    module.exports = function (editor) {
        addFunctionsForSettingsMenu(editor);
        addEditorMenuOptions(editor);
        generateMenu(editor);
    };
});