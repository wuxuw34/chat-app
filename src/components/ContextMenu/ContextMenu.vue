<script setup lang="ts">

import {ContextMenuItemType, ContextMenuType} from "@/components/ContextMenu/index.ts";
import {onMounted, provide, ref, watch} from "vue";
import useWindowSize from "@/hooks/useWindowSize.ts";

const props = defineProps<{
    data: ContextMenuType
}>()
const contextmenuRef = ref<HTMLElement>()
const show = defineModel("show")
const windowSize = useWindowSize()
const offset = ref({
    x: 0,
    y: 0
})

onMounted(() => {
    handleDirection()
    window.addEventListener('click', handleContextMenu)
    watch(() => props.data.x, () => {
        handleDirection()
    })
    watch(() => props.data.y, () => {
        handleDirection()
    })
})

function handleDirection() {
    if (!props.data || !contextmenuRef.value) {
        return
    }
    const {height, width} = windowSize
    if (props.data.x > width.value / 2) {
        offset.value.x = contextmenuRef.value!.offsetWidth ||200
    } else {
        offset.value.x = 0
    }
    if (props.data.y > height.value / 2) {
        offset.value.y = contextmenuRef.value!.offsetHeight || 200
    } else {
        offset.value.y = 0
    }
}

function handleContextMenu(e: MouseEvent) {
    if (!contextmenuRef.value?.contains(e.target as Node)) {
        show.value = false
    }
}

provide('closeContextMenu', () => {
    show.value = false
})

</script>

<template>
    <teleport to="body">
        <div class="contextmenu" :style="{
        left:data.x - offset.x + 'px',
        top:data.y - offset.y + 'px'
    }" ref="contextmenuRef" v-show="show" @contextmenu.prevent>
            <template v-if="data.options">
                <div v-for="item in data.options" @click="item.$event">
                    {{ item.content }}
                </div>
            </template>
            <template v-else>
                <slot/>
            </template>
        </div>
    </teleport>
</template>
<style scoped lang="scss">
.contextmenu {
    display: flex;
    flex-direction: column;
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    padding: 3px;
    border-radius: 12px;
    min-width: 200px;
    font-weight: 1000;
}
</style>