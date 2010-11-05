{
    baseUrl: "./lib",
    dir: "build",

    //- "closure": uses Google's Closure Compiler in simple optimization
    //mode to minify the code.
    //- "closure.keepLines": Same as closure option, but keeps line returns
    //in the minified files.
    //- "none": no minification will be done.
    optimize: "closure.keepLines",
    inlineText: true,
    useStrict: false,

    pragmas: {
        jquery: false,
        requireExcludeModify: true,
        requireExcludePlugin: false,
        requireExcludePageLoad: false
    },

    skipPragmas: false,
    execModules: false,
    skipModuleInsertion: false,

    modules: [
        {
            name: "ace/Editor",
            include: [
                "ace/Document",
                "ace/UndoManager",
                "ace/VirtualRenderer",
                
                "ace/mode/JavaScript",
                "ace/theme/TextMate"
            ],
            includeRequire: false
        },
        
        { 
            name: "ace/theme/Eclipse", 
            exclude: [
                "ace/lib/lang",
                "ace/lib/dom",
                "ace/lib/oop"
            ]
        },
        { 
            name: "ace/mode/Xml",
            exclude: [
                "ace/lib/oop",
                "ace/Tokenizer",
                "ace/mode/Text"      
            ]
        },
        { 
            name: "ace/mode/Css",
            exclude: [
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/Tokenizer",
                "ace/Range",
                "ace/mode/Text"      
            ]
        },
        { 
            name: "ace/mode/Html",
            exclude: [
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/Tokenizer",
                "ace/Range",
                "ace/mode/Text",
                "ace/mode/JavaScript",
                "ace/mode/Css",
            ]
        }
    ]
}

