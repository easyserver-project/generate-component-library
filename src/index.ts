#!/usr/bin/env node
import {generateDist} from "./gcl";
import {createServer} from 'vite'
import path from 'path'
import chokidar from 'chokidar'
import {build} from "./tsc";
import {init} from "./init";

const rootDir = process.argv[3]
const command = process.argv[2]

;(async () => {
    if (command === "start") {
        const watcher = chokidar.watch(path.join(rootDir, "src"), {ignored: /^\./, persistent: true});

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
        const server = await createServer({
            root: path.join(rootDir, "dist"),
            server: {
                port: 1337
            }
        })
        await server.listen()
    } else if (command === "build")
        build(rootDir)
    else if (command === "init")
        init(rootDir)
})()


