<script setup lang="ts">
import Footer from '@/components/Footer/index.vue'
import Contacts from './Contacts/Contacts.vue'
import {defineModel, onMounted, ref} from "vue";
import VirtualList from '@/components/VirtualList/index.vue'
import ChatInput from '@/pages/Chat/ChatInput/index.vue'
import ChatMessageArea from '@/pages/Chat/ChatMessageArea/index.vue'
import apis from "@/services/apis.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import {usePeer} from "@/hooks/usePeer.ts";
import ChatHeader from "@/pages/Chat/CharHeader/ChatHeader.vue";
import Sider from "@/pages/Sider/Sider.vue";

let flag = true
const friendsStore = useFriendsStore()
const userinfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const usepeer = usePeer()

onMounted(() => {
    theme()
    userinfoStore.getUserInfo()
    getFriendListFn()
    apis.getMessageList({
        type:'all'
    }).then(r=>{
        const data = r.data
        if(data.state){
            for (let key in r.data.data){
                const messages = r.data.data[key]
                messageStore.setMessageMap(key,messages.map(item=>{
                    item.body = item.body?JSON.parse(item.body):item.body
                    return item
                }))
            }
        }
    })
})

function getFriendListFn(){
    apis.getFriendsList().then(r=>{
        const {state,data} = r.data
        friendsStore.initFriendsList(data)
    })
}

function theme() {
    document.body.setAttribute('theme', flag ? 'light' : 'dark')
    flag = !flag
}


</script>

<template>
    <div class="home">
        <div class="message-wrapper">
<!--            <el-button @click="call">拨打电话</el-button>-->
            <Sider />
            <div style="display: flex;flex-direction: column;flex:1">
                <ChatHeader v-if="friendsStore.selectedFriend" />
                <ChatMessageArea/>
                <ChatInput/>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<style src="./index.scss" scoped lang="scss"></style>