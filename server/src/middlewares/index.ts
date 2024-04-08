import Application, {Context, Next} from "koa";
import * as fs from "fs";
import path from "path";

export default function initMiddleWares(app: Application) {

    fs.readdirSync(__dirname).forEach((file:string)=>{
        if(file !== 'index.ts'){
            import(__dirname+path.sep+file).then((r:{default:any})=>{
                app.use(r.default)
            })
        }
    })

}