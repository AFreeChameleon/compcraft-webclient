import { 
    addRoom,
    addConnection,
    getServerSocket,
    getClientSockets,
    getRoomList,
    addHeartbeat,
    addClientHeartbeat
} from "./room";

export const refreshFiles = (req: any, socket: any) => {
    const roomCode = req.roomCode;
    const clientSockets = getClientSockets(roomCode);
    console.log('req', req)
    for (const clientSocket of clientSockets) {
        clientSocket.socket.send(JSON.stringify({
            action: 'refresh-file-data',
            roomCode: roomCode,
            data: {
                path: req.data.path
            }
        }));
    }
}

export const createFile = (req: any, socket: any) => {
    const { path, fileName } = req.data;
    const roomCode = req.roomCode;
    const serverSocket = getServerSocket(roomCode).socket;
    serverSocket.send(JSON.stringify({
        roomCode: roomCode,
        action: 'create-file',
        data: {
            path: path,
            fileName: fileName
        }
    }));
}

export const getTime = (req: any, socket: any) => {
    const roomCode = req.roomCode;
    const serverSocket = getServerSocket(roomCode).socket;
    serverSocket.send(JSON.stringify({
        roomCode: roomCode,
        action: 'get-time'
    }));
}

export const setTime = (req: any, socket: any) => {
    const { time, date } = req.data;
    const roomCode = req.roomCode;
    const clientSockets = getClientSockets(roomCode);
    for (const clientSocket of clientSockets) {
        clientSocket.socket.send(JSON.stringify({
            status: 'success',
            action: 'set-time',
            roomCode: roomCode,
            data: {
                time: time,
                date: date
            }
        }));
    }
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
            path: req.data.path
        }
    }));
}

export const setFilesData = (req: any, socket: any) => {
    const { structure, disks, path } = req.data;
    const roomCode = req.roomCode;
    console.log('SETFILESDATA', roomCode, req)
    const clientSockets = getClientSockets(roomCode);
    for (const clientSocket of clientSockets) {
        clientSocket.socket.send(JSON.stringify({
            action: 'set-files-data',
            roomCode: roomCode,
            data: {
                structure: structure,
                disks: disks,
                path: path
            }
        }));
    }
}