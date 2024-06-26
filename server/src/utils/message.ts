import {MESSAGE_TYPE, MessageType} from "../types/message";

/**
 *  按照id分类消息
 * @param m
 * @param user_id
 * @param pageSize
 * @param mid
 */
export function handleMessageById(m: MessageType[], user_id: string, pageSize: number = 20, mid?: string) {

    const map = new Map<string, MessageType[]>()
    let flag = 0


    for (let i = m.length - 1; i >= 0; i--) {
        const message = m[i]
        const id = message.sender_id === user_id ? message.receiver_id : message.sender_id
        const _mid = message.id

        if (mid) {
            if (String(_mid) === mid) {
                flag++
            }
            if (!flag) {
                continue
            }
            if (flag) {
                flag++
            }
            if(flag<=2){
                continue
            }
        }

        if (!map.has(id)) {
            map.set(id, [])
        }
        if (map.get(id)!.length >= pageSize) {
            continue
        }
        const _m = map.get(id) as MessageType[]
        _m.push(message)
        map.set(id, _m)
    }

    // 时间排序
    for (let key of map.keys()) {
        const m = map.get(key)
        if (m) map.set(key, m.reverse())
    }

    return map
}

/**
 *  mysql无法保存utf16编码的emoji
 * @param str
 */
export function utf16ToString(str: string) {

    let res = ''
    for (let i = 0; i < str.length; i++) {
        const s = str.slice(i).codePointAt(0) as number
        res += ('\\u' + s.toString(16))
        if (s > 0xffff) {
            i++
        }
    }
    return res
}

/**
 *  解密
 * @param str
 */
export function stringToUTF16(str: string) {

    const arr = str?.split('\\u').slice(1) || []
    let res = ''
    arr.forEach(item => {
        res += String.fromCodePoint(parseInt(item, 16))
    })
    return res
}