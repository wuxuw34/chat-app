<script setup lang="ts">

import {nextTick, onMounted, ref} from "vue";
import {useClickOutside} from "@/hooks/useClickOutside.ts";

const isView = ref<boolean>(false)
const url = ref<string>()
const options = ref()
const width = ref()
const height = ref()
const x = ref()
const y = ref()
const imageRef = ref()
const {isOutside, onChange, pause, stop} = useClickOutside(imageRef)
const scale = ref(1)
const config = ref({
    scale: 1,
    x: 0,
    y: 0
})
const position = {
    startX: 0,
    startY: 0,
    imgX: 0,
    imgY: 0
}


onMounted(() => {

})

function handleWheel(e: WindowEventMap["wheel"]) {
    if (e.wheelDeltaY > 0) {
        if (scale.value < 10) scale.value += 0.1
    } else {
        if (scale.value * 10 > 1) scale.value = (scale.value * 10 - 1) / 10 // 浮点数不精确

    }
}

function handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    const {x, y} = e
    position.startX = x
    position.startY = y
    position.imgX = config.value.x
    position.imgY = config.value.y
    imageRef.value.addEventListener('mousemove', handleMouseMove)
}

function handleMouseMove(e: MouseEvent) {
    const {x, y} = e
    config.value.x = x - position.startX + position.imgX
    config.value.y = y - position.startY + position.imgY
    imageRef.value.addEventListener('mouseup', handleMouseUp)
}

function handleMouseUp() {
    imageRef.value.removeEventListener('mousemove', handleMouseMove)
    imageRef.value.removeEventListener('mouseup', handleMouseMove)
}

function open(_url: string, _options: {
    x: number,
    y: number,
    width: number,
    height: number
}) {
    pause.value = true // 需要暂停一下，防止第一次点击失效
    url.value = _url
    isView.value = true
    options.value = _options
    width.value = _options.width + 'px'
    height.value = _options.height + 'px'
    x.value = _options.x + 'px'
    y.value = _options.y + 'px'
    const _width = window.innerWidth
    config.value.x = _width / 2 - window.innerHeight * (_options.width / _options.height) / 2
    imageRef.value.addEventListener('wheel', handleWheel)
    imageRef.value.addEventListener('mousedown', handleMouseDown)
    onChange((outside) => {
        if (outside) {
            close()
        }
    })
}

function close() {
    imageRef.value.addEventListener('animationend', handleAnimationend)
    imageRef.value.classList.add('img-close')
}

function handleAnimationend() {
    imageRef.value.removeEventListener('animationend', handleAnimationend)
    isView.value = false
    imageRef.value.classList.remove('img-close')
    onChange(()=>{})

}


defineExpose({
    open, close
})

</script>

<template>

    <div class="image-viewer" v-show="isView">
        <img :src="url" alt="图片" ref="imageRef" class="image" :style="{
            height:'100%',
            top:config.y + 'px',
            left:config.x + 'px',
            scale:scale
        }">
    </div>

</template>

<style scoped lang="scss">
img {
    object-fit: contain;
}

.image {
    position: absolute;
    transition: all 0.5s ease-in;
}

.image-viewer {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    backdrop-filter: blur(10px) brightness(0.4);
    user-select: none;

    img {
        position: absolute;
        transition: width 0.5s ease-in;
        animation: show 0.3s ease;
    }

    .img-close {
        animation: close 0.3s ease;
    }

    @keyframes show {
        from {
            width: v-bind("width");
            height: v-bind("height");
            top: v-bind("y");
            left: v-bind("x");
        }
    }
    @keyframes close {
        to {
            width: v-bind("width");
            height: v-bind("height");
            top: v-bind("y");
            left: v-bind("x");
        }
    }
}


</style>