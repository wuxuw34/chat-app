import query from "../utils/database";
import logger from "../utils/logger";

/**
 * 请求添加好友,插入数据库
 * @param user_id
 * @param friend_id
 */
export async function requestAddFriend(user_id: string, friend_id: string) {
    console.log(user_id,'添加',friend_id)
    let res = null
    try {
        const flag = await checkAddFriend(user_id,friend_id)
        if(!flag) res = await query('insert into friends (user_id,friend_id,request_time) values(?,?,?)', [user_id, friend_id, new Date()])
    } catch (err) {
        logger.error(`用户${user_id}准备添加用户${friend_id}好友失败:${err}`)
    }
    return res
}

/**
 *  获取好友请求
 * @param account
 */
export async function getAddFriendRequests(account: string) {

    let res: any = null
    try {
        res = await query('select * from friends where friend_id not in (select user_id from friends where friend_id = ?) and friend_id <> ?; ', [account, account])
    } catch (err) {
        logger.error(`${account}查找好友请求失败:${err}`)
    }
    return res[0]
}

/**
 *  接收方查询未被允许的好友请求
 * @param account
 */
export async function getAddFriendRequestsForReceiver(account: string) {

    let res: any = null
    try {
        res = await query('select * from friends where user_id not in (select friend_id from friends where user_id = ?) and friend_id = ?; ', [account, account])
    } catch (err) {
        logger.error(`${account}查找好友请求失败:${err}`)
    }
    return res[0]
}

/**
 * 检测正在添加好友
 */
export async function checkAddFriend(user_id: string, friend_id: string) {
    const res = await query('select * from friends where user_id = ? and friend_id = ?', [user_id, friend_id]) as any
    return res[0].length > 0
}

/**
 *  获取所有好友
 * @param user_id
 */
export async function getAllFriendsById(user_id:string){
    let res = null
    try{
        res = await query('select * from users where id in (select user_id from friends where user_id in (select friend_id from friends where user_id = ?) and friend_id = ?)',[user_id,user_id]) as any

    }catch (err){
        logger.error(`${user_id}查询所有好友出错:${err}`)
    }
    return res[0]
}