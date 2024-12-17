const ts = require('typescript');
const fs = require("fs");
const path = require("path");
var {getAllFiles, cleanDeclarationFiles} = require("./fs_utilities");

const AUTO_GENERATED_HEADER = "/* This file is generated using `npm run update-types` */\n\n";

const MODE_REFERENCE = "/// <reference path=\"./ace-modes.d.ts\" />";

const defaultFormatCodeSettings = {
    baseIndentSize: 0,
    indentSize: 4,
    tabSize: 4,
    indentStyle: ts.IndentStyle.Smart,
    newLineCharacter: "\n",
    convertTabsToSpaces: true,
    insertSpaceAfterCommaDelimiter: true,
    insertSpaceAfterSemicolonInForStatements: true,
    insertSpaceBeforeAndAfterBinaryOperators: true,
    insertSpaceAfterConstructor: false,
    insertSpaceAfterKeywordsInControlFlowStatements: true,
    insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
    insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
    insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
    insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: false,
    insertSpaceAfterTypeAssertion: false,
    insertSpaceBeforeFunctionParenthesis: false,
    placeOpenBraceOnNewLineForFunctions: false,
    placeOpenBraceOnNewLineForControlBlocks: false,
    insertSpaceBeforeTypeAnnotation: false
};

/**
 * @param {string} directoryPath
 */
function getParsedConfigFromDirectory(directoryPath) {
    const configPath = ts.findConfigFile(directoryPath, ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) throw new Error("Could not find tsconfig.json");

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parseConfigHost = {
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        useCaseSensitiveFileNames: true
    };
    configFile.config.compilerOptions.noEmit = false;
    configFile.config.compilerOptions.emitDeclarationOnly = true;

    return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, directoryPath);
}

/**
 * @return {Map<string, string>}
 */
function generateInitialDeclarations(excludeDir) {
    const baseDirectory = path.resolve(__dirname, '..');
    const parsedConfig = getParsedConfigFromDirectory(baseDirectory);
    const defaultCompilerHost = ts.createCompilerHost({});
    const fileContents = new Map();

    const customCompilerHost = {
        ...defaultCompilerHost,
        writeFile: function (fileName, content) {
            fileContents.set(fileName.replace(/src\/src/, "src"), content);
            return;
        },
        getSourceFile: function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
            if (fileName.includes(excludeDir)) {
                return undefined;
            }
            return defaultCompilerHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        }
    };

    const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options, customCompilerHost);
    program.emit();
    return fileContents;
}

/**
 * Creates a custom TypeScript compiler host that uses the provided source file content instead of reading from the file system.
 * @param {Map<string, string>} fileMap - A map of file paths to their corresponding content.
 * @returns {ts.CompilerHost} - A custom compiler host that uses the provided source file content.
 */
function createCustomCompilerHost(fileMap) {
    const sourceFiles = new Map();
    for (const [filePath, content] of fileMap) {
        sourceFiles.set(
            filePath, ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS));
    }

    const defaultCompilerHost = ts.createCompilerHost({});
    return {
        ...defaultCompilerHost,
        getSourceFile: (name, languageVersion) => {
            if (fileMap.has(name)) {
                return sourceFiles.get(name);
            }
            return defaultCompilerHost.getSourceFile(name, languageVersion);
        },
        fileExists: (name) => {
            if (fileMap.has(name)) {
                return true;
            }
            return defaultCompilerHost.fileExists(name);
        },
        readFile: (name) => {
            if (fileMap.has(name)) {
                return fileMap.get(name);
            }
            return defaultCompilerHost.readFile(name);
        }
    };
}

function updateMainAceModule(node) {
    return node.statements.map(statement => {
        //create type alias for config
        if (ts.isVariableStatement(statement) && statement.declarationList.declarations[0]?.name?.text === "config") {

            const originalDeclaration = statement.declarationList.declarations[0];

            const importTypeNode = ts.factory.createImportTypeNode(
                ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('./config')), undefined,
                undefined, false
            );

            const typeOfImportTypeNode = ts.factory.createTypeOperatorNode(ts.SyntaxKind.TypeOfKeyword, importTypeNode);

            return ts.factory.updateVariableStatement(statement, statement.modifiers,
                ts.factory.updateVariableDeclarationList(statement.declarationList, [
                    ts.factory.updateVariableDeclaration(originalDeclaration, originalDeclaration.name,
                        originalDeclaration.exclamationToken, typeOfImportTypeNode, undefined
                    )
                ])
            );
        }
        return statement;
    });
}

