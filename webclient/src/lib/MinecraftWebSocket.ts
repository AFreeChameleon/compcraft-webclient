import store from "../redux/store";
import {
    setDisks, setStructure
} from '../redux/files/actions';
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
    
    constructor(socket: WebSocket, roomCode: string) {
        this.socket = socket;
        this.roomCode = roomCode;

        this.socket.addEventListener('message', this.routeAction.bind(this));
    }

    private setFilesData(req) {
        const {
            structure,
            disks,
            id
        } = req.data;
        store.dispatch(setDisks(id, disks));
        store.dispatch(setStructure(id, structure));
        console.log(store.getState());
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

    routeAction(e) {
        const req: GetFileData = JSON.parse(e.data);
        
        switch(req.action) {
            case 'set-files-data':
                console.log('SETFILESDATA')
                this.setFilesData(req);
                break;
            default:
                console.log('Action not found', req);
                break;

        }
    }
}

export default MinecraftWebSocket;