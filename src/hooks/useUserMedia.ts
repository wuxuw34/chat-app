import {ref} from "vue";

export function useUserMedia(options?: {
    constraint?: MediaStreamConstraints
}) {
    const stream = ref<MediaStream | null>(null)

    const constraints = options?.constraint ? options.constraint : {
        video: false,
        audio: true
    }

    const requestRecordPermission = async () => {
        try {
            stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        }catch (e){
            console.log(e)
        }
    }
    const start = async () => {
        console.log('开始')
        await requestRecordPermission()
        console.log('请求结束',stream.value)
    }

    const stop = ()=>{
        stream.value?.getTracks().forEach(track=>track.stop())
        console.log(stream.value)
        stream.value = null
    }

    return {
        stream,
        start,
        stop
    }

}