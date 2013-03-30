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
    /**
     * These functions are necessary for the settings menu
     * to provide a couple really useful settings.
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
     * Generates a list of set functions for the settings menu
     * @param {object} editor The editor instance
     * @return {array} Returns an array of objects. Each object contains the 
     *  following properties: functionName, parentObj, and parentName.
     */
    function getSetFunctions (editor) {
        var out = [];
        var my = {
            'editor' : editor,
            'session' : editor.session,
            'renderer' : editor.renderer
        };
        var opts = [];

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
     * The menu options property needs to be added to the editor
     *  so that the settings menu can know about options for 
     *  selection elements and track which option is selected.
     */
    function addEditorMenuOptions (editor) {
        editor.menuOptions = {
            "setNewLineMode" : [{
                    "textContent" : "unix",
                    "value" : "unix"
                }, {
                    "textContent" : "windows",
                    "value" : "windows"
                }, {
                    "textContent" : "auto",
                    "value" : "auto"
                }
            ],
            "setTheme" : [{
                    "textContent" : "ambiance",
                    "value" : "ace/theme/ambiance"
                }, {
                    "textContent" : "chaos",
                    "value" : "ace/theme/chaos"
                }, {
                    "textContent" : "chrome",
                    "value" : "ace/theme/chrome"
                }, {
                    "textContent" : "clouds",
                    "value" : "ace/theme/clouds"
                }, {
                    "textContent" : "clouds_midnight",
                    "value" : "ace/theme/clouds_midnight"
                }, {
                    "textContent" : "cobalt",
                    "value" : "ace/theme/cobalt"
                }, {
                    "textContent" : "crimson_editor",
                    "value" : "ace/theme/crimson_editor"
                }, {
                    "textContent" : "dawn",
                    "value" : "ace/theme/dawn"
                }, {
                    "textContent" : "dreamweaver",
                    "value" : "ace/theme/dreamweaver"
                }, {
                    "textContent" : "eclipse",
                    "value" : "ace/theme/eclipse"
                }, {
                    "textContent" : "github",
                    "value" : "ace/theme/github"
                }, {
                    "textContent" : "idle_fingers",
                    "value" : "ace/theme/idle_fingers"
                }, {
                    "textContent" : "kr",
                    "value" : "ace/theme/kr"
                }, {
                    "textContent" : "merbivore",
                    "value" : "ace/theme/merbivore"
                }, {
                    "textContent" : "merbivore_soft",
                    "value" : "ace/theme/merbivore_soft"
                }, {
                    "textContent" : "monokai",
                    "value" : "ace/theme/monokai"
                }, {
                    "textContent" : "mono_industrial",
                    "value" : "ace/theme/mono_industrial"
                }, {
                    "textContent" : "pastel_on_dark",
                    "value" : "ace/theme/pastel_on_dark"
                }, {
                    "textContent" : "solarized_dark",
                    "value" : "ace/theme/solarized_dark"
                }, {
                    "textContent" : "solarized_light",
                    "value" : "ace/theme/solarized_light"
                }, {
                    "textContent" : "textmate",
                    "value" : "ace/theme/textmate"
                }, {
                    "textContent" : "tomorrow",
                    "value" : "ace/theme/tomorrow"
                }, {
                    "textContent" : "tomorrow_night",
                    "value" : "ace/theme/tomorrow_night"
                }, {
                    "textContent" : "tomorrow_night_blue",
                    "value" : "ace/theme/tomorrow_night_blue"
                }, {
                    "textContent" : "tomorrow_night_bright",
                    "value" : "ace/theme/tomorrow_night_bright"
                }, {
                    "textContent" : "tomorrow_night_eighties",
                    "value" : "ace/theme/tomorrow_night_eighties"
                }, {
                    "textContent" : "twilight",
                    "value" : "ace/theme/twilight"
                }, {
                    "textContent" : "vibrant_ink",
                    "value" : "ace/theme/vibrant_ink"
                }, {
                    "textContent" : "xcode",
                    "value" : "ace/theme/xcode"
                }
            ],
            "setMode" : [{
                    "textContent" : "abap",
                    "value" : "ace/mode/abap"
                }, {
                    "textContent" : "asciidoc",
                    "value" : "ace/mode/asciidoc"
                }, {
                    "textContent" : "c9search",
                    "value" : "ace/mode/c9search"
                }, {
                    "textContent" : "clojure",
                    "value" : "ace/mode/clojure"
                }, {
                    "textContent" : "coffee",
                    "value" : "ace/mode/coffee"
                }, {
                    "textContent" : "coldfusion",
                    "value" : "ace/mode/coldfusion"
                }, {
                    "textContent" : "csharp",
                    "value" : "ace/mode/csharp"
                }, {
                    "textContent" : "css",
                    "value" : "ace/mode/css"
                }, {
                    "textContent" : "curly",
                    "value" : "ace/mode/curly"
                }, {
                    "textContent" : "c_cpp",
                    "value" : "ace/mode/c_cpp"
                }, {
                    "textContent" : "dart",
                    "value" : "ace/mode/dart"
                }, {
                    "textContent" : "diff",
                    "value" : "ace/mode/diff"
                }, {
                    "textContent" : "django",
                    "value" : "ace/mode/django"
                }, {
                    "textContent" : "dot",
                    "value" : "ace/mode/dot"
                }, {
                    "textContent" : "ftl",
                    "value" : "ace/mode/ftl"
                }, {
                    "textContent" : "glsl",
                    "value" : "ace/mode/glsl"
                }, {
                    "textContent" : "golang",
                    "value" : "ace/mode/golang"
                }, {
                    "textContent" : "groovy",
                    "value" : "ace/mode/groovy"
                }, {
                    "textContent" : "haml",
                    "value" : "ace/mode/haml"
                }, {
                    "textContent" : "haxe",
                    "value" : "ace/mode/haxe"
                }, {
                    "textContent" : "html",
                    "value" : "ace/mode/html"
                }, {
                    "textContent" : "jade",
                    "value" : "ace/mode/jade"
                }, {
                    "textContent" : "java",
                    "value" : "ace/mode/java"
                }, {
                    "textContent" : "javascript",
                    "value" : "ace/mode/javascript"
                }, {
                    "textContent" : "json",
                    "value" : "ace/mode/json"
                }, {
                    "textContent" : "jsp",
                    "value" : "ace/mode/jsp"
                }, {
                    "textContent" : "jsx",
                    "value" : "ace/mode/jsx"
                }, {
                    "textContent" : "latex",
                    "value" : "ace/mode/latex"
                }, {
                    "textContent" : "less",
                    "value" : "ace/mode/less"
                }, {
                    "textContent" : "liquid",
                    "value" : "ace/mode/liquid"
                }, {
                    "textContent" : "lisp",
                    "value" : "ace/mode/lisp"
                }, {
                    "textContent" : "livescript",
                    "value" : "ace/mode/livescript"
                }, {
                    "textContent" : "logiql",
                    "value" : "ace/mode/logiql"
                }, {
                    "textContent" : "lsl",
                    "value" : "ace/mode/lsl"
                }, {
                    "textContent" : "lua",
                    "value" : "ace/mode/lua"
                }, {
                    "textContent" : "luapage",
                    "value" : "ace/mode/luapage"
                }, {
                    "textContent" : "lucene",
                    "value" : "ace/mode/lucene"
                }, {
                    "textContent" : "makefile",
                    "value" : "ace/mode/makefile"
                }, {
                    "textContent" : "markdown",
                    "value" : "ace/mode/markdown"
                }, {
                    "textContent" : "objectivec",
                    "value" : "ace/mode/objectivec"
                }, {
                    "textContent" : "ocaml",
                    "value" : "ace/mode/ocaml"
                }, {
                    "textContent" : "pascal",
                    "value" : "ace/mode/pascal"
                }, {
                    "textContent" : "perl",
                    "value" : "ace/mode/perl"
                }, {
                    "textContent" : "pgsql",
                    "value" : "ace/mode/pgsql"
                }, {
                    "textContent" : "php",
                    "value" : "ace/mode/php"
                }, {
                    "textContent" : "powershell",
                    "value" : "ace/mode/powershell"
                }, {
                    "textContent" : "python",
                    "value" : "ace/mode/python"
                }, {
                    "textContent" : "r",
                    "value" : "ace/mode/r"
                }, {
                    "textContent" : "rdoc",
                    "value" : "ace/mode/rdoc"
                }, {
                    "textContent" : "rhtml",
                    "value" : "ace/mode/rhtml"
                }, {
                    "textContent" : "ruby",
                    "value" : "ace/mode/ruby"
                }, {
                    "textContent" : "sass",
                    "value" : "ace/mode/sass"
                }, {
                    "textContent" : "scad",
                    "value" : "ace/mode/scad"
                }, {
                    "textContent" : "scala",
                    "value" : "ace/mode/scala"
                }, {
                    "textContent" : "scheme",
                    "value" : "ace/mode/scheme"
                }, {
                    "textContent" : "scss",
                    "value" : "ace/mode/scss"
                }, {
                    "textContent" : "sh",
                    "value" : "ace/mode/sh"
                }, {
                    "textContent" : "sql",
                    "value" : "ace/mode/sql"
                }, {
                    "textContent" : "stylus",
                    "value" : "ace/mode/stylus"
                }, {
                    "textContent" : "svg",
                    "value" : "ace/mode/svg"
                }, {
                    "textContent" : "tcl",
                    "value" : "ace/mode/tcl"
                }, {
                    "textContent" : "tex",
                    "value" : "ace/mode/tex"
                }, {
                    "textContent" : "text",
                    "value" : "ace/mode/text"
                }, {
                    "textContent" : "textile",
                    "value" : "ace/mode/textile"
                }, {
                    "textContent" : "tmsnippet",
                    "value" : "ace/mode/tmsnippet"
                }, {
                    "textContent" : "tm_snippet",
                    "value" : "ace/mode/tm_snippet"
                }, {
                    "textContent" : "toml",
                    "value" : "ace/mode/toml"
                }, {
                    "textContent" : "typescript",
                    "value" : "ace/mode/typescript"
                }, {
                    "textContent" : "vbscript",
                    "value" : "ace/mode/vbscript"
                }, {
                    "textContent" : "xml",
                    "value" : "ace/mode/xml"
                }, {
                    "textContent" : "xquery",
                    "value" : "ace/mode/xquery"
                }, {
                    "textContent" : "yaml",
                    "value" : "ace/mode/yaml"
                }
            ]
        };
    }
    /**
     * This massive thing is comprised mostly of element generation functions
     *  filtering out the 
     */
    function generateMenu (editor) {
        var elements = [];

        function createCheckbox (id, checked, clss) {
            var el = document.createElement('input');
            el.setAttribute('type', 'checkbox');
            el.setAttribute('id', id);
            el.setAttribute('name', id);
            el.setAttribute('value', checked);
            el.setAttribute('class', clss);
            if(checked) {
                el.setAttribute('checked', 'checked');
            }
            return el;
        }
        function createInput (id, value, clss) {
            var el = document.createElement('input');
            el.setAttribute('type', 'text');
            el.setAttribute('id', id);
            el.setAttribute('name', id);
            el.setAttribute('value', value);
            el.setAttribute('class', clss);
            return el;
        }
        function createOption (obj) {
            var attribute;
            var el = document.createElement('option');
            for(attribute in obj) {
                if(el.hasOwnProperty(attribute)) {
                    if(attribute === 'selected') {
                        el.setAttribute(attribute, obj[attribute]);
                    }
                    el[attribute] = obj[attribute];
                }
            }
            return el;
        }
        function createSelection (id, values, clss) {
            var el = document.createElement('select');
            el.setAttribute('id', id);
            el.setAttribute('name', id);
            el.setAttribute('class', clss);
            values.forEach(function (item) {
                el.appendChild(createOption(item));
            });
            return el;
        }
        function createLabel (text, labelFor) {
            var el = document.createElement('label');
            el.setAttribute('for', labelFor);
            el.textContent = text;
            return el;
        }
        // require editor
        function createNewEntry(obj, clss, item, val) {
            var el;
            var div = document.createElement('div');
            div.setAttribute('contains', item);
            div.setAttribute('class', 'menuEntry');

            div.appendChild(createLabel(item, item));

            if(Array.isArray(val)) {
                el = createSelection(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        editor.menuOptions[e.target.id].forEach(function (x) {
                            if(x.textContent !== e.target.textContent) {
                                delete x.selected;
                            }
                        });
                        obj[e.target.id](e.target.value);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else if(typeof val === 'boolean') {
                el = createCheckbox(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        obj[e.target.id](!!e.target.checked);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else {
                el = createInput(item, val, clss);
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

        // require editor, elements
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
        function cleanupElementsList() {
            elements.sort(function (a, b) {
                var x = a.getAttribute('contains');
                var y = b.getAttribute('contains');
                return x.localeCompare(y);
            });
        }
        function showMenu() {
            var topmenu = document.createElement('div');
            elements.forEach(function (element) {
                topmenu.appendChild(element);
            });
            return topmenu;
        }
        getSetFunctions(editor).forEach(function (setObj) {
            handleSet(setObj);
        });
        cleanupElementsList();
        overlayPage(showMenu(), '0', '0', '0', null);
    }
    /**
     * and here is the ugly overlay code again...
     */
    function overlayPage (contentElement, top, right, bottom, left) {
        var div = document.createElement('div');
        var contentContainer = document.createElement('div');
        contentContainer.style.cssText = 'margin: 0px; padding: 0px; border: 0px;' +
            'overflow: auto;';
        contentElement.style.cssText = contentElement.style.cssText + 'overflow: auto;';
        contentContainer.appendChild(contentElement);

        var cl = document.createElement('img');
        if(top) {
            top = 'top: ' + top + ';';
        } else {
            top = '';
        }
        if(right) {
            right = 'right: ' + right + ';';
        } else {
            right = '';
        }
        if(bottom) {
            bottom = 'bottom: ' + bottom + ';';
        } else {
            bottom = '';
        }
        if(left) {
            left = 'left: ' + left + ';';
        } else {
            left = '';
        }

        cl.src = '/famfamfam_silk_icons_v013/icons/cross.png';
        cl.style.cssText = 'margin: 5px 5px 0 0; padding: 0; ' +
            'float: right; width: 25px;';
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
    }
    /**
     * This builds the settings menu and selects
     *  all the options currently in effect.
     */
    module.exports = function (editor) {
        addFunctionsForSettingsMenu(editor);
        addEditorMenuOptions(editor);
        generateMenu(editor);
    };
});