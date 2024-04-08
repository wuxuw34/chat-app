
export interface ContextMenuItemType {
    $event?:()=>void,
    title:string,
    id?:string
}

export interface ContextMenuType{
    x:number,
    y:number,
    options:ContextMenuItemType[]
}