import peer from '@/utils/peer.ts'
import {createApp, h, nextTick, onMounted, ref} from "vue";
import CallArea from "@/components/CallArea/CallArea.vue";
import {MessageType} from "@/type/message";
import apis from "@/services/apis.ts";


const callRef = ref()
let op = {
    revoke: null as any,
    answer: null as any
}
const app = createApp({
    setup() {
        return () => h(CallArea, {
            ref: callRef,
            op: op
        })
    }
})

export function usePeer() {

    (window as any).$peer = peer

    onMounted(() => {
        createCallArea()
    })

    function createCallArea() {
        const div = document.createElement('div')
        div.id = 'call'
        document.body.appendChild(div)
        app.mount(div)
    }

    function connect(_id: string, isAnswer: boolean = false) {
        !isAnswer && peer.connect(_id)
        !isAnswer && apis.call(_id)
        nextTick(() => {
            op.revoke = revokeCall
            callRef.value.open(_id, isAnswer)
        })
    }

    function createOffer(_id: string) {
        peer.createOffer(_id)
        peer.onTrack((stream, id) => {
            callRef.value.setStream(stream)
        })
    }

    function createAnswer(_id: string, sdp: RTCSessionDescription) {
        peer.createAnswer(_id, sdp)
        peer.onTrack((stream, id) => {
            callRef.value.setStream(stream)
            console.log('触发')
        })
    }

    function setCandidate(_id: string, candidate: RTCIceCandidate) {
        peer.setCandidate(_id, candidate)
    }

    function setAnswer(_id: string, sdp: RTCSessionDescription) {
        peer.setAnswer(_id, sdp)
    }

    function revokeCall(uid: string) {
        peer.revokeCall(uid)
        console.log('挂断')
    }


    function setAnswerCallFn(answer: any) {
        op.answer = answer
    }

    function closeCall() {
        callRef.value.close()
        peer.closeAll()
    }

    return {
        connect, createOffer, createAnswer, setCandidate, setAnswer, revokeCall, setAnswerCallFn, closeCall
    }
}