/**
 * Updates a module declaration by adding internal statements to support mixins (EventEmitter, OptionsProvider, etc.).
 * @param {ts.SourceFile} sourceFile - The module declaration node to update.
 * @param {ts.Statement[]} statements - An object containing the internal statements to add to the module.
 * @param {boolean} [replace] - Replace all statements if true, otherwise append them.
 * @returns {ts.SourceFile} - The updated module declaration.

 */
function updateModuleWithInternalStatements(sourceFile, statements, replace) {
    let newStatements;
    if (replace) {
        newStatements = statements;
    }
    else {
        newStatements = [...sourceFile.statements, ...statements];
    }

    sourceFile = ts.factory.updateSourceFile(sourceFile, newStatements, sourceFile.isDeclarationFile,
        sourceFile.referencedFiles, sourceFile.typeReferenceDirectives, sourceFile.hasNoDefaultLib,
        sourceFile.libReferenceDirectives
    );
    return sourceFile;
}

/**
 * Fixes interfaces with empty extends clauses by either removing the entire interface declaration if it has no members,
 * or by removing the empty extends clause.
 *
 * @param {ts.InterfaceDeclaration} node - The interface declaration node to fix.
 * @param {ts.TransformationContext} context - The transformation context.
 * @returns {ts.InterfaceDeclaration} - The updated interface declaration.
 */
function fixWrongInterfaces(node, context) {
    for (const clause of node.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length === 0) {
            if (node.members.length === 0) {
                return; // remove entire interface declaration
            }
            // Remove the extends clause if it's empty
            return context.factory.updateInterfaceDeclaration(node, node.modifiers, node.name, node.typeParameters, [],
                node.members
            );
        }
    }
    return node;
}

/**
 * Fixes heritage clauses in class declarations by removing any inheritance from undefined types.
 *
 * @param {ts.ClassDeclaration} node - The class declaration node to fix.
 * @param {ts.TransformationContext} context - The transformation context.
 * @param {ts.TypeChecker} checker - The TypeScript type checker.
 * @returns {ts.ClassDeclaration} - The updated class declaration with fixed heritage clauses.
 */
function fixWrongHeritageClauses(node, context, checker) {
    let updatedHeritageClauses = [];
    // remove inheritances from undefined types
    for (let i = 0; i < node.heritageClauses.length; i++) {
        let clause = node.heritageClauses[i];
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            const updatedTypes = clause.types.filter(type => {
                const symbol = checker.getSymbolAtLocation(type.expression);
                if (symbol) {
                    const declaredType = checker.getDeclaredTypeOfSymbol(symbol);

                    return declaredType.flags !== ts.TypeFlags.Undefined && declaredType["intrinsicName"] !== "error";
                }
                return true;  // keep the type if the symbol can't be resolved
            });
            if (updatedTypes.length === 0) {
                continue;
            }
            var updatedHeritageClause = clause;
            if (updatedTypes.length !== clause.types.length) {
                updatedHeritageClause = context.factory.createHeritageClause(
                    ts.SyntaxKind.ExtendsKeyword, updatedTypes);
            }
        }
        if (updatedHeritageClause) {
            updatedHeritageClauses.push(updatedHeritageClause);
        }
        else {
            updatedHeritageClauses.push(clause);
        }
    }
    return context.factory.updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters,
        updatedHeritageClauses, node.members
    );
}

/**
 * @param {Map<string, string>} sourcesByPath
 * @param {string} aceNamespacePath
 */
