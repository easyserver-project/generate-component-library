import ts, {JsxEmit} from 'typescript'
import path from "path";
import * as fs from "fs";

export const build = (rootDir: string) => {
    const components = fs.readdirSync(path.join(rootDir, "dist", "components"))
    compile(components.map(c => path.join(rootDir, "dist", "components", c)), {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES2021,
        module: ts.ModuleKind.CommonJS,
        outDir: path.join(rootDir, "build"),
        jsx: JsxEmit.React,
        esModuleInterop: true,
        declaration: true
    });
}

function compile(fileNames: string[], options: ts.CompilerOptions): void {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}


