

export function createRequestResult(state:0|1,msg?:string,data?:any){
    return {
        state,
        msg,
        data
    }
}