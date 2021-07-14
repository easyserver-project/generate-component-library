import {MainTemplate} from './templates/main'
import fs from 'fs'
import path from 'path'
import {createDirs, createMissingStories, getDirectories} from "./util";

export const generateDist = (rootDir: string) => {
    const {
        distDir,
        distStyleDir,
        distStoriesDir,
        distComponentsDir,
        componentsDir,
        storiesDir,
        styleDir,
        srcDir
    } = getDirectories(rootDir)
    createDirs(rootDir)

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

    createMissingStories(rootDir)
}


