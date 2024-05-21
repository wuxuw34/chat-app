
export interface ContextMenuItemType {
    $event?:()=>void,
    content:string,
    id?:string
}

export interface ContextMenuType{
    x:number,
    y:number,
    options:ContextMenuItemType[]
}

export interface IContextMenuItem {
    label:string,
    event:any,
    icon:any
}