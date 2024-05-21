<script setup lang="ts">

import {onMounted, ref} from "vue";

const props = defineProps<{
    size?:'small'|'default'|'large',
    copy?:boolean
}>()

const size = ref('42px')

onMounted(()=>{
    if(props.size === 'small'){
        size.value = '32px'
    }else if(props.size === 'large'){
        size.value = '60px'
    }
})

</script>

<template>
    <div v-wave class="button-wave" v-if="!copy">
        <slot></slot>
        <div class="waves"></div>
    </div>
    <div v-wave class="button-wave" v-copy v-else>
        <slot></slot>
        <div class="waves"></div>
    </div>
</template>

<style scoped lang="scss">
.button-wave{
    position: relative;
    height: v-bind(size);
    padding: 3px 6px;

    &>.waves{
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
    }
}
</style>
