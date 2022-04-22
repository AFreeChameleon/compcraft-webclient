import { 
    addRoom,
    addConnection,
    getServerSocket,
    getClientSocket
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

export const getFilesData = (req: any, socket: any) => {
    const roomCode = req.roomCode;
    const serverSocket = getServerSocket(roomCode);
    serverSocket.send(JSON.stringify({
        action: 'get-files-data'
    }));
}

export const setFilesData = (req: any, socket: any) => {
    const { structure, disks, id } = req.data;
    const roomCode = req.roomCode;
    const clientSocket = getClientSocket(roomCode);
    clientSocket.send(JSON.stringify({
        action: 'set-files-data',
        data: {
            structure: structure,
            disks: disks,
            id: id
        }
    }));
}