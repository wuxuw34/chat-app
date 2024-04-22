/**
 *  测试是否为邮箱
 * @param email 邮箱字符串
 */
export function checkEmail(email: string) {
    const emailReg = /^([\w_-]+)@([\w-]+)\.(\w{2,6})$/
    return emailReg.test(email)
}

/**
 * 检测密码强度
 * @param pwd
 */
export function checkPasswordStrength(pwd: string) {
    const integerTest = /[\d]+/
    const lowercaseLettersTest = /[a-z]+/
    const uppercaseLettersTest = /[A-Z]+/
    const specialTest = /\W+/

    let strength = 0
    if (integerTest.test(pwd)) strength++
    if (lowercaseLettersTest.test(pwd)) strength++
    if (uppercaseLettersTest.test(pwd)) strength++
    if (specialTest.test(pwd)) strength++
    return strength
}