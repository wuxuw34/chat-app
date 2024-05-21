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
        query('insert into messages (time,sender_id,body,receiver_id,reply) values(?,?,?,?,?)', [
            message.time,
            message.sender_id,
            utf16ToString(JSON.stringify(message.body)),
            message.receiver_id,
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
    const res = await query('select * from messages where sender_id = ? or receiver_id = ?', [user_id, user_id]) as any
    // 处理
    return res[0].map((item: any) => {
        item.body = stringToUTF16(item.body)
        return item
    })
}

export async function getHistoryMessageById(user_id: string, friend_id: string) {
    const res: any = await query('select * from messages where (sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)', [user_id, friend_id, friend_id, user_id])
    return res[0].map((item: any) => {
        item.body = stringToUTF16(item.body)
        return item
    })
}

/**
 *  删除某一个消息，必须验证发送人
 * @param mid 消息id
 * @param user_id 发送人id
 */
export async function deleteMessageById(mid: string, user_id: string) {
    const res: any = await query('delete from messages where id = ? and sender_id = ?', [mid, user_id])
    return res[0]
}

export async function getOneMessageById(mid: string) {
    const res: any = await query('select * from messages where id = ?', [mid])
    return res[0][0]
}