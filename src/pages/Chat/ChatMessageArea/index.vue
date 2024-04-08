<script setup lang="ts">
import {useMessageStore} from "@/stores/messageStore.ts";
import MessageItem from "@/pages/Chat/ChatMessageArea/messageItem.vue";
import {onMounted, ref} from "vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import ContextMenu from "@/components/ContextMenu/index.vue";
import {ContextMenuItemType} from "@/components/ContextMenu/index.ts";

const messageStore = useMessageStore()
const friendStore = useFriendsStore()
const userinfoStore = useUserInfoStore()
const isShowContextMenu  = ref<boolean>(false)
const contextmenuOptions = ref({
    x:0,
    y:0,
    options:[
        {
            title:'测试',
            $event:()=>{
                console.log('测试')
            }
        }
    ] as ContextMenuItemType[]
})


onMounted(()=>{
    console.log('挂载',messageStore.messageMap)
})

function handleContextMenu(e:MouseEvent){
    isShowContextMenu.value = true
    contextmenuOptions.value.x = e.x
    contextmenuOptions.value.y  = e.y
    console.log(isShowContextMenu.value)
}

</script>

<template>
    <div class="chat-message-area-wrapper">
        <message-item @contextmenu.prevent.stop="handleContextMenu" v-for="item in messageStore.messageMap.get(friendStore.selectedFriend || 'default')" v-bind="item" :key="item.id" :own="item.senderId === userinfoStore.info.id" />
    </div>
    <ContextMenu v-model:show="isShowContextMenu" :data="contextmenuOptions" />
</template>

<style scoped lang="scss">
.chat-message-area-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: calc(100% - 28px);
    overflow-y: auto;
    padding: 5px 10px;
    gap:5px;
    background-color: rgba(0,0,0,0.8);
}
</style>