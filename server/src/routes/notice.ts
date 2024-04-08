import {Next} from "koa";
import {getAddFriendRequests} from "../services/friend";

export default {
    fn:async (ctx:any,next:Next)=>{
        await next()
        const user_id = ctx.request.user_id
        const noticeList = []
        // 获取消息
        // 获取请求添加好友消息
        const requests =  await getAddFriendRequests(user_id)  as []|null
        if(requests){

        }

    },
    method:'get',
    path:'/notice'
}