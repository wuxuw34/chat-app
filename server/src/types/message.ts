export enum MESSAGE_TYPE  {
    PIC, // 图片
    TEXT, // 文本
    VIDEO, // 视频
    AUDIO, // 语音
    CALL, // 语音电话
    VIDEO_CALL, // 视频电话
    ADD_FRIEND,
    OFFER, // 发送offer
    ANSWER, // 发送answer
    CANDIDATE, // 交换candidate
    REVOKE_CALL, // 撤回电话视频
    HANG_UP, // 挂断
    UNANSWERED, // 未接听
    FILE
}

type MessageBodyType = {
    type:MESSAGE_TYPE,
    data:{
        file?:any,
        content?:string
        url?:string,
        callInfo?:any
    }
}

export  type MessageType = {
    id?:string
    body:MessageBodyType // 消息体
    time:string // 消息发送时间
    senderId:string // 消息发送人
    receiver:string // 消息接收者,
    isGroup?:string // 是否是群
    replay?:string[] // 回复消息
    token?:string|null
    own?:boolean
}

// 服务器返回格式
export type ServerResultType = {
    state:0|1,
    msg?:string,
    data?:any
}