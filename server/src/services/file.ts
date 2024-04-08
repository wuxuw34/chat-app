import * as fs from "fs";

export async function readFile(path:string){
    return new Promise((resolve)=>{
        fs.readFile(process.cwd()+path,(err:any,data:Buffer)=>{
            if(err){
                resolve(null)
            }else{
                resolve(data)
            }
        })
    })
}

export function getFileType(path:string){
    fs.stat(process.cwd()+path,(err:any,data:fs.Stats)=>{
        console.log(data)
    })
}