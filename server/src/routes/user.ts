import {Context, Next} from "koa";
import {getUserInfoByAccount, queryUserByKeyWord} from "../services/user";
import {UserType} from "../types/user";
import {createRequestResult} from "../utils/createRequestResult";

export default {
    fn: async (ctx: Context, next: Next) => {

        await next()

        const {query} = ctx
        const user_id = (ctx.request as any).user_id

        if (query.q) {
            // 关键字查询用户
            const queryResults = await queryUserByKeyWord(query.q as string) as UserType[]
            const res = queryResults.map(item => {
                item.avatar = !item.avatar ? '/static/avatars/default.jpg' : item.avatar
                return item
            })


            ctx.body = {
                state: 1,
                data: res
            }
        } else if(query.getUserInfo)  {
            // 获取用户信息
            const userInfo = await getUserInfoByAccount(user_id)

            ctx.body = createRequestResult(1,'获取成功',userInfo)
        }


    },
    method: 'get',
    path: '/user'
}