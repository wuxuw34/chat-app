import mysql, {FieldInfo, MysqlError, PoolConnection} from 'mysql'

const config = {
    host:'localhost',
    user:'chat',
    password:'chat',
    database:'chat'
}

const pool = mysql.createPool(config)

export default function query(sql:string,params?:any){
    return new Promise((resolve,reject)=>{
        pool.getConnection((err:Error,conn:PoolConnection)=>{
            if(err){
                reject(err)
            }else{
                conn.query(sql,params,(err:MysqlError|null,results:any,fields?:FieldInfo[])=>{
                    if(err){
                        reject(err)
                    }else {
                        resolve({results,fields})
                    }
                    conn.release()
                })
            }
        })
    })
}