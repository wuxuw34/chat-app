<script setup lang="ts">
import FriendsList from './components/FriendsList/index.vue'
import {computed, ref} from "vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import {FriendType, UserType} from "@/type/user";
import {ChatDotRound, Plus, Search} from "@element-plus/icons-vue";
import {debounce} from "@/utils/utils.ts";
import apis from "@/services/apis.ts";
import UserItem from "@/pages/Contacts/components/UserItem.vue";
import {ElNotification} from "element-plus";

const store = useFriendsStore()
const friendsList = computed(() => {
    let res: FriendType[] = []
    if (store.friendsList){
        for (let i of store.friendsList.values()) {
            res.push(i)
        }
    }
    return res
})
const searchValue = ref<string>()
const searchUserValue = ref<string>()
const isShowAddFriendPanel = ref<boolean>(false)  // 是否显示添加好友面板
const activeName = ref<string>('all')
const searchUserDebounce = debounce(searchUsers)
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
                if (item.isGroup) {
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
        if (state) {
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

</script>

<template>
    <div>
        <div class="search-form">
            <el-input v-model="searchValue" style="flex:1" :prefix-icon="Search" />
            <el-popover
                    trigger="click"
                    :popper-style="{
                    padding:'4px'
                }"
            >
                <template #reference>
                    <el-button
                            text

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
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
        <FriendsList :value="store.selectedFriend" @update-value="store.updateSelectedFriend" :list="friendsList"
                     style="height: 600px"/>
        <el-dialog
                v-model="isShowAddFriendPanel"
                title="添加好友/群"
                width="600"
                style="min-height: 400px"
        >
            <el-input v-model="searchUserValue" :prefix-icon="Search" @input="handleSearchUsers"/>
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
            <!--            <template #footer>-->
            <!--                <el-button-->
            <!--                    @click="isShowAddFriendPanel = false"-->
            <!--                >取消-->
            <!--                </el-button>-->
            <!--            </template>-->
        </el-dialog>
        <el-dialog
                v-model="isShowCreateGroup"
                title="添加好友/群"
                width="400"
                style="min-height: 400px"
        >
            <el-divider style="margin-top: 5px"/>
            <el-form
                    label-position="left"
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
                <el-form-item>
                    <el-button @click="closeAddGroupPanel">取消</el-button>
                    <el-button @click="createGroup">创建</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
$icon-size: 32px;

.search-form {
    display: flex;
    flex-direction: row;
    height: $icon-size;

    i, button {
        width: $icon-size;
        height: $icon-size;
    }
}

.popper {
    padding: 4px;
    background-color: red;
}

.popper-content {
    display: flex;
    flex-direction: column;

    ::v-deep(.el-button) {
        justify-content: left;
    }
}

.search-users-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
}

.avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
    }
}


</style>