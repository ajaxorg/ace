define(function (require, exports, module) {
    "use strict";
    
    var mode = 'javascript'; // TODO: add html
    
    console.warn('TODO: fix the way this is loaded....');
    var ternWorkerPath = '../lib/ace/tern/worker-tern.js';
    
    // console.warn('ENTERED');
    //LEFT OFF: need to get this thing to load worker properly
    //in the mean time, tern.html has reference to
    //var config = require("ace/config");
    //console.log('config',config);

    //instead of using worker file.... separate into different files for worker...
    // var workerTern = require("ace/tern/worker-tern");
    // console.log('workerTern',workerTern);
    

    //create editor
    var ace = require("ace/ace");
    var useWebWorker = location.href.indexOf("noworker") === -1;
    // useWebWorker = false;//REMOVE WHEN DONE FIXING WORKER
    
    var editor = ace.edit("editor");
    document.getElementById('editor').style.display = '';
    
    window.editor = editor;
    console.info('globals: \n \teditor');
    
    editor.session.setMode("ace/mode/" + mode);
    editor.getSession().setUseWorker(useWebWorker);

    //some defaults i prefer
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setWrapLimitRange(null, null);
    editor.setShowPrintMargin(false);

    var ternManager = require("ace/tern/tern_manager");
    console.log('ternManager', ternManager);

    editor.setOptions({
        /**
         * Either `true` or `false` or to enable with custom options pass object that
         * has options for tern server: http://ternjs.net/doc/manual.html#server_api
         * If `true`, then default options will be used
         */
        enableTern: {
            //path to worker.. should be automatic.. but having to override until I figure out how to fix this
            workerScript: ternWorkerPath,
            /* http://ternjs.net/doc/manual.html#option_defs */
            defs: ['browser', 'ecma5'],
            /* http://ternjs.net/doc/manual.html#plugins */
            plugins: {
                doc_comment: {
                    fullDocs: true
                }
            },
            /**
             * (default is true) If web worker is used for tern server.
             * This is recommended as it offers better performance, but prevents this from working in a local html file due to browser security restrictions
             */
            useWorker: useWebWorker,
            /* if your editor supports switching between different files (such as tabbed interface) then tern can do this when jump to defnition of function in another file is called, but you must tell tern what to execute in order to jump to the specified file */
            switchToDoc: function (name, start) {
                console.log('switchToDoc called but not defined. name=' + name + '; start=', start);
            },
            /**
             * if passed, this function will be called once ternServer is started.
             * This is needed when useWorker=false because the tern source files are loaded asynchronously before the server is started.
             */
            startedCb: function () {
                //once tern is enabled, it can be accessed via editor.ternServer
                console.log('editor.ternServer:', editor.ternServer);
            },
        },
        /**
         * when using tern, it takes over Ace's built in snippets support.
         * this setting affects all modes when using tern, not just javascript.
         */
        enableSnippets: true,
        /**
         * when using tern, Ace's basic text auto completion is enabled still by deafult.
         * This settings affects all modes when using tern, not just javascript.
         * For javascript mode the basic auto completion will be added to completion results if tern fails to find completions or if you double tab the hotkey for get completion (default is ctrl+space, so hit ctrl+space twice rapidly to include basic text completions in the result)
         */
        enableBasicAutocompletion: true,
    });

});
