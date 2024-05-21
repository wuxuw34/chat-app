import * as net from "net";
import {exec} from "node:child_process";

export default function checkPort(port: number): Promise<number> {
    const check = (port: number) => {
        return new Promise((resolve) => {
            const server = net.createServer().listen(port)
            server.on('listening', () => {
                server.close()
                resolve(port)
            })
            server.on('error', (err: Error) => {
                console.log('出错',err)
                // exec('kill'+port,()=>{
                //     resolve(port)
                // })
                resolve(err)
            })
        })
    }

    const tryPort = (port: number, callback: (port: number) => void) => {
        check(port).then(r => {
            if (r instanceof Error) {
                port++
                tryPort(port, callback)
            } else {
                callback(port)
            }
        })
    }

    return new Promise((resolve) => {
        tryPort(port, (port: number) => {
            resolve(port)
        })
    })

}