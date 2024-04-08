import {MessageType} from "../types/message";
import query from "../utils/database";
import {stringToUTF16, utf16ToString} from "../utils/message";

/**
 *  更新已读消息
 * @param mid 已读消息id
 * @param uid 当前用户id
 * @param fid 聊天对象id
 */
export function updateReadMessage(mid: string, uid: string, fid: string) {
    return new Promise((resolve) => {
        query('update friends set read_message_id = ? where user_id = ? and friend_id = ?', [mid, uid, fid]).then(res => {
            resolve(res)
        })
    })
}

export function insertMessage(message: MessageType) {
    return new Promise((resolve) => {
        query('insert into messages (time,senderId,body,receiver,reply) values(?,?,?,?,?)', [
            message.time,
            message.senderId,
            utf16ToString(JSON.stringify(message.body)),
            message.receiver,
            message.replay
        ]).then((res: any) => {
            resolve(res.results)
        })
    })
}

/**
 *  获取某个账号所有id
 * @param user_id
 */
export async function getAllMessageById(user_id: string) {
    const res = await query('select * from messages where senderId = ? or receiver = ?', [user_id, user_id]) as any
    // 处理
    return res.results.map((item: any) => {
        item.body = stringToUTF16(item.body)
        return item
    })
}

export async function getHistoryMessageById(user_id: string, friend_id: string) {
    const res: any = await query('select * from messages where (senderId = ? and receiver = ?) or (senderId = ? and receiver = ?)', [user_id, friend_id, friend_id, user_id])
    return res.results.map((item: any) => {
        item.body = stringToUTF16(item.body)
        return item
    })
}