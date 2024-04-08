<script setup lang="ts">

import Contacts from "@/pages/Contacts/Contacts.vue";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import {ref} from "vue";
import {Back, Edit, Setting,Notification,Iphone} from '@element-plus/icons-vue'
import Avatar from "@/components/Avatar/Avatar.vue";

const userinfo = useUserInfoStore()
const isShowUserInfo = ref(false)
const isShowSetting = ref(false)

function showUserInfo() {
    isShowUserInfo.value = true
}

function showSetting() {
    isShowSetting.value = true
}

function closeSetting() {
    isShowSetting.value = false
}

</script>

<template>
    <div class="sider-container">
        <div class="sider-header">
            <avatar @click="showUserInfo" :username="userinfo.info.username" :id="userinfo.info.id"/>
            <div class="others">
                <el-button
                        round
                        text
                        style="width: 24px;height:24px"
                        @click="showSetting"
                >
                    <el-icon size="24" :style="{
                        color:'var(--color-gray-1)'
                    }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                            <path fill="currentColor"
                                  d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1c0 29.9 11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8c29.9 0 57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1c0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8m412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.44 353.44 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.93 445.93 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.27 448.27 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35m-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8"/>
                        </svg>
                    </el-icon>
                </el-button>
            </div>
        </div>
        <Contacts style="width: 300px"/>
    </div>
    <el-dialog
            v-model="isShowUserInfo"
            width="500"
    >
        你好
    </el-dialog>
    <el-dialog
            v-model="isShowSetting"
            :show-close="false"
            :close-on-click-modal="false"
    >
        <template #header>
            <div class="setting-header">
                <div class="left">
                    <el-button
                            round
                            text
                            style="aspect-ratio: 1/1"
                            @click="closeSetting"
                    >
                        <el-icon size="16">
                            <Back/>
                        </el-icon>
                    </el-button>
                    <span>设置</span>
                </div>
                <div class="right">
                    <el-button
                            text
                            round
                            style="aspect-ratio: 1/1"
                    >
                        <el-icon>
                            <Edit/>
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </template>
        <template #default>
            <div class="setting-container">
                <div class="avatar-container">
                    <avatar class="avatar" :id="userinfo.info.id" :username="userinfo.info.username"/>
                    <div class="info">
                       <span>
                           {{ userinfo.info.username }}
                       </span>
                        <span>
                           online
                       </span>
                    </div>
                </div>

                <div class="setting-list">
                    <el-button text class="setting-item">
                        <template #icon>
                            <el-icon size="20">
                                <Setting/>
                            </el-icon>
                        </template>
                        一般设置
                    </el-button>
                    <el-button text class="setting-item">
                        <template #icon>
                            <el-icon size="20">
                                <Notification/>
                            </el-icon>
                        </template>
                        通知
                    </el-button>
                    <el-button text class="setting-item">
                        <template #icon>
                            <el-icon size="20">
                                <Iphone/>
                            </el-icon>
                        </template>
                        登录信息
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.sider-container {


    .sider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
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
</style>