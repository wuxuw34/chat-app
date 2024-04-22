<script setup lang="ts">

import {getUserNameColorById} from "@/utils/color.ts";
import {onMounted, ref, watch} from "vue";

const props = defineProps<{
    avatar?: string,
    username?: string,
    id:string
}>()
const username = ref()

onMounted(()=>{
    setUsername()
    watch(()=>props.username,()=>{
        setUsername()
    })
})

function setUsername(){
    if(!props.username){
        return
    }
    if(/[\u4e00-\u9fa5]/.test(props.username[0])){
        username.value = props.username[0]
    }else{
        username.value = props.username.slice(0,2)
    }
}

</script>

<template>
    <div class="avatar-container" :style="{
        '--color':getUserNameColorById(Number(id))
    }">
        <div v-if="avatar" ></div>
        <div v-else class="text"> {{ username }} </div>
    </div>
</template>

<style scoped lang="scss">

.avatar-container {
    width: 32px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow: hidden;
    user-select: none;

    &>div{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .text{
        background: linear-gradient(var(--color-white) -125%,var(--color));
        color:var(--color-white);
    }
}

</style>