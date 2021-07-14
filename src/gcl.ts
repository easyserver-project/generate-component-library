import { MainTemplate } from './templates/main'
import fs from 'fs'
import path from 'path'
import { createDirs, createMissingStories, getDirectories } from './util'
import chokidar from 'chokidar'

export const watchAndGenerate = (rootDir: string) => {
  const watcher = chokidar.watch(path.join(rootDir, 'src'), { ignored: /^\./, persistent: true })

  watcher
    .on('add', function (path) {
      generateDist(rootDir)
    })
    .on('change', function (path) {
      generateDist(rootDir)
    })
    .on('unlink', function (path) {
      generateDist(rootDir)
    })
    .on('error', function (error) {
      generateDist(rootDir)
    })
  generateDist(rootDir)
}

export const generateDist = (rootDir: string) => {
  const { distDir, distStoriesDir, componentsDir, storiesDir, styleDir, srcDir } =
    getDirectories(rootDir)
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
    match?.forEach((example: string) => {
      const split = example.split(/\r?\n/).filter((d) => d.trim().length > 0)
      const subLength = split[0].length - split[0].trimStart().length
      const fixedSub = split.map(d=>d.substr(subLength)).join("\n")
      code = code.replace('<Example>', `<Example code={\`${fixedSub.replace(/\`/g, '\\`')}\`}>`)
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


