import { 
    addRoom,
    addConnection,
    getServerSocket,
    getClientSocket,
    getRoomList,
    addHeartbeat,
    addClientHeartbeat
} from "./room";

export const setTime = (req: any, socket: any) => {
    const { time } = req.data;
    const roomCode = req.roomCode;
    const clientSocket = getClientSocket(roomCode);
    if (!clientSocket) {
        console.log('No client');
        return;
    }
    clientSocket.socket.send(JSON.stringify({
        status: 'success',
        action: 'set-time',
        roomCode: roomCode,
        data: {
            time: time
        }
    }));
}

export const ping = (req: any, socket: any) => {
    socket.is_alive = true;
}

export const createRoom = (req: any, socket: any) => {
    const roomCode = addRoom(req.data);
    socket.is_alive = true;
    addConnection(roomCode, 'server', socket);
    socket.send(JSON.stringify({
        status: 'success',
        action: 'create-room',
        data: {
            roomCode: roomCode
        }
    }));
    // addHeartbeat(roomCode, socket);
}

export const joinRoom = (req: any, socket: any) => {
    console.log(getRoomList());
    const roomCode = req.roomCode;
    socket.is_alive = true;
    addConnection(roomCode, 'client', socket);
    socket.send(JSON.stringify({
        status: 'success',
        action: 'join-room',
        data: {
            roomCode: roomCode
        }
    }));
    // addClientHeartbeat(roomCode, socket);
}

export const getFilesData = (req: any, socket: any) => {
    const roomCode = req.roomCode;
    console.log('GETFILESDATA', roomCode, req)
    const serverSocket = getServerSocket(roomCode).socket;
    serverSocket.send(JSON.stringify({
        action: 'get-files-data',
        roomCode: roomCode,
        data: {
            id: req.data.id,
            currentPath: req.data.currentPath
        }
    }));
}

export const setFilesData = (req: any, socket: any) => {
    const { structure, disks, id } = req.data;
    const roomCode = req.roomCode;
    console.log('SETFILESDATA', roomCode, req)
    const clientSocket = getClientSocket(roomCode).socket;
    clientSocket.send(JSON.stringify({
        action: 'set-files-data',
        roomCode: roomCode,
        data: {
            structure: structure,
            disks: disks,
            id: id
        }
    }));
}