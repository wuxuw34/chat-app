<script setup lang="ts">

import {onMounted, ref, watch} from "vue";

const props = defineProps<{
    text: string
}>()
const typingRef = ref()
let stop = null

watch(() => props.text, () => {
    stop()
    start(props.text.length)
})

onMounted(() => {
    start(props.text.length)
})

function start(step: number) {
    // 使用等宽字体
    typingRef.value.style.width = step + 'ch'
    typingRef.value.parentElement.style.width = step + 3 + 'ch'
    const e = typingRef.value.animate([{
        width: 0,
        offset: 0
    }], {
        duration: 2000,
        easing: `steps(${step})`
    })
    const blink = typingRef.value.animate([{
        borderRight: 'transparent',
        offset: 0.5
    }], {
        duration: 500,
        iterations: Infinity
    })
    e.play()
    blink.play()
    stop = ()=>{
        e.cancel()
        blink.cancel()
    }
}

</script>

<template>
    <div class="wrapper">
        <div class="typing-demo" ref="typingRef">
            {{ text }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    /*This part is important for centering*/
    display: grid;
    place-items: center;
    box-sizing: border-box;
}

.typing-demo {
    box-sizing: border-box;
    width: fit-content;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid;
    font-family: monospace;
}

</style>