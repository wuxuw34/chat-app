import {onMounted, Ref, ref, watch} from "vue";

export function useClickOutside(target: Ref<HTMLElement>) {

    const isOutside = ref<boolean>(false)
    let changeFn: null | ((outside: boolean) => void) = null
    const pause = ref<boolean>(false)
    const stop = ref(false)

    onMounted(() => {
        if (stop.value) {
            window.removeEventListener('click', handleClickElement)
        } else {
            window.addEventListener('click', handleClickElement)
        }
    })

    watch(stop, () => {
        if (stop.value) {
            window.removeEventListener('click', handleClickElement)
        } else {
            window.addEventListener('click', handleClickElement)
        }
    })


    function onChange(e: (outside: boolean) => void) {
        changeFn = e
    }

    function handleClickElement(e: MouseEvent) {
        if (pause.value) {
            pause.value = !pause.value
            return
        }
        if (target.value) {
            if (!target.value.contains(e.target as Node)) {
                isOutside.value = true
                changeFn?.(true)
            } else {
                isOutside.value = false
                changeFn?.(false)
            }
        }

    }


    return {
        isOutside, onChange,
        pause,stop
    }

}