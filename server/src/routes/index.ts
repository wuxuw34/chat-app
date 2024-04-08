import * as fs from 'fs'
import Router from "koa-router";
import {IRouterModule} from "../types/router";
import path from "path";
import Application from "koa";
const router = new Router({
    prefix:'/api'
})

/**
 *  自动加载该文件夹下的接口文件
 * @param app
 */
export default function initRouter(app:Application) {
    fs.readdirSync(__dirname).forEach((file) => {
        if (file !== 'index.ts') {
            const fpath = `${__dirname+path.sep+file}`
            import(fpath).then((r:{
                default:IRouterModule
            }) => {
                const res = r.default
                router[res.method](res.path, res.fn)
            })
        }
    })
    app.use(router.routes()).use(router.allowedMethods())
}