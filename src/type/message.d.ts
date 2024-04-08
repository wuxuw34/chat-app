import {MESSAGE_TYPE} from "@/enums";

type MessageBodyType = {
    type: MESSAGE_TYPE,
    data: {
        url?: string,
        content?: any,
        callInfo?:any
    }
}

export  type MessageType = {
    id?:number
    body:MessageBodyType // 消息体
    time:string // 消息发送时间
    senderId:number // 消息发送人
    receiver:number // 消息接收者,
    isGroup?:string // 是否是群
    replay?:number[] // 回复消息
    token?:string|null
    own?:boolean
}