function fixDeclarations(sourcesByPath, aceNamespacePath) {
    const customCompilerHost = createCustomCompilerHost(sourcesByPath);
    const program = ts.createProgram(Array.from(sourcesByPath.keys()), {
        noEmit: true
    }, customCompilerHost);

    var checker = program.getTypeChecker();
    let internalStatements = collectStatements(aceNamespacePath);
    const finalDeclarations = [];

    /**
     * Transforms the source file by updating certain module declarations and interface/class heritage clauses.
     *
     * @param {ts.TransformationContext} context - The transformation context.
     * @returns {function(ts.SourceFile): ts.SourceFile} - A function that transforms the source file.
     */
    function transformer(context) {
        return (sourceFile) => {
            function visit(node) {
                let updatedNode = node;
                // Fix wrong interface and class heritage clauses
                if (ts.isInterfaceDeclaration(node) && node.heritageClauses) {
                    return fixWrongInterfaces(node, context);
                }
                else if (ts.isClassDeclaration(node) && node.heritageClauses) {
                    return fixWrongHeritageClauses(node, context, checker);
                }
                return ts.visitEachChild(updatedNode, visit, context);
            };

            let modulePath = sourceFile.fileName.replace(/.+(?=src\/)/, "");

            if (internalStatements[modulePath]) {
                sourceFile = updateModuleWithInternalStatements(sourceFile, internalStatements[modulePath]);
            }
            else if (modulePath.endsWith("static_highlight.d.ts")) {
                sourceFile = ts.factory.updateSourceFile(sourceFile, sourceFile.statements.filter(statement => {
                        return !ts.isExportAssignment(statement);
                    }), sourceFile.isDeclarationFile, sourceFile.referencedFiles, sourceFile.typeReferenceDirectives,
                    sourceFile.hasNoDefaultLib, sourceFile.libReferenceDirectives
                );
            }
            else if (modulePath.endsWith("/ace.d.ts")) {
                sourceFile = updateModuleWithInternalStatements(sourceFile, updateMainAceModule(sourceFile), true);
            }

            return ts.visitNode(sourceFile, visit);
        };
    }

    function pathBasedTransformer(context) {
        return (sourceFile) => {
            const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed}, {
                substituteNode(hint, node) {
                    // remove all private members
                    if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node) || ts.isPropertyDeclaration(node)
                        || ts.isPropertySignature(node)) {
                        const isPrivate = node.modifiers?.some(
                            modifier => modifier.kind === ts.SyntaxKind.PrivateKeyword);

                        const startsWithDollar = ts.isIdentifier(node.name) && /^[$_]/.test(node.name.text);

                        if (isPrivate || (startsWithDollar && !hasExternalTag(node)) || hasInternalTag(node)) {
                            return ts.factory.createNotEmittedStatement(node);
                        }
                    }
                    else if (ts.isVariableStatement(node)) {
                        if (node.text && node.getText().indexOf("declare const $") > -1) {
                            return ts.factory.createNotEmittedStatement(node);
                        }
                        // Remove variable statements like 'const {any_identifier}_base: undefined;'
                        const declarations = node.declarationList.declarations;

                        // Filter out declarations that match the pattern
                        const filteredDeclarations = declarations.filter(declaration => {
                            if (ts.isIdentifier(declaration.name) && /_base\w*$/.test(declaration.name.text)
                                && declaration.type.kind == ts.SyntaxKind.UndefinedKeyword) {
                                return false;
                            }
                            return true;
                        });

                        if (filteredDeclarations.length === 0) {
                            return ts.factory.createNotEmittedStatement(node);
                        }
                        else if (filteredDeclarations.length < declarations.length) {
                            return ts.factory.updateVariableStatement(node, node.modifiers,
                                ts.factory.updateVariableDeclarationList(node.declarationList, filteredDeclarations)
                            );
                        }
                    }
                    //remove empty exports
                    else if (ts.isExportDeclaration(node)) {
                        if (node.exportClause && ts.isNamedExports(node.exportClause)
                            && node.exportClause.elements.length === 0) {
                            return ts.factory.createNotEmittedStatement(node);
                        }
                    }
                }
            });
            if (sourceFile.fileName.includes("src/") && !sourceFile.fileName.endsWith("lib/keys.d.ts")
                && !sourceFile.fileName.endsWith("linking.d.ts") && !sourceFile.fileName.endsWith("textarea.d.ts")) {
                let output = printer.printFile(sourceFile);
                output = correctImportStatements(output);
                output = output.replace(/declare\s+(namespace)/g, "export $1");
                output = cleanComments(output);
                output = formatDts(sourceFile.fileName, output);
                if (/\Wi\./.test(output)) {
                    const level = countSlashesAfterSrc(sourceFile.fileName);
                    output = `import * as i from "../${"../".repeat(level)}interfaces";\n\n ${output}`;
                }
                output = correctIndividualDeclaration(sourceFile, output, aceNamespacePath);
                output = AUTO_GENERATED_HEADER + output;
                fs.writeFileSync(sourceFile.fileName, output);
                finalDeclarations.push(sourceFile.fileName);
            }
            return sourceFile;
        };
    }

    const result = ts.transform(program.getSourceFiles(), [transformer, pathBasedTransformer]);

    result.dispose();

    useTsQuickFix(finalDeclarations)
    checkFinalDeclarations(finalDeclarations);
}

