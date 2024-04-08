<script setup lang="ts">

import {ref} from "vue";

const props = defineProps<{
    url:string
}>()
const audioRef = ref<HTMLAudioElement>()

function play(){
    audioRef.value?.play()
    console.dir(audioRef.value?.currentTime,audioRef.value?.duration)
    audioRef.value!.onplaying = ()=>{
        console.log('播放')
    }
    audioRef.value!.onplay = ()=>{
        console.log('播放1')
    }
    audioRef.value!.ontimeupdate = ()=>{
        console.log(audioRef.value?.currentTime)
    }
}

function createAudioWave(){
    const audioContent = new AudioContext()
    const source = audioContent.createMediaElementSource(audioRef.value!)
    const analyser = audioContent.createAnalyser()
}

</script>

<template>
    <audio :src="url" ref="audioRef" style="display: none" />
    <el-button @click="play">播放</el-button>
</template>

<style scoped lang="scss">

</style>