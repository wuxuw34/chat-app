import {onMounted, ref, Ref} from "vue";

export function useFullScreen(){

    const el = ref<HTMLElement>()
    const isFull = ref(false)

    onMounted(()=>{
        console.log(el.value)
        el.value?.addEventListener('fullscreenchange',fullScreenChange)
    })

    function fullScreenChange(e:Event){
        if(document.fullscreenElement){
            isFull.value = true
        }else{
            isFull.value = false
        }
    }

    function existFullScreen(){
        document.exitFullscreen()
    }

    function fullScreen(){
        console.log('全屏')
        el.value?.requestFullscreen()
    }

    return {
        fullscreenElement:el,
        fullScreen,
        existFullScreen,
        isFull
    }

}