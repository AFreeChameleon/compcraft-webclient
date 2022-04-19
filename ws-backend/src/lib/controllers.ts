import { 
    addRoom,
    addConnection
} from "./room";

export const createRoom = (req: any, socket: any) => {
    const roomCode = addRoom(req.data);
    addConnection(roomCode, 'server', socket);
    socket.send(JSON.stringify({
        status: 'success',
        action: 'create-room',
        data: {
            roomCode: roomCode
        }
    }));
}

export const joinRoom = (req: any, socket: any) => {
    const roomCode = req.roomCode;
    addConnection(roomCode, 'client', socket);
    socket.send(JSON.stringify({
        status: 'success',
        action: 'join-room',
        data: {
            roomCode: roomCode
        }
    }));
}