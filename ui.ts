import { ipcRenderer as ipc } from 'electron'
const addr = document.getElementById('connect-address') as HTMLInputElement
const conButton = document.getElementById('connect') as HTMLButtonElement
const sendButton = document.getElementById('send') as HTMLButtonElement
const messages = document.getElementById('messages') as HTMLElement
const usrMesg = document.getElementById('mesg') as HTMLInputElement
const baseConnectBtn = document.getElementById('cnnct') as HTMLButtonElement

ipc.on('connected', (ev: any) => {
    document.body.classList.toggle('login-close', true);
    (<Text>baseConnectBtn.firstChild).data = 'Disconnect'
})
ipc.on('closed', (ev: any, hadErr: boolean) => {
    document.body.classList.toggle('login-close', false)
    conButton.disabled = false
    addr.disabled = false;
    (<Text>conButton.firstChild).data = 'Connect'
    addr.focus()
})
ipc.on('data', (_: any, data: string) => {
    addToList(data)
})
function addToList(data: string) {
    let LI = document.createElement('li')
    let text = document.createTextNode(data)
    LI.appendChild(text)
    messages.appendChild(LI)
}
sendButton.onclick = () => {
    let mesg = usrMesg.value
    if (mesg.length > 0) {
        ipc.send('send', usrMesg.value)
        usrMesg.value = ""
        addToList(mesg)
    }
}
baseConnectBtn.onclick = () => {
    document.body.classList.toggle('login-close', false)
}
addr.focus()
conButton.onclick = () => {
    ipc.send('connect', addr.value);
    (<Text>conButton.firstChild).data = 'Connecting'
    conButton.disabled = true
    addr.disabled = true
}
addr.onkeydown = key => {
    if (key.key == 'Enter') {
        conButton.click()
        key.stopPropagation()
    }
}
let lastEsc = 0;
onkeydown = key => {
    if (key.key == 'Escape') {
        let now = Date.now();
        if (now - lastEsc <= 200) {
            document.body.classList.toggle('login-close', true);
            (<Text>baseConnectBtn.firstChild).data = 'Connect'
        }
        lastEsc = now
    }
}