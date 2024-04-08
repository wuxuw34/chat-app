import {Context, Next} from "koa";
import {createGroup} from "../services/group";
import {createRequestResult} from "../utils/createRequestResult";
import {requestAddFriend} from "../services/friend";

export default {
    fn: async (ctx:Context,next:Next)=>{
        await next()

        const {type,data} = ctx.request.body as any
        const user_id = (ctx.request as any).user_id

        console.log(type,data)

        switch (type){
            case 'create':{
                const res = await createGroup(data.username) as any
                console.log('插入结果',res)

                if(res){
                    const id = res.results.insertId

                    console.log('id',id)

                    // 加入群聊
                    await requestAddFriend(user_id,id)
                    await requestAddFriend(id,user_id)

                    ctx.body = createRequestResult(1,'创建成功',{
                        id,
                        username:data.username
                    })
                }else{

                }
                break
            }
        }

    },
    method:'post',
    path:'/group'
}