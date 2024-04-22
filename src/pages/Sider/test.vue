<script setup lang="ts">

import {inject} from "vue";

const goBack = inject('goBack')

</script>
<template>
    <div>
        <el-button
        @click="goBack"
        >
            返回
        </el-button>
        色
    </div>
</template>

<style scoped lang="scss">

</style>