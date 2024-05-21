import {Next} from "koa";
import {checkUserByEmail, checkUserById, getUserInfoByAccount} from "../services/user";
import {ServerResultType} from "../types/message";
import {token} from "../utils/token";
import {checkRegExp, REGEXP_TYPE} from "../utils/regexp";
import {insertTokenIntoLogin} from "../services/token";
import logger from "../utils/logger";
import {getAddFriendRequests, getAddFriendRequestsForReceiver} from "../services/friend";
import {createRequestResult} from "../utils/createRequestResult";

export default {
    fn: async (ctx: any, next: Next) => {
        await next()
        // const {type, pageSize = 20} = ctx.query
        const user_id = ctx.request.user_id

        // 返回好友添加请求
        const friendRequests = await getAddFriendRequestsForReceiver(user_id)

        const usernameArrPromise =  friendRequests.map( (item: any) => {
            return getUserInfoByAccount(item.user_id)
        })

        const usernameArr = await Promise.all(usernameArrPromise)
        const handleFriendRequests = friendRequests.map( (item: any,index:number) => {
            item.username = usernameArr[index].username
            return item
        })

        // console.log(handleFriendRequests)
        ctx.body = createRequestResult(1, 'ok', {
            friend_request_list: handleFriendRequests
        })
    },
    method: 'get',
    path: '/notification'
}