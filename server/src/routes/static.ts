import {Next} from "koa";
import {getFileType, readFile} from "../services/file";
import mime from 'mime-types'
import {getAudioWaveForm} from "../utils/audio";

export default {
    fn:async (ctx:any,next:Next)=>{
        const pathURL = ctx.url.replace("/api","")



        const buffer = await readFile(pathURL) as Buffer
        const mineType = mime.lookup(process.cwd()+pathURL)


        ctx.set('contentType',mineType)
        ctx.body = buffer
    },
    method:'get',
    path:'/static/(.*)'
}