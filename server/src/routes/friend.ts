import {Context, Next} from "koa";
import {checkAddFriend, requestAddFriend} from "../services/friend";
import {websocketEvents} from "../websocket";
import {MESSAGE_TYPE, MessageType} from "../types/message";
import {getUserInfoByAccount} from "../services/user";
import {createRequestResult} from "../utils/createRequestResult";

export default {
    fn: async (ctx: Context, next: Next) => {

        await next()

        const body = ctx.request.body
        const user_id = (ctx.request as any).user_id
        const {type, data} = body as any

        switch (type) {
            case 'add': {
                const friend_id = data.id

                // 检测重复添加
                const checkRes = await checkAddFriend(user_id, friend_id)
                if (checkRes) {
                    ctx.body = createRequestResult(1, '请勿重复添加')
                    return
                }

                const res = await requestAddFriend(user_id, friend_id)
                if (res) {
                    const userInfo = await getUserInfoByAccount(user_id)
                    // 检查对方是否在线,在线推送给对方
                    const isOnline = websocketEvents.checkOnlineById(friend_id)
                    if (isOnline) {
                        await websocketEvents.pushMessage({
                            body: {
                                type: MESSAGE_TYPE.ADD_FRIEND,
                                data: userInfo
                            },
                            senderId: user_id,
                            receiver: friend_id
                        } as MessageType)
                    }
                    ctx.body =
                        createRequestResult(1, '请求成功')
                } else {
                    // 失败
                    ctx.body = createRequestResult(0, '请求添加好友失败')
                }

                break
            }
            case 'add_friend_confirm': {
                console.log(typeof data, data)
                const {result} = data as any
                console.log(result)

                if (result) {
                    // 确认添加
                    const res = await requestAddFriend(user_id, data.friend_id)
                    ctx.body = createRequestResult(1, '添加成功')
                } else {

                }

                break
            }
            case 'del': {

                break
            }
        }

    },
    method: 'post',
    path: '/friend'
}