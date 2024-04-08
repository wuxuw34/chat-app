import MyWorker from './websocket.ts?worker&url'

const worker = new Worker(MyWorker,{type:'module'})

export default worker