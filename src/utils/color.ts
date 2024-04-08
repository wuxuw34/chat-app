
const DialogColors = ['red', 'orange', 'violet', 'green', 'cyan', 'blue', 'pink']
const color = ['#CC5049', '#D67722', '#955CDB', '#40A920', '#309EBA', '#368AD1', '#C7508B']

/**
 *  根据id获取颜色
 * @param id
 */
export function getUserNameColorById(id:number){
    return color[Number(id)%7]
}