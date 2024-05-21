import {onMounted, onUnmounted, onUpdated, ref} from "vue";

export function useResizeObserver(callBack?:any){
    const el = ref<HTMLElement>()
    let observer:ResizeObserver|null = null

    onMounted(()=>{
        observer = new ResizeObserver(()=>{
            callBack?.(el.value?.offsetHeight)
        })
        observer.observe(el.value!)
    })

    onUpdated(()=>{
        callBack?.(el.value?.offsetHeight)
    })

    onUnmounted(()=>{
        observer?.disconnect()
        observer = null
    })

    return el
}