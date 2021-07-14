import fs from "fs";
import path from "path";
import {StoryTemplate} from "./templates/story";

export const createDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

export const getDirectories = (rootDir: string) => {
    const distDir = path.join(rootDir, 'dist')
    const srcDir = path.join(rootDir, 'src')
    const componentsDir = path.join(srcDir, 'components')
    const storiesDir = path.join(srcDir, 'stories')
    const distStoriesDir = path.join(distDir, 'stories')
    const distComponentsDir = path.join(distDir, 'components')
    const styleDir = path.join(srcDir, 'style')
    const distStyleDir = path.join(distDir, 'style')

    return {distDir, srcDir, componentsDir, storiesDir, distStyleDir, distStoriesDir, distComponentsDir, styleDir}
}

export const createDirs = (rootDir: string) => {
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
    createDir(srcDir)
    createDir(componentsDir)
    createDir(styleDir)
    createDir(storiesDir)
    createDir(distDir)
    createDir(distStoriesDir)
    createDir(distComponentsDir)
    createDir(distStyleDir)
}

export const createMissingStories = (rootDir: string) => {
    const {
        componentsDir,
        storiesDir,
    } = getDirectories(rootDir)
    fs.readdirSync(componentsDir).filter((f: string) => f.endsWith('.tsx')).forEach(c => {
        const name = c.replace(".tsx", "")
        if (!fs.existsSync(path.join(storiesDir, `${name}Story.tsx`)))
            fs.writeFileSync(path.join(storiesDir, `${name}Story.tsx`), StoryTemplate(name), "utf8")
    })
}
