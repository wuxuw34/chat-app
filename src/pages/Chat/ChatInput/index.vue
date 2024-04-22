<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import RecordSvg from '@/assets/svgs/record.svg'
import KeyboardSvg from "@/assets/svgs/keyboard.svg";
import {useRecord} from "@/hooks/useRecord.ts";
import Emojis from './components/Emojis.vue'
import {emojis} from "@/utils/emojis.ts";
import {useFile} from "@/hooks/useFile.ts";
import {useMessageStore} from "@/stores/messageStore.ts";
import {setMessageContent} from "@/utils/messageUtils.ts";
import {MESSAGE_TYPE} from "@/enums";
import useFriendsStore from "@/stores/friendsStore.ts";
import apis from "@/services/apis.ts";
import {MessageBodyType} from "@/type/message";
import {uuid} from "@/utils/utils.ts";


const isRecording = ref<boolean>(false) // 录音状态
const inputRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
const {startRecord, stopRecord, onStopRecord, url} = useRecord()
const emojisRef = ref<HTMLElement>()
const {addFile, onChange} = useFile()
const data = defineModel()
const reg = /@$/
const messageStore = useMessageStore()
const friendsStore = useFriendsStore()
const recordTime = ref(0)
let recordTimeTimer = null
let flag = false // 是否仍在@
let fileName = ''
let MessageType = null

const selectUserData = {
    startOffset: 0,
    node: null,
    cache: ''
} as {
    startOffset: number,
    node: Node | null,
    cache: string
}

onMounted(() => {
    watch(data, () => {
        if (!data.value || data.value === '' || data.value === '<br>') {
            inputRef.value!.innerHTML = ''
        }
    })
    onStopRecord((url, blob) => {
        fileName = uuid()
        console.log(blob)
        const file = new File([blob], fileName+'.ogg', {type: 'audio/ogg;codecs=opus'})
        const arr = file.name.split(".")

        const type = arr[arr.length - 1]
        console.log('音频',file)
        apis.upload({
            file: file
        }).then(() => {
            apis.sendMsg(setMessageContent({
                type: MESSAGE_TYPE.AUDIO,
                data: {
                    file: fileName + '.ogg'
                }
            }))
        })
    })
    onChange((files: File[]) => {
        const file = files[0][0]
        fileName = uuid()
        const arr = file.name.split(".")
        const type = arr[arr.length - 1]
        apis.upload({
            file: new File([file], fileName + '.' + type)
        })
        apis.sendMsg(setMessageContent({
            type: MessageType,
            data: {
                file: fileName + '.' + type,
                fileName:file.name,
                fileSize:file.size
            }
        } as MessageBodyType, friendsStore.selectedFriend))
    })
    window.addEventListener('keydown', handleKeydown)
})


/**
 * 处理按键按下
 * @param e
 */
function handleKeydown(e: WindowEventMap['keydown']) {
    console.log(e.key)
    if (e.key === 'Enter') {
        createCallUserNode()
    }
}

/**
 * 处理输入框修改事件
 * @param e
 */
function handleInputChange(e?: InputEvent) {
    const last = e?.data
    if (last === ' ') {
        flag = false
    }
    if (flag) {
        selectUserData.cache += last // 缓存@后面的字母 用于搜索
    }
    if (last === '@') {
        flag = true
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const {startOffset, endOffset} = range // 记录光标位置
        selectUserData.startOffset = startOffset
        selectUserData.node = range.startContainer
    }
    data.value = inputRef.value!.innerHTML
}

/**
 *  插入数据
 * @param value
 */
function insertIntoData(value: any) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0) // 获取到光标选区
    const {startOffset, endOffset} = range // 获取选区起始位置和结束位置
    // 替换选区内的内容
    range.deleteContents()
    const node = document.createTextNode(value)
    range.insertNode(node)
    // 调整光标到插入内容后
    range.setStart(node, node.length)
    range.setEnd(node, node.length)

    // 手动调用
    handleInputChange()
}

/**
 *  创建@用户节点，并且处理细节
 */
function createCallUserNode() {
    if (!flag) return
    const span = document.createElement('span')
    span.innerHTML = `@${selectUserData.cache}`
    span.setAttribute('contenteditable', 'false')
    span.className = 'call-user'
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    range.setStart(selectUserData.node as Node, selectUserData.startOffset - 1)
    range.setEnd(selectUserData.node as Node, selectUserData.startOffset + selectUserData.cache.length)
    range.deleteContents()
    inputRef.value?.appendChild(span)
    flag = false
    selectUserData.node = null
    selectUserData.cache = ''
    selectUserData.startOffset = 0
    const text = document.createTextNode('')
    const div = document.createElement('div')
    div.innerHTML = '&nbsp;'
    text.insertData(0, div.textContent) // 插入空格，直接插入会发生转义
    inputRef.value?.appendChild(text)
    range.setStart(text, 1)
    range.setEnd(text, 1)
}


function handleSelectEmoji(emoji: string) {
    inputRef.value?.focus() // 防止失焦
    insertIntoData(emoji)
}


function handleSendMessage() {
    console.log(friendsStore.selectedFriend)
    messageStore.sendMessageToServer(setMessageContent({
        type: MESSAGE_TYPE.TEXT,
        data: {
            content: data.value
        }
    }, friendsStore.selectedFriend), (res: any) => {
        console.log('发送消息结果:', res)
        inputRef.value!.innerHTML = ''
        data.value = ''
    })
}


