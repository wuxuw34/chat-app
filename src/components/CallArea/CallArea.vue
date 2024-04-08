<script setup lang="ts">

import {ref} from "vue";
import {CloseBold} from '@element-plus/icons-vue'
import config from "@/utils/config.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import {usePeer} from "@/hooks/usePeer.ts";
import CallButton from "@/components/Button/CallButton.vue";

enum CALL_STATUS {
    CALLING,
    CALLED,
    ANSWER
}


defineProps<{
    op: {
        revoke: any,
        answer: any,
        hangup:any
    }
}>()

const show = ref(false)
const friendStore = useFriendsStore()
const id = ref()
const stream = ref<MediaStream>()
const status = ref<CALL_STATUS>()
const videoRef = ref<HTMLVideoElement>()
const isRecord = ref(true)
const isVideo = ref(true)
const position = ref({
    x: 0,
    y: 0,
    start_x: 0,
    start_y: 0
})

function open(_id: string, isAnswer: boolean = false) {
    show.value = true
    id.value = _id
    status.value = isAnswer ? CALL_STATUS.ANSWER : CALL_STATUS.CALLING
}

function close() {
    show.value = false
}

function setStream(_stream: MediaStream) {
    status.value = CALL_STATUS.CALLED
    stream.value = _stream
    console.log('视频流 --> ', _stream, videoRef)
    videoRef.value!.srcObject = _stream
    videoRef.value?.play()
    console.log('切换 CALL_STATUS.CALLED',)
}

function startMove(e: MouseEvent) {
    console.log(e)
}


defineExpose({
    open,
    setStream
})

</script>

