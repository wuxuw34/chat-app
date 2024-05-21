<script setup lang="ts">

import Contacts from "@/pages/Contacts/Contacts.vue";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import SettingVue from './Setting.vue'
import {onMounted, provide, ref} from "vue";
import {ChatDotRound, Plus, Search} from '@element-plus/icons-vue'
import TransitionVue from "@/components/Transition/Transition.vue";
import apis from "@/services/apis.ts";
import {UserType} from "@/type/user";
import {ElNotification} from "element-plus";
import {debounce} from "@/utils/utils.ts";
import UserItem from "@/pages/Contacts/components/UserItem.vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import {AddFriendNoticeItem, events, NOTIFICATION_TYPE, useNoticeStore} from '@/stores/noticeStore.tsx'

const noticestore = useNoticeStore()
const userinfo = useUserInfoStore()
const friendsStore = useFriendsStore()
const isShowUserInfo = ref(false)
const isShowSetting = ref(false)
const transitionComponent = ref()
const transitionName = ref()
const searchUserDebounce = debounce(searchUsers)
const searchValue = ref<string>()
const searchUserValue = ref<string>()
const isShowAddFriendPanel = ref<boolean>(false)  // 是否显示添加好友面板
const activeName = ref<string>('all')
const isShowCreateGroup = ref<boolean>(false)
const searchUserResults = ref({
  user: [],
  group: []
})
const imageUrl = ref()
const groupInfo = ref({
  username: '',
  avatar: ''
})

onMounted(() => {

})

function setSiderContainer(component: any) {
  isShowSetting.value = false
  transitionComponent.value = component
  transitionName.value = 'enter'
}

function initSearchUserResults() {
  searchUserResults.value.user = []
  searchUserResults.value.group = []
}

function searchUsers() {
  apis.user({
    q: searchUserValue.value
  }).then(r => {
    const {data} = r
    if (data.state) {
      initSearchUserResults();
      (data.data as any[]).forEach((item: UserType) => {
        if (item.is_group) {
          searchUserResults.value.group.push(item)
        } else {
          searchUserResults.value.user.push(item)
        }
      })
    }
  })
}

function handleSearchUsers() {
  searchUserDebounce()
}

function createGroup() {
  apis.group({
    type: 'create',
    data: {
      username: groupInfo.value.username
    }
  }).then(r => {
    const data = r.data
    if (data.state) {
      ElNotification.success({
        title: '群聊创建成功',
        message: `群号为${data.data.id}`
      })
      apis.getFriendsList().then(r => {
        const {state, data} = r.data
        friendsStore.initFriendsList(data)
      })
    }
    closeAddGroupPanel()
  })
}


function addUser(id: number) {
  apis.friend({
    type: 'add',
    data: {
      id
    }
  }).then(r => {
    const {state, msg} = r.data
    if (!state) {
      ElNotification.error({
        duration: 1000,
        title: '请求好友添加失败',
        message: msg
      })
    }
  })
}

function handleAvatarUpload(file: any) {
  imageUrl.value = URL.createObjectURL(file.raw)
}

function closeAddGroupPanel() {
  isShowCreateGroup.value = false
  groupInfo.value.username = ''
  groupInfo.value.avatar = ''
  imageUrl.value = ''
}

provide('setSiderContainer', setSiderContainer)

</script>

