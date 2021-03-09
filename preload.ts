const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('ipc',{
    send(key:string,...val:any[]){
        ipcRenderer.send(key,...val)
    },
    on(key:string,fun:(...val:any[])=>any){
        ipcRenderer.on(key, (_ev,...data)=>fun(...data))
    }
})