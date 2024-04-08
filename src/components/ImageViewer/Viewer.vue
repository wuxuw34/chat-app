<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useImageViewer} from "@/hooks/useImageViewer.ts";


export type ImageViewerType = {
    width?: number,
    height?: number,
    url: string
}

const props = defineProps<ImageViewerType>()
const isView = ref<boolean>(false)
const {open,close} = useImageViewer()

onMounted(()=>{
    console.log(open,close)

})

</script>

<template>

    <img :src="url" alt="图片" @click="(e)=>open(url,e)" >

</template>

<style scoped lang="scss">
img {
    object-fit: contain;
    max-width: 300px;
    max-height: 200px;
}

.image-viewer {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;

    img {
        width: 100%;
        height: 100%;
    }
}

</style>