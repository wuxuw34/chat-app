import query from "../utils/database";
import {FieldInfo} from "mysql";
import logger from "../utils/logger";

/**
 *  检查账号密码是否匹配以及用户是否存在
 * @param account 账号
 * @param password 密码
 * @return 账号验证状态 1 -- 成功 0 --- 失败 -1 -- 查询失败（不存在）
 */
export function checkUserById(account: string, password: string) {
    return new Promise((resolve) => {
        query('select * from users where id = ? and password = ?', [account, password]).then((result: any, fields?: FieldInfo[]) => {
            if (result[0].length !== 0) {
                resolve(result[0][0])
            } else {
                resolve(0)
            }
        })
    })
}

export function checkUserByEmail(account: string, password: string) {
    return new Promise((resolve) => {
        query('select * from users where email = ? and password = ?', [account, password]).then((result: any, fields?: FieldInfo[]) => {

            if (result[0].length !== 0) {
                logger.info(`账号${account}的id为${result[0][0].id}`)
                resolve(result[0][0].id)
            } else {
                resolve(0)
            }
        })
    })
}

/**
 *  获取用户信息
 * @param account 账号
 */
export async function getUserInfoByAccount(account: string) {
    let res: any = null

    try {
        res = await query('select * from users where id = ?', [account])
    } catch (err) {
        logger.error(`查询用户id${account}失败:${err}`)
    }
    if (res && res[0].length > 0) {
        delete res[0][0].password
    }

    return res[0][0]
}

export async function queryUserByKeyWord(keyword: string) {
    const res: any = await query('select * from users where username like ?', [`%${keyword}%`])
    return res[0]
}