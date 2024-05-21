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
    if (store.friendsList) {
        for (let i of store.friendsList.values()) {
            res.push(i)
        }
    }
    return res
})

</script>

<template>
    <FriendsList :value="store.selectedFriend" @update-value="store.updateSelectedFriend" :list="friendsList"
                 style="height: 600px"/>
</template>

<style scoped lang="scss">


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

.create-group-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

</style>