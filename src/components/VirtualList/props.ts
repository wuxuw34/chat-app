import {inputNumberEmits} from "element-plus";

export interface IVirtualList{
    dataSources:any[],
    dataKey:any,
    keeps:number,
    overscan:number,
    component:any,
    isBottom:boolean,
    direction?:'vertical'|'horizontal',
    fromEnd?:boolean,
    estimateSize?:number // 预测尺寸
    showAffix:boolean
}

export interface IRange {
    start:number,
    end:number,
    padFront:number,
    padBehind:number,
    dataKey:((value:any)=>string)|[]
}

export const DIRECTION_TYPE = {
    FRONT:"FRONT",
    BEHIND:"BEHIND"
}