import {Next} from "koa";

export default {
    fn:(ctx:any,next:Next)=>{
        ctx.body = 'Hello World'
        next()
    },
    method:'get',
    path:'/test'
}