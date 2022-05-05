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
    isConnected;

    aliveInterval;
    
    constructor(socket: WebSocket, roomCode: string) {
        this.socket = socket;
        this.roomCode = roomCode;

        this.stayAlive();
        this.socket.addEventListener('message', this.routeAction.bind(this));
    }

    private stayAlive() {
        this.aliveInterval = setInterval(() => {
            if (this.isConnected) {
                this.isConnected = !this.isConnected;
            } else {
                clearInterval(this.aliveInterval);
            }
        }, 1000);
    }

    private setFilesData(req) {
        const {
            structure,
            disks,
            id
        } = req.data;
        store.dispatch(setDisks(id, disks));
        store.dispatch(setStructure(id, structure));
    }

    public getFilesData(id: number, path: string) {
        this.socket.send(JSON.stringify({
            action: 'get-files-data',
            roomCode: this.roomCode,
            data: {
                currentPath: path,
                id: id
            }
        }));
    }

    private setTimeDate(req) {
        const {
            time,
            date
        } = req.data;
        console.log(req.data)
        store.dispatch(setTime(time))
        store.dispatch(setDate(date))
    }

    private sendPing(req: any) {
        this.socket.send(JSON.stringify({
            action: 'ping'
        }));
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
            default:
                console.log('Action not found', req);
                break;

        }
    }
}

export default MinecraftWebSocket;