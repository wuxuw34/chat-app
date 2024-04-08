<script setup lang="ts">

import {ContextMenuItemType, ContextMenuType} from "@/components/ContextMenu/index.ts";
import {onMounted, ref} from "vue";

defineProps<{
    data: ContextMenuType
}>()
const contextmenuRef = ref<HTMLElement>()
const show = defineModel("show")

onMounted(() => {
    console.log(show)
    // window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('click',handleContextMenu)
})

function handleContextMenu(e: MouseEvent) {
    if (!contextmenuRef.value?.contains(e.target as Node)) {
        show.value = false
    }
}

</script>

<template>
    <div class="contextmenu" :style="{
        left:data.x + 'px',
        top:data.y + 'px'
    }" ref="contextmenuRef" v-show="show" @contextmenu.prevent>
        <div v-for="item in data.options" @click="item.$event">
            {{ item.title }}
        </div>
    </div>
</template>
<style scoped lang="scss">
.contextmenu {
    display: flex;
    flex-direction: column;
    position: absolute;
}
</style>