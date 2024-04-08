import  {Context, Next} from "koa";

export interface IRouterModule{
    method:'get'|'post'|'put'|'delete',
    fn:(ctx:Context,next:Next)=>void,
    path:string
}