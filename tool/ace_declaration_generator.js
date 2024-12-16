const ts = require('typescript');
const fs = require("fs");
const path = require("path");

const SEPARATE_MODULES = ["ext", "theme", "snippets", "lib"]; // adjust this list for more granularity

const AUTO_GENERATED_HEADER = "/* This file is generated using `npm run update-types` */\n\n";

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
    configFile.config.compilerOptions.outFile = "./types/index.d.ts";

    return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, directoryPath);
}

/**
 * @return {string}
 */
function generateInitialDeclaration(excludeDir) {
    const baseDirectory = path.resolve(__dirname, '..');
    const parsedConfig = getParsedConfigFromDirectory(baseDirectory);
    const defaultCompilerHost = ts.createCompilerHost({});
    let fileContent;

    const customCompilerHost = {
        ...defaultCompilerHost,
        writeFile: function (fileName, content) {
            fileContent = content;
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
    return fileContent;
}

/**
 * Creates a custom TypeScript compiler host that uses the provided source file content instead of reading from the file system.
 * @param {string} fileName - The name of the source file.
 * @param {string} content - The content of the source file.
 * @returns {ts.CompilerHost} - A custom compiler host that uses the provided source file content.
 */
function createCustomCompilerHost(fileName, content) {
    const newSourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

    const defaultCompilerHost = ts.createCompilerHost({});
    return {
        ...defaultCompilerHost,
        getSourceFile: (name, languageVersion) => {
            if (name === fileName) {
                return newSourceFile;
            }
            return defaultCompilerHost.getSourceFile(name, languageVersion);
        },
        fileExists: (name) => {
            if (name === fileName) {
                return true;
            }
            return defaultCompilerHost.fileExists(name);
        },
        readFile: (name) => {
            if (name === fileName) {
                return content;
            }
            return defaultCompilerHost.readFile(name);
        }
    };
}

function updateMainAceModule(node) {
    if (node.body && ts.isModuleBlock(node.body)) {
        const updatedStatements = node.body.statements.map(statement => {
            //create type alias for config
            if (ts.isVariableStatement(statement) && statement.declarationList.declarations[0]?.name?.text
                === "config") {

                const originalDeclaration = statement.declarationList.declarations[0];

                const importTypeNode = ts.factory.createImportTypeNode(
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('ace-code/src/config')), undefined,
                    undefined, false
                );

                const typeOfImportTypeNode = ts.factory.createTypeOperatorNode(
                    ts.SyntaxKind.TypeOfKeyword, importTypeNode);

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

        return ts.factory.updateModuleDeclaration(node, node.modifiers, node.name,
            ts.factory.createModuleBlock(updatedStatements)
        );
    }
}

/**
 * Updates the module declaration for the "keys" and "linking" modules by adding the corresponding internal statements
 * to support mixins (EventEmitter, OptionsProvider, etc.).
 *
 * @param {ts.ModuleDeclaration} node - The module declaration node to update.
 * @param {Object<string, ts.Statement[]>} internalStatements - An object containing the internal statements to add to the module.
 * @returns {ts.ModuleDeclaration} - The updated module declaration.
 */
function updateKeysAndLinksStatements(node, internalStatements) {
    let statements = [];
    if (internalStatements[node.name.text]) {
        statements = internalStatements[node.name.text];
    }
    const newBody = ts.factory.createModuleBlock(statements);
    return ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);
}

/**
 * Updates a module declaration by adding internal statements to support mixins (EventEmitter, OptionsProvider, etc.).
 *
 * @param {ts.ModuleDeclaration} node - The module declaration node to update.
 * @param {Object<string, ts.Statement[]>} internalStatements - An object containing the internal statements to add to the module.
 * @returns {ts.ModuleDeclaration} - The updated module declaration.
 */
function updateModuleWithInternalStatements(node, internalStatements) {
    const newBody = ts.factory.createModuleBlock(
        node.body.statements.concat(internalStatements[node.name.text]).filter(statement => {
            if (node.name.text.endsWith("autocomplete")) {
                return !(ts.isModuleDeclaration(statement) && statement.name.text === 'Autocomplete');
            }
            return true;
        }));
    return ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);
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
 * @param {string} content
 * @param {string} aceNamespacePath
 */
function fixDeclaration(content, aceNamespacePath) {
    const temporaryName = "temp.d.ts";
    const customCompilerHost = createCustomCompilerHost(temporaryName, content);
    const program = ts.createProgram([temporaryName], {
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
                // Update module declarations for certain module names
                if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
                    if (node.name.text === "ace-code") {
                        return updateMainAceModule(node);
                    } else if (node.name.text.endsWith("lib/keys") || node.name.text.endsWith("linking")) {
                        updatedNode = updateKeysAndLinksStatements(node, internalStatements);
                    } else if (internalStatements[node.name.text]) {
                        updatedNode = updateModuleWithInternalStatements(node, internalStatements);
                    } else if (node.name.text.endsWith("static_highlight")) {
                        if (node.body && ts.isModuleBlock(node.body)) {
                            const newBody = ts.factory.createModuleBlock(node.body.statements.filter(statement => {
                                return !ts.isExportAssignment(statement);
                            }));
                            updatedNode = ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);
                        }
                    }
                }
                // Fix wrong interface and class heritage clauses
                else if (ts.isInterfaceDeclaration(node) && node.heritageClauses) {
                    return fixWrongInterfaces(node, context);
                } else if (ts.isClassDeclaration(node) && node.heritageClauses) {
                    return fixWrongHeritageClauses(node, context, checker);
                }
                return ts.visitEachChild(updatedNode, visit, context);
            };

            return ts.visitNode(sourceFile, visit);
        };
    }

    function pathBasedTransformer(context) {
        return (sourceFile) => {
            const moduleOutputs = {};

            function visit(node) {
                if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
                    let pathKey = 'modules';
                    if (node.name.text === "ace-code") {
                        pathKey = "ace";
                        if (!moduleOutputs[pathKey]) {
                            moduleOutputs[pathKey] = [];
                        } //TODO:
                        moduleOutputs[pathKey].push(node);
                    }
                    else {
                        SEPARATE_MODULES.some(module => {
                            if (node.name.text.includes("/" + module + "/")) {
                                pathKey = module;
                                return true;
                            }
                        });
                        if (!moduleOutputs[pathKey]) {
                            moduleOutputs[pathKey] = [];
                        }
                        moduleOutputs[pathKey].push(node);
                    }

                    return node;
                }
                return ts.visitEachChild(node, visit, context);
            }

            ts.visitNode(sourceFile, visit);

            // Generate new source files for each module path
            let modules = Object.keys(moduleOutputs);

            modules.forEach(key => {
                const newSourceFile = context.factory.updateSourceFile(sourceFile, moduleOutputs[key]);
                const dirPath = path.dirname(aceNamespacePath.replace("ace-internal", "ace"));
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                const outputName = key === "ace" ? `${dirPath}/ace.d.ts` : `${dirPath}/types/ace-${key}.d.ts`;
                finalDeclarations.push(outputName);

                const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed}, {
                    substituteNode(hint, node) {
                        if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name) && node.name.text === "ace-code/src/ext/textarea") {
                            return ts.factory.createNotEmittedStatement(node);
                        } else
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
                            if (node.text && node.getText().indexOf("export const $") > -1) {
                                return ts.factory.createNotEmittedStatement(node);
                            }
                            // Remove variable statements like 'const {any_identifier}_base: undefined;'
                            const declarations = node.declarationList.declarations;

                            // Filter out declarations that match the pattern
                            const filteredDeclarations = declarations.filter(declaration => {
                                if (ts.isIdentifier(declaration.name) && /_base\w*$/.test(declaration.name.text)
                                    && /:\s*undefined$/.test(declaration.getText())) {
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
                        else if (ts.isExportDeclaration(node) && /export\s*{\s*}/.test(node.getText())) {
                            return ts.factory.createNotEmittedStatement(node);
                        }
                    }
                });
                let output = printer.printFile(newSourceFile);
                if (key === "ace") {
                    let referencePaths = modules.filter((el) => el != "ace").map((el) => {
                        return `/// <reference path="./types/ace-${el}.d.ts" />`;
                    });
                    let allReferences = referencePaths.join("\n") + "\n/// <reference path=\"./ace-modes.d.ts\" />\n";
                    output = allReferences + output;
                }
                output = correctImportStatements(output);
                output = cleanComments(output);
                output = formatDts(outputName, output);
                output = AUTO_GENERATED_HEADER + output;
                fs.writeFileSync(outputName, output);
            });

            return sourceFile;
        };
    }

    const sourceCode = program.getSourceFile(temporaryName);
    const result = ts.transform(sourceCode, [transformer, pathBasedTransformer]);

    result.dispose();

    checkFinalDeclaration(finalDeclarations);
}

