import {Next} from "koa";

export default {
    fn:(ctx:any,next:Next)=>{
        const body = ctx.request.body
        console.log('获取群组用户接口',ctx.request.body)
        next()
    },
    method:'get',
    path:'/getGroupUserList'
}