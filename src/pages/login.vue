<script setup lang="ts">
import {md5} from "js-md5";
import {onMounted, ref, watch} from "vue";
import apis from "@/services/apis.ts";
import {ElNotification, FormRules, TabsPaneContext} from 'element-plus'
import useWindowSize from "@/hooks/useWindowSize.ts";
import TypingVue from '@/components/Typing/index.vue'
import {useRouter} from "vue-router";
import {useStorage} from "@/hooks/useStorage.ts";
import {checkEmail, checkPasswordStrength} from "@/utils/regexp.ts";

const isRegister = ref<boolean>(false)
const loginInfo = ref({
    account: '',
    password: ''
})
const activeName = ref('login')
const registerInfo = ref({
    email: '',
    password: '',
    rePassword: '',
    username: ''
})
const {width} = useWindowSize()
const isPC = ref<boolean>(true)
const tokenStorage = useStorage<string>('token')
const router = useRouter()
const texts = ['Hi, Friend!', 'Welcome Back!']
const registerRules: FormRules = {
    username: [
        {
            validator: usernameValidator,
            trigger: "blur"
        }
    ],
    email: [
        {
            validator: emailValidator,
            trigger: 'blur'
        }
    ],
    password:[
        {
            validator: passwordValidator,
            trigger: 'blur'
        }
    ],
    rePassword:[
        {
            validator: rePasswordValidator,
            trigger: 'blur'
        }
    ],
}

function emailValidator(rule: any, value: any, callback: any) {
    if (!checkEmail(value)) {
        callback(new Error("邮箱格式错误!"))
    } else if (!value) {
        callback(new Error("请输入邮箱"))
    } else {
        callback()
    }
}

function usernameValidator(rule: any, value: any, callback: any) {
    if (!value) {
        callback(new Error("请输入用户名"))
    } else {
        callback()
    }
}

function passwordValidator(rule: any, value: any, callback: any){
    if(!value){
        callback(new Error("请输入密码"))
    }else if(value.length < 8){
        callback(new Error("密码长度过短"))
    } else if(checkPasswordStrength(value) < 3){
        callback(new Error("当前密码强度过弱"))
    }else{
        callback()
    }
}

function rePasswordValidator(rule: any, value: any, callback: any){
    console.log(value)
    if(!value){
        callback(new Error("请重复输入密码"))
    }else if(value !== registerInfo.value.password){
        callback(new Error("两次密码输入不一致"))
    }else{
        callback()
    }
}

onMounted(() => {
    isPC.value = (width.value > 600)
})

watch(width, () => {
    isPC.value = (width.value > 600)
})


// 处理按键点击，切换登录或者注册
function handleButtonClick() {
    isRegister.value = !isRegister.value
}

function handleTabClick(pane: TabsPaneContext) {
    handleButtonClick()
}

// 处理登录
function login() {
    // 密码加密
    apis.login({
        account: loginInfo.value.account,
        password: md5(loginInfo.value.password)
    }).then(res => {
        const {state, msg, data} = res.data
        if (state) {
            ElNotification.success({
                title: msg
            })
            tokenStorage.value = data.token
            router.replace('/')
        } else {
            ElNotification.error({
                title: msg
            })
        }
    })
}

// 处理注册
function register() {
    apis.register({
        email: registerInfo.value.email,
        password: md5(registerInfo.value.password)
    }).then(res => {
        const {state, msg,data} = res.data
        if (state) {
            ElNotification.success({
                title: msg,
                duration:10000,
                message:`您的账号为${data.account}`
            })
        } else {
            ElNotification.error({
                title: msg
            })
        }
    })
}

</script>

