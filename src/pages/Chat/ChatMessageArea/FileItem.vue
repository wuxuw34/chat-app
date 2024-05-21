<script setup lang="ts">

import config from "@/utils/config.ts";
import {onMounted, ref, watch} from "vue";
import {getFileSize} from "../../../utils/utils.ts";

const props = defineProps<{
  url: string,
  fileName: string,
  fileSize: number
}>()

const process = ref({
  length: props.fileSize,
  receive: 0
})
let abortController = null
const isDownload = ref(false)
const canvasRef = ref<HTMLCanvasElement>()
const fileExt = ref('')
let pro = null
onMounted(() => {
  setFileExt()
})

watch(() => props.fileName, () => {
  setFileExt()
})

function setFileExt() {
  if (!props.fileName) {
    fileExt.value = '未知'
    return
  }
  const f = props.fileName?.split('.')
  console.log(f)
  fileExt.value = f[f.length - 1]
}

async function download() {
  console.log('点击')
  isDownload.value = true
  pro = progress()
  pro.start()
  process.value.receive = props.fileSize
  abortController = new AbortController()
  const response = await fetch(config.server + props.url, {
    signal: abortController.signal
  })
  const reader = response.body?.getReader()
  const length = response.headers.get('Content-Length')
  let receivedData = 0
  const chunks = [] // 保存二进制数据
  while (true) {
    const {done, value} = await reader.read()
    pro.add((receivedData / process.value.length) * 360)
    if (done) {
      break
    }
    if (!isDownload.value) {
      return
    }
    chunks.push(value)
    receivedData += value.length
    console.log('已下载', process.value.receive * 360 / process.value.length)
    process.value.receive = receivedData
  }
  const data = new Uint8Array(receivedData)
  let position = 0
  pro.add(360)

  pro.registerFinish(() => {
    for (let chunk of chunks) {
      data.set(chunk, position)
      position += chunk.length
    }
    const blob = new Blob(chunks)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = props.fileName
    document.body.appendChild(a)
    pro.stop()
    a.click()
    isDownload.value = false
  })
}

function cancelDownload() {
  isDownload.value = false
  console.log('取消')
  abortController?.abort()
  pro.init()
}

function progress() {

  let h = 0, r = 0, _h = 0, finishFn = null, flag = false
  const ctx = canvasRef.value!.getContext('2d')

  function draw() {
    ctx.clearRect(0, 0, 42, 42)
    ctx.strokeStyle = '#1d90f5'
    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.arc(21, 21, 15, (Math.PI / 180) * r, (Math.PI / 180) * (h + r))
    ctx.stroke()
    ctx.closePath()
    if (h <= _h) {
      h += 2
    }
    if (h >= 360) {
      finishFn?.()
    }

    if (flag) {
      window.requestAnimationFrame(draw)
    }

    r += 3
  }

  function init() {
    h = 0
    r = 0
    flag = true
  }

  return {
    start: () => {
      init()
      draw(0)
    },
    add: (__h: number) => {
      _h = __h
      // draw(__h)
    },
    reset: () => {
      init()
      draw(0)
    },
    registerFinish: (fn: any) => {
      finishFn = fn
    },
    stop: () => {
      flag = false
    }
  }

}

function handleDownload() {
  console.log('点击')
  if (isDownload.value) {
    cancelDownload()
  } else {
    download()
  }
}

</script>

<template>
  <div class="file-message-item">
    <div>
      <div class="file-name">{{ fileName }}</div>
      <div class="file-size">{{ getFileSize(fileSize) }}</div>
    </div>
    <!--        <el-button @click="download" v-show="!isDownload">下载</el-button>-->
    <div class="progress" @click="handleDownload">
      <canvas ref="canvasRef" width="42" height="42" v-show="isDownload"></canvas>
      <el-icon size="32" class="close">
        <svg v-if="isDownload" xmlns="http://www.w3.org/2000/svg" width="1em"
             height="1em" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="m7.05 5.636l4.95 4.95l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
             viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M13 3v9.586l3.5-3.5l1.414 1.414L12 16.414L6.086 10.5L7.5 9.086l3.5 3.5V3zM4.5 14v5h15v-5h2v7h-19v-7z"/>
        </svg>
      </el-icon>
      <span class="file-ext">{{ fileExt }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-message-item {
  display: flex;
  gap: 6px;
  color: var(--color-blue-1);

  .file-size {
    padding-top: 3px;
    font-size: 14px;
  }

  .file-name {

  }

  .progress {
    position: relative;
    width: 42px;
    height: 46px;
    background: var(--color-orange-1);
    border-radius: 3px;

    & > canvas {
      animation: rotate 2s ease-in-out infinite;
    }

    .close {
      position: absolute;
      color: white;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }

    &:hover {
      .close {
        opacity: 1;
      }

      .file-ext {
        opacity: 0;
      }
    }

    .file-ext {
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>