<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import WaveSurfer from "wavesurfer.js";
import {handleTime} from "../../../utils/time.ts";

const props = defineProps<{
    url: string
}>()
const audioRef = ref<HTMLAudioElement>()
let waveform = null
const currentTime = ref('0:00')
const duration = ref('00:00')
const isPlaying = ref(false)
const waveformRef = ref()

watch(() => props.url, () => {
    waveForm()
})

onMounted(() => {
    waveForm()
})

function waveForm() {
    waveform = WaveSurfer.create({
        container: waveformRef.value,
        waveColor: '#92c4f1',
        progressColor: '#1d90f5',
        url: props.url,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        barHeight: 8,
        height: 16
    })
    waveform.on('click', (rate) => {
        // waveform.setTime(rate * duration.value)
        console.log(rate * duration.value)
        // waveform.play()
    })
    waveform.on('audioprocess', (current: number) => {
        currentTime.value = current.toFixed(2)
    })
    waveform.on('decode', (_duration: string) => {
        duration.value = _duration
    })
    waveform.on('play', () => {
        isPlaying.value = true
    })
    waveform.on('pause', () => {
        isPlaying.value = false
    })
}

function play() {

    waveform.play()
}

function pause() {

    waveform.pause()
}

</script>

<template>
    <div class="audio-message-item">
        <el-icon size="42">
            <svg v-if="!isPlaying" @click="play" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                 viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11m-3.5-5.37V6.37L18.25 12z"/>
            </svg>
            <svg v-else @click="pause" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11M8 7h3v10H8zm5 0h3v10h-3z"/>
            </svg>
        </el-icon>
        <div>
            <div ref="waveformRef" style="width: 200px;height: 22px"></div>
            <div class="duration">{{ duration }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.audio-message-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: var(--color-blue-1);
    gap: 6px;

    .duration {

        font-size: 14px;
    }
}
</style>