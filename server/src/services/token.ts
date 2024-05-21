import query from "../utils/database";
import logger from "../utils/logger";


export async function insertTokenIntoLogin(token: string, id: string) {
    const res = await query('insert into login(user_id,token) values(?,?)', [id, token])
    logger.info('token插入到login表:' + res)
}

export async function getIdByToken(token: string) {
    const token_res = await query('select user_id from login where token = ?', [token]) as any
    return token_res[0][0]
}

/**
 * 验证token有效性
 * @param token
 */
export function checkToken(token: string) {

}