/**
 * This function is responsible for handling specific cases where the generated
 * declaration files need to be modified. It checks the file name and applies
 * the necessary changes to the output.
 *
 * @param {ts.SourceFile} sourceFile The TypeScript source file being processed.
 * @param {string} content The content of the declaration file.
 * @param {string} aceNamespacePath The path to the Ace namespace.
 * @returns The corrected declaration file content.
 */
function correctIndividualDeclaration(sourceFile, content, aceNamespacePath) {
    let output = content;
    // copy the ace.d.ts file to the root of the project with ACE namespace for backwards compatibility
    if (sourceFile.fileName.endsWith("/ace.d.ts")) {
        const ace = cloneAceNamespace(aceNamespacePath, true);
        const mainDeclaration = AUTO_GENERATED_HEADER + ace + `\nexport * from "./src/ace";`;
        fs.writeFileSync(__dirname + "/../ace.d.ts", mainDeclaration);
    } else
    if (sourceFile.fileName.endsWith("/snippets.d.ts")) {
        output = output.replace(/(interface SnippetManager)/, "declare $1");
    } else
    if (sourceFile.fileName.endsWith("/static_highlight.d.ts")) {
        output = output.replace(/declare\s+(function highlight)/, "export $1");
    }
    return output;
}


function countSlashesAfterSrc(filepath) {
    const srcIndex = filepath.indexOf('src/');
    if (srcIndex === -1) return 0;

    const pathAfterSrc = filepath.slice(srcIndex + 4);
    return (pathAfterSrc.match(/\//g) || []).length;
}


/**
 * Corrects the import statements in the provided text by replacing the old-style
 * `require()` imports with modern ES6 `import` statements.
 * @param {string} text
 */
function correctImportStatements(text) {
    text = text.replace(/import\s*\w+_\d+\s*=\s*require\(([\w\/"-.]+)\);?.\s*import\s*(\w+)\s*=\s*\w+_\d+\.(\w+);?/gs,
        (match, path, importName, exportName) => {
            if (importName !== exportName) {
                return `import {${exportName} as ${importName}} from ${path};`;
            }
            return `import {${exportName}} from ${path};`;
        }
    );
    // replace unnecessary export types with import
    text = text.replace(/export\s+type\s+(\w+)\s*=\s*import\(([\w\/"-.]+)\)\.(\w+);/g,
        (match, importName, path, exportName) => {
            if (importName !== exportName) {
                return `import {${exportName} as ${importName}} from ${path};`;
            }
            return `import {${exportName}} from ${path};`;
        }
    );
    return text;
}

function cleanComments(text) {
    text = text.replace(/^\s*\*\s*@(param|template|returns?|this|typedef)\s*({.+})?(\s*\[?[$\w]+\]?)?\s*$/gm, '');
    text = text.replace(/@type\s*{[^}]+}/g, '');
    text = text.replace(/\/\*(\s|\*)*\*\//g, '');
    text = text.replace(/^\s*[\r\n]/gm, '');

    return text;
}

function hasInternalTag(node) {
    const sourceFile = node.getSourceFile();
    if (!sourceFile) return false;

    const jsDocs = ts.getJSDocTags(node).filter(tag => tag.tagName.text === 'internal');
    return jsDocs.length > 0;
}

function hasExternalTag(node) {
    const sourceFile = node.getSourceFile();
    if (!sourceFile) return false;

    const jsDocs = ts.getJSDocTags(node).filter(tag => tag.tagName.text === 'external');
    return jsDocs.length > 0;
}

/**
 * @return {ts.LanguageServiceHost}
 */
function createMinimalLanguageServiceHost(filename, text) {
    const snapshot = ts.ScriptSnapshot.fromString(text);
    ;
    return {
        "getCompilationSettings": function () {
            return ts.getDefaultCompilerOptions();
        },
        "getScriptFileNames": function () {
            return Object.keys([filename]);
        },
        "getScriptVersion": function (_fileName) {
            return "0";
        },
        "getScriptSnapshot": function (fileName) {
            return snapshot;
        },
        "getCurrentDirectory": function () {
            return "";
        },
        "fileExists": function (path) {
            return path == filename;
        },
        "readFile": function (path) {
            return text;
        },
        "getDefaultLibFileName": function () {
            return "lib.d.ts";
        }
    };
}

function formatDts(filename, text) {
    var host = createMinimalLanguageServiceHost(filename, text);
    const languageService = ts.createLanguageService(host);
    let formatEdits = languageService.getFormattingEditsForDocument(filename, defaultFormatCodeSettings);
    formatEdits
        .sort((a, b) => a.span.start - b.span.start)
        .reverse()
        .forEach(edit => {
            const head = text.slice(0, edit.span.start);
            const tail = text.slice(edit.span.start + edit.span.length);
            text = `${head}${edit.newText}${tail}`;
        });
    return text;
}


/**
 * @param {string[]} declarationNames
 */

function checkFinalDeclarations(declarationNames) {
    const program = ts.createProgram(declarationNames, {
        noEmit: true,
        target: ts.ScriptTarget.ES2019,
        lib: ["lib.es2019.d.ts", "lib.dom.d.ts"]
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);

    diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            if (diagnostic.file.fileName.endsWith("ace-modes.d.ts")) {
                return;
            }
            const {
                line,
                character
            } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    });
}

function getChangeKey(change) {
    return `${change.start}:${change.end}:${change.newText}`;
}

function useTsQuickFix(declarationNames) {
    const defaultCompilerHost = ts.createCompilerHost({});
    const sourcesToFix = new Map();
    const compilerOptions = {
        noEmit: true,
        target: ts.ScriptTarget.ES2019,
        lib: ["lib.es2019.d.ts", "lib.dom.d.ts"],
        noUnusedLocals: true
    };

    const host = {
        ...defaultCompilerHost,
        getCompilationSettings: () => compilerOptions,
        getScriptFileNames: () => declarationNames,
        getScriptVersion: () => "1",
        getScriptSnapshot: fileName => {
            const content = fs.readFileSync(fileName).toString();
            return ts.ScriptSnapshot.fromString(content);
        },
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
        writeFile: (fileName, content) => fs.writeFileSync(fileName, content)
    };

    const languageService = ts.createLanguageService(host);
    const diagnostics = languageService.getProgram().getSemanticDiagnostics();
    const suggestionDiagnostics = declarationNames.map((fileName) => {
        return languageService.getSuggestionDiagnostics(fileName);
    }).flat();

    const allDiagnostics = [...diagnostics, ...suggestionDiagnostics];

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file && diagnostic.start) {
            const fixes = languageService.getCodeFixesAtPosition(diagnostic.file.fileName, diagnostic.start,
                diagnostic.start + diagnostic.length, [diagnostic.code], defaultFormatCodeSettings, {}
            );
            fixes.forEach(fix => {
                if ((fix.fixId === "fixMissingImport" || fix.fixName === "unusedIdentifier") && fix.changes.length > 0) {
                    const fileName = fix.changes[0].fileName;
                    const changeMap = sourcesToFix.get(fileName) || new Map();

                    fix.changes[0].textChanges.forEach(change => {
                        const changeObj = {
                            newText: change.newText,
                            start: change.span.start,
                            end: change.span.start + change.span.length
                        };
                        const key = getChangeKey(changeObj);
                        changeMap.set(key, changeObj);
                    });

                    sourcesToFix.set(fileName, changeMap);
                }
            });

        }
    });

    sourcesToFix.forEach((changeMap, key) => {
        let content = fs.readFileSync(key).toString();
        const changes = [...changeMap.values()].sort((a, b) => b.end - a.end);

        changes.forEach(change => {
            content = content.slice(0, change.start) +
                change.newText +
                content.slice(change.end);
        });

        fs.writeFileSync(key, content);
    });
}

/**
 * Collect statements (interfaces and function declarations) from the ace-internal.
 * @param {string} aceNamespacePath
 */
function collectStatements(aceNamespacePath) {
    const program = ts.createProgram([aceNamespacePath], {
        noEmit: true
    });
    const sourceFile = program.getSourceFile(aceNamespacePath);
    const result = {};
    const printer = ts.createPrinter();
    let packageName = "ace-code";

    function visit(node) {
        if (node && ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
            let nodes = [];
            if (node.body && ts.isModuleBlock(node.body)) {
                ts.forEachChild(node.body, (child) => {
                    if (ts.isInterfaceDeclaration(child) || ts.isFunctionDeclaration(child)) nodes.push(child);
                });
            }
            if (nodes.length > 0) {
                const interfaceStrings = nodes.map(
                    interfaceNode => printer.printNode(ts.EmitHint.Unspecified, interfaceNode, sourceFile));

                let concatenatedInterfaceStrings = interfaceStrings.join('\n\n');
                let identifiers = concatenatedInterfaceStrings.match(/Ace\.[\w]+<?/g);
                if (identifiers && identifiers.length > 0) {
                    identifiers = [...new Set(identifiers)];
                    let importAlias = '';
                    identifiers.forEach(identifier => {
                        let typeName = identifier.replace("Ace.", "");
                        let rightSide = typeName;

                        if (typeName.includes("EventEmitter<")) {
                            typeName = typeName + "T extends { [K in keyof T]: (...args: any[]) => any }>";
                            rightSide = rightSide + "T>";
                        }
                        else if (typeName.includes("<")) {
                            typeName = rightSide = rightSide + "T>";
                        }
                        importAlias += "type " + typeName + " = import(\"" + packageName + "\").Ace." + rightSide
                            + ";\n\n";
                    });
                    concatenatedInterfaceStrings = "namespace Ace {" + importAlias + "}" + concatenatedInterfaceStrings;
                }

                const newSourceFile = ts.createSourceFile(
                    'temp.d.ts', concatenatedInterfaceStrings, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
                nodes = newSourceFile.statements;
            }
            result[node.name.text.replace("./", "") + ".d.ts"] = nodes;
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return result;
}

/**
 * @param {string} aceNamespacePath
 * @param {boolean} [withModeReference]
 * @return {string}
 */
function cloneAceNamespace(aceNamespacePath, withModeReference) {
    const program = ts.createProgram([aceNamespacePath], {
        noEmit: true
    });
    const sourceFile = program.getSourceFile(aceNamespacePath);
    if (!sourceFile) {
        throw new Error("Could not find ace.d.ts");
    }
    const printer = ts.createPrinter();
    for (let i = 0; i < sourceFile.statements.length; i++) {
        const node = sourceFile.statements[i];
        if (ts.isModuleDeclaration(node) && node.name.text == "Ace") {
            let aceModule = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
            if (withModeReference) {
                aceModule = MODE_REFERENCE + '\n\n' + aceModule + '\n';
            } else {
                aceModule = aceModule + '\n';
            }
            return aceModule;
        }
    }
}

/**
 * @param {string} [aceNamespacePath]
 */
function generateDeclaration(aceNamespacePath) {
    cleanDeclarationFiles();

    if (!aceNamespacePath) {
        aceNamespacePath = __dirname + "/../ace-internal.d.ts";
    }
    const excludeDir = "src/mode"; //TODO: remove, when modes are ES6

    let data = generateInitialDeclarations(excludeDir);

    fixDeclarations(data, aceNamespacePath);
}

/**
 * Updates the declaration module names in the provided content.
 * This function replaces references to "ace-code" with "ace-builds" and "ace-builds-internal" as appropriate.
 *
 * @param {string} content - The content to update.
 * @returns {string} The updated content with the module names replaced.
 */
function updateDeclarationModuleNames(content) {
    let output = content.replace(
        /ace\-code(?:\/src)?\/(mode(?!\/(?:matching_brace_outdent|matching_parens_outdent|behaviour|folding))|theme|ext|keybinding|snippets)\//g,
        "ace-builds/src-noconflict/$1-"
    );
    output = output.replace(/"ace\-code"/g, "\"ace-builds\"");
    output = output.replace(/ace\-code(?:\/src)?/g, "ace-builds-internal");
    return output;
}

function bundleDtsFiles(buildPath) {
    const aceNamespacePath = __dirname + "/../ace-internal.d.ts";
    if (!buildPath) {
        buildPath = __dirname + '/../';
    }

    const directoryPath = path.resolve(buildPath, 'src');
    const files = getAllFiles(directoryPath);
    const dtsFiles = files.filter(file => file.endsWith('.d.ts'));
    dtsFiles.push(path.join(buildPath, '/interfaces.d.ts'));

    let combinedDefinitions = "";
    dtsFiles.forEach((filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        const moduleParts = filePath.replace(/\\/g,"/").replace(/\.d\.ts/, "").split("src");

        let moduleName;
        if (moduleParts.length > 1) {
            moduleName = "src" + moduleParts[1];
            if (moduleName == "src/ace") {
                content = cloneAceNamespace(aceNamespacePath) + content;
            }

            const partOfPath = moduleParts[1].split("/").slice(0, -1).join("/");
            content = content.replace(/(['"])((?:\.\.?\/)+)([^'"]+)/g, (match, quote, relPath, importedFile) => {
                const upLevels = (relPath.match(/\.\.\//g) || []).length;
                importedFile = importedFile.replace("src/", "");

                if (moduleName == "src/ext/menu_tools/get_editor_keyboard_shortcuts") {
                    console.log(moduleName)
                }

                let dirs = partOfPath ? partOfPath.split('/') : [];

                if (upLevels > 0) {
                    dirs = dirs.slice(0, dirs.length - upLevels);
                }

                const newPath = dirs.length > 0 ? dirs.join('/') + '/' + importedFile : importedFile;
                return `${quote}ace-code/src/${newPath}`.replace(/\/+/g, "/");
            });
        }
        else {
            moduleName = 'interfaces';
            content = content.replace(/"\.\/src/g, "\"ace-code/src");
        }

        content = content.replace(/declare\s+/g, "");

        combinedDefinitions += `declare module "ace-code/${moduleName}" {\n ${content}\n}\n`;

    });

    combinedDefinitions = updateDeclarationModuleNames(combinedDefinitions);
    const regex = new RegExp(AUTO_GENERATED_HEADER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    combinedDefinitions = combinedDefinitions.replace(regex, "");
    combinedDefinitions = combinedDefinitions.replace(/ace\-builds\-internal\/ace/g, "ace-builds");

    combinedDefinitions = formatDts("test.d.ts", combinedDefinitions);

    combinedDefinitions = AUTO_GENERATED_HEADER + MODE_REFERENCE + "\n" + combinedDefinitions;

    return combinedDefinitions;
}


if (!module.parent) {
    require("./modes-declaration-generator");
    generateDeclaration();
}
else {
    exports.generateDeclaration = generateDeclaration;
    exports.updateDeclarationModuleNames = updateDeclarationModuleNames;
    exports.bundleDtsFiles = bundleDtsFiles;
}
