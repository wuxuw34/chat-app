import {Next} from "koa";
import config from "../config";
import * as fs from "fs";
import logger from "../utils/logger";
import path from "path";
import {createRequestResult} from "../utils/createRequestResult";

export default {
    fn: async (ctx: any, next: Next) => {
        await next()
        const files = ctx.request.files

        console.log(files.file.originalFilename,files.file)

        console.log(files.file.originalFilename)

        if (!fs.existsSync(config.savePath)) {
            fs.mkdir(config.savePath, (err) => {
                if (err) logger.error(`目录${config.savePath}创建失败:${err}`)
            })
        }
        fs.copyFile(files.file.filepath, config.savePath+path.sep+files.file.originalFilename, (err) => {
            if (err) logger.error(`文件复制失败:${err}`)
        })


        ctx.body = createRequestResult(1)
    },
    method: 'post',
    path: '/upload'
}