/**
 * Corrects the import statements in the provided text by replacing the old-style
 * `require()` imports with modern ES6 `import` statements.
 */
function correctImportStatements(text) {
    text = text.replace(
        /import\s*\w+_\d+\s*=\s*require\(([\w\/"-]+)\);?.\s*import\s*(\w+)\s*=\s*\w+_\d+\.(\w+);?/gs,
        (match, path, importName, exportName) => {
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
    text = text.replace(/@type\s*({.+})/g, '');
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

function createMinimalLanguageServiceHost() {
    return {
        files: {},
        addFile(fileName, text) {
            this.files[fileName] = ts.ScriptSnapshot.fromString(text);
        },
        "getCompilationSettings": function () {
            return ts.getDefaultCompilerOptions();
        },
        "getScriptFileNames": function () {
            return Object.keys(this.files);
        },
        "getScriptVersion": function (_fileName) {
            return "0";
        },
        "getScriptSnapshot": function (fileName) {
            return this.files[fileName];
        },
        "getCurrentDirectory": function () {
            return "";
        }
    };

}

function formatDts(filename, text) {
    var host = createMinimalLanguageServiceHost();
    host.addFile(filename, text);
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
function checkFinalDeclaration(declarationNames) {
    const program = ts.createProgram(declarationNames, {
        noEmit: true,
        target: ts.ScriptTarget.ES2019,
        lib: ["lib.es2019.d.ts", "lib.dom.d.ts"]
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);

    diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
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
                        } else if (typeName.includes("<")) {
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
            result[node.name.text.replace("./", packageName + "/")] = nodes;
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return result;
}

/**
 * @param {string} aceNamespacePath
 * @return {string}
 */
function cloneAceNamespace(aceNamespacePath) {

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
            aceModule = aceModule.replace(/"\.\/src/g, "\"ace-code/src");
            aceModule = '\n' + aceModule + '\n';
            return aceModule;
        }
    }
}

/**
 * @param {string} [aceNamespacePath]
 */
function generateDeclaration(aceNamespacePath) {
    if (!aceNamespacePath) {
        aceNamespacePath = __dirname + "/../ace-internal.d.ts";
    }
    const excludeDir = "src/mode"; //TODO: remove, when modes are ES6

    let data = generateInitialDeclaration(excludeDir);
    let packageName = "ace-code";

    let updatedContent = data.replace(/(declare module ")/g, "$1" + packageName + "/src/");

    updatedContent = updatedContent.replace(/(require\(")/g, "$1" + packageName + "/src/");
    updatedContent = updatedContent.replace(/(import\(")[./]*ace(?:\-internal)?("\).Ace)/g, "$1" + packageName + "$2");
    updatedContent = updatedContent.replace(/(import\(")(?:[./]*)(?!(?:ace\-code))/g, "$1" + packageName + "/src/");
    updatedContent = updatedContent.replace(/ace\-(?:code|builds)(\/src)?\/ace(?:\-internal)?/g, packageName);
    let aceModule = cloneAceNamespace(aceNamespacePath);

    updatedContent = updatedContent.replace(/(declare\s+module\s+"ace-(?:code|builds)"\s+{)/, "$1" + aceModule);
    updatedContent = updatedContent.replace(/(?:export)?\snamespace(?!\sAce)/g, "export namespace");
    fixDeclaration(updatedContent, aceNamespacePath);
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


if (!module.parent) {
    require("./modes-declaration-generator");
    generateDeclaration();
}
else {
    exports.generateDeclaration = generateDeclaration;
    exports.updateDeclarationModuleNames = updateDeclarationModuleNames;
    exports.SEPARATE_MODULES = SEPARATE_MODULES;
}
