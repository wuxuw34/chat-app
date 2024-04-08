import {createApp, defineComponent, h, onMounted, ref, nextTick, Ref} from "vue";
import ImageViewer from "@/components/ImageViewer/ImageViewer.vue";

let mounted = false
const imageViewerRef = ref()

const app = createApp({
    setup() {
        return () => h(ImageViewer, {
            ref: imageViewerRef
        })
    }
})


export function useImageViewer() {

    onMounted(() => {
        if (!mounted) {
            init()
            nextTick(() => {
                console.log(imageViewerRef.value)
            })
        }
    })

    function init() {
        mounted = true
        const div = document.createElement('div')
        div.id = 'image-viewer'
        document.body.appendChild(div)
        app.mount(div)
    }

    return {
        open: (url: string,e:PointerEvent) => {
            const {x,y,height,width} = (e.target as HTMLElement).getBoundingClientRect()
            nextTick(() => {
                imageViewerRef.value?.open(url,{
                    x,y,width,height
                })
            })
        },
        close: () => {
            nextTick(() => {
                imageViewerRef.value?.close()
            })
        }
    }

}