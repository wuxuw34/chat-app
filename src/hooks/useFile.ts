import {readonly, ref} from "vue";
import {useEvent} from "@/hooks/useEvent.ts";

type useFileOptionsType = {
    type?: string, // 类型，默认为所有类型
    multiple?: boolean // 是否能够上传多个文件
    capture?: string
}

export function useFile() {

    const fileInput = document.createElement('input')
    const fileList = ref<File[]>([])
    const {on:onChange,trigger} = useEvent()

    fileInput.type = 'file'
    document.body.appendChild(fileInput)

    fileInput.style.display = 'none'
    fileInput.onchange = (e: Event) => {
        if (!fileInput.files) return false
        for (let file of fileInput.files) {
            fileList.value.push(file)
        }
        trigger(fileInput.files)
    }

    /**
     *  添加文件
     * @param options {
     *     type:文件类型,
     *     multiple:是否多选文件，
     *     capture:string
     * }
     */
    function addFile(options?: useFileOptionsType) {
        fileInput.accept = options?.type ? options.type : '*'
        fileInput.multiple = Boolean(options?.multiple)
        fileInput.capture = options?.capture ? options.capture : '*'
        fileInput.click()
    }

    function reset(){
        fileList.value = []
        if(fileInput){
            fileInput.value = ''
            trigger(null)
        }

    }

    return {
        files:readonly(fileList),
        addFile,
        onChange,
        reset
    }

}