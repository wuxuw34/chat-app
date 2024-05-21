<script setup lang="ts">

import {onMounted, onUnmounted, provide, ref, watch} from "vue";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {isMobile} from "@/utils/device.ts";

const props = defineProps<{
    isResponse: boolean
}>()
const is = defineModel("is")
const nextRef = ref()
const mainRef = ref<HTMLDivElement>()
const windowSize = useWindowSize()
const transitionRef = ref<HTMLDivElement>()

onMounted(() => {
    mainRef.value?.addEventListener('animationend', handleAnimationend)
    if (props.isResponse) { // 如果该属性为true，则需要识别屏幕大小
        handleWindowSizeChange()
        watch(() => windowSize.width.value, handleWindowSizeChange)
    }
    watch(() => is.value, () => {
        if (is.value) {
            open()
        } else {
            close()
        }
    })
})

onUnmounted(() => {
    mainRef.value?.removeEventListener('animationend', handleAnimationend)
})


function handleAnimationend() {
    mainRef.value?.classList.remove('leave')
    mainRef.value?.classList.remove('enter')
}

function handleWindowSizeChange() {
    if (isMobile(windowSize.width.value)) {
        transitionRef.value?.classList.remove('not-mobile')
    } else {
        transitionRef.value?.classList.add('not-mobile')
    }
}

function goBack() {
    is.value = null
}

function open(){
    nextRef.value.style.transform = 'translate(0)'
    mainRef.value?.classList.add('leave')
}

function close(){
    nextRef.value.style.transform = 'translate(100%)'
    mainRef.value?.classList.add('enter')
}

provide('goBack', goBack)
defineExpose({
    open,close
})

</script>

<template>
    <div class="transition" ref="transitionRef">
        <div class="main-transition" ref="mainRef">
            <slot></slot>
        </div>
        <div ref="nextRef" class="is">
            <component :is="is"></component>
        </div>
    </div>
</template>

<style scoped lang="scss">
.transition {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 0;

    & > .main-transition {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    & > .is {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translate(100%);
        transition: transform 0.3s ease-in-out;
        background: white;
        z-index: 1;
    }
}

.not-mobile {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;

    & > .main-transition {
        position: relative;
        height: 100%;
        width: 25%;
        left: 0;
        min-width: 300px;
    }

    & > .is {
        position: relative;
        flex: 1;
        height: 100%;
        transform: translate(0);
        left: 0;
        width: 75%;
    }

}

.enter {
    animation: main-transition 0.3s ease-in-out;
}

.leave {
    animation: main-transition 0.3s ease-in-out reverse;
}

@keyframes main-transition {
    0% {
        scale: 0.9;
    }
    100% {
        scale: 1;
    }
}

</style>