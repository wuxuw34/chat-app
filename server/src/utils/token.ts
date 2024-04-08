import jwt from 'jsonwebtoken'
import config from "../config";

/**
 *  生成token
 * @param payload 包括用户id
 */
export function token(payload: object) {
    return jwt.sign(payload, config.getSecretKey(), {expiresIn:config.expiresIn})
}