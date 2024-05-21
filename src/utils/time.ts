
export enum TIME_TYPE{
    MESSAGE
}

/**
 *  补齐0，返回字符串
 * @param num 需要补0的数字
 * @param cnt 需要补齐到多少位数
 */
function makeupZero(num:number,cnt:number = 2){

    const length = num.toString().length
    let res = ''

    if(length < cnt){
         for(let i=0;i<cnt-length;i++){
             res += '0'
         }
    }

    return res + num
}

export function handleTime(timestamp:number,type:TIME_TYPE=TIME_TYPE.MESSAGE){

    // const now = new Date().getTime()
    const day = new Date(Number(timestamp))
    const h = day.getHours(),m = day.getMinutes()

    switch (type){
        case TIME_TYPE.MESSAGE:{
            // 只显示小时和分钟
            return `${makeupZero(h)}:${makeupZero(m)}`
        }
    }

}