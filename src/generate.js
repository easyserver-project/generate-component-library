#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const src = path.join(root, "src")
const storiesRoot = path.join(src, 'stories')

const generate = process.argv[3] === 'generate' || !process.argv[3]
const restore = process.argv[3] === 'restore' || !process.argv[3]
const index = process.argv[3] === 'index' || !process.argv[3]

if (generate) {
  const stories = fs.readdirSync(storiesRoot).filter((f) => f.endsWith('Story.tsx'))
  const copyfile = (file) => {
    if (!fs.existsSync(path.join(src, file)))
      fs.writeFileSync(
        path.join(src, file),
        fs.readFileSync(path.join(__dirname, file), 'utf8'),
        'utf8'
      )
  }

  for (const story of stories) {
    const content = fs.readFileSync(path.join(storiesRoot, story), 'utf8')
    const match = content
      .match(/<Example>(.*?)<\/Example>/gs)
      .map((m) => m.match(/<Example.*?>(.*?)<\/Example>/s)[1])
    let code = content
    match.forEach((m) => {
      code = code.replace('<Example>', `<Example code={\`${m.replace(/\`/g, '\\`')}\`}>`)
    })
    fs.writeFileSync(path.join(storiesRoot, story + '.bak'), content, 'utf8')
    fs.writeFileSync(path.join(storiesRoot, story), code, 'utf8')
  }

  copyfile('App.tsx')
  copyfile('Nav.tsx')
  copyfile('Example.tsx')
  copyfile('main.tsx')
}

if (restore) {
  const stories = fs.readdirSync(storiesRoot).filter((f) => f.endsWith('Story.tsx'))
  for (const story of stories) {
    const content = fs.readFileSync(path.join(storiesRoot, story + '.bak'), 'utf8')
    if (content) {
      fs.unlinkSync(path.join(storiesRoot, story))
      fs.writeFileSync(path.join(storiesRoot, story), content, 'utf8')
      fs.unlinkSync(path.join(storiesRoot, story + '.bak'))
    }
  }
}

if (index) {
  const stories = fs.readdirSync(storiesRoot).filter((f) => f.endsWith('Story.tsx'))
  const storyIndexCode = `${stories
    .map((story) => `export { ${story.replace('.tsx', '')} } from './${story.replace('.tsx', '')}'`)
    .join('\n')}`
  fs.writeFileSync(path.join(storiesRoot, 'index.ts'), storyIndexCode, 'utf8')
}

if (!fs.existsSync(path.join(root, 'index.html')))
  fs.writeFileSync(
      path.join(root, 'index.html'),
      fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'),
      'utf8'
  )
