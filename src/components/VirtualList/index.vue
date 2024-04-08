<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useVirtualList1} from "@/hooks/useVirtualList1.ts";
// import {useVirtualList} from "@vueuse/core";
import {useVirtualList} from "@/hooks/useVirtualList.ts";

const props = defineProps<{
    data: [],
    itemHeight: number,
    reverse?: boolean
}>()
const {currentData:list,containerProps,scrollProps:wrapperProps} = useVirtualList<number>(props.data?props.data:[],{
    itemHeight:props.itemHeight,
    overscan:5,
    reverse:props.reverse
})
</script>

<template>
    <div class="scroller" v-bind="containerProps" style="height: 100%">
        <div v-bind="wrapperProps">
            <slot :currentData="list"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.scroller {
    scroll-behavior: smooth;
    overflow: auto;
    --scroll-color: rgba(0, 0, 0, 0);

    &:hover::-webkit-scrollbar-thumb {
        --scroll-color: #0003;
    }

    &::-webkit-scrollbar {
        width: 6px;
        transition: visibility 0.3s ease-in-out;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--scroll-color);
        border-radius: 3px;
    }
}
</style>