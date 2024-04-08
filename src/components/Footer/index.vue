<script setup lang="ts">

let flag:boolean = false

function theme() {
    document.body.setAttribute('theme',flag?'dark':'light')
    flag = !flag
}

</script>
<template>
  尾部
    <el-button @click="theme">切换主题</el-button>
</template>