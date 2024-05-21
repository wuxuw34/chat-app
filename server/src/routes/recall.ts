import {Next} from "koa";
import {deleteMessageById, getOneMessageById} from "../services/message";
import {createRequestResult} from "../utils/createRequestResult";
import {websocket, websocketEvents} from "../websocket";
import {MESSAGE_TYPE} from "../types/message";

export default {
    fn: async (ctx: any, next: Next) => {
        await next()
        const user_id = ctx.request.user_id
        const mid = ctx.request.body.mid

        const message = await getOneMessageById(mid)
        const res = await deleteMessageById(mid, user_id)

        if (res.affectedRows) {
            await websocketEvents.pushMessage({
                receiver_id:message.receiver_id,
                sender_id:message.sender_id,
                body:{
                    type:MESSAGE_TYPE.RECALL,
                    data:{
                        mid:mid
                    }
                },
                time:new Date().getTime().toString()
            })
            ctx.body = createRequestResult(1, '撤回成功')
        } else {
            ctx.body = createRequestResult(0, '消息不存在或者无权撤回该消息')
        }

    },
    method: 'post',
    path: '/recall'
}