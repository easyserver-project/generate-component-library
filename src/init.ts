import {createDir, createMissingStories, getDirectories} from "./util";
import path from "path";
import {AppTemplate} from "./templates/app";
import {NavTemplate} from "./templates/nav";
import {ExampleTemplate} from "./templates/example";
import {HtmlTemplate} from "./templates/html";
import {TsConfigTemplate} from "./templates/tsconfig";
import fs from "fs";


export const init = (rootDir: string) => {
    const {
        componentsDir,
        storiesDir,
        styleDir,
        srcDir
    } = getDirectories(rootDir)

    const copyFileIfNotExists = (file: string, template: string) => {
        if (!fs.existsSync(path.join(srcDir, file)))
            fs.writeFileSync(path.join(srcDir, file), template, 'utf8')
    }

    createDir(srcDir)
    createDir(componentsDir)
    createDir(styleDir)
    createDir(storiesDir)

    if (!fs.existsSync(path.join(srcDir, "index.html")))
        fs.writeFileSync(path.join(srcDir, "style", "index.scss"), "", 'utf8')
    copyFileIfNotExists('App.tsx', AppTemplate)
    copyFileIfNotExists('./components/Nav.tsx', NavTemplate)
    copyFileIfNotExists('Example.tsx', ExampleTemplate)
    copyFileIfNotExists('index.html', HtmlTemplate)
    copyFileIfNotExists('../tsconfig.json', TsConfigTemplate)

    createMissingStories(rootDir)
}
