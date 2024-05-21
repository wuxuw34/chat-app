<script setup lang="ts">
import Footer from '@/components/Footer/index.vue'
import Contacts from './Contacts/Contacts.vue'
import {defineModel, inject, onMounted, ref, watch} from "vue";
import VirtualList from '@/components/VirtualList/VirtualList.vue'
import ChatInput from '@/pages/Chat/ChatInput/index.vue'
import ChatMessageArea from '@/pages/Chat/ChatMessageArea/index.vue'
import apis from "@/services/apis.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import {usePeer} from "@/hooks/usePeer.ts";
import ChatHeader from "@/pages/Chat/ChatHeader/ChatHeader.vue";
import Sider from "@/pages/Sider/Sider.vue";
import TransitionVue from '@/components/Transition/Transition.vue'
import ChatIndex from "@/pages/Chat/ChatIndex.vue";
import useWindowSize from "@/hooks/useWindowSize.ts";
import {isMobile} from "@/utils/device.ts";
import notice from "../../server/src/routes/notice.ts";
import {NOTIFICATION_TYPE, useNoticeStore} from "@/stores/noticeStore.tsx";

let flag = true
const friendsStore = useFriendsStore()
const userinfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const transitionElement = ref()
const windowSize = useWindowSize()
const transitionRef = ref()
const closeLoading = inject('closeLoading')
const noticeStore = useNoticeStore()

onMounted(() => {
  handleWindowSizeChange()
  theme()
  userinfoStore.getUserInfo()
  getFriendListFn()
  getNotification()
  closeLoading()
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
  watch(() => windowSize.width.value, () => {
    handleWindowSizeChange()
  })
  watch(() => friendsStore.selectedFriend, () => {
    if (friendsStore.selectedFriend && !transitionElement.value) {
      transitionElement.value = ChatIndex
    }
    if (!friendsStore.selectedFriend) {
      return
    }
  })
})

function getNotification() {
  apis.notification(null).then(res => {
    res.data!.data.friend_request_list.forEach(item => {
      noticeStore.addNotice(NOTIFICATION_TYPE.ADD_FRIEND,{
        username:item.username,
        sender_id:item.user_id
      })
    })
  })
}

function getFriendListFn() {
  apis.getFriendsList().then(r => {
    const {state, data} = r.data
    friendsStore.initFriendsList(data)
  })
}

function theme() {
  document.body.setAttribute('theme', flag ? 'light' : 'dark')
  flag = !flag
}

function handleWindowSizeChange() {
  if (isMobile(windowSize.width.value)) {
    transitionElement.value = null
  } else {
    transitionElement.value = ChatIndex
  }
}

</script>

<template>
  <div class="home">
    <div class="message-wrapper">
      <TransitionVue
          v-model:is="transitionElement"
          :isResponse="true"
          ref="transitionRef"
      >
        <Sider/>
      </TransitionVue>
    </div>
    <Footer/>
  </div>
</template>

<style src="./index.scss" scoped lang="scss"></style>