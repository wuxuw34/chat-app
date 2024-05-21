import {defineStore} from "pinia";
import {MessageType} from "@/type/message";
import useFriendsStore from "@/stores/friendsStore.ts";
import apis from "@/services/apis.ts";
import {onMounted, ref} from "vue";
import worker from "@/utils/webworker.ts";
import {SOCKET_EVENTS} from "@/utils/websocket.ts";
import {useStorage} from "@/hooks/useStorage.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import {MESSAGE_TYPE} from "@/enums";
import {usePeer} from "@/hooks/usePeer.ts";
import {NOTIFICATION_TYPE, useNoticeStore} from "@/stores/noticeStore.tsx";
import {id} from "element-plus/es/locale";

export const useMessageStore = defineStore('message', () => {

    const messageMap = ref<Map<string, MessageType[]>>()
    const messageStorage = useStorage('messages')
    const friendsStore = useFriendsStore()
    const userinfoStore = useUserInfoStore()
    const noticeStore = useNoticeStore()
    const events = new Set()
    const usepeer = usePeer()

    onMounted(() => {
        initOnOffline()
        worker.addEventListener('message', (event: MessageEvent) => {
            const socketMessage = JSON.parse(event.data)
            switch (socketMessage.type) {
                case SOCKET_EVENTS.MESSAGE: {
                    const data = JSON.parse(socketMessage.data)
                    const receiver = data.receiver_id, senderId = data.sender_id
                    const type = data.body.type

                    if (type === MESSAGE_TYPE.ADD_FRIEND) {
                        noticeStore.addNotice(NOTIFICATION_TYPE.ADD_FRIEND,{
                            username:data.body.data.username,
                            sender_id:data.body.data.id
                        })
                        return
                    }

                    const isGroup = friendsStore.isGroup(receiver)
                    let id = null

                    console.log('数据', data)
                    if (data.body.type === MESSAGE_TYPE.ADD_FRIEND) {
                        noticeStore.addNotice(NOTIFICATION_TYPE.ADD_FRIEND, data.body.data.username, data.senderId)
                        return
                    }

                    // 是群则按照接收方分类
                    if (isGroup) {
                        id = receiver
                        if (!messageMap.value!.has(receiver)) {
                            messageMap.value!.set(receiver, [])
                        }
                        const m = messageMap.value?.get(receiver.toString()) || []
                        m.push(data)
                        messageMap.value!.set(receiver, m)
                    } else {
                        console.log('------- 接收消息 ------')
                        console.log(senderId, receiver)

                        if (senderId == userinfoStore.info.id || receiver == userinfoStore.info.id) {
                            id = senderId === userinfoStore.info.id ? receiver : senderId

                            if (!messageMap.value!.has(id)) {
                                messageMap.value!.set(id, [])
                            }
                            const callInfo = data.body.data.callInfo

                            console.log('类型', type)
                            if (callInfo || data.body.data.sdp || data.body.data.candidate) {
                                if (type === MESSAGE_TYPE.CALL) {
                                    console.log(senderId, '打电话给', receiver)
                                    usepeer.connect(senderId, true)
                                    usepeer.setAnswerCallFn(() => {
                                        console.log('接电话')
                                        usepeer.createOffer(senderId)
                                    })
                                } else if (type === MESSAGE_TYPE.OFFER) {
                                    console.log('返回answer')
                                    usepeer.createAnswer(senderId, data.body.data.sdp)
                                } else if (type === MESSAGE_TYPE.CANDIDATE) {
                                    console.log('candidate')
                                    usepeer.setCandidate(senderId, data.body.data.candidate)
                                } else if (type === MESSAGE_TYPE.ANSWER) {
                                    console.log('answer')
                                    usepeer.setAnswer(senderId, data.body.data.sdp)
                                } else if (type === MESSAGE_TYPE.HANG_UP) {
                                    usepeer.closeCall()
                                }
                                console.log('正在打电话中....')
                            } else if (data.body.data.content || data.body.data.url) {
                                const m = messageMap.value?.get(id) || []
                                data.own = (Number(data.sender_id) == Number(userinfoStore.info.id))
                                m.push(data)
                            } else if (type === MESSAGE_TYPE.RECALL) {
                                deleteOneMessage(data.sender_id, data.body.data.mid)
                                deleteOneMessage(data.receiver_id, data.body.data.mid)
                            }
                        }
                    }
                    trigger(id, data)
                    // messageStorage.$map_set(messageMap.value)
                    break
                }
            }
        })
    })

    function addMessageToClient(key: string, messages: MessageType[]) {
        const old = messageMap.value?.get(key) as MessageType[]
        for (let i = 0; i < old.length; i++) {
            messages.push(old[i])
        }
        messageMap.value?.set(key, messages)
        messageStorage.$map_set(messageMap.value)
    }

    function setMessageOwn() {

    }

    function deleteOneMessage(id: string, mid: string) {
        id = String(id)
        if (messageMap.value?.has(id)) {
            console.log('数组', messageMap.value?.get(id))
            const index = messageMap.value?.get(id).findIndex(item => item.id == mid)
            console.log('超找到的index', index, 'mid', mid, '值为', messageMap.value?.get(id)[index])
            messageMap.value?.get(id).splice(index, 1)
        }
    }

    function initOnOffline() {
        if (messageStorage.isMap) {
            messageMap.value = messageStorage.value as Map<string, any>
        } else {
            messageMap.value = new Map()
        }
    }

    function setMessageMap(key: string, messages: MessageType[]) {
        messageMap.value!.set(key, messages.map(item => {
            item.own = (Number(item.sender_id) == Number(userinfoStore.info.id))
            return item
        }))

        if (messages.length) {
            friendsStore.setLastMessage(key, messages[messages.length - 1])
        }

        messageStorage.$map_set(messageMap.value)
    }

    /**
     *  发送消息
     * @param params 参数
     * @param callback 回调函数
     */
    function sendMessageToServer(params: any, callback: any) {
        apis.sendMsg(params).then((res) => {
            callback(res.data)
        })
    }

    function trigger(id: string, message: MessageType) {
        events.forEach((fn: any) => {
            fn(id, message)
        })
    }

    function onMessageUpdate(fn: (id: string, message: MessageType) => void) {
        events.add(fn)
    }

    return {
        setMessageMap,
        messageMap,
        sendMessageToServer,
        initOnOffline,
        onMessageUpdate,
        addMessageToClient
    }

})