import {Server} from "http";
import {MessageType} from "../types/message";
import {WebSocketServer} from 'ws'
import {checkUserById} from "../services/user";
import {getIdByToken} from "../services/token";
import {Socket, SOCKET_STATUS, UserSocket} from "./socket";
import logger from "../utils/logger";
import {token} from "../utils/token";
import {getAllFriendsById} from "../services/friend";

export let websocket: null | WebSocketServer = null
const rooms = {
    value: new Map<string, any[]>(),
    addRoom: (id: string) => {
        rooms.value.set(id, [])
    },
    addUserToRoom: (roomId: string, userSocket: UserSocket) => {
        const sockets = rooms.value.get(roomId) as UserSocket[] || []
        const isFind = sockets.find((socket: UserSocket) => socket.userId === userSocket.userId)
        if (!isFind) {
            rooms.value.set(roomId, [userSocket, ...rooms.value.get(roomId) || []])
        }
    },
    get: (id: string) => {
        const room = rooms.value.get(id) as []
        return {
            send: (message: any) => {
                room?.forEach((socket: UserSocket) => {
                    socket.socket?.send(message)
                })
            }
        }
    },
}
const sockets = new Map<string|number, UserSocket>()

export const websocketEvents = {
    checkOnlineById: (id: string) => {
        return sockets.get(id)
    },
    pushMessage: async (message: MessageType,self:boolean=true) => {
        const receiverId = String(message.receiver_id)
        const {is_group} = await checkUserById(receiverId, '') as {
            is_group: boolean
        }
        logger.info(`${message}是否是群消息:${is_group}`)
        if (is_group) {
            // 发送给所有在线用户
            rooms.get(receiverId).send(JSON.stringify(message))
        } else {
            // 不是群组则是好友，只需要发送给receiver
            console.log('receiver',receiverId,sockets.get(receiverId))
            sockets.get(receiverId)?.socket?.send(JSON.stringify(message))
            self && sockets.get(String(message.sender_id))?.socket?.send(JSON.stringify(message))
        }
    }
}

export default function initWebsocket(httpServer: Server<any>) {
    rooms.value.set('default', [])
    websocket = new WebSocketServer({server: httpServer})
    websocket.on('connection', async (ws: Socket) => {

        if (ws.user && ws.user.token) {
            const id = String(await getIdByToken(ws.user.token))
            if (id) {
                ws.user.userId = id
                sockets.set(id, ws.user)
            }
        }

        // 添加token到socket上
        ws.onmessage = async ({data}) => {
            const d = JSON.parse(data)

            if (d.data && d.data.token) {
                const user = await getIdByToken(d.data.token)
                if(!user || !user.user_id){
                    return
                }
                const _id = user.user_id
                const id = String(_id)
                if (id) {
                    const userSocket = sockets.get(id)

                    if (userSocket) { // 存在仅更新socket
                        userSocket.socket = ws
                        ws.user = userSocket
                    } else {
                        ws.user = new UserSocket(ws)
                        sockets.set(id, ws.user)
                    }
                    ws.user.token = d.data.token
                    ws.user.status = SOCKET_STATUS.ONLINE
                    ws.user.userId = id
                    // 默认房间
                    rooms.addUserToRoom('0', ws.user)

                    // 获取好友列表

                    const res = await getAllFriendsById(id) as any[]
                    res.forEach(user=>{
                        const {isGroup} = user
                        rooms.addUserToRoom(String(user.id),ws.user)
                    })

                    // 加入房间

                    rooms.get('0').send('Hello World')
                }
            }
        }

        ws.onclose = () => {
            if (ws.user && ws.user.status) {
                ws.user.status = SOCKET_STATUS.OFFLINE  // 离开时修改状态
                console.log('状态修改', ws.user.status)
            }
        }
    })
}