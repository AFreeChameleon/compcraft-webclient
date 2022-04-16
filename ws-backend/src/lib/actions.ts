import { 
    addRoom,
    addConnection
} from "./room";

export const routeAction = (req: any, socket: any) => {
    switch(req.action) {
        case 'create-room':
            const roomCode = addRoom(req.data);
            addConnection(roomCode, 'server', socket);
            socket.send(JSON.stringify({
                status: 'success',
                data: {
                    roomCode: roomCode
                }
            }));
            break;
        // case ''
        default:
            break;
    }
}