import query from "../utils/database";

export async function createGroup(username:string){

    const res = await query('insert into user(username,password,isGroup) values(?,"",true)',[username])

    return res

}

export async function getAllUsersByGroupId(id:string){
    const res:any = await query('select * from friends where friend_id in (select  user_id from friends where friend_id=?) and user_id=?',[id,id])
    return res.results
}