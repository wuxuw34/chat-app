import {Context, Next} from "koa";
import {getIdByToken} from "../services/token";
import {createRequestResult} from "../utils/createRequestResult";

export default async (ctx: Context, next: Next) => {
    ctx.set('Access-Control-Allow-Origin', "*")

    const {method, body, query} = ctx.request

    let token = null


    if (method.toLowerCase() === 'post') {
        token = (body as any).token

    } else if (method.toLowerCase() === 'get') {

        token = (query as any).token

    }

    if (token) {
        const res = await getIdByToken(token);
        if (!res.user_id) {
            ctx.body = createRequestResult(0, '无效token')
        }
        (ctx.request as any).user_id = res.user_id
    } else {
        if (!ctx.request.url.search('login')) {
            ctx.body = createRequestResult(0, '缺失token参数')
        }
    }
    await next()
}