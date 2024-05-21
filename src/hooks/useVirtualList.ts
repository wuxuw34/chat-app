import {computed, onMounted, ref, nextTick, Ref, watch} from "vue";

export type virtualListOptionsType = {
    itemHeight: number,
    overscan?: number,
    reverse?: boolean
}

export function useVirtualList<T>(data: Ref<any[]>, options?: virtualListOptionsType) {

    const currentdata = ref<T[]>([])
    let range = {
        from: 0,
        to: 0
    }
    const overscan = options?.overscan ? options.overscan : 5
    const itemHeight = options?.itemHeight ? options.itemHeight : 24
    const reverse = options?.reverse
    const container = ref<HTMLElement>()
    const scroller = ref<HTMLElement>()
    const sizes = new Map<number, any>() // 保存元素高度
    let containerHeight = 0
    const offsetTop = ref<number>()
    const height = ref<number>()

    onMounted(() => {
        init()
        watch(()=>data.value,()=>{
            init()
        })
    })

    function init() {

        data.value.forEach((item: any, index: number) => {
            item._index = index
        })
        console.log('初始化',data.value)
        containerHeight = container.value!.clientHeight
        calculateRange(0)
    }

    /**
     *  获取渲染的区域
     */
    function calculateRange(scrollTop: number) {
        range.from = getOffsetTopIndex(scrollTop)
        range.to = getViewOpacityIndex() + range.from * 2
        currentdata.value = data.value.slice(range.from, range.to) as any[]
        offsetTop.value = getMarginTop()
        height.value = (data.value.length - range.from) * itemHeight

    }

    function getSize(i: number) {
        return sizes.get(data.value[i]._index)
    }

    function setSize(i: number, h: number) {
        sizes.set(i, h)

    }

    function getViewOpacityIndex() {
        if (itemHeight) return Math.floor(containerHeight / itemHeight) + 1 + overscan
        return 20
    }


    function getOffsetTopIndex(scrollTop: number) {
        let index = 0
        if (itemHeight) index = Math.floor(scrollTop / itemHeight)
        else {
            for (let i = 0; ; i++) {
                const h = getSize(i) as number
                if (scrollTop - h > 0) {
                    scrollTop -= h
                    index++
                } else {
                    break
                }
            }
        }

        if (index - overscan > 0) {
            return index - overscan
        } else {
            return index
        }
    }

    function getMarginTop() {
        if (itemHeight) return range.from * itemHeight
        let sum = 0
        for (let i = 0; i <= range.from; i++) {
            const h = getSize(i) as number
            sum += h
        }
        return sum
    }


    function onScroll(e: Event) {
        const scrollTop = (e.target as HTMLElement).scrollTop


        window.requestAnimationFrame(() => {
            calculateRange(scrollTop) // 计算需要渲染的范围
        })
        nextTick(() => {
            const children = scroller.value!.children
            for (let i = 0; i < children?.length; i++) {
                const h = children[i].clientHeight
                sizes.set(range.from + i, h)
            }
        })
    }


    return {
        currentdata,
        scrollProps: computed(() => {
            return {
                ref: scroller,
                style: {
                    marginTop: offsetTop.value + 'px',
                    height: height.value + 'px',
                    position: 'absolute',
                    width: '100%'
                }
            }
        }),
        containerProps: {
            ref: container,
            onScroll,
            style: {
                position: 'relative',
                scrollBehavior:'smooth'
            }
        }
    }
}