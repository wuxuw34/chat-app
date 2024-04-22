import {defineStore} from "pinia";
import {MessageType} from "@/type/message";
import useFriendsStore from "@/stores/friendsStore.ts";
import apis from "@/services/apis.ts";
import {onMounted, ref, watch} from "vue";
import worker from "@/utils/webworker.ts";
import {SOCKET_EVENTS} from "@/utils/websocket.ts";
import {useStorage} from "@/hooks/useStorage.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import message from "../../server/src/routes/message.ts";
import {MESSAGE_TYPE} from "@/enums";
import {usePeer} from "@/hooks/usePeer.ts";

export const useMessageStore = defineStore('message', () => {

    const messageMap = ref<Map<string, MessageType[]>>()
    const messageStorage = useStorage('messages')
    const friendsStore = useFriendsStore()
    const userinfoStore = useUserInfoStore()
    const events = new Set()
    const usepeer = usePeer()

    onMounted(() => {

        initOnOffline()
        worker.addEventListener('message', (event: MessageEvent) => {
            const socketMessage = JSON.parse(event.data)
            switch (socketMessage.type) {
                case SOCKET_EVENTS.MESSAGE: {
                    const data = JSON.parse(socketMessage.data)
                    const receiver = data.receiver, senderId = data.senderId

                    const isGroup = friendsStore.isGroup(receiver)
                    let id = null

                    console.log('数据', data)

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

                        if (senderId === userinfoStore.info.id || receiver === userinfoStore.info.id) {
                            id = senderId === userinfoStore.info.id ? receiver : senderId

                            if (!messageMap.value!.has(id)) {
                                messageMap.value!.set(id, [])
                            }
                            const callInfo = data.body.data.callInfo
                            const type = data.body.type
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
                                    usepeer.setCandidate(senderId, data.body.data.candidate)
                                } else if (type === MESSAGE_TYPE.ANSWER) {
                                    usepeer.setAnswer(senderId, data.body.data.sdp)
                                }
                                console.log('正在打电话中....')
                            }else if(data.body.data.content || data.body.data.url){
                                const m = messageMap.value?.get(id) || []
                                m.push(data)
                            }
                        }
                    }
                    trigger(id, data)
                    messageStorage.$map_set(messageMap.value)
                    break
                }
            }
        })
    })

    function initOnOffline() {
        if (messageStorage.isMap) {
            messageMap.value = messageStorage.value as Map<string, any>
        } else {
            messageMap.value = new Map()
        }
    }

    function setMessageMap(key: string, messages: MessageType[]) {
        messageMap.value!.set(key, messages)

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
        onMessageUpdate
    }

})