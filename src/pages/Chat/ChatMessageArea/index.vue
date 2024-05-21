<script setup lang="ts">
import {useMessageStore} from "@/stores/messageStore.ts";
import MessageItem from "@/pages/Chat/ChatMessageArea/messageItem.vue";
import {h, inject, nextTick, onMounted, provide, ref} from "vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import ContextMenu from "@/components/ContextMenu/ContextMenu.vue";
import {ContextMenuItemType} from "@/components/ContextMenu/index.ts";
import {ElIcon} from "element-plus";
import ContextMenuItem from "@/components/ContextMenu/ContextMenuItem.vue";
import ReplayIcon from "@/components/icons/ReplayIcon.vue";
import CopyIcon from "@/components/icons/CopyIcon.vue";
import RevokeMsgIcon from "@/components/icons/RevokeMsgIcon.vue";
import VirtualList from "@/components/VirtualList/VirtualList.vue";
import apis from "@/services/apis.ts";
import friendsStore from "@/stores/friendsStore.ts";
import {MessageType} from "@/type/message";
import {Bottom} from "@element-plus/icons-vue";
import {DIRECTION_TYPE} from "@/components/VirtualList/props.ts";

const messageStore = useMessageStore()
const friendStore = useFriendsStore()
const userinfoStore = useUserInfoStore()
const isShowContextMenu = ref<boolean>(false)
const virtualListRef = ref()
let isFirstLoad = true
const contextMenuId = ref('0')
const contextmenuOptions = ref({
  x: 0,
  y: 0
})
const replyFn = inject('reply')
const showAffix = ref(false)
const contextmenuItems = [
  {
    label: '回复',
    event: () => {
      replyFn(contextMenuId.value)
    },
    icon: ReplayIcon
  },
  {
    label: '复制',
    event: () => {
      console.log('复制')
    },
    icon: CopyIcon
  },
  {
    label: '撤回',
    event: () => {
      console.log('撤回', contextMenuId.value)
      apis.recall(contextMenuId.value)
    },
    icon: RevokeMsgIcon
  }
]

onMounted(() => {

})

function handleContextMenu(e: MouseEvent, id: string) {
  isShowContextMenu.value = true
  contextmenuOptions.value.x = e.x
  contextmenuOptions.value.y = e.y
  contextMenuId.value = id
}

function onResize() {
  if (isFirstLoad) {
    virtualListRef.value.scrollToBottom()
  }
}

function onToTop() {
  const friend_id = friendStore.selectedFriend
  apis.getHistoryMessage({
    mid: messageStore.messageMap.get(friendStore.selectedFriend || 'default')[0]['id']
  }).then(res => {
    isFirstLoad = false
    const old = messageStore.messageMap.get(friend_id).length
    messageStore.addMessageToClient(friend_id, res.data.data[friend_id])
    nextTick(() => {
      virtualListRef.value.scrollToOffset(virtualListRef.value.getOffsetByIndex(res.data.data[friend_id].length - old))
    })
  })
}

function handleScroll(bottom: number) {
  isShowContextMenu.value = false
  console.log(bottom)
  showAffix.value = bottom > 0;
  console.log(showAffix.value)
}

provide('contextmenu', handleContextMenu)

</script>

<template>
  <div class="chat-message-area-wrapper" id="chat-message-area">
    <VirtualList
        :dataSources="messageStore.messageMap.get(friendStore.selectedFriend || 'default') || []"
        :overscan="5"
        :keeps="20"
        :dataKey="(value:MessageType)=>{
                    return value['id'] as string
                }"
        :component="MessageItem"
        :isBottom="true"
        :fromEnd="true"
        @onToTop="onToTop"
        @resize="onResize"
        ref="virtualListRef"
        @onScroll="handleScroll"
        :showAffix="showAffix"
    ></VirtualList>
  </div>
  <ContextMenu v-model:show="isShowContextMenu" :data="contextmenuOptions">
    <ContextMenuItem v-for="item in contextmenuItems" :icon="item?.icon" :label="item.label" :event="item.event"/>
  </ContextMenu>
</template>

<style scoped lang="scss">
.chat-message-area-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;

  overflow-y: auto;
  padding: 5px 10px;
  gap: 5px;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>