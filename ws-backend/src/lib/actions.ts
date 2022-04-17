import { 
    addRoom,
    addConnection
} from "./room";

export const routeAction = (req: any, socket: any) => {
    switch(req.action) {
        case 'create-room':
            (() => {
                const roomCode = addRoom(req.data);
                addConnection(roomCode, 'server', socket);
                socket.send(JSON.stringify({
                    status: 'success',
                    action: 'create-room',
                    data: {
                        roomCode: roomCode
                    }
                }));
            })();
            break;
        case 'join-room':
            (() => {
                const roomCode = req.roomCode;
                addConnection(roomCode, 'client', socket);
                socket.send(JSON.stringify({
                    status: 'success',
                    action: 'join-room',
                    data: {
                        roomCode: roomCode
                    }
                }));
            })();
            break;
        default:
            break;
    }
}