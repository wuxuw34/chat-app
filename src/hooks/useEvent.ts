
export function useEvent(){
    const fns = new Set<Function>()
    const off = (fn:Function)=>{
            fns.delete(fn)
    }
    const on = (fn:Function)=>{
        fns.add(fn)
    }

    const trigger = (...args:any[])=>{
        return Promise.all(Array.from(fns).map((fn:Function)=>fn(args)))
    }

    return {
        on,
        off,
        trigger
    }

}