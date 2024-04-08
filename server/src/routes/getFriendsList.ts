import {Next} from "koa";
import {getAllFriendsById} from "../services/friend";
import {createRequestResult} from "../utils/createRequestResult";

export default {
    fn: async (ctx:any,next:Next)=>{

        await  next()

        const user_id = ctx.request.user_id

        const list = await getAllFriendsById(user_id) as any[]

        for (const item of list) {
            item.avatar = item.avatar?item.avatar:'/static/avatars/default.jpg'
            if(item.isGroup){
                item.users = await getAllFriendsById(item.id)
            }
        }

        ctx.body = createRequestResult(1,'',list)


    },
    method:'get',
    path:'/getFriendsList'
}