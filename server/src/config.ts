import * as os from "os";
import checkPort from "./utils/checkPort";
import { v4 as uuidv4} from 'uuid'
import path from 'path'

export function getIPAddress() {
    console.log(os.networkInterfaces())
}

class ModuleConfig {

    port: number = 8080 // 服务器端口
    socketPort: number = 8081 // websocket端口
    secretKey:string = '' // 秘钥
    expiresIn:number = 3600
    savePath = process.cwd() + path.sep + 'static'

    constructor() {
    }

    async init():Promise<boolean> {
        return new Promise( async (resolve) => {
            this.port = await checkPort(this.port)
            this.socketPort = await checkPort(this.port+1)
            this.secretKey = uuidv4()
            resolve(true)
        })
    }

    getSecretKey(){
        return this.secretKey
    }

    getPort() {
        return this.port
    }

    getSocketPort() {
        return this.socketPort
    }
}

const config = new ModuleConfig()
export default config