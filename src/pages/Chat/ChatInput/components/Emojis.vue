<script setup lang="ts">

defineProps<{
    emojis: string[]
}>()
const emits = defineEmits<{
    (e: 'selectEmoji', value: string): void
}>()

/**
 *  处理点击事件，将点击事件代理到父元素上
 * @param e
 */
function handleClick(e: MouseEvent) {
    const emoji = (e.target as HTMLElement).getAttribute('emoji')
    emoji && emits('selectEmoji', emoji)
}

</script>

<template>
    <div @click="handleClick" class="emojis-wrapper">
       <span v-for="emoji in emojis" :emoji="emoji">
           {{ emoji }}
       </span>
    </div>
</template>

<style scoped lang="scss">
.emojis-wrapper {
    user-select: none;
    font-size: 22px;
}
</style>