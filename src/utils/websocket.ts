export enum SOCKET_EVENTS {
    MESSAGE,
    ERROR,
    CLOSE,
    OPEN
}

const postMsg =  (data:any)=>{
    self.postMessage(JSON.stringify(data))
}

class Socket {
    socket: WebSocket | null = null
    connectCountMax:number = 100 // 重连次数
    heartTimer:any = null // 心跳检测计时器
    reconnectCount:number = 0 // 重连次数
    isReconnecting:boolean = false // 是否处于重连状态
    timer:any = null // 重连计时器
    tasks:any[] = []


    constructor() {
        this.init()
    }

    init() {

        this.socket?.removeEventListener('message',this.handleMessage.bind(this))
        this.socket?.removeEventListener('open',this.handleOpen.bind(this))
        this.socket?.removeEventListener('error',this.handleError.bind(this))
        this.socket?.removeEventListener('close',this.handleClose.bind(this))
        this.socket = new WebSocket('ws://192.168.31.196:8080')
        this.socket?.addEventListener('message',this.handleMessage.bind(this))
        this.socket?.addEventListener('open',this.handleOpen.bind(this))
        this.socket?.addEventListener('error',this.handleError.bind(this))
        this.socket?.addEventListener('close',this.handleClose.bind(this))
    }

    sendHeartTimer(){
        this.heartTimer = setInterval(()=>{
            this.sendMsg({
                type:0
            })
        },10000)
    }

    clearHeartTimer(){
        if(this.heartTimer){
            clearInterval(this.heartTimer)
        }
        this.isReconnecting = false
    }

    sendMsg(data:any){
        this.socket?.send(JSON.stringify(data))
    }

    //@ts-ignore
    handleOpen(e: Event) {
        this.dealTasks()
        postMsg({
            type:SOCKET_EVENTS.OPEN
        })
        this.sendHeartTimer()
    }
    handleClose(){
        this.clearHeartTimer() // 清除计时
        if(this.isReconnecting){ // 处于重连状态
            return
        }
        this.isReconnecting = true
        if(this.timer){
            clearTimeout(this.timer)
        }
        if(this.reconnectCount >= this.connectCountMax) return
        this.timer = setTimeout(()=>{
            this.init()
            this.reconnectCount ++
        })
    }
    handleError(){
        this.handleClose()
        postMsg({
            type:SOCKET_EVENTS.ERROR
        })
    }
    handleMessage(e:any){
        postMsg({
            type:SOCKET_EVENTS.MESSAGE,
            data:e.data
        })
    }


    dealTasks(){
        this.tasks.forEach(task=>{
            this.sendMsg(task)
        })
        this.tasks = []
    }

}

const socket = new Socket()

self.onmessage = function (e: MessageEvent) {
    const {ev, data} = e.data
    switch (ev){
        case 'stop':{
            socket.socket?.close()
            break
        }
        default:{

            if(socket.socket?.readyState === socket.socket?.OPEN){

                socket.sendMsg({
                    event:ev,
                    data
                })
            }else {
                socket.tasks.push({
                    event:ev,
                    data
                })
            }

        }
    }

}

