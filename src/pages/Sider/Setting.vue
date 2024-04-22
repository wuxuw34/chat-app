<script setup lang="ts">

import TransitionVue from "@/components/Transition/Transition.vue";
import Test from "./test.vue";
import {inject, ref} from "vue";

const goBack = inject('goBack')
const transitionElement = ref()


</script>
<template>
    <TransitionVue
        v-model:is="transitionElement"
    >
        <template #default>
            <el-button
                    @click="goBack"
            >
                返回
            </el-button>
            设置
            <el-button
            @click="()=>{
                transitionElement = Test
            }"
            >
                跳
            </el-button>
        </template>
    </TransitionVue>
</template>

<style scoped lang="scss">

</style>