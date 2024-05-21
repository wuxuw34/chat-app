<script setup lang="ts">

import {IRange, IVirtualList,DIRECTION_TYPE} from "@/components/VirtualList/props.ts";
import {onMounted, ref, watch, nextTick} from "vue";
import Virtual from "@/components/VirtualList/Virtual.ts";
import {MessageType} from "@/type/message";
import VirtualListItem from "@/components/VirtualList/VirtualListItem.vue";
import {Bottom} from "@element-plus/icons-vue";

const emits = defineEmits<{
  (e: 'onToBottom'): void,
  (e: 'onToTop'): void,
  (e: 'resize'): void,
  (e: 'onScroll',value:number): void
}>()
const props = defineProps<IVirtualList>()
let virtualList = null
const showData = ref<MessageType[]>([])
const range = ref<IRange>()
const styleProps = ref({})
const scrollRef = ref<HTMLElement>()

onMounted(() => {
  initVirtualList()
  watch(() => props.dataSources.length, (value: any) => {
    virtualList.updateDataSources(props.dataSources)
  })
})

function onUpdateRange(range: IRange, buffer: number) {
  showData.value = props.dataSources.slice(range.padFront, range.padBehind + 1)
  nextTick(() => {
    const top = props.dataSources.slice(0, range.padFront).reduce((pre: number, message: MessageType) => {
      return getSize(message.id as string) + pre
    }, 0)
    const bottom = props.dataSources.slice(range.padBehind + 1).reduce((pre: number, message: MessageType) => {
      return getSize(message.id as string) + pre
    }, 0)
    styleProps.value.paddingTop = top + 'px'
    styleProps.value.paddingBottom = bottom + 'px'
  })
}

function initVirtualList() {
  virtualList = new Virtual(props, onUpdateRange)
  range.value = virtualList.getRange()
}

function onScroll(ev: Event) {
  const scrollTop = scrollRef.value?.scrollTop
  const scrollHeight = scrollRef.value?.scrollHeight
  const clientHeight = scrollRef.value?.offsetHeight


  if (scrollTop <= 0 || !scrollHeight || clientHeight + scrollTop > scrollHeight + 1) {
    return
  }
  emits('onScroll',scrollHeight-clientHeight-scrollTop)
  virtualList.handleScroll(scrollTop)
  if (clientHeight + scrollTop >= scrollHeight) {
    emits('onToBottom')
  } else if (scrollTop <= 10) {
    emits('onToTop')
  }
}

function getDataKey(value: any) {
  if (props.dataKey && typeof props.dataKey === 'function') {
    return props.dataKey(value)
  }
}

function scrollToOffset(to: number) {
  scrollRef.value!.scrollTop = to
}

function scrollToBottom() {
  setTimeout(() => {
    if (scrollRef.value) {
      const scrollHeight = scrollRef.value?.scrollHeight
      scrollRef.value!.scrollTop = scrollHeight!
    }
  }, 3)
}

function onItemResize(value: []) {
  virtualList.saveSizes(value[0], value[1]);
  emits('resize')
}

function getSize(id: string) {
  return virtualList.getSize(id)
}

function getOffsetByIndex(index: number) {
  return props.dataSources.slice(0, index).reduce((pre: number, value: any) => {
    return getSize(getDataKey(value)) + pre
  }, 0)
}

function scrollToIndex(index: number) {
  if (index > props.dataSources.length - 1) {
    scrollToBottom()
  } else {
    scrollToOffset(getOffsetByIndex(index))
  }
}

defineExpose({
  scrollToBottom,
  getSize,
  scrollToIndex,
  scrollToOffset,
  getOffsetByIndex
})


</script>

<template>
  <div @scroll.passive="onScroll" class="scroller" ref="scrollRef">
    <div class="header">
      <div class="loading">
        <!--                <el-button @click="()=>{-->
        <!--    isLoading = true-->
        <!--                    $emit('onToTop')-->
        <!--                }">-->
        <!--                    刷新-->
        <!--                </el-button>-->
      </div>
    </div>
    <div class="content" :style="styleProps">
      <VirtualListItem
          v-for="(item,index) in showData"
          :message="item"
          @onItemResize="onItemResize"
          :is="component"
          :index="index"
      >
      </VirtualListItem>
    </div>

  </div>
  <el-affix
      position="bottom"
      :offset="20"
      class="affix"
      target="#chat-message-area"
      v-show="showAffix"
  >
    <el-button type="primary" :icon="Bottom" circle @click="scrollToBottom">

    </el-button>
  </el-affix>
</template>

<style scoped lang="scss">
.scroller {
  overflow: auto;
  position: relative;
  .header {
    .loading {
      height: 42px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
  }
}
.affix{
  position: absolute;
  bottom: 10px;
  right: 30px;
}
</style>