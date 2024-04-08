import {computed, onMounted, Ref, ref} from "vue";

export type VirtualListOptionsType = {
    itemHeight: number,
    overscan?: number,
    reverse?: boolean
}
type VirtualListStateType = {
    from: number,
    to: number
}

export function useVirtualList1<T>(data: T[], options: VirtualListOptionsType) {

    const {itemHeight, reverse} = options
    const overscan = options.overscan ? options.overscan : 5
    const sizes = ref<number[]>([])
    const currentData = ref<Array<T>>([]) as Ref<T[]> // 当前展示的数据
    const containerHeight = computed<number>(() => {
        return data.length * itemHeight
    }) // 容器高度
    const containerRef = ref<HTMLDivElement | null>(null)
    const state = ref<VirtualListStateType>({
        from: 0,
        to: 10
    })
    const offsetTop = computed(() => {
        return getOffsetTop(state.value.from)
    })

    const calculateRange = () => {
        if (!containerRef.value) return
        state.value.from = Math.max(Math.floor(containerRef.value.scrollTop / itemHeight), 0)
        state.value.to = Math.min(Math.ceil(containerRef.value.offsetHeight / itemHeight) + overscan + state.value.from, data.length)
        currentData.value = data.slice(state.value.from, state.value.to)
    }


    const getOffsetTop = (index: number) => {
        return index * itemHeight
    }

    onMounted(() => {
        reverse && containerRef.value!.scrollTo({
            top: containerHeight.value
        })
        calculateRange()
    })

    return {
        currentData,
        wrapperProps: computed(() => {
            if (reverse) {
                return {
                    style: {
                        height: `${containerHeight.value - offsetTop.value}px`,
                        marginTop: `${offsetTop.value}px`,
                        scrollBehavior: 'smooth'
                    }
                }
            } else {
                return {
                    style: {
                        height: `${containerHeight.value - offsetTop.value}px`,
                        marginTop: `${offsetTop.value}px`
                    }
                }
            }
        }),
        containerProps: {
            ref: containerRef,
            onScroll: () => {
                window.requestAnimationFrame(() => {
                    calculateRange()
                })
            },
        }
    }
}