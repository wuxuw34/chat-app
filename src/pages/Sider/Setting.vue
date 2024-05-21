<script setup lang="ts">
import TransitionVue from "@/components/Transition/Transition.vue";
import {inject, ref} from "vue";
import {Edit} from '@element-plus/icons-vue'
import EditUserInfo from "@/pages/Sider/EditUserInfo.vue";
import useUserInfoStore from "@/stores/userInfoStore.ts";
import Avatar from "@/components/Avatar/Avatar.vue";
import {showUserInfo} from "../../utils/showUserInfo.ts";
import ButtonWave from "@/components/Button/ButtonWave.vue";

const goBack = inject('goBack')
const transitionElement = ref()
const userinfo = useUserInfoStore()

function openEditUserInfo() {
    transitionElement.value = EditUserInfo
}

</script>
<template>
    <TransitionVue
            v-model:is="transitionElement"
    >
        <template #default>
            <div class="setting-header">
                <el-button
                        @click="goBack"
                        text
                        circle
                >
                    <el-icon size="32">
                        <img src="@/assets/svgs/back.svg" alt="返回"/>
                    </el-icon>
                </el-button>
                <div class="operate">
                    <el-button
                            circle
                            text
                            @click="openEditUserInfo"
                    >
                        <el-icon size="22">
                            <img src="@/assets/svgs/edit.svg" alt="编辑" title="编辑"/>
                        </el-icon>
                    </el-button>
                    <el-button
                            circle
                            text
                    >
                        <el-icon size="22">
                            <img src="@/assets/svgs/menu.svg" alt="菜单" title="菜单"/>
                        </el-icon>
                    </el-button>
                </div>
            </div>
            <div class="setting-content">
                <div class="user-show">
                    <avatar class="avatar" :username="userinfo.info.username" :id="userinfo.info.id"/>
                    <div class="info">
                        <span class="username">{{ userinfo.info.username }}</span>
                        <span class="last-login">上次登录时间:12:00</span>
                    </div>
                </div>
                <div class="email">
                    <ButtonWave size="large" copy :_copy="showUserInfo(userinfo.info, 'email')" title="邮箱">
                        <template #default>
                            <div class="button-content" >
                                <el-icon size="32" color="#73767a">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                         viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/>
                                    </svg>
                                </el-icon>
                                <div>
                                    <div>{{ showUserInfo(userinfo.info, 'email') }}</div>
                                    <div style="font-weight: 400">邮箱</div>
                                </div>
                            </div>
                        </template>
                    </ButtonWave>
                </div>

            </div>
        </template>
    </TransitionVue>
</template>

<style scoped lang="scss">
.setting-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    .operate {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
}

.user-show {
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    display: flex;
    justify-content: center;

    .avatar {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        font-size: 42px;
    }

    .info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 96%;
        height: 50%;
        display: flex;
        flex-direction: column;
        padding: 3px 2%;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
        justify-content: end;
        color: white;

        .username {
            font-size: 18px;
        }

        .last-login {
            opacity: 0.5;
        }
    }
}

.setting-content {
    padding: 1% 1% 0;

    .email {
        width: 100%;

    }
}

.button-content {
    display: flex;
    flex-direction: row;
    height: 60px;
    align-items: center;
    justify-content: start;
    gap: 6px
}

.button-props {
    width: 100%;
}
</style>