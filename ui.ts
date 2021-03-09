import { IpcRenderer } from "electron"

declare var ipc: {send(key:string, ...val:any[]):void, on(key:string,fun:(...val:any[])=>any):void}

const addr = document.getElementById('connect-address') as HTMLInputElement
const conButton = document.getElementById('connect') as HTMLButtonElement
const sendButton = document.getElementById('send') as HTMLButtonElement
const messages = document.getElementById('messages') as HTMLElement
const usrMesg = document.getElementById('mesg') as HTMLInputElement
const baseConnectBtn = document.getElementById('cnnct') as HTMLButtonElement
const batteryEl = document.getElementById('battery') as HTMLDivElement

ipc.on('connected', () => {
    document.body.classList.toggle('login-close', true);
    (<Text>baseConnectBtn.firstChild).data = 'Disconnect'
    ipc.send('send', 'R10"AGTBDSU"')
})
ipc.on('closed', (hadErr: boolean) => {
    document.body.classList.toggle('login-close', false)
    conButton.disabled = false
    addr.disabled = false;
    (<Text>conButton.firstChild).data = 'Connect'
    addr.focus()
})
var d: { [key: string]: string } = {}
ipc.on('data', (data: string) => {
    data.split(',').forEach(a => {
        var t = a.split('=')
        d[t[0]] = t[1];
    })
    batteryEl.textContent = d['B'] + 'V'
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
addr.onkeydown = clickOnEnter(conButton)
usrMesg.onkeydown = clickOnEnter(sendButton)

function clickOnEnter(button: HTMLButtonElement) {
    return (key: KeyboardEvent) => {
        if (key.key == 'Enter') {
            button.click()
            key.stopPropagation()
        }
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
    } else if (key.key == 'ArrowDown') {
        ipc.send('send', 'D-200');
    } else if (key.key == 'ArrowUp') {
        ipc.send('send', 'D200');
    } else if (key.key == 'ArrowLeft') {
        ipc.send('send', 'Sl-200');
    } else if (key.key == 'ArrowRight') {
        ipc.send('send', 'Dr200');
    }
}
onkeyup = key => {
    if (key.key == 'ArrowDown') {
        ipc.send('send', 'D0');
    } else if (key.key == 'ArrowUp') {
        ipc.send('send', 'D0');
    } else if (key.key == 'ArrowLeft') {
        ipc.send('send', 'Sc200');
    } else if (key.key == 'ArrowRight') {
        ipc.send('send', 'Dc-200');
    }
}