<template>
    <div class="login-mobile-wrapper-bg">
        <div class="login-wrapper" :class="{
        'active':isRegister
    }" v-show="isPC">
            <div class="sider-container" :class="{
            'sider-container-active':isRegister
        }">
                <div class="overlay">
                    <div class="overlay-left ">
                        <h1>Welcome Back!</h1>
                        <span>请输入您的账号密码开始聊天</span>
                        <el-button round type="danger" style="width: 50%;min-width: 200px" @click="handleButtonClick">注册
                        </el-button>
                    </div>
                    <div class="overlay-right ">,
                        <h1>Hi, Friends!</h1>
                        <span>开始注册加入聊天吧！</span>
                        <el-button round type="danger" style="width: 50%;min-width: 200px" @click="handleButtonClick">登录
                        </el-button>
                    </div>
                </div>
                <!--            <el-button @click="handleButtonClick">点击</el-button>-->
            </div>
            <div class="form-container">
                <div class="form">
                    <div class="form-left">
                        <div
                                style="width: 100%;max-width: 300px;display: flex;flex-direction: column;align-items: center"
                        >
                            <el-text class="mx-1" style="font-size: 32px;padding-bottom: 15px">注册</el-text>
                            <el-form
                                    label-position="top"
                                    style="width: 100%;"
                                    :rules="registerRules"
                                    :model="registerInfo"
                            >
                                <el-form-item label="用户名" prop="username">
                                    <el-input placeholder="用户名" v-model="registerInfo.username"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="email">
                                    <el-input placeholder="邮箱" v-model="registerInfo.email"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" placeholder="密码"
                                              v-model="registerInfo.password" show-password></el-input>
                                </el-form-item>
                                <el-form-item label="重复输入密码" prop="rePassword">
                                    <el-input type="password" placeholder="重复输入密码"
                                              v-model="registerInfo.rePassword" show-password></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button
                                    style="width: 100%"
                                    round
                                    type="danger"
                                    @click="register"
                            >注册
                            </el-button>
                        </div>
                    </div>
                    <div class="form-right">
                        <div
                                style="width: 100%;max-width: 300px;display: flex;flex-direction: column;align-items: center"
                        >
                            <el-text class="mx-1" style="font-size: 32px;padding-bottom: 30px">登录</el-text>
                            <el-form
                                    label-position="top"
                                    style="width: 100%;"
                            >
                                <el-form-item label="账号">
                                    <el-input placeholder="账号/邮箱" autocomplete="true"
                                              v-model="loginInfo.account"></el-input>
                                </el-form-item>
                                <el-form-item label="密码">
                                    <el-input type="password" placeholder="密码"
                                              autocomplete="true"
                                              v-model="loginInfo.password"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button
                                    style="width: 100%"
                                    round
                                    type="danger"
                                    @click="login"
                            >登录
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="login-mobile-wrapper"
             v-show="!isPC"
        >
            <div class="login-mobile-container">
                <el-text style="font-size: 32px;padding-bottom: 20px">
                    <TypingVue :text="isRegister ? texts[0] : texts[1]"></TypingVue>
                </el-text>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick"
                         style="--el-color-primary:#f56c6c;width: 100%"
                >
                    <el-tab-pane label="登录" name="login">
                        <el-form
                                label-position="top"
                                style="width: 100%;padding-top: 20px"
                        >
                            <el-form-item label="账号">
                                <el-input placeholder="账号/邮箱" autocomplete="true"
                                          v-model="loginInfo.account"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input type="password" autocomplete="true" placeholder="密码"
                                          v-model="loginInfo.password"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-button
                                style="width: 100%"
                                round
                                type="danger"
                                @click="login"
                        >登录
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="注册" name="register">
                        <el-form
                                label-position="top"
                                style="width: 100%;padding-top: 20px"
                        >
                            <el-form-item label="邮箱">
                                <el-input placeholder="邮箱" v-model="registerInfo.email"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input type="password" placeholder="密码" v-model="registerInfo.password"></el-input>
                            </el-form-item>
                            <el-form-item label="重复输入密码">
                                <el-input type="password" placeholder="重复输入密码"
                                          v-model="registerInfo.rePassword"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-button
                                style="width: 100%"
                                round
                                type="danger"
                                @click="register"
                        >注册
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">


.button-1 {
    border-radius: 10px;
    height: 20px;
}

.login-wrapper {
    backdrop-filter: blur(40px);
    font-family: Montserrat, sans-serif;
    height: 50%;
    width: 100%;
    max-width: 800px;
    min-height: 480px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
    overflow: hidden;


    .form-container {
        width: 50%;
        height: 100%;
        overflow: hidden;
        transform: translate(100%);
        position: absolute;
        transition: all 0.3s ease-in;
        z-index: 20;

        .form {
            width: 200%;
            height: 100%;
            display: flex;
            flex-direction: row;
            transition: all 0.3s ease-in;
            transform: translate(-50%);

            & > div {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                justify-content: center;
            }

            .form-left {
                transition: transform 0.5s ease-in;
                transform: translate(-20%);
            }

            .form-right {
                transform: translate(0);
                transition: transform 0.5s ease-in;
            }

        }

    }

    .sider-container {
        width: 50%;
        position: absolute;
        transition: all 0.3s ease-in;
        height: 100%;
        overflow: hidden;
        background-color: #1d90f5;
        z-index: 21;

        h1 {
            font-size: 42px;
            color: white;
        }

        span {
            padding: 10% 0 6%;
            color: white;
        }

        .overlay {
            height: 100%;
            width: 200%;
            display: flex;
            flex-direction: row;
            transition: transform 0.3s ease-in;
            background-image: linear-gradient(to right, rgb(255, 75, 43), rgb(255, 65, 108));

            & > div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .overlay-left {
                width: 50%;
                transition: transform 0.5s ease-in;
            }

            .overlay-right {
                width: 50%;
                transition: transform 0.5s ease-in;
                transform: translate(20%);
            }
        }
    }
}

.active {
    .sider-container {
        transform: translate(100%);

        .overlay {
            transform: translate(-50%);

            .overlay-left {
                transform: translate(0);
            }

            .overlay-right {
                transform: translate(0);
            }
        }
    }

    .form-container {
        transform: translate(0);

        .form {
            transform: translate(0);

            .form-left {
                transform: translate(0);
            }

            .form-right {
                transform: translate(20%);
            }
        }
    }

}

.login-mobile-wrapper {
    font-family: Montserrat, sans-serif;
    height: 50%;
    width: 100%;
    max-width: 800px;
    min-height: 480px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;


    .login-mobile-container {
        background-color: white;
        padding: 20px;
        border-radius: 12px;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

.login-mobile-wrapper-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/login-bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

</style>