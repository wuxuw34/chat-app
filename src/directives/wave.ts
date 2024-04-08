import './styles/wave.scss'


function handleClick(el: HTMLElement) {
    let active: null | HTMLElement = el
    const addWave = (x: number, y: number) => {
        const wave = document.createElement('div')
        wave.classList.add('wave')
        active?.querySelector('.waves')?.appendChild(wave)
        const {clientWidth,clientHeight} = wave
        wave.style.top = y - clientHeight/2 + 'px'
        wave.style.left = x - clientWidth/2 + 'px'
        wave.onanimationend = ()=>{
            wave.remove()
            wave.onanimationend  = null
        }
    }
    const handle = (e: PointerEvent) => {
        const {offsetX, offsetY} = e
        addWave(offsetX, offsetY)
    }


    // @ts-ignore
    el['wave'] = handle

    return handle
}

const wave = {
    mounted(el: HTMLElement) {
        el.addEventListener('click', handleClick(el))
    },
    unmounted(el: HTMLElement) {
        el.removeEventListener('click', el['wave'].handle)
    }
}

export default wave