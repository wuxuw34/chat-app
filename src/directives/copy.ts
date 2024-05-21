import {ElMessage} from "element-plus";
import {h} from "vue";

function handleCopy(el:HTMLElement,vnode:any){

    const handle = () => {
        const content = (vnode.el as HTMLElement).getAttribute('_copy')
        const title =  (vnode.el as HTMLElement).getAttribute('title')

        if(content){
            navigator.clipboard.writeText(content)
            ElMessage({
                message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
                    h('span', null, `${title}已被复制到剪切板`),
                ]),
            })
        }else{
            ElMessage({
                message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
                    h('span', null, `${title}复制失败`),
                ]),
                type:'error'
            })
        }

    }


    // @ts-ignore
    el['copy'] = handle

    return handle
}

const copy = {
    mounted(el: HTMLElement,binding:any,vnode:any) {
        el.addEventListener('click', handleCopy(el,vnode))
    },
    unmounted(el: HTMLElement) {
        el.removeEventListener('click', el['copy'].handle)
    }
}

export default copy