import {Next} from "koa";
import {getAllMessageById, getHistoryMessageById, updateReadMessage} from "../services/message";
import {handleMessageById} from "../utils/message";
import {createRequestResult} from "../utils/createRequestResult";
import {machine} from "os";

export default {
    fn: async (ctx: any, next: Next) => {
        await next()

        const {type, pageSize = 20} = ctx.query
        const user_id = ctx.request.user_id


        switch (type) {
            case "all": {

                const res = await getAllMessageById(user_id) as any[]

                const r = handleMessageById(res,user_id,pageSize)

                // 只返回pageSize条

                ctx.body = createRequestResult(1, '消息获取成功', Object.fromEntries(r.entries()))

                break
            }
            case 'history': {
                const friend_id = ctx.query.friend_id
                const mid = ctx.query.mid
                console.log('消息',mid)
                const res = await getHistoryMessageById(user_id, friend_id)
                const r = handleMessageById(res,user_id,pageSize,mid)

                ctx.body = createRequestResult(1, '历史消息获取成功', Object.fromEntries(r.entries()))

                break
            }
            case 'read':{
                // 消息id，用户id
                const {mid,id} = ctx.query
                const res =  await updateReadMessage(mid,user_id,id)
                ctx.body = createRequestResult(1)
                break
            }
        }

    },
    method: 'get',
    path: '/message'
}