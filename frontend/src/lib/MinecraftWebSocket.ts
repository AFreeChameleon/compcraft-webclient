import store from '../redux/store';
import {
    setDisks, setStructure
} from '../redux/files/actions';
import {
    setTime,
    setDate
} from '../redux/general/actions';
import { Disk, File } from "../redux/files/types";

type GetFileData = {
    action: string;
    data: {
        disks: Disk[];
        structure: File[];
        id: number;
    }
}

class MinecraftWebSocket {
    socket;
    roomCode;
    date;
    clockStarted = false;
    
    constructor(socket: WebSocket, roomCode: string) {
        this.socket = socket;
        this.roomCode = roomCode;

        this.socket.addEventListener('open', this.getTime.bind(this));
        this.socket.addEventListener('message', this.routeAction.bind(this));
    }

    public createFile(path: string, fileName: string) {
        console.log(path, fileName);
        this.socket.send(JSON.stringify({
            action: 'create-file',
            roomCode: this.roomCode,
            data: {
                path: path,
                fileName: fileName
            }
        }));
    }

    private getTime() {
        console.log('GET TIME')
        this.socket.send(JSON.stringify({
            action: 'get-time',
            roomCode: this.roomCode
        }));
    }

    private setFilesData(req) {
        const {
            structure,
            disks,
            path,
        } = req.data;
        const filesWindows = store.getState().files.windows;
        for (const filesWindow of filesWindows) {
            if (filesWindow.currentPath === path) {
                store.dispatch(setDisks(filesWindow.id, disks));
                store.dispatch(setStructure(filesWindow.id, structure));
            }
        }
    }

    public getFilesData(path: string) {
        this.socket.send(JSON.stringify({
            action: 'get-files-data',
            roomCode: this.roomCode,
            data: {
                path: path
            }
        }));
    }

    private setTimeDate(req) {
        const {
            time,
            date
        } = req.data;
        this.calculateTimeDate(time, date);
        this.date = {
            time: time,
            day: date
        }
        if (!this.clockStarted) {
            this.startClock();
        }
    }

    private sendPing(req: any) {
        this.socket.send(JSON.stringify({
            action: 'ping'
        }));
    }

    private calculateTimeDate(time: number, date: number) {
        const hours = Math.floor(time);
        const minutes = Math.round((time - Math.floor(time)) * 60);
        const stringTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${hours > 11 ? 'PM' : 'AM'}`;
        store.dispatch(setTime(stringTime));
        store.dispatch(setDate(`Day ${date}`));
    }

    private startClock() {
        this.clockStarted = true;
        setInterval(() => {
            this.date.time += (1 / 60);
            if ((this.date.time - Math.floor(this.date.time)) * 60 >= 60) {
                this.date.time = Math.floor(this.date.time) + 1;
            }
            if (this.date.time >= 23) {
                this.date.day += 1;
                this.date.time -= 23;
            }
            this.calculateTimeDate(this.date.time, this.date.day);
        }, 830)
    }

    private refreshAllFiles(req: any) {
        const filesWindows = store.getState().files.windows;
        console.log('req', req)
        for (const filesWindow of filesWindows) {
            if (req.data.path === filesWindow.currentPath) {
                this.getFilesData(req.data.path);
            }
        }
    }

    routeAction(e) {
        const req: GetFileData = JSON.parse(e.data);
        
        switch(req.action) {
            case 'ping':
                console.log('ping')
                this.sendPing(req);
                break;
            case 'set-files-data':
                console.log('SETFILESDATA')
                this.setFilesData(req);
                break;
            case 'set-time':
                console.log('SET TIME BOI')
                this.setTimeDate(req);
                break;
            case 'refresh-file-data':
                this.refreshAllFiles(req);
                break;
            default:
                console.log('Action not found', req);
                break;

        }
    }
}

export default MinecraftWebSocket;