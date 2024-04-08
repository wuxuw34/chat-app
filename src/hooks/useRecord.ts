import {useUserMedia} from "./useUserMedia.ts";
import {ref} from "vue";

export function useRecord(){

    const {stream,start,stop} = useUserMedia()
    let mediaRecorder:MediaRecorder|null = null
    let chunks:Blob[] = []
    const url = ref<string>()
    let _onstopfn:any = null

    async function startRecord(){
        await start()
        mediaRecorder = new MediaRecorder(stream.value as MediaStream)
        mediaRecorder.ondataavailable = (e:BlobEvent)=>{
            chunks.push(e.data)
        }
        mediaRecorder.onstop = ()=>{
            const blob = new Blob(chunks,{
                type:'audio/ogg;codecs=opus'
            })
            url.value = URL.createObjectURL(blob)
            chunks = []
            _onstopfn?.(url.value,blob)
        }
        mediaRecorder.start()
    }

    function stopRecord(){
        mediaRecorder?.stop()
        stop()
    }

    function onStopRecord(fn:(url:string,blob:Blob)=>void){
        _onstopfn = fn
    }

    return {
        startRecord,
        stopRecord,
        onStopRecord,
        url
    }
}