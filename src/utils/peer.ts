import worker from "@/utils/webworker.ts";
import apis from "@/services/apis.ts";
import {setMessageContent} from "@/utils/messageUtils.ts";
import {MESSAGE_TYPE} from "@/enums";

type StreamEventFnType = (stream:MediaStream,id:string)=>void

interface IRTCPeerConnection{
    connect:(id:string)=>void;
    initPeerConnection:(id:string)=>void;
    createOffer:(id: string,mediaConstraints:MediaStreamConstraints)=>void;
    setAnswer:(id: string, sdp: RTCSessionDescription)=>void;
    createAnswer:(id: string, sdp: RTCSessionDescription)=>void;
    setCandidate:(id: string, candidate: RTCIceCandidate)=>void;
    revokeCall:(uid:string)=>void;
}

class Peer implements IRTCPeerConnection{

    peers = new Map<string, RTCPeerConnection>() // 多人音视频聊天时每个RTCPeerConnection连接
    events = new Set() // 消息触发事件集合

    constructor() {

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

    createOffer(id: string,mediaConstraints:MediaStreamConstraints={
        video:true,
        audio:true
    }) {
        this.initPeerConnection(id)
        const peer = this.peers.get(id)
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {

            return stream.getTracks().forEach(track => peer?.addTrack(track, stream))
        }).then(() => {
            return peer?.createOffer()
        }).then(r => {
            return peer?.setLocalDescription(r)
        }).then(() => {
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
        peer?.setRemoteDescription(sdp)
    }


    createAnswer(id: string, sdp: RTCSessionDescription) {
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

    // private handleIceCandidateError() {
    //
    // }

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