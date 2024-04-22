import {v4 as uuidv4} from 'uuid'

/**
 *  防抖函数
 * @param fn 需要执行的函数
 * @param delay 间隔时间 默认1000
 */
export function debounce(fn: any, delay: number = 1000) {
    let timer: null | number = null

    return function () {
        // @ts-ignore
        const that: any = this
        const args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(fn.bind(that, args), delay)
    }
}

export function uuid() {
    return uuidv4()
}

export function getFileSize(size: number) {
    const sizes = ['KB', "MB", "GB"]
    let num = size, flag = 0
    num /= 1024
    while (true) {
        const _num = num / 1024
        if (_num >= 1) {
            num = _num
            flag++
        } else {
            break
        }
    }
    return num.toFixed(2)+sizes[flag]
}