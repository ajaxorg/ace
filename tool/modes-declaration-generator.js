var ts = require("typescript");
var fs = require("fs");
var path = require("path");

const modeDirPath = __dirname + "/../src/mode";
const outputFilePath = __dirname + "/../ace-modes.d.ts";
const moduleNamePrefix = "ace-code";

function processFile(program, filePath) {
    const sourceFile = program.getSourceFile(filePath);
    const checker = program.getTypeChecker();
    if (!sourceFile) return;

    var statements = [];
    const excludeTypes = [
        "() => void", "any", "typeof FoldMode", "(voidElements: any, optionalTags: any) => void",
        "typeof LiveScriptMode"
    ];

    function visit(node) {
        // Check for variable statements that might contain exports
        if (ts.isVariableStatement(node)) {
            node.declarationList.declarations.forEach(declaration => {
                if (declaration.initializer && ts.isBinaryExpression(declaration.initializer)
                    && ts.isPropertyAccessExpression(declaration.initializer.left)
                    && declaration.initializer.left.expression.getText() === "exports") {
                    // Extract the export name
                    const exportName = declaration.initializer.left.name.text;

                    const symbol = checker.getSymbolAtLocation(declaration.name);
                    let typeNode = undefined;
                    if (symbol) {
                        const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                        if (!excludeTypes.includes(checker.typeToString(type))) {
                            typeNode = checker.typeToTypeNode(type, undefined, undefined);
                        }
                    }
                    const exportAssignment = createExportStatement(exportName, typeNode);
                    statements.push(exportAssignment);
                }
            });
        }
        else if (ts.isExpressionStatement(node) && ts.isBinaryExpression(node.expression)) {
            const binaryExpression = node.expression;
            // Check for "exports.<identifier> = <identifier>;" pattern
            if (ts.isPropertyAccessExpression(binaryExpression.left) && binaryExpression.left.expression.getText()
                === "exports" && binaryExpression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                const exportName = binaryExpression.left.name.text;

                let typeNode = undefined;
                const symbol = checker.getSymbolAtLocation(node.expression.left);
                if (symbol) {
                    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    if (!excludeTypes.includes(checker.typeToString(type))) {
                        typeNode = checker.typeToTypeNode(type, undefined, undefined);
                    }
                }
                const exportAssignment = createExportStatement(exportName, typeNode);
                statements.push(exportAssignment);
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return statements;
}

function createExportStatement(exportName, type) {
    const exportType = getExportType(exportName);
    return ts.factory.createVariableStatement([ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList([
            ts.factory.createVariableDeclaration(ts.factory.createIdentifier(exportName), undefined,
                type || ts.factory.createConstructorTypeNode(undefined, undefined, [], exportType), undefined
            )
        ], ts.NodeFlags.Const)
    );
}

function getExportType(exportName) {
    var aceType = "";
    if (/highlight|rules/i.test(exportName)) {
        aceType = "HighlightRules";
    }
    else if (/behaviour/i.test(exportName)) {
        //TODO: we need options for behaviours
        aceType = "Behaviour";
    }
    else if (/completion/i.test(exportName)) {
        aceType = "Completion";
    }
    else if (/fold/i.test(exportName)) {
        aceType = "Folding";
    }
    else if (/mode/i.test(exportName)) {
        aceType = "SyntaxMode";
    }
    else if (/outdent/i.test(exportName)) {
        aceType = "Outdent";
    }

    return ts.factory.createImportTypeNode(ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(".")),
        undefined,
        ts.factory.createQualifiedName(ts.factory.createIdentifier("Ace"), ts.factory.createIdentifier(aceType)),
        undefined, false
    );
}

function generateModuleDeclarations(dirPath) {
    const program = createProgram(dirPath);
    const filePaths = program.getRootFileNames();

    return filePaths.sort((a, b) => a.localeCompare(b)).map(filePath => {
        let normalizedFilePath = filePath.replace(/\\/g, "/").replace(/.*(?=src\/mode)/, "").replace(/\.js$/, "");

        const moduleName = moduleNamePrefix + "/" + normalizedFilePath;
        const statements = processFile(program, filePath);
        const moduleBody = ts.factory.createModuleBlock(statements);
        return ts.factory.createModuleDeclaration([ts.factory.createToken(ts.SyntaxKind.DeclareKeyword)],
            ts.factory.createStringLiteral(moduleName), moduleBody,
            ts.NodeFlags.ExportContext | ts.NodeFlags.JavaScriptFile | ts.NodeFlags.Ambient | ts.NodeFlags.ContextFlags
        );
    });
}

function getAllFiles(dirPath) {
    let files = [];

    const entries = fs.readdirSync(dirPath);

    entries.sort().forEach(entry => {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(fullPath));
        }
        else if (stat.isFile()) {
            files.push(fullPath);
        }
    });

    return files;
}

function createProgram(dirPath) {
    const fileNames = getAllFiles(dirPath).filter(file => /\.js$/.test(file) && !/test\.js$/.test(file));

    const program = ts.createProgram(fileNames, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        allowJs: true
    });

    return program;
}

function generateModesDeclarationFile() {
    const moduleDeclarations = generateModuleDeclarations(modeDirPath);
    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
    const resultFile = ts.createSourceFile(outputFilePath, "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const result = moduleDeclarations.map(
        declaration => printer.printNode(ts.EmitHint.Unspecified, declaration, resultFile)).join('\n\n');
    fs.writeFileSync(outputFilePath, result);
}

generateModesDeclarationFile();
