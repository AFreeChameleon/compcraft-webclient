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

class Websocket {
    wsConn;
    roomCode;  
    
    constructor(socket: WebSocket, roomCode: string) {
        this.wsConn = socket;
        this.roomCode = roomCode;

        this.wsConn.addEventListener('message', this.routeAction);
    }

    routeAction(e) {
        const req: GetFileData = JSON.parse(e.data);
        
        switch(req.action) {
            case 'set-file-data':
                this.setFilesData(req);
                break;
            default:
                throw 'No action provided.';

        }
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

    public getFilesData(id: number) {
        this.wsConn.send(JSON.stringify({
            action: 'get-files-data',
            data: {
                currentPath: '/',
                id: id
            }
        }));
    }
}

export default Websocket;