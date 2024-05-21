<script setup lang="ts">

import {IContextMenuItem} from "@/components/ContextMenu/index.ts";
import {inject} from "vue";

defineProps<IContextMenuItem>()

const closeContextMenu = inject('closeContextMenu')

</script>

<template>
    <div class="contextmenu-item" @click="()=>{
        closeContextMenu()
        event?.()
    }">
        <el-icon size="18" v-if="icon">
            <component :is="icon"></component>
        </el-icon>
        <div class="label" >
            {{ label }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.contextmenu-item {
    display: flex;
    flex-direction: row;
    padding: 4px 8px;
    min-height: 32px;
    align-items: center;
    border-radius: 6px;
    gap:8px;

    .label{

    }

    &:hover{
        background: rgba(0,0,0,0.05);
    }
}
</style>