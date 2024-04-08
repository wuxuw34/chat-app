<script setup lang="ts">

import appConfig from "@/utils/config.ts";

defineProps<{
    avatar?:string,
    username:string,
    account:number,
    isGroup:{
        type:string,
        default:false
    },
    capacity?:number,
    exist?:number
}>()

defineEmits<{
    (e:'add',value:number):void
}>()

</script>

<template>
  <div class="user-item-wrapper">
      <div class="user-info">
          <div class="avatar">
              <img :src="appConfig.server + 'api' + avatar" alt="头像" />
          </div>
          <div class="other">
              <div class="username">
                  {{ username }}
              </div>
              <div v-if="!isGroup" class="account">
                  {{ account }}
              </div>
              <div v-else class="group-capacity">
                  {{ exist + '/' + capacity }}
              </div>
          </div>
      </div>
      <el-button size="small" @click="$emit('add',account)">添加</el-button>
  </div>
</template>

<style scoped lang="scss">
.user-item-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height:32px;
    margin-bottom: 5px;
    border-radius: 5px;
    padding: 5px 8px;
    user-select: none;

    &:hover{
        background-color: rgba(211, 211, 211,0.2);
    }

    .user-info{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap:3px;

        .avatar{
            img{
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
        }

    }

}
</style>