<template>
    <div v-show="show" class="call-container" @mousedown="startMove">
        <el-card>
            <template #header>
                <div class="header">
                    <span>{{
                        status === CALL_STATUS.CALLED ? "正在通话中" : status === CALL_STATUS.ANSWER ? "准备接听" : "正在拨通电话"
                        }}</span>
                    <el-icon @click="close">
                        <CloseBold/>
                    </el-icon>
                </div>
            </template>
            <div v-if="status === CALL_STATUS.ANSWER" class="answer background" :style="{
               '--background-url':`url(${config.server + 'api/static/avatars/default.jpg'})`
            }">
                <img :src="config.server + 'api/static/avatars/default.jpg'" alt="头像">
                <span>
                    {{ friendStore.getUsernameById(id) }}
                </span>
                <div
                        class="buttons"
                >
                    <CallButton
                            @click="()=>{
                                console.log('接听电话....')
                                op.answer?.()
                            }"
                            type="default"
                    >
                        <el-icon size="32">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fill-rule="evenodd"
                                      d="M6.4 5.995a.747.747 0 0 1-.69.461H2.442a.75.75 0 0 1-.53-1.28l1.102-1.103L.512 1.571a.75.75 0 1 1 1.06-1.06l2.503 2.502L5.177 1.91a.75.75 0 0 1 1.28.53v3.266c0 .103-.02.2-.057.29Zm.337 7.284a2.7 2.7 0 0 1-3.37-.36l-.38-.38a.91.91 0 0 1 0-1.28l1.6-1.59a.9.9 0 0 1 1.27 0a.91.91 0 0 0 1.28 0l2.55-2.55a.91.91 0 0 0 0-1.28a.9.9 0 0 1 0-1.27l1.54-1.6a.91.91 0 0 1 1.28 0l.38.38a2.7 2.7 0 0 1 .41 3.37a24.229 24.229 0 0 1-6.56 6.56"
                                      clip-rule="evenodd"/>
                            </svg>
                        </el-icon>
                    </CallButton>
                    <CallButton
                            type="error"
                    >
                        <el-icon size="32">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fill-rule="evenodd"
                                      d="M.22 1.28A.75.75 0 0 1 1.28.22l6.123 6.122l.953-.954l.003-.002a.542.542 0 0 0 0-.772l-.006-.006a1.552 1.552 0 0 1 0-2.175l1.87-1.87l.004-.004a1.561 1.561 0 0 1 2.184 0l.437.447a3.635 3.635 0 0 1 .498 4.555l-.006.01a28.946 28.946 0 0 1-2.995 3.713l3.435 3.436a.75.75 0 1 1-1.06 1.06zm5.242 7.002l2.895 2.895l-.071.066a28.921 28.921 0 0 1-2.707 2.069l-.009.005a3.635 3.635 0 0 1-4.555-.498l-.44-.43l-.007-.007a1.561 1.561 0 0 1 0-2.184L2.45 8.335l.001-.001a1.552 1.552 0 0 1 2.175 0v-.001l-.35.357l.35-.356a.561.561 0 0 0 .783 0l.052-.052Z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </el-icon>
                    </CallButton>
                </div>
            </div>
            <div v-else-if="status === CALL_STATUS.CALLING" class="calling background" :style="{
               '--background-url':`url(${config.server + 'api/static/avatars/default.jpg'})`
            }">
                <img :src="config.server + 'api/static/avatars/default.jpg'" alt="头像">
                <span class="username">
                    {{ friendStore.getUsernameById(id) }}
                </span>
                <CallButton
                        type="error"
                        @click="()=>{
                    op.revoke?.()
                }"
                >
                    <el-icon size=" 32
                ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="M.22 1.28A.75.75 0 0 1 1.28.22l6.123 6.122l.953-.954l.003-.002a.542.542 0 0 0 0-.772l-.006-.006a1.552 1.552 0 0 1 0-2.175l1.87-1.87l.004-.004a1.561 1.561 0 0 1 2.184 0l.437.447a3.635 3.635 0 0 1 .498 4.555l-.006.01a28.946 28.946 0 0 1-2.995 3.713l3.435 3.436a.75.75 0 1 1-1.06 1.06zm5.242 7.002l2.895 2.895l-.071.066a28.921 28.921 0 0 1-2.707 2.069l-.009.005a3.635 3.635 0 0 1-4.555-.498l-.44-.43l-.007-.007a1.561 1.561 0 0 1 0-2.184L2.45 8.335l.001-.001a1.552 1.552 0 0 1 2.175 0v-.001l-.35.357l.35-.356a.561.561 0 0 0 .783 0l.052-.052Z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </el-icon>
                </CallButton>
            </div>
            <div v-show="status === CALL_STATUS.CALLED" class="called">
                <div class="videos">
                    <video width="300" height="300" ref="videoRef"></video>
                </div>
                <div class="buttons">
                    <CallButton
                            type="error"
                            @click="()=>{
                                op.hangup?.()
                            }"
                    >
                        <el-icon size="32">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fill-rule="evenodd"
                                      d="M.22 1.28A.75.75 0 0 1 1.28.22l6.123 6.122l.953-.954l.003-.002a.542.542 0 0 0 0-.772l-.006-.006a1.552 1.552 0 0 1 0-2.175l1.87-1.87l.004-.004a1.561 1.561 0 0 1 2.184 0l.437.447a3.635 3.635 0 0 1 .498 4.555l-.006.01a28.946 28.946 0 0 1-2.995 3.713l3.435 3.436a.75.75 0 1 1-1.06 1.06zm5.242 7.002l2.895 2.895l-.071.066a28.921 28.921 0 0 1-2.707 2.069l-.009.005a3.635 3.635 0 0 1-4.555-.498l-.44-.43l-.007-.007a1.561 1.561 0 0 1 0-2.184L2.45 8.335l.001-.001a1.552 1.552 0 0 1 2.175 0v-.001l-.35.357l.35-.356a.561.561 0 0 0 .783 0l.052-.052Z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </el-icon>
                    </CallButton>
                    <CallButton
                            :type="isRecord?'notClick':'error'"
                            @click="()=>{
                            isRecord = !isRecord
                        }"
                    >
                        <el-icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                <path fill="currentColor"
                                      d="M4.5 10a.5.5 0 0 0-1 0a5.5 5.5 0 0 0 5 5.478V17.5a.5.5 0 0 0 1 0v-.706A5.48 5.48 0 0 1 9 14.5A4.5 4.5 0 0 1 4.5 10M12 5v4.6a5.514 5.514 0 0 0-2.79 3.393A3 3 0 0 1 6 10V5a3 3 0 0 1 6 0m5 9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m2 0a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-8 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0"/>
                            </svg>
                        </el-icon>
                    </CallButton>
                    <CallButton
                            :type="isVideo?'notClick':'error'"
                            @click="()=>{
                            isVideo = !isVideo
                        }"
                    >
                        <el-icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/>
                            </svg>
                        </el-icon>
                    </CallButton>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.call-container {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99999;
    overflow: hidden;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.answer, .calling {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 3px 8px;
}

img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 0px 0px 64px -16px rgba(0, 0, 0, 0.6)
}

.username {
    text-align: center;
}

.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

.background {
    backdrop-filter: blur(10px);
    z-index: 1000;

    &::before {
        content: "";
        filter: blur(10px);
        background-image: var(--background-url);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-position: center;
        z-index: -1;
    }
}

.called {


    .buttons {
        transform: translate(0, 20px);
        opacity: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }

    &:hover .buttons {
        transform: translate(0, -10px);
        opacity: 1;
    }
}
</style>