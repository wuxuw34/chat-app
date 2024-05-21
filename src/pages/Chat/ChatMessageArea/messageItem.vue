<script setup lang="ts">

import {MessageType} from "@/type/message";
import config from "@/utils/config.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import {getUserNameColorById} from "@/utils/color.ts";
import {handleTime} from "@/utils/time.ts";
import {MESSAGE_TYPE} from "@/enums";
import ImageViewer from '@/components/ImageViewer/Viewer.vue'
import {useImageViewer} from "@/hooks/useImageViewer.ts";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import Avatar from "@/components/Avatar/Avatar.vue";
import AudioItem from "@/pages/Chat/ChatMessageArea/AudioItem.vue";
import FileItem from "@/pages/Chat/ChatMessageArea/FileItem.vue";
import {inject} from "vue";

const props = defineProps<MessageType>()

const friendsStore = useFriendsStore()
const userinfo = useUserInfoStore()
const {open} =  useImageViewer()

const contextmenu = inject('contextmenu')

</script>

<template>
   <div  class="message-item-container" :style="{
       justifyContent:own?'end':'start'
   }" :message-id="id" @contextmenu.prevent="(e)=>{
       contextmenu(e,id)
   }">
       <div v-if="!own" class="message-item-wrapper" >
           <avatar :id="sender_id" :username="friendsStore.getUsernameById(sender_id)" />
           <div class="message" >
               <div class="corner"></div>
               <div class="info" :style="{
                color:getUserNameColorById(sender_id)
            }"> {{ friendsStore.getUsernameById(sender_id) }}
               </div>
               <div class="reply-message"></div>
               <div class="body">
                   {{ body?.data?.content }}
                   <ImageViewer v-if="body?.type === MESSAGE_TYPE.PIC" :url="config.server + body.data.url" />
                   <AudioItem v-else-if="body?.type === MESSAGE_TYPE.AUDIO" :url="config.server + body.data.url" />
                   <FileItem v-else-if="body?.type === MESSAGE_TYPE.FILE" :file-name="body.data.fileName" :file-size="body.data.fileSize" :url="body.data.url" />
                   <div v-else-if="body?.type === MESSAGE_TYPE.CALL">
                        {{  }}
                    </div>
                   <div class="time">
                       <span>{{ handleTime(time) }}</span>
                   </div>
               </div>
           </div>
       </div>
       <div v-if="own" class="message-item-wrapper-own" >
           <div class="message" >
               <div class="corner"></div>
               <div class="info" :style="{
                color:getUserNameColorById(sender_id)
            }"> {{ userinfo.info.username }}
               </div>
               <div class="reply-message"></div>
               <div class="body">
                   {{ body?.data?.content }}

                   <ImageViewer v-if="body.type === MESSAGE_TYPE.PIC" :url="config.server + body.data.url" />
                   <AudioItem v-else-if="body.type === MESSAGE_TYPE.AUDIO" :url="config.server + body.data.url" />
                   <FileItem v-else-if="body.type === MESSAGE_TYPE.FILE" :file-name="body.data.fileName" :file-size="body.data.fileSize" :url="body.data.url" />
                   <div class="time">
                       <span>{{ handleTime(time) }}</span>
                   </div>
               </div>
           </div>
           <avatar :id="sender_id" :username="userinfo.info.username" />
       </div>
   </div>
</template>

<style scoped lang="scss">
.message-item-container{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
}
.message-item-wrapper {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 5px;

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;


        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    & > .message {

        position: relative;
        background-color: #fff;
        border-radius: 10px 10px 10px 0;
        padding: 4px 8px;
        user-select: none;

        & > .body {

            font-size: 16px;
            min-width: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap:6px;
        }

        & > .info {
            font-size: 14px;
        }

        & > .corner {
            padding: 0;
            width: 9px;
            height: 17px;
            mask: radial-gradient(25px at -18px 0, #0000 100%, #000 102%);
            position: absolute;
            bottom: 0;
            left: 0;
            transform: translate(-7px);
            background-color: #fff;
        }

        & > .own {
            mask: radial-gradient(25px at 18px 0, #0000 100%, #000 102%);
            right: 0;
            transform: translate(7px);
        }

    }
}
.message-item-wrapper-own {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 5px;
    align-self: end;

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;


        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    & > .message {

        position: relative;
        background-color: #fff;
        border-radius: 10px 10px 0 10px;
        padding: 4px 8px;
        user-select: none;

        & > .body {

            font-size: 16px;
            user-select: none;
            min-width: 100px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap:6px

        }

        & > .info {
            font-size: 14px;
        }

        & > .corner {
            padding: 0;
            width: 9px;
            height: 17px;
            mask: radial-gradient(25px at 27px 0, #0000 100%, #000 102%);
            position: absolute;
            bottom: 0;
            right: 0;
            transform: translate(7px);
            background-color: #fff;
        }

    }
}
.time {
    font-size: 12px;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &>span{
        width: fit-content;
        transform: translate(0,30%);
    }
}
</style>