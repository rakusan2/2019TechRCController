import {app, BrowserWindow, ipcMain} from 'electron'
import * as net from 'net'

let mainWindow:BrowserWindow|null

let client = new net.Socket()

client.setTimeout(1000)

function send(event:string, val?:any){
    if(mainWindow!= null){
        mainWindow.webContents.send(event,val)
    }
}


function createWindow(){
    client.on('connect',()=>{
        send('connected')
        console.log('connected')
    })
    client.on('error',()=>{
        send('closed',true)
        console.log('Had Error')
    })
    client.on('closed',(error)=>{
        send('closed',error)
        console.log('Closed')
    })
    client.on('data',data=>{
        send('data',data)
    })
    ipcMain.on('connect',(_:any,data:string)=>{
        client.connect(data)
        console.log(`trying to connect to ${data}`)
    })
    ipcMain.on('send',(_:any, data:string)=>{
        client.write(data)
    })
    mainWindow = new BrowserWindow({
        width:1366,
        height:570,
        show:false,
        webPreferences:{
            nodeIntegration:true
        }
    })
    mainWindow.setPosition(0,0)
    mainWindow.loadFile(__dirname+'/index.html')
    mainWindow.once('ready-to-show',()=>{
        if(mainWindow != null){
            mainWindow.show();
            mainWindow.webContents.openDevTools({mode:'detach'});
        }
    })
    mainWindow.setMenu(null)
    mainWindow.on('closed',()=>{
        mainWindow = null
    })
}


app.on('ready',createWindow)
app.on('window-all-closed',()=>{
    app.quit()
})
app.on('activate',()=>{
    if(mainWindow == null){
        createWindow()
    }
})