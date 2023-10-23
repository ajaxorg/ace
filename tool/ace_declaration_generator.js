const ts = require('typescript');
const fs = require("fs");
const path = require("path");

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

    return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, directoryPath);
}

/**
 * @return {string}
 */
function generateInitialDeclaration() {
    const baseDirectory = path.resolve(__dirname, '..');
    const parsedConfig = getParsedConfigFromDirectory(baseDirectory);
    const defaultCompilerHost = ts.createCompilerHost({});
    let fileContent;

    const customCompilerHost = {
        ...defaultCompilerHost,
        writeFile: function (fileName, content) {
            fileContent = content;
            return;
        }
    };

    const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options, customCompilerHost);
    program.emit();
    return fileContent;
}

/**
 * @param {string} fileName
 * @param {string} content
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
    let interfaces = collectInterfaces(aceNamespacePath);

    /**
     * @param {ts.TransformationContext} context
     * @return {function(*): *}
     */
    function transformer(context) {
        return (sourceFile) => {
            function visit(node) {
                let updatedNode = node;
                if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
                    // remove wrong generated modules
                    if (node.name.text.endsWith("lib/keys") || node.name.text.endsWith("linking")) {
                        const newBody = ts.factory.createModuleBlock([]);
                        updatedNode = ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);
                    }
                    else if (interfaces[node.name.text]) {
                        // add corresponding interfaces to support mixins (EventEmitter, OptionsProvider, etc.)
                        if (node.body && ts.isModuleBlock(node.body)) {
                            const newBody = ts.factory.createModuleBlock(
                                node.body.statements.concat(interfaces[node.name.text]));
                            updatedNode = ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);
                        }
                    }
                    else if (node.name.text.endsWith("/config") || node.name.text.endsWith("textarea")) {
                        //TODO: should be better way to do this
                        //correct mixed exports (export function + export = _exports)
                        if (node.body && ts.isModuleBlock(node.body)) {
                            const newBody = ts.factory.createModuleBlock(node.body.statements.filter(statement => {
                                const exportsStatement = ts.isVariableStatement(statement)
                                    && statement.declarationList.declarations[0].name.getText() == "_exports";
                                return exportsStatement || ts.isExportAssignment(statement)
                                    || ts.isImportEqualsDeclaration(statement);
                            }));
                            updatedNode = ts.factory.updateModuleDeclaration(node, node.modifiers, node.name, newBody);

                        }
                    }
                }
                else if (ts.isInterfaceDeclaration(node) && node.heritageClauses) {
                    for (const clause of node.heritageClauses) {
                        if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length === 0) {
                            // Remove the extends clause if it's empty
                            return context.factory.updateInterfaceDeclaration(node, node.modifiers, node.name,
                                node.typeParameters, [], node.members
                            );
                        }
                    }
                }
                else if (ts.isClassDeclaration(node) && node.heritageClauses) {
                    let updatedHeritageClauses = [];
                    // remove inheritances from undefined types
                    for (let i = 0; i < node.heritageClauses.length; i++) {
                        let clause = node.heritageClauses[i];
                        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                            const updatedTypes = clause.types.filter(type => {
                                const symbol = checker.getSymbolAtLocation(type.expression);
                                if (symbol) {
                                    const declaredType = checker.getDeclaredTypeOfSymbol(symbol);

                                    return declaredType.flags !== ts.TypeFlags.Undefined
                                        && declaredType["intrinsicName"] !== "error";
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
                return ts.visitEachChild(updatedNode, visit, context);
            }

            return ts.visitNode(sourceFile, visit);
        };
    }

    const sourceCode = program.getSourceFile(temporaryName);
    const result = ts.transform(sourceCode, [transformer]);

    const printer = ts.createPrinter();
    result.transformed.forEach(transformedFile => {
        let output = printer.printFile(transformedFile);
        fs.writeFileSync(aceNamespacePath, output);
    });

    result.dispose();

    checkFinalDeclaration(aceNamespacePath);
}

/**
 * @param {string} declarationName
 */
function checkFinalDeclaration(declarationName) {
    const program = ts.createProgram([declarationName], {
        noEmit: true
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
 * @param {string} aceNamespacePath
 */
function collectInterfaces(aceNamespacePath) {
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
                    if (ts.isInterfaceDeclaration(child)) nodes.push(child);
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

                        if (typeName.includes("<")) {
                            typeName = typeName + "T>";
                        }
                        importAlias += "type " + typeName + " = import(\"" + packageName + "\").Ace." + typeName
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
 * @param {string} aceNamespacePath
 */
function generateDeclaration(aceNamespacePath) {
    let data = generateInitialDeclaration();

    let packageName = "ace-code";

    let updatedContent = data.replace(/(declare module ")/g, "$1" + packageName + "/");
    updatedContent = updatedContent.replace(/(require\(")/g, "$1" + packageName + "/");
    updatedContent = updatedContent.replace(/(import\(")(?!(?:\.|ace\-code))/g, "$1" + packageName + "/");
    updatedContent = updatedContent.replace(/ace\-(?:code|builds)(\/src)?\/ace/g, packageName);
    let aceModule = cloneAceNamespace(aceNamespacePath);

    updatedContent = updatedContent.replace(/(declare\s+module\s+"ace-(?:code|builds)"\s+{)/, "$1" + aceModule);
    updatedContent = updatedContent.replace(/(import\(")[./]*ace("\).Ace)/g, "$1" + packageName + "$2");

    fixDeclaration(updatedContent, aceNamespacePath);
}

/**
 * @param {string} content
 */
function updateDeclarationModuleNames(content) {
    let output = content.replace(
        /ace\-code(?:\/src)?\/(mode|theme|ext|keybinding|snippets)\//g, "ace-builds/src-noconflict/$1-");
    output = output.replace(/ace\-code(?:\/src)?/g, "ace-builds-internal");
    output = output.replace(/ace\-code/g, "ace-builds");
    output = output + '\n' + "declare module 'ace-builds/webpack-resolver';\n"
        + "declare module 'ace-builds/esm-resolver';";
    //TODO: modes/worker
    return output;
}


if (!module.parent) {
    generateDeclaration("../ace.d.ts");
}
else {
    exports.generateDeclaration = generateDeclaration;
    exports.updateDeclarationModuleNames = updateDeclarationModuleNames;
}
