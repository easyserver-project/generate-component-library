#!/usr/bin/env node
import {AppTemplate} from './templates/app'
import {NavTemplate} from './templates/nav'
import {ExampleTemplate} from './templates/example'
import {MainTemplate} from './templates/main'
import {HtmlTemplate} from './templates/html'
import fs from 'fs'
import path from 'path'
import {StoryTemplate} from "./templates/story";

export const generateDist = (rootDir: string) => {
    const distDir = path.join(rootDir, 'dist')
    const srcDir = path.join(rootDir, 'src')
    const componentsDir = path.join(srcDir, 'components')
    const storiesDir = path.join(srcDir, 'stories')
    const distStoriesDir = path.join(distDir, 'stories')
    const distComponentsDir = path.join(distDir, 'components')
    const styleDir = path.join(srcDir, 'style')
    const distStyleDir = path.join(distDir, 'style')

    const createDir = (dir: string) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    createDir(srcDir)
    createDir(componentsDir)
    createDir(styleDir)
    createDir(storiesDir)
    createDir(distDir)
    createDir(distStoriesDir)
    createDir(distComponentsDir)
    createDir(distStyleDir)

    const copyFileIfNotExists = (file: string, template: string) => {
        if (!fs.existsSync(path.join(srcDir, file)))
            fs.writeFileSync(path.join(srcDir, file), template, 'utf8')
    }

    copyFileIfNotExists('App.tsx', AppTemplate)
    copyFileIfNotExists('./components/Nav.tsx', NavTemplate)
    copyFileIfNotExists('Example.tsx', ExampleTemplate)
    copyFileIfNotExists('index.html', HtmlTemplate)
    if (!fs.existsSync(path.join(srcDir, "index.html")))
        fs.writeFileSync(path.join(srcDir, "style", "index.scss"), "", 'utf8')

    const copyFileToDist = (file: string, replace?: { from: string; to: string }) => {
        const fileContent: string = fs.readFileSync(path.join(srcDir, file), 'utf8')
        fs.writeFileSync(
            path.join(distDir, file),
            replace ? fileContent.replace(replace.from, replace.to) : fileContent,
            'utf8'
        )
    }

    const stories = fs.readdirSync(storiesDir).filter((f: string) => f.endsWith('Story.tsx'))
    for (const story of stories) {
        const content = fs.readFileSync(path.join(storiesDir, story), 'utf8')
        const match = content
            .match(/<Example>(.*?)<\/Example>/gs)
            ?.map((m: any) => m.match(/<Example.*?>(.*?)<\/Example>/s)[1])
        let code = content
        match?.forEach((m: any) => {
            code = code.replace('<Example>', `<Example code={\`${m.replace(/\`/g, '\\`')}\`}>`)
        })
        fs.writeFileSync(path.join(distStoriesDir, story), code, 'utf8')
    }
    fs.writeFileSync(
        path.join(distStoriesDir, 'index.ts'),
        stories
            .map((story) => {
                const name = story.replace('.tsx', '')
                return `export {${name}} from './${name}'`
            })
            .join('\n'),
        'utf8'
    )

    copyFileToDist('Example.tsx')
    copyFileToDist('App.tsx', {
        from: 'const stories = {} // Template, DO NOT CHANGE!',
        to: "import * as stories from './stories'",
    })
    copyFileToDist('index.html')
    fs.readdirSync(componentsDir).forEach((c: string) => copyFileToDist(path.join('components', c)))
    fs.readdirSync(styleDir).forEach((c: string) => copyFileToDist(path.join('style', c)))
    fs.writeFileSync(path.join(distDir, 'main.tsx'), MainTemplate, 'utf8')

    fs.readdirSync(componentsDir).filter((f: string) => f.endsWith('.tsx')).forEach(c => {
        const name = c.replace(".tsx","")
        if (!fs.existsSync(path.join(storiesDir, `${name}Story.tsx`)))
            fs.writeFileSync(path.join(storiesDir, `${name}Story.tsx`), StoryTemplate(name), "utf8")
    })
}


