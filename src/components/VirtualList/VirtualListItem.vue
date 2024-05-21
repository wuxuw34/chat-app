<script setup lang="ts">

import {MessageType} from "@/type/message";
import {useResizeObserver} from "@/hooks/useResizeObserver.ts";

const props = defineProps<{
    is:any,
    message:MessageType
}>()
const emits = defineEmits<{
    (e:'onItemResize',value:any[]):void
}>()
const observerRef = useResizeObserver((size:number)=>{
    emits('onItemResize',[props.message.id,size])
})

</script>

<template>
    <div ref="observerRef" class="virtual-list-item">
        <component :is="is" v-bind="message" />
    </div>
</template>

<style scoped lang="scss">
.virtual-list-item{
    padding: 5px 0;
}
</style>