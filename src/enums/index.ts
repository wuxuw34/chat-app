
export  enum UPDATE_TYPE  {
    ADD,
    ALTER,
    DELETE
}

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
}