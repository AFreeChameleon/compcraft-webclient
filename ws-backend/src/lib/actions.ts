import { createRoom, getFilesData, joinRoom, setFilesData } from "./controllers";
import { 
    addRoom,
    addConnection
} from "./room";

export const routeAction = (req: any, socket: any) => {
    try {
        switch(req.action) {
            case 'create-room':
                createRoom(req, socket);
                break;
            case 'join-room':
                joinRoom(req, socket);
                break;
            case 'get-files-data':
                getFilesData(req, socket);
                break;
            case 'set-files-data':
                setFilesData(req, socket);
                break;
            default:
                console.log(req)
                break;
        }
    } catch (err) {
        console.log(err);
        socket.send(JSON.stringify({
            action: req.action,
            status: 'failed'
        }));
    }
}