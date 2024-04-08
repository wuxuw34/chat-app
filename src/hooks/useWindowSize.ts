import {onMounted, onUnmounted, ref} from "vue";

export default function useWindowSize(){

    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    onMounted(()=>{
        window.addEventListener('resize',handle)
    })
    onUnmounted(()=>{
        window.removeEventListener('resize',handle)
    })

    function handle(){
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    return {
        width,height
    }
}