import {MessageType} from "@/type/message";

export type UserType = {
    id: string,
    username: string,  // 群名或者用户名
    type?: string // 群或者好友类型
    avatar?:string
    remark?: string, // 备注
}

export type FriendType = UserType & {
    lastMessage?: MessageType, // 最新消息
    isGroup?:boolean,
    users?:UserType[]
}