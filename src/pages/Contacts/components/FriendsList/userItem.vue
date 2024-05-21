<script setup lang="ts">

import {MessageType} from "@/type/message";
import Avatar from "@/components/Avatar/Avatar.vue";
import {onMounted, ref, watch} from "vue";
import {handleTime} from "@/utils/time.ts";
import useFriendsStore from "@/stores/friendsStore.ts";
import {MESSAGE_TYPE} from "@/enums";

const props = defineProps<{
  message: MessageType,
  name: string,
  remark?: string,
  id: string,
  type: string
}>()
const time = ref()
const friendStore = useFriendsStore()

onMounted(() => {
  watch(() => props.message?.time, () => {
    time.value = handleTime(Number(props.message?.time || 0))
  })
})


</script>

<template>
  <div class="list-item" v-wave :message-id="id">
    <a>
      <avatar :id="id" :username="name" style="height: 42px;width: 42px;font-size: 20px"/>
      <div class="info">
        <div class="info-row">
          <div class="name">
                    <span>
                        {{ remark ? remark : name }}
                    </span>
          </div>
          <div class="time">
            <!-- {{ message?.time }} -->
            {{ time }}
          </div>
        </div>
        <div class="message">
          <div class="last-message">
            <div class="sender-name">
              {{ friendStore.getUsernameById(message?.sender_id) }}
            </div>
            <div class="colon" v-show="message?.body">:</div>
            <div class="message-body">
              <template v-if="message?.body?.type === MESSAGE_TYPE.TEXT">
                {{ message?.body?.data.content }}
              </template>
              <template v-if="message?.body?.type === MESSAGE_TYPE.FILE">
                {{ message?.body?.data?.fileName }}
              </template>
              <template v-if="message?.body?.type === MESSAGE_TYPE.PIC">
                {{ message?.body?.data?.fileName }}
              </template>
              <template v-if="message?.body?.type === MESSAGE_TYPE.AUDIO">
                [ 语音消息 ]
              </template>
            </div>
          </div>
          <!--                    <div class="unread">-->
          <!--                        {{ 0 }}-->
          <!--                    </div>-->
        </div>
      </div>
      <div class="waves"></div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  width: 100%;
  border-radius: var(--border-radius);
  background-color: var(--color-default);
  height: 72px;
  cursor: pointer;
  position: relative;

  & > a {
    height: 100%;
    pointer-events: none;
    padding: 0.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    caret-color: transparent;
    user-select: none;
    flex-direction: row;
    gap: 0.5rem;

    & > .waves {
      position: absolute;
      overflow: hidden;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }

    & > .avatar {
      height: 100%;
      z-index: 2;

      & > img {
        border-radius: 50%;
        aspect-ratio: 1/1;
        object-fit: cover;
        height: 100%;
      }
    }

    & > .info {
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      height: 100%;
      padding: 0.25rem;
      box-sizing: border-box;
      overflow: hidden;

      .info-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        align-items: center;

        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--color-text);

          span {
            white-space: nowrap;
          }
        }

        .time {
          white-space: nowrap;
          font-size: 0.75rem;
          color: var(--color-text-1);
        }
      }

      .message {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: var(--color-friend-item-message);

        .last-message {
          display: flex;
          flex-direction: row;

          .colon {
            margin-inline-end: 3px;
          }

          .sender-name {
            color: var(--color-friend-item-user-name);
            text-wrap: nowrap;
          }

          .message-body {
            display: flex;
            align-items: center;
            text-wrap: nowrap;
          }

        }

        .unread {
          color: var(--color-unread-number);
          background-color: var(--color-unread-bg);
          border-radius: 1rem;
          padding: 0.125rem 0.5rem;
        }
      }

    }
  }

  &:hover {
    background-color: var(--color-friend-item-hover);
  }
}
</style>