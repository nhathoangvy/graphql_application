declare let ARCHIVE_NAME:string
declare let ARCHIVE_PATH:string
declare let DATA_PATH:string
declare let COLUMN_NAME:string
declare let CARD_NAME:string

declare interface Constructor<T> {
    new (...args:any[]): T;
}
declare var something: string;

declare interface ValidCondition {
    [name: string]: Array<string>
}

declare interface ValidType {
    [name: string]: ValidCondition;
}

declare interface Base {}

declare interface Identifiable {
    id?: any;
    name?: any;
    type?: any
}

declare interface StoreArgs {
    name:string,
    path:string
}

declare interface StoreOptions<T> {
    args?:StoreArgs,
    
    get?(args: Identifiable):Promise<Identifiable & T>,
    set?(keys: any):Promise<void>,
    lists?():Promise<Array<Identifiable & T>>,
    existed?(keys: T):Promise<Boolean>,
    update?(keys:T):Promise<Boolean>,
    remove?(keys:T):Promise<Boolean>,
    create_block?(info: string):Promise<void>,
    push?(name: string, keys: any):Promise<Boolean>
}

declare interface MessageOptions {

    code: number,
    message: string,

    OK(): any,
    StatusCreated(): any,
    StatusNonAuthoritativeInfo(): any
    StatusBadRequest(): any,
    StatusUnauthorized(): any,
    StatusInternalServerError(): any
}

declare interface Column {
	id: string,
    name?: string,
    cards?: Array<Card>,
    order?: number,
    created?: string,
    updated?: string
}

declare enum STATUS {
    ACTIVE,
    INACTIVE,
    ARCHIVED
}

declare interface Card {
    id: string,
    columnId: string,
    name: string,
    description?: string,
    order: number,
    status: STATUS,
    created?: string,
    updated?: string
} 

declare interface Archive<T> {
    type: string,
    contents: Array<T>
}