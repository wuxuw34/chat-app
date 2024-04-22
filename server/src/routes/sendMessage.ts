import {Context, Next} from "koa";
import {insertMessage} from "../services/message";
import {MessageType} from "../types/message";
import {websocketEvents} from "../websocket";

export default {
    fn: async (ctx: Context, next: Next) => {

        await next()
        const user_id = (ctx.request as any).user_id

        const message = ctx.request.body as MessageType

        message.senderId = user_id
        let res: any = null

        if (message.token) {
            message!.token = null
        }
        if (message.body.data.callInfo) {
            await websocketEvents.pushMessage(message, false)
        } else {
            if (message.body.data.file) {
                message.body.data.url = 'api/static/' + message.body.data.file
                delete message.body.data.file
            }
            if (message.body.data.url || message.body.data.content) {
                res = await insertMessage(message)
            }
            await websocketEvents.pushMessage(message)
        }
        if (res) {
            ctx.body = {
                state: 1,
                msg: '发送成功'
            }
        } else {
            ctx.body = {
                state: 0,
                msg: '发送失败'
            }
        }

    },
    method: 'post',
    path: '/sendMessage'
}