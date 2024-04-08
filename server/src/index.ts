import Koa from 'koa'
import initRouter from "./routes";
import {createServer} from "http";
import initWebsocket from "./websocket";
import initMiddleWares from "./middlewares";
import koaBody from 'koa-body'
import cors from '@koa/cors'
import config, {getIPAddress} from "./config";

const app = new Koa()
const httpServer = createServer(app.callback())

// 加载配置
config.init().then((r) => {
    if (r) {
        app.use(koaBody({
            multipart:true
        }))
        app.use(cors({
            origin: '*'
        }))
        initMiddleWares(app)
        initRouter(app)
        initWebsocket(httpServer)
        httpServer.listen(config.getPort(), () => {
            console.log(`服务器在端口${config.getPort()}上启动`)
        })
    }
})


