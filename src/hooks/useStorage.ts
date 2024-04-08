import {onMounted, onUnmounted, Ref, ref, watch} from "vue";


export interface StorageRef<T> extends Ref<T> {
    $map_set: (value: any) => void,
    isMap:boolean
}

export function useStorage<T>(key: string, defaultValue?: T): StorageRef<T> {

    const data = ref<T>() as StorageRef<T>
    const storage = localStorage
    let type: any = null
    data.value = read()
    data.$map_set = (value: Map<number, any>) => {
        type = 'map'
        write(value)
    }



    function write(value: any) {
        let res: any = null
        // 判断map
        if (value instanceof Map) {
            res = Object.fromEntries(value)
            res._type = 'map'
            type = 'map'
        }

        storage.setItem(key, JSON.stringify(res ? res : value))
    }

    function read() {

        let res = JSON.parse(storage.getItem(key)!)

        if (res && res._type && res._type === 'map') {
            data.isMap = true
            res = new Map(Object.entries(res))
        }

        return res
    }

    const update = (e: StorageEvent) => {
        console.log(e)
    }

    if (defaultValue) {
        write(defaultValue)
    }

    onMounted(() => {

        window.addEventListener('storage', update)
        watch(data, () => {
            write(data.value)
        })
    })

    onUnmounted(() => {
        window.removeEventListener('storage', update)
        watch(data, () => null)
    })


    return data
}