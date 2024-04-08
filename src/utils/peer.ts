import worker from "@/utils/webworker.ts";
import apis from "@/services/apis.ts";
import {setMessageContent} from "@/utils/messageUtils.ts";
import {MESSAGE_TYPE} from "@/enums";
import {MessageType} from "@/type/message";

type StreamEventFnType = (stream:MediaStream,id:string)=>void

class Peer {

    peers = new Map<string, RTCPeerConnection>()
    events = new Set()

    constructor() {
        this.init()
    }

    private init() {
        // worker.addEventListener('message',(e:MessageEvent)=>{
        //     const data = e.data
        //     console.log('收到的消息',data)
        // })
    }

    connect(id: string) {
        this.initPeerConnection(id)

    }


    initPeerConnection(id: string) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {urls: 'stun:stun.minisipserver.com'}
            ]
        })
        this.peers.set(id, peer)
        peer.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
            console.log('交换candidate', e.candidate)
            if (e.candidate) {
                apis.sendMsg(setMessageContent({
                    data: {
                        id,
                        candidate: e.candidate
                    },
                    type: MESSAGE_TYPE.CANDIDATE
                }))
            }
        }
        peer.ontrack = (e: RTCTrackEvent) => {
            console.log('流', e.streams);
            this.trigger(e.streams[0],id)
            // (document.getElementById('video') as HTMLVideoElement)!.srcObject = e.streams[0]
        }
    }

    createOffer(id: string) {
        console.log('准备创建offer', id)
        this.initPeerConnection(id)
        const peer = this.peers.get(id)
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {

            return stream.getTracks().forEach(track => peer?.addTrack(track, stream))
        }).then(() => {
            return peer?.createOffer()
        }).then(r => {
            return peer?.setLocalDescription(r)
        }).then(() => {
            console.log('创建好offer', peer?.localDescription)
            apis.sendMsg(setMessageContent({
                data: {
                    sdp: peer?.localDescription
                },
                type: MESSAGE_TYPE.OFFER
            }))
        })
    }

    setAnswer(id: string, sdp: RTCSessionDescription) {
        const peer = this.peers.get(id)
        console.log('设置answer', id, sdp)
        peer?.setRemoteDescription(sdp)
    }


    createAnswer(id: string, sdp: RTCSessionDescription) {
        console.log('准备创建answer', id)
        const peer = this.peers.get(id)
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            // (document.getElementById('video') as HTMLVideoElement).srcObject = stream
            return stream.getTracks().forEach(track => peer?.addTrack(track, stream))
        }).then(()=>{
            return peer?.setRemoteDescription(sdp)
        }).then(() => {
            return peer?.createAnswer()
        }).then(answer => {
            return peer?.setLocalDescription(answer)
        }).then(() => {
            apis.sendMsg(setMessageContent({
                data: {
                    sdp: peer?.localDescription
                },
                type: MESSAGE_TYPE.ANSWER
            }))
        })
    }


    setCandidate(id: string, candidate: RTCIceCandidate) {
        const peer = this.peers.get(id)
        console.log(id, '设置candidate', candidate)
        peer?.addIceCandidate(candidate)
    }

    revokeCall(uid:string){
        let peer = this.peers.get(uid)
        peer!.ontrack = null
        peer!.onicecandidate = null

        peer!.close()
        peer = undefined
        this.peers.delete(uid)
        worker.postMessage(setMessageContent({
            data:{

            },
            type:MESSAGE_TYPE.REVOKE_CALL
        },uid))
    }

    private handleIceCandidateError() {

    }

    onTrack(fn:StreamEventFnType) {
        this.events.add(fn)
    }

    private trigger(stream:MediaStream,uid:string) {
        Promise.all(Array.from(this.events).map((fn:any)=>{
            return new Promise((resolve)=>{
                fn(stream,uid)
                resolve(null)
            })
        }))
    }

}

export default new Peer()