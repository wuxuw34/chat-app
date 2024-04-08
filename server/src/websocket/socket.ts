export class UserSocket{
    userId:number|null = null
    token:string|null = null
    status:SOCKET_STATUS = SOCKET_STATUS.OFFLINE
    socket:Socket|null = null
    constructor(socket:Socket) {
        this.socket = socket
    }
}
export enum SOCKET_STATUS  {
    ONLINE,
    OFFLINE
}
export interface Socket extends WebSocket{

    user:UserSocket
}