import mysql from 'mysql2/promise';

const config = {
    host:'localhost',
    user:'chat',
    password:'chat',
    database:'chat'
}

const pool = mysql.createPool(config);

export default function query(sql:string,params?:any){
    return new Promise( async (resolve,reject)=>{
        const conn = await pool.getConnection()
        conn.query(sql,params).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        }).finally(()=>{
            conn.release()
        })
    })
}