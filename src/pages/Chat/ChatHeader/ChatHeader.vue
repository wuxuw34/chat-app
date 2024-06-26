<script setup lang="ts">

import {usePeer} from "@/hooks/usePeer.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import friendsStore from "@/stores/friendsStore.ts";
import Avatar from "@/components/Avatar/Avatar.vue";
import {inject, onMounted, ref, watch} from "vue";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {isMobile} from "@/utils/device.ts";

const windowSize = useWindowSize()
const peer = usePeer()
const friendStore = useFriendsStore()
const username = ref()
const goBack = inject('goBack')
const mobileMode = ref(false)


onMounted(() => {
    username.value = friendStore.getUsernameById(friendStore.selectedFriend)
    mobileMode.value = isMobile(windowSize.width.value)
})

watch(() => friendStore.selectedFriend, () => {
    username.value = friendStore.getUsernameById(friendStore.selectedFriend)
})

watch(() => windowSize.width.value, () => {
    mobileMode.value = isMobile(windowSize.width.value)
})

function call() {
    peer.connect(friendStore.selectedFriend)
}

function revokeCall(uid: string) {
    peer.revokeCall(uid)
}

function handleGoBack(){
    friendStore.selectedFriend = ''
    goBack()
}

</script>

<template>
    <div class="chat-header-container">
        <div class="info">
            <el-button
                text
                round
                style="width: 24px;height: 24px"
                @click="handleGoBack"
                v-show="mobileMode"
            >
                <el-icon size="22">
                    <img src="@/assets/svgs/back.svg" alt="返回" />
                </el-icon>
            </el-button>
            <avatar :id="friendStore.selectedFriend" style="height: 36px;width: 36px" :username="username"/>
            <div>
                <div class="name">{{ username }}</div>
                <el-text class="mx-1" type="primary">在线</el-text>
            </div>
        </div>
        <el-icon size="24" @click="call">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="black"
                      d="M18.93 20q-2.528 0-5.184-1.266q-2.656-1.267-4.934-3.555q-2.28-2.289-3.546-4.935Q4 7.598 4 5.07q0-.458.3-.763Q4.6 4 5.05 4h2.473q.408 0 .712.257t.411.658L9.142 7.3q.07.42-.025.733q-.094.313-.332.513L6.59 10.592q.616 1.118 1.361 2.076q.745.959 1.59 1.817q.87.87 1.874 1.62q1.004.749 2.204 1.414l2.139-2.177q.244-.263.549-.347q.305-.083.674-.033l2.104.43q.407.1.661.41q.254.311.254.713v2.435q0 .45-.306.75q-.305.3-.763.3M6.12 9.654l1.92-1.766q.096-.076.124-.211q.03-.135-.01-.25l-.443-2.12q-.039-.153-.135-.23T7.327 5H5.275q-.115 0-.192.077t-.077.192q.029 1.025.32 2.14q.293 1.116.795 2.245m8.45 8.334q1.014.502 2.16.743q1.148.24 2 .257q.115 0 .192-.076q.077-.077.077-.193v-2.007q0-.154-.077-.25q-.077-.097-.23-.135l-1.85-.379q-.116-.038-.203-.01q-.086.03-.182.125zm0 0"/>
            </svg>
        </el-icon>
    </div>
</template>

<style lang="scss" scoped>
.chat-header-container {
    min-height: 42px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .info {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        .name {
            font-weight: 500;
            unicode-bidi: plaintext;
        }
    }
}


</style>