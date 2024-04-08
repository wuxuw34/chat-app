import {onMounted, onUnmounted, Ref, ref} from "vue";


export function useContextMenu(el: Ref<HTMLElement | null | undefined>){

    const show = ref<boolean>(false),x = ref(0),y = ref(0)

    onMounted(()=>{
        console.log(el.value)
        el.value?.addEventListener('contextmenu',handleContextMenu)
    })

    onUnmounted(()=>{

        el.value?.removeEventListener('contextmenu',handleContextMenu)
    })

    function handleContextMenu(e:MouseEvent){
        e.preventDefault()
        if(e.target && el.value.contains(e.target as Node)){
            x.value = e.x
            y.value = e.y
            show.value = true
        }else{
            console.log('不是')
        }
    }

    return {
        show,x,y
    }
}