import {generateDist} from "./gcl";
import {createServer} from 'vite'
import path from 'path'
import chokidar from 'chokidar'

const rootDir = process.argv[2]

;(async () => {
    const watcher = chokidar.watch(path.join(rootDir, "src"), {ignored: /^\./, persistent: true});

    watcher
        .on('add', function(path) {generateDist(rootDir)})
        .on('change', function(path) {generateDist(rootDir)})
        .on('unlink', function(path) {generateDist(rootDir)})
        .on('error', function(error) {generateDist(rootDir)})
    generateDist(rootDir)
    const server = await createServer({
        root: path.join(rootDir, "dist"),
        server: {
            port: 1337
        }
    })
    await server.listen()
})()


