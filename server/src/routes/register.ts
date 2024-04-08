import {Next} from "koa";
import query from "../utils/database";

export default {
    fn: async (ctx: any, next: Next) => {
        const {
            email,
            password
        } = ctx.request.body
        console.log('用户注册', email, password)

        try {
            // 检查是否已经注册
            const hasEmailRes = await query('select * from user where email = ?', [email]) as any
            if (hasEmailRes.results.length) {
                ctx.body = {
                    state: 0,
                    msg: '邮箱已存在',
                }
            } else {
                const res = await query('insert into user (password,email) values (?,?)', [password, email]) as any
                const id = res.results.insertId
                ctx.body = {
                    state: 1,
                    msg: '注册成功',
                    data: {
                        account: id
                    }
                }
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                state: 0,
                msg: '注册失败',
            }
        }

        next()
    },
    method: 'post',
    path: '/register'
}