import {Next} from "koa";
import {checkUserByEmail, checkUserById} from "../services/user";
import {ServerResultType} from "../types/message";
import {token} from "../utils/token";
import {checkRegExp, REGEXP_TYPE} from "../utils/regexp";
import {insertTokenIntoLogin} from "../services/token";
import logger from "../utils/logger";

export default {
    fn: async (ctx: any, next: Next) => {
        const {account, password} = ctx.request.body
        console.log(`正在验证账号${account}和密码${password}`)
        let flag = 0 // 不是邮箱
        let res = null
        if (checkRegExp(REGEXP_TYPE.EMAIL, account)) {
            flag = 1
            res = await checkUserByEmail(account, password)
        } else {
            res = await checkUserById(account, password)
        }
        if (res) {
            const t =  token({
                id: res
            })
            console.log(t.length)
            await insertTokenIntoLogin(t,flag?res as string:account)
            ctx.body = {
                state: 1,
                msg: '登陆成功',
                data: {
                    token:t
                }
            } as ServerResultType
        } else {
            ctx.body = {
                state: 0,
                msg: '登陆失败',
            } as ServerResultType
        }
    },
    method: 'post',
    path: '/login'
}