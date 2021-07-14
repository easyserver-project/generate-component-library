import {createServer, build} from "vite";
import path from "path";

export const vite = async (rootDir: string)=>{
    const server = await createServer({
        root: path.join(rootDir, "dist"),
        server: {
            port: 1337
        }
    })
    await server.listen()
}

export const buildVite = async (rootDir: string)=>{
    await build({root: path.join(rootDir, "dist"), build:{outDir: "../bundle"} })
}
