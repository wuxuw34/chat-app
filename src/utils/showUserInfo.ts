

export function showUserInfo(userInfo:any,key:any){

    const isBlank = (value:any)=>{
        return value||'未设置'
    }
    return isBlank(userInfo[key])
}