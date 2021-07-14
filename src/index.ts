#!/usr/bin/env node
import {generateDist, watchAndGenerate} from "./gcl";
import {build} from "./build";
import {init} from "./init";
import {buildVite, vite} from "./vite";

const rootDir = process.argv[3]
const command = process.argv[2]

;(async () => {
    if (command === "start") {
        watchAndGenerate(rootDir)
        await vite(rootDir)
    } else if (command === "build") {
        generateDist(rootDir)
        build(rootDir)
    } else if (command === "init")
        init(rootDir)
    else if (command === "bundle"){
        generateDist(rootDir)
        await buildVite(rootDir)
    }
})()


