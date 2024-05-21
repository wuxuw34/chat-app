<script setup lang="ts">
import Footer from '@/components/Footer/index.vue'
import Contacts from './Contacts/Contacts.vue'
import {defineModel, onMounted, provide, ref} from "vue";
import VirtualList from '@/components/VirtualList/VirtualList.vue'
import ChatInput from '@/pages/Chat/ChatInput/index.vue'
import ChatMessageArea from '@/pages/Chat/ChatMessageArea/index.vue'
import apis from "@/services/apis.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import ChatHeader from "@/pages/Chat/ChatHeader/ChatHeader.vue";

const friendsStore = useFriendsStore()
const userinfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const chatInputRef = ref()

onMounted(() => {
  userinfoStore.getUserInfo()
  getFriendListFn()
  apis.getMessageList({
    type: 'all'
  }).then(r => {
    const data = r.data
    if (data.state) {
      for (let key in r.data.data) {
        const messages = r.data.data[key]
        messageStore.setMessageMap(key, messages.map(item => {
          item.body = item.body ? JSON.parse(item.body) : item.body
          return item
        }))
      }
    }
  })
})

function getFriendListFn() {
  apis.getFriendsList().then(r => {
    const {state, data} = r.data
    friendsStore.initFriendsList(data)
  })
}

provide('reply', (id: string) => {
  chatInputRef.value.reply(id)
})


</script>

<template>
  <div style="" class="main-chat">
    <ChatHeader v-if="friendsStore.selectedFriend" style="height: 42px;"/>
    <ChatMessageArea style="flex: 1"/>
    <ChatInput ref="chatInputRef" style="height: 40px;"/>
  </div>

</template>

<style scoped lang="scss">
.main-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
</style>