<template>
  <div class="sider-container">
    <TransitionVue
        v-model:is="transitionComponent"
    >
      <template #default>
        <div class="search-form">
          <el-popover
              popper-class="avatar-popper"
              trigger="click"
              v-model:visible="isShowSetting"
              :popper-style="{
                        padding:'5px 3px'
                     }"
          >
            <template #reference>
              <el-button
                  text
                  round
              >
                <el-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                       viewBox="0 0 48 48">
                    <path fill="currentColor" stroke="black" stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="4"
                          d="M41.5 10h-6m-8-4v8m0-4h-22m8 14h-8m16-4v8m22-4h-22m20 14h-6m-8-4v8m0-4h-22"/>
                  </svg>
                </el-icon>
              </el-button>
            </template>
            <div class="avatar-popper-buttons">
              <el-button
                  class="avatar-popper-button"
                  text
              >
                个人信息
              </el-button>
              <el-button
                  class="avatar-popper-button"
                  text
                  @click="()=>{
                                setSiderContainer(SettingVue)
                            }"
              >
                设置
              </el-button>
            </div>
          </el-popover>
          <el-input v-model="searchValue" style="flex:1" :prefix-icon="Search"/>
          <el-popover
              trigger="click"
          >
            <template #reference>
              <el-button
                  text
              >
                <el-icon size="18">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                      <path
                          d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                      <path fill="currentColor"
                            d="M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2.001 2.001 0 0 1-.212-.894V9a5 5 0 0 0-5-5"/>
                    </g>
                  </svg>
                </el-icon>
              </el-button>
            </template>
            <div class="notification-content">
              <div v-if="!noticestore.noticeList.length">
                暂无通知
              </div>
              <div v-else>
                <AddFriendNoticeItem v-for="item in noticestore.noticeList" :id="item.content.sender_id"
                                     :name="item.content.username"
                                     :confirm="events[NOTIFICATION_TYPE.ADD_FRIEND].confirm"
                                     :cancel="events[NOTIFICATION_TYPE.ADD_FRIEND].cancel"/>
              </div>
            </div>
          </el-popover>
          <el-popover
              trigger="click"
              :popper-style="{
                    padding:'4px'
                }"
          >
            <template #reference>
              <el-button
                  text
                  style="margin-left: 0"
              >
                <el-icon>
                  <Plus/>
                </el-icon>
              </el-button>
            </template>
            <div class="popper-content">
              <el-button text style="width: 100%"
                         @click="isShowAddFriendPanel = true"
              >
                <el-icon class="el-icon--left">
                  <ChatDotRound/>
                </el-icon>
                添加好友/群
              </el-button>
              <el-button text style="width: 100%;margin-left: 0"
                         @click="isShowCreateGroup = true"
              >
                <el-icon class="el-icon--left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                       viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                      <path
                          d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                      <path fill="currentColor"
                            d="M16 14a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5zm4-6a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1V9a1 1 0 0 1 1-1m-8-6a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/>
                    </g>
                  </svg>
                </el-icon>
                创建群聊
              </el-button>
            </div>
          </el-popover>
        </div>
        <Contacts/>
      </template>
    </TransitionVue>
  </div>
  <teleport to="body">
    <el-dialog
        v-model="isShowAddFriendPanel"
        title="添加好友/群"
        width="600"
        style="min-height: 400px"
    >
      <el-input v-model="searchUserValue" :prefix-icon="Search" placeholder="请输入id或者关键字查找用户或者群组"
                @input="handleSearchUsers"/>
      <el-divider style="margin-bottom: 8px;margin-top: 16px"/>
      <el-tabs v-model="activeName" class="demo-tabs">
        <div v-show="searchUserValue">
          <el-tab-pane name="all" label="全部">
            <div v-show="searchUserResults.group.length">
              <div class="search-users-item">
                <el-text class="mx-1">群聊</el-text>
                <el-button text type="primary" @click="activeName = 'groups'">更多</el-button>
              </div>
              <UserItem @add="addUser" v-for="item in searchUserResults.group" :avatar="item.avatar"
                        :is-group="true" :account="item.id" :username="item.username"/>
            </div>
            <div v-show="searchUserResults.user.length">
              <div class="search-users-item">
                <el-text class="mx-1">用户</el-text>
                <el-button text type="primary" @click="activeName = 'users'">更多</el-button>
              </div>
              <UserItem @add="addUser" v-for="item in searchUserResults.user" :avatar="item.avatar"
                        :is-group="false" :username="item.username" :account="item.id"/>
            </div>
          </el-tab-pane>
          <el-tab-pane name="users" label="用户"></el-tab-pane>
          <el-tab-pane name="groups" label="群"></el-tab-pane>
        </div>
      </el-tabs>
      <el-empty description="输入关键词搜索" v-show="!searchUserValue"/>
    </el-dialog>
    <el-dialog
        v-model="isShowCreateGroup"
        title="创建群组"
        width="400"
        style="min-height: 300px"
    >
      <el-divider style="margin-top: 5px"/>
      <el-form
          label-position="left"
          label-width="auto"
      >
        <el-form-item label="群名称" required>
          <el-input v-model="groupInfo.username" placeholder="请输入群名称"/>
        </el-form-item>
        <el-form-item
            label="头像"
        >
          <el-upload
              :show-file-list="false"
              class="avatar-uploader"
              :auto-upload="false"
              @change="handleAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="头像"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="create-group-buttons">
        <el-button @click="closeAddGroupPanel">取消</el-button>
        <el-button @click="createGroup" type="primary">创建</el-button>
      </div>
    </el-dialog>
  </teleport>
</template>

<style scoped lang="scss">
$icon-size: 32px;

.sider-container {

  min-width: 300px;
  height: 100%;

  .sider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
  }

}

.setting-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.setting-container {
  .avatar-container {
    position: relative;

    .avatar {
      width: 100%;
      aspect-ratio: 1/1;
      font-size: 72px;
      border-radius: 3px;
    }

    .info {
      position: absolute;
      left: 3%;
      bottom: 3%;
      color: var(--color-white);
      font-size: 18px;
      display: flex;
      flex-direction: column;

      span:nth-child(2) {
        color: var(--color-gray-1);
      }
    }
  }

  .setting-list {
    display: flex;
    flex-direction: column;
    width: 100%;

    .setting-item {
      display: flex;
      flex-direction: row;
      justify-content: left;
      font-size: 18px;
      padding: 3px 6px;
      height: 42px;
      margin-left: 0;
    }
  }
}

.avatar-popper-buttons {
  display: flex;
  flex-direction: column;

  .avatar-popper-button {

  }
}

.search-form {
  display: flex;
  flex-direction: row;
  height: 42px;
  align-items: center;

  i, button {
    width: $icon-size;
    height: $icon-size;
  }
}

.create-group-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader-icon {
  width: 100px;
  height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
}
</style>