import ts, { JsxEmit } from 'typescript'
import path from 'path'
import * as fs from 'fs'
import sass from 'sass'

export const build = (rootDir: string) => {
  compile(rootDir)
  createIndexFile(rootDir)
  buildCss(rootDir)
  copyProjectJson(rootDir)
}

function createIndexFile(rootDir: string) {
  const components = fs.readdirSync(path.join(rootDir, 'dist', 'components'))
  const exports = components.flatMap((component) =>
    fs
      .readFileSync(path.join(rootDir, 'dist', 'components', component), 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.includes('export const '))
      .map((d) => d.match(/export const (.*?) =/)![1])
  )
  const indexCode = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
${exports.map((d) => `exports.${d}`).join(' = ')} = void 0;
${exports
  .map(
    (d) => `var ${d}_1 = require("./${d}");
Object.defineProperty(exports, "${d}", { enumerable: true, get: function () { return ${d}_1.${d}; } });`
  )
  .join('\n')}`
  const indexDTs = exports.map((d) => `export {${d}} from './${d}'`).join('\n')
  fs.writeFileSync(path.join(rootDir, 'build', 'index.js'), indexCode, 'utf8')
  fs.writeFileSync(path.join(rootDir, 'build', 'index.d.ts'), indexDTs, 'utf8')
}

function compile(rootDir: string): void {
  const fileNames = fs
    .readdirSync(path.join(rootDir, 'dist', 'components'))
    .map((c) => path.join(rootDir, 'dist', 'components', c))
  const options = {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES2021,
    module: ts.ModuleKind.CommonJS,
    outDir: path.join(rootDir, 'build'),
    jsx: JsxEmit.React,
    esModuleInterop: true,
    declaration: true,
  }
  let program = ts.createProgram(fileNames, options)
  let emitResult = program.emit()

  let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })
}

function buildCss(rootDir: string) {
  const sassResult = sass.renderSync({
    file: path.join(rootDir, 'src', 'style', 'index.scss'),
  })
  fs.writeFileSync(path.join(rootDir, 'build', 'index.css'), sassResult.css, 'utf8')
}

function copyProjectJson(rootDir: string) {
  fs.writeFileSync(
    path.join(rootDir, 'build', 'package.json'),
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'),
    'utf8'
  )
}