</script>

<template>
    <div class="chat-box-container">
        <div class="record-wrapper" @click="isRecording = !isRecording">
            <img v-show="!isRecording" :src="RecordSvg" alt="录音" width="22" height="22">
            <img v-show="isRecording" :src="KeyboardSvg" alt="键盘" width="22" height="22">
        </div>
        <div style="flex:1">
            <div v-if="isRecording" class="record-bnt" @mousedown="()=>{
                startRecord()
                if(recordTimeTimer){
                    clearInterval(recordTimeTimer as any)
                }
                recordTimeTimer = setInterval(()=>{
                    recordTime ++
                },1000)
            }" @mouseup="()=>{
                stopRecord()
                if(recordTimeTimer){
                    clearInterval(recordTimeTimer as any)
                }
                recordTime = 0
            }">
                <div v-show="!recordTime">按住录音</div>
                <div v-show="recordTime">{{ recordTime }}s</div>
            </div>
            <div v-else class="input-wrapper">
                <div
                        class="input"
                        contenteditable="true"
                        ref="inputRef"
                        @input="handleInputChange"
                        placeholder="来聊天吧"
                        @keydown.enter="(e)=>{
                            if(flag){
                                e.preventDefault()
                            }
                        }"
                ></div>
            </div>
        </div>
        <el-popover
                placement="top"

        >
            <template #reference>
                <span class="emoji-bnt">😀</span>
            </template>
            <div ref="emojisRef">
                <Emojis :emojis="emojis" @selectEmoji="handleSelectEmoji"/>
            </div>
        </el-popover>
        <!--   发送图片     -->
        <svg @click="()=>{
            MessageType = MESSAGE_TYPE.PIC
            addFile({type:'images/*'})

        }" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
             viewBox="0 0 48 48">
            <g fill="none" stroke="#000" stroke-linejoin="round" stroke-width="4">
                <path stroke-linecap="round"
                      d="M5 10C5 8.89543 5.89543 8 7 8L41 8C42.1046 8 43 8.89543 43 10V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V10Z"
                      clip-rule="evenodd"/>
                <path stroke-linecap="round"
                      d="M14.5 18C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15C13.6716 15 13 15.6716 13 16.5C13 17.3284 13.6716 18 14.5 18Z"
                      clip-rule="evenodd"/>
                <path fill="#2f88ff"
                      d="M15 24L20 28L26 21L43 34V38C43 39.1046 42.1046 40 41 40H7C5.89543 40 5 39.1046 5 38V34L15 24Z"/>
            </g>
        </svg>
        <!--        文件 -->
        <svg @click="()=>{
            MessageType = MESSAGE_TYPE.FILE
            addFile()
        }" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 48 48">
            <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                <path fill="#2f88ff" stroke="#000"
                      d="M7 6C7 4.89543 7.89543 4 9 4H39C40.1046 4 41 4.89543 41 6V42C41 43.1046 40.1046 44 39 44H9C7.89543 44 7 43.1046 7 42V6Z"/>
                <path stroke="#fff" d="M16 29H20"/>
                <path stroke="#fff" d="M16 35H26"/>
                <path stroke="#fff" d="M8 5C8 5 11.7647 18 24 18C36.2353 18 40 5 40 5"/>
                <circle cx="24" cy="18" r="4" fill="#43ccf8" stroke="#fff"/>
                <path stroke="#000" d="M15 4H9C7.89543 4 7 4.89543 7 6V12"/>
                <path stroke="#000" d="M33 4H39C40.1046 4 41 4.89543 41 6V12"/>
            </g>
        </svg>
        <!--       发送 -->
        <svg @click="handleSendMessage" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
             viewBox="0 0 48 48">
            <g fill="none" stroke-linejoin="round" stroke-width="4">
                <path fill="#2f88ff" stroke="#000"
                      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"/>
                <path stroke="#fff" stroke-linecap="round" d="M14.4917 24.5H32.4917"/>
                <path stroke="#fff" stroke-linecap="round" d="M23.4917 15.5L32.4917 24.5L23.4917 33.5"/>
            </g>
        </svg>
    </div>
</template>

<style scoped lang="scss">
.chat-box-container {
    display: flex;
    flex-direction: row;
    padding: 4px;
    align-items: center;
    gap: 3px;
    height: 28px;

    .input-wrapper {
        display: inline-flex;
        cursor: text;
        width: 100%;
    }

    .input {
        box-sizing: border-box;
        outline: none;
        border: none;
        font-size: 14px;
        border-radius: 6px;
        padding: 4px 0.5rem;
        width: 100px;
        resize: none;
        flex: 1;


        &:focus {
            outline: 1px var(--input-focus) solid;
        }

        &:empty::before {
            content: attr(placeholder);
            pointer-events: none;
            color: var(--font-placeholder);
        }
    }

    .record-wrapper {
        user-select: none;
        border-radius: 3px;
        cursor: pointer;
        height: 100%;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    .emoji-bnt {
        font-size: 20px;
    }

    .send-button {
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .record-bnt {

        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        user-select: none;

        & > div {
            animation: show 0.2s ease-in;
        }

        &:active {
            scale: 0.8;
        }

    }
}

@keyframes show {
    0% {
        transform: scale(0.6);
    }
    100% {
        transform: scale(1);
    }
}
</style>