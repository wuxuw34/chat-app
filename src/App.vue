<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref} from "vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import apis from "@/services/apis.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import worker from "@/utils/webworker.ts";
import {SOCKET_EVENTS} from "@/utils/websocket.ts";
import {useRouter} from "vue-router";
import {useStorage} from "@/hooks/useStorage.ts";
import {useNoticeStore} from "@/stores/noticeStore.tsx";
import {MessageType} from "@/type/message";
import {MESSAGE_TYPE} from "@/enums";
import Loading from "@/components/loaders/Loading.vue";

const friendsStore = useFriendsStore()
const messageStore = useMessageStore()
const tokenStorage = useStorage('token')
const value = ref()
const router = useRouter()
const noticeStore = useNoticeStore()
const isLoading = ref(true)

onMounted(() => {
    getMessageList()
    worker.addEventListener('message',handleWebWorkerMessageEvent)
    if(tokenStorage.value){
        worker.postMessage({
            data:{
                token:tokenStorage.value
            }
        })
        router.replace('/')
    }else {
        router.replace('/login')
    }

})

onUnmounted(()=>{
    worker.removeEventListener('message',handleWebWorkerMessageEvent)
})

function handleWebWorkerMessageEvent(ev:MessageEvent){

    const {data:_data} = JSON.parse(ev.data) as MessageType

    const message = _data?JSON.parse(_data):_data
    if(!message && !message?.body) return
    const type = message.body?.type

    switch (type){
        case MESSAGE_TYPE.ADD_FRIEND:{
            noticeStore.addNotice(message)
            break
        }
    }
}
function getMessageList() {
    // apis.getMessageList().then(r => {
    //     messageStore.setMessageMap([{
    //         id:'default',
    //         messages:r.data
    //     }])
    // })
}

function send(){
    worker.postMessage({
        ev:SOCKET_EVENTS.MESSAGE,
        data:value.value
    })
    apis.login({
        'account':'10000',
        password:'123456'
    })
}

function request(){
    const query = new URLSearchParams({
        client_id: 'Iv1.0d2fe786f33cfb07',
        scope: '',
        allow_signup: 'true',
        'redirect_uri':'http://127.0.0.1:5173'
    })
    const url = 'https://github.com/login/oauth/authorize?'+query.toString()
    // fetch(url).then(r=>r.json()).then(r=>{
    //     console.log('结果',r)
    // })
    window.location.href = url
}

provide('closeLoading',()=>{
    isLoading.value = false
})

</script>

<template>
    <div
            class="app-wrapper"
            v-show="!isLoading"
    >
        <RouterView/>
    </div>
    <Loading v-show="isLoading" />
</template>

<style src="./style.scss" scoped lang="scss"></style>