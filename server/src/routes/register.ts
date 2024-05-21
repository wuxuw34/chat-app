import {Next} from "koa";
import query from "../utils/database";

export default {
    fn: async (ctx: any, next: Next) => {
        const {
            email,
            password,
            username
        } = ctx.request.body
        console.log('用户注册', email, password,username)

        try {
            // 检查是否已经注册
            const hasEmailRes = await query('select * from users where email = ?', [email]) as any
            console.log(hasEmailRes)
            if (hasEmailRes && hasEmailRes[0].length) {
                ctx.body = {
                    state: 0,
                    msg: '邮箱已存在',
                }
            } else {
                const res = await query('insert into users (username,password,email) values (?,?,?)', [username,password, email]) as any

                console.log(res[0])
                const id = res[0].insertId
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