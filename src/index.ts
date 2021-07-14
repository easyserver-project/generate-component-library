#!/usr/bin/env node
import {watchAndGenerate} from "./gcl";
import {build} from "./tsc";
import {init} from "./init";
import {vite} from "./vite";

const rootDir = process.argv[3]
const command = process.argv[2]

;(async () => {
    if (command === "start") {
        watchAndGenerate(rootDir)
        await vite(rootDir)
    } else if (command === "build")
        build(rootDir)
    else if (command === "init")
        init(rootDir)
})()


