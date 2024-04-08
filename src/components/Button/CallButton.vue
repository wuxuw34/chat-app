<script setup lang="ts">

defineProps<{
    type:"error" | "default" | "notClick"
}>()


</script>
<template>
  <div class="call_button" :style="{
      backgroundColor:type==='error'?'var(--color-red-1)':type==='default'?'var(--color-green-1)':'var(--color-white)',
      color:type==='notClick'?'var(--color-red-1)':'var(--color-white)'
  }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.call_button{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    transition: scale 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;
    font-size: 32px;
    box-shadow: 0px 0px 64px -16px rgba(0, 0, 0, 0.6);
    color:var(--color-white);

    &:hover{
        scale: 1.2;
    }
}
</style>