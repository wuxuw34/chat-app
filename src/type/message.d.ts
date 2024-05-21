import {MESSAGE_TYPE} from "@/enums";

type MessageBodyType = {
    type: MESSAGE_TYPE,
    data: {
        url?: string, // 资源链接
        content?: any, // 文本内容
        callInfo?:any, // 音视频通话所携带的数据
        fileInfo?:any // 文件数据
    }
}

export  type MessageType = {
    id?:string
    body:MessageBodyType // 消息体
    time:string // 消息发送时间
    sender_id:number // 消息发送人
    receiver_id:number // 消息接收者,
    isGroup?:string // 是否是群
    replay?:number[] // 回复消息
    token?:string|null
    own?:boolean
}